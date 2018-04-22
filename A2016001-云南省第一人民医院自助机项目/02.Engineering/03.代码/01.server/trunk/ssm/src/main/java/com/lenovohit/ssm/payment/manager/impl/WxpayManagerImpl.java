package com.lenovohit.ssm.payment.manager.impl;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;

import com.lenovohit.core.exception.BaseException;
import com.lenovohit.core.manager.GenericManager;
import com.lenovohit.core.utils.DateUtils;
import com.lenovohit.core.utils.StringUtils;
import com.lenovohit.ssm.payment.hisModel.CheckDetailHis;
import com.lenovohit.ssm.payment.manager.HisManager;
import com.lenovohit.ssm.payment.manager.WxpayManager;
import com.lenovohit.ssm.payment.model.CheckDetailResult;
import com.lenovohit.ssm.payment.model.CheckDetailWxpay;
import com.lenovohit.ssm.payment.model.CheckRecord;
import com.lenovohit.ssm.payment.model.Settlement;
import com.lenovohit.ssm.payment.support.wxPay.WXPay;
import com.lenovohit.ssm.payment.support.wxPay.common.Configure;
import com.lenovohit.ssm.payment.support.wxPay.listener.DefaultDownloadBillBusinessResultListener;
import com.lenovohit.ssm.payment.support.wxPay.listener.DefaultPayCallbackBusinessResultListener;
import com.lenovohit.ssm.payment.support.wxPay.listener.DefaultPrecreateBusinessResultListener;
import com.lenovohit.ssm.payment.support.wxPay.listener.DefaultRefundBusinessResultListener;
import com.lenovohit.ssm.payment.support.wxPay.listener.DefaultRefundQueryBusinessResultListener;
import com.lenovohit.ssm.payment.support.wxPay.listener.DefaultScanPayQueryBusinessResultListener;
import com.lenovohit.ssm.payment.support.wxPay.protocol.downloadbill_protocol.DownloadBillReqData;
import com.lenovohit.ssm.payment.support.wxPay.protocol.pay_callback.PayCallbackResData;
import com.lenovohit.ssm.payment.support.wxPay.protocol.pay_query_protocol.ScanPayQueryReqData;
import com.lenovohit.ssm.payment.support.wxPay.protocol.pay_query_protocol.ScanPayQueryResData;
import com.lenovohit.ssm.payment.support.wxPay.protocol.precreate_protocol.PrecreateReqData;
import com.lenovohit.ssm.payment.support.wxPay.protocol.precreate_protocol.PrecreateResData;
import com.lenovohit.ssm.payment.support.wxPay.protocol.refund_protocol.RefundReqData;
import com.lenovohit.ssm.payment.support.wxPay.protocol.refund_protocol.RefundResData;
import com.lenovohit.ssm.payment.support.wxPay.protocol.refund_query_protocol.RefundOrderData;
import com.lenovohit.ssm.payment.support.wxPay.protocol.refund_query_protocol.RefundQueryReqData;
import com.lenovohit.ssm.payment.support.wxPay.protocol.refund_query_protocol.RefundQueryResData;

public class WxpayManagerImpl extends WxpayManager {
    private static Log                  log = LogFactory.getLog(WxpayManagerImpl.class);

    @Autowired
    private GenericManager<CheckRecord, String> checkRecordManager;
    @Autowired
    private GenericManager<CheckDetailWxpay, String> checkDetailWxpayManager;
    @Autowired
    private HisManager<CheckDetailHis, String> checkDetailHisManager;
    @Autowired
    private GenericManager<CheckDetailResult, String> checkDetailResultManager;    
    @Autowired
    private GenericManager<Settlement, String> settlementManager;
   
	static {
		/**
		 * 一定要在创建WxPay之前调用Configure.init()设置默认参数
		 * Configure会读取classpath下的wxinfo.properties文件配置信息，
		 * 如果找不到该文件则确认该文件是否在classpath目录
		 */
		Configure.init("wxinfo.properties");
	}
	
