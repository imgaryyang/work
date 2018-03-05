package com.lenovohit.hwe.pay.service.impl;

import java.io.BufferedOutputStream;
import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.math.BigDecimal;
import java.nio.charset.Charset;
import java.util.ArrayList;
import java.util.List;
import java.util.zip.ZipEntry;
import java.util.zip.ZipInputStream;

import org.apache.commons.configuration.Configuration;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.apache.http.HttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.alipay.api.response.AlipayDataDataserviceBillDownloadurlQueryResponse;
import com.lenovohit.core.manager.GenericManager;
import com.lenovohit.core.utils.DateUtils;
import com.lenovohit.core.utils.StringUtils;
import com.lenovohit.hwe.pay.exception.PayException;
import com.lenovohit.hwe.pay.model.CheckDetailAlipay;
import com.lenovohit.hwe.pay.model.CheckDetailResult;
import com.lenovohit.hwe.pay.model.CheckRecord;
import com.lenovohit.hwe.pay.model.Settlement;
import com.lenovohit.hwe.pay.service.CheckBaseService;
import com.lenovohit.hwe.pay.support.alipay.scan.Alipay;
import com.lenovohit.hwe.pay.support.alipay.scan.model.builder.AlipayTradeDownloadRequestBuilder;
import com.lenovohit.hwe.pay.support.alipay.scan.model.result.AlipayF2FDownloadResult;
import com.lenovohit.hwe.pay.utils.PayMerchantConfigCache;

@Service("calipayCheckService")
public class CalipayCheckServiceImpl implements CheckBaseService {
    private static Log                  log = LogFactory.getLog(CalipayCheckServiceImpl.class);

	@Autowired
	private GenericManager<CheckRecord, String> checkRecordManager;
	@Autowired
	private GenericManager<CheckDetailAlipay, String> checkDetailAlipayManager;
	@Autowired
	private GenericManager<CheckDetailResult, String> checkDetailResultManager;
	@Autowired
	private GenericManager<Settlement, String> settlementManager;
	
	
	@Override
	public void syncCheckFile(CheckRecord checkRecord) {
		Configuration config = PayMerchantConfigCache.getConfig(checkRecord.getPayMerchant());
		// 创建扫码支付请求builder，设置请求参数
		AlipayTradeDownloadRequestBuilder builder = new AlipayTradeDownloadRequestBuilder()
				.setBillType("trade").setBillDate(checkRecord.getChkDate())
				.setConfigs(config);
		AlipayF2FDownloadResult result = Alipay.tradeDownloadUrl(builder);
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
	}
	
	@Override
	public void importCheckFile(CheckRecord checkRecord) {
		BufferedReader br = null;
		try {
			//0. 清除之前导入记录
			String deleleSql = "DELETE FROM PAY_CHECK_DETAIL_ALIPAY WHERE RECORD_ID = ?";
			this.checkDetailAlipayManager.executeSql(deleleSql, checkRecord.getId());
			
			//1. 导入记录
			File checkFile = new File(checkRecord.getFilePath() + checkRecord.getChkFile());
			if(!checkFile.exists()) {
				throw new PayException("91001040", "对账文件【"+ checkFile.getPath() + "】不存在！");
			}
			br = new BufferedReader(new InputStreamReader(new FileInputStream(checkFile), "gbk"));
			List<CheckDetailAlipay> cdal = new ArrayList<CheckDetailAlipay>();
			CheckDetailAlipay cda = null;
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
            	cda = convertRecordToObject(line, tempString);
            	if(cda == null) {
            		continue;
            	} else {
            		record++;
            	}
            	cda.setRecordId(checkRecord.getId());
            	cdal.add(cda);
                if(cdal.size() == 100){
                	this.checkDetailAlipayManager.batchSave(cdal, 100);
                	cdal = new ArrayList<CheckDetailAlipay>();
                }
            }
            this.checkDetailAlipayManager.batchSave(cdal);
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
			String deleleSql = "DELETE FROM PAY_CHECK_DETAIL_RESULT WHERE RECORD_ID = ?";
			this.checkDetailResultManager.executeSql(deleleSql, checkRecord.getId());
			
			//1. 对账记录
			List<CheckDetailAlipay> cdal = checkDetailAlipayManager.find("from CheckDetailAlipay where recordId = ?", checkRecord.getId());
			List<CheckDetailResult> cdrl = new ArrayList<CheckDetailResult>();
			Settlement settlement = null;
			CheckDetailResult result = null;
			for(CheckDetailAlipay cda : cdal){
				
				result = new CheckDetailResult();
				result.setRecordId(checkRecord.getId());
				result.setMerchanet(checkRecord.getPayMerchant().getMchNo());
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
			log.error("支付宝【"+ checkRecord.getChkDate() +"】日 对账失败：" + e.getMessage());
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
		cda.setMDiscountAmt(new BigDecimal(params[16].trim()));
		cda.setTicketAmt(new BigDecimal(params[17].trim()));
		cda.setTicketName(params[18].trim());
		cda.setMCouponAmt(new BigDecimal(params[19].trim()));
		cda.setCardAmt(new BigDecimal(params[20].trim()));
		cda.setRequestNo(params[21].trim());
		cda.setServiceAmt(new BigDecimal(params[22].trim()));
		cda.setCommission(new BigDecimal(params[23].trim()));
		cda.setMemo(params[24].trim());
		
		return cda;
	}
}
