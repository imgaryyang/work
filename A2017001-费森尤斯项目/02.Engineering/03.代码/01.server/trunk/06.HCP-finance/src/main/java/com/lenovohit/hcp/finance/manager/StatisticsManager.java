package com.lenovohit.hcp.finance.manager;

import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.alibaba.fastjson.JSONObject;

/**
 * 
 * @description 财务相关统计报表
 * @author Victor
 * @version 1.0.0
 * @date 2017年6月26日
 */
public interface StatisticsManager {

	void exportStatistics(List<Object> dataList, List<String> titleList, String fileName, HttpServletRequest request,
			HttpServletResponse response);

	/**
	 * 患者费用统计
	 * 
	 * @param start
	 * @param limit
	 * @param query
	 * @return
	 */
	List getPatientFee(String start, String limit, JSONObject query);

	/**
	 * 费用分类统计
	 * 
	 * @param query
	 * @return
	 */
	List getTotalFeeByFeeType(JSONObject query);

	/**
	 * 总费用（按月）
	 * 
	 * @param query
	 * @return
	 */
	List getTotalFee(JSONObject query);

	/**
	 * 总费用（按月）-记账
	 * 
	 * @param query
	 * @return
	 */
	List getTotalInsurance(JSONObject query);

	/**
	 * 总费用（按月）-现金
	 * 
	 * @param query
	 * @return
	 */
	List getTotalCash(JSONObject query);

	/**
	 * 总费用（按月）-药品
	 * 
	 * @param query
	 * @return
	 */
	List getTotalDrugFee(JSONObject query);

	/**    
	 * 功能描述：根据条件导出总费用分类统计
	 *@param resultList
	 *@param request
	 *@param response       
	 *@author GW
	 *@date 2017年6月28日             
	*/
	void exportTotalFee(Object[] resultList, HttpServletRequest request, HttpServletResponse response);
	/**    
	 * 功能描述：根据条件导出总费用分类统计
	 *@param resultList
	 *@param request
	 *@param response       
	 *@author GW
	 *@date 2017年6月28日             
	 */
	void exportIncomeAndExpenses(List resultList, HttpServletRequest request, HttpServletResponse response,String title);
	/**    
	 * 功能描述：根据条件导出总费用分类统计
	 *@param resultList
	 *@param request
	 *@param response       
	 *@author GW
	 *@date 2017年6月28日             
	 */
	void exportMatConsum(List resultList, HttpServletRequest request, HttpServletResponse response,String title);
	/**    
	 * 功能描述：本年度财务基本信息出错
	 *@param resultList
	 *@param request
	 *@param response       
	 *@author GW
	 *@date 2017年6月28日             
	 */
	Map<String,List<Object>> findBaseFeeType();
}
