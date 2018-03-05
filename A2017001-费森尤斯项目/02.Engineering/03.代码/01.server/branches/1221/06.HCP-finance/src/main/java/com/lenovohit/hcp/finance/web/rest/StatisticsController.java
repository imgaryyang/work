package com.lenovohit.hcp.finance.web.rest;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
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
import com.lenovohit.hcp.base.model.HcpUser;
import com.lenovohit.hcp.base.web.rest.HcpBaseRestController;
import com.lenovohit.hcp.finance.manager.CheckOutManager;
import com.lenovohit.hcp.finance.manager.StatisticsManager;
import com.lenovohit.hcp.finance.model.OutpatientChargeDetail;

/**
 * 财务管理相关统计
 */
@RestController
@RequestMapping("/hcp/finance/statistics")
public class StatisticsController extends HcpBaseRestController {

	@Autowired
	private GenericManager<OutpatientChargeDetail, String> outpatientChargeDetailManager;

	@Autowired
	private StatisticsManager statisticsManager;
	
	@Autowired
	private CheckOutManager checkOutManager;

	/**
	 * 根据条件查询患者费用分类统计
	 * 
	 * @param start
	 * @param limit
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/patientFee/page/{start}/{limit}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result loadPatientFee(@PathVariable("start") String start, @PathVariable("limit") String limit,
			@RequestParam(value = "data", defaultValue = "") String data) {
		try {
			// 查询条件
			JSONObject query = JSONObject.parseObject(data);
			String startDate = query.getString("startDate");
			String endDate = query.getString("endDate");
			String hosId = this.getCurrentUser().getHosId();
			/*
			 * Page page = new Page(); page.setStart(start);
			 * page.setPageSize(limit);
			 */

			StringBuffer jql = new StringBuffer("");
			List<Object> values = new ArrayList<Object>();

			jql.append("select FEE_TYPE,REG_DATE,PATIENT_NAME,PATIENT_ID,FEE_CODE,sum(AMT) SUM_AMT ");
			jql.append("FROM ( ");
			jql.append(
					"SELECT IsNULL((select d.COLUMN_val from b_dicvalue d where d.COLUMN_NAME = 'PAY_TYPE' and d.hos_id = '"+hosId+"' and d.COLUMN_KEY = a.PAY_TYPE),'现金') FEE_TYPE, ");
			jql.append("  CONVERT(varchar(20),a.REG_TIME,111) REG_DATE, ");
			jql.append("  c.NAME PATIENT_NAME, ");
			jql.append("  c.PATIENT_ID PATIENT_ID, ");
			jql.append(
					"  IsNULL((select d.COLUMN_val from b_dicvalue d where d.COLUMN_NAME = 'FEE_CODE'  and d.hos_id = '"+hosId+"' and d.COLUMN_KEY = b.fee_code),'其它') FEE_CODE, ");
			jql.append("  b.TOT_COST AMT ");
			jql.append("FROM reg_info a, oc_chargedetail b, b_patientinfo c ");
			jql.append("where a.PATIENT_ID = b.PATIENT_ID ");
			jql.append(" and a.hos_id = '"+hosId+"'");
			jql.append(" and b.hos_id = '"+hosId+"'");
			jql.append(" and c.hos_id = '"+hosId+"'");
			jql.append("  and a.PATIENT_ID = c.ID ");
			jql.append("  and a.REG_TIME BETWEEN CONVERT(DATETIME, '" + startDate + " 00:00:00"
					+ "') AND CONVERT(DATETIME, '" + endDate + " 23:59:59" + "') ");
			jql.append(") aa ");
			jql.append("GROUP BY FEE_TYPE,REG_DATE,PATIENT_NAME,PATIENT_ID,FEE_CODE ");

			/*
			 * values.add(startDate + " 00:00:00"); values.add(endDate +
			 * " 23:59:59");
			 */

			/*
			 * page.setQuery(jql.toString()); page.setValues(values.toArray());
			 */

