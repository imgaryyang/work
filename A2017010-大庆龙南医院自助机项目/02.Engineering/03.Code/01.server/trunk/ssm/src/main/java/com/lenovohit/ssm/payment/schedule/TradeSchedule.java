package com.lenovohit.ssm.payment.schedule;

import java.util.Date;
import java.util.List;

import org.apache.commons.configuration.Configuration;
import org.apache.commons.configuration.ConfigurationException;
import org.apache.commons.configuration.PropertiesConfiguration;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import com.lenovohit.core.exception.BaseException;
import com.lenovohit.core.manager.GenericManager;
import com.lenovohit.core.utils.DateUtils;
import com.lenovohit.core.utils.SpringUtils;
import com.lenovohit.core.utils.StringUtils;
import com.lenovohit.ssm.payment.manager.HisPayManager;
import com.lenovohit.ssm.payment.manager.PayBaseManager;
import com.lenovohit.ssm.payment.model.CheckRecord;
import com.lenovohit.ssm.payment.model.Order;
import com.lenovohit.ssm.payment.model.PayChannel;
import com.lenovohit.ssm.payment.model.Settlement;
import com.lenovohit.ssm.payment.utils.OrderSeqCalculator;
import com.lenovohit.ssm.treat.model.HisOrder;
import com.lenovohit.ssm.treat.transfer.manager.HisEntityResponse;
import com.lenovohit.ssm.treat.transfer.manager.HisResponse;

/**
 * 交易定时器
 * <p>Title: TranSchedule</p>
 * <p>Description: </p>
 * <p>Company: LenovoHit</p>
 * @author    zyus
 * @date      2014-6-8
 */
public class TradeSchedule {
	private static final Log log = LogFactory.getLog(TradeSchedule.class);
	
	public static String CHECK_DIR = "";
//	private static final String SYNC_TYPE_PAY = "PAY";
	private static final String SYNC_TYPE_REFUND = "REFUND";
//	private static final String SYNC_TYPE_CANCEL = "CANCEL";
//	private static final String SYNC_TYPE_REVERSE = "REVERSE";
	private static final String SYNC_TYPE_DOWNLOAD = "DOWNLOAD";
	private static final String SYNC_TYPE_IMPORT = "IMPORT";
	private static final String SYNC_TYPE_CHECK = "CHECK";
	private static final String SYNC_TYPE_RET_DOWNLOAD = "RET_DOWNLOAD";
	private static final String SYNC_TYPE_RET_IMPORT = "RET_IMPORT";
	private static final long[] SYNC_REFUND_WAITTIME = {5, 15, 30, 60, 2*60, 6*60, 12*60, 24*60, 2*24*60, 3*24*60};
	
	private static final long SYNC_REPEAT_WAITTIME = 5 * 1000;			//同步请求发送间隔时间
//	private static final long SYNC_PAY_WAITTIME = 1 * 60 * 1000;  		//同步支付处理等待间隔时间
//	private static final long SYNC_REFUND_WAITTIME = 30 * 60 * 1000;	//同步退款处理等待间隔时间
//	private static final long SYNC_CANCEL_WAITTIME = 30 * 60 * 1000;	//同步撤销处理等待间隔时间
//	private static final long SYNC_REVERSE_WAITTIME = 30 * 60 * 1000;	//同步冲正处理等待间隔时间
	private static final int SYNC_MAX_NUM = 3; 							//最大同步次数
	private static final int SYNC_REFUND_MAX_NUM = 5; 					//退款最大同步次数
//	private static final int SYNC_ONCE_MAX_REPEAT = 3;					//一次同步最大重发次数
	
	private GenericManager<CheckRecord, String> checkRecordManager;
	private GenericManager<PayChannel, String> payChannelManager;
	private GenericManager<Settlement, String> settlementManager;
	private GenericManager<Order, String> orderManager;
	
	// 根据文件名读取配置文件，文件后缀名必须为.properties
	static {
		try {
			Configuration configs = new PropertiesConfiguration("checkinfo.properties");
			CHECK_DIR = configs.getString("checkfile.dir");

			log.info("配置文件名: checkinfo.properties");
		} catch (ConfigurationException e) {
			e.printStackTrace();
		}
	}
    
	public GenericManager<CheckRecord, String> getCheckRecordManager() {
		return checkRecordManager;
	}

