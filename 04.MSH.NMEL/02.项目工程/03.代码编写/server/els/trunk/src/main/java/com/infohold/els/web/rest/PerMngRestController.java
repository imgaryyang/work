package com.infohold.els.web.rest;

import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.OutputStream;
import java.util.ArrayList;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.poi.hssf.usermodel.HSSFCell;
import org.apache.poi.hssf.usermodel.HSSFCellStyle;
import org.apache.poi.hssf.usermodel.HSSFDataFormat;
import org.apache.poi.hssf.usermodel.HSSFFont;
import org.apache.poi.hssf.usermodel.HSSFRow;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.hssf.util.Region;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.infohold.bdrp.Constants;
import com.infohold.bdrp.org.model.Org;
import com.infohold.bdrp.tools.security.SecurityUtil;
import com.infohold.bdrp.tools.security.impl.SecurityConstants;
import com.infohold.core.dao.Page;
import com.infohold.core.exception.BaseException;
import com.infohold.core.manager.GenericManager;
import com.infohold.core.utils.DateUtils;
import com.infohold.core.utils.JSONUtils;
import com.infohold.core.utils.StringUtils;
import com.infohold.core.web.MediaTypes;
import com.infohold.core.web.rest.BaseRestController;
import com.infohold.core.web.utils.Result;
import com.infohold.core.web.utils.ResultUtils;
import com.infohold.el.base.utils.excel.PoiWriter;
import com.infohold.els.model.ElsOrg;
import com.infohold.els.model.PerMng;

@RestController
@RequestMapping("/els/permng")
public class PerMngRestController extends BaseRestController {

	@Autowired
	private GenericManager<PerMng, String> perMngManager;
	
	@Autowired
	private GenericManager<ElsOrg, String> elsOrgManager;

	/**
	 * 新增人员接口(ELS_PER_007)
	 * 
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/create", method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result forCreate(@RequestBody String data) {
		String errMsg;
		try {
			log.info("创建人员，输入数据为：【" + data + "】");
			if (StringUtils.isEmpty(data)) {
				throw new BaseException("输入数据为空！");
			}
//			System.out.println(data);
			PerMng pm = JSONUtils.deserialize(data, PerMng.class);
			if (null == pm) {
				throw new BaseException("输入数据为空！");
			
			}

			String orgId = ((Org) this.getSession().getAttribute(Constants.ORG_KEY)).getId();
			pm.setOrgId(orgId);
			
			if (StringUtils.isEmpty(pm.getOrgId())) {
				throw new BaseException("请输入机构号！");
			}
			/*身份证、姓名、卡号为必输项判断*/
			if (StringUtils.isEmpty(pm.getIdNo())) {
				throw new BaseException("请输入人员身份证号！");
			}
			if (StringUtils.isEmpty(pm.getName())) {
				throw new BaseException("请输入人员姓名！");
			}
			if (StringUtils.isEmpty(pm.getAcctNo())) {
				throw new BaseException("请输入人员卡号！");
			}
			
			String vldJql = "from PerMng where orgId = ? and idNoEnc = ? ";
			long lCount = this.perMngManager.getCount(vldJql, pm.getOrgId(), pm.getIdNoEnc());
			if (lCount > 0) {
				throw new BaseException("该企业已存在该人员！");
			}
			
			pm.setEffectiveTime(DateUtils.getCurrentDateStr());
			pm.setState(PerMng.STATUS_ENABLED);

			this.perMngManager.save(pm);

