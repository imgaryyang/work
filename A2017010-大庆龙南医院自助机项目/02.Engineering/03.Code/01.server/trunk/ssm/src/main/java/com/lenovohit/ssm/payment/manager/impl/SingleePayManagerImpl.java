package com.lenovohit.ssm.payment.manager.impl;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.InputStreamReader;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;

import com.lenovohit.core.exception.BaseException;
import com.lenovohit.core.manager.GenericManager;
import com.lenovohit.core.utils.DateUtils;
import com.lenovohit.core.utils.StringUtils;
import com.lenovohit.ssm.base.utils.FtpUtils;
import com.lenovohit.ssm.payment.hisModel.CheckDetailHis;
import com.lenovohit.ssm.payment.manager.HisManager;
import com.lenovohit.ssm.payment.manager.SingleePayManager;
import com.lenovohit.ssm.payment.model.CardBin;
import com.lenovohit.ssm.payment.model.CheckDetailBank;
import com.lenovohit.ssm.payment.model.CheckDetailResult;
import com.lenovohit.ssm.payment.model.CheckRecord;
import com.lenovohit.ssm.payment.model.Settlement;
import com.lenovohit.ssm.payment.support.singleePay.model.SingleePayResponse;

public class SingleePayManagerImpl extends SingleePayManager {
    private static Log                  log = LogFactory.getLog(SingleePayManagerImpl.class);

    @Autowired
    private GenericManager<CheckRecord, String> checkRecordManager;
    @Autowired
    private GenericManager<CheckDetailBank, String> checkDetailBankManager;
    @Autowired
    private HisManager<CheckDetailHis, String> checkDetailHisManager;
    @Autowired
    private GenericManager<CheckDetailResult, String> checkDetailResultManager;
    @Autowired
    private GenericManager<CardBin,String> cardBinManager;
    @Autowired
    private GenericManager<Settlement,String> settlementManager;
    
    @Override
	public void precreate(Settlement settlement) {
		// TODO Auto-generated method stub
    }
    
    @Override
	public void payCallBack(Settlement settlement) {
    	try {
    		if(null == settlement || StringUtils.isEmpty((String)settlement.getVariables().get("responseStr")))
    			throw new BaseException("返回报文为null！");
    		settlement.setRespText((String)settlement.getVariables().get("responseStr"));
    		SingleePayResponse unionPay = new SingleePayResponse(settlement.getRespText());
    		if("000000".equals(unionPay.getRespCode())){//支付成功
    			//基础信息
        		settlement.setPayerAccount(unionPay.getCardNo());//	付款人账户 	交易卡号
        		//settlement.setPayerAcctType(cardTypeConvert(unionPay.getCardTypeName()));//	付款人账户 	卡类型
        		settlement.setPayerAcctBank(bankCodeConvert(unionPay.getCardNo()));
        		settlement.setTerminalCode(unionPay.getTid());//终端编号
        		//交易信息
        		settlement.setTradeNo(unionPay.getRef());//交易流水 ---支付渠道流水
    			settlement.setTradeTime(DateUtils.string2Date(unionPay.getTransDate() + unionPay.getTransTime(), "yyyyMMddHHmmss"));// 交易时间 
        		settlement.setTradeRspCode(unionPay.getRespCode());//交易返回码
        		settlement.setTradeRspMsg(unionPay.getRespInfo());//交易返回说明
    			settlement.setTradeStatus(Settlement.SETTLE_TRADE_SUCCESS);
    			settlement.setStatus(Settlement.SETTLE_STAT_PAY_SUCCESS);
    			BigDecimal unAmt = new BigDecimal(unionPay.getAmount());
    			BigDecimal amt =  unAmt.divide(new BigDecimal(100));//银联支付以分为单位
    			settlement.setRealAmt(amt);//实际支付完成的金额
    		} else {
    			settlement.setTerminalCode(unionPay.getTid());//终端编号
    			//交易信息
        		settlement.setTradeNo(unionPay.getRef());//交易流水 ---支付渠道流水
    			settlement.setTradeTime(DateUtils.getCurrentDate());// 交易时间 
        		settlement.setTradeRspCode(unionPay.getRespCode());//交易返回码
        		settlement.setTradeRspMsg(unionPay.getRespInfo());//交易返回说明
    			settlement.setTradeStatus(Settlement.SETTLE_TRADE_FAILURE);
    			settlement.setStatus(Settlement.SETTLE_STAT_PAY_FAILURE);
    		}
		} catch (Exception e) {
			e.printStackTrace();
			settlement.setStatus(Settlement.SETTLE_STAT_EXCEPTIONAL);
			log.error("银联支付报文处理:" + e.getMessage());
		}
    }
    /**    
	 * 银联-HIS卡类型转换
	 * @param upCardType
	 * @return
	 */
	private String cardTypeConvert(String upCardTypeName) {

		String hisCardType = "";
		if (StringUtils.equals("借记卡", upCardTypeName) || StringUtils.equals("储蓄卡", upCardTypeName)) {
			hisCardType = "1";
		} else if (StringUtils.equals("贷记卡", upCardTypeName) || StringUtils.equals("信用卡", upCardTypeName)
				|| (upCardTypeName.indexOf("贷记") != -1)) {
			hisCardType = "0";
		} else {
			throw new BaseException("不支持的银行卡卡类型【" + upCardTypeName + "】");
		}
		log.info("银联his卡类型转化 ：cardTypeConvert " + upCardTypeName + " " + hisCardType);
		return hisCardType;
	}
	