	public void setCheckRecordManager(GenericManager<CheckRecord, String> checkRecordManager) {
		this.checkRecordManager = checkRecordManager;
	}

	public GenericManager<PayChannel, String> getPayChannelManager() {
		return payChannelManager;
	}

	public void setPayChannelManager(GenericManager<PayChannel, String> payChannelManager) {
		this.payChannelManager = payChannelManager;
	}

	public void setOrderManager(GenericManager<Order, String> orderManager) {
		this.orderManager = orderManager;
	}
	
	public GenericManager<Order, String> getOrderManager() {
		return orderManager;
	}

	public GenericManager<Settlement, String> getSettlementManager() {
		return settlementManager;
	}

	public void setSettlementManager(GenericManager<Settlement, String> settlementManager) {
		this.settlementManager = settlementManager;
	}

	/**
	 * 定时同步对账文件
	 * <p>Title: syncCheckFile</p>
	 * <p>Description: </p>
	 * @throws BaseException
	 */
	public void syncCheckFile() throws BaseException {
		log.info("对账文件同步开始--------------------------------------");
		List<PayChannel> pcl = this.payChannelManager.findAll();
		Date checkDate = DateUtils.addDays(new Date(), -1);
		String checkDateStr = DateUtils.date2String(checkDate, "yyyy-MM-dd");
		CheckRecord checkRecord = null;
		for(PayChannel pc : pcl){
			if(StringUtils.isNotEmpty(pc.getCheckTime()) && StringUtils.isEmpty(pc.getRefCheckTime())
					&& checkDate.after(DateUtils.string2Date(checkDateStr + pc.getCheckTime(), "yyyy-MM-ddHH:mm:ss"))){
				
				checkRecord = this.checkRecordManager.findOne("from CheckRecord where optType = '0' and chkDate = ? and chkType = ? and payChannel.id = ?", 
						checkDateStr, CheckRecord.CHK_TYPE_ALL, pc.getId());
				if(null != checkRecord && (StringUtils.equals(checkRecord.getStatus(), CheckRecord.CHK_STAT_INITIAL)
						|| StringUtils.equals(checkRecord.getStatus(), CheckRecord.CHK_STAT_FILE_FAILURE)) 
						&& checkRecord.getSyncNum() < SYNC_MAX_NUM){
					checkRecord.setSyncTime(DateUtils.getCurrentDate());
					checkRecord.setSyncNum(checkRecord.getSyncNum() + 1); 
					new ScheduleEngine(checkRecord, SYNC_TYPE_DOWNLOAD, pc.getCode()).start();
				} else if(null != checkRecord && !StringUtils.equals(checkRecord.getStatus(), CheckRecord.CHK_STAT_INITIAL)){
				} else if(null == checkRecord){
					checkRecord = new CheckRecord();
					checkRecord.setPayChannel(pc);
					checkRecord.setStatus(CheckRecord.CHK_STAT_INITIAL);
					checkRecord.setChkType(CheckRecord.CHK_TYPE_ALL);
					checkRecord.setChkDate(checkDateStr);
					checkRecord.setOptType(CheckRecord.CHK_OPTTYPE_AUTO);
					checkRecord.setSyncType(pc.getCheckUrl().substring(0, pc.getCheckUrl().indexOf(":")));
					checkRecord.setSyncTime(DateUtils.getCurrentDate());
					checkRecord.setSyncNum(1);
					
					new ScheduleEngine(checkRecord, SYNC_TYPE_DOWNLOAD, pc.getCode()).start();
				} else {
					log.info("你已同步对账文件超过3次！不给操作了！");
				}
			} 
			if(StringUtils.isNotEmpty(pc.getCheckTime()) && StringUtils.isNotEmpty(pc.getRefCheckTime())
					&& checkDate.after(DateUtils.string2Date(checkDateStr  + pc.getRefCheckTime(), "yyyy-MM-ddHH:mm:ss"))){
				
				checkRecord = this.checkRecordManager.findOne("from CheckRecord where optType = '0' and chkDate = ? and chkType = ? and payChannel.id = ?", 
						checkDateStr, CheckRecord.CHK_TYPE_PAY, pc.getId());
				if(null != checkRecord && (StringUtils.equals(checkRecord.getStatus(), CheckRecord.CHK_STAT_INITIAL)
						|| StringUtils.equals(checkRecord.getStatus(), CheckRecord.CHK_STAT_FILE_FAILURE))
						&& checkRecord.getSyncNum() < SYNC_MAX_NUM){
					checkRecord.setSyncTime(DateUtils.getCurrentDate());
					checkRecord.setSyncNum(checkRecord.getSyncNum() + 1); 
					new ScheduleEngine(checkRecord, SYNC_TYPE_DOWNLOAD, pc.getCode()).start();
				} else if(null != checkRecord && !StringUtils.equals(checkRecord.getStatus(), CheckRecord.CHK_STAT_INITIAL)){
				} else if(null == checkRecord){
					checkRecord = new CheckRecord();
					checkRecord.setPayChannel(pc);
					checkRecord.setStatus(CheckRecord.CHK_STAT_INITIAL);
					checkRecord.setChkType(CheckRecord.CHK_TYPE_PAY);
					checkRecord.setChkDate(checkDateStr);
					checkRecord.setOptType(CheckRecord.CHK_OPTTYPE_AUTO);
					checkRecord.setSyncType(pc.getCheckUrl().substring(0, pc.getCheckUrl().indexOf(":")));
					checkRecord.setSyncTime(DateUtils.getCurrentDate());
					checkRecord.setSyncNum(1);
					
					new ScheduleEngine(checkRecord, SYNC_TYPE_DOWNLOAD, pc.getCode()).start();
				} else {
					log.info("你已同步对账文件超过3次！不给操作了！");
				}
			}
			if(StringUtils.isEmpty(pc.getCheckTime()) && StringUtils.isNotBlank(pc.getRefCheckTime())
					&& checkDate.after(DateUtils.string2Date(checkDateStr  +  pc.getRefCheckTime(), "yyyy-MM-ddHH:mm:ss"))){
				checkRecord = this.checkRecordManager.findOne("from CheckRecord where optType = '0' and chkDate = ? and chkType = ? and payChannel.id = ?", 
						checkDateStr, CheckRecord.CHK_TYPE_REFUND, pc.getId());
				if(null != checkRecord && (StringUtils.equals(checkRecord.getStatus(), CheckRecord.CHK_STAT_INITIAL)
						|| StringUtils.equals(checkRecord.getStatus(), CheckRecord.CHK_STAT_FILE_FAILURE)) 
						&& checkRecord.getSyncNum() < SYNC_MAX_NUM){
					checkRecord.setSyncTime(DateUtils.getCurrentDate());
					checkRecord.setSyncNum(checkRecord.getSyncNum() + 1); 
					new ScheduleEngine(checkRecord, SYNC_TYPE_DOWNLOAD, pc.getCode()).start();
				} else if(null != checkRecord && !StringUtils.equals(checkRecord.getStatus(), CheckRecord.CHK_STAT_INITIAL)){
				} else if(null == checkRecord){
					checkRecord = new CheckRecord();
					checkRecord.setPayChannel(pc);
					checkRecord.setStatus(CheckRecord.CHK_STAT_INITIAL);
					checkRecord.setChkType(CheckRecord.CHK_TYPE_REFUND);
					checkRecord.setChkDate(checkDateStr);
					checkRecord.setOptType(CheckRecord.CHK_OPTTYPE_AUTO);
					checkRecord.setSyncType(pc.getRefCheckUrl().substring(0, pc.getRefCheckUrl().indexOf(":")));
					checkRecord.setSyncTime(DateUtils.getCurrentDate());
					checkRecord.setSyncNum(1);
					
					new ScheduleEngine(checkRecord, SYNC_TYPE_DOWNLOAD, pc.getCode()).start();
				} else {
					log.info("你已同步对账文件超过3次！不给操作了！");
				}
			}
		}

		log.info("对账文件同步结束--------------------------------------");
	}
	