    @Override
	public void precreate(Settlement settlement) {
    	PrecreateReqData precreateReqData = new PrecreateReqData(
    			settlement.getSettleTitle(),
    			"ZZJ",
    			settlement.getSettleNo(),
    			settlement.getAmt().multiply(new BigDecimal(100)).intValue(),
    			settlement.getMachineId(),
    			Configure.getIP(),
    			DateUtils.date2String(settlement.getCreateTime(), "yyyyMMddHHmmss"),
    			DateUtils.date2String(DateUtils.addSecond(settlement.getCreateTime(), Configure.getTradeOutTime()), "yyyyMMddHHmmss"),
    			"",
    			Configure.getLocalDomain() + Configure.getPayCallbackUrl() + settlement.getId());
    	DefaultPrecreateBusinessResultListener resultListener = new DefaultPrecreateBusinessResultListener();
    	PrecreateResData precreateResData = null;
		try {
			WXPay.doPrecreateBusiness(precreateReqData, resultListener);
			precreateResData = resultListener.getPrecreateResData();
			switch (resultListener.getResult()) {
	            case DefaultPrecreateBusinessResultListener.ON_PRECREATE_SUCCESS:
	                settlement.setQrCode(precreateResData.getCode_url());
	                settlement.setTradeStatus(Settlement.SETTLE_TRADE_INITIAL);
	                settlement.setTradeTime(DateUtils.getCurrentDate());
	                settlement.setTradeRspCode(precreateResData.getReturn_code());
		    		settlement.setTradeRspMsg(precreateResData.getReturn_msg());
		    		settlement.setRespText(precreateResData.getResponseString());
		    		log.info("微信扫码支付-统一下单成功: )");
	                break;
	                
	            case DefaultPrecreateBusinessResultListener.ON_FAIL_BY_RETURN_CODE_ERROR:
	            case DefaultPrecreateBusinessResultListener.ON_FAIL_BY_RETURN_CODE_FAIL:
	            case DefaultPrecreateBusinessResultListener.ON_FAIL_BY_SIGN_INVALID:
	            case DefaultPrecreateBusinessResultListener.ON_PRECREATE_FAIL:
	            	settlement.setStatus(Settlement.SETTLE_STAT_CLOSED);
	                settlement.setTradeStatus(Settlement.SETTLE_TRADE_CLOSED);
	                settlement.setTradeTime(DateUtils.getCurrentDate());
	                settlement.setTradeRspCode(precreateResData.getReturn_code());
		    		settlement.setTradeRspMsg(precreateResData.getReturn_msg());
		    		settlement.setRespText(precreateResData.getResponseString());
		    		log.error("微信扫码支付-统一下单失败，交易关闭，错误原因【" + resultListener.getResult() + "】");
	                break;
	        }
		} catch (Exception e) {
			e.printStackTrace();
			settlement.setStatus(Settlement.SETTLE_STAT_CLOSED);
			settlement.setTradeStatus(Settlement.SETTLE_TRADE_EXCEPTIONAL);
			settlement.setTradeTime(DateUtils.getCurrentDate());
        	settlement.setTradeRspCode("40004");
    		settlement.setTradeRspMsg("系统处理错误！");
			log.error("微信扫码支付-统一下单系统异常，预下单状态未知，交易关闭!!!");
		}
	}
    
    @Override
	public void payCallBack(Settlement settlement) {
    	log.info(settlement.getFlag() + "处理微信回调开始");
    	String responseStr = (String)settlement.getVariables().get("responseStr");
    	PayCallbackResData payCallbackResData = (PayCallbackResData)settlement.getVariables().get("responseObject");
    	settlement.setRespText(responseStr);
    	DefaultPayCallbackBusinessResultListener resultListener = new DefaultPayCallbackBusinessResultListener();
		try {
			payCallbackResData.setResponseString(responseStr);
			WXPay.doPayCallbackBusiness(payCallbackResData, resultListener);

	    	log.info(settlement.getFlag() + "处理微信回调WXPay解析完成");
			switch (resultListener.getResult()) {
	            case DefaultPayCallbackBusinessResultListener.ON_PAY_CALLBACK_SUCCESS:
	            	settlement.setStatus(Settlement.SETTLE_STAT_PAY_SUCCESS);
					settlement.setPayerAccount(payCallbackResData.getOpenid());
					settlement.setTradeNo(payCallbackResData.getTransaction_id());
					settlement.setTradeStatus(Settlement.SETTLE_TRADE_SUCCESS);
					settlement.setTradeTime(DateUtils.string2Date(payCallbackResData.getTime_end(), "yyyyMMddHHmmss"));
					settlement.setTradeRspCode(payCallbackResData.getReturn_code());
		    		settlement.setTradeRspMsg(payCallbackResData.getReturn_msg());
		    		settlement.setRespText(payCallbackResData.getResponseString());
		    		log.info("微信扫码支付-支付成功: )");
	                break;
	                
	            case DefaultPayCallbackBusinessResultListener.ON_FAIL_BY_RETURN_CODE_ERROR:
	            case DefaultPayCallbackBusinessResultListener.ON_FAIL_BY_RETURN_CODE_FAIL:
	            case DefaultPayCallbackBusinessResultListener.ON_FAIL_BY_SIGN_INVALID:
	            case DefaultPayCallbackBusinessResultListener.ON_PAY_CALLBACK_FAIL:
	            	settlement.setStatus(Settlement.SETTLE_STAT_PAY_FAILURE);
	                settlement.setTradeStatus(Settlement.SETTLE_TRADE_FAILURE);
	                settlement.setTradeTime(DateUtils.string2Date(payCallbackResData.getTime_end(), "yyyyMMddHHmmss"));
		    		settlement.setRespText(payCallbackResData.getResponseString());
	                log.error("微信扫码支付-支付失败，错误原因【" + resultListener.getResult() + "】");
	                break;
	        }
			
			if(!StringUtils.isBlank(payCallbackResData.getOut_trade_no()) && 
					!StringUtils.equals(payCallbackResData.getOut_trade_no(), settlement.getSettleNo())){
				settlement.setStatus(Settlement.SETTLE_STAT_EXCEPTIONAL);
				settlement.setTradeStatus(Settlement.SETTLE_TRADE_EXCEPTIONAL);
	            settlement.setTradeTime(DateUtils.getCurrentDate());
	        	settlement.setTradeRspCode("40004");
	    		settlement.setTradeRspMsg("inconsistent data between the out_trade_no and settleNo!");
                log.error("inconsistent data between the out_trade_no and settleNo!");
                return;
			}
			if(!StringUtils.isBlank(payCallbackResData.getTotal_fee())){
	    		int total_fee = settlement.getAmt().multiply(new BigDecimal(100)).intValue();
	    		if(total_fee != Integer.valueOf(payCallbackResData.getTotal_fee())){
	    			settlement.setStatus(Settlement.SETTLE_STAT_EXCEPTIONAL);
	    			settlement.setTradeStatus(Settlement.SETTLE_TRADE_EXCEPTIONAL);
	                settlement.setTradeTime(DateUtils.getCurrentDate());
	            	settlement.setTradeRspCode("40004");
	        		settlement.setTradeRspMsg("inconsistent data between the total_amount and amt!！");
	                log.error("inconsistent data between the total_amount and amt!！");
	    		}
	    		
				settlement.setRealAmt(new BigDecimal(payCallbackResData.getTotal_fee()).multiply(new BigDecimal(0.01)));//记录结算单真实发生金额
	    	}
		} catch (Exception e) {
			settlement.setStatus(Settlement.SETTLE_STAT_EXCEPTIONAL);
			settlement.setTradeStatus(Settlement.SETTLE_TRADE_EXCEPTIONAL);
            settlement.setTradeTime(DateUtils.getCurrentDate());
        	settlement.setTradeRspCode("40004");
    		settlement.setTradeRspMsg("系统处理错误！");
            log.error("微信扫码支付-支付回调系统异常，结算单号为【" + settlement.getSettleNo() + "】");
			e.printStackTrace();
		}
		log.info(settlement.getFlag() + "处理微信回调结束");
    }
    