			List rtn = outpatientChargeDetailManager.findBySql(jql.toString(), values.toArray());
			return ResultUtils.renderPageResult(rtn);
		} catch (Exception e) {
			e.printStackTrace();
			return ResultUtils.renderFailureResult("患者费用分类统计出错！");
		}
	}

	/**
	 * 功能描述：根据条件导出患者费用分类统计
	 * 
	 * @param start
	 * @param limit
	 * @param data
	 * @return
	 * @author GW
	 * @date 2017年6月27日
	 */
	@RequestMapping(value = "/exportPatientFee", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public void exportPatientFee(@RequestParam(value = "data", defaultValue = "") String data,
			HttpServletRequest request, HttpServletResponse response) {
		Result result = loadPatientFee(null, null, data);
		List<Object> resultList = (List<Object>) result.getResult();
		List<String> titleList = new ArrayList<String>();
		titleList.add("医保类别");
		titleList.add("就诊日期");
		titleList.add("姓名");
		titleList.add("个人编号");
		titleList.add("项目名称");
		titleList.add("项目金额");
		String fileName = "患者费用分类统计";
		statisticsManager.exportStatistics(resultList, titleList, fileName, request, response);
	}

	/**
	 * 根据条件查询费用分类统计
	 * 
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/feeType", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result loadFeeTypeStatistics(@RequestParam(value = "data", defaultValue = "") String data) {
		try {
			// 查询条件
			JSONObject query = JSONObject.parseObject(data);
			String startDate = query.getString("startDate");
			String endDate = query.getString("endDate");
			String hosId = query.getString("hosId");
			String chanel = query.getString("chanel");
			if("person".equals(chanel)){
				hosId = this.getCurrentUser().getHosId();
			}
			
			StringBuffer jql = new StringBuffer("");
			List<Object> values = new ArrayList<Object>();

			jql.append("SELECT '" + startDate + "' 开始日期,'" + endDate + "' 结束日期,'' 大类名称, ");
			jql.append("'' 大类代码, ");
			jql.append("费用名称 分级费用名称, ");
			jql.append("(CASE 医保类别 ");
			jql.append("WHEN '现金' THEN sum(项目金额)  ");
			jql.append("ELSE 0 END) 自费病人合计, ");
			jql.append("(CASE WHEN charindex('医保',医保类别) > 0 THEN sum(项目金额) ELSE 0 END) 医保病人合计, ");
			jql.append("(CASE WHEN charindex('农合',医保类别) > 0 THEN sum(项目金额) ELSE 0 END) 农合病人合计, ");
			jql.append("sum(项目金额) 总合计 ,aa.HOS_ID,	aa.HOS_NAME ");
			jql.append("FROM ");
			jql.append("( ");
			jql.append("SELECT IsNULL((select d.COLUMN_val from b_dicvalue d where d.COLUMN_NAME = 'PAY_TYPE' and d.hos_id = b.HOS_ID");
			if(StringUtils.isNotBlank(hosId)){
				jql.append("  and d.hos_id = '"+hosId+"' ");
			}
			jql.append("  and d.COLUMN_KEY = a.PAY_TYPE),'现金') 医保类别, ");
			jql.append("  IsNULL((select d.COLUMN_val from b_dicvalue d where d.COLUMN_NAME = 'FEE_CODE' AND d.hos_id = b.HOS_ID ");
			if(StringUtils.isNotBlank(hosId)){
				jql.append("  and d.hos_id = '"+hosId+"' ");
			}
			jql.append("   and d.COLUMN_KEY = b.fee_code),'其它') 费用名称, ");
			jql.append("  b.TOT_COST 项目金额,a.HOS_ID,h.HOS_NAME ");
			jql.append("FROM reg_info a,oc_chargedetail b,b_patientinfo c,b_hosinfo h ");
			jql.append("where a.PATIENT_ID = b.PATIENT_ID and a.HOS_ID = h.HOS_ID ");
			jql.append("  and a.PATIENT_ID = c.ID ");
			if(StringUtils.isNotBlank(hosId)){
				jql.append(" and a.hos_id = '"+hosId+"' ");
				jql.append(" and b.hos_id = '"+hosId+"' ");
				jql.append(" and c.hos_id = '"+hosId+"' ");
			}
			jql.append("  and a.REG_TIME BETWEEN CONVERT(DATETIME, '" + startDate + " 00:00:00"
					+ "') AND CONVERT(DATETIME, '" + endDate + " 23:59:59" + "') ");
			jql.append(") aa ");
			jql.append("GROUP BY aa.hos_id,aa.hos_name,医保类别,费用名称 ");

			List rtn = outpatientChargeDetailManager.findBySql(jql.toString(), values.toArray());
			return ResultUtils.renderPageResult(rtn);
		} catch (Exception e) {
			e.printStackTrace();
			return ResultUtils.renderFailureResult("费用分类统计出错！");
		}
	}

	/**
	 * 根据条件导出费用分类统计
	 * 
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/exportFeeType", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public void exportFeeTypeStatistics(@RequestParam(value = "data", defaultValue = "") String data,
			HttpServletRequest request, HttpServletResponse response) {
		Result result = loadFeeTypeStatistics(data);
		List<Object> resultList = (List<Object>) result.getResult();
		List<String> titleList = new ArrayList<String>();
		titleList.add("开始日期");
		titleList.add("结束日期");
		titleList.add("大类名称");
		titleList.add("大类代码");
		titleList.add("分类费用名称");
		titleList.add("自费病人合计");
		titleList.add("医保病人合计");
		titleList.add("农合病人合计");
		titleList.add("总计");
		String fileName = "费用分类统计";
		statisticsManager.exportStatistics(resultList, titleList, fileName, request, response);
	}

	/**
	 * 根据条件查询总费用分类统计
	 * 
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/totalFee", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result loadTotalFee(@RequestParam(value = "data", defaultValue = "") String data) {
		try {
			// 查询条件
			JSONObject query = JSONObject.parseObject(data);
			String hosId = query.getString("hosId");
			String chanel = query.getString("chanel");
			if("person".equals(chanel)){
				hosId = this.getCurrentUser().getHosId();
				query.put("hosId", hosId);
			}

			// 总费用统计
			List<Object[]> total = (List<Object[]>) statisticsManager.getTotalFee(query);
			// 记账费用
			List<Object[]> insurance = (List<Object[]>) statisticsManager.getTotalInsurance(query);
			// 现金费用
			List<Object[]> cash = (List<Object[]>) statisticsManager.getTotalCash(query);
			// 药品费用
			List<Object[]> drugFee = (List<Object[]>) statisticsManager.getTotalDrugFee(query);

			// HashMap rtn = new HashMap();
			Object[] rtn = new Object[total.size()];
			int i = 0;
			for (Object[] row : total) {
				Object[] grpRow = new Object[19];

				grpRow[18] = row[7];
				grpRow[0] = row[0];
				grpRow[1] = row[1];
				int j = 2;
				int k = 0;
				for (int index =0;index<row.length-2;index++) {
					Object o = row[index];
					if (k < 2) {
						k += 1;
						continue;
					}
					grpRow[j] = o;
					k += 1;
					j += 1;
				}
				k = 0;
				for (int index =0;index<insurance.get(i).length-2;index++) {
					Object o = insurance.get(i)[index];
					if (k < 2) {
						k += 1;
						continue;
					}
					grpRow[j] = o;
					k += 1;
					j += 1;
				}
				k = 0;
				for (int index =0;index<cash.get(i).length-2;index++) {
					Object o = cash.get(i)[index];
					if (k < 2) {
						k += 1;
						continue;
					}
					grpRow[j] = o;
					k += 1;
					j += 1;
				}
				k = 0;
				if(i<drugFee.size()){
					for (int index =0;index<drugFee.get(i).length-2;index++) {
						Object o = drugFee.get(i)[index];
						if (k < 2) {
							k += 1;
							continue;
						}
						grpRow[j] = o;
						k += 1;
						j += 1;
					}
				}
				rtn[i] = grpRow;
				i += 1;
			}

			return ResultUtils.renderSuccessResult(rtn);
		} catch (Exception e) {
			e.printStackTrace();
			return ResultUtils.renderFailureResult("总费用分类统计出错！");
		}
	}

	/**
	 * 根据条件导出总费用分类统计
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/exportTotalFee", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public void exportTotalFee(@RequestParam(value = "data", defaultValue = "") String data,
			HttpServletRequest request, HttpServletResponse response) {
		Result result = loadTotalFee(data);
		Object[] resultList = (Object[]) result.getResult();
		statisticsManager.exportTotalFee(resultList, request, response);
	}
	
	/**    
	 * 功能描述：收入消耗统计
	 *@param data
	 *@return       
	 *@author GW
	 *@date 2017年7月26日             
	*/
	@RequestMapping(value = "/statisByIncomeAndExpenses", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result statisByIncomeAndExpenses(@RequestParam(value = "data", defaultValue = "") String data) {
		JSONObject jsonObj = JSONObject.parseObject(data);
		if (StringUtils.isBlank(jsonObj)){
			return ResultUtils.renderFailureResult("数据参数传递错误！");
		}else{
			List<Map<String,Object>> mapList = new ArrayList<Map<String,Object>>();
			try {
				String hosId = jsonObj.getString("hosId");
				String chanel = jsonObj.getString("chanel");
				HcpUser user = this.getCurrentUser();
				String userName =null;
				if("person".equalsIgnoreCase(chanel)){//个人查看会计收款只能查看自己的，管理者可以查看整个医院的
					//userName = user.getName();
					hosId = user.getHosId();
				}
				String startTime = jsonObj.getString("startTime");
				String endTime = jsonObj.getString("endTime");
				if(startTime ==null && endTime!=null){//如果只选择了结束时间则默认查询结束时间当天的
					startTime = endTime;
				}
				if(startTime!=null && endTime == null){//只选择开始时间只查询开始时间当天的数据
					endTime = startTime;
				}
				if(startTime ==null && endTime == null){//默认为当天
					startTime = endTime = DateUtils.getCurrentDateStr();
				}
				mapList = checkOutManager.getChargeByTime(startTime,endTime,hosId,userName);
			} catch (Exception e) {
				e.printStackTrace();
				return ResultUtils.renderFailureResult("查询失败，失败原因：" + e.getMessage());
			}
			return ResultUtils.renderSuccessResult(mapList);
		}
	}
	
	/**    
	 * 功能描述：收入消耗统计
	 *@param data
	 *@return       
	 *@author GW
	 *@date 2017年7月26日             
	 */
	@RequestMapping(value = "/statisByMonthCheck", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result statisByMonthCheck(@RequestParam(value = "data", defaultValue = "") String data) {
		JSONObject jsonObj = JSONObject.parseObject(data);
		if (StringUtils.isBlank(jsonObj)){
			return ResultUtils.renderFailureResult("数据参数传递错误！");
		}else{
			List<Map<String,Object>> mapList = new ArrayList<Map<String,Object>>();
			try {
				HcpUser user = this.getCurrentUser();
				String hosId = user.getHosId();
				String deptId =null;
				if("person".equalsIgnoreCase(jsonObj.getString("chanel"))){//个人只能查看本科室的信息，管理者可以查看整个医院的
					deptId = user.getLoginDepartment().getId();
				}
				String startTime = jsonObj.getString("startTime");
				String endTime = jsonObj.getString("endTime");
				if(startTime ==null && endTime!=null){//如果只选择了结束时间则默认查询结束时间当天的
					startTime = endTime;
				}
				if(startTime!=null && endTime == null){//只选择开始时间只查询开始时间当天的数据
					endTime = startTime;
				}
				if(startTime ==null && endTime == null){//默认为当天
					startTime = endTime = DateUtils.getCurrentDateStr();
				}
				mapList = checkOutManager.getChargeByTime(startTime,endTime,hosId,deptId);
			} catch (Exception e) {
				e.printStackTrace();
				return ResultUtils.renderFailureResult("查询失败，失败原因：" + e.getMessage());
			}
			return ResultUtils.renderSuccessResult(mapList);
		}
	}
	/**    
	 * 功能描述：耗材统计
	 *@param data
	 *@return       
	 *@author GW
	 *@date 2017年7月26日             
	 */
	@RequestMapping(value = "/statisOfMatConsum", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result statisOfMatConsum(@RequestParam(value = "data", defaultValue = "") String data) {
		JSONObject jsonObj = JSONObject.parseObject(data);
		if (StringUtils.isBlank(jsonObj)){
			return ResultUtils.renderFailureResult("数据参数传递错误！");
		}else{
			List<Object> objList =null;
			try {
				HcpUser user = this.getCurrentUser();
				String hosId = user.getHosId();
				String deptId =null;
				if("person".equalsIgnoreCase(jsonObj.getString("chanel"))){//个人只能查看本科室的信息，管理者可以查看整个医院的
					deptId = user.getLoginDepartment().getId();
				}
				String startTime = jsonObj.getString("startTime");
				String endTime = jsonObj.getString("endTime");
				if(startTime ==null && endTime!=null){//如果只选择了结束时间则默认查询结束时间当天的
					startTime = endTime;
				}
				if(startTime!=null && endTime == null){//只选择开始时间只查询开始时间当天的数据
					endTime = startTime;
				}
				if(startTime ==null && endTime == null){//默认为当天
					startTime = endTime = DateUtils.getCurrentDateStr();
				}
				objList = checkOutManager.statisOfMatConsum(startTime,endTime,hosId,deptId);
			} catch (Exception e) {
				e.printStackTrace();
				return ResultUtils.renderFailureResult("查询失败，失败原因：" + e.getMessage());
			}
			return ResultUtils.renderSuccessResult(objList);
		}
	}
	
	/**    
	 * 功能描述：期初期末统计
	 *@param data
	 *@return       
	 *@author GW
	 *@date 2017年7月26日             
	 */
	@RequestMapping(value = "/statisOfMonthCheck", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result statisOfMonthCheck(@RequestParam(value = "data", defaultValue = "") String data) {
		JSONObject jsonObj = JSONObject.parseObject(data);
		if (StringUtils.isBlank(jsonObj)){
			return ResultUtils.renderFailureResult("数据参数传递错误！");
		}else{
			List<Map<String,Object>> objList =null;
			try {
				HcpUser user = this.getCurrentUser();
				String hosId = user.getHosId();
				String deptId =null;
				if("person".equalsIgnoreCase(jsonObj.getString("chanel"))){//个人只能查看本科室的信息，管理者可以查看整个医院的
					deptId = user.getLoginDepartment().getId();
				}
				String startTime = jsonObj.getString("startTime");
				String endTime = jsonObj.getString("endTime");
				if(startTime !=null && endTime!=null){//时间不能为空
					objList = checkOutManager.findMonthCheckData(startTime,endTime,hosId,deptId);
				}else{
					return ResultUtils.renderFailureResult("时间信息传递数据传递错误！");
				}
			} catch (Exception e) {
				e.printStackTrace();
				return ResultUtils.renderFailureResult("查询失败，失败原因：" + e.getMessage());
			}
			return ResultUtils.renderSuccessResult(objList);
		}
	}
	/**    
	 * 功能描述：获取医院数量和员工总数
	 *@param data
	 *@return       
	 *@author GW
	 *@date 2017年7月26日             
	 */
	@RequestMapping(value = "/statisBaseOperation", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result statisBaseOperation(@RequestParam(value = "data", defaultValue = "") String data) {
		JSONObject jsonObj = JSONObject.parseObject(data);
		try {
			List rtn = outpatientChargeDetailManager.findBySql("select SUM(hosNum) humNum,count(hosNum) hnum from (select count(HOS_ID) as  hosNum from hcp_user GROUP BY HOS_ID)a");
			return ResultUtils.renderPageResult(rtn.get(0));
		} catch (Exception e) {
			e.printStackTrace();
			return ResultUtils.renderFailureResult("获取医院数量和员工总数出错！");
		}		
	}
	
	/**    
	 * 功能描述：本年度财务基本信息
	 *@param data
	 *@return       
	 *@author GW
	 *@date 2017年7月26日             
	 */
	@RequestMapping(value = "/findBaseFeeType", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result findBaseFeeType(@RequestParam(value = "data", defaultValue = "") String data) {
		try {
			Map<String,List<Object>> result = statisticsManager.findBaseFeeType();
			return ResultUtils.renderPageResult(result);
		} catch (Exception e) {
			e.printStackTrace();
			return ResultUtils.renderFailureResult("本年度财务基本信息出错！");
		}		
	}
	
	/**
	 * 根据条件导出会计收款数据
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/exportDailyIncomeAndExpenses", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public void exportDailyIncomeAndExpenses(@RequestParam(value = "data", defaultValue = "") String data,
			HttpServletRequest request, HttpServletResponse response) {
		Result result = statisByIncomeAndExpenses(data);
		List resultList = (List) result.getResult();
		JSONObject jsonObj = JSONObject.parseObject(data);
		String startTime = jsonObj.getString("startTime");
		String endTime = jsonObj.getString("endTime");
		String title = startTime +"至"+endTime+"会计收款与消耗统计";
		statisticsManager.exportIncomeAndExpenses(resultList, request, response,title);
	}
	
	/**
	 * 根据条件导出会计收款数据
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/exportMatConsum", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public void exportMatConsum(@RequestParam(value = "data", defaultValue = "") String data,
			HttpServletRequest request, HttpServletResponse response) {
		Result result = statisOfMatConsum(data);
		List resultList = (List) result.getResult();
		JSONObject jsonObj = JSONObject.parseObject(data);
		String startTime = jsonObj.getString("startTime");
		String endTime = jsonObj.getString("endTime");
		String title = startTime +"至"+endTime+"消耗统计";
		statisticsManager.exportMatConsum(resultList, request, response,title);
	}
	
	@RequestMapping(value = "/exportMonthCheck", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public void exportMonthCheck(@RequestParam(value = "data", defaultValue = "") String data,
			HttpServletRequest request, HttpServletResponse response) {
		HcpUser user = this.getCurrentUser();
		String hosId = user.getHosId();
		String deptId =null;
		JSONObject jsonObj = JSONObject.parseObject(data);
		if("person".equalsIgnoreCase(jsonObj.getString("chanel"))){//个人只能查看本科室的信息，管理者可以查看整个医院的
			deptId = user.getLoginDepartment().getId();
		}
		String startTime = jsonObj.getString("startTime");
		String endTime = jsonObj.getString("endTime");
		String title = "期初("+startTime +")至期末("+endTime+")信息统计";
		checkOutManager.exportMonthCheck(startTime,endTime,hosId,deptId, request, response,title);
	}
}
