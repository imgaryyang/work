package com.lenovohit.hwe.pay.support.wxpay.scan.common;

import org.apache.commons.configuration.Configuration;
import org.apache.commons.configuration.ConfigurationException;
import org.apache.commons.configuration.PropertiesConfiguration;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

/**
 * User: rizenguo
 * Date: 2014/10/29
 * Time: 14:40
 * 这里放置各种配置数据
 */
public class Configure {
    private static Log log = LogFactory.getLog(Configure.class);

//    private static Configuration configs;
//	//这个就是自己要保管好的私有Key了（切记只能放在自己的后台代码里，不能放在任何可能被看到源代码的客户端程序中）
//	// 每次自己Post数据给API的时候都要用这个key来对所有字段进行签名，生成的签名会放在Sign这个字段，API收到Post数据的时候也会用同样的签名算法对Post过来的数据进行签名和验证
//	// 收到API的返回的时候也要用这个key来对返回的数据算下签名，跟API的Sign数据进行比较，如果值不一致，有可能数据被第三方给篡改
//
//	private static String key = "";
//
//	//微信分配的公众号ID（开通公众号之后可以获取到）
//	private static String appID = "";
//
//	//微信支付分配的商户号ID（开通公众号的微信支付功能之后可以获取到）
//	private static String mchID = "";
//
//	//受理模式下给子商户分配的子商户号
//	private static String subMchID = "";
//
//	//HTTPS证书的本地路径
//	private static String certLocalPath = "";
//
//	//HTTPS证书密码，默认密码等于商户号MCHID
//	private static String certPassword = "";
//
//	//是否使用异步线程的方式来上报API测速，默认为异步模式
//	private static boolean useThreadToDoReport = true;
//
//	//机器IP
//	private static String ip = "";

	//以下是几个API的路径：
	//1）被扫支付API
	public static String PRECREATE_API = "https://api.mch.weixin.qq.com/pay/unifiedorder";
	
	//1）被扫支付API
	public static String PAY_API = "https://api.mch.weixin.qq.com/pay/micropay";

	//2）被扫支付查询API
	public static String PAY_QUERY_API = "https://api.mch.weixin.qq.com/pay/orderquery";

	//3）退款API
	public static String REFUND_API = "https://api.mch.weixin.qq.com/secapi/pay/refund";

	//4）退款查询API
	public static String REFUND_QUERY_API = "https://api.mch.weixin.qq.com/pay/refundquery";

	//5）撤销API
	public static String REVERSE_API = "https://api.mch.weixin.qq.com/secapi/pay/reverse";

	//6）下载对账单API
	public static String DOWNLOAD_BILL_API = "https://api.mch.weixin.qq.com/pay/downloadbill";

	//7) 统计上报API
	public static String REPORT_API = "https://api.mch.weixin.qq.com/payitil/report";
	
	//8) 获取验签秘钥API
	public static String GETSIGNKEY_API = "https://api.mch.weixin.qq.com/sandboxnew/pay/getsignkey";

//	public static String localDomain;   	// 本地回调域名 
//	public static String payCallbackUrl;	// 支付回调地址 
//	public static int tradeOutTime;    		// 交易过期时间
    
	public static String HttpsRequestClassName = "com.lenovohit.hwe.pay.support.wxpay.scan.common.HttpsRequest";
	private Configure() {
        // No Constructor
    }

//    // 根据文件名读取配置文件，文件后缀名必须为.properties
//    public synchronized static void init(String filePath) {
//        if (configs != null) {
//            return;
//        }
//
//        try {
//            configs = new PropertiesConfiguration(filePath);
//        } catch (ConfigurationException e) {
//            e.printStackTrace();
//        }
//
//        if (configs == null) {
//            throw new IllegalStateException("can`t find file by path:" + filePath);
//        }
//
//        key = configs.getString("key");
//        appID = configs.getString("appID");
//        mchID = configs.getString("mchID");
//        subMchID = configs.getString("subMchID");
//
//        certLocalPath = configs.getString("certLocalPath");
//        certPassword = configs.getString("certPassword");
//        
//        useThreadToDoReport = configs.getBoolean("useThreadToDoReport");
//        ip = configs.getString("ip");
//
//        localDomain = configs.getString("local_domain");
//        payCallbackUrl = configs.getString("pay_callback_url");
//        tradeOutTime = configs.getInt("trade_out_time");
//
//        log.info("配置文件名: " + filePath);
//    }

//	public static void setUseThreadToDoReport(boolean useThreadToDoReport) {
//		Configure.useThreadToDoReport = useThreadToDoReport;
//	}
//
//	public static void setKey(String key) {
//		Configure.key = key;
//	}
//
//	public static void setAppID(String appID) {
//		Configure.appID = appID;
//	}
//
//	public static void setMchID(String mchID) {
//		Configure.mchID = mchID;
//	}
//
//	public static void setSubMchID(String subMchID) {
//		Configure.subMchID = subMchID;
//	}
//
//	public static void setCertLocalPath(String certLocalPath) {
//		Configure.certLocalPath = certLocalPath;
//	}
//
//	public static void setCertPassword(String certPassword) {
//		Configure.certPassword = certPassword;
//	}
//
//	public static String getLocalDomain() {
//		return localDomain;
//	}
//
//	public static void setLocalDomain(String localDomain) {
//		Configure.localDomain = localDomain;
//	}
//
//	public static String getPayCallbackUrl() {
//		return payCallbackUrl;
//	}
//
//	public static void setPayCallbackUrl(String payCallbackUrl) {
//		Configure.payCallbackUrl = payCallbackUrl;
//	}
//	
//	public static int getTradeOutTime() {
//		return tradeOutTime;
//	}
//
//	public static void setTradeOutTime(int tradeOutTime) {
//		Configure.tradeOutTime = tradeOutTime;
//	}
//
//	public static void setIp(String ip) {
//		Configure.ip = ip;
//	}
//
//	public static boolean isUseThreadToDoReport() {
//		return useThreadToDoReport;
//	}
//
//	public static String getKey(){
//		return key;
//	}
//	
//	public static String getAppid(){
//		return appID;
//	}
//	
//	public static String getMchid(){
//		return mchID;
//	}
//
//	public static String getSubMchid(){
//		return subMchID;
//	}
//	
//	public static String getCertLocalPath(){
//		return certLocalPath;
//	}
//	
//	public static String getCertPassword(){
//		return certPassword;
//	}
//
//	public static String getIP(){
//		return ip;
//	}

	public static void setHttpsRequestClassName(String name){
		HttpsRequestClassName = name;
	}
	
}
