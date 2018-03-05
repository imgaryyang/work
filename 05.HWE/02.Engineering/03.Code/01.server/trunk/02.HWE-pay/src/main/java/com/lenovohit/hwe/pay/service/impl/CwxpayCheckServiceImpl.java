package com.lenovohit.hwe.pay.service.impl;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import org.apache.commons.configuration.Configuration;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.lenovohit.core.exception.BaseException;
import com.lenovohit.core.manager.GenericManager;
import com.lenovohit.core.utils.DateUtils;
import com.lenovohit.core.utils.StringUtils;
import com.lenovohit.hwe.pay.model.CheckDetailResult;
import com.lenovohit.hwe.pay.model.CheckDetailWxpay;
import com.lenovohit.hwe.pay.model.CheckRecord;
import com.lenovohit.hwe.pay.model.Settlement;
import com.lenovohit.hwe.pay.service.CheckBaseService;
import com.lenovohit.hwe.pay.support.wxpay.scan.WXPay;
import com.lenovohit.hwe.pay.support.wxpay.scan.listener.DefaultDownloadBillBusinessResultListener;
import com.lenovohit.hwe.pay.support.wxpay.scan.listener.DefaultRefundQueryBusinessResultListener;
import com.lenovohit.hwe.pay.support.wxpay.scan.protocol.downloadbill_protocol.DownloadBillReqData;
import com.lenovohit.hwe.pay.utils.PayMerchantConfigCache;

@Service("cwxpayCheckService")
public class CwxpayCheckServiceImpl implements CheckBaseService {
    private static Log                  log = LogFactory.getLog(CwxpayCheckServiceImpl.class);

	@Autowired
	private GenericManager<CheckRecord, String> checkRecordManager;
	@Autowired
	private GenericManager<CheckDetailWxpay, String> checkDetailWxpayManager;
	@Autowired
	private GenericManager<CheckDetailResult, String> checkDetailResultManager;
	@Autowired
	private GenericManager<Settlement, String> settlementManager;
	
	
	@Override
	public void syncCheckFile(CheckRecord checkRecord) {
		Configuration config = PayMerchantConfigCache.getConfig(checkRecord.getPayMerchant());
		DownloadBillReqData downloadBillReqData = new DownloadBillReqData(
				"", 
				checkRecord.getChkDate().replaceAll("-", ""),
				"ALL",
				config);
		DefaultDownloadBillBusinessResultListener resultListener = new DefaultDownloadBillBusinessResultListener();
    	try {
			WXPay.doDownloadBillBusiness(downloadBillReqData, resultListener);
			switch (resultListener.getResult()) {
            case DefaultDownloadBillBusinessResultListener.ON_DOWNLOAD_BILL_SUCCESS:
				if( downloadFile(checkRecord, resultListener) ){
					checkRecord.setStatus(CheckRecord.CHK_STAT_FILE_SUCCESS);
					checkRecord.setChkFile(checkRecord.getChkDate().replaceAll("-", "") + ".txt");
				} else {
					checkRecord.setStatus(CheckRecord.CHK_STAT_FILE_FAILURE);
				}
				checkRecord.setSyncTime(DateUtils.getCurrentDate());
				log.info("微信【"+ checkRecord.getChkDate() +"】日获取对账文件地址成功!!!)");
				break;
            case DefaultDownloadBillBusinessResultListener.ON_FAIL_BY_RETURN_CODE_ERROR:
            case DefaultDownloadBillBusinessResultListener.ON_FAIL_BY_RETURN_CODE_FAIL:
            case DefaultDownloadBillBusinessResultListener.ON_DOWNLOAD_BILL_FAIL:
            case DefaultRefundQueryBusinessResultListener.ON_FAIL_BY_SIGN_INVALID:
            	checkRecord.setStatus(CheckRecord.CHK_STAT_FILE_FAILURE);
				checkRecord.setSyncTime(DateUtils.getCurrentDate());
				log.info("微信【"+ checkRecord.getChkDate() +"】日获取对账文件地址失败!!!");
				break;
			}
    	} catch (Exception e) {
    		checkRecord.setStatus(CheckRecord.CHK_STAT_FILE_FAILURE);
			checkRecord.setSyncTime(DateUtils.getCurrentDate());
			log.error("微信【"+ checkRecord.getChkDate() +"】日获取对账文件地址系统异常!!!");
			e.printStackTrace();
		}
	}
	
