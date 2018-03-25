package com.lenovohit.hwe.pay.support.alipay.business;

import org.apache.commons.configuration.Configuration;

import com.alipay.api.response.AlipayTradeQueryResponse;
import com.lenovohit.hwe.pay.support.alipay.config.Constants;
import com.lenovohit.hwe.pay.support.alipay.model.TradeStatus;
import com.lenovohit.hwe.pay.support.alipay.model.builder.AlipayTradeQueryRequestBuilder;
import com.lenovohit.hwe.pay.support.alipay.model.result.AlipayTradeQueryResult;

/**
 * Created by liuyangkly on 15/7/31.
 */
public class AlipayTradeQueryBusiness extends AbsAlipayTradeBusiness {

	public AlipayTradeQueryBusiness(Configuration configs) {
		super(configs);
	}
	
    public AlipayTradeQueryResult run(AlipayTradeQueryRequestBuilder builder) {
        AlipayTradeQueryResponse response = tradeQuery(builder);
        AlipayTradeQueryResult result = new AlipayTradeQueryResult(response);
        if (querySuccess(response)) {
            // 查询返回该订单交易支付成功
            result.setTradeStatus(TradeStatus.SUCCESS);

        } else if (tradeError(response)) {
            // 查询发生异常，交易状态未知
            result.setTradeStatus(TradeStatus.UNKNOWN);

        } else {
            // 其他情况详细核实
        	if(Constants.FAILED.equals(response.getCode()) && "ACQ.TRADE_NOT_EXIST".equals(response.getSubCode())){
        		result.setTradeStatus(TradeStatus.FAILED);
        	} else {//其他错误也是本次查询交易错误，不代要查询的交易记录业务状态是错误的，需修改后重新发起请求。
                result.setTradeStatus(TradeStatus.UNKNOWN);
        	}
        }
        return result;
    }
  
}