			return ResultUtils.renderSuccessResult(pm);
		} catch (Exception e) {
			e.printStackTrace();
			errMsg = e.getMessage();
			
		}
		return ResultUtils.renderResult(false, errMsg, null);
	}

	/**
	 * 更新人员接口(ELS_PER_007)
	 * 
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/update", method = RequestMethod.PUT, produces = MediaTypes.JSON_UTF_8)
	public Result forUpdate(@RequestBody String data) {
		log.info("更新人员，输入数据为：【" + data + "】");
		if (StringUtils.isEmpty(data)) {
			throw new BaseException("输入数据为空！");
		}

		PerMng pm = JSONUtils.deserialize(data, PerMng.class);
		if (null == pm) {
			throw new BaseException("输入数据为空！");
		}
		String orgId = ((Org) this.getSession().getAttribute(Constants.ORG_KEY)).getId();
		pm.setOrgId(orgId);

		if (StringUtils.isEmpty(pm.getId())) {
			throw new BaseException("人员号不可为空！");
		}
		/*身份证、姓名、卡号为必输项判断*/
		if (StringUtils.isEmpty(pm.getIdNo())) {
			throw new BaseException("请输入人员身份证号！");
		}
		if (StringUtils.isEmpty(pm.getName())) {
			throw new BaseException("请输入人员姓名！");
		}
		if (StringUtils.isEmpty(pm.getAcctNo())) {
			throw new BaseException("请输入人员卡号！");
		}
		PerMng tpm = this.perMngManager.get(pm.getId());
	
		if (tpm == null) {
			throw new BaseException("更新记录不存在！");
		}

		this.perMngManager.save(pm);

		return ResultUtils.renderSuccessResult(pm);
		
	}

	/**
	 * 查询人员列表接口(ELS_PER_001)
	 * 
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/list/{start}/{pageSize}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forList(@PathVariable(value = "start") int start,
		@PathVariable(value = "pageSize") int pageSize,
		@RequestParam(value = "data", defaultValue = "") String data) {
		try{
			log.info("查询人员列表，输入查询内容为：" + data);
			PerMng tpb = JSONUtils.deserialize(data, PerMng.class);

			String orgId = ((Org) this.getSession().getAttribute(Constants.ORG_KEY)).getId();
			if(tpb == null) tpb = new PerMng();
			tpb.setOrgId(orgId);
			
			
			
			StringBuffer jql = new StringBuffer("from PerMng where 1=1 ");
			List<String> values = new ArrayList<String>();
			jql.append(" and state = '1' ");

			if(tpb != null){
				if (!StringUtils.isEmpty(tpb.getOrgId())) {
					jql.append(" and orgId = ?");
					values.add(tpb.getOrgId());
				}
				if (!StringUtils.isEmpty(tpb.getIdNo())) {
					jql.append(" and idNo like ?");
					values.add("%"+tpb.getIdNo()+"%");
				}
				if (!StringUtils.isEmpty(tpb.getName())) {
					jql.append(" and name like ?");
					values.add("%"+tpb.getName()+"%");
				}
				if (!StringUtils.isEmpty(tpb.getAcctNo())) {
					jql.append(" and acctNo like ?");
					values.add("%"+tpb.getAcctNo()+"%");
				}
				if (!StringUtils.isEmpty(tpb.getDepartment())) {
					jql.append(" and department like ?");
					values.add("%"+tpb.getDepartment()+"%");
				}
				if (!StringUtils.isEmpty(tpb.getMobile())) {
					jql.append(" and mobile like ?");
					values.add("%"+tpb.getMobile()+"%");
				}
			}
			
			Page p = new Page();
			p.setStart(start);
			p.setPageSize(pageSize);
			p.setQuery(jql.toString());
			p.setValues(values.toArray());
			perMngManager.findPage(p);
			
			return ResultUtils.renderSuccessResult(p);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return ResultUtils.renderResult(false, "失败", null);
	}


	/**
	 * 人员信息文件导入确认接口(ELS_PER_006)
	 * 
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/createlist", method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result forCreateList(@RequestBody String data) {
		try {
			PerMng pmArray[] = JSONUtils.deserialize(data, PerMng[].class);
			log.info("创建人员，输入数据为：【" + data + "】");
			if (StringUtils.isEmpty(data)) {
				throw new BaseException("输入数据为空！");
			}
			/*改成从数据库表PREVIEW取数据*/
			
			
			int iSize = pmArray.length;
			System.out.println(iSize);
			log.info("人员个数为：【" + iSize + "】");
			
			/*循环插入数据库*/
			for(int i = 0; i<iSize; i++){
				
				PerMng pm = pmArray[i]  ;
				log.info("创建单个人员，输入数据为：【" + pmArray[i] + "】");		
				
				if (null == pm) {
					throw new BaseException("输入数据为空！");
				}
				String orgId = ((Org) this.getSession().getAttribute(Constants.ORG_KEY)).getId();
				pm.setOrgId(orgId);		
				/*身份证、姓名、卡号为必输项判断*/
				if (StringUtils.isEmpty(pm.getIdNo())) {
					throw new BaseException("请输入人员身份证号！");
				}
				if (StringUtils.isEmpty(pm.getName())) {
					throw new BaseException("请输入人员姓名！");
				}
				if (StringUtils.isEmpty(pm.getAcctNo())) {
					throw new BaseException("请输入人员卡号！");
				}
				
				String vldJql = "from PerMng where orgId = ? and idNo = ? ";
				long lCount = this.perMngManager.getCount(vldJql, pm.getOrgId(), pm.getIdNo());
				if (lCount > 0) {
					throw new BaseException("该企业已存在该人员！");
				}
				
				pm.setState(PerMng.STATUS_ENABLED);
				pm.setEffectiveTime(DateUtils.getCurrentDateStr());
		
				this.perMngManager.save(pm);
			}
			return ResultUtils.renderSuccessResult(pmArray);
			
		} catch (Exception e) {
			e.printStackTrace();
		}
		
		return ResultUtils.renderResult(false, "失败", null);
	}
	
	/**
	 * 根据IdNo查询人员
	 * 
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/findByIdNo/{idNo}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forFindPerByIdNo(@PathVariable("idNo") String idNo) {
		
		if (StringUtils.isEmpty(idNo)) {
			throw new BaseException("请输入IdNo！");
		}
		String idNoEnc = SecurityUtil.encryptData(SecurityConstants.DATA_TYPE_ID, Constants.APP_SUPER_ID, idNo, SecurityConstants.KEY_MASTER_KEY_NAME, null).split(SecurityConstants.ARRAY_TOSTRING_SEP)[0];
		
		PerMng model = perMngManager.findOne("from PerMng where  idNoEnc = ? ", idNoEnc);
		
		return ResultUtils.renderSuccessResult(model);
	}
	
	/**
	 *下载人员导入文件模板(ELS_PER_002)
	 * 
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/exporttemplate", method = RequestMethod.GET)
	public void handleFileExportTemplate(HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		try {
			List<PerMng> values = new ArrayList<PerMng>();
			byte[] fileNameByte = ("人员导入模板.xls").getBytes("GBK");
			String filename = new String(fileNameByte, "ISO8859-1");
			response.setContentType("application/x-msdownload");
			response.setHeader("Content-Disposition", "attachment;filename="+ filename);
			exportPms(response.getOutputStream(), values);
			
		} catch (Exception ex) {
			logger.debug(ex.getMessage());
		} 
	}
	/**
	 * 列表数据导出接口(ELS_PER_003)
	 * 
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/export", method = RequestMethod.GET)
	public void handleFileExport(HttpServletRequest request,
			HttpServletResponse response,
			@RequestParam(value = "data", defaultValue = "") String data) throws Exception {
		try {
			PerMng tpb = new PerMng();
			tpb = JSONUtils.deserialize(data, PerMng.class);
			if (StringUtils.isEmpty(tpb.getOrgId())) {
				throw new BaseException("请输入机构号！");
			}
			String orgId = ((Org) this.getSession().getAttribute(Constants.ORG_KEY)).getId();
			tpb.setOrgId(orgId);
			List<PerMng> list =  perMngManager.find(
					" from PerMng where orgId = ? and state='1' ",
					tpb.getOrgId());

			byte[] fileNameByte = ("人员信息表.xls").getBytes("GBK");
			String filename = new String(fileNameByte, "ISO8859-1");
			response.setContentType("application/x-msdownload");
			response.setHeader("Content-Disposition", "attachment;filename="+ filename);
			exportPms(response.getOutputStream(), list);
			
		} catch (Exception ex) {
			logger.debug(ex.getMessage());
		} 
	}
	
	public void exportPms(OutputStream os, List<?> list) throws Exception{
		BufferedInputStream bis = null;
		BufferedOutputStream bos = null;
		try {
			List<Object> headlist = new ArrayList<Object>();
			
			headlist.add("序号");
			headlist.add("身份证号");
			headlist.add("姓名");
			headlist.add("行号");
			headlist.add("行名");
			headlist.add("卡号");
			headlist.add("部门");
			headlist.add("手机号");
			
			// sheet页
		    int size = headlist.size() - 1;
		    HSSFWorkbook workbook = new HSSFWorkbook();// 生成excel文件
		    HSSFSheet sheet = workbook.createSheet("人员信息");// 创建工作薄(sheet)
		    sheet.setDefaultColumnWidth((short) 20);

		    // 列样式
		    HSSFCellStyle columnStyle = PoiWriter.getContentStyle(workbook);
		    HSSFFont columnfont = workbook.createFont();
		    columnfont.setBoldweight(HSSFFont.BOLDWEIGHT_BOLD);
		    columnStyle.setFont(columnfont);
		    HSSFCellStyle TextStyle = workbook.createCellStyle();
	        HSSFDataFormat format = workbook.createDataFormat();
	        TextStyle.setDataFormat(format.getFormat("@"));
	        TextStyle.setBorderBottom(HSSFCellStyle.BORDER_THIN);
	        for (int i = 1; i < headlist.size(); i++) {
			    sheet.setDefaultColumnStyle(i, TextStyle);
			    sheet.setColumnWidth(i, 6000);
		    }
	        HSSFCellStyle TextStyle1 = workbook.createCellStyle();
	        TextStyle1.setBorderBottom(HSSFCellStyle.BORDER_THIN);
	        sheet.setDefaultColumnStyle(0, TextStyle1);
		    sheet.setColumnWidth(0, 3000);
		    // 表头行
		    HSSFCellStyle titleStyle = PoiWriter.getTitleStyle(workbook);
		    HSSFRow row = sheet.createRow((short) 0);
		    HSSFCell ce = row.createCell(0);
		    ce.setCellType(HSSFCell.CELL_TYPE_STRING);
		    ce.setCellValue("人员信息列表"); // 表格的第一行第一列显示的数据
		    ce.setCellStyle(titleStyle);
		    Region region = new Region(0, (short) 0, 0, (short) size);
		    PoiWriter.setRegionStyle(sheet, region, titleStyle);
		    sheet.addMergedRegion(region);
		    
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
		    	PerMng pm = (PerMng) list.get(i);
		    	HSSFRow _row = sheet.createRow(i+2);// 新建第三行
		    	
				//序号
				HSSFCell indexcell = _row.createCell(0);
				indexcell.setCellValue(i+1);					
				//身份证号
		    	HSSFCell perIdNo = _row.createCell(1);
		    	perIdNo.setCellValue(pm.getIdNo());
		    	//姓名
		    	HSSFCell perName = _row.createCell(2);
		    	perName.setCellValue(pm.getName());
		    	//行号
		    	HSSFCell perBankNo = _row.createCell(3);
		    	perBankNo.setCellValue(pm.getBankNo());
		    	//行号
		    	HSSFCell perBankName = _row.createCell(4);
		    	perBankName.setCellValue(pm.getBankName());
		    	//卡号
		    	HSSFCell perAcctNo = _row.createCell(5);
		    	perAcctNo.setCellValue(pm.getAcctNo());
		    	//部门
		    	HSSFCell perDepartment = _row.createCell(6);
		    	perDepartment.setCellValue(pm.getDepartment());
		    	//手机号
		    	HSSFCell perMobile = _row.createCell(7);
		    	perMobile.setCellValue(pm.getMobile());
		    	
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
}
