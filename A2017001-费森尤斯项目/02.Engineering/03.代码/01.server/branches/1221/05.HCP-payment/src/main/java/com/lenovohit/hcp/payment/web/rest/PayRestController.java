package com.lenovohit.hcp.payment.web.rest;

import java.io.OutputStream;
import java.math.BigDecimal;
import java.util.Date;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.lenovohit.core.exception.BaseException;
import com.lenovohit.core.manager.GenericManager;
import com.lenovohit.core.utils.DateUtils;
import com.lenovohit.core.utils.JSONUtils;
import com.lenovohit.core.utils.StringUtils;
import com.lenovohit.core.web.MediaTypes;
import com.lenovohit.core.web.utils.Result;
import com.lenovohit.core.web.utils.ResultUtils;
import com.lenovohit.hcp.base.manager.TradeManager;
import com.lenovohit.hcp.base.model.HcpUser;
import com.lenovohit.hcp.base.web.rest.HcpBaseRestController;
import com.lenovohit.hcp.payment.manager.BasePayManager;
import com.lenovohit.hcp.payment.manager.TradeNofityManager;
import com.lenovohit.hcp.payment.model.HcpOrder;
import com.lenovohit.hcp.payment.model.HcpPayChannel;
import com.lenovohit.hcp.payment.model.HcpSettlement;
import com.lenovohit.hcp.payment.support.alipay.utils.ZxingUtils;
import com.lenovohit.hcp.payment.utils.SequenceUtils;
import com.lenovohit.hcp.payment.utils.StateUtils;

@RestController
@RequestMapping("/hcp/payment/pay")
public class PayRestController extends HcpBaseRestController {
	@Autowired
	private TradeManager tradeManager;
	@Autowired
	@Qualifier("aliPayManager")
	private BasePayManager aliPayManager;
	@Autowired
	@Qualifier("unionPayManager")
	private BasePayManager unionPayManager;
	@Autowired
	private TradeNofityManager tradeNofityManager;
	@Autowired
	private GenericManager<HcpPayChannel, String> hcpPayChannelManager;
	@Autowired
	private GenericManager<HcpSettlement, String> hcpSettlementManager;
	@Autowired
	private GenericManager<HcpOrder, String> hcpOrderManager;

	@RequestMapping(value = "/get/settleState/{id}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result getSettlementState(@PathVariable String id) {
		HcpSettlement settlement = hcpSettlementManager.get(id);
		if (settlement == null)
			return ResultUtils.renderFailureResult("不存在该笔结算单记录");
		if (StateUtils.isSettlementPayed(settlement))
			return ResultUtils.renderSuccessResult("支付成功");
		else if (StateUtils.isSettlementPayFailed(settlement) || StateUtils.isSettlementPayClosed(settlement))
			return ResultUtils.renderFailureResult("支付失败或已超时");
		return null;// 不成功也不失败说明正在处理，需要再次轮询 TODO
	}

	@RequestMapping(value = "/remove/{orderNo}", method = RequestMethod.DELETE, produces = MediaTypes.JSON_UTF_8)
	public Result forDelete(@PathVariable("orderNo") String orderNo) {
		try {
			tradeNofityManager.payResultNofity(false, orderNo);
		} catch (Exception e) {
			e.printStackTrace();
			throw new BaseException("删除失败");
		}
		return ResultUtils.renderSuccessResult();
	}