    @Override
	public void refund(Settlement settlement) {

		RefundReqData refundReqData = new RefundReqData(
    			settlement.getTradeNo(),
    			"",
    			settlement.getMachineId(),
    			settlement.getSettleNo(),
    			settlement.getOriAmt().multiply(new BigDecimal(100)).intValue(),
    			settlement.getAmt().multiply(new BigDecimal(100)).intValue(),
    			Configure.getMchid(),
    			"CNY");
    	DefaultRefundBusinessResultListener resultListener = new DefaultRefundBusinessResultListener();
    	RefundResData refundResData = null;
		try {
			WXPay.doRefundBusiness(refundReqData, resultListener);
			refundResData = resultListener.getRefundResData();

			switch (resultListener.getResult()) {
	            case DefaultRefundBusinessResultListener.ON_REFUND_SUCCESS:
	            	settlement.setStatus(Settlement.SETTLE_STAT_REFUND_SUCCESS);
            		settlement.setTradeNo(refundResData.getRefund_id());
	            	settlement.setTradeStatus(Settlement.SETTLE_TRADE_SUCCESS);
	            	settlement.setTradeTime(DateUtils.getCurrentDate());
	                settlement.setTradeRspCode(refundResData.getReturn_code());
		    		settlement.setTradeRspMsg(refundResData.getReturn_msg());
		    		settlement.setRespText(refundResData.getResponseString());
		    		log.info("微信扫码支付-退款成功: )");
	                break;
	                
	            case DefaultRefundBusinessResultListener.ON_FAIL_BY_RETURN_CODE_ERROR:
	            case DefaultRefundBusinessResultListener.ON_FAIL_BY_RETURN_CODE_FAIL:
	            case DefaultRefundBusinessResultListener.ON_FAIL_BY_SIGN_INVALID:
	            case DefaultRefundBusinessResultListener.ON_REFUND_FAIL:
	            	settlement.setStatus(Settlement.SETTLE_STAT_REFUND_FAILURE);
	                settlement.setTradeStatus(Settlement.SETTLE_TRADE_FAILURE);
		    		settlement.setRespText(refundResData.getResponseString());
		    		log.error("微信扫码支付-退款失败，错误原因【" + resultListener.getResult() + "】");
	                break;
	        }
			
			if(!StringUtils.isBlank(refundResData.getOut_refund_no()) && 
	    			!StringUtils.equals(refundResData.getOut_refund_no(), settlement.getSettleNo())){
				settlement.setStatus(Settlement.SETTLE_STAT_EXCEPTIONAL);
				settlement.setTradeStatus(Settlement.SETTLE_TRADE_EXCEPTIONAL);
	            settlement.setTradeTime(DateUtils.getCurrentDate());
	        	settlement.setTradeRspCode("40004");
	    		settlement.setTradeRspMsg("inconsistent data between the out_refund_no and settleNo!");
	            log.error("inconsistent data between the out_refund_no and settleNo!");
	            return;
			}
	    	if(!StringUtils.isBlank(refundResData.getRefund_fee())){
	    		int refund_fee = settlement.getAmt().multiply(new BigDecimal(100)).intValue();
	    		if(refund_fee != Integer.valueOf(refundResData.getRefund_fee())){
	    			settlement.setStatus(Settlement.SETTLE_STAT_EXCEPTIONAL);
	    			settlement.setTradeStatus(Settlement.SETTLE_TRADE_EXCEPTIONAL);
	                settlement.setTradeTime(DateUtils.getCurrentDate());
	            	settlement.setTradeRspCode("40004");
	        		settlement.setTradeRspMsg("inconsistent data between the getCurrentDate and amt!！");
	                log.error("inconsistent data between the refund_fee and amt!");
	    		}

				settlement.setRealAmt(new BigDecimal(refundResData.getRefund_fee()).multiply(new BigDecimal(0.01)));//记录结算单真实发生金额
	    	}
		} catch (Exception e) {
			settlement.setStatus(Settlement.SETTLE_STAT_EXCEPTIONAL);
			settlement.setTradeStatus(Settlement.SETTLE_TRADE_EXCEPTIONAL);
            settlement.setTradeTime(DateUtils.getCurrentDate());
        	settlement.setTradeRspCode("40004");
    		settlement.setTradeRspMsg("系统处理错误！");
			log.error("微信扫码支付-退款系统异常，交易状态未知!!!");
			e.printStackTrace();
		}
    }

