package com.test;

import java.math.BigDecimal;

import com.lenovohit.core.utils.DateUtils;
import com.lenovohit.core.utils.StringUtils;
import com.lenovohit.ssm.payment.model.Settlement;
import com.lenovohit.ssm.payment.support.wxPay.WXPay;
import com.lenovohit.ssm.payment.support.wxPay.common.Configure;
import com.lenovohit.ssm.payment.support.wxPay.listener.DefaultPrecreateBusinessResultListener;
import com.lenovohit.ssm.payment.support.wxPay.listener.DefaultRefundBusinessResultListener;
import com.lenovohit.ssm.payment.support.wxPay.protocol.refund_protocol.RefundReqData;
import com.lenovohit.ssm.payment.support.wxPay.protocol.refund_protocol.RefundResData;

public class WXRefund {
	public static void main(String args[]){
		Settlement settle = new Settlement();
		settle.setTradeNo("4200000027201710086778850303");
		settle.setMachineId("402882a45e85a433015e8830a0680003");
		settle.setSettleNo("SR17100800362359");
		settle.setOriAmt(new BigDecimal(1000));
		settle.setAmt(new BigDecimal(1000));
		
		Configure.init("E:/project/大庆自助机/svn/02.Engineering/03.Code/01.server/trunk/ssm/src/main/resources/wxinfo.properties");
		refund(settle);
	}
	public static void refund(Settlement settlement) {

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
		    		System.out.println("微信扫码支付-退款成功: )");
	                break;
	                
	            case DefaultPrecreateBusinessResultListener.ON_FAIL_BY_RETURN_CODE_ERROR:
	            case DefaultPrecreateBusinessResultListener.ON_FAIL_BY_RETURN_CODE_FAIL:
	            case DefaultPrecreateBusinessResultListener.ON_FAIL_BY_SIGN_INVALID:
	            case DefaultPrecreateBusinessResultListener.ON_PRECREATE_FAIL:
	            	settlement.setStatus(Settlement.SETTLE_STAT_REFUND_FAILURE);
	                settlement.setTradeStatus(Settlement.SETTLE_TRADE_FAILURE);
		    		settlement.setRespText(refundResData.getResponseString());
		    		System.out.println("微信扫码支付-退款失败，错误原因【" + resultListener.getResult() + "】");
	                break;
	        }
			
			if(!StringUtils.isBlank(refundResData.getOut_refund_no()) && 
	    			!StringUtils.equals(refundResData.getOut_refund_no(), settlement.getSettleNo())){
				settlement.setStatus(Settlement.SETTLE_STAT_EXCEPTIONAL);
				settlement.setTradeStatus(Settlement.SETTLE_TRADE_EXCEPTIONAL);
	            settlement.setTradeTime(DateUtils.getCurrentDate());
	        	settlement.setTradeRspCode("40004");
	    		settlement.setTradeRspMsg("inconsistent data between the out_refund_no and settleNo!");
	            System.out.println("inconsistent data between the out_refund_no and settleNo!");
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
	                System.out.println("inconsistent data between the refund_fee and amt!");
	    		}

				settlement.setRealAmt(new BigDecimal(refundResData.getRefund_fee()).multiply(new BigDecimal(0.01)));//记录结算单真实发生金额
	    	}
		} catch (Exception e) {
			settlement.setStatus(Settlement.SETTLE_STAT_EXCEPTIONAL);
			settlement.setTradeStatus(Settlement.SETTLE_TRADE_EXCEPTIONAL);
            settlement.setTradeTime(DateUtils.getCurrentDate());
        	settlement.setTradeRspCode("40004");
    		settlement.setTradeRspMsg("系统处理错误！");
			System.out.println("微信扫码支付-退款系统异常，交易状态未知!!!");
			e.printStackTrace();
		}
    }
}
