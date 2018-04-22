package com.lenovohit.ssm.mng.web.rest;


import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.TreeMap;

import org.apache.http.protocol.RequestDate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.lenovohit.core.manager.GenericManager;
import com.lenovohit.core.utils.DateUtils;
import com.lenovohit.core.web.MediaTypes;
import com.lenovohit.core.web.utils.Result;
import com.lenovohit.core.web.utils.ResultUtils;
import com.lenovohit.ssm.base.web.rest.SSMBaseRestController;
import com.lenovohit.ssm.payment.model.Order;
import com.lenovohit.ssm.payment.model.Settlement;


/**
 * 统计
 * @author victor
 *
 */
@RestController
@RequestMapping("/ssm/statistics")
public class StatisticsController extends SSMBaseRestController {
	@Autowired
	private GenericManager<Settlement, String> settlementManager;
	@Autowired
	private GenericManager<Order, String> orderManager;
	
	@RequestMapping(value = "/ssmSettlement/channel/{startDate}/{endDate}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result ssmSumByChannel(@PathVariable("startDate") String startDate, @PathVariable("endDate") String endDate) {
		List<Object> settlements = (List<Object>)settlementManager.findBySql("select pay_channel_code, sum(amt) from ssm_settlement where status = '0' and create_time < ? and create_time > ? group by pay_channel_code", startDate, endDate);
		return ResultUtils.renderSuccessResult(settlements);
	}
	@RequestMapping(value = "/loadCardCount", method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result loadCardCount(){
		try{
			Map<String, List<Object>> result = getCardCount();
			return ResultUtils.renderSuccessResult(result);
		}catch(Exception e){
			e.printStackTrace();
			return ResultUtils.renderFailureResult("本年度发卡量信息出错！");
		}
	}
	@RequestMapping(value="/loadDepositAcount/{date}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result loadDepositAcount(@PathVariable("date") String date){
		try{
			Map<String, Object> result = getDepositAcount(date);
			return ResultUtils.renderSuccessResult(result);
		}catch(Exception e){
			e.printStackTrace();
			return ResultUtils.renderFailureResult("本年度预存信息出错！");
		}
	}
	@RequestMapping(value="/loadPayFeeAcount", method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result loadPayFeeAcount(){
		try{
			Map<String, List<Object>> result = getPayFeeCount();
			return ResultUtils.renderSuccessResult(result);
		}catch(Exception e){
			e.printStackTrace();
			return ResultUtils.renderFailureResult("本年度缴费信息出错！");
		}
	}
	/**
	 * 获取预存笔数，包括现金，微信，支付宝，银行卡
	 * @return
	 */
	private Map<String, Object> getDepositAcount(String date) {
		if("1".equals(date)){
			date = DateUtils.getCurrentYear()+"-"+DateUtils.getCurrentMonth();
		}
		String sql = " select 'cash',count(order_id) from ssm_settlement where (pay_channel_code = '0000')and settle_type='SP' and to_char(create_time, 'yyyy-mm') = '"+date+"'"
				+ " union all"
				+ " select 'weChat',count(order_id) from ssm_settlement where (pay_channel_code = '9998')and settle_type='SP' and to_char(create_time, 'yyyy-mm') = '"+date+"'"
				+ " union all"
				+ " select 'alipay',count(order_id) from ssm_settlement where (pay_channel_code = '9999')and settle_type='SP' and to_char(create_time, 'yyyy-mm') = '"+date+"'"
				+ " union all"
				+ " select 'bankCard',count(order_id) from ssm_settlement where (pay_channel_code = '0306' or pay_channel_code = '0308')and settle_type='SP' and to_char(create_time, 'yyyy-mm') = '"+date+"'";
		List list = orderManager.findBySql(sql);
		Map<String, Object> map = new HashMap<String, Object>();
		for(Object object : list){
			Object[] objects = (Object[]) object;
			map.put((String) objects[0], objects[1]);
		}
		return map;
	}
	/**
	 * 发卡量统计
	 * @return
	 */
	private  Map<String, List<Object>> getCardCount(){
		String sql = "select 'issue' ,to_char(create_time ,'yyyy-mm') riqi,count(1) account,"
				+ " biz_type type from ssm_order"
				+ " where (biz_type ='06')  and status = '0'"
				+ " group by biz_type ,to_char(create_time ,'yyyy-mm')  "
				+ " union all "
				+ " select 'reissue' ,to_char(create_time ,'yyyy-mm') riqi,count(1) account,"
				+ " biz_type type from ssm_order "
				+ " where (biz_type ='05')  and status = '0'"
				+ " group by biz_type ,to_char(create_time ,'yyyy-mm')  "
				+ " order by riqi desc ";
		List list = orderManager.findBySql(sql);
		Map<String, List<Object>> map = getMap(list);
		return map;
	}
	/**
	 * 缴费统计
	 * @return
	 */
	private Map<String, List<Object>> getPayFeeCount(){
		String sql = "select 'miamt',to_char(create_time ,'yyyy-mm') time, sum(mi_amt)from ssm_order where order_desc = '门诊收费' and order_type = 'OP'"
				+ " group by (to_char(create_time,'yyyy-mm')) "
				+ " union all"
				+ " select 'selfamt',to_char(create_time ,'yyyy-mm') time, sum(self_amt)from ssm_order where order_desc = '门诊收费' and order_type = 'OP'"
				+ " group by (to_char(create_time,'yyyy-mm')) order by time desc";
		List list = orderManager.findBySql(sql);
		Map<String, List<Object>> map = getMap(list);
		return map;
	}
	private Map<String, List<Object>> getMap(List rtn) {
		String year = DateUtils.getCurrentYear();
		Map<String,TreeMap<String,Object>> mapView = new HashMap<>();
		if(rtn!=null && rtn.size()>0){
			for(Object o:rtn){
				Object [] oList = (Object[]) o;
				String feeType = oList[0].toString();
				TreeMap<String,Object> tMap = mapView.get(feeType);
				if(tMap!=null){
					tMap.put(oList[1].toString(), oList[2]);
				}else{
					TreeMap<String,Object> tmpMap = new TreeMap<String,Object>();
					tmpMap.put(year+"-01", "0");
					tmpMap.put(year+"-02", "0");
					tmpMap.put(year+"-03", "0");
					tmpMap.put(year+"-04", "0");
					tmpMap.put(year+"-05", "0");
					tmpMap.put(year+"-06", "0");
					tmpMap.put(year+"-07", "0");
					tmpMap.put(year+"-08", "0");
					tmpMap.put(year+"-09", "0");
					tmpMap.put(year+"-10", "0");
					tmpMap.put(year+"-11", "0");
					tmpMap.put(year+"-12", "0");
					tmpMap.put(oList[1].toString(), oList[2]);
					mapView.put(feeType, tmpMap);
				}
			}
		}
		Map<String,List<Object>> mapList = new HashMap<>();
		for (Entry<String, TreeMap<String, Object>> entry : mapView.entrySet()) {
			String key = entry.getKey();
			List<Object> oList = new ArrayList<>();
			for(Entry<String, Object> m : entry.getValue().entrySet()){
				oList.add(m.getValue());
			}
			mapList.put(key, oList);
		}
		return mapList;
	}
	
}