	@Override
	public void query(Settlement settlement) {
		ScanPayQueryReqData scanPayQueryReqData = new ScanPayQueryReqData(
    			settlement.getTradeNo(),
    			settlement.getSettleNo());
    	DefaultScanPayQueryBusinessResultListener resultListener = new DefaultScanPayQueryBusinessResultListener();
    	ScanPayQueryResData scanPayQueryResData = null;
		try {
			WXPay.doScanPayQueryBusiness(scanPayQueryReqData, resultListener);
			scanPayQueryResData = resultListener.getScanPayQueryResData();
			switch (resultListener.getResult()) {
	            case DefaultScanPayQueryBusinessResultListener.ON_SCAN_PAY_QUERY_SUCCESS:
	            	log.info("微信扫码支付-账单查询成功: )");
	            	if(StringUtils.equals(scanPayQueryResData.getTrade_state(), "SUCCESS")){
	            		log.info("微信扫码支付-账单支付成功: )");
	            		settlement.setStatus(Settlement.SETTLE_STAT_PAY_SUCCESS);
	            		settlement.setTradeStatus(Settlement.SETTLE_TRADE_SUCCESS);
						settlement.setPayerAccount(scanPayQueryResData.getOpenid());
						settlement.setTradeNo(scanPayQueryResData.getTransaction_id());
						settlement.setRealAmt(new BigDecimal(scanPayQueryResData.getTotal_fee()).multiply(new BigDecimal(0.01)));//记录结算单真实发生金额
 	            	} else {
 	            		log.info("微信扫码支付-账单支付失败: )");
 	            		settlement.setStatus(Settlement.SETTLE_STAT_PAY_FAILURE);
	            		settlement.setTradeStatus(Settlement.SETTLE_TRADE_FAILURE);
 	            	}
	                settlement.setTradeTime(DateUtils.string2Date(scanPayQueryResData.getTime_end(), "yyyyMMddHHmmss"));
	                settlement.setTradeRspCode(scanPayQueryResData.getReturn_code());
		    		settlement.setTradeRspMsg(scanPayQueryResData.getReturn_msg());
		    		settlement.setRespText(scanPayQueryResData.getResponseString());
	                break;
	                
	            case DefaultRefundQueryBusinessResultListener.ON_REFUND_QUERY_FAIL:
	            	log.info("微信扫码支付-支付查询失败: )");
	            	settlement.setStatus(Settlement.SETTLE_STAT_PAY_FAILURE);
            		settlement.setTradeStatus(Settlement.SETTLE_TRADE_FAILURE);
	            	settlement.setTradeTime(DateUtils.getCurrentDate());
	                settlement.setTradeRspCode(scanPayQueryResData.getReturn_code());
		    		settlement.setTradeRspMsg(scanPayQueryResData.getReturn_msg());
		    		settlement.setRespText(scanPayQueryResData.getResponseString());
	                break;
	                
	            case DefaultScanPayQueryBusinessResultListener.ON_FAIL_BY_RETURN_CODE_ERROR:
	            case DefaultScanPayQueryBusinessResultListener.ON_FAIL_BY_RETURN_CODE_FAIL:
	            case DefaultScanPayQueryBusinessResultListener.ON_FAIL_BY_SIGN_INVALID:
		    		log.error("微信扫码支付-账单查询失败，错误原因【" + resultListener.getResult() + "】");
	                break;
	        }
		} catch (Exception e) {
			log.error("微信扫码支付-账单查询系统异常，交易状态未知!!!");
			e.printStackTrace();
		}
	}

