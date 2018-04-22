package com.lenovohit.ssm.payment.manager.impl;

import java.io.BufferedOutputStream;
import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.math.BigDecimal;
import java.net.URLDecoder;
import java.nio.charset.Charset;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;
import java.util.zip.ZipEntry;
import java.util.zip.ZipInputStream;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.apache.http.HttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.springframework.beans.factory.annotation.Autowired;

import com.alipay.api.internal.util.AlipaySignature;
import com.alipay.api.response.AlipayDataDataserviceBillDownloadurlQueryResponse;
import com.alipay.api.response.AlipayTradeFastpayRefundQueryResponse;
import com.alipay.api.response.AlipayTradePrecreateResponse;
import com.alipay.api.response.AlipayTradeQueryResponse;
import com.alipay.api.response.AlipayTradeRefundResponse;
import com.lenovohit.core.exception.BaseException;
import com.lenovohit.core.manager.GenericManager;
import com.lenovohit.core.utils.DateUtils;
import com.lenovohit.core.utils.StringUtils;
import com.lenovohit.ssm.payment.hisModel.CheckDetailHis;
import com.lenovohit.ssm.payment.manager.AlipayManager;
import com.lenovohit.ssm.payment.manager.HisManager;
import com.lenovohit.ssm.payment.model.CheckDetailAlipay;
import com.lenovohit.ssm.payment.model.CheckDetailResult;
import com.lenovohit.ssm.payment.model.CheckRecord;
import com.lenovohit.ssm.payment.model.Settlement;
import com.lenovohit.ssm.payment.support.alipay.config.Configs;
import com.lenovohit.ssm.payment.support.alipay.model.builder.AlipayTradeDownloadRequestBuilder;
import com.lenovohit.ssm.payment.support.alipay.model.builder.AlipayTradePrecreateRequestBuilder;
import com.lenovohit.ssm.payment.support.alipay.model.builder.AlipayTradeQueryRequestBuilder;
import com.lenovohit.ssm.payment.support.alipay.model.builder.AlipayTradeRefundQueryRequestBuilder;
import com.lenovohit.ssm.payment.support.alipay.model.builder.AlipayTradeRefundRequestBuilder;
import com.lenovohit.ssm.payment.support.alipay.model.result.AlipayF2FDownloadResult;
import com.lenovohit.ssm.payment.support.alipay.model.result.AlipayF2FPrecreateResult;
import com.lenovohit.ssm.payment.support.alipay.model.result.AlipayF2FQueryResult;
import com.lenovohit.ssm.payment.support.alipay.model.result.AlipayF2FRefundQueryResult;
import com.lenovohit.ssm.payment.support.alipay.model.result.AlipayF2FRefundResult;
import com.lenovohit.ssm.payment.support.alipay.service.AlipayTradeService;
import com.lenovohit.ssm.payment.support.alipay.service.impl.AlipayTradeServiceImpl;

public class AlipayManagerImpl extends AlipayManager {
    private static Log                  log = LogFactory.getLog(AlipayManagerImpl.class);

	// 支付宝当面付2.0服务
    private static AlipayTradeService   tradeService;
    @Autowired
    private GenericManager<CheckRecord, String> checkRecordManager;
    @Autowired
    private GenericManager<CheckDetailAlipay, String> checkDetailAlipayManager;
    @Autowired
    private HisManager<CheckDetailHis, String> checkDetailHisManager;
    @Autowired
    private GenericManager<CheckDetailResult, String> checkDetailResultManager;
    @Autowired
    private GenericManager<Settlement, String> settlementManager;
    static {
        /** 一定要在创建AlipayTradeService之前调用Configs.init()设置默认参数
         *  Configs会读取classpath下的zfbinfo.properties文件配置信息，如果找不到该文件则确认该文件是否在classpath目录
         */
        Configs.init("zfbinfo.properties");

        /** 使用Configs提供的默认参数
         *  AlipayTradeService可以使用单例或者为静态成员对象，不需要反复new
         */
        tradeService = new AlipayTradeServiceImpl.ClientBuilder().build();
    }
	
