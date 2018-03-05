package com.lenovohit.hwe.pay.schedule;

import java.util.Date;
import java.util.List;

import org.apache.commons.configuration.Configuration;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import com.lenovohit.core.exception.BaseException;
import com.lenovohit.core.manager.GenericManager;
import com.lenovohit.core.utils.DateUtils;
import com.lenovohit.core.utils.StringUtils;
import com.lenovohit.hwe.pay.model.CheckRecord;
import com.lenovohit.hwe.pay.model.PayMerchant;
import com.lenovohit.hwe.pay.model.Settlement;
import com.lenovohit.hwe.pay.service.CheckService;
import com.lenovohit.hwe.pay.service.TradeService;
import com.lenovohit.hwe.pay.utils.PayMerchantConfigCache;

/**
 * 交易定时器
 * <p>Title: TradeSchedule</p>
 * <p>Description: </p>
 * <p>Company: LenovoHit</p>
 * @author    zyus
 * @date      2014-6-8
 */
public class TradeSchedule {
	private static final Log log = LogFactory.getLog(TradeSchedule.class);
	
//	private static final String SYNC_TYPE_PAY = "PAY";
	private static final String SYNC_TYPE_REFUND = "REFUND";
//	private static final String SYNC_TYPE_CANCEL = "CANCEL";
//	private static final String SYNC_TYPE_REVERSE = "REVERSE";
	private static final String SYNC_TYPE_DOWNLOAD = "DOWNLOAD";
	private static final String SYNC_TYPE_IMPORT = "IMPORT";
	private static final String SYNC_TYPE_CHECK = "CHECK";
	private static final String SYNC_TYPE_PAY_DOWNLOAD = "PAY_DOWNLOAD";
	private static final String SYNC_TYPE_PAY_IMPORT = "PAY_IMPORT";
	private static final String SYNC_TYPE_PAY_CHECK = "PAY_CHECK";
	private static final String SYNC_TYPE_REF_DOWNLOAD = "REF_DOWNLOAD";
	private static final String SYNC_TYPE_REF_IMPORT = "REF_IMPORT";
	private static final String SYNC_TYPE_REF_CHECK = "REF_CHECK";
	private static final String SYNC_TYPE_RET_DOWNLOAD = "RET_DOWNLOAD";
	private static final String SYNC_TYPE_RET_IMPORT = "RET_IMPORT";
	private static final String SYNC_TYPE_RET_CHECK = "RET_CHECK";
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
	private GenericManager<PayMerchant, String> payMerchantManager;
	private GenericManager<Settlement, String> settlementManager;
	private TradeService tradeService;
	private CheckService checkService;
	
    
	public TradeService getTradeService() {
		return tradeService;
	}

	public void setTradeService(TradeService tradeService) {
		this.tradeService = tradeService;
	}

	public CheckService getCheckService() {
		return checkService;
	}

	public void setCheckService(CheckService checkService) {
		this.checkService = checkService;
	}

	public GenericManager<CheckRecord, String> getCheckRecordManager() {
		return checkRecordManager;
	}

	public void setCheckRecordManager(GenericManager<CheckRecord, String> checkRecordManager) {
		this.checkRecordManager = checkRecordManager;
	}

	public GenericManager<PayMerchant, String> getPayMerchantManager() {
		return payMerchantManager;
	}

