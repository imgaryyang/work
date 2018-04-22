package com.lenovohit.ssm.payment.web.rest;

import java.io.FileNotFoundException;
import java.io.InputStream;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import org.apache.poi.xssf.usermodel.XSSFCell;
import org.apache.poi.xssf.usermodel.XSSFRow;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.lenovohit.core.dao.Page;
import com.lenovohit.core.exception.BaseException;
import com.lenovohit.core.manager.impl.GenericManagerImpl;
import com.lenovohit.core.utils.DateUtils;
import com.lenovohit.core.utils.JSONUtils;
import com.lenovohit.core.utils.SpringUtils;
import com.lenovohit.core.utils.StringUtils;
import com.lenovohit.core.web.MediaTypes;
import com.lenovohit.core.web.utils.Result;
import com.lenovohit.core.web.utils.ResultUtils;
import com.lenovohit.ssm.base.web.rest.SSMBaseRestController;
import com.lenovohit.ssm.payment.manager.PayBaseManager;
import com.lenovohit.ssm.payment.model.CheckDetailBank;
import com.lenovohit.ssm.payment.model.CheckDetailResult;
import com.lenovohit.ssm.payment.model.CheckRecord;
import com.lenovohit.ssm.payment.model.PayChannel;

@RestController
@RequestMapping("/ssm/payment/check")
public class CheckRecordRestController extends SSMBaseRestController {
	@Autowired
	private GenericManagerImpl<CheckRecord,String> checkRecordManager;
	@Autowired
	private GenericManagerImpl<CheckDetailBank,String> checkDetailBankManager;
	@Autowired
	private GenericManagerImpl<CheckDetailResult,String> checkDetailResultManager;
	@Autowired
	private GenericManagerImpl<PayChannel,String> payChannelManager;
	
	@RequestMapping(value = "/page/{start}/{limit}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forPage(@PathVariable("start") String start, @PathVariable("limit") String limit,
			@RequestParam(value = "data", defaultValue = "")String data){
		
		CheckRecord query =  JSONUtils.deserialize(data, CheckRecord.class);
		StringBuilder jql = new StringBuilder(" from CheckRecord where 1=1 ");
		List<Object> values = new ArrayList<Object>();
		
		if(!StringUtils.isEmpty(query.getChkDate())){
			jql.append(" and chkDate = ? ");
			values.add(query.getChkDate());
		}
		if(!StringUtils.isEmpty(query.getChkType())){
			jql.append(" and chkType = ? ");
			values.add(query.getChkType());
		}
		if(!StringUtils.isEmpty(query.getOptType())){
			jql.append(" and optType = ? ");
			values.add(query.getOptType());
		}
		if(!StringUtils.isEmpty(query.getStatus())){
			jql.append(" and status = ? ");
			values.add(query.getStatus());
		}
		if(query.getPayChannel()!=null && !StringUtils.isEmpty(query.getPayChannel().getId())){
			jql.append(" and payChannel.id = ? ");
			values.add(query.getPayChannel().getId());
		}
		
		jql.append(" order by chkDate desc ");
		
		Page page = new Page();
		page.setStart(start);
		page.setPageSize(limit);
		page.setQuery(jql.toString());
		page.setValues(values.toArray());
		checkRecordManager.findPage(page);
		
		return ResultUtils.renderPageResult(page);
	}
	
