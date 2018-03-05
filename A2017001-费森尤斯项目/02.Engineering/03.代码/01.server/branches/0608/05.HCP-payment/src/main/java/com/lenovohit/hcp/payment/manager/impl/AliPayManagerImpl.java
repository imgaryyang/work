package com.lenovohit.hcp.payment.manager.impl;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.util.Map;
import java.util.TreeMap;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.apache.http.HttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.springframework.stereotype.Service;

import com.alipay.api.AlipayApiException;
import com.alipay.api.internal.util.AlipaySignature;
import com.alipay.api.response.AlipayTradePrecreateResponse;
import com.alipay.api.response.AlipayTradeRefundResponse;
import com.lenovohit.core.utils.DateUtils;
import com.lenovohit.core.utils.StringUtils;
import com.lenovohit.hcp.payment.model.HcpSettlement;
import com.lenovohit.hcp.payment.support.alipay.config.Configs;
import com.lenovohit.hcp.payment.support.alipay.model.builder.AlipayTradePrecreateRequestBuilder;
import com.lenovohit.hcp.payment.support.alipay.model.builder.AlipayTradeRefundRequestBuilder;
import com.lenovohit.hcp.payment.support.alipay.model.result.AlipayF2FPrecreateResult;
import com.lenovohit.hcp.payment.support.alipay.model.result.AlipayF2FRefundResult;
import com.lenovohit.hcp.payment.support.alipay.service.AlipayTradeService;
import com.lenovohit.hcp.payment.support.alipay.service.impl.AlipayTradeServiceImpl;

/**
 * 
 * @description 阿里支付宝支付实现
 * @author jatesun
 * @version 1.0.0
 * @date 2017年4月11日
 */
@Service("aliPayManager")
public class AliPayManagerImpl extends AbstractBasePayManagerImpl {
	private static Log log = LogFactory.getLog(AliPayManagerImpl.class);

	// 支付宝当面付2.0服务
	private static AlipayTradeService tradeService;
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
	public void precreate(HcpSettlement settlement) {

		// 创建扫码支付请求builder，设置请求参数
		AlipayTradePrecreateRequestBuilder builder = new AlipayTradePrecreateRequestBuilder()
				.setSubject(settlement.getSettleTitle()).setOutTradeNo(settlement.getSettleNo())
				.setTotalAmount(settlement.getAmt().toString()).setUndiscountableAmount("0.0").setTimeoutExpress("5m")
				.setSellerId("").setBody(settlement.getSettleDesc()).setTerminalId(settlement.getMachineId())
				.setOperatorId(settlement.getMachineUser()).setNotifyUrl(Configs.getConfigs().getString("local_domain")
						+ Configs.getConfigs().getString("pay_callback_url") + settlement.getId());
		// 支付宝服务器主动通知商户服务器里指定的页面http路径,根据需要设置

		AlipayF2FPrecreateResult result = tradeService.tradePrecreate(builder);
		AlipayTradePrecreateResponse response = result.getResponse();
		switch (result.getTradeStatus()) {
		case SUCCESS:
			log.info("支付宝预下单成功: )");
			settlement.setQrCode(response.getQrCode());
			break;
		case FAILED:
			settlement.setStatus(HcpSettlement.SETTLE_STAT_PAY_FAILURE);
			log.error("支付宝预下单失败!!!");
			break;
		case UNKNOWN:
			settlement.setStatus(HcpSettlement.SETTLE_STAT_EXCEPTIONAL);
			log.error("系统异常，预下单状态未知!!!");
			break;
		}
	}

	@Override
	public void payCallBack(HcpSettlement settlement) {

		try {
			String responseStr = URLDecoder.decode((String) settlement.getVariables().get("responseStr"), "utf-8");
			Map<String, String> pm = parseUrlToMap(responseStr);

			boolean checkSign = AlipaySignature.rsaCheck(parseSignSource(pm), pm.get("sign"), Configs.getPublicKey(),
					"utf-8", Configs.getSignType());
			if (!checkSign) {
				checkSign = AlipaySignature.rsaCheck(parseSignSource(pm).replace("\\/", "/"), pm.get("sign"),
						Configs.getPublicKey(), "utf-8", Configs.getSignType());
			}
			if (!checkSign) {
				settlement.setStatus(HcpSettlement.SETTLE_STAT_EXCEPTIONAL);
				log.error("sign check fail: check Sign and Data Fail!");
				return;
			}
			if (StringUtils.equals(pm.get("out_trade_no"), settlement.getSettleNo())) {
				settlement.setStatus(HcpSettlement.SETTLE_STAT_EXCEPTIONAL);
				log.error("inconsistent data between the out_trade_no and settleNo!");
				return;
			}
			if (StringUtils.equals(pm.get("total_amount"), settlement.getAmt().toString())) {
				settlement.setStatus(HcpSettlement.SETTLE_STAT_EXCEPTIONAL);
				log.error("inconsistent data between the total_amount and amt!");
				return;
			}
			if ("TRADE_SUCCESS".equals(pm.get("trade_status"))) {
				settlement.setStatus(HcpSettlement.SETTLE_STAT_PAY_SUCCESS);
				settlement.setPayerAccount(pm.get("buyer_logon_id"));
				settlement.setTradeNo(pm.get("trade_no"));
				settlement.setTradeTime(
						DateUtils.string2Date(pm.get("gmt_payment"), DateUtils.DATE_PATTERN_DASH_YYYYMMDD_HHMMSS));
				settlement.setTradeStatus(HcpSettlement.SETTLE_TRADE_SUCCESS);
				settlement.setTradeRspCode(pm.get("trade_status"));
				settlement.setTradeRspCode("");
			} else if ("TRADE_FINISHED".equals(pm.get("trade_status"))) {
				settlement.setStatus(HcpSettlement.SETTLE_STAT_PAY_FINISH);
				settlement.setPayerAccount(pm.get("buyer_logon_id"));
				settlement.setTradeNo(pm.get("trade_no"));
				settlement.setTradeTime(
						DateUtils.string2Date(pm.get("gmt_payment"), DateUtils.DATE_PATTERN_DASH_YYYYMMDD_HHMMSS));
				settlement.setTradeStatus(HcpSettlement.SETTLE_TRADE_SUCCESS);
				settlement.setTradeRspCode(pm.get("trade_status"));
				settlement.setTradeRspCode("");
			} else if ("WAIT_BUYER_PAY".equals(pm.get("trade_status"))) {
			} else if ("TRADE_CLOSED".equals(pm.get("trade_status"))) {
				settlement.setStatus(HcpSettlement.SETTLE_STAT_CLOSED);
				settlement.setTradeStatus(HcpSettlement.SETTLE_TRADE_CLOSED);
				settlement.setTradeRspCode(pm.get("trade_status"));
				settlement.setTradeRspCode("");
			}
		} catch (UnsupportedEncodingException e) {
			settlement.setStatus(HcpSettlement.SETTLE_STAT_EXCEPTIONAL);
			log.error("UnsupportedEncodingException!");
			e.printStackTrace();
		} catch (AlipayApiException e) {
			settlement.setStatus(HcpSettlement.SETTLE_STAT_EXCEPTIONAL);
			log.error("AlipayApiException!");
			e.printStackTrace();
		}
	}