    @Override
	public void precreate(Settlement settlement) {

        // 创建扫码支付请求builder，设置请求参数
        AlipayTradePrecreateRequestBuilder builder = new AlipayTradePrecreateRequestBuilder()
            .setSubject(settlement.getSettleTitle()).setOutTradeNo(settlement.getSettleNo())
            .setTotalAmount(settlement.getAmt().toString()).setUndiscountableAmount("0.0")
            .setTimeoutExpress(Configs.getTradeOutTime()).setSellerId("").setBody(settlement.getSettleDesc())
            .setTerminalId(settlement.getMachineId()).setOperatorId(settlement.getMachineUser())
			.setNotifyUrl(Configs.getLocalDomain() + Configs.getPayCallbackUrl() + settlement.getId());
        	//支付宝服务器主动通知商户服务器里指定的页面http路径,根据需要设置

        AlipayF2FPrecreateResult result = tradeService.tradePrecreate(builder);
        AlipayTradePrecreateResponse response = result.getResponse();
        switch (result.getTradeStatus()) {
            case SUCCESS:
                settlement.setQrCode(response.getQrCode());
                settlement.setTradeStatus(Settlement.SETTLE_TRADE_INITIAL);
                settlement.setTradeTime(DateUtils.getCurrentDate());
                settlement.setTradeRspCode(response.getCode());
	    		settlement.setTradeRspMsg(response.getMsg());
	    		settlement.setRespText(response.getBody());
	    		log.info("支付宝预下单成功: )");
                break;
                
            case FAILED:
            	settlement.setStatus(Settlement.SETTLE_STAT_CLOSED);
                settlement.setTradeStatus(Settlement.SETTLE_TRADE_CLOSED);
                settlement.setTradeTime(DateUtils.getCurrentDate());
                settlement.setTradeRspCode(response.getCode());
	    		settlement.setTradeRspMsg(response.getMsg());
	    		settlement.setRespText(response.getBody());
                log.error("支付宝预下单失败!!!");
                break;
                
            case UNKNOWN:
            	settlement.setStatus(Settlement.SETTLE_STAT_CLOSED);
                settlement.setTradeStatus(Settlement.SETTLE_TRADE_CLOSED);
                settlement.setTradeTime(DateUtils.getCurrentDate());
                settlement.setTradeRspCode(response.getCode());
	    		settlement.setTradeRspMsg(response.getMsg());
	    		settlement.setRespText(response.getBody());
                log.error("支付宝预下单系统异常，预下单状态未知，交易关闭!!!");
                break;
        }
    }
    