	/**
	 * 定时导入对账文件
	 * <p>Title: importCheckFile</p>
	 * <p>Description: </p>
	 * @throws BaseException
	 */
	public void importCheckFile() throws BaseException {
		log.info("对账文件导入开始--------------------------------------");
		Date checkDate = DateUtils.addDays(new Date(), -1);
		String checkDateStr = DateUtils.date2String(checkDate, "yyyy-MM-dd");
		List<CheckRecord> crl = this.checkRecordManager.find("from CheckRecord where optType = '0' and chkType != '3' and chkDate = ? and status=?", checkDateStr, CheckRecord.CHK_STAT_FILE_SUCCESS);
		for(CheckRecord cr : crl){
			cr.setImpTime(DateUtils.getCurrentDate());
			new ScheduleEngine(cr, SYNC_TYPE_IMPORT, cr.getPayChannel().getCode()).start();
		}

		log.info("对账文件同步结束--------------------------------------");
	}
	
	/**
	 * 定时对账
	 * <p>Title: checkOrder</p>
	 * <p>Description: </p>
	 * @throws BaseException
	 */
	public void checkOrder() throws BaseException {
		log.info("对账开始--------------------------------------");
		Date checkDate = DateUtils.addDays(new Date(), -1);
		String checkDateStr = DateUtils.date2String(checkDate, "yyyy-MM-dd");
		List<CheckRecord> crl = this.checkRecordManager.find("from CheckRecord where optType = '0' and chkType != '3' and chkDate = ? and status=?", checkDateStr, CheckRecord.CHK_STAT_IMP_SUCCESS);
		for(CheckRecord cr : crl){
			cr.setChkTime(DateUtils.getCurrentDate());
			new ScheduleEngine(cr, SYNC_TYPE_CHECK, cr.getPayChannel().getCode()).start();
		}
		log.info("对账结束--------------------------------------");
	}
	