	public void setPayMerchantManager(GenericManager<PayMerchant, String> payMerchantManager) {
		this.payMerchantManager = payMerchantManager;
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
		List<PayMerchant> pml = this.payMerchantManager.findAll();
		Date checkDate = DateUtils.addDays(new Date(), -1);
		String checkDateStr = DateUtils.date2String(checkDate, "yyyy-MM-dd");
		String pmCheckTimeStr;
		String pmCheckUrl;
		Configuration pmConfig = null;
		CheckRecord checkRecord = null;
		for(PayMerchant pm : pml){
			pmConfig = PayMerchantConfigCache.getConfig(pm);
			pmCheckTimeStr = pmConfig.getString("check_time");
			pmCheckUrl = pmConfig.getString("check_url");
			if(StringUtils.isNotEmpty(pmCheckTimeStr)
					&& checkDate.after(DateUtils.string2Date(checkDateStr + pmCheckTimeStr, "yyyy-MM-ddHH:mm:ss"))){
				
				checkRecord = this.checkRecordManager.findOne("from CheckRecord where chkDate = ? and chkType = ? and mchId = ?", 
						checkDateStr, CheckRecord.CHK_TYPE_ALL, pm.getId());
				if(null != checkRecord  && checkRecord.getSyncNum() < SYNC_MAX_NUM
						&& (StringUtils.equals(checkRecord.getStatus(), CheckRecord.CHK_STAT_INITIAL) || StringUtils.equals(checkRecord.getStatus(), CheckRecord.CHK_STAT_FILE_FAILURE))){
					if(CheckRecord.CHK_OPTTYPE_HAND.equals(checkRecord.getOptType())){
						continue;
					}
					checkRecord.setSyncTime(DateUtils.getCurrentDate());
					checkRecord.setSyncNum(checkRecord.getSyncNum() + 1); 
					new ScheduleEngine(checkRecord, SYNC_TYPE_DOWNLOAD, this.checkService).start();
				} else if(null != checkRecord && !StringUtils.equals(checkRecord.getStatus(), CheckRecord.CHK_STAT_INITIAL)){
				} else if(null == checkRecord){
					checkRecord = new CheckRecord();
					checkRecord.setPayMerchant(pm);
					checkRecord.setPcId(pm.getPayChannel().getId());
					checkRecord.setMchId(pm.getId());
					checkRecord.setStatus(CheckRecord.CHK_STAT_INITIAL);
					checkRecord.setChkType(CheckRecord.CHK_TYPE_ALL);
					checkRecord.setChkDate(checkDateStr);
					checkRecord.setOptType(CheckRecord.CHK_OPTTYPE_AUTO);
					checkRecord.setSyncType(pmCheckUrl.substring(0, pmCheckUrl.indexOf(":")));
					checkRecord.setSyncTime(DateUtils.getCurrentDate());
					checkRecord.setSyncNum(1);
					new ScheduleEngine(checkRecord, SYNC_TYPE_DOWNLOAD, this.checkService).start();
				} else {
					log.info("你已同步对账文件超过3次！不给操作了！");
				}
			} 
			
			try {//TODO 分开同步
				Thread.sleep(10000);
			} catch (InterruptedException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
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
		List<CheckRecord> crl = this.checkRecordManager.find("from CheckRecord where optType = '0' and chkDate = ? and chkType = ? and status = ?", 
				checkDateStr, CheckRecord.CHK_TYPE_ALL, CheckRecord.CHK_STAT_FILE_SUCCESS);
		for(CheckRecord cr : crl){
			cr.setImpTime(DateUtils.getCurrentDate());
			new ScheduleEngine(cr, SYNC_TYPE_IMPORT, this.checkService).start();
		}

		log.info("对账文件同步结束--------------------------------------");
	}
	
	/**
	 * 定时对账
	 * <p>Title: checkOrder</p>
	 * <p>Description: </p>
	 * @throws BaseException
	 */
	public void checkOrder() {
		log.info("对账开始--------------------------------------");
		Date checkDate = DateUtils.addDays(new Date(), -1);
		String checkDateStr = DateUtils.date2String(checkDate, "yyyy-MM-dd");
		List<CheckRecord> crl = this.checkRecordManager.find("from CheckRecord where optType = '0' and chkDate = ? and chkType = ? and status=?", 
				checkDateStr, CheckRecord.CHK_TYPE_ALL, CheckRecord.CHK_STAT_IMP_SUCCESS);
		for(CheckRecord cr : crl){
			cr.setChkTime(DateUtils.getCurrentDate());
			new ScheduleEngine(cr, SYNC_TYPE_CHECK, this.checkService).start();
		}
		log.info("对账结束--------------------------------------");
	}
	
	/**
	 * 定时同步对账文件
	 * <p>Title: syncCheckFile</p>
	 * <p>Description: </p>
	 * @throws BaseException
	 */
	public void syncPayFile() throws BaseException {
		log.info("对账文件同步开始--------------------------------------");
		List<PayMerchant> pml = this.payMerchantManager.findAll();
		Date checkDate = DateUtils.addDays(new Date(), -1);
		String checkDateStr = DateUtils.date2String(checkDate, "yyyy-MM-dd");
		String pmPayCheckTimeStr;
		String pmPayCheckUrl;
		Configuration pmConfig = null;
		CheckRecord checkRecord = null;
		for(PayMerchant pm : pml){
			pmConfig = PayMerchantConfigCache.getConfig(pm);
			pmPayCheckTimeStr = pmConfig.getString("return_check_time");
			pmPayCheckUrl = pmConfig.getString("return_check_url");
			if(StringUtils.isNotEmpty(pmPayCheckTimeStr)
					&& checkDate.after(DateUtils.string2Date(checkDateStr + pmPayCheckTimeStr, "yyyy-MM-ddHH:mm:ss"))){
				
				checkRecord = this.checkRecordManager.findOne("from CheckRecord where chkDate = ? and chkType = ? and mchId = ?", 
						checkDateStr, CheckRecord.CHK_TYPE_RETURN, pm.getId());
				if(null != checkRecord  && checkRecord.getSyncNum() < SYNC_MAX_NUM
						&& (StringUtils.equals(checkRecord.getStatus(), CheckRecord.CHK_STAT_INITIAL) || StringUtils.equals(checkRecord.getStatus(), CheckRecord.CHK_STAT_FILE_FAILURE))){
					if(CheckRecord.CHK_OPTTYPE_HAND.equals(checkRecord.getOptType())){
						continue;
					}
					checkRecord.setSyncTime(DateUtils.getCurrentDate());
					checkRecord.setSyncNum(checkRecord.getSyncNum() + 1); 
					new ScheduleEngine(checkRecord, SYNC_TYPE_RET_DOWNLOAD, this.checkService).start();
				} else if(null != checkRecord && !StringUtils.equals(checkRecord.getStatus(), CheckRecord.CHK_STAT_INITIAL)){
				} else if(null == checkRecord){
					checkRecord = new CheckRecord();
					checkRecord.setPayMerchant(pm);
					checkRecord.setPcId(pm.getPayChannel().getId());
					checkRecord.setMchId(pm.getId());
					checkRecord.setStatus(CheckRecord.CHK_STAT_INITIAL);
					checkRecord.setChkType(CheckRecord.CHK_TYPE_RETURN);
					checkRecord.setChkDate(checkDateStr);
					checkRecord.setOptType(CheckRecord.CHK_OPTTYPE_AUTO);
					checkRecord.setSyncType(pmPayCheckUrl.substring(0, pmPayCheckUrl.indexOf(":")));
					checkRecord.setSyncTime(DateUtils.getCurrentDate());
					checkRecord.setSyncNum(1);
					
					new ScheduleEngine(checkRecord, SYNC_TYPE_RET_DOWNLOAD, this.checkService).start();
				} else {
					log.info("你已同步对账文件超过3次！不给操作了！");
				}
			} 
			
			try {//TODO 分开同步
				Thread.sleep(10000);
			} catch (InterruptedException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
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
	public void importPayFile() throws BaseException {
		log.info("对账文件导入开始--------------------------------------");
		Date checkDate = DateUtils.addDays(new Date(), -1);
		String checkDateStr = DateUtils.date2String(checkDate, "yyyy-MM-dd");
		List<CheckRecord> crl = this.checkRecordManager.find("from CheckRecord where optType = '0' and chkDate = ? and chkType = ? and status = ?", 
				checkDateStr, CheckRecord.CHK_TYPE_PAY, CheckRecord.CHK_STAT_FILE_SUCCESS);
		for(CheckRecord cr : crl){
			cr.setImpTime(DateUtils.getCurrentDate());
			new ScheduleEngine(cr, SYNC_TYPE_PAY_IMPORT, this.checkService).start();
		}

		log.info("对账文件同步结束--------------------------------------");
	}
	
	/**
	 * 定时对账
	 * <p>Title: checkOrder</p>
	 * <p>Description: </p>
	 * @throws BaseException
	 */
	public void checkPayOrder() {
		log.info("对账开始--------------------------------------");
		Date checkDate = DateUtils.addDays(new Date(), -1);
		String checkDateStr = DateUtils.date2String(checkDate, "yyyy-MM-dd");
		List<CheckRecord> crl = this.checkRecordManager.find("from CheckRecord where optType = '0' and chkDate = ? and chkType = ? and status=?", 
				checkDateStr, CheckRecord.CHK_TYPE_PAY, CheckRecord.CHK_STAT_IMP_SUCCESS);
		for(CheckRecord cr : crl){
			cr.setChkTime(DateUtils.getCurrentDate());
			new ScheduleEngine(cr, SYNC_TYPE_PAY_CHECK, this.checkService).start();
		}
		log.info("对账结束--------------------------------------");
	}
	
	/**
	 * 定时同步对账文件
	 * <p>Title: syncCheckFile</p>
	 * <p>Description: </p>
	 * @throws BaseException
	 */
	public void syncRefundFile() throws BaseException {
		log.info("对账文件同步开始--------------------------------------");
		List<PayMerchant> pml = this.payMerchantManager.findAll();
		Date checkDate = DateUtils.addDays(new Date(), -1);
		String checkDateStr = DateUtils.date2String(checkDate, "yyyy-MM-dd");
		String pmRefundCheckTimeStr;
		String pmRefundCheckUrl;
		Configuration pmConfig = null;
		CheckRecord checkRecord = null;
		for(PayMerchant pm : pml){
			pmConfig = PayMerchantConfigCache.getConfig(pm);
			pmRefundCheckTimeStr = pmConfig.getString("refund_check_time");
			pmRefundCheckUrl = pmConfig.getString("refund_check_url");
			if(StringUtils.isNotEmpty(pmRefundCheckTimeStr)
					&& checkDate.after(DateUtils.string2Date(checkDateStr + pmRefundCheckTimeStr, "yyyy-MM-ddHH:mm:ss"))){
				
				checkRecord = this.checkRecordManager.findOne("from CheckRecord where chkDate = ? and chkType = ? and mchId = ?", 
						checkDateStr, CheckRecord.CHK_TYPE_REFUND, pm.getId());
				if(null != checkRecord  && checkRecord.getSyncNum() < SYNC_MAX_NUM
						&& (StringUtils.equals(checkRecord.getStatus(), CheckRecord.CHK_STAT_INITIAL) || StringUtils.equals(checkRecord.getStatus(), CheckRecord.CHK_STAT_FILE_FAILURE))){
					if(CheckRecord.CHK_OPTTYPE_HAND.equals(checkRecord.getOptType())){
						continue;
					}
					checkRecord.setSyncTime(DateUtils.getCurrentDate());
					checkRecord.setSyncNum(checkRecord.getSyncNum() + 1); 
					new ScheduleEngine(checkRecord, SYNC_TYPE_REF_DOWNLOAD, this.checkService).start();
				} else if(null != checkRecord && !StringUtils.equals(checkRecord.getStatus(), CheckRecord.CHK_STAT_INITIAL)){
				} else if(null == checkRecord){
					checkRecord = new CheckRecord();
					checkRecord.setPayMerchant(pm);
					checkRecord.setPcId(pm.getPayChannel().getId());
					checkRecord.setMchId(pm.getId());
					checkRecord.setStatus(CheckRecord.CHK_STAT_INITIAL);
					checkRecord.setChkType(CheckRecord.CHK_TYPE_REFUND);
					checkRecord.setChkDate(checkDateStr);
					checkRecord.setOptType(CheckRecord.CHK_OPTTYPE_AUTO);
					checkRecord.setSyncType(pmRefundCheckUrl.substring(0, pmRefundCheckUrl.indexOf(":")));
					checkRecord.setSyncTime(DateUtils.getCurrentDate());
					checkRecord.setSyncNum(1);
					
					new ScheduleEngine(checkRecord, SYNC_TYPE_REF_DOWNLOAD, this.checkService).start();
				} else {
					log.info("你已同步对账文件超过3次！不给操作了！");
				}
			} 
			
			try {//TODO 分开同步
				Thread.sleep(10000);
			} catch (InterruptedException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
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
	public void importRefundFile() throws BaseException {
		log.info("对账文件导入开始--------------------------------------");
		Date checkDate = DateUtils.addDays(new Date(), -1);
		String checkDateStr = DateUtils.date2String(checkDate, "yyyy-MM-dd");
		List<CheckRecord> crl = this.checkRecordManager.find("from CheckRecord where optType = '0' and chkDate = ? and chkType = ? and status = ?", 
				checkDateStr, CheckRecord.CHK_TYPE_REFUND, CheckRecord.CHK_STAT_FILE_SUCCESS);
		for(CheckRecord cr : crl){
			cr.setImpTime(DateUtils.getCurrentDate());
			new ScheduleEngine(cr, SYNC_TYPE_REF_IMPORT, this.checkService).start();
		}

		log.info("对账文件同步结束--------------------------------------");
	}
	
	/**
	 * 定时对账
	 * <p>Title: checkOrder</p>
	 * <p>Description: </p>
	 * @throws BaseException
	 */
	public void checkRefundOrder() {
		log.info("对账开始--------------------------------------");
		Date checkDate = DateUtils.addDays(new Date(), -1);
		String checkDateStr = DateUtils.date2String(checkDate, "yyyy-MM-dd");
		List<CheckRecord> crl = this.checkRecordManager.find("from CheckRecord where optType = '0' and chkDate = ? and chkType = ? and status=?", 
				checkDateStr, CheckRecord.CHK_TYPE_REFUND, CheckRecord.CHK_STAT_IMP_SUCCESS);
		for(CheckRecord cr : crl){
			cr.setChkTime(DateUtils.getCurrentDate());
			new ScheduleEngine(cr, SYNC_TYPE_REF_CHECK, this.checkService).start();
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
		log.info("对账文件同步开始--------------------------------------");
		List<PayMerchant> pml = this.payMerchantManager.findAll();
		Date checkDate = DateUtils.addDays(new Date(), -1);
		String checkDateStr = DateUtils.date2String(checkDate, "yyyy-MM-dd");
		String pmReturnCheckTimeStr;
		String pmReturnCheckUrl;
		Configuration pmConfig = null;
		CheckRecord checkRecord = null;
		for(PayMerchant pm : pml){
			pmConfig = PayMerchantConfigCache.getConfig(pm);
			pmReturnCheckTimeStr = pmConfig.getString("pay_check_time");
			pmReturnCheckUrl = pmConfig.getString("pay_check_url");
			if(StringUtils.isNotEmpty(pmReturnCheckTimeStr)
					&& checkDate.after(DateUtils.string2Date(checkDateStr + pmReturnCheckTimeStr, "yyyy-MM-ddHH:mm:ss"))){
				
				checkRecord = this.checkRecordManager.findOne("from CheckRecord where chkDate = ? and chkType = ? and mchId = ?", 
						checkDateStr, CheckRecord.CHK_TYPE_PAY, pm.getId());
				if(null != checkRecord  && checkRecord.getSyncNum() < SYNC_MAX_NUM
						&& (StringUtils.equals(checkRecord.getStatus(), CheckRecord.CHK_STAT_INITIAL) || StringUtils.equals(checkRecord.getStatus(), CheckRecord.CHK_STAT_FILE_FAILURE))){
					if(CheckRecord.CHK_OPTTYPE_HAND.equals(checkRecord.getOptType())){
						continue;
					}
					checkRecord.setSyncTime(DateUtils.getCurrentDate());
					checkRecord.setSyncNum(checkRecord.getSyncNum() + 1); 
					new ScheduleEngine(checkRecord, SYNC_TYPE_PAY_DOWNLOAD, this.checkService).start();
				} else if(null != checkRecord && !StringUtils.equals(checkRecord.getStatus(), CheckRecord.CHK_STAT_INITIAL)){
				} else if(null == checkRecord){
					checkRecord = new CheckRecord();
					checkRecord.setPayMerchant(pm);
					checkRecord.setPcId(pm.getPayChannel().getId());
					checkRecord.setMchId(pm.getId());
					checkRecord.setStatus(CheckRecord.CHK_STAT_INITIAL);
					checkRecord.setChkType(CheckRecord.CHK_TYPE_PAY);
					checkRecord.setChkDate(checkDateStr);
					checkRecord.setOptType(CheckRecord.CHK_OPTTYPE_AUTO);
					checkRecord.setSyncType(pmReturnCheckUrl.substring(0, pmReturnCheckUrl.indexOf(":")));
					checkRecord.setSyncTime(DateUtils.getCurrentDate());
					checkRecord.setSyncNum(1);
					
					new ScheduleEngine(checkRecord, SYNC_TYPE_PAY_DOWNLOAD, this.checkService).start();
				} else {
					log.info("你已同步对账文件超过3次！不给操作了！");
				}
			} 
			
			try {
				Thread.sleep(10000);
			} catch (InterruptedException e) {
				e.printStackTrace();
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
		log.info("退汇文件导入开始--------------------------------------");
		Date checkDate = DateUtils.addDays(new Date(), -1);
		String checkDateStr = DateUtils.date2String(checkDate, "yyyy-MM-dd");
		List<CheckRecord> crl = this.checkRecordManager.find("from CheckRecord where optType = '0' and chkDate = ? and chkType = ? and status=?", 
				checkDateStr, CheckRecord.CHK_TYPE_RETURN, CheckRecord.CHK_STAT_FILE_SUCCESS);
		for(CheckRecord cr : crl){
			cr.setImpTime(DateUtils.getCurrentDate());
			new ScheduleEngine(cr, SYNC_TYPE_RET_IMPORT, this.checkService).start();
		}

		log.info("退汇文件导入结束--------------------------------------");
	}
	
	/**
	 * 定时退汇对账
	 * <p>Title: checkOrder</p>
	 * <p>Description: </p>
	 * @throws BaseException
	 */
	public void checkReturnOrder() throws BaseException {
		log.info("退汇对账开始--------------------------------------");
		Date checkDate = DateUtils.addDays(new Date(), -1);
		String checkDateStr = DateUtils.date2String(checkDate, "yyyy-MM-dd");
		List<CheckRecord> crl = this.checkRecordManager.find("from CheckRecord where optType = '0' and chkDate = ? and chkType = ? and status=?", 
				checkDateStr, CheckRecord.CHK_TYPE_RETURN, CheckRecord.CHK_STAT_IMP_SUCCESS);
		for(CheckRecord cr : crl){
			cr.setChkTime(DateUtils.getCurrentDate());
			new ScheduleEngine(cr, SYNC_TYPE_RET_CHECK, this.checkService).start();
			
			try {
				Thread.sleep(10000);
			} catch (InterruptedException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}
		log.info("退汇对账结束--------------------------------------");
	}
	
	/**
	 * 退款结算单状态同步
	 * <p>Title: syncPayStat</p>
	 * <p>Description: </p>
	 */
	public void syncRefundStat(){
		log.info("退款结算单状态同步开始--------------------------------------");
		String hql = "from Settlement where 1=1 and settleType=? and syncNum<? and status=?";
		List<Settlement> slist = this.settlementManager.find(hql, 
				Settlement.SETTLE_TYPE_REFUND, SYNC_REFUND_MAX_NUM, Settlement.SETTLE_STAT_REFUNDING);
		for(Settlement settlement : slist){
			if(settlement.getSyncNum() > 3){
				continue;
			}
			if ((System.currentTimeMillis() - settlement.getCreatedAt().getTime()) < 
					SYNC_REFUND_WAITTIME[settlement.getSyncNum() + 6] * 60 * 1000){
				continue;
			}
			settlement.setSyncNum(settlement.getSyncNum() + 1);
			new ScheduleEngine(settlement, SYNC_TYPE_REFUND, this.tradeService).start();
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
		private TradeService tradeService;
		private CheckService checkService;
		private CheckRecord checkRecord;
		private Settlement settlement;
		private String mode;									//方式 PAY-支付、REFUND-退款、CANCEL-撤销、CHECK-对账

		public ScheduleEngine(CheckRecord checkRecord, String mode, CheckService checkService){
			this.checkRecord = checkRecord;
			this.mode = mode;
			this.checkService = checkService;
		}
		public ScheduleEngine(Settlement settlement, String mode,TradeService tradeService){
			this.settlement = settlement;
			this.mode = mode;
			this.tradeService = tradeService;
		}

		public void run() {
			switch (mode) {
			case SYNC_TYPE_REFUND:
				this.tradeService.refundQuery(settlement);
				break;
			case SYNC_TYPE_DOWNLOAD:
				this.checkService.syncCheckFile(checkRecord);
				break;
			case SYNC_TYPE_IMPORT:
				this.checkService.importCheckFile(checkRecord);
				break;
			case SYNC_TYPE_CHECK:
				this.checkService.checkOrder(checkRecord);
				break;
			case SYNC_TYPE_PAY_DOWNLOAD:
				this.checkService.syncPayFile(checkRecord);
				break;
			case SYNC_TYPE_PAY_IMPORT:
				this.checkService.importPayFile(checkRecord);
				break;
			case SYNC_TYPE_PAY_CHECK:
				this.checkService.checkPayOrder(checkRecord);
				break;
			case SYNC_TYPE_REF_DOWNLOAD:
				this.checkService.syncRefundFile(checkRecord);
				break;
			case SYNC_TYPE_REF_IMPORT:
				this.checkService.importRefundFile(checkRecord);
				break;
			case SYNC_TYPE_REF_CHECK:
				this.checkService.checkRefundOrder(checkRecord);
				break;
			case SYNC_TYPE_RET_DOWNLOAD:
				this.checkService.syncReturnFile(checkRecord);
				break;
			case SYNC_TYPE_RET_IMPORT:
				this.checkService.importReturnFile(checkRecord);
				break;
			case SYNC_TYPE_RET_CHECK:
				this.checkService.checkReturnOrder(checkRecord);
				break;
			default:
			}
			
		}

	}
}