    @Override
	public void payCallBack(Settlement settlement) {
    	
		try {
			String responseStr = URLDecoder.decode((String) settlement.getVariables().get("responseStr"), "utf-8");
			settlement.setRespText(responseStr);
			Map<String,String> pm = parseUrlToMap(responseStr);
			boolean checkSign = AlipaySignature.rsaCheckV1(pm, Configs.getAlipayPublicKey(), "utf-8", Configs.getSignType()); //调用SDK验证签名
			if(!checkSign){
				settlement.setStatus(Settlement.SETTLE_STAT_EXCEPTIONAL);
				settlement.setTradeStatus(Settlement.SETTLE_TRADE_EXCEPTIONAL);
	            settlement.setTradeTime(DateUtils.getCurrentDate());
	        	settlement.setTradeRspCode("20001");
	    		settlement.setTradeRspMsg("验签出错!");
                log.error("sign check fail: check Sign and Data Fail!");
                return;
			}
			
			if("TRADE_SUCCESS".equals(pm.get("trade_status"))){
				settlement.setStatus(Settlement.SETTLE_STAT_PAY_SUCCESS);
				settlement.setPayerAccount(pm.get("buyer_id"));
				settlement.setPayerLogin(pm.get("buyer_logon_id"));
				settlement.setTradeNo(pm.get("trade_no"));
				settlement.setTradeTime(DateUtils.string2Date(pm.get("gmt_payment"), DateUtils.DATE_PATTERN_DASH_YYYYMMDD_HHMMSS));
				settlement.setTradeStatus(Settlement.SETTLE_TRADE_SUCCESS);
				settlement.setTradeRspCode(pm.get("trade_status"));
				settlement.setTradeRspCode("支付成功");
			} else if("TRADE_FINISHED".equals(pm.get("trade_status"))) {
				settlement.setStatus(Settlement.SETTLE_STAT_PAY_FINISH);
				settlement.setPayerAccount(pm.get("buyer_id"));
				settlement.setPayerLogin(pm.get("buyer_logon_id"));
				settlement.setTradeNo(pm.get("trade_no"));
				settlement.setTradeTime(DateUtils.string2Date(pm.get("gmt_payment"), DateUtils.DATE_PATTERN_DASH_YYYYMMDD_HHMMSS));
				settlement.setTradeStatus(Settlement.SETTLE_TRADE_SUCCESS);
				settlement.setTradeRspCode(pm.get("trade_status"));
				settlement.setTradeRspCode("交易完成");
			}else if("WAIT_BUYER_PAY".equals(pm.get("trade_status"))) {
			}else if("TRADE_CLOSED".equals(pm.get("trade_status"))) {
				settlement.setStatus(Settlement.SETTLE_STAT_CLOSED);
				settlement.setTradeStatus(Settlement.SETTLE_TRADE_CLOSED);
				settlement.setTradeRspCode(pm.get("trade_status"));
				settlement.setTradeRspCode("交易关闭");
			}
			
			if(!StringUtils.isBlank(pm.get("out_trade_no")) && 
					!StringUtils.equals(pm.get("out_trade_no"), settlement.getSettleNo())){
				settlement.setStatus(Settlement.SETTLE_STAT_EXCEPTIONAL);
				settlement.setTradeStatus(Settlement.SETTLE_TRADE_EXCEPTIONAL);
	            settlement.setTradeTime(DateUtils.getCurrentDate());
	        	settlement.setTradeRspCode("40004");
	    		settlement.setTradeRspMsg("inconsistent data between the out_trade_no and settleNo!");
                log.error("inconsistent data between the out_trade_no and settleNo!");
                return;
			}
			if(!StringUtils.isBlank(pm.get("total_amount"))){
				BigDecimal total_amount = new BigDecimal(pm.get("total_amount"));
	    		if(settlement.getAmt().compareTo(total_amount) != 0){
	    			settlement.setStatus(Settlement.SETTLE_STAT_EXCEPTIONAL);
					settlement.setTradeStatus(Settlement.SETTLE_TRADE_EXCEPTIONAL);
		            settlement.setTradeTime(DateUtils.getCurrentDate());
		        	settlement.setTradeRspCode("40004");
		    		settlement.setTradeRspMsg("inconsistent data between the total_amount and amt!！");
	                log.error("inconsistent data between the total_amount and amt!");
	                return;
	    		}
	    		settlement.setRealAmt(total_amount);//记录结算单真实发生金额
			}
		} catch (Exception e) {
			settlement.setStatus(Settlement.SETTLE_STAT_EXCEPTIONAL);
			settlement.setTradeStatus(Settlement.SETTLE_TRADE_EXCEPTIONAL);
            settlement.setTradeTime(DateUtils.getCurrentDate());
        	settlement.setTradeRspCode("40004");
    		settlement.setTradeRspMsg("系统处理错误！");
            log.error("支付宝支付回调系统异常，结算单号为【" + settlement.getSettleNo() + "】");
			e.printStackTrace();
		}
    }
    
