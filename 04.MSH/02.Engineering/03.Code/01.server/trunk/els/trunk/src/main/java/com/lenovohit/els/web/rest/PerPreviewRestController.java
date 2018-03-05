package com.lenovohit.els.web.rest;

import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;

import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.lenovohit.bdrp.Constants;
import com.lenovohit.bdrp.org.model.Org;
import com.lenovohit.core.dao.Page;
import com.lenovohit.core.exception.BaseException;
import com.lenovohit.core.manager.GenericManager;
import com.lenovohit.core.utils.DateUtils;
import com.lenovohit.core.utils.JSONUtils;
import com.lenovohit.core.utils.StringUtils;
import com.lenovohit.core.web.MediaTypes;
import com.lenovohit.core.web.rest.BaseRestController;
import com.lenovohit.core.web.utils.Result;
import com.lenovohit.core.web.utils.ResultUtils;
import com.lenovohit.els.model.PerMng;
import com.lenovohit.els.model.PerPreview;
import com.lenovohit.els.model.StubBatchinfo;
import com.lenovohit.els.model.StubPreview;

@RestController
@RequestMapping("/els/preview")
public class PerPreviewRestController extends BaseRestController {

	@Autowired
	private GenericManager<PerPreview, String> perPreviewManager;
	@Autowired
	private GenericManager<PerMng, String> perMngManager;
	/**
	 * 人员信息导入结果预览接口(ELS_PER_005)
	 * 
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/list/{start}/{pageSize}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forList(@PathVariable(value = "start") int start,
		@PathVariable(value = "pageSize") int pageSize,
		@RequestParam(value = "data", defaultValue = "") String data) {
	try{
		PerPreview tpb = new PerPreview();

		tpb = JSONUtils.deserialize(data, PerPreview.class);
		log.info("查询渠道，输入查询内容为：" + data);
	
		List<String> values = new ArrayList<String>();
	
		Page p = new Page();
		p.setStart(start);
		p.setPageSize(pageSize);
		
		/*次数批次号自动增加规则   预览直接取最大批次*/
		List objBatchNo = perPreviewManager.findBySql(" select CAST(max(distinct batch_no+0) as char)  from  ELS_PER_PREVIEW ");
		int numBatchNo= 0;
		if(objBatchNo.get(0) != null){
		numBatchNo = Integer.valueOf(objBatchNo.get(0).toString());
		}
		String strBatchNo = numBatchNo+"";
		
		//p.setQuery("from PerMng where id = ? and orgId = ? and idNo =? and name = ? and acctNo = ?  and department = ? ");
		String sqlTmp = new String("from PerPreview where 1=1 ");
		//拼接SQL语句
		
		sqlTmp = sqlTmp + " and batchNo = ?";
		values.add(strBatchNo);
		if(tpb!=null){
			if (!StringUtils.isEmpty(tpb.getIdNo())) {
				sqlTmp = sqlTmp + " and idNo = ?";
				values.add(tpb.getIdNo());
			}
			if (!StringUtils.isEmpty(tpb.getName())) {
				values.add(tpb.getName());
				sqlTmp = sqlTmp + " and name = ?";
			}
			if (!StringUtils.isEmpty(tpb.getAcctNo())) {
				values.add(tpb.getAcctNo());
				sqlTmp = sqlTmp + " and acctNo = ?";
			}
			if (!StringUtils.isEmpty(tpb.getDepartment())) {
				values.add(tpb.getDepartment());
				sqlTmp = sqlTmp + " and department = ?";
			}
			if (!StringUtils.isEmpty(tpb.getMobile())) {
				values.add(tpb.getMobile());
				sqlTmp = sqlTmp + " and mobile = ?";
			}
		}
		log.info("查询语句为：" + sqlTmp );
		
		p.setQuery(sqlTmp);
		//p.setQuery("from PayBatchinfo where BatchId = ? ");
		p.setValues(values.toArray());
	
		perPreviewManager.findPage(p);
	
