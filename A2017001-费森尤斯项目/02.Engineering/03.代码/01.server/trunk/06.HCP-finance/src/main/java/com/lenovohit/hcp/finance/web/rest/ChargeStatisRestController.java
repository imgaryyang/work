package com.lenovohit.hcp.finance.web.rest;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.OutputStream;
import java.net.URLEncoder;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.IndexedColors;
import org.apache.poi.ss.util.CellRangeAddress;
import org.apache.poi.xssf.usermodel.XSSFCell;
import org.apache.poi.xssf.usermodel.XSSFCellStyle;
import org.apache.poi.xssf.usermodel.XSSFFont;
import org.apache.poi.xssf.usermodel.XSSFRow;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.alibaba.fastjson.JSONObject;
import com.lenovohit.core.manager.GenericManager;
import com.lenovohit.core.utils.DateUtils;
import com.lenovohit.core.utils.StringUtils;
import com.lenovohit.core.web.MediaTypes;
import com.lenovohit.core.web.utils.Result;
import com.lenovohit.core.web.utils.ResultUtils;
import com.lenovohit.hcp.base.model.Department;
import com.lenovohit.hcp.base.web.rest.HcpBaseRestController;
import com.lenovohit.hcp.finance.model.OutpatientChargeDetail;

import antlr.Utils;

/**    
 *         
 * 类描述：   门诊收费统计
 *@author GW
 *@date 2017年4月10日          
 *     
 */