    @Override
	public void refund(Settlement settlement) {

		AlipayTradeRefundRequestBuilder builder = new AlipayTradeRefundRequestBuilder()
				.setTradeNo(settlement.getTradeNo()).setOutRequestNo(settlement.getSettleNo())
				.setRefundAmount(settlement.getAmt().toString()).setRefundReason(settlement.getSettleDesc())
				.setTerminalId(settlement.getTerminalId()).setOperatorId(settlement.getMachineUser());

		AlipayF2FRefundResult result = tradeService.tradeRefund(builder);
		AlipayTradeRefundResponse response = result.getResponse();
		switch (result.getTradeStatus()) {
	    	case SUCCESS:
	             settlement.setStatus(Settlement.SETTLE_STAT_REFUND_SUCCESS);
	             settlement.setTradeStatus(Settlement.SETTLE_TRADE_SUCCESS);
	             settlement.setTradeNo(response.getTradeNo());
	             settlement.setTradeTime(response.getGmtRefundPay());
	             settlement.setTradeRspCode(response.getCode());
	             settlement.setTradeRspMsg(response.getMsg());
	             settlement.setRespText(response.getBody());
	             log.info("支付宝退款成功: )");
	             break;
	
	         case FAILED:
	             settlement.setStatus(Settlement.SETTLE_STAT_REFUND_FAILURE);
	             settlement.setTradeStatus(Settlement.SETTLE_TRADE_FAILURE);
	             settlement.setTradeTime(response.getGmtRefundPay());
	             settlement.setTradeRspCode(response.getCode());
	             settlement.setTradeRspMsg(response.getMsg());
	             settlement.setRespText(response.getBody());
	             log.error("支付宝退款失败!!!");
	             break;
	
	         case UNKNOWN:
	         	 settlement.setStatus(Settlement.SETTLE_STAT_EXCEPTIONAL);
	             settlement.setTradeStatus(Settlement.SETTLE_TRADE_EXCEPTIONAL);
	             settlement.setTradeTime(response.getGmtRefundPay());
	             settlement.setTradeRspCode(response.getCode());
	             settlement.setTradeRspMsg(response.getMsg());
	             settlement.setRespText(response.getBody());
	             log.error("系统异常，订单退款状态未知!!!");
	             break;
		 }
		// TODO 此处没有校验流水和金额
	}

	@Override
	public void query(Settlement settlement) {
	    // 创建查询请求builder，设置请求参数
	    AlipayTradeQueryRequestBuilder builder = new AlipayTradeQueryRequestBuilder()
	    		.setOutTradeNo(settlement.getSettleNo());
	
	    AlipayF2FQueryResult result = tradeService.queryTradeResult(builder);
	    AlipayTradeQueryResponse response = result.getResponse();
	
	    switch (result.getTradeStatus()) {
	        case SUCCESS:
	            settlement.setStatus(Settlement.SETTLE_STAT_PAY_SUCCESS);
	            settlement.setTradeStatus(Settlement.SETTLE_TRADE_SUCCESS);
	            settlement.setTradeTime(DateUtils.getCurrentDate());
	    		settlement.setTradeNo(response.getTradeNo());
	    		settlement.setTradeRspCode(response.getCode());
	    		settlement.setTradeRspMsg(response.getMsg());
	    		settlement.setPayerAccount(response.getBuyerUserId());
	    		settlement.setPayerLogin(response.getBuyerLogonId());
	    		settlement.setRealAmt(new BigDecimal(response.getTotalAmount()));
	    		settlement.setRespText(response.getBody());
	            log.info("查询返回该订单支付成功!!!");
	            break;
	        case FAILED:
	            settlement.setStatus(Settlement.SETTLE_STAT_PAY_FAILURE);
	            settlement.setTradeStatus(Settlement.SETTLE_TRADE_FAILURE);
	            settlement.setTradeTime(DateUtils.getCurrentDate());
	    		settlement.setTradeNo(response.getTradeNo());
	    		settlement.setTradeRspCode(response.getCode());
	    		settlement.setTradeRspMsg(response.getMsg());
	    		settlement.setPayerAccount(response.getBuyerLogonId());
	    		settlement.setPayerLogin(response.getBuyerLogonId());
	    		settlement.setRealAmt(new BigDecimal(response.getTotalAmount()));
	    		settlement.setRespText(response.getBody());
	            log.error("查询返回该订单支付失败或被关闭!!!");
	            break;
	        case UNKNOWN://不做Settlement状态更新。
	    		log.error("系统异常，订单支付状态未知!!!");
	            break;
	    }
	}

