package com.infohold.els.web.rest;

import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.poi.hssf.usermodel.HSSFCell;
import org.apache.poi.hssf.usermodel.HSSFCellStyle;
import org.apache.poi.hssf.usermodel.HSSFFont;
import org.apache.poi.hssf.usermodel.HSSFRow;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.hssf.util.Region;
import org.apache.poi.ss.usermodel.Row;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.infohold.bdrp.Constants;
import com.infohold.bdrp.org.model.Org;
import com.infohold.bdrp.tools.security.SecurityUtil;
import com.infohold.bdrp.tools.security.impl.SecurityConstants;
import com.infohold.core.exception.BaseException;
import com.infohold.core.manager.GenericManager;
import com.infohold.core.utils.DateUtils;
import com.infohold.core.utils.JSONUtils;
import com.infohold.core.utils.StringUtils;
import com.infohold.core.web.MediaTypes;
import com.infohold.core.web.rest.BaseRestController;
import com.infohold.core.web.utils.Result;
import com.infohold.core.web.utils.ResultUtils;
import com.infohold.el.base.model.Notice;
import com.infohold.el.base.model.User;
import com.infohold.el.base.service.NoticeService;
import com.infohold.el.base.utils.excel.PoiCallback;
import com.infohold.el.base.utils.excel.PoiReader;
import com.infohold.el.base.utils.excel.PoiWriter;
import com.infohold.els.model.PerMng;
import com.infohold.els.model.StubBatch;
import com.infohold.els.model.StubBatchinfo;
import com.infohold.els.model.StubPreview;
import com.infohold.els.model.StubTemplateinfo;

@RestController
@RequestMapping("/els/stubbatch")
public class StubBatchRestController extends BaseRestController {
	
	@Autowired
	private GenericManager<StubBatch, String> stubBatchManager;
	@Autowired
	private GenericManager<StubBatchinfo, String> stubBatchinfoManager;
	@Autowired
	private GenericManager<StubPreview, String> stubPreviewManager;
	@Autowired
	private GenericManager<PerMng, String> perMngManager;
	@Autowired
	private GenericManager<StubTemplateinfo, String> stubTemplateinfoManager;
	@Autowired
	private GenericManager<User, String> userManager;
	@Autowired
	private GenericManager<Notice, String> noticeManager;
	@Autowired
	private NoticeService noticeService;
	