	@Override
	public void refundQuery(Settlement settlement) {

		RefundQueryReqData refundQueryReqData = new RefundQueryReqData(
				"", 
				"", 
				settlement.getMachineId(),
				settlement.getSettleNo(), 
				"");
    	DefaultRefundQueryBusinessResultListener resultListener = new DefaultRefundQueryBusinessResultListener();
    	RefundQueryResData refundQueryResData = null;
		try {
			WXPay.doRefundQueryBusiness(refundQueryReqData, resultListener);
			refundQueryResData = resultListener.getRefundQueryResData();
			switch (resultListener.getResult()) {
	            case DefaultRefundQueryBusinessResultListener.ON_REFUND_QUERY_SUCCESS:
	            	log.info("微信扫码支付-退款查询成功: )");
	            	RefundOrderData refundOrder = null;
	            	if(null != refundQueryResData.getOrderList() && refundQueryResData.getOrderList().size() == 1){
	            		refundOrder = refundQueryResData.getOrderList().get(0);
	            	}
	            	if(refundOrder!=null && StringUtils.equals("SUCCESS", refundOrder.getRefundStatus())){
	            		log.info("微信扫码支付-退款成功: )");
	            		settlement.setStatus(Settlement.SETTLE_STAT_REFUND_SUCCESS);
	            		settlement.setTradeStatus(Settlement.SETTLE_TRADE_SUCCESS);
						settlement.setTradeNo(refundOrder.getRefundID());
	            		settlement.setRealAmt(new BigDecimal(refundOrder.getRefundFee()).multiply(new BigDecimal(0.01)));//记录结算单真实发生金额
	            	} else if(refundOrder!=null && StringUtils.equals("PROCESSING", refundOrder.getRefundStatus())){
	            		log.info("微信扫码支付-退款中 ....");
	            		settlement.setStatus(Settlement.SETTLE_STAT_REFUNDING);
	            		settlement.setTradeStatus(Settlement.SETTLE_TRADE_SUCCESS);
	            	} else if(refundOrder!=null && StringUtils.equals("CHANGE", refundOrder.getRefundStatus())){
	            		log.info("微信扫码支付-退款异常");
	            		settlement.setStatus(Settlement.SETTLE_STAT_EXCEPTIONAL);
	            		settlement.setTradeStatus(Settlement.SETTLE_TRADE_EXCEPTIONAL);
	            	} else {
	            		log.info("微信扫码支付-退款失败");
	            		settlement.setStatus(Settlement.SETTLE_STAT_REFUND_FAILURE);
	            		settlement.setTradeStatus(Settlement.SETTLE_TRADE_FAILURE);
	            	}
	                settlement.setTradeTime(DateUtils.getCurrentDate());
	                settlement.setTradeRspCode(refundQueryResData.getReturn_code());
		    		settlement.setTradeRspMsg(refundQueryResData.getReturn_msg());
		    		settlement.setRespText(refundQueryResData.getResponseString());
	                break;
	            case DefaultRefundQueryBusinessResultListener.ON_REFUND_QUERY_FAIL:
	            	log.info("微信扫码支付-退款查询失败: )");
            		settlement.setStatus(Settlement.SETTLE_STAT_REFUND_FAILURE);
            		settlement.setTradeStatus(Settlement.SETTLE_TRADE_FAILURE);
	            	settlement.setTradeTime(DateUtils.getCurrentDate());
	                settlement.setTradeRspCode(refundQueryResData.getReturn_code());
		    		settlement.setTradeRspMsg(refundQueryResData.getReturn_msg());
		    		settlement.setRespText(refundQueryResData.getResponseString());
	                break;
	            case DefaultRefundQueryBusinessResultListener.ON_FAIL_BY_RETURN_CODE_ERROR:
	            case DefaultRefundQueryBusinessResultListener.ON_FAIL_BY_RETURN_CODE_FAIL:
	            case DefaultRefundQueryBusinessResultListener.ON_FAIL_BY_SIGN_INVALID:
		    		log.error("微信扫码支付-退款查询失败，错误原因【" + resultListener.getResult() + "】");
	                break;
	        }
		} catch (Exception e) {
			log.error("微信扫码支付-退款查询系统异常，交易状态未知!!!");
			e.printStackTrace();
		}
	}
	
	
	@Override
	public void syncCheckFile(CheckRecord checkRecord) {
		DownloadBillReqData downloadBillReqData = new DownloadBillReqData(
				"", 
				checkRecord.getChkDate().replaceAll("-", ""),
				"ALL");
		DefaultDownloadBillBusinessResultListener resultListener = new DefaultDownloadBillBusinessResultListener();
    	try {
			WXPay.doDownloadBillBusiness(downloadBillReqData, resultListener);
			switch (resultListener.getResult()) {
            case DefaultDownloadBillBusinessResultListener.ON_DOWNLOAD_BILL_SUCCESS:
				if( downloadFile(checkRecord, resultListener) ){
					checkRecord.setStatus(CheckRecord.CHK_STAT_FILE_SUCCESS);
					checkRecord.setChkFile(checkRecord.getChkDate().replaceAll("-", "") + ".txt");
				} else {
					checkRecord.setStatus(CheckRecord.CHK_STAT_FILE_FAILURE);
				}
				checkRecord.setSyncTime(DateUtils.getCurrentDate());
				log.info("微信【"+ checkRecord.getChkDate() +"】日获取对账文件地址成功!!!)");
				break;
            case DefaultDownloadBillBusinessResultListener.ON_FAIL_BY_RETURN_CODE_ERROR:
            case DefaultDownloadBillBusinessResultListener.ON_FAIL_BY_RETURN_CODE_FAIL:
            case DefaultDownloadBillBusinessResultListener.ON_DOWNLOAD_BILL_FAIL:
            case DefaultRefundQueryBusinessResultListener.ON_FAIL_BY_SIGN_INVALID:
            	checkRecord.setStatus(CheckRecord.CHK_STAT_FILE_FAILURE);
				checkRecord.setSyncTime(DateUtils.getCurrentDate());
				log.info("微信【"+ checkRecord.getChkDate() +"】日获取对账文件地址失败!!!");
				break;
			}
    	} catch (Exception e) {
    		checkRecord.setStatus(CheckRecord.CHK_STAT_FILE_FAILURE);
			checkRecord.setSyncTime(DateUtils.getCurrentDate());
			log.error("微信【"+ checkRecord.getChkDate() +"】日获取对账文件地址系统异常!!!");
			e.printStackTrace();
		}
    	
	    checkRecordManager.save(checkRecord);
	}