	@Override
	public void refundQuery(Settlement settlement) {
	    // 创建查询请求builder，设置请求参数
	    AlipayTradeRefundQueryRequestBuilder builder = new AlipayTradeRefundQueryRequestBuilder()
	    		.setTradeNo(settlement.getTradeNo()).setOutRequestNo(settlement.getSettleNo());
	
	    AlipayF2FRefundQueryResult result = tradeService.tradeRefundQueryResult(builder);
	    AlipayTradeFastpayRefundQueryResponse response = result.getResponse();
	
	    switch (result.getTradeStatus()) {
	        case SUCCESS:
	            settlement.setStatus(Settlement.SETTLE_STAT_REFUND_SUCCESS);
	            settlement.setTradeStatus(Settlement.SETTLE_TRADE_SUCCESS);
	            settlement.setTradeTime(DateUtils.getCurrentDate());
	    		settlement.setTradeRspCode(response.getCode());
	    		settlement.setTradeRspMsg(response.getMsg());
	    		settlement.setRespText(response.getBody());
	            log.info("查询返回该订单支付成功!!!");
	            break;
	        case FAILED:
	            settlement.setStatus(Settlement.SETTLE_STAT_REFUND_FAILURE);
	            settlement.setTradeStatus(Settlement.SETTLE_TRADE_FAILURE);
	            settlement.setTradeTime(DateUtils.getCurrentDate());
	    		settlement.setTradeRspCode(response.getCode());
	    		settlement.setTradeRspMsg(response.getMsg());
	    		settlement.setRespText(response.getBody());
	            log.error("查询返回该订单支付失败或被关闭!!!");
	            break;
	        case UNKNOWN://不做Settlement状态更新。
	    		log.error("系统异常，订单支付状态未知!!!");
	            break;
	    }
	}
	
	
	@Override
	public void syncCheckFile(CheckRecord checkRecord) {
		// 创建扫码支付请求builder，设置请求参数
		AlipayTradeDownloadRequestBuilder builder = new AlipayTradeDownloadRequestBuilder()
				.setBillType("trade").setBillDate(checkRecord.getChkDate());

		AlipayF2FDownloadResult result = tradeService.tradeDownloadUrl(builder);
		AlipayDataDataserviceBillDownloadurlQueryResponse response = result.getResponse();
		switch (result.getTradeStatus()) {
			case SUCCESS:
				checkRecord.setStatus(CheckRecord.CHK_STAT_FILE_SUCCESS);
				if( !downloadFile(checkRecord, response) ){
		        	checkRecord.setStatus(CheckRecord.CHK_STAT_FILE_FAILURE);
				}
				checkRecord.setSyncTime(DateUtils.getCurrentDate());
				log.info("支付宝【"+ checkRecord.getChkDate() +"】日获取对账文件地址成功!!!)");
				break;
			case FAILED:
				checkRecord.setStatus(CheckRecord.CHK_STAT_FILE_FAILURE);
				checkRecord.setSyncTime(DateUtils.getCurrentDate());
				log.error("支付宝【"+ checkRecord.getChkDate() +"】日获取对账文件地址失败!!!");
				break;
			case UNKNOWN:
				checkRecord.setStatus(CheckRecord.CHK_STAT_FILE_FAILURE);
				checkRecord.setSyncTime(DateUtils.getCurrentDate());
				log.error("支付宝【"+ checkRecord.getChkDate() +"】日获取对账文件地址系统异常!!!");
				break;
		}
	    
	    checkRecordManager.save(checkRecord);
	}