	@RequestMapping(value = "/detail/page/{start}/{limit}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forDetailPage(@PathVariable("start") String start, @PathVariable("limit") String limit,
			@RequestParam(value = "data", defaultValue = "")String data){
		
		CheckDetailResult query =  JSONUtils.deserialize(data, CheckDetailResult.class);
		StringBuilder jql = new StringBuilder(" from CheckDetailResult where 1=1 ");
		List<Object> values = new ArrayList<Object>();
		
		if(!StringUtils.isEmpty(query.getCheckRecord())){
			jql.append(" and checkRecord = ? ");
			values.add(query.getCheckRecord());
		}
		if(!StringUtils.isEmpty(query.getTradeNo())){
			jql.append(" and tradeNo = ? ");
			values.add(query.getTradeNo());
		}
		if(!StringUtils.isEmpty(query.getSsmNo())){
			jql.append(" and ssmNo = ? ");
			values.add(query.getSsmNo());
		}
		if(!StringUtils.isEmpty(query.getHisNo())){
			jql.append(" and hisNo = ? ");
			values.add(query.getHisNo());
		}
		if(!StringUtils.isEmpty(query.getAccount())){
			jql.append(" and account like ? ");
			values.add("%" +query.getAccount()+ "%");
		}
		if(!StringUtils.isEmpty(query.getAmt()) && query.getAmt().compareTo(new BigDecimal("0.0")) == 1){
			jql.append(" and amt = ? ");
			values.add(query.getAmt());
		}
		if(!StringUtils.isEmpty(query.getTradeType())){
			jql.append(" and tradeType = ? ");
			values.add(query.getTradeType());
		}
		if(!StringUtils.isEmpty(query.getHisCheckStatus())){
			jql.append(" and hisCheckStatus = ? ");
			values.add(query.getHisCheckStatus());
		}
		
		jql.append(" order by tradeTime desc ");
		
		Page page = new Page();
		page.setStart(start);
		page.setPageSize(limit);
		page.setQuery(jql.toString());
		page.setValues(values.toArray());
		checkDetailResultManager.findPage(page);
		
		return ResultUtils.renderPageResult(page);
	}
	
