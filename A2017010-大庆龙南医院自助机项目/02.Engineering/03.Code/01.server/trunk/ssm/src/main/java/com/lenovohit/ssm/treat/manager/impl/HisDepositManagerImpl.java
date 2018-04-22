package com.lenovohit.ssm.treat.manager.impl;

import java.io.UnsupportedEncodingException;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;

import com.lenovohit.core.manager.GenericManager;
import com.lenovohit.core.utils.DateUtils;
import com.lenovohit.ssm.base.model.SmsMessage;
import com.lenovohit.ssm.base.utils.SmsMessageUtils;
import com.lenovohit.ssm.payment.model.Order;
import com.lenovohit.ssm.payment.model.PayAccount;
import com.lenovohit.ssm.payment.model.Settlement;
import com.lenovohit.ssm.payment.support.singleePay.model.SingleePayResponse;
import com.lenovohit.ssm.treat.dao.HisRestDao;
import com.lenovohit.ssm.treat.manager.HisDepositManager;
import com.lenovohit.ssm.treat.manager.HisPatientManager;
import com.lenovohit.ssm.treat.model.ConsumeRecord;
import com.lenovohit.ssm.treat.model.DepositRecord;
import com.lenovohit.ssm.treat.model.HisOrder;
import com.lenovohit.ssm.treat.model.Patient;
import com.lenovohit.ssm.treat.transfer.dao.RestEntityResponse;
import com.lenovohit.ssm.treat.transfer.dao.RestListResponse;
import com.lenovohit.ssm.treat.transfer.dao.RestRequest;
import com.lenovohit.ssm.treat.transfer.manager.HisEntityResponse;
import com.lenovohit.ssm.treat.transfer.manager.HisListResponse;
import com.lenovohit.ssm.treat.transfer.manager.HisResponse;

public class HisDepositManagerImpl implements HisDepositManager{
	@Autowired
	private HisRestDao hisRestDao;
	@Autowired
	private HisPatientManager hisPatientManager;
	@Autowired
	private GenericManager<SmsMessage, String> smsMessageManager;
	
	@Override
	public HisEntityResponse<Patient> openDeposit(Patient patient) {
		// TODO Auto-generated method stub
		return null;
	}
	/************************充值业务回调********************************/
	@Override
	public HisEntityResponse<DepositRecord> wxAlipayRecharge(Order order, Settlement settle) {
	    Map<String, Object> reqMap = new HashMap<String, Object>();
	    //入参字段映射 
	    putNullToMap(reqMap, "PatientNo", order.getPatientNo());
	    putNullToMap(reqMap, "PaymentWay", StringUtils.equals(settle.getPayChannelCode(), "9999")?"1":"2");
	    putNullToMap(reqMap, "OutTradeNo", settle.getTradeNo());
	    putNullToMap(reqMap, "Amount", order.getRealAmt());
	    putNullToMap(reqMap, "UserId", settle.getPayerAccount());
	    putNullToMap(reqMap, "BuyerLogonId", settle.getPayerLogin());
	    putNullToMap(reqMap, "PaymentTime", DateUtils.date2String(order.getTranTime(), DateUtils.DATE_PATTERN_DASH_YYYYMMDD_HHMMSS));
	    putNullToMap(reqMap, "NotifySource", "ZZJ");
	    putNullToMap(reqMap, "SourceType", StringUtils.equals(settle.getPayChannelCode(), "9999")?"Z":"W");
	    putNullToMap(reqMap, "ADFlag", "");
		   
        RestEntityResponse response = hisRestDao.postForEntity("PATIENT0061", RestRequest.SEND_TYPE_POST, reqMap);
        Map<String, Object> resMap = response.getEntity();
        HisEntityResponse<DepositRecord> reuslt =new  HisEntityResponse<DepositRecord>(response);
        if(response.isSuccess() && null != resMap){
        	DepositRecord  depositRecord = new DepositRecord();
        	depositRecord.setSerialNumber(object2String(resMap.get("HisTradeNo")));
				
			reuslt.setEntity(depositRecord);
		}
        
        return reuslt;
	}