	/**
	 * 
	 * @param upCardType
	 * @return
	 */
	private String bankCodeConvert(String cardNo){
		List<?> cardBins = cardBinManager.findBySql("SELECT CARD_BIN, BANK_CODE FROM SSM_CARD_BIN WHERE CARD_BIN = SUBSTR(?,1, CARD_BIN_NUM) AND CARD_NUM = ?", cardNo, cardNo.length());
		if(cardBins == null || cardBins.isEmpty()){
			//TODO 即使沒對應卡Bin，不影响充值。
			//throw new BaseException("卡号"+cardNo+"无对应cardbin");
			return "00000000";
		}
		Object[] first = (Object[])cardBins.get(0);
		String cardBin = first[0].toString();
		String bankCode = first[1].toString();
		for(Object _cardBin : cardBins){//取最长的
			Object[] bin_code =( Object[])_cardBin;
			String bin = bin_code[0].toString();
			String code = bin_code[1].toString();
			if(cardBin.length() < bin.length() ){
				cardBin = bin;
				bankCode = code;
			}
		}
		log.info(" 查询卡号"+cardNo+", 卡bin  "+cardBin+ " 行号 "+bankCode);
		return bankCode;
	}
	@Override
	public void refund(Settlement settlement) {
		// TODO Auto-generated method stub
	}

	@Override
	public void query(Settlement settlement) {
		// TODO Auto-generated method stub
	}

	@Override
	public void refundQuery(Settlement settlement) {
		// TODO Auto-generated method stub
	}

	@Override
	public void syncCheckFile(CheckRecord checkRecord) {
		checkRecord.setStatus(CheckRecord.CHK_STAT_FILE_FAILURE);
		if("ftp".equals(checkRecord.getSyncType())){
			if(downloadFile(checkRecord)) {
				checkRecord.setStatus(CheckRecord.CHK_STAT_FILE_SUCCESS);
				checkRecord.setChkFile(checkRecord.getChkDate().replaceAll("-", "") + ".txt");
				log.info("银联【"+ checkRecord.getPayChannel().getName() + "】【"+ checkRecord.getChkDate() +"】日获取对账文件地址成功!!!)");
			} else {
				log.error("银联【"+ checkRecord.getPayChannel().getName() + "】【"+ checkRecord.getChkDate() +"】日获取对账文件地址失败!!!)");
			}
		}
		this.checkRecordManager.save(checkRecord);
	}