	/**
	 * 5.3.8	新增工资明细批次【ELS_STUB_008】
	 * 
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/create", method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result forCreate(@RequestBody String data) {
		log.info("新增工资批次，输入数据为：【" + data + "】");
		if (StringUtils.isEmpty(data)) {
			throw new BaseException("输入数据为空！");
		}
	
		StubBatch in = JSONUtils.deserialize(data, StubBatch.class);
		if (null == in) {
			throw new BaseException("输入数据为空！");
		}
	
		String orgId = ((Org) this.getSession().getAttribute(Constants.ORG_KEY)).getId();
		in.setOrgId(orgId);
		
		in.setBatchNo( genBatchNo(in.getMonth(),in.getOrgId()));
		in.setState(StubBatch.STATUS_NOTYET);
		in.setAmount(new BigDecimal(0));
		in.setNum(0);
		
		in = this.stubBatchManager.save(in);
	
		return ResultUtils.renderSuccessResult(in);
	}

	/**
	 * 5.3.4	提交工资批次【ELS_STUB_004】
	 * 
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/update", method = RequestMethod.PUT, produces = MediaTypes.JSON_UTF_8)
	public Result forUpdate(@RequestBody String data) {
		log.info("保存/提交批次，输入数据为：【" + data + "】");
		if (StringUtils.isEmpty(data)) {
			throw new BaseException("输入数据为空！");
		}

		StubBatch tin = JSONUtils.deserialize(data, StubBatch.class);
		if (null == tin) {
			throw new BaseException("输入数据为空！");
		}
		String orgId = ((Org) this.getSession().getAttribute(Constants.ORG_KEY)).getId();
		tin.setOrgId(orgId);
		
		if (!StubBatch.hasStatus(tin.getState())) {
			throw new BaseException("状态值不存在！");
		}
		
		log.info("tin.getId"+tin.getTemplateId());
		//计算总金额,总人次
		String vldJql = "from StubBatchinfo where batchId = ?";
		List<StubBatchinfo> lsout= this.stubBatchinfoManager.find(vldJql, tin.getId());
		float sumAmount=(float) 0.00;
		int seqNo = getPayItemSeqnoByTemplate(tin.getTemplateId());
		if( seqNo < 0 ) throw new BaseException("获取实发工资序号失败!");
		for( StubBatchinfo item:lsout ){
			try {
				sumAmount += Float.parseFloat(StubBatchinfo.class.getMethod("getItem"+seqNo).invoke(item).toString());
			} catch (Exception e) {
				e.printStackTrace();
			}
		}
		
		tin.setAmount(BigDecimal.valueOf(sumAmount));
		tin.setNum(lsout.size());
		if( StringUtils.equals(tin.getState(), "1") ) {
			tin.setSubmitTime(DateUtils.getCurrentDateTimeStr());
			sendStubMsg(tin.getId());
		}
		
		this.stubBatchManager.save(tin);
		
		return ResultUtils.renderSuccessResult(tin);
	}
	/**
	 * 5.3.3	删除工资批次【ELS_STUB_003】
	 * 
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/{id}", method = RequestMethod.DELETE, produces = MediaTypes.JSON_UTF_8)
	public Result forDelete(@PathVariable("id") String id) {
		log.info("删除工资批次，输入数据为：" + id);

		if (StringUtils.isEmpty(id)) {
			throw new BaseException("批次ID不可为空！");
		}

		StubBatch tin = this.stubBatchManager.get(id);
		if (null == tin) {
			throw new BaseException("删除批次不存在！");
		}

		String vldJql = "delete from ELS_STUB_BATCHINFO where batch_Id=?";
		this.stubBatchinfoManager.executeSql(vldJql, id);
			
		this.stubBatchManager.delete(id);

		return ResultUtils.renderSuccessResult();
	}
	
	/**
	 * ELS_STUB_001	查询工资批次列表
	 * ELS_STUB_009	查询工资明细批次信息
	 * ELS_STUB_002	导出所选年工资批次列表
	 * 
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/list", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forList(@RequestParam(value="year") String year ) {
		log.info("根据年份查询工资批次列表，输入年为：【" + year + "】");

		String orgId = ((Org) this.getSession().getAttribute(Constants.ORG_KEY)).getId();
		if (StringUtils.isEmpty(orgId)) {
			throw new BaseException("机构号不可为空！");
		}

		if (StringUtils.isEmpty(year)) {
			throw new BaseException("年份不可为空！");
		}

		String vldJql = "from StubBatch where month like ? and orgId = ? order by month desc,batchNo+0 desc";
		
		List<StubBatch> lstout = this.stubBatchManager.find(vldJql, year + "%", orgId);
		
		return ResultUtils.renderSuccessResult(lstout);
	}
	

	/**
	 * ELS_STUB_005	工资明细文件导入
	 * 
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/import", method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result forStubFileImport(
			@RequestParam("note") String note,
			@RequestParam("month") String month,
			@RequestParam("templateId") String templateId,
			@RequestParam("template") String template,
			@RequestParam("file") MultipartFile file) {

		String orgId = ((Org) this.getSession().getAttribute(Constants.ORG_KEY)).getId();
		log.info("工资明细文件导入，输入参数：【" + orgId + month + "】");
		
		//新增批次
		StubBatch in = new StubBatch();

		in.setBatchNo( genBatchNo(month, orgId) );
		in.setState(StubBatch.STATUS_NOTYET);
		in.setOrgId(orgId);
		in.setTemplateId(templateId);
		in.setTemplate(template);
		in.setMonth(month);
		in.setNote(note);
		in = this.stubBatchManager.save(in);

		//读取文件
		if (file.isEmpty()){
			this.stubBatchManager.delete(in.getId());
			throw new BaseException("输入数据为空！");
		}
		try {
			PoiReader pr = new PoiReader();

			//验证templateId是否相符
			if( !pr.checkData(file.getOriginalFilename(), file.getInputStream(), 1, in.getTemplateId()) ){
				this.stubBatchManager.delete(in.getId());
				throw new BaseException("导入文件模板ID不符！");
			}
			pr.setCallback(new PoiCallback(){
				@Override
				public boolean HandleDataRow(Row row, Object obj)throws Exception{
					if (row == null) {
						return false;
					}
					StubPreview model = new StubPreview();
					StubBatch in = (StubBatch)obj;
					try {
						PoiReader pr = new PoiReader();
						model.setBatchId(in.getId());
						model.setBatchNo(in.getBatchNo());
						model.setMonth(in.getMonth());
						model.setTemplateId(in.getTemplateId());
						model.setTemplate(in.getTemplate());
						
						model.setName(pr.getCellValue(row, 2).toString());
						model.setIdNo(pr.getCellValue(row, 1).toString());
						model.setNote(pr.getCellValue(row, 3).toString());
						String idNoEnc = SecurityUtil.encryptData(SecurityConstants.DATA_TYPE_ID, Constants.APP_SUPER_ID, model.getIdNo(), SecurityConstants.KEY_MASTER_KEY_NAME, null).split(SecurityConstants.ARRAY_TOSTRING_SEP)[0];
						
						PerMng pm = perMngManager.findOne("from PerMng where idNoEnc=? and name=?", idNoEnc,model.getName());
						if(pm==null)
							throw new BaseException("人员表不存在该人员<"+model.getName()+"-"+model.getIdNo()+">！");
						model.setPerId(pm.getId());
						
						//30个工资项
						model.setItem1	(pr.getCellValue(row, 4	).toString());
						model.setItem2	(pr.getCellValue(row, 5	).toString());
						model.setItem3	(pr.getCellValue(row, 6	).toString());
						model.setItem4	(pr.getCellValue(row, 7	).toString());
						model.setItem5	(pr.getCellValue(row, 8	).toString());
						model.setItem6	(pr.getCellValue(row, 9	).toString());
						model.setItem7	(pr.getCellValue(row, 10	).toString());
						model.setItem8	(pr.getCellValue(row, 11	).toString());
						model.setItem9	(pr.getCellValue(row, 12	).toString());
						model.setItem10	(pr.getCellValue(row, 13	).toString());
						model.setItem11	(pr.getCellValue(row, 14	).toString());
						model.setItem12	(pr.getCellValue(row, 15	).toString());
						model.setItem13	(pr.getCellValue(row, 16	).toString());
						model.setItem14	(pr.getCellValue(row, 17	).toString());
						model.setItem15	(pr.getCellValue(row, 18	).toString());
						model.setItem16	(pr.getCellValue(row, 19	).toString());
						model.setItem17	(pr.getCellValue(row, 20	).toString());
						model.setItem18	(pr.getCellValue(row, 21	).toString());
						model.setItem19	(pr.getCellValue(row, 22	).toString());
						model.setItem20	(pr.getCellValue(row, 23	).toString());
						model.setItem21	(pr.getCellValue(row, 24	).toString());
						model.setItem22	(pr.getCellValue(row, 25	).toString());
						model.setItem23	(pr.getCellValue(row, 26	).toString());
						model.setItem24	(pr.getCellValue(row, 27	).toString());
						model.setItem25	(pr.getCellValue(row, 28	).toString());
						model.setItem26	(pr.getCellValue(row, 29	).toString());
						model.setItem27	(pr.getCellValue(row, 30	).toString());
						model.setItem28	(pr.getCellValue(row, 31	).toString());
						model.setItem29	(pr.getCellValue(row, 32	).toString());
						model.setItem30	(pr.getCellValue(row, 33	).toString());

						stubPreviewManager.save(model);
						System.out.println(model.toString());
						return true;
					} catch (Exception e) {
						e.printStackTrace();
					}
					return false;
				}
			});
			String ret = pr.importFile(file.getOriginalFilename(), file.getInputStream(), true, in);
			log.info(ret);
		} catch (IOException e) {
			e.printStackTrace();
		}
		
		return ResultUtils.renderSuccessResult(in);
	}
	@RequestMapping(value = "/export/{orgId}/{year}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forStubFileExport(HttpServletRequest request,
			HttpServletResponse response,
			@PathVariable("year") String year) {

		String orgId = ((Org) this.getSession().getAttribute(Constants.ORG_KEY)).getId();
		if (StringUtils.isEmpty(orgId)) {
			throw new BaseException("组织ID为空！");
		}
		
		if (StringUtils.isEmpty(year)) {
			throw new BaseException("导出年份为空！");
		}
		
		try {
			String jql = "from StubBatch where substring(month,1,4) = ? and orgId = ? order by month asc ";
			List<StubBatch> list = stubBatchManager.find(jql, year, orgId);
			byte[] fileNameByte = (year+"年工资批次信息.xls").getBytes("GBK");
			String filename = new String(fileNameByte, "ISO8859-1");
			response.setContentType("application/x-msdownload");
			response.setHeader("Content-Disposition", "attachment;filename="+ filename);
			exportStubBatch(response.getOutputStream(), list, year);
			
		} catch (Exception e) {
			e.printStackTrace();
		} 
		
		return ResultUtils.renderSuccessResult();
	}
	
	@SuppressWarnings("unchecked")
	private String genBatchNo(String month, String orgId){
		//查询批次编号
		String sql = "SELECT MAX(BATCH_NO + 0) FROM ELS_STUB_BATCH WHERE MONTH = ? AND ORG_ID = ? ";
		List<Double> maxBacthNo = (List<Double>) stubBatchManager.findBySql(sql, month, orgId);
		
		int batchNo = 1;//初始化默认批次号
		Double bacthNoDouble = 0.0;
		
		if(maxBacthNo != null && maxBacthNo.size() > 0){
			log.info(maxBacthNo.get(0));
			bacthNoDouble = maxBacthNo.get(0)==null?0:maxBacthNo.get(0);
		}
		batchNo = (int) (bacthNoDouble+1);
	
		return batchNo+"";
	}

	private int getPayItemSeqnoByTemplate(String id) {
		int seqNo=-1;
		String vldJql = "from StubTemplateinfo where templateId = ? order by seqNo desc";
		List<StubTemplateinfo> out = this.stubTemplateinfoManager.find(vldJql, id);
		if(out.size()>0)
			seqNo = out.get(0).getSeqNo();
		log.info("seqno:"+seqNo);
		return seqNo;
	}

	private void sendStubMsg(String batchId) {
		
		try {
			String hql = "from StubBatchinfo where batchId = ?";
			List<StubBatchinfo> lsbi = this.stubBatchinfoManager.find(hql, batchId);
			if(lsbi.size() == 0) return;
			log.info("发送工资条消息:"+batchId);
			
			Notice notice = null; 
			for( StubBatchinfo sbi : lsbi ){
				User user = this.userManager.findOne("from User where idCardNo = ?", sbi.getIdNo());
				if( user == null )
					break;
				
				notice = new Notice();
				notice.setMode(Notice.NOT_MODE_APP);
				notice.setType(Notice.NOT_TYPE_APP_SAL);
				notice.setApps("8a8c7db154ebe90c0154ebfdd1270004");
				notice.setReceiverType("1");
				notice.setReceiverValue(user.getId());
				notice.setTitle(sbi.getMonth().substring(4)+"月工资条");
				notice.setContent(sbi.getMonth().substring(0,3)+"年"+sbi.getMonth().substring(4)+"月工资条发放了。");
				notice.setTarget(sbi.getId());
				notice.setState(Notice.NOT_STATUE_SENT);
				notice.setCreatedAt(DateUtils.getCurrentDateTimeStr());
				notice = this.noticeManager.save(notice);
				
				noticeService.send(notice);
			}
		} catch(Exception e) {
			e.printStackTrace();
		}
	}

	@SuppressWarnings("deprecation")
	private void exportStubBatch(OutputStream os, List<StubBatch> list,String year) throws Exception{
		BufferedInputStream bis = null;
		BufferedOutputStream bos = null;
		try {
			List<Object> headlist = new ArrayList<Object>();
			
			headlist.add("序号");
			headlist.add("年月");
			headlist.add("批次号");
			headlist.add("总人次");
			headlist.add("实发总金额");
			headlist.add("提交时间");
			headlist.add("模板");
			headlist.add("备注");
			headlist.add("状态");
			
			// sheet页
		    int size = headlist.size() - 1;
		    HSSFWorkbook workbook = new HSSFWorkbook();// 生成excel文件
		    HSSFSheet sheet = workbook.createSheet("批次信息");// 创建工作薄(sheet)
		    sheet.setDefaultColumnWidth((short) 20);
		  
		    // 表头行
		    HSSFCellStyle titleStyle = PoiWriter.getTitleStyle(workbook);
		    HSSFRow row = sheet.createRow((short) 0);
		    HSSFCell ce = row.createCell((short) 0);
		    ce.setCellType(HSSFCell.CELL_TYPE_STRING);
		    ce.setCellValue(year+"年工资批次信息列表"); // 表格的第一行第一列显示的数据
		    ce.setCellStyle(titleStyle);
		    Region region = new Region(0, (short) 0, 0, (short) size);
		    PoiWriter.setRegionStyle(sheet, region, titleStyle);
		    sheet.addMergedRegion(region);
	
		    // 列样式
		    HSSFCellStyle columnStyle = PoiWriter.getContentStyle(workbook);
		    HSSFFont columnfont = workbook.createFont();
		    columnfont.setBoldweight(HSSFFont.BOLDWEIGHT_BOLD);
		    columnStyle.setFont(columnfont);
		   
		    // 标题栏
		    HSSFRow colrow = sheet.createRow(1);// 新建第二行
		    for (int i = 0; i < headlist.size(); i++) {
				HSSFCell colcell = colrow.createCell((short) i);
				colcell.setCellValue((String) headlist.get(i));
				colcell.setCellType(HSSFCell.CELL_TYPE_STRING);
				colcell.setCellStyle(columnStyle);
				Region columnRegion3 = new Region(2, (short) i, 2, (short) i);
				PoiWriter.setRegionStyle(sheet, columnRegion3, columnStyle);
				sheet.addMergedRegion(columnRegion3);
		    }
		    
		    // 内容
		    for (int i = 0; i < list.size(); i++) {
		    	StubBatch stubBatch = list.get(i);
		    	HSSFRow _row = sheet.createRow(i+2);// 新建第三行
		    	
				//序号
				HSSFCell indexcell = _row.createCell(0);
				indexcell.setCellValue(i+1);					
				//年月
		    	HSSFCell month = _row.createCell(1);
		    	month.setCellValue(stubBatch.getMonth());
		    	//批次号
		    	HSSFCell batchNo = _row.createCell(2);
		    	batchNo.setCellValue(stubBatch.getBatchNo());
		    	//总人次
		    	HSSFCell num = _row.createCell(3);
		    	num.setCellValue(stubBatch.getNum());
		    	//实发总金额
		    	HSSFCell amount = _row.createCell(4);
		    	amount.setCellValue(getAmountString(stubBatch.getAmount()));
		    	//提交时间
		    	HSSFCell submitTime = _row.createCell(5);
		    	submitTime.setCellValue(stubBatch.getSubmitTime());
		    	//模板
		    	HSSFCell template = _row.createCell(6);
		    	template.setCellValue(stubBatch.getTemplate());
		    	//备注
		    	HSSFCell note = _row.createCell(7);
		    	note.setCellValue(stubBatch.getNote());
		    	//状态
		    	HSSFCell state = _row.createCell(8);
		    	state.setCellValue(getStateString(stubBatch.getState()));
		    	
		    }
		    bos = new BufferedOutputStream(os);
		    workbook.write(bos);
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
		    if (bis != null) {
			    bis.close();
			}
		    if (bos != null) {
			    bos.close();
		    }
		}
	}
	
	private String getStateString(String state) {
		
		String text = "待发放";
		
		if(state.equals("1"))
			text = "已发放";
		
		return text;
	}
	
	private String getAmountString(BigDecimal amount) {//将金额格式化为x,xxx.xx形式
		String money = "0.00";
		
		if(null != amount && !amount.equals(0F)){
			BigDecimal m  =  amount.multiply(new BigDecimal(100));
			String ms = String.valueOf(m);
			char ma[] = ms.toCharArray();
			int mal = ma.length;
			int start = (mal-2) % 3;
			
			money = "";
			
			if(start == 0){
				for(int i = 0;i < 3;i++){
					money += ma[i];
				}
				start = 3;
			}else{
				for(int i = 0;i < start;i++){
					money += ma[i];
				}
			}
			
			for(int i = start;i < mal-2;){
				money = money + "," + ma[i] + ma[i+1] + ma[i+2];
				i += 3;
			}
			
			money = money + "." + ma[mal-2] + ma[mal-1];
		}
		return money;
	}
}