	@RequestMapping(value = "/list", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forList(@RequestParam(value = "data", defaultValue = "") String data) {
		List<CheckRecord> checkRecords = checkRecordManager.find(" from CheckRecord checkRecord  ");
		return ResultUtils.renderSuccessResult(checkRecords);
	}
	@RequestMapping(value="/create",method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8/*TEXT_PLAIN_UTF_8*/)
	public Result forCreate(@RequestBody String data){
		CheckRecord checkRecord =  JSONUtils.deserialize(data, CheckRecord.class);
		CheckRecord saved = this.checkRecordManager.save(checkRecord);
		return ResultUtils.renderSuccessResult(saved);
	}
	@RequestMapping(value="/update",method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8/*TEXT_PLAIN_UTF_8*/)
	public Result forUpdate(@RequestBody String data){
		CheckRecord org =  JSONUtils.deserialize(data, CheckRecord.class);
		CheckRecord saved = this.checkRecordManager.save(org);
		return ResultUtils.renderSuccessResult(saved);
	}
	@RequestMapping(value = "/remove/{id}",method = RequestMethod.DELETE, produces = MediaTypes.JSON_UTF_8)
	public Result forDelete(@PathVariable("id") String id){
		try {
			this.checkRecordManager.delete(id);
		} catch (Exception e) {
			throw new BaseException("删除失败");
		}
		return ResultUtils.renderSuccessResult();
	}
	
	@SuppressWarnings("rawtypes")
	@RequestMapping(value = "/removeAll",method = RequestMethod.DELETE, produces = MediaTypes.JSON_UTF_8)
	public Result forDeleteAll(@RequestBody String data){
		List ids =  JSONUtils.deserialize(data, List.class);
		StringBuilder idSql = new StringBuilder();
		List<String> idvalues = new ArrayList<String>();
		try {
			idSql.append("DELETE FROM SSM_CHECK_RECORD  WHERE ID IN (");
			for(int i = 0 ; i < ids.size() ; i++) {
				idSql.append("?");
				idvalues.add(ids.get(i).toString());
				if(i != ids.size() - 1) idSql.append(",");
			}
			idSql.append(")");
			this.checkRecordManager.executeSql(idSql.toString(), idvalues.toArray());
		} catch (Exception e) {
			e.printStackTrace();
			throw new BaseException("删除失败");
		}
		return ResultUtils.renderSuccessResult();
	}
	
	@RequestMapping(value="/handleSync",method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result forHandleSync(@RequestBody String data){
		CheckRecord checkRecord =  JSONUtils.deserialize(data, CheckRecord.class);
		if(checkRecord == null || StringUtils.isBlank(checkRecord.getId())){
			return ResultUtils.renderFailureResult("对账记录为空");
		}
		checkRecord = this.checkRecordManager.get(checkRecord.getId());
		
		String payChannel = checkRecord.getPayChannel().getCode();
		PayBaseManager payBaseManager = null;
		switch (payChannel) {
        case "9999":
        	payBaseManager = (PayBaseManager)SpringUtils.getBean("alipayManager");
            break;
        case "9998":
        	payBaseManager = (PayBaseManager)SpringUtils.getBean("wxpayManager");
            break;
        case "0308":
        	if(StringUtils.equals(checkRecord.getChkType(), CheckRecord.CHK_TYPE_REFUND)
    				|| StringUtils.equals(checkRecord.getChkType(), CheckRecord.CHK_TYPE_RETURN))
    			payBaseManager = (PayBaseManager)SpringUtils.getBean("cmbPayManager");
    		else 
    			payBaseManager = (PayBaseManager)SpringUtils.getBean("unionPayManager");
        	break;
        case "0000":
        	payBaseManager = (PayBaseManager)SpringUtils.getBean("cashManager");
            break;
        default : 
        	if(StringUtils.equals(checkRecord.getChkType(), CheckRecord.CHK_TYPE_REFUND)
    				|| StringUtils.equals(checkRecord.getChkType(), CheckRecord.CHK_TYPE_RETURN))
    			payBaseManager = (PayBaseManager)SpringUtils.getBean("bankPayManager");
    		else 
    			payBaseManager = (PayBaseManager)SpringUtils.getBean("unionPayManager");
            break;
		}
		checkRecord.setOptType(CheckRecord.CHK_OPTTYPE_HAND);
		checkRecord.setOpterator(this.getCurrentUser().getName());
		checkRecord.setChkTime(DateUtils.getCurrentDate());
		if(StringUtils.equals(CheckRecord.CHK_TYPE_RETURN, checkRecord.getChkType())){
			payBaseManager.syncReturnFile(checkRecord);
		} else {
			payBaseManager.syncCheckFile(checkRecord);
		}
		
		return ResultUtils.renderSuccessResult(checkRecord);
	}
	
	@RequestMapping(value="/handleImport",method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result forHandleImport(@RequestBody String data){
		CheckRecord checkRecord =  JSONUtils.deserialize(data, CheckRecord.class);
		if(checkRecord == null || StringUtils.isBlank(checkRecord.getId())){
			return ResultUtils.renderFailureResult("对账记录为空");
		}
		checkRecord = this.checkRecordManager.get(checkRecord.getId());
		
		String payChannel = checkRecord.getPayChannel().getCode();
		PayBaseManager payBaseManager = null;
		switch (payChannel) {
        case "9999":
        	payBaseManager = (PayBaseManager)SpringUtils.getBean("alipayManager");
            break;
        case "9998":
        	payBaseManager = (PayBaseManager)SpringUtils.getBean("wxpayManager");
            break;
        case "0308":
        	if(StringUtils.equals(checkRecord.getChkType(), CheckRecord.CHK_TYPE_REFUND)
    				|| StringUtils.equals(checkRecord.getChkType(), CheckRecord.CHK_TYPE_RETURN))
    			payBaseManager = (PayBaseManager)SpringUtils.getBean("cmbPayManager");
    		else 
    			payBaseManager = (PayBaseManager)SpringUtils.getBean("unionPayManager");
        	break;
        case "0000":
        	payBaseManager = (PayBaseManager)SpringUtils.getBean("cashManager");
            break;
        default : 
        	if(StringUtils.equals(checkRecord.getChkType(), CheckRecord.CHK_TYPE_REFUND)
    				|| StringUtils.equals(checkRecord.getChkType(), CheckRecord.CHK_TYPE_RETURN))
    			payBaseManager = (PayBaseManager)SpringUtils.getBean("bankPayManager");
    		else 
    			payBaseManager = (PayBaseManager)SpringUtils.getBean("unionPayManager");
            break;
		}
		checkRecord.setOptType(CheckRecord.CHK_OPTTYPE_HAND);
		checkRecord.setOpterator(this.getCurrentUser().getName());
		checkRecord.setChkTime(DateUtils.getCurrentDate());
		if(StringUtils.equals(CheckRecord.CHK_TYPE_RETURN, checkRecord.getChkType())){
			payBaseManager.importReturnFile(checkRecord);
		} else {
			payBaseManager.importCheckFile(checkRecord);
		}
		
		return ResultUtils.renderSuccessResult(checkRecord);
	}
	
	@RequestMapping(value="/handleCheck",method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result forHandleCheck(@RequestBody String data){
		CheckRecord checkRecord =  JSONUtils.deserialize(data, CheckRecord.class);
		if(checkRecord == null || StringUtils.isBlank(checkRecord.getId())){
			return ResultUtils.renderFailureResult("对账记录为空");
		}
		checkRecord = this.checkRecordManager.get(checkRecord.getId());
		
		String payChannel = checkRecord.getPayChannel().getCode();
		PayBaseManager payBaseManager = null;
		switch (payChannel) {
        case "9999":
        	payBaseManager = (PayBaseManager)SpringUtils.getBean("alipayManager");
            break;
        case "9998":
        	payBaseManager = (PayBaseManager)SpringUtils.getBean("wxpayManager");
            break;
        case "0308":
        	if(StringUtils.equals(checkRecord.getChkType(), CheckRecord.CHK_TYPE_REFUND)
    				|| StringUtils.equals(checkRecord.getChkType(), CheckRecord.CHK_TYPE_RETURN))
    			payBaseManager = (PayBaseManager)SpringUtils.getBean("cmbPayManager");
    		else 
    			payBaseManager = (PayBaseManager)SpringUtils.getBean("unionPayManager");
        	break;
        case "0000":
        	payBaseManager = (PayBaseManager)SpringUtils.getBean("cashManager");
            break;
        default : 
        	if(StringUtils.equals(checkRecord.getChkType(), CheckRecord.CHK_TYPE_REFUND)
    				|| StringUtils.equals(checkRecord.getChkType(), CheckRecord.CHK_TYPE_RETURN))
    			payBaseManager = (PayBaseManager)SpringUtils.getBean("bankPayManager");
    		else 
    			payBaseManager = (PayBaseManager)SpringUtils.getBean("unionPayManager");
            break;
		}
		checkRecord.setOptType(CheckRecord.CHK_OPTTYPE_HAND);
		checkRecord.setOpterator(this.getCurrentUser().getName());
		checkRecord.setChkTime(DateUtils.getCurrentDate());
		if(StringUtils.equals(CheckRecord.CHK_TYPE_RETURN, checkRecord.getChkType())){
			payBaseManager.checkReturnOrder(checkRecord);
		} else {
			payBaseManager.checkOrder(checkRecord);
		}
		
		return ResultUtils.renderSuccessResult(checkRecord);
	}
	
	@RequestMapping(value = "/retDetail/import/{payChannelCode}/{chkDate}", method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result importRetDetails(@PathVariable("payChannelCode") String payChannelCode,
			@PathVariable("chkDate") String chkDate, @RequestParam("file") MultipartFile file) {
		try {
			if (file.isEmpty()) {
				return ResultUtils.renderFailureResult("文件为空");
			}
			if (StringUtils.isEmpty(payChannelCode) || StringUtils.isEmpty(chkDate) ) {
				return ResultUtils.renderFailureResult("对账明细导入参数有误，请核对后再操作");
			}
			PayChannel pc = payChannelManager.findOne("from PayChannel where code = ? ", payChannelCode);
			CheckRecord checkRecord = this.checkRecordManager.findOne("from CheckRecord where chkType = '3' and chkDate = ? and payChannel.id = ?", chkDate, pc.getId());
			if(checkRecord == null){
				checkRecord = new CheckRecord();
				checkRecord.setPayChannel(pc);
				checkRecord.setStatus(CheckRecord.CHK_STAT_FILE_SUCCESS);
				checkRecord.setChkType(CheckRecord.CHK_TYPE_RETURN);
				checkRecord.setChkDate(chkDate);
				checkRecord.setOptType(CheckRecord.CHK_OPTTYPE_AUTO);
				checkRecord.setSyncType("import");
				checkRecord.setSyncTime(DateUtils.getCurrentDate());
				checkRecord.setSyncNum(1);
				this.checkRecordManager.save(checkRecord);
			} else {
				checkRecord.setSyncType("import");
				checkRecord.setSyncTime(DateUtils.getCurrentDate());
				checkRecord.setSyncNum(1);
			}
			
			// 获取文件名
			String fileName = file.getOriginalFilename();
			logger.info("上传的文件名为：" + fileName);
			// 获取文件的后缀名
			String suffixName = fileName.substring(fileName.lastIndexOf("."));
			logger.info("上传的后缀名为：" + suffixName);
			List<CheckDetailBank> details = new ArrayList<CheckDetailBank>();
			readRetDetail(details, checkRecord, file.getInputStream());
			
			checkRecord.setChkFile(fileName);
			checkRecord.setStatus(CheckRecord.CHK_STAT_IMP_SUCCESS);
			checkRecord.setImpTime(DateUtils.getCurrentDate());
			this.checkRecordManager.save(checkRecord);
			
			return ResultUtils.renderSuccessResult(details);
		} catch (Exception e) {
			e.printStackTrace();
			return ResultUtils.renderFailureResult();
		}
	}
	
	@SuppressWarnings("resource")
	public void readRetDetail(List<CheckDetailBank> details, CheckRecord checkRecord, InputStream in){
		// 输出流
		try {
			//0. 清除之前导入记录
			String deleleSql = "DELETE FROM SSM_CHECK_DETAIL_BANK WHERE CHECK_RECORD = ?";
			this.checkDetailBankManager.executeSql(deleleSql, checkRecord.getId());
			
			// 构造工作区 XSSFWorkbook 对象，strPath 传入文件路径
			XSSFWorkbook workbook = new XSSFWorkbook(in);
			// 读取第一章表格内容
			XSSFSheet sheet = workbook.getSheetAt(0);
			// 定义 row、cell
			XSSFRow row = null;
			CheckDetailBank cdb = null;
			List<CheckDetailBank> cdbl = new ArrayList<CheckDetailBank>();
			for (int i = sheet.getFirstRowNum()+1 ; i < sheet.getPhysicalNumberOfRows(); i++) {
				row = sheet.getRow(i);
				if (row == null || row.getCell(0) == null || "".equals(getCellValue(row.getCell(0))) ) {
					continue;
				}
				cdb = readRowToObject(row);
            	if(cdb == null) {
            		continue;
            	}
            	cdb.setClearDate(checkRecord.getChkDate().replaceAll("-", ""));
            	cdb.setCheckRecord(checkRecord.getId());
            	cdbl.add(cdb);
            	details.add(cdb);
                if(cdbl.size() == 100){
                	this.checkDetailBankManager.batchSave(cdbl, 100);
                	cdbl = new ArrayList<CheckDetailBank>();
                }
            }
            log.info("导入【"+ checkRecord.getChkDate() +"】日 退汇明细对账文件导入记录【" + details.size() + "】条。");
            
            this.checkDetailBankManager.batchSave(cdbl);
		} catch (FileNotFoundException e) {
			e.printStackTrace();
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	
	private CheckDetailBank readRowToObject(XSSFRow row){
//		帐号	交易日期	交易时间	交易渠道	借贷标识	交易对手卡号	交易对手名称	对手方联行号	币别	交易金额	narrative	本地流水
//		9550880078832900100      	20171108	151807	HPS 	C	6228483308601705175             	熊金良                                                                                                                  	103100000026  	156	200.00	请填写正确的收款账户和户名                                                                                                    	
		CheckDetailBank cdb = new CheckDetailBank();
		if(null == row)
			return null;
		cdb.setOutTradeNo(getCellValue(row.getCell(11)));
		cdb.setTradeType("HB10");
		cdb.setTradeNo("");//截取日期后为系统记录流水
		cdb.setTradeDate(getCellValue(row.getCell(1)));
		cdb.setTradeTime(getCellValue(row.getCell(2)));
		cdb.setAmt(new BigDecimal(getCellValue(row.getCell(9))));
		cdb.setTradeStatus("B");//默认返回成功数据
		cdb.setAccount(getCellValue(row.getCell(5)));
		cdb.setMemo(getCellValue(row.getCell(10)));

		return cdb;
	}
	
	@SuppressWarnings("deprecation")
	private String getCellValue(XSSFCell cell){
		String value = "";
        switch (cell.getCellType()) {     
	        case XSSFCell.CELL_TYPE_NUMERIC: // 数字     
	            value = cell.getNumericCellValue() + "";
	            break;     
	        case XSSFCell.CELL_TYPE_STRING: // 字符串     
	        	 value = cell.getStringCellValue() + "";
	            break;     
	        case XSSFCell.CELL_TYPE_BOOLEAN: // Boolean     
	        	value = cell.getBooleanCellValue() + "";
	            break;
	        case XSSFCell.CELL_TYPE_FORMULA: // 公式     
	        	value = cell.getCellFormula() + "";
	            break;
	        case XSSFCell.CELL_TYPE_BLANK: // 空值     
	        	value = "";
	            break;     
	        case XSSFCell.CELL_TYPE_ERROR: // 故障     
	        	value = "";
	            break;     
	        default:     
	        	value = "";  
	            break;     
        } 
        
        return value;
	}
}