	@Override
	public void importCheckFile(CheckRecord checkRecord) {
		BufferedReader br = null;
		try {
			//0. 清除之前导入记录
			String deleleSql = "DELETE FROM PAY_CHECK_DETAIL_WXPAY WHERE RECORD_ID = ?";
			this.checkDetailWxpayManager.executeSql(deleleSql, checkRecord.getId());
			
			//1. 导入记录
			File checkFile = new File(checkRecord.getFilePath() + checkRecord.getChkFile());
			if(!checkFile.exists()) {
				throw new BaseException("对账文件【"+ checkRecord.getChkFile() + "】不存在！");
			}
			br = new BufferedReader(new FileReader(checkFile));
			List<CheckDetailWxpay> cdwl = new ArrayList<CheckDetailWxpay>();
			CheckDetailWxpay cdw = null;
			String tempString = null;  
			int line = 0;  
			int record = 0;
            while ((tempString = br.readLine()) != null) {  
            	if(StringUtils.isBlank(tempString) || tempString.startsWith("#"))
            		continue;
            	line++;
            	if(line == 1){
            		continue;
            	}
            	cdw = convertRecordToObject(tempString);
            	if(cdw == null) {
            		continue;
            	} else {
            		record++;
            	}
            	cdw.setRecordId(checkRecord.getId());
            	cdwl.add(cdw);
                if(cdwl.size() == 100){
                	this.checkDetailWxpayManager.batchSave(cdwl, 100);
                	cdwl = new ArrayList<CheckDetailWxpay>();
                }
            }
            this.checkDetailWxpayManager.batchSave(cdwl);
            log.info("微信【"+ checkRecord.getChkDate() +"】日 对账文件导入记录【" + record + "】条。");

			checkRecord.setStatus(CheckRecord.CHK_STAT_IMP_SUCCESS);
		} catch (Exception e) {
			checkRecord.setStatus(CheckRecord.CHK_STAT_IMP_FAILURE);
			log.error("微信【"+ checkRecord.getChkDate() +"】日 对账文件导入失败:" + e.getMessage());
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
			String deleleSql = "DELETE FROM PAY_CHECK_DETAIL_RESULT WHERE RECORD_ID = ?";
			this.checkDetailResultManager.executeSql(deleleSql, checkRecord.getId());
			
			//1. 对账记录
			List<CheckDetailWxpay> cdwl = checkDetailWxpayManager.find("from CheckDetailWxpay where recordId = ?", checkRecord.getId());
			List<CheckDetailResult> cdrl = new ArrayList<CheckDetailResult>();
			Settlement settlement = null;
			CheckDetailResult result = null;
			for(CheckDetailWxpay cdw : cdwl){
				
				result = new CheckDetailResult();
				result.setRecordId(cdw.getRecordId());
				result.setMerchanet(cdw.getMchId());
				result.setTerminal(cdw.getDeviceInfo());
				result.setBatchNo("");
				result.setAmt(StringUtils.equals("SUCCESS", cdw.getTradeStatus())?cdw.getTotalFee().abs() : cdw.getRefundFee().abs());
				result.setClearAmt(result.getAmt());
				result.setAccount(cdw.getOpenId());
				result.setCardType("");
				result.setCardBankCode("");
				result.setTradeNo(StringUtils.equals("SUCCESS", cdw.getTradeStatus()) ? cdw.getTradeNo() : cdw.getRefTradeNo());
				result.setTradeType(StringUtils.equals("SUCCESS", cdw.getTradeStatus()) ? Settlement.SETTLE_TYPE_PAY : Settlement.SETTLE_TYPE_REFUND);
				result.setTradeDate(DateUtils.date2String(DateUtils.string2Date(cdw.getTradeTime(), "yyyy-MM-dd HH:mm:ss"), "yyyy-MM-dd"));
				result.setTradeTime(DateUtils.date2String(DateUtils.string2Date(cdw.getTradeTime(), "yyyy-MM-dd HH:mm:ss"), "HH:mm:ss"));
				result.setClearDate(checkRecord.getChkDate());
				
				//1.自助机结算单数据
				if(result.getTradeType().equals(Settlement.SETTLE_TYPE_PAY)){
					settlement = settlementManager.findOne("from Settlement where settleNo = ? and settleType = 'SP'", cdw.getOutTradeNo());
				} else if(result.getTradeType().equals(Settlement.SETTLE_TYPE_REFUND)){
					settlement = settlementManager.findOne("from Settlement where settleNo = ? and settleType = 'SR'", cdw.getRefOutTradeNo());
				}
				if(null == settlement){
					result.setHwpCheckStatus(CheckDetailResult.HWP_CHECK_STATUS_HWP_NOTRADE);
					result.setHwpCheckTime(DateUtils.getCurrentDate());
					result.setHwpCheckType(checkRecord.getOptType());
				} else {
					result.setHwpNo(settlement.getSettleNo());
					result.setHwpTime(settlement.getCreatedAt());
					result.setHwpAmt(settlement.getAmt());
					result.setHwpCode(settlement.getTerminalCode());
					result.setHwpCheckTime(DateUtils.getCurrentDate());
					result.setHwpCheckType(checkRecord.getOptType());
					result.setHwpCheckStatus(CheckDetailResult.HWP_CHECK_STATUS_SUCCESS);
					
					if(result.getTradeType().equals(Settlement.SETTLE_TYPE_PAY)){
						if(!Settlement.SETTLE_STAT_PAY_SUCCESS.equals(settlement.getStatus()) 
								&& !Settlement.SETTLE_STAT_PAY_FINISH.equals(settlement.getStatus())){
							result.setHwpCheckStatus(CheckDetailResult.HWP_CHECK_STATUS_FAILURE);
						}
					} else if(result.getTradeType().equals(Settlement.SETTLE_TYPE_REFUND)){
						if(!Settlement.SETTLE_STAT_REFUND_SUCCESS.equals(settlement.getStatus())){
							result.setHwpCheckStatus(CheckDetailResult.HWP_CHECK_STATUS_FAILURE);
						}
					}
					if(result.getHwpAmt().compareTo(result.getAmt()) == 1){
						result.setHwpCheckStatus(CheckDetailResult.HWP_CHECK_STATUS_MNY_MORE);
					}
					if(result.getHwpAmt().compareTo(result.getAmt()) == -1){
						result.setHwpCheckStatus(CheckDetailResult.HWP_CHECK_STATUS_MNY_LESS);
					}
				}
				
				cdrl.add(result);
				if(cdrl.size() == 100){
					this.checkDetailResultManager.batchSave(cdrl);
					cdrl = new ArrayList<CheckDetailResult>();
				}
				total++;
				if(result.getTradeType().equals(Settlement.SETTLE_TYPE_PAY)){
					totalAmt = totalAmt.add(result.getAmt());
				} else if(result.getTradeType().equals(Settlement.SETTLE_TYPE_REFUND)){
					totalAmt = totalAmt.subtract(result.getAmt());
				}
				if(StringUtils.equals(result.getHwpCheckStatus(), CheckDetailResult.HWP_CHECK_STATUS_SUCCESS)){
					successTotal++;
					if(result.getTradeType().equals(Settlement.SETTLE_TYPE_PAY)){
						successAmt = successAmt.add(result.getAmt());
					} else if(result.getTradeType().equals(Settlement.SETTLE_TYPE_REFUND)){
						successAmt = successAmt.subtract(result.getAmt());
					}
				}
				log.info("【"+ checkRecord.getPayMerchant().getMchName() + "】【"+ checkRecord.getChkDate() +"】日 对账记录流水号【"+ result.getTradeNo() + "】,金额【"+result.getAmt().toString() + "】,对账状态【"+result.getHwpCheckStatus() + "】。");
			}
			log.info("【"+ checkRecord.getPayMerchant().getMchName() + "】【"+ checkRecord.getChkDate() +"】日 对账【"+ total +"】笔,【"+ totalAmt +"】元, 成功：【"+ successTotal +"】笔,【"+ successAmt.toString() +"】元！");
			this.checkDetailResultManager.batchSave(cdrl);
			
			checkRecord.setStatus(CheckRecord.CHK_STAT_FINISH);
			checkRecord.setTotal(total);
			checkRecord.setAmt(totalAmt);
			checkRecord.setSuccessTotal(successTotal);
			checkRecord.setSuccessAmt(successAmt);
		} catch (Exception e) {
			checkRecord.setStatus(CheckRecord.CHK_STAT_FAILURE);
			log.error("微信【"+ checkRecord.getChkDate() +"】日 对账失败：" + e.getMessage());
			e.printStackTrace();
		}
		
		this.checkRecordManager.save(checkRecord);
	}
	