	@Override
	public HisEntityResponse<DepositRecord> cashRecharge(Order order, Settlement settle) {
	    Map<String, Object> reqMap = new HashMap<String, Object>();
	    //入参字段映射 
	    putNullToMap(reqMap, "PatientNO", order.getPatientNo());
	    putNullToMap(reqMap, "Bankcode", order.getMachineMngCode());
	    putNullToMap(reqMap, "MachineCode", order.getMachineCode());
	    putNullToMap(reqMap, "HisUserid", order.getMachineUser());
	    putNullToMap(reqMap, "AreaCode", order.getHisNo());
	    putNullToMap(reqMap, "Amount", order.getRealAmt());
	    putNullToMap(reqMap, "SourceType", order.getMachineMngCode());
	    putNullToMap(reqMap, "ADFlag", "");

	    RestEntityResponse response = hisRestDao.postForEntity("PRESTORE0002", RestRequest.SEND_TYPE_POST, reqMap);
        HisEntityResponse<DepositRecord> reuslt = new  HisEntityResponse<DepositRecord>(response);
	    Map<String, Object> resMap = response.getEntity();
        if(response.isSuccess() && null != resMap){
        	DepositRecord  depositRecord = new DepositRecord();
        	depositRecord.setBalance(object2String(resMap.get("Balance")));
        	depositRecord.setPaymentTime(object2String(resMap.get("DepositDate")));
        	depositRecord.setSerialNumber(object2String(resMap.get("SerialNumber")));
				
        	reuslt.setEntity(depositRecord);
		}
		
        return reuslt;
	}

	@Override
	public HisEntityResponse<DepositRecord> cardRecharge(Order order, Settlement settle) {
	    Map<String, Object> reqMap = new HashMap<String, Object>();
	    SingleePayResponse unionPay;
		try {
			unionPay = new SingleePayResponse(settle.getRespText());
		} catch (UnsupportedEncodingException e) {
			e.printStackTrace();
			HisEntityResponse<DepositRecord> reuslt = new HisEntityResponse<DepositRecord>();
			reuslt.setResultcode("-1");
			return reuslt;
		}
		
	    //入参字段映射 
	    putNullToMap(reqMap, "PatientNO", order.getPatientNo());// 患者编号
	    putNullToMap(reqMap, "Bankcode", settle.getPayChannelCode());
	    putNullToMap(reqMap, "merchanetname", unionPay.getMid());
	    putNullToMap(reqMap, "terminalname", settle.getTerminalCode());//POS 终端号//unionPay.getTid()
	    putNullToMap(reqMap, "batchno", unionPay.getBatch());
	    putNullToMap(reqMap, "Account", settle.getPayerAccount());//unionPay.getCardNo()
	    putNullToMap(reqMap, "Amount", order.getRealAmt());//unionPay.getAmount()
	    putNullToMap(reqMap, "CardType", settle.getPayerAcctType()); // TODO unionPay.getCardType()
	    putNullToMap(reqMap, "CardBankcode", settle.getPayerAcctBank().substring(0, 4));// HIS只需要前4位
	    putNullToMap(reqMap, "referno", settle.getTradeNo());//银行流水   unionPay.getRef()
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
	    
	    RestEntityResponse response = hisRestDao.postForEntity("PRESTORE0004", RestRequest.SEND_TYPE_POST, reqMap);
        HisEntityResponse<DepositRecord> reuslt = new  HisEntityResponse<DepositRecord>(response);
	    Map<String, Object> resMap = response.getEntity();
        if(response.isSuccess() && null != resMap){
        	DepositRecord  depositRecord = new DepositRecord();
        	depositRecord.setBalance(object2String(resMap.get("Balance")));
        	depositRecord.setPaymentTime(object2String(resMap.get("DepositDate")));
        	depositRecord.setSerialNumber(object2String(resMap.get("SerialNumber")));
				
        	reuslt.setEntity(depositRecord);
		}
		
        return reuslt;
	}
	/************************充值消费历史查询*******************************/
	
