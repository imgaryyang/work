  package com.lenovohit.hwe.pay.web.rest;


import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.lenovohit.core.dao.Page;
import com.lenovohit.core.exception.BaseException;
import com.lenovohit.core.manager.GenericManager;
import com.lenovohit.core.utils.DateUtils;
import com.lenovohit.core.utils.JSONUtils;
import com.lenovohit.core.utils.StringUtils;
import com.lenovohit.core.web.MediaTypes;
import com.lenovohit.core.web.utils.Result;
import com.lenovohit.core.web.utils.ResultUtils;
import com.lenovohit.hwe.org.web.rest.OrgBaseRestController;
import com.lenovohit.hwe.pay.model.PayType;
import com.lenovohit.hwe.pay.model.Settlement;
import com.lenovohit.hwe.pay.service.TradeService;

/**
 * 结算单管理
 * @ClassName: SettlementRestController 
 * @Description: TODO
 * @Compony: Lenovohit
 * @Author: zhangyushuang@lenovohit.com
 * @date 2018年1月18日 下午9:38:56  
 *
 */
@RestController
@RequestMapping("/hwe/pay/settle")
public class SettleRestController extends OrgBaseRestController {

//	@Autowired
//	private GenericManager<Bill, String> billManager;
	@Autowired
	private GenericManager<Settlement, String> settlementManager;
	@Autowired
	private GenericManager<PayType, String> payTypeManager;

	@Autowired
	private TradeService tradeService;
	
	@RequestMapping(value="/",method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8/*TEXT_PLAIN_UTF_8*/)
	public Result forCreate(@RequestBody String data){
		Settlement model =  JSONUtils.deserialize(data, Settlement.class);
		Settlement saved = this.settlementManager.save(model);
		return ResultUtils.renderSuccessResult(saved);
	}

	@RequestMapping(value = "/{id}",method = RequestMethod.PUT, produces = MediaTypes.JSON_UTF_8)
	public Result forUpdate(@PathVariable("id") String id, @RequestBody String data){
		Settlement model = JSONUtils.deserialize(data, Settlement.class);
		if(model == null || StringUtils.isBlank(model.getId())){
			return ResultUtils.renderFailureResult("不存在此对象");
		}
		Settlement saved = this.settlementManager.save(model);
		return ResultUtils.renderSuccessResult(saved);
	}

	@RequestMapping(value = "/{id}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forInfo(@PathVariable("id") String id){
		Settlement model = this.settlementManager.get(id);
		return ResultUtils.renderPageResult(model);
	}
	
