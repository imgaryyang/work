package com.lenovohit.els.web.rest;

import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.InputStream;
import java.io.OutputStream;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Iterator;
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
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.ResourceUtils;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.lenovohit.bdrp.Constants;
import com.lenovohit.bdrp.org.model.Org;
import com.lenovohit.core.exception.BaseException;
import com.lenovohit.core.manager.GenericManager;
import com.lenovohit.core.utils.StringUtils;
import com.lenovohit.core.web.MediaTypes;
import com.lenovohit.core.web.rest.BaseRestController;
import com.lenovohit.core.web.utils.Result;
import com.lenovohit.core.web.utils.ResultUtils;
import com.lenovohit.el.base.utils.excel.PoiWriter;
import com.lenovohit.els.model.PayBatch;
import com.lenovohit.els.model.PayBatchinfo;
import com.lenovohit.els.model.PayPreview;
import com.lenovohit.els.model.PerMng;

@RestController
@RequestMapping("/els/paypreview")
public class PayPreviewRestController extends BaseRestController {
	
	@Autowired
	private GenericManager<PayBatch, String> payBatchManager;
	
	@Autowired
	private GenericManager<PayBatchinfo, String> payBatchinfoManager;
	
	@Autowired
	private GenericManager<PayPreview, String> payPreviewManager;
	
	@Autowired
	private GenericManager<PerMng, String> perMngManager;
	
	/**
	 * ELS_PAY_005 工资发放文件导入预览
	 * 
	 * @param id
	 * @return
	 */
	@RequestMapping(value = "/{batchId}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forPreview(@PathVariable("batchId") String batchId) {
		
		if (StringUtils.isEmpty(batchId)) {
			throw new BaseException("请输入预览批次ID！");
		}
		
		//根据批次id在工资发放预览表中查询数据
		String jql = "from PayPreview where batchId = ? ";
		List<PayPreview> payPreviewList = (List<PayPreview>) payPreviewManager.findByJql(jql, batchId);
		
		return ResultUtils.renderSuccessResult(payPreviewList);
	}
	/**
	 * 删除工资批次明细预览文件
	 * 
	 * @param id
	 * @return
	 */
	@RequestMapping(value = "/{batchId}", method = RequestMethod.DELETE, produces = MediaTypes.JSON_UTF_8)
	public Result deletePreview(@PathVariable("batchId") String batchId) {
		
		if (StringUtils.isEmpty(batchId)) {
			throw new BaseException("请输入预览批次ID！");
		}
		
		String sql = "DELETE FROM ELS_PAY_PREVIEW WHERE BATCH_ID = ? ";
		int count = payPreviewManager.executeSql(sql, batchId);
		
		payBatchManager.delete(batchId);//将批次也删除
		
		log.info("取消导入，删除预览批次明细预览记录：" + count + "条！");
		
		return ResultUtils.renderSuccessResult();
	}
	
	/**
	 * ELS_PAY_006 工资发放文件导入确认
	 * 
	 * @param id
	 * @return
	 */
	@RequestMapping(value = "/confirm/{batchId}", method = RequestMethod.PUT, produces = MediaTypes.JSON_UTF_8)
	public Result forConfirm(@PathVariable("batchId") String batchId) {
		
		if (StringUtils.isEmpty(batchId)) {
			throw new BaseException("请输入预览批次ID！");
		}
		
		//根据批次id在工资发放预览表中查询数据
		String jql = "from PayPreview where batchId = ? ";
		List<PayPreview> payPreviewList = (List<PayPreview>) payPreviewManager.findByJql(jql, batchId);
		
		if(payPreviewList == null || payPreviewList.size() == 0)
			throw new BaseException("不存在该信息！");
		
		try {
			Iterator<PayPreview> it = payPreviewList.iterator();
			
			PayBatch pb  =  payBatchManager.get(batchId);
			
			while(it.hasNext()){
				PayBatchinfo p = new PayBatchinfo(it.next());
				
				pb.setAmount(pb.getAmount().add(p.getAmount()));
				pb.setNum(pb.getNum() + 1);
				
				payBatchinfoManager.save(p);
			}
			
			payBatchManager.save(pb);
			
			String sql = " delete from ELS_PAY_PREVIEW where BATCH_ID = ? ";
			int iCount = payPreviewManager.executeSql(sql, batchId);
			log.info("确认导入，删除批次明细预览记录：" + iCount + "条！");
			
		} catch (Exception e) {
			throw new BaseException("保存失败！");
		}
		
		return ResultUtils.renderSuccessResult();
	}
	
