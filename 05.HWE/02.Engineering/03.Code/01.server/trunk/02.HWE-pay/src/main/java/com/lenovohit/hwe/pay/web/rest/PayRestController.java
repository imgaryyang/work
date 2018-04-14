package com.lenovohit.hwe.pay.web.rest;

import java.io.OutputStream;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import org.apache.commons.configuration.Configuration;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.lenovohit.core.manager.GenericManager;
import com.lenovohit.core.utils.JSONUtils;
import com.lenovohit.core.utils.StringUtils;
import com.lenovohit.core.web.MediaTypes;
import com.lenovohit.core.web.rest.BaseRestController;
import com.lenovohit.core.web.utils.Result;
import com.lenovohit.core.web.utils.ResultUtils;
import com.lenovohit.hwe.pay.exception.PayException;
import com.lenovohit.hwe.pay.model.Bill;
import com.lenovohit.hwe.pay.model.Cash;
import com.lenovohit.hwe.pay.model.PayType;
import com.lenovohit.hwe.pay.model.Settlement;
import com.lenovohit.hwe.pay.service.TradeService;
import com.lenovohit.hwe.pay.utils.PayMerchantConfigCache;
import com.lenovohit.hwe.pay.utils.ZxingUtils;

/**
 * 支付管理
 * @ClassName: PayRestController 
 * @Description: TODO
 * @Compony: Lenovohit
 * @Author: zhangyushuang@lenovohit.com
 * @date 2017年12月20日 下午8:58:52  
 *
 */
@RestController
@RequestMapping("/hwe/pay")
public class PayRestController extends BaseRestController{
	@Autowired
	private TradeService tradeService;
	@Autowired
	private GenericManager<Settlement, String> settlementManager;
	@Autowired
	private GenericManager<PayType, String> payTypeManager;