	@Override
	public void otRefund(HcpSettlement settlement) {

		AlipayTradeRefundRequestBuilder builder = new AlipayTradeRefundRequestBuilder()
				.setOutTradeNo(settlement.getOriSettlement().getSettleNo())
				.setRefundAmount(settlement.getAmt().toString()).setRefundReason(settlement.getSettleDesc())
				.setOutRequestNo(settlement.getSettleNo()).setTerminalId(settlement.getMachineId())
				.setOperatorId(settlement.getMachineUser());

		AlipayF2FRefundResult result = tradeService.tradeRefund(builder);
		AlipayTradeRefundResponse response = result.getResponse();
		switch (result.getTradeStatus()) {
		case SUCCESS:
			settlement.setStatus(HcpSettlement.SETTLE_STAT_REFUND_SUCCESS);
			settlement.setTradeNo(response.getTradeNo());
			settlement.setTradeTime(response.getGmtRefundPay());
			settlement.setStatus(response.getCode());
			settlement.setTradeRspCode(response.getSubCode());
			settlement.setTradeRspMsg(response.getSubMsg());
			log.info("支付宝退款成功: )");
			break;

		case FAILED:
			settlement.setStatus(HcpSettlement.SETTLE_STAT_REFUND_FAILURE);
			settlement.setTradeNo(response.getTradeNo());
			settlement.setTradeTime(response.getGmtRefundPay());
			settlement.setStatus(response.getCode());
			settlement.setTradeRspCode(response.getSubCode());
			settlement.setTradeRspMsg(response.getSubMsg());
			log.error("支付宝退款失败!!!");
			break;

		case UNKNOWN:
			settlement.setStatus(HcpSettlement.SETTLE_STAT_EXCEPTIONAL);
			settlement.setTradeNo(response.getTradeNo());
			settlement.setTradeTime(response.getGmtRefundPay());
			settlement.setStatus(response.getCode());
			settlement.setTradeRspCode(response.getSubCode());
			settlement.setTradeRspMsg(response.getSubMsg());
			log.error("系统异常，订单退款状态未知!!!");
			break;
		}
	}

	private boolean downloadFile(String url, String filePath) {
		CloseableHttpClient httpclient = HttpClients.createDefault();
		boolean flag = true;
		HttpResponse response = null;
		InputStream in = null;
		File file = null;
		FileOutputStream fout = null;
		try {
			response = httpclient.execute(new HttpGet(url));
			in = response.getEntity().getContent();
			file = new File(filePath);
			fout = new FileOutputStream(file);
			int l = -1;
			byte[] tmp = new byte[1024];
			while ((l = in.read(tmp)) != -1) {
				fout.write(tmp, 0, l);
			}
			fout.flush();
			fout.close();
			in.close();
			httpclient.close();
		} catch (IOException e) {
			flag = false;
			e.printStackTrace();
		} finally {
			try {
				if (fout != null) {
					fout.close();
				}
				if (in != null) {
					in.close();
				}
				if (httpclient != null) {
					httpclient.close();
				}
			} catch (Exception e2) {
				flag = false;
				e2.printStackTrace();
			}
		}

		return flag;
	}

	private Map<String, String> parseUrlToMap(String str) {
		Map<String, String> tm = new TreeMap<String, String>();
		String[] ss = str.split("\\&");
		for (String s : ss) {
			String[] subs = s.split("\\=", -1);
			if (2 == subs.length) {
				tm.put(subs[0], subs[1]);
			}
		}

		return tm;
	}

	private String parseSignSource(Map<String, String> pMap) {
		if (null == pMap || pMap.isEmpty()) {
			return "";
		}
		StringBuffer tsb = new StringBuffer("");
		for (String key : pMap.keySet()) {
			if (StringUtils.isEmpty(pMap.get(key)) || StringUtils.equals("sign", key)
					|| StringUtils.equals("sign_type", key)) {
				continue;
			}
			tsb.append("&").append(key).append("=").append(pMap.get(key));
		}
		if (tsb.length() > 1) {
			return tsb.substring(1);
		} else {
			return "";
		}
	}
}