	/**
	 * ELS_PAY_003 下载工资发放导入文件模板
	 * 
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/download", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public void forDownload(HttpServletRequest request,
			HttpServletResponse response){
		
		try {
			byte[] fileNameByte = ("代发导入模板.xls").getBytes("GBK");
			String filename = new String(fileNameByte, "ISO8859-1");
			response.setContentType("application/x-msdownload");
			response.setHeader("Content-Disposition", "attachment;filename="+ filename);
			downloadModel(response.getOutputStream());
			
		} catch (Exception e) {
			e.printStackTrace();
		} 
		
	}
	/**
	 * ELS_PAY_002 导出所选年发放批次列表
	 * 
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/export/{year}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public void forExport(HttpServletRequest request,
			HttpServletResponse response, @PathVariable(value = "year") String year){
		
		String orgId = ((Org) this.getSession().getAttribute(Constants.ORG_KEY)).getId();
		
		if (StringUtils.isEmpty(orgId)){
			throw new BaseException("机构id为空！请重新登录！");
		}
		
		try {
			String jql = "from PayBatch where substring(month,1,4) = ? and orgId = ? order by month asc ";
			List<PayBatch> list = payBatchManager.find(jql, year, orgId);
			byte[] fileNameByte = (year+"年工资批次信息.xls").getBytes("GBK");
			String filename = new String(fileNameByte, "ISO8859-1");
			response.setContentType("application/x-msdownload");
			response.setHeader("Content-Disposition", "attachment;filename="+ filename);
			exportPayBatch(response.getOutputStream(), list, year);
			
		} catch (Exception e) {
			e.printStackTrace();
		} 
	}
	
	/**
	 * ELS_PAY_004 工资发放文件导入
	 */
	@RequestMapping(value = "/payupload", method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result handleFileUpload(@RequestParam("month") String month,
			@RequestParam("note") String note,
			@RequestParam("file") MultipartFile file) {
		
		String name = "";
		
		String orgId = ((Org) this.getSession().getAttribute(Constants.ORG_KEY)).getId();
		
		if (StringUtils.isEmpty(orgId)){
			throw new BaseException("机构id为空！请重新登录！");
		}
		
		PayBatch payBatch  = createBatch(orgId,month,note);
		
		if(null == payBatch){
			throw new BaseException("新建批次错误");
		}
		
		if (!file.isEmpty()) {
			try {
				name = file.getName();
				String msg = importPays(file.getOriginalFilename(), file.getInputStream(), true, payBatch);
				if (!StringUtils.isEmpty(msg)){
					return ResultUtils.renderFailureResult(msg);
				}
				
			}catch (Exception e) {
				throw new BaseException(e.getMessage());
			}
		} else {
			return ResultUtils.renderFailureResult("上传的"+name+"文件为空！");
		}
		
		return ResultUtils.renderSuccessResult(payBatch);
	}
	
	/**
	 * 创建批次
	 */
	private PayBatch createBatch(String orgId, String month, String note) {
		
		if (StringUtils.isEmpty(month)){
			throw new BaseException("请输入年月份！");
		}
		
		//查询批次编号
		String sql = "SELECT MAX(BATCH_NO + 0) FROM ELS_PAY_BATCH WHERE MONTH = ? AND ORG_ID = ? ";
		List<Double> maxBacthNo = (List<Double>) payBatchManager.findBySql(sql, month, orgId);
		
		int bacthNo = 1;//初始化默认批次号
		Double bacthNoDouble = 0.0;
		
		if(maxBacthNo != null && maxBacthNo.size() > 0)
			bacthNoDouble = maxBacthNo.get(0);
		if(null != bacthNoDouble)//判断查询出的最大批次号是否不为空
			bacthNo = (int) (bacthNoDouble+1);
		
		PayBatch payBatch = new PayBatch();
		
		payBatch.setMonth(month);
		payBatch.setOrgId(orgId);
		payBatch.setNote(note);
		payBatch.setState(PayBatch.STATUS_CREATE);
		payBatch.setBatchNo(bacthNo+"");
		payBatch.setAmount(new BigDecimal(0));
		payBatch.setNum(0);
		payBatch.setSuccAmount(new BigDecimal(0));
		payBatch.setSuccNum(0);
		
		try {
			payBatch = payBatchManager.save(payBatch);
		} catch (Exception e) {
			throw new BaseException(e.getMessage());
		}
		
		log.info(payBatch);
		
		return payBatch;
	}
	
	private String importPays(String fileName, InputStream is, boolean isCover, PayBatch payBatch){
		try {
			Workbook workbook = null;
			if(fileName.toLowerCase().endsWith("xls")){    
				workbook = new HSSFWorkbook(is);    
	        }else if(fileName.toLowerCase().endsWith("xlsx")){  
	        	workbook = new XSSFWorkbook(is);
	        }
			// 读取第一章表格内容
			Sheet sheet = workbook.getSheetAt(0);
			// 定义 row、cell
			Row row = null;
			if(sheet.getLastRowNum() < 2){
				return "批次文件行数错误，请重新下载模板！";
			}
			for (int i = 2; i < sheet.getLastRowNum(); i++) {
				row = sheet.getRow(i);
				
				if (row == null) {
					continue;
				}
				
				String msg = importPay(row, payBatch);
				if(!StringUtils.isEmpty(msg)){
					return msg;
				}
			}
			
		} catch (Exception e) {
			e.printStackTrace();
			return "批次文件错误";
		}
		
		return null;
	}
	
	private String importPay(Row row, PayBatch payBatch) throws Exception{
		if (row == null) {
			return "Excel表格列为空！";
		}
		
		PayPreview payPreview = new PayPreview();
		try {
			
			payPreview.setName(this.getCellValue(row, 1).toString());//姓名
			payPreview.setAcctNo(this.getCellValue(row, 2).toString());//卡号
			
			String amonts = this.getCellValue(row, 3).toString();
			BigDecimal amountBigDecimal = BigDecimal.valueOf(Double.valueOf(amonts));
			payPreview.setAmount(amountBigDecimal);//金额
			
			PerMng p = new PerMng();
			p.setAcctNo(payPreview.getAcctNo());
			
			String jql1 = "from PerMng where acctNoEnc = ?";
			List<PerMng> perMngList = perMngManager.find(jql1, p.getAcctNoEnc());
			
			if(null == perMngList || perMngList.size() == 0)
				return "人员卡号信息错误！";
			
			String jql2 = "from PayPreview where acctNo = ? and batchId = ?";
			List<PayPreview> payPreviewList = payPreviewManager.find(jql2, payPreview.getAcctNo(), payBatch.getId());
			
			if(null !=payPreviewList && payPreviewList.size() > 0)
				return "人员发放重复！";
			
			
			PerMng PerMng = perMngList.get(0);//获得人员信息
			
			payPreview.setPerId(PerMng.getId());//员工ID
			payPreview.setMonth(payBatch.getMonth());//年月
			payPreview.setBatchId(payBatch.getId());//批次ID
			payPreview.setBatchNo(payBatch.getBatchNo());//批次号
			
			payPreviewManager.save(payPreview);
			
			log.info("工资批次导入的数据为:"+ payPreview);
		} catch (Exception e) {
			e.printStackTrace();
			return "批次文件错误！";
		}
		
		return null;
	}


	/**
	 * 获取单元格值
	 * @param row 获取的行
	 * @param column 获取单元格列号
	 * @return 单元格值
	 */
	private Object getCellValue(Row row, int column){
		Object val = "";
		try{
			Cell cell = row.getCell(column);
			if (cell != null){
				if (cell.getCellType() == Cell.CELL_TYPE_NUMERIC){
					val = cell.getNumericCellValue();
				}else if (cell.getCellType() == Cell.CELL_TYPE_STRING){
					val = cell.getStringCellValue();
				}else if (cell.getCellType() == Cell.CELL_TYPE_FORMULA){
					val = cell.getCellFormula();
				}else if (cell.getCellType() == Cell.CELL_TYPE_BOOLEAN){
					val = cell.getBooleanCellValue();
				}else if (cell.getCellType() == Cell.CELL_TYPE_ERROR){
					val = cell.getErrorCellValue();
				}
			}
		}catch (Exception e) {
			return val;
		}
		return val;
	}
	
	private void exportPayBatch(OutputStream os, List<?> list,String year) throws Exception{
		BufferedInputStream bis = null;
		BufferedOutputStream bos = null;
		
		try {
			List<Object> headlist = new ArrayList<Object>();
			
			headlist.add("序号");
			headlist.add("年月");
			headlist.add("批次号");
			headlist.add("总人次");
			headlist.add("总金额");
			headlist.add("提交时间");
			headlist.add("发放时间");
			headlist.add("发放状态");
			headlist.add("成功总人次");
			headlist.add("成功总金额");
			headlist.add("备注");
			
			// sheet页
		    int size = headlist.size() - 1;
		    HSSFWorkbook workbook = new HSSFWorkbook();// 生成excel文件
		    HSSFSheet sheet = workbook.createSheet("批次信息");// 创建工作薄(sheet)
		    
		    sheet.setColumnWidth(0, 5*256);
		    sheet.setColumnWidth(1, 7*256);
		    sheet.setColumnWidth(2, 7*256);
		    sheet.setColumnWidth(3, 7*256);
		    sheet.setColumnWidth(4, 10*256);
		    sheet.setColumnWidth(5, 19*256);
		    sheet.setColumnWidth(6, 19*256);
		    sheet.setColumnWidth(7, 9*256);
		    sheet.setColumnWidth(8, 10*256);
		    sheet.setColumnWidth(9, 10*256);
		    sheet.setColumnWidth(10, 20*256);
		  
		    // 表头行
		    HSSFCellStyle titleStyle = PoiWriter.getTitleStyle(workbook);
		    HSSFRow row = sheet.createRow((short) 0);
		    HSSFCell ce = row.createCell(0);
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
		    
		    // 序号样式
		    HSSFCellStyle numStyle = PoiWriter.getContentStyle(workbook);
		    numStyle.setAlignment(HSSFCellStyle.ALIGN_CENTER);
		    
		    // 金额样式
		    HSSFCellStyle amountStyle = PoiWriter.getContentStyle(workbook);
		    amountStyle.setAlignment(HSSFCellStyle.ALIGN_RIGHT);
		    
		    // 备注样式
		    HSSFCellStyle noteStyle = PoiWriter.getContentStyle(workbook);
		    noteStyle.setWrapText(true);
		    noteStyle.setAlignment(HSSFCellStyle.ALIGN_LEFT);
		   
		    // 标题栏
		    HSSFRow colrow = sheet.createRow(1);// 新建第二行
		    for (int i = 0; i < headlist.size(); i++) {
				HSSFCell colcell = colrow.createCell(i);
				colcell.setCellValue((String) headlist.get(i));
				colcell.setCellType(HSSFCell.CELL_TYPE_STRING);
				colcell.setCellStyle(columnStyle);
				Region columnRegion3 = new Region(2, (short) i, 2, (short) i);
				PoiWriter.setRegionStyle(sheet, columnRegion3, columnStyle);
				sheet.addMergedRegion(columnRegion3);
		    }
		    
		    // 内容
		    for (int i = 0; i < list.size(); i++) {
		    	PayBatch payBatch = (PayBatch) list.get(i);
		    	HSSFRow _row = sheet.createRow(i+2);// 新建第三行
		    	
				//序号
				HSSFCell indexcell = _row.createCell(0);
				indexcell.setCellValue(i+1);
				indexcell.setCellStyle(numStyle);
				//年月
		    	HSSFCell month = _row.createCell(1);
		    	month.setCellValue(payBatch.getMonth());
		    	//批次号
		    	HSSFCell batchNo = _row.createCell(2);
		    	batchNo.setCellValue(payBatch.getBatchNo());
		    	//总人次
		    	HSSFCell num = _row.createCell(3);
		    	num.setCellValue(payBatch.getNum());
		    	//总金额
		    	HSSFCell amount = _row.createCell(4);
		    	amount.setCellValue(getAmountString(payBatch.getAmount()));
		    	amount.setCellStyle(amountStyle);
		    	//提交时间
		    	HSSFCell submitTime = _row.createCell(5);
		    	submitTime.setCellValue(payBatch.getSubmitTime());
		    	//发放时间
		    	HSSFCell payTime = _row.createCell(6);
		    	payTime.setCellValue(payBatch.getPayTime());
		    	//发放状态
		    	HSSFCell state = _row.createCell(7);
		    	state.setCellValue(getStateString(payBatch.getState()));
		    	//成功人次
		    	HSSFCell succNum = _row.createCell(8);
		    	succNum.setCellValue(payBatch.getSuccNum());
		    	//成功金额
		    	HSSFCell succAmount = _row.createCell(9);
		    	succAmount.setCellValue(getAmountString(payBatch.getSuccAmount()));
		    	succAmount.setCellStyle(amountStyle);
		    	
		    	//备注
		    	HSSFCell note = _row.createCell(10);
		    	note.setCellValue(payBatch.getNote());
		    	note.setCellStyle(noteStyle);
		    	
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
	private void downloadModel(OutputStream os) throws Exception{
		BufferedInputStream bis = null;
		BufferedOutputStream bos = null;
		
		try {
			List<Object> headlist = new ArrayList<Object>();
			
			headlist.add("序号");
			headlist.add("姓名");
			headlist.add("卡号");
			headlist.add("金额");
			
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
			ce.setCellValue("工资批次信息"); // 表格的第一行第一列显示的数据
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
		
		String text = "关闭";
		
		if(state.equals("0"))
			text = "新建";
		else if(state.equals("1"))
			text = "审核中";
		else if(state.equals("2"))
			text = "发放中";
		else if(state.equals("3"))
			text = "已发放";
		else if(state.equals("4"))
			text = "关闭";
		
		return text;
	}
	
	
	private String getAmountString(BigDecimal amount) {//将金额格式化为x,xxx.xx形式
		String money = "0.00";
		
		if(null != amount && amount.compareTo(new BigDecimal(0)) != 0){
			BigDecimal m  =  amount.multiply(new BigDecimal(100));
			
			String ms = String.valueOf(m);
			int indexEnd = ms.indexOf(".") == -1 ? ms.length() : ms.indexOf(".");
			ms = ms.substring(0,indexEnd);
			
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
