package com.lenovohit.ssm.mng.web.rest;


import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.alibaba.fastjson.JSONObject;
import com.lenovohit.core.manager.GenericManager;
import com.lenovohit.core.utils.DateUtils;
import com.lenovohit.core.web.MediaTypes;
import com.lenovohit.core.web.utils.Result;
import com.lenovohit.core.web.utils.ResultUtils;
import com.lenovohit.ssm.base.model.Machine;
import com.lenovohit.ssm.base.web.rest.SSMBaseRestController;
import com.lenovohit.ssm.mng.model.LoggerRecord;

@RestController
@RequestMapping("/ssm/treat/logger")
public class LogRestController extends SSMBaseRestController {
	
	@Autowired
	private GenericManager<Machine, String> machineManager;
	
	@SuppressWarnings("rawtypes")
	@RequestMapping(value="/page/{start}/{limit}",method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forLoggerRecords(@PathVariable("start") String start, @PathVariable("limit") String limit,
			@RequestParam(value = "data", defaultValue = "")String data){
		JSONObject query = JSONObject.parseObject(data);
		String createTime = query.getString("createDay");
		String sql = " select * from ("
				+ " select TO_CHAR(timestmp / (1000 * 60 * 60 * 24) + "
				+ " TO_DATE('1970-01-01 08:00:00', 'YYYY-MM-DD HH:MI:SS'), 'YYYY-MM-DD HH:MI:SS') timestmp,formatted_message"
				+ " FROM logging_event)";
		if(createTime != null && !"".equals(createTime) ){
			sql += " where timestmp like '"+createTime+"%' ";
		}else{
			createTime = DateUtils.getCurrentDateStr("yyyy-MM-dd");
			sql += " where timestmp like '"+createTime+"%' ";
		}
		sql += " order by formatted_message desc ";
		List list = machineManager.findBySql(sql);
		List<LoggerRecord> loggerRecords = new ArrayList<LoggerRecord>();
		for(Object object : list){
			LoggerRecord loggerRecord = new LoggerRecord();
			Object[] objects = (Object[]) object;
//			BigDecimal bigDecimal = (BigDecimal) objects[0];
			String msg = (String) objects[1];
//			String createDay = DateUtils.date2String(bigDecimal.longValue(), "yyyy-MM-dd HH:mm:ss"); 
			String createDay = (String) objects[0];
			String uuid = "";
//			if(msg.length()>32 && isUUID(msg.substring(0, 32))){
//				uuid = msg.substring(0, 32);
//				loggerRecord = isContain(loggerRecords, uuid, msg);
//				loggerRecord.setUuid(uuid);
//				loggerRecord.setCreateDay(createDay);
//				setLoggerRecord(msg, loggerRecord);
//			}else{
				String message = msg;
				uuid = UUID.randomUUID().toString();
				loggerRecord.setUuid(uuid.substring(0,8)+uuid.substring(9,13)+uuid.substring(14,18)+uuid.substring(19,23)+uuid.substring(24));
				loggerRecord.setMessage(message);
				loggerRecord.setCreateDay(createDay );
//			}
			loggerRecords.add(loggerRecord);
		}
		return ResultUtils.renderSuccessResult(loggerRecords);
	}
	/**
	 * 判断list是否包含相同的对象
	 * @param list
	 * @param uuid
	 * @return
	 */
	public LoggerRecord isContain(List<LoggerRecord> list, String uuid, String msg){
		for(LoggerRecord logger : list){
			if(uuid.equals(logger.getUuid())){
				return logger;
			}
		}
		return new LoggerRecord();
	}
	/**
	 * 给LoggerRecord设置属性
	 * @param msg
	 * @param loggerRecord
	 */
	public void setLoggerRecord(String msg,LoggerRecord loggerRecord){
		if(msg.contains("Code")){
			String methodCode = msg.substring(msg.indexOf("【")+1,msg.lastIndexOf("】"));
			loggerRecord.setMethodCode(methodCode);
		}
		if(msg.contains("URL")){
			String url = msg.substring(msg.indexOf("【")+1,msg.lastIndexOf("】"));
			loggerRecord.setUrl(url);
		}
		if(msg.contains("param")){
			String param = msg.substring(msg.indexOf("【")+1,msg.lastIndexOf("】"));
			loggerRecord.setParam(param);
		}
		if(msg.contains("response")){
			String response = msg.substring(msg.indexOf("【")+1,msg.lastIndexOf("】"));
			loggerRecord.setResponse(response);
		}
	}
	public boolean isUUID(String str){
		String temp = str.substring(0, 8) + "-" + str.substring(9, 13) + "-" + str.substring(14, 18) + "-" + str.substring(19, 23) + "-" + str.substring(24);
		try{
			UUID.fromString(temp);
		}catch(Exception e){
			e.printStackTrace();
			return false;
		}
		return true;
	}
	public String isuuid(String url){
		String dealId = "";  
		String reg = "[0-9a-z]{8}-[0-9a-z]{4}-[0-9a-z]{4}-[0-9a-z]{4}-[0-9a-z]{12}";  
		Pattern p=Pattern.compile(reg);  
		Matcher m=p.matcher(url);   
		m.find();  
		dealId = m.group();  
		return dealId;
	}
	public boolean check(String uuid){
		boolean isUuid = false;
		if (uuid.matches("(\\w{8}(-\\w{4}){3}-\\w{12}?)"))
			return true;
		return isUuid;
	}
}