	@Override
	public void importCheckFile(CheckRecord checkRecord) {
		BufferedReader br = null;
		try {
			//0. 清除之前导入记录
			String deleleSql = "DELETE FROM SSM_CHECK_DETAIL_WXPAY WHERE CHECK_RECORD = ?";
			this.checkDetailWxpayManager.executeSql(deleleSql, checkRecord.getId());
			
			//1. 导入记录
			File checkFile = new File(checkRecord.getFilePath() + checkRecord.getChkFile());
			if(!checkFile.exists()) {
				throw new BaseException("对账文件【"+ checkRecord.getChkFile() + "】不存在！");
			}
			br = new BufferedReader(new FileReader(checkFile));
			List<CheckDetailWxpay> cdwl = new ArrayList<CheckDetailWxpay>();
			CheckDetailWxpay cdw = null;
			String tempString = null;  
			int line = 0;  
			int record = 0;
            while ((tempString = br.readLine()) != null) {  
            	if(StringUtils.isBlank(tempString) || tempString.startsWith("#"))
            		continue;
            	line++;
            	if(line == 1){
            		continue;
            	}
            	cdw = convertRecordToObject(tempString);
            	if(cdw == null) {
            		continue;
            	} else {
            		record++;
            	}
            	cdw.setCheckRecord(checkRecord.getId());
            	cdwl.add(cdw);
                if(cdwl.size() == 100){
                	this.checkDetailWxpayManager.batchSave(cdwl, 100);
                	cdwl = new ArrayList<CheckDetailWxpay>();
                }
            }
            this.checkDetailWxpayManager.batchSave(cdwl);
            log.info("微信【"+ checkRecord.getChkDate() +"】日 对账文件导入记录【" + record + "】条。");

			checkRecord.setStatus(CheckRecord.CHK_STAT_IMP_SUCCESS);
		} catch (Exception e) {
			checkRecord.setStatus(CheckRecord.CHK_STAT_IMP_FAILURE);
			log.error("微信【"+ checkRecord.getChkDate() +"】日 对账文件导入失败:" + e.getMessage());
			e.printStackTrace();
		}
		
		checkRecordManager.save(checkRecord);
	}