	@Override
	public void importCheckFile(CheckRecord checkRecord) {
		BufferedReader br = null;
		try {
			//0. 清除之前导入记录
			String deleleSql = "DELETE FROM SSM_CHECK_DETAIL_BANK WHERE CHECK_RECORD = ?";
			this.checkDetailBankManager.executeSql(deleleSql, checkRecord.getId());
			
			//1. 导入记录
			File checkFile = new File(checkRecord.getFilePath() + checkRecord.getChkFile());
			if(!checkFile.exists()) {
				throw new BaseException("对账文件【"+ checkRecord.getChkFile() + "】不存在！");
			}
			br = new BufferedReader(new InputStreamReader(new FileInputStream(checkFile), "GBK"));
			String tempString = null;  
            // 一次读入一行，直到读入null为文件结束  
			List<CheckDetailBank> cdbl = new ArrayList<CheckDetailBank>();
			CheckDetailBank cdb = null;
			int line = 0;  
			int record = 0;
            while ((tempString = br.readLine()) != null) {  
            	line++;
            	cdb = convertRecordToObject(line, tempString);
            	if(cdb == null || !StringUtils.equals(cdb.getMerchanet(), checkRecord.getPayChannel().getMchId())) {
            		continue;
            	} else {
            		record++;
            	}
            	cdbl.add(cdb);
            	cdb.setCheckRecord(checkRecord.getId());
                if(cdbl.size() == 100){
                	this.checkDetailBankManager.batchSave(cdbl, 100);
                	cdbl = new ArrayList<CheckDetailBank>();
                }
            }
            log.info("银联【"+ checkRecord.getChkDate() +"】日 对账文件导入记录【" + record + "】条。");
            this.checkDetailBankManager.batchSave(cdbl);
			
			checkRecord.setStatus(CheckRecord.CHK_STAT_IMP_SUCCESS);
		} catch (Exception e) {
			e.printStackTrace();
			checkRecord.setStatus(CheckRecord.CHK_STAT_IMP_FAILURE);
			log.error("银联【"+ checkRecord.getChkDate() +"】日 对账文件导入失败:" + e.getMessage());
		}
		checkRecordManager.save(checkRecord);
	}
	