	/* (非 Javadoc) 
	 * <p>Title: syncPayFile</p> 
	 * <p>Description: </p> 
	 * @param checkRecord 
	 * @see com.lenovohit.hwe.pay.service.CheckBaseService#syncPayFile(com.lenovohit.hwe.pay.model.CheckRecord) 
	 */
	@Override
	public void syncPayFile(CheckRecord checkRecord) {
		// TODO Auto-generated method stub
		
	}

	/* (非 Javadoc) 
	 * <p>Title: importPayFile</p> 
	 * <p>Description: </p> 
	 * @param checkRecord 
	 * @see com.lenovohit.hwe.pay.service.CheckBaseService#importPayFile(com.lenovohit.hwe.pay.model.CheckRecord) 
	 */
	@Override
	public void importPayFile(CheckRecord checkRecord) {
		// TODO Auto-generated method stub
		
	}

	/* (非 Javadoc) 
	 * <p>Title: checkPayOrder</p> 
	 * <p>Description: </p> 
	 * @param checkRecord 
	 * @see com.lenovohit.hwe.pay.service.CheckBaseService#checkPayOrder(com.lenovohit.hwe.pay.model.CheckRecord) 
	 */
	@Override
	public void checkPayOrder(CheckRecord checkRecord) {
		// TODO Auto-generated method stub
		
	}