	@Override
	public HisListResponse<DepositRecord> rechargeRecords(Patient param){
	    Map<String, Object> reqMap = new HashMap<String, Object>();
        //入参字段映射
        putNullToMap(reqMap, "PatientNo", param.getNo());
        putNullToMap(reqMap, "StartTime", param.getStartTime());
        putNullToMap(reqMap, "EndTime", param.getEndTime());
        
		RestListResponse response = hisRestDao.postForList("PATIENT0082", RestRequest.SEND_TYPE_LOCATION, reqMap);
		HisListResponse<DepositRecord> reuslt = new  HisListResponse<DepositRecord>(response);
		List<Map<String, Object>> resMaplist = response.getList();
		List<DepositRecord> resList = new ArrayList<DepositRecord>();
		DepositRecord depositRecord = null;
		if(response.isSuccess() && null != resMaplist){
			for(Map<String, Object> resMap : resMaplist){
				depositRecord = new DepositRecord();
				depositRecord.setPatientNo(object2String(resMap.get("PATIENTNO")));
				depositRecord.setPaymentWay(object2String(resMap.get("PAYMENTWAY")));
				depositRecord.setUserId(object2String(resMap.get("ACCOUNT")));
				depositRecord.setAmount(object2String(resMap.get("AMOUNT")));
				depositRecord.setTradeType(object2String(resMap.get("RTYPE")));
				depositRecord.setPaymentTime(object2String(resMap.get("PAYMENTTIME")));
				depositRecord.setStatus(object2String(resMap.get("STATUS")));
				resList.add(depositRecord);
			}
			reuslt.setList(resList);
		}
		
		return reuslt;
	}
	@Override
	public HisListResponse<ConsumeRecord> consumeRecords(Patient param){
	    Map<String, Object> reqMap = new HashMap<String,Object>();
        //入参字段映射
        putNullToMap(reqMap, "PatientNo", param.getNo());
        putNullToMap(reqMap, "EndTime", param.getEndTime());
        putNullToMap(reqMap, "StartTime", param.getStartTime());
        
        RestListResponse response = hisRestDao.postForList("PATIENT009", RestRequest.SEND_TYPE_LOCATION, reqMap);
        HisListResponse<ConsumeRecord> reuslt = new HisListResponse<ConsumeRecord>(response);
        List<ConsumeRecord> resList = new ArrayList<ConsumeRecord>();
        List<Map<String, Object>> resMapList = response.getList();
        ConsumeRecord consumeRecord = null;
		if(null != resMapList){
			for(Map<String, Object> resMap : resMapList){
				consumeRecord = new ConsumeRecord();
				consumeRecord.setPatientNo(object2String(resMap.get("PATIENTNO")));
				consumeRecord.setPatientName(object2String(resMap.get("NAME")));
				consumeRecord.setAmount(object2String(resMap.get("AMOUNT")));
				consumeRecord.setType(object2String(resMap.get("TYPE")));
				consumeRecord.setTime(object2String(resMap.get("TIME")));
				resList.add(consumeRecord);
			}
		}
		reuslt.setList(resList);
		
        return reuslt;
	}
	/**********************************退款相关接口***********************************/
	@Override
	public HisListResponse<PayAccount> rechargeAccounts(Patient param) {
	    Map<String, Object> reqMap = new HashMap<String, Object>();
        //入参字段映射
        putNullToMap(reqMap, "PatientNo", param.getNo());
        
		RestListResponse response = hisRestDao.postForList("PRESTORE0010", RestRequest.SEND_TYPE_LOCATION, reqMap);
		HisListResponse<PayAccount> reuslt =new  HisListResponse<PayAccount>(response);
		List<Map<String, Object>> resMaplist = response.getList();
		List<PayAccount> resList = new ArrayList<PayAccount>();
		PayAccount account = null;
		String _account = "";
		if(response.isSuccess() && null != resMaplist){
			for(Map<String, Object> resMap : resMaplist){
				account = new PayAccount();
				account.setPatientNo(object2String(resMap.get("PATIENTNO")));
				account.setAccType(object2String(resMap.get("PAYMENTWAY")));
				account.setCardBank(object2String(resMap.get("CARDBANKCODE")));
				account.setCardType(object2String(resMap.get("CARDTYPE")));
				if("1".equals(object2String(resMap.get("PAYMENTWAY"))) || "2".equals(object2String(resMap.get("PAYMENTWAY")))){
					_account = object2String(resMap.get("ACCOUNT"));
					if(_account.split("   ").length != 2){
						account.setAccNo(object2String(resMap.get("ACCOUNT")));
						account.setAccId(object2String(resMap.get("ACCOUNT")));
					}
					account.setAccNo(_account.split("   ")[0]);
					account.setAccId(_account.split("   ")[1]);
				} else {
					account.setAccNo(object2String(resMap.get("ACCOUNT")));
					account.setAccId(object2String(resMap.get("ACCOUNT")));
				}
				
				resList.add(account);
			}
			reuslt.setList(resList);
		}
		
		return reuslt;
	}
	