	@Override
	public void importCheckFile(CheckRecord checkRecord) {
		BufferedReader br = null;
		try {
			//0. 清除之前导入记录
			String deleleSql = "DELETE FROM SSM_CHECK_DETAIL_ALIPAY WHERE CHECK_RECORD = ?";
			this.checkDetailAlipayManager.executeSql(deleleSql, checkRecord.getId());
			
			//1. 导入记录
			File checkFile = new File(checkRecord.getFilePath() + checkRecord.getChkFile());
			if(!checkFile.exists()) {
				throw new BaseException("对账文件【"+ checkRecord.getChkFile() + "】不存在！");
			}
			br = new BufferedReader(new InputStreamReader(new FileInputStream(checkFile), "gbk"));
			List<CheckDetailAlipay> cdbl = new ArrayList<CheckDetailAlipay>();
			CheckDetailAlipay cdb = null;
			String tempString = null;  
			int line = 0;  
			int record = 0;
            while ((tempString = br.readLine()) != null) {  
            	if(StringUtils.isBlank(tempString) || tempString.startsWith("#"))
            		continue;
            	line++;
            	if(line == 1){//去除标题行
            		continue;
            	}
            	cdb = convertRecordToObject(line, tempString);
            	if(cdb == null) {
            		continue;
            	} else {
            		record++;
            	}
            	cdb.setCheckRecord(checkRecord.getId());
            	cdbl.add(cdb);
                if(cdbl.size() == 100){
                	this.checkDetailAlipayManager.batchSave(cdbl, 100);
                	cdbl = new ArrayList<CheckDetailAlipay>();
                }
            }
            this.checkDetailAlipayManager.batchSave(cdbl);
            log.info("支付宝【"+ checkRecord.getChkDate() +"】日 对账文件导入记录【" + record + "】条。");

			checkRecord.setStatus(CheckRecord.CHK_STAT_IMP_SUCCESS);
		} catch (Exception e) {
			checkRecord.setStatus(CheckRecord.CHK_STAT_IMP_FAILURE);
			log.error("支付宝【"+ checkRecord.getChkDate() +"】日 对账文件导入失败:" + e.getMessage());
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
			List<CheckDetailAlipay> cdal = checkDetailAlipayManager.find("from CheckDetailAlipay where checkRecord = ?", checkRecord.getId());
			List<CheckDetailResult> cdrl = new ArrayList<CheckDetailResult>();
//			List<CheckDetailHis> cdhl = new ArrayList<CheckDetailHis>();
			Settlement settlement = null;
			CheckDetailHis detail = null;
			CheckDetailResult result = null;
			for(CheckDetailAlipay cda : cdal){
				
				result = new CheckDetailResult();
				result.setCheckRecord(cda.getCheckRecord());
				result.setMerchanet("");
				result.setTerminal(cda.getTerminalId());
				result.setBatchNo("");
				result.setAmt(cda.getAmt().abs());
				result.setClearAmt(cda.getClearAmt().abs());
				result.setAccount(cda.getSellerId());
				result.setCardType("");
				result.setCardBankCode("");
				result.setTradeNo(cda.getTradeNo());
				result.setTradeType("交易".equals(cda.getTradeType())?Settlement.SETTLE_TYPE_PAY:"退款".equals(cda.getTradeType())?Settlement.SETTLE_TYPE_REFUND:Settlement.SETTLE_TYPE_CANCEL);
				result.setClearDate(checkRecord.getChkDate());
				if(result.getTradeType().equals(Settlement.SETTLE_TYPE_PAY)){
					result.setTradeDate(DateUtils.date2String(DateUtils.string2Date(cda.getCreateTime(), "yyyy-MM-dd HH:mm:ss"), "yyyy-MM-dd"));
					result.setTradeTime(DateUtils.date2String(DateUtils.string2Date(cda.getCreateTime(), "yyyy-MM-dd HH:mm:ss"), "HH:mm:ss"));
				} else if(result.getTradeType().equals(Settlement.SETTLE_TYPE_REFUND)){
					result.setTradeDate(DateUtils.date2String(DateUtils.string2Date(cda.getFinishTime(), "yyyy-MM-dd HH:mm:ss"), "yyyy-MM-dd"));
					result.setTradeTime(DateUtils.date2String(DateUtils.string2Date(cda.getFinishTime(), "yyyy-MM-dd HH:mm:ss"), "HH:mm:ss"));
				}
				
				//1.自助机结算单数据
				if(result.getTradeType().equals(Settlement.SETTLE_TYPE_PAY)){
					settlement = settlementManager.findOne("from Settlement where settleNo = ? and settleType = 'SP'", cda.getOutTradeNo());
				} else if(result.getTradeType().equals(Settlement.SETTLE_TYPE_REFUND)){
					settlement = settlementManager.findOne("from Settlement where settleNo = ? and settleType = 'SR'", cda.getRequestNo());
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
					detail = checkDetailHisManager.findOne("from CheckDetailHis where ztbz = '1' and jylx = 'HB01' and jsckh = ?", cda.getTradeNo());
				} else if(result.getTradeType().equals(Settlement.SETTLE_TYPE_REFUND)){
					//TODO 需考虑第三方渠道退款
					detail = checkDetailHisManager.findOne("from CheckDetailHis where ycid = ?", Integer.valueOf(settlement.getOrder().getBizNo()));
//					detail = checkDetailHisManager.findOne("from CheckDetailHis where ztbz = '1' and jylx = 'HB02' and jsckh = ? and yhrq = ? and yhsj = ?", cda.getTradeNo(), DateUtils.string2Date(cda.getFinishTime(), "yyyy/M/d h:m:s"));
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
				totalAmt = totalAmt.add(cda.getAmt());
				if(StringUtils.equals(result.getHisCheckStatus(), CheckDetailResult.HIS_CHECK_STATUS_SUCCESS)){
					successTotal++;
					successAmt = successAmt.add(result.getAmt());
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
			log.error("支付宝【"+ checkRecord.getChkDate() +"】日 对账失败：" + e.getMessage());
			e.printStackTrace();
		}
		
		this.checkRecordManager.save(checkRecord);
	}

	private Map<String, String> parseUrlToMap(String str){
    	Map<String, String> tm = new TreeMap<String, String>();
    	String[] ss = str.split("\\&");
		for (String s : ss) {
			String[] subs = s.split("\\=", 2);
			tm.put(subs[0], subs[1]);
		}
		
    	return tm;
    }
	
	private CheckDetailAlipay convertRecordToObject(int line, String record){
//		支付宝交易号,商户订单号,业务类型,商品名称,创建时间,完成时间,门店编号,门店名称,操作员,终端号,对方账户,订单金额（元）,商家实收（元）,支付宝红包（元）,集分宝（元）,支付宝优惠（元）,商家优惠（元）,券核销金额（元）,券名称,商家红包消费金额（元）,卡消费金额（元）,退款批次号/请求号,服务费（元）,分润（元）,备注

		CheckDetailAlipay cda = new CheckDetailAlipay();
		if(StringUtils.isBlank(record))
			return null;
		String[] params = record.split(",");
		if(params.length != 25){
			log.info("支付宝导入 对账文件记录第【" + line + "】条数据错误。");
			log.info(record);
			return null;
		}
		cda.setTradeNo(params[0].trim());
		cda.setOutTradeNo(params[1].trim());
		cda.setTradeType(params[2].trim());
		cda.setSubject(params[3].trim());
		cda.setCreateTime(params[4].trim());
		cda.setFinishTime(params[5].trim());
		cda.setStoreId(params[6].trim());
		cda.setStoreName(params[7].trim());
		cda.setOperatorId(params[8].trim());
		cda.setTerminalId(params[9].trim());
		cda.setSellerId(params[10].trim());
		cda.setAmt(new BigDecimal(params[11].trim()));
		cda.setClearAmt(new BigDecimal(params[12].trim()));
		cda.setCouponAmt(new BigDecimal(params[13].trim()));
		cda.setPointAmt(new BigDecimal(params[14].trim()));
		cda.setDiscountAmt(new BigDecimal(params[15].trim()));
		cda.setmDiscountAmt(new BigDecimal(params[16].trim()));
		cda.setTicketAmt(new BigDecimal(params[17].trim()));
		cda.setTicketName(params[18].trim());
		cda.setmCouponAmt(new BigDecimal(params[19].trim()));
		cda.setCardAmt(new BigDecimal(params[20].trim()));
		cda.setRequestNo(params[21].trim());
		cda.setServiceAmt(new BigDecimal(params[22].trim()));
		cda.setCommission(new BigDecimal(params[23].trim()));
		cda.setMemo(params[24].trim());
		
		return cda;
	}
	
	protected boolean downloadFile(CheckRecord checkRecord, AlipayDataDataserviceBillDownloadurlQueryResponse response) {

		boolean flag = true;
		CloseableHttpClient httpclient = HttpClients.createDefault();
		HttpResponse fileResponse = null;
		ZipInputStream zis = null;
		BufferedOutputStream bos = null;
		try {
			fileResponse = httpclient.execute(new HttpGet(response.getBillDownloadUrl()));
			zis = new ZipInputStream(fileResponse.getEntity().getContent(), Charset.forName("gbk"));
			ZipEntry entry;
			while ((entry = zis.getNextEntry()) != null && !entry.isDirectory()) {
				if (null != entry.getName() && !entry.getName().endsWith("业务明细.csv")) {
					continue;
				}
				checkRecord.setChkFile(entry.getName());
				File target = new File(checkRecord.getFilePath(), entry.getName());
				if (!target.getParentFile().exists()) {
					target.getParentFile().mkdirs();
				}
				bos = new BufferedOutputStream(new FileOutputStream(target));
				int read;
				byte[] buffer = new byte[1024 * 10];
				while ((read = zis.read(buffer, 0, buffer.length)) != -1) {
					bos.write(buffer, 0, read);
				}
				bos.flush();
			}
            zis.closeEntry();
		} catch (IOException e) {
			flag = false;
			log.error("支付宝【"+ checkRecord.getChkDate() +"】日 同步对账文件失败：" + e.getMessage());
			e.printStackTrace();
		} finally {
			try {
				if(zis != null){
					zis.close();
				}
				if(bos != null){
					bos.close();
				}
				if(httpclient != null){
					httpclient.close();
				}
			} catch (Exception e2) {
				flag = false;
				e2.printStackTrace();
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
	
//	/**
//     * 解压文件
//     *
//     * @param filePath 压缩文件路径
//     */
//	protected void unzip(AlipayTradeDownloadRequestBuilder builder, AlipayDataDataserviceBillDownloadurlQueryResponse response) {
//		String zipPath = builder.getFilePath() + builder.getBillDate() + ".zip";
//        File source = new File(zipPath);
//        if (!source.exists()) {
//        	return;
//        }
//        
//        ZipInputStream zis = null;
//        BufferedOutputStream bos = null;
//        try {
//            zis = new ZipInputStream(new FileInputStream(source), Charset.forName("gbk"));
//            ZipEntry entry;
//            while ((entry = zis.getNextEntry()) != null && !entry.isDirectory()) {
//            	if(null!=entry.getName() && !entry.getName().endsWith("业务明细.csv")){
//            		continue;
//            	}
//            	response.getParams().put("checkFile", entry.getName());
//                File target = new File(source.getParent(), entry.getName());
//                if (!target.getParentFile().exists()) {  
//                    target.getParentFile().mkdirs();
//                }
//                bos = new BufferedOutputStream(new FileOutputStream(target));
//                int read;
//                byte[] buffer = new byte[1024 * 10];
//                while ((read = zis.read(buffer, 0, buffer.length)) != -1) {
//                    bos.write(buffer, 0, read);
//                }
//                bos.flush();
//            }
//            zis.closeEntry();
//        } catch (IOException e) {
//            throw new RuntimeException(e);
//        } finally {
//        	try {
//            	if(zis != null) {
//					zis.close();
//            	}
//            	if(bos != null) {
//            		bos.close();
//            	}
//        	} catch (IOException e) {
//				e.printStackTrace();
//			}
//        }
//    }
}
