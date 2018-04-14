package com.lenovohit.hwe.pay.support.bankpay.transfer.utils;

import java.io.UnsupportedEncodingException;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import com.lenovohit.core.exception.BaseException;
import com.lenovohit.core.utils.StringUtils;
import com.lenovohit.hwe.pay.support.bankpay.transfer.model.response.BankCardQueryResponse;
import com.lenovohit.hwe.pay.support.bankpay.transfer.model.response.BankDownloadResponse;
import com.lenovohit.hwe.pay.support.bankpay.transfer.model.response.BankQueryResponse;
import com.lenovohit.hwe.pay.support.bankpay.transfer.model.response.BankRefundResponse;
import com.lenovohit.hwe.pay.support.bankpay.transfer.model.response.BankResponse;

/**
 * 单个JSON对象解释器。
 * 
 * @author carver.gu
 * @since 1.0, Apr 11, 2010
 */
public class StringParser<T extends BankResponse> {
    protected Log log = LogFactory.getLog(getClass());

    private Class<T> clazz;

    public StringParser(Class<T> clazz) {
        this.clazz = clazz;
    }

    public Class<T> getResponseClass() {
        return clazz;
    }
    public T parse(byte[] rsp, String charset) throws BaseException {
    	T tRsp = null;
		try {
			log.info("银行反馈报文解析开始-----------------------");
			log.info("银行反馈报文长度：" + rsp.length);
			log.info(new String(rsp, charset));
			tRsp = this.getResponseClass().newInstance();
			if(StringUtils.isBlank(rsp)){
				throw new NullPointerException("Parse rsp should not be Null !");
			}
			tRsp.setLength(StringUtils.trim(subBytes(rsp, 0, 4, charset)));
			tRsp.setCode(StringUtils.trim(subBytes(rsp, 4, 8, charset)));
			tRsp.setBankCode(StringUtils.trim(subBytes(rsp, 8, 12, charset)));
			if(this.clazz == BankRefundResponse.class){
				BankRefundResponse brfr = (BankRefundResponse) tRsp;
				brfr.setOutTradeNo(StringUtils.trim(subBytes(rsp, 12, 28, charset)));
				brfr.setTradeNo(StringUtils.trim(subBytes(rsp, 28, 40, charset)));
				brfr.setTradeDate(StringUtils.trim(subBytes(rsp, 40, 48, charset)));
				brfr.setTradeTime(StringUtils.trim(subBytes(rsp, 48, 54, charset)));
				brfr.setCardBankCode(StringUtils.trim(subBytes(rsp, 54,66, charset)));
				brfr.setAccount(StringUtils.trim(subBytes(rsp, 66, 98, charset)));
				brfr.setAccountName(StringUtils.trim(subBytes(rsp, 98, 226, charset)));
				brfr.setAmount(StringUtils.trim(subBytes(rsp, 226, 238, charset)));
				brfr.setRespCode(StringUtils.trim(subBytes(rsp, 238, 244, charset)));
				brfr.setRespMsg(StringUtils.trim(subBytes(rsp, 244, 500, charset)));
			} else if(this.clazz == BankQueryResponse.class){
				BankQueryResponse brfr = (BankQueryResponse) tRsp;
				brfr.setTradeType(StringUtils.trim(subBytes(rsp, 12, 14, charset)));
				brfr.setOutTradeNo(StringUtils.trim(subBytes(rsp, 14, 30, charset)));
				brfr.setTradeNo(StringUtils.trim(subBytes(rsp, 30, 42, charset)));
				brfr.setTradeDate(StringUtils.trim(subBytes(rsp, 42, 50, charset)));
				brfr.setTradeTime(StringUtils.trim(subBytes(rsp, 50, 56, charset)));
				brfr.setAccount(StringUtils.trim(subBytes(rsp, 56, 88, charset)));
				brfr.setAmount(StringUtils.trim(subBytes(rsp, 88, 100, charset)));
				brfr.setRespCode(StringUtils.trim(subBytes(rsp, 100, 106, charset)));
				brfr.setRespMsg(StringUtils.trim(subBytes(rsp, 106, 362, charset)));
			} else if(this.clazz == BankCardQueryResponse.class){
				BankCardQueryResponse brfr = (BankCardQueryResponse) tRsp;
				brfr.setAccount(StringUtils.trim(subBytes(rsp, 12, 44, charset)));
				brfr.setAccountName(StringUtils.trim(subBytes(rsp, 44, 172, charset)));
				brfr.setRespCode(StringUtils.trim(subBytes(rsp, 172, 178, charset)));
				brfr.setRespMsg(StringUtils.trim(subBytes(rsp, 178, 434, charset)));
			} else if(this.clazz == BankDownloadResponse.class){
				BankDownloadResponse brfr = (BankDownloadResponse) tRsp;
				brfr.setCheckDate(StringUtils.trim(subBytes(rsp, 12, 20, charset)));
				brfr.setTotal(StringUtils.trim(subBytes(rsp, 20, 30, charset)));
				brfr.setTotalAmt(StringUtils.trim(subBytes(rsp, 30, 46, charset)));
				brfr.setFileName(StringUtils.trim(subBytes(rsp, 46, 66, charset)));
				brfr.setFileLength(Integer.valueOf(subBytes(rsp, 66, 74, charset)));
				brfr.setRespCode(StringUtils.trim(subBytes(rsp, 74, 80, charset)));
				brfr.setRespMsg(StringUtils.trim(subBytes(rsp, 80, 336, charset)));
			}
	    	log.info("银行反馈报文解析结束-----------------------");
		} catch (Exception e) {
			e.printStackTrace();
			log.error(e.getMessage());
			tRsp.setRespCode("000012");
			tRsp.setRespMsg("交易未能处理!");
			return tRsp;
		}
    	
    	return tRsp;
    }
    
    private String subBytes(byte[] bytes, int start, int limit, String charset) throws UnsupportedEncodingException {
		int length = limit - start;
		byte[] bs = new byte[length];
		for (int i = 0; i < length; i++) {
			bs[i] = bytes[i + start];
		}
		return new String(bs, charset);
	}
}
