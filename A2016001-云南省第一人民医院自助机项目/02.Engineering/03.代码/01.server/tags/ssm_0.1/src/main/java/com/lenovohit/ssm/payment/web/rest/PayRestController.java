package com.lenovohit.ssm.payment.web.rest;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.lenovohit.core.manager.GenericManager;
import com.lenovohit.core.utils.JSONUtils;
import com.lenovohit.core.web.MediaTypes;
import com.lenovohit.core.web.rest.BaseRestController;
import com.lenovohit.core.web.utils.Result;
import com.lenovohit.core.web.utils.ResultUtils;
import com.lenovohit.ssm.payment.manager.HisPayManager;
import com.lenovohit.ssm.payment.model.Order;
import com.lenovohit.ssm.payment.model.Settlement;
import com.lenovohit.ssm.payment.model.si.SIPrePayResponse;

/**
 * 
 */
@RestController
@RequestMapping("/ssm/payment/pay")
public class PayRestController extends BaseRestController {
	
	@Autowired
	private GenericManager<Settlement, String> settlementManager;
	
	@Autowired
	private GenericManager<Order, String> orderManager;
	
	/**预支付-
	 * 记录结算单支付渠道，
	 * 设置结算单回调url，
	 * 根据支付渠道晚上结算单信息（例如微信支付宝获取二维码等信息）
	 */
	/**
	 * 支付宝预支付
	 * @param settleId
	 * @return
	 */
	@RequestMapping(value = "/precreate/alipay/{settleId}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forAliPayPreCreate(@PathVariable("settleId") String settleId){
		Settlement settle = this.settlementManager.get(settleId);
		return ResultUtils.renderPageResult(settle);
	}
	/**
	 * 微信预支付
	 * @param settleId
	 * @return
	 */
	@RequestMapping(value = "/precreate/wxpay/{settleId}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forWXPayPreCreate(@PathVariable("settleId") String settleId){
		Settlement settle = this.settlementManager.get(settleId);
		return ResultUtils.renderSuccessResult(settle);
	}
	/**
	 * 银联预支付
	 * @param settleId
	 * @return
	 */
	@RequestMapping(value = "/precreate/unionpay/{settleId}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forUnionPayPreCreate(@PathVariable("settleId") String settleId){
		Settlement settle = this.settlementManager.get(settleId);
		return ResultUtils.renderSuccessResult(settle);
	}
	
	/**
	 * 余额预支付
	 * @param settleId
	 * @return
	 */
	@RequestMapping(value = "/precreate/balance/{settleId}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forBalancePreCreate(@PathVariable("settleId") String settleId){
		Settlement settle = this.settlementManager.get(settleId);
		return ResultUtils.renderSuccessResult(settle);
	}
	/**
	 * 根据预结算信息，拆分订单为结算单，TODO 移植到payment中
	 */
	@RequestMapping(value="/forSettles",method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8/*TEXT_PLAIN_UTF_8*/)
	public Result forSettles(@RequestBody String data){
		SIPrePayResponse SIResponse = JSONUtils.deserialize(data, SIPrePayResponse.class);
		List<Settlement> siSettles = parseSi(SIResponse);
		String orderId=null;//TODO 获取orderid
		Order order  = this.orderManager.get(orderId);
		List<Settlement>  settles = order.getSettlements();
		BigDecimal siAmt = new BigDecimal(0); 
		for(Settlement siSettle : siSettles){
			siAmt = siAmt.subtract(siSettle.getAmt());
			settles.add(siSettle);
		}
		Settlement ownSettle = new Settlement();
		ownSettle.setOrderId(orderId);
		ownSettle.setAmt(order.getAmt().subtract(siAmt));
		this.settlementManager.save(ownSettle);
		settles.add(ownSettle);
		return ResultUtils.renderSuccessResult(order);
	}
	private List<Settlement> parseSi(SIPrePayResponse response){
		if(!response.isParsed())response.parse();
		//TODO 根据医保返回生成多个结算单
		return null;
	}
	/**
	 * 支付回调
	 * 修改结算单状态，记录支付金额
	 * 查询订单，计算订单是否完全支付完毕
	 * 如果订单支付完毕，则回调业务逻辑通知his
	 */
	/**
	 * 支付宝回调
	 * @param settleId
	 * @return
	 */
	@RequestMapping(value = "/callback/alipay/{settleId}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forAliPayCallback(@PathVariable("settleId") String settleId){
		Settlement settle = this.settlementManager.get(settleId);
		return ResultUtils.renderPageResult(settle);
	}
	/**
	 * 微信预回调
	 * @param settleId
	 * @return
	 */
	@RequestMapping(value = "/callback/wxpay/{settleId}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forWXPayCallback(@PathVariable("settleId") String settleId){
		Settlement settle = this.settlementManager.get(settleId);
		return ResultUtils.renderSuccessResult(settle);
	}
	/**
	 * 银联回调，由前台页面发起
	 * @param settleId
	 * @return
	 */
	@RequestMapping(value = "/callback/unionpay/{settleId}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forUnionPayCallback(@PathVariable("settleId") String settleId){
		Settlement settle = this.settlementManager.get(settleId);
		return ResultUtils.renderSuccessResult(settle);
	}
	
	/**
	 * 余额回调，调用his扣款接口
	 * @param settleId
	 * @return
	 */
	@RequestMapping(value = "/callback/balance/{settleId}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forBalanceCallback(@PathVariable("settleId") String settleId){
		Settlement settle = this.settlementManager.get(settleId);
		return ResultUtils.renderSuccessResult(settle);
	}
	
	/**
	 * 余额支付快捷渠道
	 * 不必先预支付后支付回调
	 * 直接调用扣款同时生成结算单
	 * @param settleId
	 * @return
	 */
	@RequestMapping(value = "/quick/balance/{settleId}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forBalanceQuickpay(@PathVariable("settleId") String settleId){
		Settlement settle = this.settlementManager.get(settleId);
		return ResultUtils.renderSuccessResult(settle);
	}
	/**
	 * 根据 结算单支付情况回调业务
	 * @param order
	 * @throws Exception
	 */
	private void bizCall(Settlement settle)throws Exception{
		Order order = this.orderManager.get(settle.getOrderId());
		String beanName  = order.getBizBean();
		HisPayManager hisOrderManager =(HisPayManager) this.getApplicationContext().getBean(beanName);
		hisOrderManager.bizAfterPay(order,settle);
	}
}