	/**
	 * 创建账单
	 * 模式修改，不在生产账单，该接口废弃。
	 * @return
	 */
	@Deprecated
	@RequestMapping(value = "/createBill", method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result forCreatePay(@RequestBody String data) {
		//生成充值订单
		Bill bill = JSONUtils.deserialize(data, Bill.class);
		try {
			validCreatePay(bill);
			tradeService.createPay(bill);
		} catch (PayException e) {
			log.error(e.getExceptionCodeAndMessage());
			return ResultUtils.renderFailureResult(e.getExceptionCodeAndMessage());
		} catch (Exception e) {
			log.error("生成预支付订单失败！");
			return ResultUtils.renderFailureResult("生成预支付订单失败！");
		}
		
		return ResultUtils.renderSuccessResult(bill);
	}
	
	/**
	 * 获取已授权的支付方式
	 * authValues 格式 type1:value1&type2:value2&...
	 * 例如：APP:123&GZH:456
	 * @return
	 */
	@RequestMapping(value = "/payTypes/{authValues}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forPayTypes(@PathVariable("authValues") String authValues) {
		//生成充值订单
		try {
			if(StringUtils.isBlank(authValues)){
				return ResultUtils.renderSuccessResult();
			}
			String[] authValueStrAry = authValues.split("&");
			String[] authValueAry = null;
			StringBuilder sql = new StringBuilder( "select pa.PT_ID from PAY_TYPE_AUTH pa ");
			List<Object> values = new ArrayList<Object>();
			for	(int i = 0; i < authValueStrAry.length; i++){
				if(StringUtils.isBlank(authValueStrAry[i])){
					continue;
				}
				authValueAry = authValueStrAry[i].split(":");
				if(!StringUtils.isEmpty(authValueAry[0])){
					sql.append(" LEFT JOIN (select PT_ID from PAY_TYPE_AUTH  where TYPE = ? and VALUE = ?) pa" +i+ " on pa" +i+ ".PT_ID = pa.PT_ID ");
					values.add(authValueAry[0]);
					values.add(authValueAry[1]);
				}
			}
			sql.append(" where 1=1 order by pa.CREATED_AT");
			List<?> payTypeIds = this.payTypeManager.findBySql(sql.toString(),values.toArray());
			
			StringBuilder idSql = new StringBuilder( "from PayType where id in ( ");
			List<Object> idValues = new ArrayList<Object>();
			for(int i = 0; i < payTypeIds.size(); i++) {
				idSql.append("?");
				idValues.add(payTypeIds.get(i).toString());
				if(i != payTypeIds.size() - 1) idSql.append(",");
			}
			idSql.append(")");
			List<?> payTypes = this.payTypeManager.findByJql(idSql.toString(), idValues.toArray());
			
			return ResultUtils.renderSuccessResult(payTypes);
		} catch (PayException e) {
			log.error(e.getExceptionCodeAndMessage());
			return ResultUtils.renderFailureResult(e.getExceptionCodeAndMessage());
		} catch (Exception e) {
			e.printStackTrace();
			log.error("获取授权的支付方式失败！");
			return ResultUtils.renderFailureResult("获取授权的支付方式失败！");
		}
	}
	
	/**
	 * 预支付，客户端选择支付方式后调用，获取对应支付的预支付信息，反馈客户端，由客户端根据选择支付方式进入对应预支付界面，用户进行下一步支付操作，如现金塞钞、银行卡插卡输密码、微信支付宝扫码等。</p>
	 * 通用（微信支付宝扫码、App支付，银行卡刷卡等）-
	 * 	{
	 * 		settleTitle:'XXX 自助机预存200元！',amt:'200.00',terminalCode:'',terminalName:'',terminalUser:'',
	 * 		bizType:'00',bizNo:'000xxx...',bizUrl:'http://....',bizTime:'2018-01-22 00:00:00',
	 * 		appType:'SSM',appCode:'',payType:'4028748161098e60016109987e280020'(扫码支付)
	 *	}</p>
	 * 微信公众号支付/支付宝服务窗支付-
	 * 	{
	 * 		settleTitle:'XXX 自助机预存200元！',amt:'200.00',terminalCode:'',terminalName:'',terminalUser:'',
	 * 		bizType:'00',bizNo:'000xxx...',bizUrl:'http://....',bizTime:'2018-01-22 00:00:00',
	 * 		appType:'SSM',appCode:'',payType:'4028748161098e60016109987e280012'(公众号支付),payerNo:''(openId/userId)
	 *	}</p>
	 * 现金支付-
	 * 	{
	 * 		settleTitle:'XXX 自助机现金预存0元！',amt:'0.00',terminalCode:'',terminalName:'',terminalUser:'',
	 * 		bizType:'00',bizNo:'000xxx...',bizUrl:'http://....',bizTime:'2018-01-22 00:00:00',
	 * 		appType:'SSM',appCode:'',payType:'4028748161098e60016109987e280000'
	 *	}</p>
	 * 医院余额支付-
	 * 	{
	 * 		settleTitle:'XXX 自助机预存200元！',amt:'200.00',terminalCode:'',terminalName:'',terminalUser:'',
	 * 		bizType:'00',bizNo:'000xxx...',bizUrl:'http://....',bizTime:'2018-01-22 00:00:00',
	 * 		appType:'SSM',appCode:'',payType:'4028748161098e60016109987e280012'(公众号支付),payerNo:''(患者档案号),payerName：'',payerAccount:''
	 *	}
	 * @return
	 */
	@RequestMapping(value = "/prePay", method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result forPrePay(@RequestBody String data) {
		//生成充值订单
		Settlement settle = JSONUtils.deserialize(data, Settlement.class);
		try {
			validPrePay(settle);
			tradeService.prePay(settle);
		} catch (PayException e) {
			log.error(e.getExceptionCodeAndMessage());
			return ResultUtils.renderFailureResult(e.getExceptionCodeAndMessage());
		} catch (Exception e) {
			log.error("生成预支付订单失败！");
			return ResultUtils.renderFailureResult("生成预支付订单失败！");
		}
		
		return ResultUtils.renderSuccessResult(settle);
	}
	
	/**
	 * 现金支付-
	 * 	{
	 * 		settleId:'...',amt:'100.00',terminalCode:'',terminalName:'',terminalUser:'',
	 * 		appType:'SSM',appCode:'',
	 *	}</p>
	 * @return
	 */
	@RequestMapping(value = "/cashPay", method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result forCashPay(@RequestBody String data) {
		//生成充值订单
		Cash cash = JSONUtils.deserialize(data, Cash.class);
		try {
			validCashPay(cash);
			tradeService.cashPay(cash);
		} catch (PayException e) {
			log.error(e.getExceptionCodeAndMessage());
			return ResultUtils.renderFailureResult(e.getExceptionCodeAndMessage());
		} catch (Exception e) {
			log.error("生成预支付订单失败！");
			return ResultUtils.renderFailureResult("生成预支付订单失败！");
		}
		
		return ResultUtils.renderSuccessResult(cash);
	}
	
	/**
	 * 支付回调
	 * 通用-
	 *  {
	 * 		settleId：PathVariable
	 * 		data: RequestBody
	 *	}</p>
	 * @return
	 */
	@RequestMapping(value = "/callback/{settleId}", method = RequestMethod.POST)
	public String forCallback(@PathVariable("settleId") String settleId, @RequestBody String data ){
		log.info("支付-异步通知返回的数据如下：");
        log.info(data);
		Settlement settle = null;
		String _returnStr = "";
		try {
	        //0. 状态检验
	        String uuid = com.lenovohit.core.utils.StringUtils.uuid();
			this.settlementManager.executeSql("UPDATE PAY_SETTLEMENT SET FLAG = ? where ID=? and STATUS = 'A' and FLAG is null", uuid, settleId);
			settle = this.settlementManager.get(settleId);
			if(null == settle || !StringUtils.equals(settle.getFlag(), uuid)){
				_returnStr = callbackReturn(settle, "Fail");
				return _returnStr;
			}
			//1. 受理支付回调，进行业务处理
			settle.getVariables().put("responseStr", data);
			tradeService.payCallback(settle);
			_returnStr = callbackReturn(settle, "Success");
		} catch (Exception e) {
			log.error("支付回传交易失败！" + data);
			e.printStackTrace();
			_returnStr = callbackReturn(settle, "Fail");
		}
		return _returnStr;
	}
	/**
	 * Discription:[根据二维码链接生成二维码图片]
	 * @param request
	 * @param response
	 * @return
	 */
	@RequestMapping(value = "/showQrCode/{id}/{size}", method = RequestMethod.GET)
	public String showQrCode(@PathVariable("id") String id, @PathVariable("size") int size) {
		Settlement settlement = this.settlementManager.get(id);
		if (null == settlement || StringUtils.isEmpty(settlement.getQrCode()))
			return null;
		if (size == 0)
			size = 256;
		OutputStream output = null;
		try {
			output = this.getResponse().getOutputStream();
			ZxingUtils.getQRCodeImgeOs(settlement.getQrCode(), size, output);
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			try {
				if (output != null) {
					output.flush();
					output.close();
				}
			} catch (Exception ex) {
				ex.printStackTrace();
			}
		}
		return null;
	}
	
	
//	/**
//	 * 创建退款账单</p>
//	 * 原账单退款-
//	 * 	{
//	 * 		billTitle:'退款',amt:'1.1',appCode:'3',terminalCode:'3',payerNo:'3',
//	 * 		bizType:'3',bizNo:'3',bizUrl:'3',bizTime:'2018-01-22 00:00:00',
//	 *	}</p>
//	 * 原交易退款-
//	 * 	{
//	 * 		billTitle:'退款',amt:'1.1',appCode:'3',terminalCode:'3',payerNo:'3',
//	 * 		bizType:'3',bizNo:'3',bizUrl:'3',bizTime:'2018-01-22 00:00:00',
//	 *	}</p>
//	 * 银行卡退款-
//	 * 	{
//	 * 		billTitle:'退款',amt:'1.1',appCode:'3',terminalCode:'3',payerNo:'3',
//	 * 		bizType:'3',bizNo:'3',bizUrl:'3',bizTime:'2018-01-22 00:00:00',
//	 *	}
//	 * @return
//	 */
//	@RequestMapping(value = "/createRefund", method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
//	public Result forCreateRefund(@RequestBody String data) {
//		//生成充值订单
//		Bill bill = JSONUtils.deserialize(data, Bill.class);
//		try {
//			validCreateRefund(bill);
//			tradeService.createRefund(bill);
//		} catch (PayException e) {
//			log.error(e.getExceptionCodeAndMessage());
//			return ResultUtils.renderFailureResult(e.getExceptionCodeAndMessage());
//		} catch (Exception e) {
//			log.error("生成预支付订单失败！");
//			return ResultUtils.renderFailureResult("生成预支付订单失败！");
//		}
//		
//		return ResultUtils.renderSuccessResult(bill);
//	}
//	
//	
	/**
	 * 退款</p>
	 * 原订单退款-
	 * 	{
	 * 		billId:'2c90a104612da592016130639c790003', 
	 * 		oriBillId:'2c918088612d83bd01612d85a84a0000',
	 * 	}</p>
	 * 原交易退款-
	 * 	{
	 * 		billId:'2c90a104612da592016130639c790003', 
	 * 		payTypeId:'4028748161098e60016109987e280020',
	 * 		oriTradeNo:'2018012521001004010200542953',
	 * 		oriAmt:'2.1',
	 *  }</p>
	 * 银行卡退款-
	 * 	{
	 * 		billId:'2c90a104612da592016130639c790003', 
	 * 		payTypeId:'4028748161098e60016109987e280020',
	 * 		payerAccount:'63232xxxxxxxxxxxxxxxx',
	 * 		payerAccountName:'xxx',
	 *  }
	 * @return
	 */
	@RequestMapping(value = "/refund", method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result forRefund(@RequestBody String data) {
		//生成充值订单
		Settlement settle = JSONUtils.deserialize(data, Settlement.class);
		try {
			validRefund(settle);
			tradeService.refund(settle);
		} catch (PayException e) {
			log.error(e.getExceptionCodeAndMessage());
			return ResultUtils.renderFailureResult(e.getExceptionCodeAndMessage());
		} catch (Exception e) {
			log.error("生成预支付订单失败！");
			return ResultUtils.renderFailureResult("生成预支付订单失败！");
		}
		
		return ResultUtils.renderSuccessResult(settle);
	}
	
	private void validCreatePay(Bill bill) {
		if (null == bill) {
            throw new PayException("91001010", "bill should not be NULL!");
        }
		if (StringUtils.isEmpty(bill.getBillTitle())) {
			throw new PayException("91001010", "billTitle should not be NULL!");
		}
		if (bill.getAmt() == null || new BigDecimal(0).compareTo(bill.getAmt()) == 1) {
			throw new PayException("91001020", "amt should not be < 0!");
		}
		if (StringUtils.isEmpty(bill.getAppCode())) {
			throw new PayException("91001010", "appCode should not be NULL!");
		}
//		if (StringUtils.isEmpty(bill.getTerminalCode())) {
//			throw new PayException("91001010", "terminalCode should not be NULL!");
//		}
//		if (StringUtils.isEmpty(bill.getPayerNo())) {
//			throw new PayException("91001010", "payerNo should not be NULL!");
//		}
		if (StringUtils.isEmpty(bill.getBizType())) {
			throw new PayException("91001010", "bizType should not be NULL!");
		}
		if (StringUtils.isEmpty(bill.getBizNo())) {
			throw new PayException("91001010", "bizNo should not be NULL!");
		}
		if (StringUtils.isEmpty(bill.getBizUrl()) && StringUtils.isEmpty(bill.getBizBean())) {
			throw new PayException("91001010", "bizUrl or bizBean should not be NULL!");
		}
		if (StringUtils.isEmpty(bill.getBizTime())) {
			throw new PayException("91001010", "bizTime should not be NULL!");
		}
	}
	private void validPrePay(Settlement settle) {
		if (null == settle) {
            throw new PayException("91001010", "settle should not be NULL!");
        }
		if (StringUtils.isEmpty(settle.getSettleTitle())) {
			throw new PayException("91001010", "settleTitle should not be NULL!");
		}
		if (settle.getAmt() == null || new BigDecimal(0).compareTo(settle.getAmt()) == 1) {
			throw new PayException("91001020", "amt should not be < 0!");
		}
		if (StringUtils.isEmpty(settle.getAppCode())) {
			throw new PayException("91001010", "appCode should not be NULL!");
		}
//		if (StringUtils.isEmpty(bill.getTerminalCode())) {
//			throw new PayException("91001010", "terminalCode should not be NULL!");
//		}
//		if (StringUtils.isEmpty(bill.getPayerNo())) {
//			throw new PayException("91001010", "payerNo should not be NULL!");
//		}
		if (StringUtils.isEmpty(settle.getBizType())) {
			throw new PayException("91001010", "bizType should not be NULL!");
		}
		if (StringUtils.isEmpty(settle.getBizNo())) {
			throw new PayException("91001010", "bizNo should not be NULL!");
		}
		if (StringUtils.isEmpty(settle.getBizUrl()) && StringUtils.isEmpty(settle.getBizBean())) {
			throw new PayException("91001010", "bizUrl or bizBean should not be NULL!");
		}
		if (StringUtils.isEmpty(settle.getBizTime())) {
			throw new PayException("91001010", "bizTime should not be NULL!");
		}
		if (StringUtils.isEmpty(settle.getPayTypeId())) {
			throw new PayException("91001010", "payTypeId should not be NULL!");
		}
		if (!StringUtils.isEmpty(settle.getId())) {
			throw new PayException("91001010", "ID must be NULL!");
		}
	}
	
	private void validCashPay(Cash cash) {
		if (null == cash) {
            throw new PayException("91001010", "cash should not be NULL!");
        }
		if (StringUtils.isEmpty(cash.getSettleId())) {
			throw new PayException("91001010", "settleId should not be NULL!");
		}
		if (cash.getAmt() == null || new BigDecimal(0).compareTo(cash.getAmt()) == 1) {
			throw new PayException("91001020", "amt should not be < 0!");
		}
		if (StringUtils.isEmpty(cash.getAppCode())) {
			throw new PayException("91001010", "appCode should not be NULL!");
		}
		if (StringUtils.isEmpty(cash.getTerminalCode())) {
			throw new PayException("91001010", "terminalCode should not be NULL!");
		}
	}
/*	private void validCreateRefund(Bill bill) {
		if (null == bill) {
            throw new PayException("91001010", "bill should not be NULL!");
        }
		if (StringUtils.isEmpty(bill.getBillTitle())) {
			throw new PayException("91001010", "billTitle should not be NULL!");
		}
		if (bill.getAmt() == null || new BigDecimal(0).compareTo(bill.getAmt()) == 1) {
			throw new PayException("91001020", "amt should not be < 0!");
		}
		if (StringUtils.isEmpty(bill.getAppCode())) {
			throw new PayException("91001010", "appCode should not be NULL!");
		}
		if (StringUtils.isEmpty(bill.getTerminalCode())) {
			throw new PayException("91001010", "terminalCode should not be NULL!");
		}
		if (StringUtils.isEmpty(bill.getPayerNo())) {
			throw new PayException("91001010", "payerNo should not be NULL!");
		}
		if (StringUtils.isEmpty(bill.getBizType())) {
			throw new PayException("91001010", "bizType should not be NULL!");
		}
		if (StringUtils.isEmpty(bill.getBizNo())) {
			throw new PayException("91001010", "bizNo should not be NULL!");
		}
		if (StringUtils.isEmpty(bill.getBizUrl()) && StringUtils.isEmpty(bill.getBizBean())) {
			throw new PayException("91001010", "bizUrl or bizBean should not be NULL!");
		}
		if (StringUtils.isEmpty(bill.getBizTime())) {
			throw new PayException("91001010", "bizTime should not be NULL!");
		}
	}*/
	
	private void validRefund(Settlement settle) {
		if (null == settle) {
            throw new PayException("91001010", "settle should not be NULL!");
        }
		if (StringUtils.isEmpty(settle.getSettleTitle())) {
			throw new PayException("91001010", "settleTitle should not be NULL!");
		}
		if (settle.getAmt() == null || new BigDecimal(0).compareTo(settle.getAmt()) == 1) {
			throw new PayException("91001020", "amt should not be < 0!");
		}
		if (StringUtils.isEmpty(settle.getAppCode())) {
			throw new PayException("91001010", "appCode should not be NULL!");
		}
//		if (StringUtils.isEmpty(settle.getTerminalCode())) {
//			throw new PayException("91001010", "terminalCode should not be NULL!");
//		}
//		if (StringUtils.isEmpty(settle.getPayerNo())) {
//			throw new PayException("91001010", "payerNo should not be NULL!");
//		}
		if (StringUtils.isEmpty(settle.getBizType())) {
			throw new PayException("91001010", "bizType should not be NULL!");
		}
		if (StringUtils.isEmpty(settle.getBizNo())) {
			throw new PayException("91001010", "bizNo should not be NULL!");
		}
//		if (StringUtils.isEmpty(settle.getBizUrl()) && StringUtils.isEmpty(settle.getBizBean())) {
//			throw new PayException("91001010", "bizUrl or bizBean should not be NULL!");
//		}
		if (StringUtils.isEmpty(settle.getBizTime())) {
			throw new PayException("91001010", "bizTime should not be NULL!");
		}
//		if (StringUtils.isEmpty(settle.getBillId())) {
//			throw new PayException("91001010", "settleId should not be NULL!");
//		}
	}
	
	private String callbackReturn(Settlement settle, String type) {
		String _returnStr = "";
		if (null == settle) {
           return _returnStr;
        }
		if(StringUtils.isEmpty(settle.getPayMerchantId()) 
				|| null == PayMerchantConfigCache.getConfig(settle.getPayMerchantId())){
			 return _returnStr;
		}
		//TODO 有缺陷，有可能没有加载到内存。
		Configuration config = PayMerchantConfigCache.getConfig(settle.getPayMerchantId());
		if(StringUtils.equals("Success", type) || StringUtils.equals("Ok", type)){
			_returnStr = config.getString("callbackSuccess", "");
		} else {
			_returnStr = config.getString("callbackFail", "");
		}
		
		return _returnStr;
	}
}