	/* (非 Javadoc) 
	 * <p>Title: syncRefundFile</p> 
	 * <p>Description: </p> 
	 * @param checkRecord 
	 * @see com.lenovohit.hwe.pay.service.CheckBaseService#syncRefundFile(com.lenovohit.hwe.pay.model.CheckRecord) 
	 */
	@Override
	public void syncRefundFile(CheckRecord checkRecord) {
		// TODO Auto-generated method stub
		
	}

	/* (非 Javadoc) 
	 * <p>Title: importRefundFile</p> 
	 * <p>Description: </p> 
	 * @param checkRecord 
	 * @see com.lenovohit.hwe.pay.service.CheckBaseService#importRefundFile(com.lenovohit.hwe.pay.model.CheckRecord) 
	 */
	@Override
	public void importRefundFile(CheckRecord checkRecord) {
		// TODO Auto-generated method stub
		
	}

	/* (非 Javadoc) 
	 * <p>Title: checkRefundOrder</p> 
	 * <p>Description: </p> 
	 * @param checkRecord 
	 * @see com.lenovohit.hwe.pay.service.CheckBaseService#checkRefundOrder(com.lenovohit.hwe.pay.model.CheckRecord) 
	 */
	@Override
	public void checkRefundOrder(CheckRecord checkRecord) {
		// TODO Auto-generated method stub
		
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

	protected boolean downloadFile(CheckRecord checkRecord, DefaultDownloadBillBusinessResultListener resultListener) {
		boolean flag = true;
		BufferedWriter bw = null;
		try {
			String checkFile = checkRecord.getChkDate().replaceAll("-", "") + ".txt";
			File file = new File(checkRecord.getFilePath() + checkFile);

			// if file doesnt exists, then create it
			if (!file.getParentFile().exists()) {
				file.getParentFile().mkdirs();
			}
			if (!file.exists()) {
				file.createNewFile();
			}
			bw = new BufferedWriter(new FileWriter(file.getAbsoluteFile()));
			bw.write(resultListener.getResponse());
			bw.close();
		} catch (Exception e) {
			flag = false;
			log.error("微信【"+ checkRecord.getChkDate() +"】日 同步对账文件失败：" + e.getMessage());
			e.printStackTrace();
		} finally {
			if(bw != null) {
				try {
					bw.close();
				} catch (IOException e) {
					e.printStackTrace();
				}
			}
		}
		
		return flag;
	}
	
	private CheckDetailWxpay convertRecordToObject(String record){
//		交易时间,公众账号ID,商户号,子商户号,设备号,微信订单号,商户订单号,用户标识,交易类型,交易状态,付款银行,货币种类,总金额,企业红包金额,微信退款单号,商户退款单号,退款金额,企业红包退款金额,退款类型,退款状态,商品名称,商户数据包,手续费,费率
//		`2017-07-14 16:40:49,`wx9b804d3e447446dc,`1293495701,`0,`8a942a765c3d44d3015c3e3fa9b700ae,`4000012001201707140741926218,`SP17071400313506,`oW5L1wdbujO1L9fp49yLySntDfzI,`NATIVE,`SUCCESS,`CFT,`CNY,`150.00,`0.00,`0,`0,`0.00,`0.00,`,`,`患者 何记永 自助机充值 150 元。,`ZZJ,`0.00000,`0.00%

		CheckDetailWxpay cda = new CheckDetailWxpay();
		if(StringUtils.isBlank(record))
			return null;
		String[] params = record.split(",`");
		if(params.length != 24){
			return null;
		}
		cda.setTradeTime(params[0].replace("`", ""));
		cda.setAppId(params[1].replace("`", ""));
		cda.setMchId(params[2].replace("`", ""));
		cda.setChildMchId(params[3].replace("`", ""));
		cda.setDeviceInfo(params[4].replace("`", ""));
		cda.setTradeNo(params[5].replace("`", ""));
		cda.setOutTradeNo(params[6].replace("`", ""));
		cda.setOpenId(params[7].replace("`", ""));
		cda.setTradeType(params[8].replace("`", ""));
		cda.setTradeStatus(params[9].replace("`", ""));
		cda.setBankType(params[10].replace("`", ""));
		cda.setFeeType(params[11].replace("`", ""));
		cda.setTotalFee(new BigDecimal(params[12].replace("`", "")));
		cda.setMpCouponFee(new BigDecimal(params[13].replace("`", "")));
		cda.setRefTradeNo(params[14].replace("`", ""));
		cda.setRefOutTradeNo(params[15].replace("`", ""));
		cda.setRefundFee(new BigDecimal(params[16].replace("`", "")));
		cda.setMrCouponFee(new BigDecimal(params[17].replace("`", "")));
		cda.setRefType(params[18].replace("`", ""));
		cda.setRefStatus(params[19].replace("`", ""));
		cda.setBody(params[20].replace("`", ""));
		cda.setAttach(params[21].replace("`", ""));
		cda.setFee(new BigDecimal(params[22].replace("`", "")));
		cda.setFeeRate(params[23].replace("`", ""));
		
		return cda;
	}
}