	@Override
	public void checkOrder(CheckRecord checkRecord) {
		int total = 0;
		int successTotal = 0;
		BigDecimal totalAmt = new BigDecimal(0);
		BigDecimal successAmt = new BigDecimal(0);
		try {
			//0. 清除之前对账记录
			String deleleSql = "DELETE FROM SSM_CHECK_DETAIL_RESULT WHERE CHECK_RECORD = ?";
			this.checkDetailResultManager.executeSql(deleleSql, checkRecord.getId());
			
			//1. 对账记录
			List<CheckDetailWxpay> cdwl = checkDetailWxpayManager.find("from CheckDetailWxpay where checkRecord = ?", checkRecord.getId());
			List<CheckDetailResult> cdrl = new ArrayList<CheckDetailResult>();
//			List<CheckDetailHis> cdhl = new ArrayList<CheckDetailHis>();
			Settlement settlement = null;
			CheckDetailHis detail = null;
			CheckDetailResult result = null;
			for(CheckDetailWxpay cdw : cdwl){
				
				result = new CheckDetailResult();
				result.setCheckRecord(cdw.getCheckRecord());
				result.setMerchanet(cdw.getMchId());
				result.setTerminal(cdw.getDeviceInfo());
				result.setBatchNo("");
				result.setAmt(StringUtils.equals("SUCCESS", cdw.getTradeStatus())?cdw.getTotalFee().abs() : cdw.getRefundFee().abs());
				result.setClearAmt(result.getAmt());
				result.setAccount(cdw.getOpenId());
				result.setCardType("");
				result.setCardBankCode("");
				result.setTradeNo(StringUtils.equals("SUCCESS", cdw.getTradeStatus()) ? cdw.getTradeNo() : cdw.getRefTradeNo());
				result.setTradeType(StringUtils.equals("SUCCESS", cdw.getTradeStatus()) ? Settlement.SETTLE_TYPE_PAY : Settlement.SETTLE_TYPE_REFUND);
				result.setTradeDate(DateUtils.date2String(DateUtils.string2Date(cdw.getTradeTime(), "yyyy-MM-dd HH:mm:ss"), "yyyy-MM-dd"));
				result.setTradeTime(DateUtils.date2String(DateUtils.string2Date(cdw.getTradeTime(), "yyyy-MM-dd HH:mm:ss"), "HH:mm:ss"));
				result.setClearDate(checkRecord.getChkDate());
				
				//1.自助机结算单数据
				if(result.getTradeType().equals(Settlement.SETTLE_TYPE_PAY)){
					settlement = settlementManager.findOne("from Settlement where settleNo = ? and settleType = 'SP'", cdw.getOutTradeNo());
				} else if(result.getTradeType().equals(Settlement.SETTLE_TYPE_REFUND)){
					settlement = settlementManager.findOne("from Settlement where settleNo = ? and settleType = 'SR'", cdw.getRefOutTradeNo());
				}
				if(null == settlement){
					result.setSsmCheckStatus(CheckDetailResult.SSM_CHECK_STATUS_SSM_NOTRADE);
					result.setSsmCheckTime(DateUtils.getCurrentDate());
					result.setSsmCheckType(checkRecord.getOptType());
				} else {
					result.setSsmNo(settlement.getSettleNo());
					result.setSsmTime(settlement.getCreateTime());
					result.setSsmAmt(settlement.getAmt());
					result.setSsmCode(settlement.getMachineCode());
					result.setSsmCheckTime(DateUtils.getCurrentDate());
					result.setSsmCheckType(checkRecord.getOptType());
					result.setSsmCheckStatus(CheckDetailResult.SSM_CHECK_STATUS_SUCCESS);
					
					if(result.getTradeType().equals(Settlement.SETTLE_TYPE_PAY)){
						if(!Settlement.SETTLE_STAT_PAY_SUCCESS.equals(settlement.getStatus()) 
								&& !Settlement.SETTLE_STAT_PAY_FINISH.equals(settlement.getStatus())){
							result.setSsmCheckStatus(CheckDetailResult.SSM_CHECK_STATUS_FAILURE);
						}
					} else if(result.getTradeType().equals(Settlement.SETTLE_TYPE_REFUND)){
						if(!Settlement.SETTLE_STAT_REFUND_SUCCESS.equals(settlement.getStatus())){
							result.setSsmCheckStatus(CheckDetailResult.SSM_CHECK_STATUS_FAILURE);
						}
					}
					if(result.getSsmAmt().compareTo(result.getAmt()) == 1){
						result.setSsmCheckStatus(CheckDetailResult.SSM_CHECK_STATUS_MNY_MORE);
					}
					if(result.getSsmAmt().compareTo(result.getAmt()) == -1){
						result.setSsmCheckStatus(CheckDetailResult.SSM_CHECK_STATUS_MNY_LESS);
					}
				}
				
				if(result.getTradeType().equals(Settlement.SETTLE_TYPE_PAY)){
					detail = checkDetailHisManager.findOne("from CheckDetailHis where ztbz = '1' and jylx = 'HB01' and jsckh = ?", cdw.getTradeNo());
				} else if(result.getTradeType().equals(Settlement.SETTLE_TYPE_REFUND)){
					//TODO 需考虑第三方渠道退款
					detail = checkDetailHisManager.findOne("from CheckDetailHis where ztbz = '1' and jylx = 'HB02' and jsckh = ? ", cdw.getRefTradeNo());
				}
				
				if(null == detail){
					result.setHisCheckTime(DateUtils.getCurrentDate());
					result.setHisCheckType(checkRecord.getOptType());
					result.setHisCheckStatus(CheckDetailResult.HIS_CHECK_STATUS_HIS_NOTRADE);
				} else {
					result.setHisNo(String.valueOf(detail.getJlid()));
					result.setHisTime(detail.getJysj());
					result.setHisAmt(detail.getJe().abs());
					result.setHisCheckTime(DateUtils.getCurrentDate());
					result.setHisCheckType(checkRecord.getOptType());
					result.setHisCheckStatus(CheckDetailResult.HIS_CHECK_STATUS_SUCCESS);
					
					if(result.getHisAmt().compareTo(result.getAmt()) == 1){
						result.setHisCheckStatus(CheckDetailResult.HIS_CHECK_STATUS_MNY_MORE);
					}
					if(result.getHisAmt().compareTo(result.getAmt()) == -1){
						result.setHisCheckStatus(CheckDetailResult.HIS_CHECK_STATUS_MNY_LESS);
					}
					
//					detail.setJzrq(checkRecord.getChkDate());
//					cdhl.add(detail);
//					if(cdhl.size() == 100){
//						this.checkDetailHisManager.batchSave(cdhl);
//						cdhl = new ArrayList<CheckDetailHis>();
//					}
				}
				cdrl.add(result);
				if(cdrl.size() == 100){
					this.checkDetailResultManager.batchSave(cdrl);
					cdrl = new ArrayList<CheckDetailResult>();
				}
				total++;
				if(result.getTradeType().equals(Settlement.SETTLE_TYPE_PAY)){
					totalAmt = totalAmt.add(result.getAmt());
				} else if(result.getTradeType().equals(Settlement.SETTLE_TYPE_REFUND)){
					totalAmt = totalAmt.subtract(result.getAmt());
				}
				if(StringUtils.equals(result.getHisCheckStatus(), CheckDetailResult.HIS_CHECK_STATUS_SUCCESS)){
					successTotal++;
					if(result.getTradeType().equals(Settlement.SETTLE_TYPE_PAY)){
						successAmt = successAmt.add(result.getAmt());
					} else if(result.getTradeType().equals(Settlement.SETTLE_TYPE_REFUND)){
						successAmt = successAmt.subtract(result.getAmt());
					}
				}
				log.info("【"+ checkRecord.getPayChannel().getName() + "】【"+ checkRecord.getChkDate() +"】日 对账记录流水号【"+ result.getTradeNo() + "】,金额【"+result.getAmt().toString() + "】,对账状态【"+result.getHisCheckStatus() + "】。");
			}
			log.info("【"+ checkRecord.getPayChannel().getName() + "】【"+ checkRecord.getChkDate() +"】日 对账【"+ total +"】笔,【"+ totalAmt +"】元, 成功：【"+ successTotal +"】笔,【"+ successAmt.toString() +"】元！");
			this.checkDetailResultManager.batchSave(cdrl);
//			this.checkDetailHisManager.batchSave(cdhl);
			
			checkRecord.setStatus(CheckRecord.CHK_STAT_FINISH);
			checkRecord.setTotal(total);
			checkRecord.setAmt(totalAmt);
			checkRecord.setSuccessTotal(successTotal);
			checkRecord.setSuccessAmt(successAmt);
		} catch (Exception e) {
			checkRecord.setStatus(CheckRecord.CHK_STAT_FAILURE);
			log.error("微信【"+ checkRecord.getChkDate() +"】日 对账失败：" + e.getMessage());
			e.printStackTrace();
		}
		
		this.checkRecordManager.save(checkRecord);
	}
	