	/**
	 * 定时同步退汇文件
	 * <p>Title: syncReturnFile</p>
	 * <p>Description: </p>
	 * @throws BaseException
	 */
	public void syncReturnFile() throws BaseException {
		log.info("退汇文件同步开始--------------------------------------");
		List<PayChannel> pcl = this.payChannelManager.findAll();
		Date checkDate = DateUtils.addDays(new Date(), -2);
		String checkDateStr = DateUtils.date2String(checkDate, "yyyy-MM-dd");
		CheckRecord checkRecord = null;
		for(PayChannel pc : pcl){
			if(StringUtils.isNotEmpty(pc.getRetCheckTime()) 
					&& checkDate.after(DateUtils.string2Date(checkDateStr + pc.getRetCheckTime(), "yyyy-MM-ddHH:mm:ss"))){
				
				checkRecord = this.checkRecordManager.findOne("from CheckRecord where optType = '0' and chkType = '3' and chkDate = ? and payChannel.id = ?", 
						checkDateStr, pc.getId());
				if(null != checkRecord && (StringUtils.equals(checkRecord.getStatus(), CheckRecord.CHK_STAT_INITIAL)
						|| StringUtils.equals(checkRecord.getStatus(), CheckRecord.CHK_STAT_FILE_FAILURE)) 
						&& checkRecord.getSyncNum() < SYNC_MAX_NUM){
					checkRecord.setSyncTime(DateUtils.getCurrentDate());
					checkRecord.setSyncNum(checkRecord.getSyncNum() + 1); 
					new ScheduleEngine(checkRecord, SYNC_TYPE_RET_DOWNLOAD, pc.getCode()).start();
				} else if(null != checkRecord && !StringUtils.equals(checkRecord.getStatus(), CheckRecord.CHK_STAT_INITIAL)){
				} else if(null == checkRecord){
					checkRecord = new CheckRecord();
					checkRecord.setPayChannel(pc);
					checkRecord.setStatus(CheckRecord.CHK_STAT_INITIAL);
					checkRecord.setChkType(CheckRecord.CHK_TYPE_RETURN);
					checkRecord.setChkDate(checkDateStr);
					checkRecord.setOptType(CheckRecord.CHK_OPTTYPE_AUTO);
					checkRecord.setSyncType(pc.getCheckUrl().substring(0, pc.getCheckUrl().indexOf(":")));
					checkRecord.setSyncTime(DateUtils.getCurrentDate());
					checkRecord.setSyncNum(1);
					
					new ScheduleEngine(checkRecord, SYNC_TYPE_RET_DOWNLOAD, pc.getCode()).start();
				} else {
					log.info("你已同步对账文件超过3次！不给操作了！");
				}
			} 
		}

		log.info("对账文件同步结束--------------------------------------");
	}
	
