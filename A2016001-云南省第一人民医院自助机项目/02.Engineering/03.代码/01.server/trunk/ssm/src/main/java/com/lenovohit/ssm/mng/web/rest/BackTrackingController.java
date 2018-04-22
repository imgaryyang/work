package com.lenovohit.ssm.mng.web.rest;

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
 * 补录
 * @author victor
 *
 */
@RestController
@RequestMapping("/ssm/backTracking")
public class BackTrackingController extends SSMBaseRestController {
	
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
	@Autowired
	private HisManager<PrestoreDetailHis, Integer> prestoreDetailHisManager;
	
//	/**
//	 * 查询订单关联的结算单及HIS相关明细
//	 * @param startDate
//	 * @param endDate
//	 * @param data
//	 * @return
//	 */
//	@RequestMapping(value = "/order/related/{startDate}/{endDate}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
//	public Result findRelatedOrders(
//		@PathVariable("startDate") String startDate, 
//		@PathVariable("endDate") String endDate, 
//		@RequestParam(value = "data", defaultValue = "") String data
//	) {
//		try {
//			// 查询条件
//			JSONObject query = JSONObject.parseObject(data);
//			
//			List<HashMap<String, Object>> patients = baseManager.findPatientInfo(data, true);
//			if (patients.size() == 0) {
//				return ResultUtils.renderFailureResult("未查询到符合条件的患者信息！");
//			}
//			
//			// 记录查询出的患者编号及信息对应
//			HashMap<String, HashMap<String, Object>> patientsMap = new HashMap<String, HashMap<String, Object>>();
//			// 组合患者ID查询条件
//			StringBuffer patientIds = new StringBuffer("");
//			int i = 0;
//			for(HashMap<String, Object> item : patients) {
//				if (patientIds.toString().indexOf("'" + (String)item.get("patientId") + "'") == -1) {
//					patientsMap.put((String)item.get("patientId"), item);
//					if (i > 0) patientIds.append(",");
//					patientIds.append("'" + (String)item.get("patientId") + "'");
//					i += 1;
//				}
//			}
//			
//			// 查询语句
//			StringBuffer sql = new StringBuffer("");
//			List<Object> values = new ArrayList<Object>();
//			sql.append("SELECT O.ID as ORDER_ID, O.ORDER_TYPE, O.PATIENT_NO, O.PATIENT_NAME, O.REAL_AMT, O.STATUS as ORDER_STATUS, O.CREATE_TIME AS ORDER_CREATE_TIME, O.MACHINE_CODE, O.BIZ_NO, ");
//			sql.append("S.ID as SETTLE_ID, S.AMT, S.STATUS AS SETTLE_STATUS, S.TRADE_STATUS, S.PAY_CHANNEL_CODE, S.PAY_CHANNEL_NAME, S.PAY_TYPE_CODE, S.PAY_TYPE_NAME, S.CREATE_TIME AS SETTLE_CREATE_TIME ");
//			sql.append("FROM SSM_SETTLEMENT S, SSM_ORDER O ");
//			sql.append("WHERE S.ORDER_ID = O.ID ");
//			sql.append("AND (O.CREATE_TIME BETWEEN to_date(?, 'yyyy-mm-dd hh24:mi:ss') AND to_date(?, 'yyyy-mm-dd hh24:mi:ss') OR S.CREATE_TIME BETWEEN to_date(?, 'yyyy-mm-dd hh24:mi:ss') AND to_date(?, 'yyyy-mm-dd hh24:mi:ss')) ");
//			values.add(startDate + " 00:00:00");
//			values.add(endDate + " 23:59:59");
//			values.add(startDate + " 00:00:00");
//			values.add(endDate + " 23:59:59");
//			sql.append("AND O.PATIENT_NO in (" + patientIds + ") ");
//			// values.add(patientIds);
//			sql.append("ORDER BY ORDER_CREATE_TIME DESC ");
//			List<Object[]> orders = (List<Object[]>)settlementManager.findBySql(sql.toString(), values.toArray());
//			
//			// 查询HIS
//			/*List<Object> hisValues = new ArrayList<Object>();
//			StringBuffer hisSql = new StringBuffer("select JLID, BRBH, YCDM, YCFS, YCJE, ZTBZ, YCSJ, LY from CW_YCMX where BRBH in (?) ");
//			hisValues.add(patientIds);
//			hisSql.append("and (YCSJ BETWEEN to_date(?, 'yyyy-mm-dd hh24:mi:ss') AND to_date(?, 'yyyy-mm-dd hh24:mi:ss')) ");
//			hisValues.add(startDate + " 00:00:00");
//			hisValues.add(endDate + " 23:59:59");*/ // TODO: 为什么查不出来？
//			
//			StringBuffer hisSql = new StringBuffer("select JLID, BRBH, YCDM, YCFS, YCJE, ZTBZ, YCSJ, LY from CW_YCMX where BRBH in (" + patientIds + ") ");
//			hisSql.append("and (YCSJ BETWEEN to_date('" + startDate + " 00:00:00" + "', 'yyyy-mm-dd hh24:mi:ss') AND to_date('" + endDate + " 23:59:59" + "', 'yyyy-mm-dd hh24:mi:ss')) ");
//			hisSql.append("order by YCSJ desc ");
//			
//			List<Object[]> hisDetail = (List<Object[]>)prestoreDetailHisManager.findBySql(hisSql.toString());
//			
//			/* if (orders.size() == 0 && hisDetail.size() == 0)
//				return ResultUtils.renderSuccessResult(orders);*/
//			
//			JSONArray ordersJson = new JSONArray();
//			HashMap<String, Integer> orderIdx = new HashMap();
//			HashMap<String, Integer> bizNoIdx = new HashMap();
//			i = 0;
//			for(Object[] item : orders) {
//				String orderId = (String)item[0];
//				String bizNo = item[8] == null ? null : (String)item[8];
//				if(null == orderIdx.get(orderId)) {
//					JSONObject order = new JSONObject();
//					order.put("orderId", orderId);
//					order.put("orderType", (String)item[1]);
//					order.put("patientNo", (String)item[2]);
//					order.put("patientName", (String)item[3]);
//					order.put("realAmt", (BigDecimal)item[4]);
//					order.put("orderStatus", (Character)item[5]);
//					order.put("orderCreateTime", (Date)item[6]);
//					order.put("machineCode", (String)item[7]);
//					order.put("bizNo", (String)item[8]);
//	
//					JSONObject settlement = new JSONObject();
//					settlement.put("settleId", (String)item[9]);
//					settlement.put("amt", (BigDecimal)item[10]);
//					settlement.put("settleStatus", (Character)item[11]);
//					settlement.put("tradeStatus", (String)item[12]);
//					settlement.put("payChannelCode", (String)item[13]);
//					settlement.put("payChannelName", (String)item[14]);
//					settlement.put("payTypeCode", (String)item[15]);
//					settlement.put("payTypeName", (String)item[16]);
//					settlement.put("settleCreateTime", (Date)item[17]);
//					// 为订单添加结算单数组
//					order.put("settlements", new JSONArray());
//					// 添加结算单
//					((JSONArray)order.get("settlements")).add(settlement);
//					// 添加订单
//					ordersJson.add(order);
//					// 记录订单在订单数组中的序列
//					orderIdx.put(orderId, new Integer(i));
//					// 记录HIS端预存明细在订单数组中对应的序列
//					if (!StringUtils.isEmpty((String)item[8])) bizNoIdx.put((String)item[8], new Integer(i));
//					i += 1;
//				} else {
//					JSONObject settlement = new JSONObject();
//					settlement.put("settleId", (String)item[9]);
//					settlement.put("amt", (BigDecimal)item[10]);
//					settlement.put("settleStatus", (Character)item[11]);
//					settlement.put("tradeStatus", (String)item[12]);
//					settlement.put("payChannelCode", (String)item[13]);
//					settlement.put("payChannelName", (String)item[14]);
//					settlement.put("payTypeCode", (String)item[15]);
//					settlement.put("payTypeName", (String)item[16]);
//					settlement.put("settleCreateTime", (Date)item[17]);
//					// 添加结算单到已有订单
//					JSONObject order = (JSONObject)ordersJson.get(orderIdx.get(orderId));
//					((JSONArray)order.get("settlements")).add(settlement);
//				}
//			}
//			
//			// 将HIS预存明细与订单建立关联
//			for (int j = hisDetail.size() - 1 ; j >= 0 ; j--) {
//				Object[] item = hisDetail.get(j);
//				String itemId = String.valueOf((BigDecimal)item[0]);
//				String patientNo = (String)item[1];
//				String ycdm = (String)item[2];
//				String channel = (String)item[3];
//				BigDecimal amt = (BigDecimal)item[4];
//				String status = (String)item[5];
//				Date optTime = (Date)item[6];
//				String source = (String)item[7];
//				// 组合HIS预存明细json对象
//				JSONObject itemJson = new JSONObject();
//				itemJson.put("itemId", itemId);
//				itemJson.put("patientNo", patientNo);
//				itemJson.put("ycdm", ycdm);
//				itemJson.put("channel", channel);
//				itemJson.put("amt", amt);
//				itemJson.put("status", status);
//				itemJson.put("optTime", optTime);
//				itemJson.put("source", source);
//				
//				// 明细在订单列表中存在
//				if (null != bizNoIdx.get(itemId)) {
//					JSONObject order = (JSONObject)ordersJson.get(bizNoIdx.get(itemId));
//					order.put("his", itemJson);
//				} else {
//					JSONObject blankOrder = new JSONObject();
//					blankOrder.put("patientNo", patientNo);
//					blankOrder.put("patientName", patientsMap.get(patientNo).get("patientName"));
//					blankOrder.put("settlements", new JSONArray());
//					blankOrder.put("his", itemJson);
//					ordersJson.add(j, blankOrder);
//				}
//			}
//			
//			return ResultUtils.renderSuccessResult(ordersJson);
//		} catch (Exception e) {
//			e.printStackTrace();
//			return ResultUtils.renderFailureResult("查询订单及结算单信息出错！");
//		}
//	}
	
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
			if (patients.size() == 0) {
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
			// 查询订单
			StringBuffer jql = new StringBuffer("");
			List<Object> values = new ArrayList<Object>();
			jql.append("from Order where createTime > ? and createTime < ? and patientNo in (" + patientIds + ") and orderDesc != '门诊收费' and bizType = '00' order by createTime desc");
			values.add(DateUtils.string2Date(startDate + " 00:00:00", DateUtils.DATE_PATTERN_DASH_YYYYMMDD_HHMMSS));
			values.add(DateUtils.string2Date(endDate + " 23:59:59", DateUtils.DATE_PATTERN_DASH_YYYYMMDD_HHMMSS));
			List<Order> oList = this.orderManager.find(jql.toString(), values.toArray());
			
			// 查询结算单
			for(Order order : oList){
				jql = new StringBuffer("");
				values = new ArrayList<Object>();
				jql.append("from Settlement where order.id = ? order by createTime");
				values.add(order.getId());
				List<Settlement> sList = this.settlementManager.find(jql.toString(), values.toArray());
				order.setSettlements(sList);
			}
			// 查询HIS预存记录
			for(Order order : oList){
				if(StringUtils.isEmpty(order.getBizNo())){
					order.getVariables().put("his", null);
				} else {
					PrestoreDetailHis pds = this.prestoreDetailHisManager.get(Integer.valueOf(order.getBizNo()));
					order.getVariables().put("his", pds);
				}
			}
			return ResultUtils.renderSuccessResult(oList);
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
	private List<HashMap<String, Object>> findPatientInfo(String queryJson, boolean preciseQueryByName) {
		try {
			// 查询条件
			JSONObject query = JSONObject.parseObject(queryJson);
			String patientId = query.getString("patientId");
			String patientIdNo = query.getString("patientIdNo");
			String patientMobile = query.getString("patientMobile");
			String patientName = query.getString("patientName");
			
			if (StringUtils.isEmpty(queryJson) && StringUtils.isEmpty(patientId) 
					&& StringUtils.isEmpty(patientIdNo) && StringUtils.isEmpty(patientMobile) 
					&& StringUtils.isEmpty(patientName)) {
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