	@Override
	public HisEntityResponse<BigDecimal> rechargeCreditIn50(Patient param) {
	    Map<String, Object> reqMap = new HashMap<String, Object>();
        //入参字段映射
        putNullToMap(reqMap, "PatientNo", param.getNo());
        
		 RestEntityResponse response = hisRestDao.postForEntity("PRESTORE0013", RestRequest.SEND_TYPE_LOCATION, reqMap);
	        HisEntityResponse<BigDecimal> reuslt = new HisEntityResponse<BigDecimal>(response);
		    Map<String, Object> resMap = response.getEntity();
	        if(response.isSuccess() && null != resMap){
	        	reuslt.setEntity(new BigDecimal(StringUtils.isEmpty(object2String(resMap.get("CZJE50")))?"0":object2String(resMap.get("CZJE50"))));
			}
			
	        return reuslt;
	}
	
	@Override
	public HisListResponse<HisOrder> rechargeDetails(HisOrder param) {
	    Map<String, Object> reqMap = new HashMap<String, Object>();
        //入参字段映射
	    putNullToMap(reqMap, "PatientNo", param.getPatientNo());
	    putNullToMap(reqMap, "StartTime", param.getStartTime());
	    putNullToMap(reqMap, "EndTime", param.getEndTime());
	    putNullToMap(reqMap, "PaymentWay", param.getPaymentWay());
	    putNullToMap(reqMap, "Account", param.getAccount());
        
		RestListResponse response = hisRestDao.postForList("PRESTORE0011", RestRequest.SEND_TYPE_LOCATION, reqMap);
		HisListResponse<HisOrder> reuslt = new  HisListResponse<HisOrder>(response);
		List<Map<String, Object>> resMaplist = response.getList();
		List<HisOrder> resList = new ArrayList<HisOrder>();
		HisOrder hisOrder = null;
		if(response.isSuccess() && null != resMaplist){
			for(Map<String, Object> resMap : resMaplist){
				hisOrder = new HisOrder();
				hisOrder.setPatientNo(object2String(resMap.get("PATIENTNO")));
				hisOrder.setPaymentWay(object2String(resMap.get("PAYMENTWAY")));
				hisOrder.setAccount(object2String(resMap.get("ACCOUNT")));
				hisOrder.setCardType(object2String(resMap.get("CARDTYPE")));
				hisOrder.setCardBankCode(object2String(resMap.get("CARDBANKCODE")));
				hisOrder.setRecharge(object2String(resMap.get("RECHARGE")));
				hisOrder.setRefund(object2String(resMap.get("REFUND")));
				hisOrder.setOutTradeNo(object2String(resMap.get("OUTTRADENO")));
				hisOrder.setRechargeNumber(object2String(resMap.get("RECORDNUMBER")));
				hisOrder.setPaymentTime(object2String(resMap.get("PAYMENTTIME")));
				hisOrder.setNotifySource(object2String(resMap.get("NOTIFYSOURCE")));
				
				resList.add(hisOrder);
			}
			reuslt.setList(resList);
		}
		
		return reuslt;
	}