	/**
	 * 定时导入退汇文件
	 * <p>Title: importReturnFile</p>
	 * <p>Description: </p>
	 * @throws BaseException
	 */
	public void importReturnFile() throws BaseException {
		log.info("对账文件导入开始--------------------------------------");
		Date checkDate = DateUtils.addDays(new Date(), -3);
		String checkDateStr = DateUtils.date2String(checkDate, "yyyy-MM-dd");
		List<CheckRecord> crl = this.checkRecordManager.find("from CheckRecord where optType = '0' and chkDate = ? and chkType = '3' and status=?", checkDateStr, CheckRecord.CHK_STAT_FILE_SUCCESS);
		for(CheckRecord cr : crl){
			cr.setImpTime(DateUtils.getCurrentDate());
			new ScheduleEngine(cr, SYNC_TYPE_RET_IMPORT, cr.getPayChannel().getCode()).start();
		}

		log.info("对账文件同步结束--------------------------------------");
	}
	
	/**
	 * 退款结算单状态同步
	 * <p>Title: syncPayStat</p>
	 * <p>Description: </p>
	 * @throws BaseException
	 */
	public void syncRefundStat() throws BaseException {
		log.info("退款结算单状态同步开始--------------------------------------");
		String hql = "from Settlement where 1=1 and settleType=? and syncNum<? and status=?";
		List<Settlement> slist = this.settlementManager.find(hql, 
				Settlement.SETTLE_TYPE_REFUND, SYNC_REFUND_MAX_NUM, Settlement.SETTLE_STAT_REFUNDING);
		for(Settlement settlement : slist){
			if ((System.currentTimeMillis() - settlement.getCreateTime().getTime()) < 
					SYNC_REFUND_WAITTIME[settlement.getSyncNum() + 5] * 60 * 1000){
				continue;
			}
			settlement.setSyncNum(settlement.getSyncNum() + 1);
			settlement.setPayChannel(this.getPayChannelManager().get(settlement.getPayChannelId()));
			new ScheduleEngine(settlement, SYNC_TYPE_REFUND, settlement.getPayChannelCode(), this.orderManager, this.settlementManager).start();
			try {
				Thread.sleep(SYNC_REPEAT_WAITTIME);
			} catch (InterruptedException e) {
				e.printStackTrace();
			}
		}
		log.info("退款结算单状态同步结束--------------------------------------");
	}
	/**
	 * 定时器处理引擎
	 * <p>Title: ScheduleEngine</p>
	 * <p>Description: </p>
	 * <p>Company: INFOHOLD</p>
	 * @author    zyus
	 * @date      2014-6-8
	 */
	private class ScheduleEngine extends Thread {
		private GenericManager<Settlement, String> settlementManager;
		private GenericManager<Order, String> orderManager;
		private PayBaseManager payBaseManager;
		private CheckRecord checkRecord;
		private Settlement settlement;
		private String payChannel;
		private String mode;									//方式 PAY-支付、REFUND-退款、CANCEL-撤销、CHECK-对账