	@RequestMapping(value = "/create/createOrder/{orderNo}/{amt}", method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result createOrder(@PathVariable String orderNo, @PathVariable String amt) {
		// 前台必须传入的字段为orderNo amt金额。
		HcpOrder model = new HcpOrder();
		model.setOrderNo(orderNo);
		model.setAmt(new BigDecimal(amt));
		HcpUser user = this.getCurrentUser();
		String operator = StringUtils.isBlank(user.getUserId()) ? user.getName() : user.getUserId();
		model.setOperator(operator);
		model.setCreateTime(new Date());
		model.setOrderDesc("his门诊收费订单");
		model.setOrderType(HcpOrder.ORDER_TYPE_PAY);
		model.setStatus(HcpOrder.ORDER_STAT_INITIAL);
		HcpOrder result = null;
		try {
			result = tradeManager.createOrder(model);
		} catch (Exception e) {
			e.printStackTrace();
			return ResultUtils.renderFailureResult("生成订单失败，失败原因：" + e.getMessage());
		}
		return ResultUtils.renderSuccessResult(result);
	}

	@RequestMapping(value = "create/createSettlement/{orderNo}/{amt}/{payChannelCode}", method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	// 必输字段（orderId（为订单的no，不是32位的uuid）,amt,payChannelCode）
	public Result preCreate(@PathVariable String orderNo, @PathVariable String amt,
			@PathVariable String payChannelCode) {
		HcpSettlement settlement = new HcpSettlement();
		// Tip:字段用于关联order，传orderNo实际存的是orderId 见checkAndBuildPaySettlement
		settlement.setOrderId(orderNo);
		settlement.setAmt(new BigDecimal(amt));
		settlement.setPayChannelCode(payChannelCode);
		settlement.setPayTypeCode(HcpSettlement.SETTLE_TYPE_PAY);
		try {
			checkAndBuildPaySettlement(settlement);// 金额 支付渠道 支付方式
			// 支付者手机号码以及订单信息由前台传入，剩余信息进行组装
			hcpSettlementManager.save(settlement);
			precreateCall(settlement);
			settlement = hcpSettlementManager.save(settlement);
		} catch (Exception e) {
			e.printStackTrace();
			return ResultUtils.renderFailureResult("预支付失败，失败原因为" + e.getMessage());
		}
		return ResultUtils.renderSuccessResult(settlement);
	}

	/**
	 * Discription:[根据二维码链接生成二维码图片]
	 * @param request
	 * @param response
	 * @return
	 */
	@RequestMapping(value = "/showQrCode/{id}/{size}", method = RequestMethod.GET)
	public String showQrCode(@PathVariable("id") String id, @PathVariable("size") int size) {
		HcpSettlement settlement = this.hcpSettlementManager.get(id);
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

	/**
	 * 支付宝回调
	 * 修改结算单状态，记录支付金额
	 * 查询订单，计算订单是否完全支付完毕
	 * 如果订单支付完毕，则回调业务逻辑通知his
	 * @param settleId
	 * @return
	 */
	@RequestMapping(value = "/callback/alipay/{settleId}", method = RequestMethod.POST)
	public String forAliPayCallback(@PathVariable("settleId") String settleId, @RequestBody String data) {
		HcpSettlement settle = this.hcpSettlementManager.get(settleId);
		if (null == settle || !StringUtils.equals(HcpSettlement.SETTLE_STAT_INITIAL, settle.getStatus()))
			return "success";
		settle.getVariables().put("responseStr", data);

		payCallBack(settle);
		HcpOrder order = hcpOrderManager.findOneByProp("orderNo", settle.getOrder().getOrderNo());
		if (StateUtils.isSettlementPayed(settle)) {
			order.setStatus(HcpOrder.ORDER_STAT_PAY_SUCCESS);
			order.setTranTime(DateUtils.getCurrentDate());
			// bizAfterPay(order, settle);//TODO 调用his接口通知订单完成
			tradeNofityManager.payResultNofity(true, order.getOrderNo());
		}
		this.hcpOrderManager.save(order);
		this.hcpSettlementManager.save(settle);

		return "success";
	}

	/**
	 * 微信预回调
	 * 0.状态校验 1.结算单处理 2.订单处理 3.回调业务逻辑通知HIS
	 * @param settleId
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/callback/wxpay/{settleId}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forWXPayCallback(@PathVariable("settleId") String settleId, @RequestBody String data) {
		HcpSettlement payed = JSONUtils.deserialize(data, HcpSettlement.class);
		HcpSettlement settle = this.hcpSettlementManager.get(settleId);
		settle.setRealAmt(payed.getRealAmt());
		return ResultUtils.renderSuccessResult(settle);
	}

	/**
	 * 银联回调，由前台页面发起
	 * 0.状态校验 1.结算单处理 2.订单处理 3.回调业务逻辑通知HIS
	 * @param settleId
	 * @param data
	 * @return
	 */
	@SuppressWarnings("unchecked")
	@RequestMapping(value = "/callback/unionpay/{settleId}", method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result forUnionPayCallback(@PathVariable("settleId") String settleId, @RequestBody String data) {
		HcpSettlement payInfo = JSONUtils.deserialize(data, HcpSettlement.class);
		try {
			// 0. 状态检验
			HcpSettlement settle = this.hcpSettlementManager.get(settleId);
			settle.setRespText(payInfo.getRespText());
			if (null == settle || !StringUtils.equals(HcpSettlement.SETTLE_STAT_INITIAL, settle.getStatus()))
				return ResultUtils.renderFailureResult("结算状态错误！");
			// 1. 结算单处理
			unionPayManager.payCallBack(settle);
			// 2. 订单处理
			HcpOrder order = settle.getOrder();
			order.setRealAmt(order.getRealAmt().add(settle.getAmt()));// 此时记录真正支付的金额
			if (StringUtils.equals(settle.getStatus(), HcpSettlement.SETTLE_STAT_PAY_SUCCESS)
					&& order.getRealAmt().compareTo(order.getAmt()) == 0) {
				order.setStatus(HcpOrder.ORDER_STAT_PAY_SUCCESS);
				order.setTranTime(DateUtils.getCurrentDate());
				// 3. His通知
				tradeNofityManager.payResultNofity(true, order.getOrderNo());
			}
			this.hcpOrderManager.save(order);
			this.hcpSettlementManager.save(settle);

			return ResultUtils.renderSuccessResult(settle);
		} catch (BaseException be) {
			log.error("银联支付失败，结算单号为【" + settleId + "】");
			return ResultUtils.renderFailureResult(be.getMessage());
		} catch (Exception e) {
			log.error("银联支付失败，结算单号为【" + settleId + "】");
			return ResultUtils.renderFailureResult("银联支付失败！");
		}
	}

	private void precreateCall(HcpSettlement settle) {
		if (HcpPayChannel.PAY_CODE_ALIPAY.equals(settle.getPayChannelCode())) {
			aliPayManager.precreate(settle);
		} else if (HcpPayChannel.PAY_CODE_WXPAY.equals(settle.getPayChannelCode())) {
			// wXpayManager.precreate(settle);
		} else if (HcpPayChannel.PAY_CODE_CASH.equals(settle.getPayChannelCode())) {
			// 现金直接支付，即相当于回调成功执行
			settle.setStatus(HcpSettlement.SETTLE_STAT_PAY_SUCCESS);
			settle.setTradeTime(new Date());
			settle.setTradeStatus(HcpSettlement.SETTLE_TRADE_SUCCESS);
			settle.setRealAmt(settle.getAmt());
			HcpOrder order = hcpOrderManager.findOneByProp("orderNo", settle.getOrder().getOrderNo());
			order.setStatus(HcpOrder.ORDER_STAT_PAY_SUCCESS);
			order.setTranTime(DateUtils.getCurrentDate());
			tradeNofityManager.payResultNofity(true, order.getOrderNo());
			hcpOrderManager.save(order);
		}
		// TODO 后期考虑动态调用
	}

	/**
	 * 根据 支付异步回调
	 * @param order
	 * @throws Exception
	 */
	private void payCallBack(HcpSettlement settle) {
		if (null != settle && "alipay".equals(settle.getPayChannelCode())) {
			aliPayManager.payCallBack(settle);
		} /*
			 * else if(null != settle &&
			 * "wxpay".equals(settle.getPayChannelCode())){
			 * wXpayManager.payCallBack(settle); }
			 */
		// TODO 后期考虑动态调用
	}

	private void checkAndBuildPaySettlement(HcpSettlement settlement) {
		checkSettlement(settlement);
		buildPaySettlement(settlement);
	}

	private void buildPaySettlement(HcpSettlement settlement) {
		settlement.setSettleNo(SequenceUtils.getSettleSeq(HcpSettlement.SETTLE_TYPE_PAY));// 结算单号
		HcpOrder order = hcpOrderManager.findOneByProp("orderNo", settlement.getOrderId());
		if (order == null)
			throw new RuntimeException("订单不能为空");
		settlement.setOrder(order);
		settlement.setSettleType(HcpSettlement.SETTLE_TYPE_PAY);// 结算类型
		if (StringUtils.isEmpty(settlement.getStatus())) {
			settlement.setStatus(HcpSettlement.SETTLE_STAT_INITIAL);// 结算状态
		}
		HcpPayChannel payChannel = hcpPayChannelManager.findOne("from HcpPayChannel where code = ?",
				settlement.getPayChannelCode());
		settlement.setPayChannelId(payChannel.getId());
		settlement.setPayChannelCode(payChannel.getCode());
		settlement.setPayChannelName(payChannel.getName());
		settlement.setPayTypeId("");
		settlement.setPayTypeCode(settlement.getPayTypeCode());
		settlement.setPayTypeName("");
		settlement.setCreateTime(new Date());// 创建时间
	}

	private void checkSettlement(HcpSettlement settlement) {
		if (StringUtils.isBlank(settlement.getAmt()))
			throw new RuntimeException("金额不能为空");

		if (StringUtils.isBlank(settlement.getOrderId()))
			throw new RuntimeException("订单不能为空");
		/**渠道信息 【 银联 支付宝 微信  现金】**/
		if (StringUtils.isEmpty(settlement.getPayChannelCode())) {
			throw new NullPointerException("支付渠道不能为空!");
		}
		HcpPayChannel payChannel = hcpPayChannelManager.findOne("from HcpPayChannel where code = ?",
				settlement.getPayChannelCode());
		if (null == payChannel) {
			throw new NullPointerException("不支持的支付渠道");
		}
		if (StringUtils.isEmpty(settlement.getPayTypeCode())) {
			throw new NullPointerException("支付类型不能为空!");
		}
	}
}