	@Override
	public HisResponse depositState() {
	    Map<String, Object> reqMap = new HashMap<String, Object>();
	    //入参字段映射 
	    
	    RestEntityResponse response = hisRestDao.postForEntity("PRESTORE0009", RestRequest.SEND_TYPE_POST, reqMap);
	    HisResponse result = new HisResponse(response);
		
	    return result;
	}

	@Override
	public HisEntityResponse<HisOrder> freezeRefund(Order order, Settlement settle) {
	    Map<String, Object> reqMap = new HashMap<String, Object>();
	    //入参字段映射 
	    putNullToMap(reqMap, "PatientNo", order.getPatientNo());
	    putNullToMap(reqMap, "recorderNumber", order.getBizNo());
	    putNullToMap(reqMap, "Account", settle.getPayerAccount());
	    putNullToMap(reqMap, "CardType", settle.getPayerAcctType());
	    putNullToMap(reqMap, "Bankcode_zzj", settle.getMachineMngCode());
	    putNullToMap(reqMap, "Bankcode", settle.getPayChannelCode());
	    putNullToMap(reqMap, "Amount", settle.getAmt());
	    putNullToMap(reqMap, "MachineCode", settle.getMachineCode());
	    putNullToMap(reqMap, "AreaCode", order.getHisNo());
	    putNullToMap(reqMap, "HisUserid", order.getMachineUser());
		putNullToMap(reqMap, "PaymentWay", "9999".equals(settle.getPayChannelCode()) ? "1"
				: "9998".equals(settle.getPayChannelCode()) ? "2" : "0");
	    putNullToMap(reqMap, "NotifySource", "ZZJ");
	    putNullToMap(reqMap, "SourceType", "9999".equals(settle.getPayChannelCode()) ? "Z"
				: "9998".equals(settle.getPayChannelCode()) ? "W" : settle.getPayChannelCode());
	    
	    RestEntityResponse response = hisRestDao.postForEntity("PRESTORE0005", RestRequest.SEND_TYPE_POST, reqMap);
	    HisEntityResponse<HisOrder> reuslt = new HisEntityResponse<HisOrder>(response);
	    Map<String, Object> resMap = response.getEntity();
        if(response.isSuccess() && null != resMap){
        	HisOrder hisOrder = new HisOrder();

        	hisOrder.setBalance(object2String(resMap.get("Balance")));
        	hisOrder.setFrozenTime(object2String(resMap.get("DepositDate")));
        	hisOrder.setFrozenNumber(object2String(resMap.get("FrozenNumber")));
        	reuslt.setEntity(hisOrder);
		}
		
        return reuslt;
	}

	
	@Override
	public HisEntityResponse<HisOrder> confirmRefund(Order order, Settlement settle) {
	    Map<String, Object> reqMap = new HashMap<String, Object>();
	    //入参字段映射 
	    putNullToMap(reqMap, "PatientNo", order.getPatientNo());
	    putNullToMap(reqMap, "FrozenNumber", order.getBizNo());
	    putNullToMap(reqMap, "BANKSEQUENCE", settle.getTradeNo());
	    putNullToMap(reqMap, "BankDate", DateUtils.date2String(settle.getTradeTime(), "yyyyMMdd"));
	    putNullToMap(reqMap, "BankTime", DateUtils.date2String(settle.getTradeTime(), "HHmmss"));
	    putNullToMap(reqMap, "HisUserid", order.getMachineUser());
	    
	    RestEntityResponse response = hisRestDao.postForEntity("PRESTORE0006", RestRequest.SEND_TYPE_POST, reqMap);
	    HisEntityResponse<HisOrder> reuslt = new HisEntityResponse<HisOrder>(response);
		
        return reuslt;
    }

