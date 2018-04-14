package com.lenovohit.ssm.mng.web.rest;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.alibaba.fastjson.JSONObject;
import com.lenovohit.core.dao.Page;
import com.lenovohit.core.exception.BaseException;
import com.lenovohit.core.manager.GenericManager;
import com.lenovohit.core.utils.DateUtils;
import com.lenovohit.core.utils.StringUtils;
import com.lenovohit.core.web.MediaTypes;
import com.lenovohit.core.web.utils.Result;
import com.lenovohit.core.web.utils.ResultUtils;
import com.lenovohit.ssm.base.web.rest.SSMBaseRestController;
import com.lenovohit.ssm.payment.hisModel.PrestoreDetailHis;
import com.lenovohit.ssm.payment.manager.HisManager;
import com.lenovohit.ssm.payment.model.Order;
import com.lenovohit.ssm.payment.model.Settlement;
/**
 * 交易管理
 * @author zyus1987
 *
 */
@RestController
@RequestMapping("/ssm/tran")
public class TranRestController extends SSMBaseRestController {
	
	/**
	 * 订单manager
	 */
	@Autowired
	private GenericManager<Order, String> orderManager;

	/**
	 * 结算单manager
	 */
	@Autowired
	private GenericManager<Settlement, String> settlementManager;
	
	/**
	 * HIS预存明细manager
	 */
//	@Autowired
	private HisManager<PrestoreDetailHis, Integer> prestoreDetailHisManager;
	
