package com.lenovohit.ssm.payment.support.bankPay.config;

/**
 * Created by zyus 
 */
public class Constants {

    private Constants() {
        // No Constructor.
    }
    public static final String SUCCESS 		= "000000"; // 成功
    public static final String REFUNDING  	= "000011"; // 退款处理中
    public static final String TRADE_ERROR  = "000012"; // 交易未能处理
    public static final String NOT_OPENED_TIME  = "000099"; // 非开放时间
   
    public static final String TRADE_CODE_REFUND  		= "HB02"; // 退款
    public static final String TRADE_REFUND_REQ_SIZE 	= "228"; // 退款请求报文长度
    public static final String TRADE_REFUND_RSP_SIZE 	= "496"; // 退款应答报文长度
    
    public static final String TRADE_CODE_CARD  		= "HB06"; // 卡查询
    public static final String TRADE_CARD_REQ_SIZE 		= "46"; // 卡查询请求报文长度
    public static final String TRADE_CARD_RSP_SIZE 		= "430"; // 卡查询应答报文长度
    
    public static final String TRADE_CODE_QUERY  		= "HB09"; // 交易查询
    public static final String TRADE_QUERY_REQ_SIZE 	= "46"; // 交易请求报文长度
    public static final String TRADE_QUERY_RSP_SIZE 	= "358"; // 交易应答报文长度
    
    public static final String TRADE_CODE_CHECK  		= "HB05"; // 对账
    public static final String TRADE_CHECK_REQ_SIZE 	= "22"; // 对账请求报文长度
    public static final String TRADE_CHECK_RSP_SIZE 	= "332"; // 对账应答报文长度
    
    public static final String TRADE_CODE_RETURN  		= "HB10"; // 退汇
    public static final String TRADE_RETURN_REQ_SIZE 	= "22"; // 退汇请求报文长度
    public static final String TRADE_RETURN_RSP_SIZE 	= "332"; // 退汇应答报文长度

    public static final String HIS_CODE					= "530001"; // 医院代码
    
}
