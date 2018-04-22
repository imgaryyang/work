package com.lenovohit.ssm.treat.manager.impl;

import java.io.UnsupportedEncodingException;
import java.util.HashMap;
import java.util.Map;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;

import com.lenovohit.core.utils.DateUtils;
import com.lenovohit.ssm.payment.model.Order;
import com.lenovohit.ssm.payment.model.Settlement;
import com.lenovohit.ssm.payment.support.unionPay.model.UnionPayResponse;
import com.lenovohit.ssm.treat.dao.HisRestDao;
import com.lenovohit.ssm.treat.manager.HisForegiftManager;
import com.lenovohit.ssm.treat.model.ForegiftRecord;
import com.lenovohit.ssm.treat.transfer.dao.RestEntityResponse;
import com.lenovohit.ssm.treat.transfer.dao.RestRequest;
import com.lenovohit.ssm.treat.transfer.manager.HisEntityResponse;
import com.lenovohit.ssm.treat.transfer.manager.HisResponse;

public class HisForegiftManagerImpl implements HisForegiftManager{
	@Autowired
	private HisRestDao hisRestDao;
	
	
	@Override
	public HisResponse foregiftState() {
	    Map<String, Object> reqMap = new HashMap<String, Object>();
	    //入参字段映射 
	    
	    RestEntityResponse response = hisRestDao.postForEntity("PRESTORE0009", RestRequest.SEND_TYPE_POST, reqMap);
	    HisResponse result = new HisResponse(response);
		
        return result;
    }

	
	@Override
	public HisEntityResponse<ForegiftRecord> cardRecharge(Order order, Settlement settle) {
	    Map<String, Object> reqMap = new HashMap<String, Object>();
	    UnionPayResponse unionPay;
		try {
			unionPay = new UnionPayResponse(settle.getRespText());
		} catch (UnsupportedEncodingException e) {
			e.printStackTrace();
			HisEntityResponse<ForegiftRecord> reuslt =new  HisEntityResponse<ForegiftRecord>();
			reuslt.setResultcode("-1");
			return reuslt;
		}
	    //入参字段映射 
	    putNullToMap(reqMap, "InpatientID", order.getInpatientId());
	    putNullToMap(reqMap, "Bankcode", settle.getPayChannelCode());
	    putNullToMap(reqMap, "merchanetname", unionPay.getMid());
	    putNullToMap(reqMap, "terminalname", settle.getTerminalCode());
	    putNullToMap(reqMap, "batchno", unionPay.getBatch());
	    putNullToMap(reqMap, "Account", settle.getPayerAccount());
	    putNullToMap(reqMap, "Amount", settle.getAmt());
	    putNullToMap(reqMap, "CardType", settle.getPayerAcctType());
	    putNullToMap(reqMap, "CardBankcode", settle.getPayerAcctBank().substring(0, 4));// HIS只需要前4位
	    putNullToMap(reqMap, "referno", settle.getTradeNo());
	    putNullToMap(reqMap, "voucherno", unionPay.getTrace());
	    putNullToMap(reqMap, "authno", unionPay.getAuth());
	    putNullToMap(reqMap, "BankDate", DateUtils.date2String(settle.getTradeTime(), "yyyyMMdd"));
	    putNullToMap(reqMap, "BankTime", DateUtils.date2String(settle.getTradeTime(), "HHmmss"));
	    putNullToMap(reqMap, "ClearingTime", "");
	    putNullToMap(reqMap, "MachineCode", settle.getMachineCode());
	    putNullToMap(reqMap, "AreaCode", order.getHisNo());
	    putNullToMap(reqMap, "HisUserid", settle.getMachineUser());
	    putNullToMap(reqMap, "localSequence", order.getOrderNo());
	    putNullToMap(reqMap, "ADFlag", "");//对账补录标记，补录数据：1，正常 为空
	    
	    RestEntityResponse response = hisRestDao.postForEntity("PRESTORE0008", RestRequest.SEND_TYPE_POST, reqMap);
	    HisEntityResponse<ForegiftRecord> reuslt =new  HisEntityResponse<ForegiftRecord>(response);
	    Map<String, Object> resMap = response.getEntity();
        if(response.isSuccess() && null != resMap){
        	ForegiftRecord  foregiftRecord = new ForegiftRecord();
        	foregiftRecord.setReceipt(object2String(resMap.get("receipt")));
        	foregiftRecord.setPaymentTime(object2String(resMap.get("PaymentTime")));
        	reuslt.setEntity(foregiftRecord);
		}
		
        return reuslt;
	}
	
	
	@Override
	public HisEntityResponse<ForegiftRecord> balanceRecharge(Order order, Settlement settle) {
		
		 Map<String, Object> reqMap = new HashMap<String, Object>();
		    //入参字段映射 
		    putNullToMap(reqMap, "InpatientID", order.getInpatientId());
		    putNullToMap(reqMap, "PatientNO", order.getPatientNo());
		    putNullToMap(reqMap, "Bankcode", settle.getMachineMngCode());
		    putNullToMap(reqMap, "Amount", order.getRealAmt());
		    putNullToMap(reqMap, "MachineCode", settle.getMachineCode());
		    putNullToMap(reqMap, "AreaCode", order.getHisNo());
		    putNullToMap(reqMap, "HisUserid", order.getMachineUser());
		    putNullToMap(reqMap, "SourceType", settle.getMachineMngCode());
		    
		    RestEntityResponse response = hisRestDao.postForEntity("PRESTORE0003", RestRequest.SEND_TYPE_POST, reqMap);
		    HisEntityResponse<ForegiftRecord> reuslt =new  HisEntityResponse<ForegiftRecord>(response);
		    Map<String, Object> resMap = response.getEntity();
	        if(response.isSuccess() && null != resMap){
	        	ForegiftRecord  foregiftRecord = new ForegiftRecord();
	        	foregiftRecord.setReceipt(object2String(resMap.get("receipt")));
	        	foregiftRecord.setPaymentTime(object2String(resMap.get("PaymentTime")));
	        	reuslt.setEntity(foregiftRecord);
			}
			
	        return reuslt;
	}

	@Override
	public HisResponse bizAfterPay(Order order, Settlement settle) {
		if(Order.BIZ_TYPE_PREPAY .equals(order.getBizType())){
			if ("ssm".equals(settle.getPayTypeCode())) {//
				return this.cardRecharge(order, settle);
			}
			if ("balance".equals(settle.getPayChannelCode())) {//
				return this.balanceRecharge(order, settle);
			}
		}
		return null;
	}

	@Override
	public HisResponse bizAfterRefund(Order order, Settlement settle) {
		return null;
	}
	private void putNullToMap(Map<String, Object> map, String key, Object value){
		if(value == null || StringUtils.isBlank(value.toString())){
			map.put(key, "");
		} else {
			map.put(key, value);
		}
	}
	private String object2String(Object obj){
		return obj==null ? "" : obj.toString();
	}
}