	@Override
	public void checkOrder(CheckRecord checkRecord) {
		int total = 0;
		BigDecimal totalAmt = new BigDecimal(0);
		try {
			//0. 清除之前对账记录
			String deleleSql = "DELETE FROM SSM_CHECK_DETAIL_RESULT WHERE CHECK_RECORD = ?";
			this.checkDetailBankManager.executeSql(deleleSql, checkRecord.getId());
			
			//1. 对账记录
			List<CheckDetailBank> cdbl = checkDetailBankManager.find("from CheckDetailBank where checkRecord = ?", checkRecord.getId());
			List<CheckDetailResult> cdrl = new ArrayList<CheckDetailResult>();
//			List<CheckDetailHis> cdhl = new ArrayList<CheckDetailHis>();
			Settlement settlement = null;
			CheckDetailHis detail = null;
			CheckDetailResult result = null;
			for(CheckDetailBank cdb : cdbl){
				result = new CheckDetailResult();
				result.setCheckRecord(cdb.getCheckRecord());
				result.setMerchanet(cdb.getMerchanet());
				result.setTerminal(cdb.getTerminal());
				result.setBatchNo(cdb.getBatchNo());
				result.setAmt(cdb.getAmt().abs());
				result.setClearAmt(cdb.getClearAmt().abs());
				result.setAccount(cdb.getAccount());
				result.setCardType(cdb.getCardType());
				result.setCardBankCode(cdb.getCardBankCode());
				result.setTradeNo(cdb.getTradeNo());
				result.setTradeType("S22".equals(cdb.getTradeType())?Settlement.SETTLE_TYPE_PAY:Settlement.SETTLE_TYPE_REFUND);
				result.setTradeDate(DateUtils.date2String(DateUtils.string2Date(cdb.getTradeDate(), "yyyyMMdd"), "yyyy-MM-dd"));
				result.setTradeTime(cdb.getTradeTime());
				result.setClearDate(DateUtils.date2String(DateUtils.string2Date(cdb.getClearDate(), "yyyyMMdd"), "yyyy-MM-dd"));
				//1.自助机结算单数据
				settlement = settlementManager.findOne("from Settlement where tradeNo = ? and settleType = 'SP'", cdb.getTradeNo());
				if(null == settlement){
					result.setSsmCheckStatus(CheckDetailResult.SSM_CHECK_STATUS_SSM_NOTRADE);
					result.setSsmCheckTime(DateUtils.getCurrentDate());
					result.setSsmCheckType(CheckDetailResult.CHECK_TYPE_AUTO);
				} else {
					result.setSsmNo(settlement.getSettleNo());
					result.setSsmTime(settlement.getCreateTime());
					result.setSsmAmt(settlement.getAmt());
					result.setSsmCheckTime(DateUtils.getCurrentDate());
					result.setSsmCheckType(checkRecord.getOptType());
					result.setSsmCheckStatus(CheckDetailResult.SSM_CHECK_STATUS_SUCCESS);
					
					if(!Settlement.SETTLE_STAT_PAY_SUCCESS.equals(settlement.getStatus())
							&& !Settlement.SETTLE_STAT_PAY_FINISH.equals(settlement.getStatus())){
						result.setSsmCheckStatus(CheckDetailResult.SSM_CHECK_STATUS_FAILURE);
					}
					if(result.getSsmAmt().compareTo(result.getAmt()) == 1){
						result.setSsmCheckStatus(CheckDetailResult.SSM_CHECK_STATUS_MNY_MORE);
					}
					if(result.getSsmAmt().compareTo(result.getAmt()) == -1){
						result.setSsmCheckStatus(CheckDetailResult.SSM_CHECK_STATUS_MNY_LESS);
					}
				}
				//2.HIS银行交易明细数据
				detail = checkDetailHisManager.findOne("from CheckDetailHis where ztbz = '1' and jylx = 'HB01' and jsckh = ?", cdb.getTradeNo());
				if(null == detail){
					result.setHisCheckStatus(CheckDetailResult.HIS_CHECK_STATUS_HIS_NOTRADE);
					result.setHisCheckTime(DateUtils.getCurrentDate());
					result.setHisCheckType(CheckDetailResult.CHECK_TYPE_AUTO);
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
					//					
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
				totalAmt = totalAmt.add(cdb.getAmt());
				log.info("银联对账记录，流水号【"+ result.getTradeNo() + "】，金额【"+result.getAmt().toString() + "】，对账状态【"+result.getHisCheckStatus() + "】。");
			}
			this.checkDetailResultManager.batchSave(cdrl);
//			this.checkDetailHisManager.batchSave(cdhl);
			checkRecord.setStatus(CheckRecord.CHK_STAT_FINISH);
			checkRecord.setTotal(total);
			checkRecord.setAmt(totalAmt);
		} catch (Exception e) {
			checkRecord.setStatus(CheckRecord.CHK_STAT_FAILURE);
			log.error("银联【"+ checkRecord.getChkDate() +"】日 对账失败：" + e.getMessage());
			e.printStackTrace();
		}
		
		this.checkRecordManager.save(checkRecord);
	}

	private CheckDetailBank convertRecordToObject(int line, String record){
//		20170612,20170611,235306,898530180620109,53023115,1000,1000,000705921129,S22,6212262502013068617,01020000,借记卡
//		清分日期,交易时间,交易时间,商户号,终端号,交易金额,清分金额,流水号,交易类型,交易卡号,发卡银行,卡类型
		CheckDetailBank cdb = new CheckDetailBank();
		if(StringUtils.isBlank(record))
			return null;
		String[] params = record.split(",");
		if(params.length != 12){
			log.info("银联导入 对账文件记录第【" + line + "】条数据错误。");
			log.info(record);
			return null;
		}
		cdb.setClearDate(params[0]);
		cdb.setTradeDate(params[1]);
		cdb.setTradeTime(params[2]);
		cdb.setMerchanet(params[3]);
		cdb.setTerminal(params[4]);
		cdb.setAmt(new BigDecimal(params[5]));
		cdb.setClearAmt(new BigDecimal(params[6]));
		cdb.setTradeNo(params[7]);
		cdb.setTradeType(params[8]);
		cdb.setTradeStatus("S");//默认返回成功数据
		cdb.setAccount(params[9]);
		cdb.setCardBankCode(params[10]);
		cdb.setCardType(params[11]);
		
		return cdb;
	}
	private boolean downloadFile(CheckRecord checkRecord) {
		boolean flag = true;
		FtpUtils ftp = null;
		try {
			String checkFile = checkRecord.getChkDate().replaceAll("-", "") + ".txt";
			String checkString = checkRecord.getPayChannel().getCheckUrl();
			String[] checkConfig = checkString.split(":");
			ftp = new FtpUtils(checkConfig[1], Integer.valueOf(checkConfig[2]), checkConfig[3], checkConfig[4]);
			if(ftp.connectServer() && ftp.downloadFile("/", checkFile, checkRecord.getFilePath() + checkFile) > 0){
				log.info("银联下载文件，路径【" + checkConfig[1] + ":" + checkConfig[2]+"】,文件【"+checkFile+"】成功！");
			} else {
				flag = false;
				log.info("银联下载文件，路径【" + checkConfig[1] + ":" + checkConfig[2]+"】,文件【"+checkFile+"】失败！");
			}
		} catch (Exception e) {
			flag = false;
			log.error("银联下载文件失败：" + e.getMessage());
			e.printStackTrace();
		} finally {
			if(ftp != null) {
				ftp.closeServer();
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
	
}