	@RequestMapping(value = "/page/{start}/{limit}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forPage(@PathVariable("start") String start, @PathVariable("limit") String limit,
			@RequestParam(value = "data", defaultValue = "") String data){
		Settlement query =  JSONUtils.deserialize(data, Settlement.class);
		StringBuilder jql = new StringBuilder( " from Settlement where 1=1 ");
		List<Object> values = new ArrayList<Object>();
		
		if(!StringUtils.isEmpty(query.getSettleNo())){
			jql.append(" and settleNo = ? ");
			values.add(query.getSettleNo());
		}
		if(!StringUtils.isEmpty(query.getSettleType())){
			jql.append(" and settleType = ? ");
			values.add(query.getSettleType());
		}
		if(!StringUtils.isEmpty(query.getStatus())){
			jql.append(" and status = ? ");
			values.add(query.getStatus());
		}
		
		
		String startDate = query.getStartDate();
		String endDate = query.getEndDate();
		if(StringUtils.isBlank(startDate)){
			startDate = DateUtils.getCurrentDateStr();
		} 
		if(StringUtils.isBlank(endDate)){
			endDate = DateUtils.getCurrentDateStr();
		} 
		jql.append(" and createdAt > ? and createdAt < ? order by createdAt");
		values.add(DateUtils.string2Date(startDate + " 00:00:00", DateUtils.DATE_PATTERN_DASH_YYYYMMDD_HHMMSS));
		values.add(DateUtils.string2Date(endDate + " 23:59:59", DateUtils.DATE_PATTERN_DASH_YYYYMMDD_HHMMSS));
		
		Page page = new Page();
		page.setStart(start);
		page.setPageSize(limit);
		page.setQuery(jql.toString());
		page.setValues(values.toArray());
		
		this.settlementManager.findPage(page);
		return ResultUtils.renderPageResult(page);
	}
	@RequestMapping(value = "/list", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forList(@RequestParam(value = "data", defaultValue = "") String data) {
		Settlement query =  JSONUtils.deserialize(data, Settlement.class);
		StringBuilder jql = new StringBuilder( " from Settlement where 1=1 ");
		List<Object> values = new ArrayList<Object>();
		
		if(!StringUtils.isEmpty(query.getSettleNo())){
			jql.append(" and settleNo = ? ");
			values.add(query.getSettleNo());
		}
		if(!StringUtils.isEmpty(query.getStatus())){
			jql.append(" and status = ? ");
			values.add(query.getStatus());
		}
		
		String startDate = query.getStartDate();
		String endDate = query.getEndDate();
		if(StringUtils.isBlank(startDate)){
			startDate = DateUtils.getCurrentDateStr();
		} 
		if(StringUtils.isBlank(endDate)){
			endDate = DateUtils.getCurrentDateStr();
		} 
		jql.append(" and createdAt > ? and createdAt < ? order by createdAt");
		values.add(DateUtils.string2Date(startDate + " 00:00:00", DateUtils.DATE_PATTERN_DASH_YYYYMMDD_HHMMSS));
		values.add(DateUtils.string2Date(endDate + " 23:59:59", DateUtils.DATE_PATTERN_DASH_YYYYMMDD_HHMMSS));
		
		List<Settlement> settles = this.settlementManager.find(jql.toString(),values.toArray());
		return ResultUtils.renderSuccessResult(settles);
	}
	
	@RequestMapping(value = "/{id}",method = RequestMethod.DELETE, produces = MediaTypes.JSON_UTF_8)
	public Result forRemove(@PathVariable("id") String id){
		try {
			this.settlementManager.delete(id);
		} catch (Exception e) {
			throw new BaseException("删除失败");
		}
		return ResultUtils.renderSuccessResult();
	}
	
	@SuppressWarnings("rawtypes")
	@RequestMapping(value = "/removeAll",method = RequestMethod.DELETE, produces = MediaTypes.JSON_UTF_8)
	public Result forRemoveAll(@RequestBody String data){
		List ids =  JSONUtils.deserialize(data, List.class);
		StringBuilder idSql = new StringBuilder();
		List<String> idvalues = new ArrayList<String>();
		try {
			idSql.append("DELETE FROM PAY_SETTLEMENT WHERE ID IN (");
			for(int i = 0 ; i < ids.size() ; i++) {
				idSql.append("?");
				idvalues.add(ids.get(i).toString());
				if(i != ids.size() - 1) idSql.append(",");
			}
			idSql.append(")");
			this.settlementManager.executeSql(idSql.toString(), idvalues.toArray());
		} catch (Exception e) {
			e.printStackTrace();
			throw new BaseException("删除失败");
		}
		return ResultUtils.renderSuccessResult();
	}
	
	/**
	 * 结算单状态同步
	 * @param settleId 结算单ID或者结算单编号
	 * @return
	 */
	@RequestMapping(value = "/syncState/{settleId}",method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forSyncState(@PathVariable("settleId") String settleId){
		Settlement settle = null;
		try {
			settle = this.settlementManager.get(settleId);
			if(null == settle){
				settle = this.settlementManager.findOne("from Settlement where settleNo = ?", settleId);
			} 
			//1. 结算单同步状态
			buildSyncSateSettlement(settle);
			if(StringUtils.equals(Settlement.SETTLE_TYPE_PAY, settle.getSettleType())){
				tradeService.payQuery(settle);
			} else if(StringUtils.equals(Settlement.SETTLE_TYPE_REFUND, settle.getSettleType())) {
				tradeService.refundQuery(settle);
			}
			return ResultUtils.renderSuccessResult(settle);
		} catch (BaseException be) {
			log.error("同步订单状态失败，结算单号为【"+ settle.getSettleNo() + "】");
			return ResultUtils.renderFailureResult(be.getMessage());
		} catch (Exception e) {
			log.error("同步订单状态失败，结算单号为【"+ settle.getSettleNo() + "】");
			log.error("PayRestController forSyncState exception", e);
			return ResultUtils.renderFailureResult("同步订单状态失败！");
		}
	}
	private void buildSyncSateSettlement(Settlement settle) {
		if (null == settle) {
			throw new NullPointerException("settle should not be NULL!");
		}
//		Bill bill = billManager.get(settle.getBillId());
//		if (null == bill) {
//			throw new NullPointerException("bill should not be NULL!");
//		}
//		settle.setBill(bill);
		PayType payType = payTypeManager.get(settle.getPayTypeId());
		if (null == payType) {
			throw new NullPointerException("payType should not be NULL!");
		}
		settle.setPayType(payType);
	}
}