		public ScheduleEngine(CheckRecord checkRecord, String mode, String payChannel){
			this.checkRecord = checkRecord;
			this.mode = mode;
			this.payChannel = payChannel;
		}
		public ScheduleEngine(Settlement settlement, String mode, String payChannel, GenericManager<Order, String> orderManager, GenericManager<Settlement, String> settlementManager){
			this.settlement = settlement;
			this.mode = mode;
			this.payChannel = payChannel;
			this.orderManager = orderManager;
			this.settlementManager = settlementManager;
		}
		public void run(){
			switch (payChannel) {
            case "9999":
            	this.payBaseManager = (PayBaseManager)SpringUtils.getBean("alipayManager");
                break;
            case "9998":
            	this.payBaseManager = (PayBaseManager)SpringUtils.getBean("wxpayManager");
                break;
            case "0308":
            	if (StringUtils.equals(SYNC_TYPE_DOWNLOAD, this.mode) 
						|| StringUtils.equals(SYNC_TYPE_IMPORT, this.mode)
						|| StringUtils.equals(SYNC_TYPE_CHECK, this.mode)
						|| StringUtils.equals(SYNC_TYPE_RET_DOWNLOAD, this.mode) 
						|| StringUtils.equals(SYNC_TYPE_RET_IMPORT, this.mode)){
            		if(StringUtils.equals(checkRecord.getChkType(), CheckRecord.CHK_TYPE_REFUND)
            				|| StringUtils.equals(checkRecord.getChkType(), CheckRecord.CHK_TYPE_RETURN))
            			this.payBaseManager = (PayBaseManager)SpringUtils.getBean("cmbPayManager");
            		else 
            			this.payBaseManager = (PayBaseManager)SpringUtils.getBean("unionPayManager");
            	} else {
            		if(StringUtils.equals(settlement.getSettleType(), Settlement.SETTLE_TYPE_REFUND))
            			this.payBaseManager = (PayBaseManager)SpringUtils.getBean("cmbPayManager");
            		else 
            			this.payBaseManager = (PayBaseManager)SpringUtils.getBean("unionPayManager");
            	}
            	break;
            case "0000":
            	this.payBaseManager = (PayBaseManager)SpringUtils.getBean("cashManager");
                break;
            default : 
            	if (StringUtils.equals(SYNC_TYPE_DOWNLOAD, this.mode) 
						|| StringUtils.equals(SYNC_TYPE_IMPORT, this.mode)
						|| StringUtils.equals(SYNC_TYPE_CHECK, this.mode)
						|| StringUtils.equals(SYNC_TYPE_RET_DOWNLOAD, this.mode) 
						|| StringUtils.equals(SYNC_TYPE_RET_IMPORT, this.mode)){
            		if(StringUtils.equals(checkRecord.getChkType(), CheckRecord.CHK_TYPE_REFUND)
            				|| StringUtils.equals(checkRecord.getChkType(), CheckRecord.CHK_TYPE_RETURN))
            			this.payBaseManager = (PayBaseManager)SpringUtils.getBean("bankPayManager");
            		else 
            			this.payBaseManager = (PayBaseManager)SpringUtils.getBean("unionPayManager");
            	} else {
            		if(StringUtils.equals(settlement.getSettleType(), Settlement.SETTLE_TYPE_REFUND))
            			this.payBaseManager = (PayBaseManager)SpringUtils.getBean("bankPayManager");
            		else 
            			this.payBaseManager = (PayBaseManager)SpringUtils.getBean("unionPayManager");
            	}
                break;
			}
			if(StringUtils.equals(SYNC_TYPE_DOWNLOAD, this.mode)){
				this.payBaseManager.syncCheckFile(checkRecord);
			}
			if(StringUtils.equals(SYNC_TYPE_IMPORT, this.mode)){
				this.payBaseManager.importCheckFile(checkRecord);
			}
			if(StringUtils.equals(SYNC_TYPE_CHECK, this.mode)){
				this.payBaseManager.checkOrder(checkRecord);
			}
			if(StringUtils.equals(SYNC_TYPE_RET_DOWNLOAD, this.mode)){
				this.payBaseManager.syncReturnFile(checkRecord);
			}
			if(StringUtils.equals(SYNC_TYPE_RET_IMPORT, this.mode)){
				this.payBaseManager.importReturnFile(checkRecord);
			}
			if(StringUtils.equals(SYNC_TYPE_REFUND, this.mode)){
				this.payBaseManager.refundQuery(settlement);
				this.syncRefund(settlement);
			}
		}