	private CheckDetailWxpay convertRecordToObject(String record){
//		交易时间,公众账号ID,商户号,子商户号,设备号,微信订单号,商户订单号,用户标识,交易类型,交易状态,付款银行,货币种类,总金额,企业红包金额,微信退款单号,商户退款单号,退款金额,企业红包退款金额,退款类型,退款状态,商品名称,商户数据包,手续费,费率
//		`2017-07-14 16:40:49,`wx9b804d3e447446dc,`1293495701,`0,`8a942a765c3d44d3015c3e3fa9b700ae,`4000012001201707140741926218,`SP17071400313506,`oW5L1wdbujO1L9fp49yLySntDfzI,`NATIVE,`SUCCESS,`CFT,`CNY,`150.00,`0.00,`0,`0,`0.00,`0.00,`,`,`患者 何记永 自助机充值 150 元。,`ZZJ,`0.00000,`0.00%

		CheckDetailWxpay cda = new CheckDetailWxpay();
		if(StringUtils.isBlank(record))
			return null;
		String[] params = record.split(",`");
		if(params.length != 24){
			return null;
		}
		cda.setTradeTime(params[0].replace("`", ""));
		cda.setAppId(params[1].replace("`", ""));
		cda.setMchId(params[2].replace("`", ""));
		cda.setChildMchId(params[3].replace("`", ""));
		cda.setDeviceInfo(params[4].replace("`", ""));
		cda.setTradeNo(params[5].replace("`", ""));
		cda.setOutTradeNo(params[6].replace("`", ""));
		cda.setOpenId(params[7].replace("`", ""));
		cda.setTradeType(params[8].replace("`", ""));
		cda.setTradeStatus(params[9].replace("`", ""));
		cda.setBankType(params[10].replace("`", ""));
		cda.setFeeType(params[11].replace("`", ""));
		cda.setTotalFee(new BigDecimal(params[12].replace("`", "")));
		cda.setMpCouponFee(new BigDecimal(params[13].replace("`", "")));
		cda.setRefTradeNo(params[14].replace("`", ""));
		cda.setRefOutTradeNo(params[15].replace("`", ""));
		cda.setRefundFee(new BigDecimal(params[16].replace("`", "")));
		cda.setMrCouponFee(new BigDecimal(params[17].replace("`", "")));
		cda.setRefType(params[18].replace("`", ""));
		cda.setRefStatus(params[19].replace("`", ""));
		cda.setBody(params[20].replace("`", ""));
		cda.setAttach(params[21].replace("`", ""));
		cda.setFee(new BigDecimal(params[22].replace("`", "")));
		cda.setFeeRate(params[23].replace("`", ""));
		
		return cda;
	}
	
	protected boolean downloadFile(CheckRecord checkRecord, DefaultDownloadBillBusinessResultListener resultListener) {
		boolean flag = true;
		BufferedWriter bw = null;
		try {
			String checkFile = checkRecord.getChkDate().replaceAll("-", "") + ".txt";
			File file = new File(checkRecord.getFilePath() + checkFile);

			// if file doesnt exists, then create it
			if (!file.getParentFile().exists()) {
				file.getParentFile().mkdirs();
			}
			if (!file.exists()) {
				file.createNewFile();
			}
			bw = new BufferedWriter(new FileWriter(file.getAbsoluteFile()));
			bw.write(resultListener.getResponse());
			bw.close();
		} catch (Exception e) {
			flag = false;
			log.error("微信【"+ checkRecord.getChkDate() +"】日 同步对账文件失败：" + e.getMessage());
			e.printStackTrace();
		} finally {
			if(bw != null) {
				try {
					bw.close();
				} catch (IOException e) {
					e.printStackTrace();
				}
			}
		}
		
		return flag;
	}

	@Override
	public void syncReturnFile(CheckRecord checkRecord) {
		// TODO Auto-generated method stub
		
	}

	@Override
	public void importReturnFile(CheckRecord checkRecord) {
		// TODO Auto-generated method stub
		
	}

	@Override
	public void checkReturnOrder(CheckRecord checkRecord) {
		// TODO Auto-generated method stub
		
	}
	
}