	@Override
	public HisEntityResponse<HisOrder> unfreezeRefund(Order order, Settlement settle) {
	    Map<String, Object> reqMap = new HashMap<String, Object>();
	    //入参字段映射 
	    putNullToMap(reqMap, "PatientNo", order.getPatientNo());
	    putNullToMap(reqMap, "FrozenNumber", order.getBizNo());
		putNullToMap(reqMap, "PaymentWay", "9999".equals(settle.getPayChannelCode()) ? "1"
				: "9998".equals(settle.getPayChannelCode()) ? "2" : "0");
	    putNullToMap(reqMap, "NotifySource", "ZZJ");
	    putNullToMap(reqMap, "HisUserid", order.getMachineUser());
	    putNullToMap(reqMap, "SourceType", "9999".equals(settle.getPayChannelCode()) ? "Z"
				: "9998".equals(settle.getPayChannelCode()) ? "W" : settle.getPayChannelCode());
	    
	    RestEntityResponse response = hisRestDao.postForEntity("PRESTORE0007", RestRequest.SEND_TYPE_POST, reqMap);
	    HisEntityResponse<HisOrder> reuslt = new HisEntityResponse<HisOrder>(response);
	    Map<String, Object> resMap = response.getEntity();
        if(response.isSuccess() && null != resMap){
        	HisOrder  hisOrder = new HisOrder();
        	hisOrder.setBalance(object2String(resMap.get("Balance")));
        	hisOrder.setPaymentTime(object2String(resMap.get("DepositDate")));
        	hisOrder.setRechargeNumber(object2String(resMap.get("SerialNumber")));
				
        	reuslt.setEntity(hisOrder);
		}
		
        return reuslt;
	}
	
	@Override
	public HisEntityResponse<HisOrder> cancelRefund(Order order, Settlement settle) {
	    Map<String, Object> reqMap = new HashMap<String, Object>();
	    //入参字段映射 
	    putNullToMap(reqMap, "PatientNo", order.getPatientNo());
	    putNullToMap(reqMap, "FrozenNumber", order.getBizNo());
	    putNullToMap(reqMap, "HISUSEID", order.getMachineUser());
	    
	    RestEntityResponse response = hisRestDao.postForEntity("PRESTORE0014", RestRequest.SEND_TYPE_POST, reqMap);
	    HisEntityResponse<HisOrder> reuslt = new HisEntityResponse<HisOrder>(response);
		
        return reuslt;
	}
	
	/****************************业务回调入口***********************************/
	@Override
	public HisResponse bizAfterPay(Order order, Settlement settle) {
		HisResponse hisResponse = null;
		if ("ssm".equals(settle.getPayTypeCode())) {//
			hisResponse =  this.cardRecharge(order, settle);
		}
		if ("0000".equals(settle.getPayChannelCode())) {//
			hisResponse =  this.cashRecharge(order, settle);
		}
		if ("9998".equals(settle.getPayChannelCode()) || "9999".equals(settle.getPayChannelCode())) {//
			hisResponse = this.wxAlipayRecharge(order, settle);
		}
		
		try{//发送充值短信
			if(null != hisResponse && hisResponse.isSuccess()){
				Patient _patient = new Patient();
				_patient.setNo(order.getPatientNo());
				HisEntityResponse<Patient>  miPatientResponse = hisPatientManager.getPatientByPatientNo(_patient);
				
				SmsMessage _msMessage = new SmsMessage();
				buildRechargeSmsMessage(_msMessage, order, miPatientResponse.getEntity());
				if(!StringUtils.isBlank(_msMessage.getMobile()) && !StringUtils.isBlank(_msMessage.getContent())){
					SmsMessageUtils.sendMsg(_msMessage.getMobile(), _msMessage.getContent(), null);
					this.smsMessageManager.save(_msMessage);
				}
			}
		}catch(Exception e){
			e.printStackTrace();
		}
		return hisResponse;
	}
	