		@SuppressWarnings("unchecked")
		private void syncRefund(Settlement settlement){
			//2. 订单处理
			Order order = settlement.getOrder();
			if(StringUtils.equals(settlement.getStatus(), Settlement.SETTLE_STAT_REFUND_SUCCESS)){//2.2 退款成功处理
				//已经做过HIS交易的直接返回成功
				if(StringUtils.equals(order.getStatus(), Order.ORDER_STAT_TRAN_SUCCESS) ||
					StringUtils.equals(order.getStatus(), Order.ORDER_STAT_TRAN_FINISH)) {
					return ;
				//登记HIS交易
				} else {
					order.setStatus(Order.ORDER_STAT_REFUND_SUCCESS);
					order.setTranTime(DateUtils.getCurrentDate());
					order.setRealAmt(settlement.getAmt());//此时记录真正支付的金额
					
					HisResponse bizResponse = bizAfterRefund(order, settlement);
					if( null != bizResponse && bizResponse.isSuccess()){
						order.setStatus(Order.ORDER_STAT_TRAN_SUCCESS);//交易成功
						log.info("业务回调成功，修改订单状态 "+ order.getStatus());
					} else {
						order.setStatus(Order.ORDER_STAT_TRAN_FAILURE);//交易失败
						log.info("业务回调失败，修改订单状态 "+ order.getStatus());
					}
				}
			} else if(StringUtils.equals(settlement.getStatus(), Settlement.SETTLE_STAT_REFUND_FAILURE) || 
					StringUtils.equals(settlement.getStatus(), Settlement.SETTLE_STAT_REFUND_CANCELED) ){//2.4 退款失败|| 退款被撤销
				//考虑HIS已记账情况下的订单不通知HIS，需手工处理
				if(StringUtils.equals(order.getStatus(), Order.ORDER_STAT_TRAN_SUCCESS) ||
					StringUtils.equals(order.getStatus(), Order.ORDER_STAT_TRAN_FINISH) ||
					StringUtils.equals(order.getStatus(), Order.ORDER_STAT_REFUND_CANCELED) || 
					StringUtils.equals(order.getStatus(), Order.ORDER_STAT_CLOSED)) {
					return ;
				//HIS未记账或者退款取消状态下
				} else {
					order.setStatus(Order.ORDER_STAT_REFUND_FAILURE);
					order.setTranTime(DateUtils.getCurrentDate());
					order.setRealAmt(settlement.getAmt());//此时记录真正支付的金额
					
					//解冻接口
					HisEntityResponse<HisOrder> bizResponse = (HisEntityResponse<HisOrder>)bizAfterRefund(order, settlement);
					if( null != bizResponse && bizResponse.isSuccess()){
						Order _order = new Order();
						this.buildCancelOrder(_order, order);
						_order.setTranTime(DateUtils.getCurrentDate());
						_order.setBizNo(bizResponse.getEntity().getRechargeNumber());
						_order.setBizTime(bizResponse.getEntity().getPaymentTime());
						_order.setStatus(Order.ORDER_STAT_CANCEL);
						this.orderManager.save(_order);
						
						order.setStatus(Order.ORDER_STAT_CLOSED);//交易关闭
						order.setFinishTime(DateUtils.getCurrentDate());
						log.info("业务回调成功，修改订单状态 "+ order.getStatus());
					} else {
						order.setStatus(Order.ORDER_STAT_TRAN_FAILURE);//交易失败
						log.info("业务回调失败，修改订单状态 "+ order.getStatus());
					}
				}
			} else {
				//其他状态，业务不做处理
			}
			
			this.orderManager.save(order);
			this.settlementManager.save(settlement);
		};
		/**
		 * 根据 结算单退款情况回调业务
		 * @param order
		 * @throws Exception
		 */
		private HisResponse bizAfterRefund(Order order, Settlement settle){
			String beanName  = order.getBizBean();
			HisPayManager hisOrderManager = (HisPayManager) SpringUtils.getBean(beanName);
			return hisOrderManager.bizAfterRefund(order, settle);
		}
		
		private void buildCancelOrder(Order _order, Order oriOrder) {
			if (null == _order || null == oriOrder) {
	        	throw new NullPointerException("_order or oriOrder should not be NULL!");
	        }
			 //订单基本信息
	        _order.setOrderNo(OrderSeqCalculator.calculateCode(Order.ORDER_TYPE_CANCEL));
	        _order.setOrderType(Order.ORDER_TYPE_CANCEL);
	        _order.setOrderTitle("患者 "+oriOrder.getPatientName()+" 自助机取消退款 " + oriOrder.getAmt() + " 元！");
	        _order.setOrderDesc("患者 "+oriOrder.getPatientName()+" 自助机取消退款 " + oriOrder.getAmt() + " 元！");
	        _order.setStatus(Order.ORDER_STAT_INITIAL);
	        _order.setAmt(oriOrder.getAmt());
	        //订单业务信息
	        _order.setBizType(Order.BIZ_TYPE_PRESTORE);//门诊预存
	        _order.setBizNo("");//发起取消是为null
	        _order.setBizBean("");
	        //订单机器信息
	        _order.setMachineId(oriOrder.getMachineId());
	        _order.setMachineMac(oriOrder.getMachineMac());
	        _order.setMachineCode(oriOrder.getMachineCode());
	        _order.setMachineName(oriOrder.getMachineName());
	        _order.setMachineUser(oriOrder.getMachineUser());
	        _order.setMachineMngCode(oriOrder.getMachineMngCode());
	        //订单用户信息
	        _order.setHisNo(oriOrder.getHisNo());
	        _order.setPatientNo(oriOrder.getPatientNo());
	        _order.setPatientName(oriOrder.getPatientName());

	        _order.setCreateTime(DateUtils.getCurrentDate());
	        _order.setOriOrder(oriOrder);
		}
		
	}
}