	/**
	 * 查询订单关联的结算单及HIS相关明细
	 * @param startDate
	 * @param endDate
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/order/related/{startDate}/{endDate}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result findRelatedOrders(
		@PathVariable("startDate") String startDate, 
		@PathVariable("endDate") String endDate, 
		@RequestParam(value = "data", defaultValue = "") String data
	) {
		try {
			// 查询患者信息
			List<HashMap<String, Object>> patients = this.findPatientInfo(data, true);
			if (null == patients || patients.size() == 0) {
				return ResultUtils.renderFailureResult("未查询到符合条件的患者信息！");
			}
			
			// 记录查询出的患者编号及信息对应
			HashMap<String, HashMap<String, Object>> patientsMap = new HashMap<String, HashMap<String, Object>>();
			// 组合患者ID查询条件
			StringBuffer patientIds = new StringBuffer("");
			int i = 0;
			for(HashMap<String, Object> item : patients) {
				if (patientIds.toString().indexOf("'" + (String)item.get("patientId") + "'") == -1) {
					patientsMap.put((String)item.get("patientId"), item);
					if (i > 0) patientIds.append(",");
					patientIds.append("'" + (String)item.get("patientId") + "'");
					i += 1;
				}
			}
			// 查询条件
			JSONObject query = JSONObject.parseObject(data);
			String payChannelCode = query.getString("payChannelCode");
			String orderType = query.getString("orderType");
			String amt = query.getString("amt");
			// 查询订单
			StringBuffer jql = new StringBuffer("");
			List<Object> values = new ArrayList<Object>();
			jql.append("from Order where createTime > ? and createTime < ? and patientNo in (" + patientIds + ") and bizType = '00'");
			values.add(DateUtils.string2Date(startDate + " 00:00:00", DateUtils.DATE_PATTERN_DASH_YYYYMMDD_HHMMSS));
			values.add(DateUtils.string2Date(endDate + " 23:59:59", DateUtils.DATE_PATTERN_DASH_YYYYMMDD_HHMMSS));
			if(!StringUtils.isBlank(orderType)){
				jql.append("and orderType = ? ");
				values.add(orderType);
			}
			if(!StringUtils.isBlank(amt) && new BigDecimal(amt).compareTo(new BigDecimal(0)) == 1){
				jql.append("and amt = ? ");
				values.add(new BigDecimal(amt));
			}
			jql.append("order by createTime desc");
			List<Order> oList = this.orderManager.find(jql.toString(), values.toArray());
			List<Order> rList = new ArrayList<Order>();
			// 查询结算单
			for(Order order : oList){
				jql = new StringBuffer("");
				values = new ArrayList<Object>();
				jql.append("from Settlement where order.id = ? ");
				values.add(order.getId());
				if(!StringUtils.isBlank(payChannelCode)){
					jql.append("and payChannelCode in (" + payChannelCode + ")");
				}
				jql.append("order by createTime");
				
				List<Settlement> sList = this.settlementManager.find(jql.toString(), values.toArray());
				if(sList!=null && sList.size()>0){
					order.setSettlements(sList);
					rList.add(order);
				}
			}
			
			// 查询HIS预存记录
			for(Order order : rList){
				if(StringUtils.isEmpty(order.getBizNo()) || "0".equals(order.getBizNo()) || order.getBizNo().contains("F")){
					order.getVariables().put("his", null);
				} else {
					PrestoreDetailHis pds = this.prestoreDetailHisManager.get(Integer.valueOf(order.getBizNo()));
					order.getVariables().put("his", pds);
				}
			}
			return ResultUtils.renderSuccessResult(rList);
		} catch (Exception e) {
			e.printStackTrace();
			return ResultUtils.renderFailureResult("查询订单及结算单信息出错！");
		}
	}
	
	/**
	 * 查询订单关联明细，包括订单、结算单、HIS预存明细
	 * @param start
	 * @param limit
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/detail/related/{start}/{limit}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result findRelatedDetail(
		@PathVariable("start") String start, 
		@PathVariable("limit") String limit,
		@RequestParam(value = "data", defaultValue = "") String data
	){
		
		// 查询条件
		JSONObject query = JSONObject.parseObject(data);
		String hisDetailId = query.getString("hisDetailId");
		String orderId = query.getString("orderId");
		
		StringBuffer jql = new StringBuffer("");
		List<Object> values = new ArrayList<Object>();
		Page page = new Page();
		page.setStart(start);
		page.setPageSize(limit);
		
		// HIS预存明细
		List<PrestoreDetailHis> hisDetail = new ArrayList<PrestoreDetailHis>();
		if (!StringUtils.isEmpty(hisDetailId)) {
			jql = new StringBuffer("from PrestoreDetailHis where id = ? ");
			values.add(new Integer(hisDetailId));
			hisDetail = prestoreDetailHisManager.find(jql.toString(), values.toArray());
		}
		
		// 订单及结算单
		Order order = null;
		List<Order> orders = new ArrayList<Order>();
		if (!StringUtils.isEmpty(orderId)) {
			order = orderManager.get(orderId);
			orders.add(order);
			jql = new StringBuffer("from Settlement where order.id = ?");
			values = new ArrayList<Object>();
			values.add(orderId);

			page.setQuery(jql.toString());
			page.setValues(values.toArray());
			settlementManager.findPage(page);
		}
		
		HashMap<String, Object> rtn = new HashMap<String, Object>();
		rtn.put("hisDetail", hisDetail);
		rtn.put("order", orders);
		rtn.put("settlements", page);
		
		return ResultUtils.renderPageResult(rtn);
	}
	
	/**
	 * 查询患者信息
	 */
	@SuppressWarnings("unchecked")
	private List<HashMap<String, Object>> findPatientInfo(String queryJson, boolean preciseQueryByName) {
		try {
			// 查询条件
			JSONObject query = JSONObject.parseObject(queryJson);
			String patientId = query.getString("patientId");
			String patientIdNo = query.getString("patientIdNo");
			String patientMobile = query.getString("patientMobile");
			String patientName = query.getString("patientName");
			
			if (StringUtils.isEmpty(patientId) && StringUtils.isEmpty(patientIdNo) 
					&& StringUtils.isEmpty(patientMobile) && StringUtils.isEmpty(patientName)) {
				return null;
			}
			
			//查询SQL
			StringBuffer sql = new StringBuffer("select BRBH, DWDM, KNSJ, BRXM, BRXB, SFZH, LXDZ, LXDH, YDDH from CW_KHXX where 1 = 1 ");
			List<Object> values = new ArrayList<Object>();
			
			// 根据患者编号查询
			if (!StringUtils.isEmpty(patientId)) {
				sql.append("and BRBH = ? ");
				values.add(patientId);
			}
			// 根据患者身份证号查询
			if (!StringUtils.isEmpty(patientIdNo)) {
				sql.append("and SFZH = ? ");
				values.add(patientIdNo);
			}
			// 根据患者姓名
			if (!StringUtils.isEmpty(patientName)) {
				if (preciseQueryByName)
					sql.append("and BRXM = ? ");
				else
					sql.append("and BRXM like ? ");
				values.add(patientName);
			}
			// 根据患者手机号查询
			if (!StringUtils.isEmpty(patientMobile)) {
				sql.append("and YDDH = ? ");
				values.add(patientMobile);
			}
			
			List<Object[]> patients = (List<Object[]>)prestoreDetailHisManager.findBySql(sql.toString(), values.toArray());
			List<HashMap<String, Object>> patientsList = new ArrayList<HashMap<String, Object>>();
			for(Object[] item : patients) {
				HashMap<String, Object> patient = new HashMap<String, Object>();
				patient.put("patientId", (String)item[0]); // 病人编号
				patient.put("feeType", (String)item[1]); // 单位代码
				patient.put("cardContent", (String)item[2]); // 卡内数据
				patient.put("patientName", (String)item[3]); // 患者姓名
				patient.put("patientGender", (String)item[4]); // 患者性别
				patient.put("patientIdNo", (String)item[5]); // 身份证号
				patient.put("patientAddress", (String)item[6]); // 联系地址
				patient.put("patientPhone", (String)item[7]); // 联系电话
				patient.put("patientMobile", (String)item[8]); // 联系电话
				patientsList.add(patient);
			}
			
			return patientsList;
			
		} catch(RuntimeException e) {
			e.printStackTrace();
			throw new BaseException(e.getMessage());
		} catch(Exception e) {
			e.printStackTrace();
			throw new BaseException("查询患者信息出错！");
		}
	}

}