		return ResultUtils.renderSuccessResult(p);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return ResultUtils.renderResult(false, "失败", null);
		
	}

	
	
	/**
	 * 人员信息文件导入ELS_PER_004
	 */
	@RequestMapping(value = "/perupload", method = RequestMethod.POST)
	public @ResponseBody Result handleFileUpload(
			@RequestParam("file") MultipartFile file) {
		String ret = null;
		String errMsg = null;
		if (!file.isEmpty()) {
			try {			
				ret = importPms(file.getOriginalFilename(), file.getInputStream(), true);
				log.info("导入的ret4:"+ ret.substring(0,4));
				log.info("导入的ret:"+ ret);
							
			} catch (Exception e) {				
				throw new BaseException( "导入失败：" + e.getMessage());
			}
		} else {
			throw new BaseException( "导入失败：" + " 文件为空！");			
		}
		if(ret.substring(0,4).equals("导入成功") ){
			return ResultUtils.renderSuccessResult(ret);
		}
		else{
			return ResultUtils.renderResult(false, ret+errMsg, null);
		}

	}

	
	private String importPms(String fileName, InputStream is, boolean isCover){
		String resStr = "";
		String failStr = "";
		Integer sucessCount = 0;
		Integer failCount = 0;
		try {
			Workbook workbook = null;
			if(fileName.toLowerCase().endsWith("xls")){    
				workbook = new HSSFWorkbook(is);    
	        }else if(fileName.toLowerCase().endsWith("xlsx")){  
	        	workbook = new XSSFWorkbook(is);
	        }
			// 读取第一章表格内容
			Sheet sheet = workbook.getSheetAt(0);
			if(!StringUtils.equals(sheet.getSheetName(),"人员信息"))
				throw new BaseException("非人员信息模板!");
			// 定义 row、cell
			Row row = null;
			String result = null;
			/*次数批次号自动增加规则   预览直接取最大批次*/
			List objBatchNo = perPreviewManager.findBySql(" select CAST(max(distinct batch_no+0) as char)  from  ELS_PER_PREVIEW ");
			int numBatchNo = 1;
			if(objBatchNo.get(0) != null){
				numBatchNo = Integer.valueOf(objBatchNo.get(0).toString())+1;
			}
		
			log.info("数据库最大批次号为:"+ objBatchNo);
			log.info("人员批次号为:"+ numBatchNo);
			
			for (int i = 2; i <=sheet.getLastRowNum(); i++) {
				row = sheet.getRow(i);
				if (row == null) {
					continue;
				}
				
				result = this.importPm(row,numBatchNo);
				if ("success".equals(result)) {
					sucessCount++;
				}
				if("fail".equals(result)){
					failCount++;
					failStr += "第【"+ (i + 1) +"】行，";
				}
			}
			
			resStr = "导入成功:成功笔数【"+ sucessCount +"】";
			if(failCount > 0){
				resStr += ",失败【"+ failCount +"】。";
				resStr += "&nbsp<span style='color：red;'>" + failStr.substring(0, failStr.length()-1) +"存在错误！</span>";
			}
		} catch (Exception e) {
			e.printStackTrace();
			throw new BaseException( "导入失败，请核实导入文件格式是否正确！");
		}
		return resStr;
	}
	
	private String importPm(Row row,int numBatchNo) throws Exception{
		if (row == null) {
			return null;
		}
		PerPreview pm = new PerPreview();
		List<PerPreview> values = new ArrayList<PerPreview>();
		try {
			// 假设只有四行
			pm.setIdNo((String)this.getCellValue(row, 1));
			pm.setName((String)this.getCellValue(row, 2));
			pm.setBankNo((String)this.getCellValue(row, 3));
			pm.setBankName((String)this.getCellValue(row, 4));
			pm.setAcctNo((String)this.getCellValue(row, 5));
			pm.setDepartment((String)this.getCellValue(row, 6));
			pm.setMobile((String)this.getCellValue(row, 7));
		
			pm.setBatchNo(numBatchNo +"");
			
			System.out.println(pm.toString());
			this.perPreviewManager.save(pm);
			log.info("导入的数据为:"+ pm);
			return "success";
		} catch (Exception e) {
			e.printStackTrace();
			return "fail";
		}
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
	/**
	 * 人员信息文件导入确认接口(ELS_PER_006)
	 * 
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/importpermng", method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result forCreateList() {
//		if (StringUtils.isEmpty(batchno)) {
//			throw new BaseException("批次ID不可为空！");
//		}

		String orgId = ((Org) this.getSession().getAttribute(Constants.ORG_KEY)).getId();
		String errMsg;
		try {
/*		String tbp = "from PerMng where orgId = ? and idNo = ? ";
		long lCount = this.perMngManager.getCount(tbp, orgid, pm.getIdNo());
		if (lCount > 0) {
			throw new BaseException("该企业已存在该人员！");
		}	*/
		/*取最大批次号*/	
		List objBatchNo = perPreviewManager.findBySql(" select CAST(max(distinct batch_no+0) as char)  from  ELS_PER_PREVIEW ");
		int numBatchNo= 0;
		if(objBatchNo.get(0) != null){
		numBatchNo = Integer.valueOf(objBatchNo.get(0).toString());
		}
		String strBatchNo = numBatchNo+"";
		/*取最大批次号end*/	
		String vldJql = "from PerPreview where batchNo = ? ";

		List<PerPreview> lstout = this.perPreviewManager
				.find(vldJql, strBatchNo);

		for (PerPreview sp : lstout) {
			PerMng sbi = new PerMng(sp);
			vldJql = "from PerMng where orgId = ? and idNoEnc = ? ";
			long lCount = this.perMngManager.getCount(vldJql, orgId, sbi.getIdNoEnc());
			if (lCount > 0) {
				throw new BaseException("存在重复记录:"+sbi.getIdNo());
			}

			sbi.setOrgId(orgId);
     		sbi.setState(PerMng.STATUS_ENABLED);
     		sbi.setEffectiveTime(DateUtils.getCurrentDateStr());
			this.perMngManager.save(sbi);
		}
		return ResultUtils.renderSuccessResult();
	} catch (Exception e) {
		errMsg = e.getMessage();
		
	  }
		return ResultUtils.renderResult(false, errMsg, null);
	}
	
	
}