	@Override
	public HisResponse bizAfterRefund(Order order, Settlement settle) {
		if(StringUtils.equals(Order.ORDER_STAT_REFUND_SUCCESS, order.getStatus())){
			return this.confirmRefund(order, settle);
		} else if(StringUtils.equals(Order.ORDER_STAT_REFUND_FAILURE, order.getStatus()) 
				|| StringUtils.equals(Order.ORDER_STAT_REFUND_CANCELED, order.getStatus())){
			HisEntityResponse<HisOrder> hisResponse = this.unfreezeRefund(order, settle);
			if(null != hisResponse && hisResponse.isSuccess()){
				Patient _patient = new Patient();
				_patient.setNo(order.getPatientNo());
				HisEntityResponse<Patient>  miPatientResponse = hisPatientManager.getPatientByPatientNo(_patient);
				
				SmsMessage _msMessage = new SmsMessage();
				buildSmsMessage(_msMessage, order, miPatientResponse.getEntity());
				if(!StringUtils.isBlank(_msMessage.getMobile()) && !StringUtils.isBlank(_msMessage.getContent())){
					SmsMessageUtils.sendMsg(_msMessage.getMobile(), _msMessage.getContent(), null);
					this.smsMessageManager.save(_msMessage);
				}
			}
			
			return hisResponse;
		}
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
	private void buildRechargeSmsMessage(SmsMessage message, Order order, Patient patient){
		if (null == message) return;
		if (null == order) return;
		if (StringUtils.isBlank(patient.getTelephone())) return;
		if (StringUtils.isBlank(patient.getNo())) return;
		if (StringUtils.isBlank(patient.getName())) return;
		
		try {
			message.setCode("");
			message.setSendtime(DateUtils.getCurrentDate());
			message.setStatus("0");
			message.setValidNum(0);
			message.setIp("");
			message.setMobile(patient.getTelephone());
			
			String patientName = "*" + patient.getName().substring(1);
			String patientNo = patient.getNo().substring(patient.getNo().length() - 4);
			String tranTime = DateUtils.date2String(order.getCreateTime(), "MM月dd日HH时mm分");
			Double tranAmt = order.getRealAmt().setScale(2, BigDecimal.ROUND_HALF_UP).doubleValue();
			Double balance = patient.getBalance().setScale(2, BigDecimal.ROUND_HALF_UP).doubleValue();
			StringBuffer sb = new StringBuffer("");
			sb.append(patientName).append("【充值】,您尾号").append(patientNo).append("的门诊预存账户于").append(tranTime).append("充值")
					.append(tranAmt).append("元,实际余额").append(balance)
					.append("元,如非本人操作，请尽早到我院挂失。");
			message.setContent(sb.toString());
		} catch (Exception e) {
			e.printStackTrace();
		}
		
	}
	private void buildSmsMessage(SmsMessage message, Order order, Patient patient){
		if (null == message) return;
		if (null == order) return;
		if (StringUtils.isBlank(patient.getTelephone())) return;
		if (StringUtils.isBlank(patient.getNo())) return;
		if (StringUtils.isBlank(patient.getName())) return;
		
		try {
			message.setCode("");
			message.setSendtime(DateUtils.getCurrentDate());
			message.setStatus("0");
			message.setValidNum(0);
			message.setIp("");
			message.setMobile(patient.getTelephone());
			
			String patientName = "*" + patient.getName().substring(1);
			String patientNo = patient.getNo().substring(patient.getNo().length() - 4);
			String tranTime = DateUtils.date2String(order.getCreateTime(), "MM月dd日HH时mm分");
			Double tranAmt = order.getAmt().setScale(2, BigDecimal.ROUND_HALF_UP).doubleValue();
			Double balance = patient.getBalance().setScale(2, BigDecimal.ROUND_HALF_UP).doubleValue();
			StringBuffer sb = new StringBuffer("");
			sb.append(patientName).append("同志,您好,尾号").append(patientNo).append("的门诊预存账户于").append(tranTime).append("退费")
					.append(tranAmt).append("元不成功,钱已退回您的就诊卡,当前余额").append(balance)
					.append("元,如有疑问请登录云南省第一人民医院APP,微信,支付宝查询,或到收费窗口咨询。");
			message.setContent(sb.toString());
		} catch (Exception e) {
			e.printStackTrace();
		}
		
	}
}