@RestController
@RequestMapping("/hcp/payment/chargeStatis")
public class ChargeStatisRestController extends HcpBaseRestController {
	@Autowired
	private GenericManager<OutpatientChargeDetail, String> outpatientChargeDetailManager;
	@Autowired
	private GenericManager<Department, String> departmentManager;
	/**    
	 * 功能描述：门诊收费-开单医生按会计科目统计
	 *@param start
	 *@param limit
	 *@param data
	 *@return       
	 *@author GW
	 *@date 2017年5月21日             
	*/
	@RequestMapping(value = "/statisByDeptAndDoc", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result statisByDeptAndDoc(@RequestParam(value = "data", defaultValue = "") String data) {
		JSONObject json = JSONObject.parseObject(data);
		List<Object> dateRange = new ArrayList<Object>();
		if(json!=null && json.getJSONArray("dateRange")!=null){
			dateRange = json.getJSONArray("dateRange");
		}
		List<Object> values = new ArrayList<Object>();
		StringBuilder sql = new StringBuilder("SELECT DISTINCT oc.FEE_CODE,	item.COLUMN_VAL"
				+ " FROM	oc_chargedetail oc"
				+ " LEFT JOIN b_dicvalue item ON item.COLUMN_KEY = oc.FEE_CODE"
				+ " WHERE	item.COLUMN_NAME = 'FEE_CODE'");

		if(dateRange!=null && dateRange.size()>0){
			SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");  
			try {
				Date startDate = sdf.parse(dateRange.get(0).toString());
				Date endDate = sdf.parse(dateRange.get(1).toString());
				if(startDate!=null && endDate!=null){
					sql.append(" and oc.CHARGE_TIME between ? and  ? ");
					values.add(startDate);
					values.add(endDate);
				}
			} catch (ParseException e) {
				e.printStackTrace();
				throw new RuntimeException("日期格式转换失败");
			}
		}
		if(json!=null && json.get("deptId")!=null){
			sql.append(" and oc.RECIPE_DEPT = ? ");
			values.add(json.get("deptId"));
		}
		
		List<Object> feeInfoList = (List<Object>) outpatientChargeDetailManager.findBySql(sql.toString(), values.toArray());
		List<Map<String,String>> titleMap = new ArrayList<Map<String,String>>();
		Map<String,String> deptClumn = new HashMap<String,String>();
		deptClumn.put("title", "开单科室");
		deptClumn.put("dataIndex", "deptName");
		titleMap.add(deptClumn);
		Map<String,String> nameMap = new HashMap<String,String>();
		nameMap.put("title", "开单医生");
		nameMap.put("dataIndex", "doc");
		titleMap.add(nameMap);
		
		if(feeInfoList!=null && feeInfoList.size()>0){
			//循环设置表头（Map<feeCode,columnVal>）
			for(int i=0;i<feeInfoList.size();i++){
				Map<String,String> map = new HashMap<String,String>();
				Object[] obj = (Object[]) feeInfoList.get(i);
				if(obj[0]!=null){
					map.put("title", obj[1].toString());
					map.put("dataIndex",obj[0].toString());
				}
				titleMap.add(map);
			}
		}
		
		//收费明细数据组装成按科室和人员收费明细显示
		StringBuilder sumSql = new StringBuilder("SELECT a.RECIPE_DEPT , a.RECIPE_DOC , a.FEE_CODE ,   sum(a.TOT_COST) totCost,b.name,d.DEPT_NAME "
				+ " FROM oc_chargedetail a "
				+ " LEFT JOIN B_DEPTINFO d "
				+ " ON d.ID = a.RECIPE_DEPT "
				+ " LEFT JOIN hcp_user b "
				+ " ON a.RECIPE_DOC = b.id where 1=1 ");
		if(dateRange!=null && dateRange.size()>0){
			SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");  
			try {
				Date startDate = sdf.parse(dateRange.get(0).toString());
				Date endDate = sdf.parse(dateRange.get(1).toString());
				if(startDate!=null && endDate!=null){
					sumSql.append(" and a.CHARGE_TIME between ? and  ? ");
				}
			} catch (ParseException e) {
				e.printStackTrace();
				throw new RuntimeException("日期格式转换失败");
			}
		}
		if(json!=null && json.get("deptId")!=null){
			sumSql.append(" and a.RECIPE_DEPT = ? ");
		}
		//根据当前登入者的HosId来查询所属医院范围的信息
		if(this.getCurrentUser().getHosId()!=""&&this.getCurrentUser().getHosId()!=null){
			sumSql.append(" and a.HOS_ID = ? ");
			values.add(this.getCurrentUser().getHosId());
		}
		sumSql.append(" GROUP BY a.RECIPE_DEPT,a.RECIPE_DOC, a.FEE_CODE,b.NAME,d.DEPT_NAME");
		
		List<Object> detailInfoList = (List<Object>) outpatientChargeDetailManager.findBySql(sumSql.toString(), values.toArray());
		Map<String,Map<String,Map<String,Object>>> deptMap = new HashMap<String,Map<String,Map<String,Object>>>();
		if(detailInfoList!=null&&detailInfoList.size()>0){
			for(int i=0;i<detailInfoList.size();i++){
				Object[] object = (Object[]) detailInfoList.get(i);
				//科室下医生Map
				Map<String,Map<String,Object>> userMap = null;
				//医生详细信息
				Map<String,Object> userInfo = null;
				if(object[0]!=null){
					userMap = deptMap.get(object[0]);
				}else{
					userMap = deptMap.get("empty");
				}
				if(userMap!=null){//该科室下已经有医生
					if(object[1]!=null){
						userInfo= userMap.get(object[1].toString());
					}else{
						userInfo=userMap.get("empty");
					}
					if(userInfo!=null){//该医生存在信息
						userInfo.put(object[2].toString(), object[3]);
					} else {//该医生不存在信息
						userInfo = new HashMap<String,Object>();
						userInfo.put("deptId", object[0]);		//科室
						userInfo.put("deptName", object[5]);	//科室名称
						userInfo.put("doc", object[4]);			//开单医生名称
						userInfo.put(object[2].toString(), object[3]);
						if(object[1]!=null){//姓名是否存在
							userMap.put(object[1].toString(), userInfo);
						}else{
							userMap.put("empty", userInfo);
						}
						if(object[0]!=null){//科室不存在
							deptMap.put(object[0].toString(), userMap);
						}else{
							deptMap.put("empty", userMap);
						}
					}
				}else{//该科室下暂时不存在医生
					userInfo = new HashMap<String,Object>();
					userMap = new HashMap<String, Map<String,Object>>();
					userInfo.put("deptId", object[0]);
					userInfo.put("deptName", object[5]);
					userInfo.put("doc", object[4]);
					userInfo.put(object[2].toString(), object[3]);
					if(object[1]!=null){//姓名是否存在
						userMap.put(object[1].toString(), userInfo);
					}else{
						userMap.put("empty", userInfo);
					}
					if(object[0]!=null){//科室不存在
						deptMap.put(object[0].toString(), userMap);
					}else{
						deptMap.put("empty", userMap);
					}
				
				}
			}
		}
		//循环将数据放到数组总
		Map<Object,Integer> rowMap = new HashMap<Object,Integer>();
		List<Map<String,Object>> mapList = new ArrayList<Map<String,Object>>();
		int point = 0;
	  for (Map.Entry<String,Map<String,Map<String,Object>>> entry : deptMap.entrySet()) {
		  if(entry.getValue()!=null){
			  for (Map.Entry<String, Map<String, Object>> model : entry.getValue().entrySet()) {
				  mapList.add(model.getValue());
			  }
		  }
		  if(mapList!=null && mapList.size()>0){
			  int size = mapList.size();
			  rowMap.put(point, size-point);
			  point = size;
		  }
	  }
	  rowMap.put("size", mapList.size());
	  Map<String,Object> resultMap = new HashMap<String,Object>();
	  resultMap.put("title", titleMap);//表格列头
	  resultMap.put("dataList", mapList);//数据集
	  resultMap.put("rowMap", rowMap);	//和并列数据
	return ResultUtils.renderPageResult(resultMap);
	}
	/**    
	 * 功能描述：门诊收费-收费护士按会计科目统计
	 *@param start
	 *@param limit
	 *@param data
	 *@return       
	 *@author GW
	 *@date 2017年5月21日             
	*/
	
	@RequestMapping(value = "/statisByDeptAndNurse", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result statisByDeptAndNurse(@RequestParam(value = "data", defaultValue = "") String data) {
		JSONObject json = JSONObject.parseObject(data);
		List<Object> dateRange = new ArrayList<Object>();
		if(json!=null && json.getJSONArray("dateRange")!=null){
			dateRange = json.getJSONArray("dateRange");
		}
		List<Object> values = new ArrayList<Object>();
		StringBuilder sql = new StringBuilder("SELECT DISTINCT oc.FEE_CODE,	item.COLUMN_VAL"
				+ " FROM	oc_chargedetail oc"
				+ " LEFT JOIN b_dicvalue item ON item.COLUMN_KEY = oc.FEE_CODE"
				+ " WHERE	item.COLUMN_NAME = 'FEE_CODE'");

		if(dateRange!=null && dateRange.size()>0){
			SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");  
			try {
				Date startDate = sdf.parse(dateRange.get(0).toString());
				Date endDate = sdf.parse(dateRange.get(1).toString());
				if(startDate!=null && endDate!=null){
					sql.append(" and oc.CHARGE_TIME between ? and  ? ");
					values.add(startDate);
					values.add(endDate);
				}
			} catch (ParseException e) {
				e.printStackTrace();
				throw new RuntimeException("日期格式转换失败");
			}
		}
		if(json!=null && json.get("deptId")!=null){
			sql.append(" and oc.RECIPE_DEPT = ? ");
			values.add(json.get("deptId"));
		}
		
		List<Object> feeInfoList = (List<Object>) outpatientChargeDetailManager.findBySql(sql.toString(), values.toArray());
		List<Map<String,String>> titleMap = new ArrayList<Map<String,String>>();
		Map<String,String> deptClumn = new HashMap<String,String>();
		deptClumn.put("title", "开单科室");
		deptClumn.put("dataIndex", "deptName");
		titleMap.add(deptClumn);
		Map<String,String> nameMap = new HashMap<String,String>();
		nameMap.put("title", "收费护士");
		nameMap.put("dataIndex", "nurse");
		titleMap.add(nameMap);
		
		if(feeInfoList!=null && feeInfoList.size()>0){
			//循环设置表头（Map<feeCode,columnVal>）
			for(int i=0;i<feeInfoList.size();i++){
				Map<String,String> map = new HashMap<String,String>();
				Object[] obj = (Object[]) feeInfoList.get(i);
				if(obj[0]!=null){
					map.put("title", obj[1].toString());
					map.put("dataIndex",obj[0].toString());
				}
				titleMap.add(map);
			}
		}
		
		//收费明细数据组装成按科室和人员收费明细显示
		StringBuilder sumSql = new StringBuilder("SELECT a.RECIPE_DEPT , a.CHARGE_OPER , a.FEE_CODE ,   sum(a.TOT_COST) totCost,b.name,d.DEPT_NAME "
				+ " FROM oc_chargedetail a "
				+ " LEFT JOIN B_DEPTINFO d "
				+ " ON d.ID = a.RECIPE_DEPT "
				+ " LEFT JOIN hcp_user b "
				+ " ON a.CHARGE_OPER = b.id where 1=1 and a.APPLY_STATE = 1 ");
		if(dateRange!=null && dateRange.size()>0){
			SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");  
			try {
				Date startDate = sdf.parse(dateRange.get(0).toString());
				Date endDate = sdf.parse(dateRange.get(1).toString());
				if(startDate!=null && endDate!=null){
					sumSql.append(" and a.CHARGE_TIME between ? and  ? ");
				}
			} catch (ParseException e) {
				e.printStackTrace();
				throw new RuntimeException("日期格式转换失败");
			}
		}
		if(json!=null && json.get("deptId")!=null){
			sumSql.append(" and a.RECIPE_DEPT = ? ");
		}
		sumSql.append(" GROUP BY a.RECIPE_DEPT,a.CHARGE_OPER, a.FEE_CODE,b.NAME,d.DEPT_NAME");

		List<Object> detailInfoList = (List<Object>) outpatientChargeDetailManager.findBySql(sumSql.toString(), values.toArray());
		Map<String,Map<String,Map<String,Object>>> deptMap = new HashMap<String,Map<String,Map<String,Object>>>();
		if(detailInfoList!=null&&detailInfoList.size()>0){
			for(int i=0;i<detailInfoList.size();i++){
				Object[] object = (Object[]) detailInfoList.get(i);
				//科室下医生Map
				Map<String,Map<String,Object>> userMap = null;
				//医生详细信息
				Map<String,Object> userInfo = null;
				if(object[0]!=null){
					userMap = deptMap.get(object[0]);
				}else{
					userMap = deptMap.get("empty");
				}
				if(userMap!=null){//该科室下已经有医生
					if(object[1]!=null){
						userInfo= userMap.get(object[1].toString());
					}else{
						userInfo=userMap.get("empty");
					}
					if(userInfo!=null){//该医生存在信息
						userInfo.put(object[2].toString(), object[3]);
					} else {//该医生不存在信息
						userInfo = new HashMap<String,Object>();
						userInfo.put("deptId", object[0]);		//科室
						userInfo.put("deptName", object[5]);	//科室名称
						userInfo.put("nurse", object[4]);			//收费护士名称
						userInfo.put(object[2].toString(), object[3]);
						if(object[1]!=null){//姓名是否存在
							userMap.put(object[1].toString(), userInfo);
						}else{
							userMap.put("empty", userInfo);
						}
						if(object[0]!=null){//科室不存在
							deptMap.put(object[0].toString(), userMap);
						}else{
							deptMap.put("empty", userMap);
						}
					}
				}else{//该科室下暂时不存在医生
					userInfo = new HashMap<String,Object>();
					userMap = new HashMap<String, Map<String,Object>>();
					userInfo.put("deptId", object[0]);
					userInfo.put("deptName", object[5]);
					userInfo.put("nurse", object[4]);
					userInfo.put(object[2].toString(), object[3]);
					if(object[1]!=null){//姓名是否存在
						userMap.put(object[1].toString(), userInfo);
					}else{
						userMap.put("empty", userInfo);
					}
					if(object[0]!=null){//科室不存在
						deptMap.put(object[0].toString(), userMap);
					}else{
						deptMap.put("empty", userMap);
					}
				
				}
			}
		}
		//循环将数据放到数组总
		Map<Object,Integer> rowMap = new HashMap<Object,Integer>();
		List<Map<String,Object>> mapList = new ArrayList<Map<String,Object>>();
		int point = 0;
	  for (Map.Entry<String,Map<String,Map<String,Object>>> entry : deptMap.entrySet()) {
		  if(entry.getValue()!=null){
			  for (Map.Entry<String, Map<String, Object>> model : entry.getValue().entrySet()) {
				  mapList.add(model.getValue());
			  }
		  }
		  if(mapList!=null && mapList.size()>0){
			  int size = mapList.size();
			  rowMap.put(point, size-point);
			  point = size;
		  }
	  }
	  rowMap.put("size", mapList.size());
	  Map<String,Object> resultMap = new HashMap<String,Object>();
	  resultMap.put("title", titleMap);//表格列头
	  resultMap.put("dataList", mapList);//数据集
	  resultMap.put("rowMap", rowMap);	//和并列数据
	return ResultUtils.renderPageResult(resultMap);
	}
	/**    
	 * 功能描述：按科室和时间统计收费项
	 *@param data
	 *@return       
	 *@author GW
	 * @throws ParseException 
	 *@date 2017年6月23日             
	*/
	@RequestMapping(value = "/statisByTimeAndDept", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result statisByTimeAndDept(@RequestParam(value = "data", defaultValue = "") String data) throws ParseException {
		Map<String, Object> resultMap = findChargeDetailByTime(data);
		return ResultUtils.renderSuccessResult(resultMap);
	}

	/**    
	 * 功能描述：根据条件封装收费信息
	 *@param data
	 *@return Map<(title,表头信息),(timeList,选择时间List),(dataList,数据list)>
	 *@throws ParseException       
	 *@author GW
	 *@date 2017年6月23日             
	*/
	private Map<String, Object> findChargeDetailByTime(String data) throws ParseException {
		JSONObject json = JSONObject.parseObject(data);
		List<Object> dateRange = new ArrayList<Object>();
		if(json!=null && json.getJSONArray("dateRange")!=null){
			dateRange = json.getJSONArray("dateRange");
		}
		List<Date> dateList = new ArrayList<Date>();
		
		//获取科室信息列表
		List<Map<String,String>> titleMap = getDeptList(json);
		
		
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
		String date1 = "";
		String date2 = "";
		if(dateRange!=null && dateRange.size()>0){//如果传入条件根据条件查询，如果没有查询条件查询本月
			date1 = (String) dateRange.get(0);
			date2 = (String) dateRange.get(1);
		} else {
			date1 = DateUtils.getCurrentYear()+"-"+DateUtils.getCurrentMonth()+"-1";
			date2 = DateUtils.getCurrentDateStr("yyyy-MM-dd");
		}
		Date startDate = sdf.parse(date1);
		Date endDate = sdf.parse(date2);
		//根据条件封装收费信息
		List<Map<String,Object>> detailList = getDetailMap(json, startDate, endDate);
		//获取时间集合
		dateList = getDateList(startDate, endDate);
		//返回集合
		Map<String,Object> resultMap = new HashMap<String,Object>();
		resultMap.put("title", titleMap);
		resultMap.put("timeList", dateList);
		resultMap.put("dataList", detailList);
		return resultMap;
	}

	/**    
	 * 功能描述：根据条件获取详细收费信息
	 *@param json
	 *@param startDate
	 *@param endDate
	 *@return       
	 *@author GW
	 *@date 2017年6月23日             
	*/
	private List<Map<String,Object>> getDetailMap(JSONObject json, Date startDate, Date endDate) {
		StringBuilder jql = new StringBuilder();
		List<Object> values = new ArrayList<Object>();
		String hosId = this.getCurrentUser().getHosId();//医院ID
		jql.append("SELECT	CONVERT (VARCHAR(30), CHARGE_TIME, 23) dateTime, RECIPE_DEPT,	SUM (TOT_COST) fee  FROM oc_chargedetail where CHARGE_TIME IS NOT NULL and HOS_ID = ? ");
		values.add(hosId);
		if(startDate!=null && endDate!=null){
			jql.append(" and CHARGE_TIME between ? and  ? ");
			values.add(startDate);
			values.add(endDate);
		}
		if(json!=null && json.getString("deptId")!=null){
			jql.append(" and RECIPE_DEPT =  ? ");
			values.add(json.getString("deptId"));
		}
		jql.append(" GROUP BY");
		jql.append(" CONVERT (VARCHAR(30), CHARGE_TIME, 23),");
		jql.append(" RECIPE_DEPT");
		jql.append(" order by CONVERT (VARCHAR(30), CHARGE_TIME, 23) desc ");
		//查询收费信息
		List<Object> detailList = (List<Object>) departmentManager.findBySql(jql.toString(), values.toArray());
		Map<String,Map<String,Object>> detailMap = new TreeMap<String,Map<String,Object>>();
		/*
		 * 封装收费信息
		 * 	Map<日期,Map<科室,金额>>
		 */
		for(int i=0;i<detailList.size();i++){
			Object[] obj = (Object[]) detailList.get(i);
			Map<String,Object> map = detailMap.get(obj[1]);
			if(map!=null){
				if(obj[1]!=null){//若开单科室为空放弃该条数据
					map.put(obj[1].toString(), obj[2]);
				}
			}else{
				map = new HashMap<String,Object>();
				if(obj[1]!=null){
					map.put(obj[1].toString(), obj[2]);
					map.put("dateTime", obj[0]);
					detailMap.put(obj[0].toString(), map);
				}
			}
		}
		List<Map<String,Object>> mapList = new ArrayList<Map<String,Object>>();
	  for (Map.Entry<String, Map<String, Object>> model : detailMap.entrySet()) {
		  mapList.add(model.getValue());
	  }
	return mapList;
	}

	/**    
	 * 功能描述：根据日期获取时间段内日期集合
	 *@param dateRange
	 *@param dateList
	 *@return       
	 *@author GW
	 *@date 2017年6月23日             
	*/
	private List<Date> getDateList(Date startDate, Date endDate) {
		List<Date> dateList = new ArrayList<Date>();
		if(endDate.after(startDate)){
			dateList = DateUtils.findDays(startDate, endDate);
		}else{
			dateList.add(startDate);
		}
		return dateList;
	}

	/**    
	 * 功能描述：根据条件查询科室
	 *@return       
	 *@author GW
	 *@date 2017年6月23日             
	*/
	private List<Map<String,String>> getDeptList(JSONObject json) {
		StringBuilder jql = new StringBuilder();
		List<String> values = new ArrayList<String>();
		String deptType = "001";			//科室类型
		String hosId = this.getCurrentUser().getHosId();//医院ID
		jql.append("SELECT dept from Department dept WHERE stopFlag = '1' and hosId = ? and deptType = ? ");
		values.add(hosId);
		values.add(deptType);
		if(json!=null && json.getString("deptId")!=null){
			jql.append(" and id = ? ");
			values.add(json.getString("deptId"));
		}
		jql.append(" order by deptId ");
		List<Department> models = departmentManager.find(jql.toString(), values.toArray());
		//表头显示信息
		List<Map<String,String>> titleMap = new ArrayList<Map<String,String>>();
		//第一行显示信息
		Map<String,String> deptClumn = new HashMap<String,String>();
		deptClumn.put("title", "收费日期");
		deptClumn.put("dataIndex", "dateTime");
		titleMap.add(deptClumn);
		for(Department dept: models){//循环将科室放入到titleMap中
			Map<String,String> deptMap = new HashMap<String,String>();
			deptMap.put("title", dept.getDeptName());
			deptMap.put("dataIndex", dept.getId());
			titleMap.add(deptMap);
		}
		return titleMap;
	}
	/**    
	 * 功能描述：
	 *@param data
	 *@return       
	 *@author GW
	 *@date 2017年5月27日             
	*/
	@RequestMapping(value = "/exportStatisByDeptAndDoc", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public void exportStatisByDeptAndDoc(HttpServletRequest request,HttpServletResponse response,
			@RequestParam(value = "data", defaultValue = "") String data) {
		Result  result = this.statisByDeptAndDoc(data);
		Map<String,Object> resultMap = (Map<String, Object>) result.getResult();
		//标题头
		List<Map<String,String>> titleMap = (List<Map<String, String>>) resultMap.get("title");
		//数据list
		List<Map<String,Object>> dataList = (List<Map<String, Object>>) resultMap.get("dataList");
		//对应行号
		Map<Object,Integer> rowMap = (Map<Object, Integer>) resultMap.get("rowMap");
		int titleSize = titleMap.size();
		String currentDate = DateUtils.getCurrentDateTimeStr();
		String fileName = currentDate+"_门诊收费统计";
		OutputStream out = null;
		try {
			out= response.getOutputStream();
			String header = request.getHeader("USER-AGENT");
			if(StringUtils.contains(header, "MSIE") || StringUtils.contains(header, "Trident")){//IE浏览器
				fileName = URLEncoder.encode(fileName,"UTF8");
			}else if(StringUtils.contains(header, "Mozilla")){//google,火狐浏览器
			   fileName = new String(fileName.getBytes(), "ISO8859-1");
			}else{
			   fileName = URLEncoder.encode(fileName,"UTF8");//其他浏览器
			}
			response.reset();
			response.setContentType("application/vnd.ms-word");
			// 定义文件名
			response.setHeader("Content-Disposition", "attachment;filename="+ fileName + ".xlsx");
			// 定义一个输出流
			response.setCharacterEncoding("UTF-8");
			// 工作区
			XSSFWorkbook wb = new XSSFWorkbook();
			XSSFFont font = wb.createFont();
			font.setFontHeightInPoints((short) 12);
			font.setFontName(" 黑体 ");
			// 创建第一个sheet
			XSSFSheet sheet = wb.createSheet("门诊收费-开单医生按会计科目统计");
			sheet.setColumnWidth(0,8 * 512);////设置第一列宽度（poi从0计数）
			sheet.setColumnWidth(1,8 * 512);
			for(int i=2;i<titleMap.size();i++){
				sheet.setColumnWidth(i,8 * 512);
			}
			
			XSSFCellStyle style = wb.createCellStyle();
			font.setFontName("宋体");//字体类型
		    font.setFontHeightInPoints((short) 25);//高度
		    style.setFont(font);
		    style.setAlignment(XSSFCellStyle.ALIGN_CENTER);//水平居中
		    style.setVerticalAlignment(XSSFCellStyle.VERTICAL_CENTER);//上下居中
		    style.setFillForegroundColor(IndexedColors.GREY_40_PERCENT.getIndex());//设置单元格颜色
			style.setFillPattern(CellStyle.SOLID_FOREGROUND);
			// 生成第一行
			XSSFRow row0 = sheet.createRow(0);
			 row0.setHeightInPoints((short) 50);
			 XSSFCell cell = row0.createCell(0);
			 sheet.addMergedRegion(new CellRangeAddress(0, 0, 0, titleSize-1));//合并单元格（开始行，结束行，开始列，结束列）
			 cell.setCellStyle(style);
			 cell.setCellValue("门诊收费-开单医生按会计科目统计");
			XSSFRow row1 = sheet.createRow(1);
			row1.setHeightInPoints((short) 30);
			// 给这一行赋值设置title
			for(int i=0;i<titleMap.size();i++){
				Map<String,String> map = titleMap.get(i);
				row1.createCell(i).setCellValue(map.get("title"));
			}
			//循环将dataList插入表中
			for(int i=0;i<dataList.size();i++){
				XSSFRow row = sheet.createRow(i+2);
				if(rowMap.get(i)!=null && rowMap.get(i)!=1){
					sheet.addMergedRegion(new CellRangeAddress(i+2, rowMap.get(i)+i+1, 0, 0));
				}
				for(int j=0;j<titleMap.size();j++){//从单条数据中取出列表头中所具有的属性写入表格
					if(titleMap.get(j).get("dataIndex")!=null && dataList.get(i).get(titleMap.get(j).get("dataIndex"))!=null){
						row.createCell(j).setCellValue(dataList.get(i).get(titleMap.get(j).get("dataIndex")).toString());
					}else {
						if(j>1){
							row.createCell(j).setCellValue("0.0000");
						}
					}
				}
			}
			// 写文件
			wb.write(out);
			// 关闭输出流
		} catch (FileNotFoundException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		} finally {
			try {
				if(out!=null){
					out.close();
				}
			} catch (IOException e) {
				e.printStackTrace();
			}

		}
	}
	/**    
	 * 功能描述：
	 *@param data
	 *@return       
	 *@author redstar
	 *@date 2017年9月19日             
	*/
	@RequestMapping(value = "/exportStatisByDeptAndNurse", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public void exportStatisByDeptAndNurse(HttpServletRequest request,HttpServletResponse response,
			@RequestParam(value = "data", defaultValue = "") String data) {
		Result  result = this.statisByDeptAndNurse(data);
		Map<String,Object> resultMap = (Map<String, Object>) result.getResult();
		//标题头
		List<Map<String,String>> titleMap = (List<Map<String, String>>) resultMap.get("title");
		//数据list
		List<Map<String,Object>> dataList = (List<Map<String, Object>>) resultMap.get("dataList");
		//对应行号
		Map<Object,Integer> rowMap = (Map<Object, Integer>) resultMap.get("rowMap");
		int titleSize = titleMap.size();
		String currentDate = DateUtils.getCurrentDateTimeStr();
		String fileName = currentDate+"_门诊收费统计";
		OutputStream out = null;
		try {
			out= response.getOutputStream();
			String header = request.getHeader("USER-AGENT");
			if(StringUtils.contains(header, "MSIE") || StringUtils.contains(header, "Trident")){//IE浏览器
				fileName = URLEncoder.encode(fileName,"UTF8");
			}else if(StringUtils.contains(header, "Mozilla")){//google,火狐浏览器
			   fileName = new String(fileName.getBytes(), "ISO8859-1");
			}else{
			   fileName = URLEncoder.encode(fileName,"UTF8");//其他浏览器
			}
			response.reset();
			response.setContentType("application/vnd.ms-word");
			// 定义文件名
			response.setHeader("Content-Disposition", "attachment;filename="+ fileName + ".xlsx");
			// 定义一个输出流
			response.setCharacterEncoding("UTF-8");
			// 工作区
			XSSFWorkbook wb = new XSSFWorkbook();
			XSSFFont font = wb.createFont();
			font.setFontHeightInPoints((short) 12);
			font.setFontName(" 黑体 ");
			// 创建第一个sheet
			XSSFSheet sheet = wb.createSheet("门诊收费-收费护士按会计科目统计");
			sheet.setColumnWidth(0,8 * 512);////设置第一列宽度（poi从0计数）
			sheet.setColumnWidth(1,8 * 512);
			for(int i=2;i<titleMap.size();i++){
				sheet.setColumnWidth(i,8 * 512);
			}
			
			XSSFCellStyle style = wb.createCellStyle();
			font.setFontName("宋体");//字体类型
		    font.setFontHeightInPoints((short) 25);//高度
		    style.setFont(font);
		    style.setAlignment(XSSFCellStyle.ALIGN_CENTER);//水平居中
		    style.setVerticalAlignment(XSSFCellStyle.VERTICAL_CENTER);//上下居中
		    style.setFillForegroundColor(IndexedColors.GREY_40_PERCENT.getIndex());//设置单元格颜色
			style.setFillPattern(CellStyle.SOLID_FOREGROUND);
			// 生成第一行
			XSSFRow row0 = sheet.createRow(0);
			 row0.setHeightInPoints((short) 50);
			 XSSFCell cell = row0.createCell(0);
			 sheet.addMergedRegion(new CellRangeAddress(0, 0, 0, titleSize-1));//合并单元格（开始行，结束行，开始列，结束列）
			 cell.setCellStyle(style);
			 cell.setCellValue("门诊收费-收费护士按会计科目统计");
			XSSFRow row1 = sheet.createRow(1);
			row1.setHeightInPoints((short) 30);
			// 给这一行赋值设置title
			for(int i=0;i<titleMap.size();i++){
				Map<String,String> map = titleMap.get(i);
				row1.createCell(i).setCellValue(map.get("title"));
			}
			//循环将dataList插入表中
			for(int i=0;i<dataList.size();i++){
				XSSFRow row = sheet.createRow(i+2);
				if(rowMap.get(i)!=null && rowMap.get(i)!=1){
					sheet.addMergedRegion(new CellRangeAddress(i+2, rowMap.get(i)+i+1, 0, 0));
				}
				for(int j=0;j<titleMap.size();j++){//从单条数据中取出列表头中所具有的属性写入表格
					if(titleMap.get(j).get("dataIndex")!=null && dataList.get(i).get(titleMap.get(j).get("dataIndex"))!=null){
						row.createCell(j).setCellValue(dataList.get(i).get(titleMap.get(j).get("dataIndex")).toString());
					}else {
						if(j>1){
							row.createCell(j).setCellValue("0.0000");
						}
					}
				}
			}
			// 写文件
			wb.write(out);
			// 关闭输出流
		} catch (FileNotFoundException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		} finally {
			try {
				if(out!=null){
					out.close();
				}
			} catch (IOException e) {
				e.printStackTrace();
			}

		}
	}
	/**    
	 * 功能描述：导出按时间统计各科室收费信息
	 *@param request
	 *@param response
	 *@param data       
	 *@author GW
	 * @throws ParseException 
	 *@date 2017年6月23日             
	*/
	@RequestMapping(value = "/exportStatisByTime", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public void exportStatisByTime(HttpServletRequest request,HttpServletResponse response,
			@RequestParam(value = "data", defaultValue = "") String data) throws ParseException {
		Map<String,Object>  map = findChargeDetailByTime(data);
		//标题头
		List<Map<String,String>> titleMap = (List<Map<String, String>>) map.get("title");
		//数据list
		List<Map<String,Object>> dataList = (List<Map<String, Object>>) map.get("dataList");
		//对应行号
		int titleSize = titleMap.size();
		String currentDate = DateUtils.getCurrentDateTimeStr();
		String fileName = currentDate+"_按日期统计科室收费信息";
		OutputStream out = null;
		try {
			out= response.getOutputStream();
			String header = request.getHeader("USER-AGENT");
			if(StringUtils.contains(header, "MSIE") || StringUtils.contains(header, "Trident")){//IE浏览器
				fileName = URLEncoder.encode(fileName,"UTF8");
			}else if(StringUtils.contains(header, "Mozilla")){//google,火狐浏览器
				fileName = new String(fileName.getBytes(), "ISO8859-1");
			}else{
				fileName = URLEncoder.encode(fileName,"UTF8");//其他浏览器
			}
			response.reset();
			response.setContentType("application/vnd.ms-word");
			// 定义文件名
			response.setHeader("Content-Disposition", "attachment;filename="+ fileName + ".xlsx");
			// 定义一个输出流
			response.setCharacterEncoding("UTF-8");
			// 工作区
			XSSFWorkbook wb = new XSSFWorkbook();
			XSSFFont font = wb.createFont();
			font.setFontHeightInPoints((short) 12);
			font.setFontName(" 黑体 ");
			// 创建第一个sheet
			XSSFSheet sheet = wb.createSheet("按日期统计科室收费信息");
			sheet.setColumnWidth(0,8 * 512);////设置第一列宽度（poi从0计数）
			sheet.setColumnWidth(1,8 * 512);
			for(int i=2;i<titleMap.size();i++){
				sheet.setColumnWidth(i,8 * 512);
			}
			
			XSSFCellStyle style = wb.createCellStyle();
			font.setFontName("宋体");//字体类型
			font.setFontHeightInPoints((short) 25);//高度
			style.setFont(font);
			style.setAlignment(XSSFCellStyle.ALIGN_CENTER);//水平居中
			style.setVerticalAlignment(XSSFCellStyle.VERTICAL_CENTER);//上下居中
			style.setFillForegroundColor(IndexedColors.GREY_40_PERCENT.getIndex());//设置单元格颜色
			style.setFillPattern(CellStyle.SOLID_FOREGROUND);
			// 生成第一行
			XSSFRow row0 = sheet.createRow(0);
			row0.setHeightInPoints((short) 50);
			XSSFCell cell = row0.createCell(0);
			sheet.addMergedRegion(new CellRangeAddress(0, 0, 0, titleSize-1));//合并单元格（开始行，结束行，开始列，结束列）
			cell.setCellStyle(style);
			cell.setCellValue("门诊收费-开单医生按会计科目统计");
			XSSFRow row1 = sheet.createRow(1);
			row1.setHeightInPoints((short) 30);
			// 给这一行赋值设置title
			for(int i=0;i<titleMap.size();i++){
				Map<String,String> mapTitle = titleMap.get(i);
				row1.createCell(i).setCellValue(mapTitle.get("title"));
			}
			//循环将dataList插入表中
			for(int i=0;i<dataList.size();i++){
				XSSFRow row = sheet.createRow(i+2);
				for(int j=0;j<titleMap.size();j++){//从单条数据中取出列表头中所具有的属性写入表格
					if(titleMap.get(j).get("dataIndex")!=null && dataList.get(i).get(titleMap.get(j).get("dataIndex"))!=null){
						row.createCell(j).setCellValue(dataList.get(i).get(titleMap.get(j).get("dataIndex")).toString());
					}else {
						if(j>1){
							row.createCell(j).setCellValue("0");
						}
					}
				}
			}
			// 写文件
			wb.write(out);
			// 关闭输出流
		} catch (FileNotFoundException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		} finally {
			try {
				if(out!=null){
					out.close();
				}
			} catch (IOException e) {
				e.printStackTrace();
			}
			
		}
	}
}
