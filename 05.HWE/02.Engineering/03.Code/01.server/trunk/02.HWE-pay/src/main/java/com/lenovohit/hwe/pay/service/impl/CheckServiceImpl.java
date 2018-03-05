package com.lenovohit.hwe.pay.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.lenovohit.core.manager.GenericManager;
import com.lenovohit.core.utils.SpringUtils;
import com.lenovohit.core.utils.StringUtils;
import com.lenovohit.hwe.pay.exception.PayException;
import com.lenovohit.hwe.pay.model.CheckRecord;
import com.lenovohit.hwe.pay.model.PayMerchant;
import com.lenovohit.hwe.pay.service.CheckBaseService;
import com.lenovohit.hwe.pay.service.CheckService;

@Service("checkService")
public class CheckServiceImpl implements CheckService {
	@Autowired
	private GenericManager<PayMerchant, String> payMerchantManager;
	@Autowired
	private GenericManager<CheckRecord, String> checkRecordManager;
	
	@Override
	public void syncCheckFile(CheckRecord checkRecord) {
		//0.初始化数据
		initCheckRecord(checkRecord);
		this.checkRecordManager.save(checkRecord);
		//1.业务调用
		CheckBaseService checkBaseService = getAdaptCheckService(checkRecord.getPayMerchant());
		checkBaseService.syncCheckFile(checkRecord);
		this.checkRecordManager.save(checkRecord);
	}
	
	@Override
	public void importCheckFile(CheckRecord checkRecord) {
		//0.初始化数据
		initCheckRecord(checkRecord);
		this.checkRecordManager.save(checkRecord);
		//1.业务调用
		CheckBaseService checkBaseService = getAdaptCheckService(checkRecord.getPayMerchant());
		checkBaseService.importCheckFile(checkRecord);
		this.checkRecordManager.save(checkRecord);
	}

	@Override
	public void checkOrder(CheckRecord checkRecord) {
		//0.初始化数据
		initCheckRecord(checkRecord);
		this.checkRecordManager.save(checkRecord);
		//1.业务调用
		CheckBaseService checkBaseService = getAdaptCheckService(checkRecord.getPayMerchant());
		checkBaseService.checkOrder(checkRecord);
		this.checkRecordManager.save(checkRecord);
	}
	
	@Override
	public void syncPayFile(CheckRecord checkRecord) {
		//0.初始化数据
		initCheckRecord(checkRecord);
		this.checkRecordManager.save(checkRecord);
		//1.业务调用
		CheckBaseService checkBaseService = getAdaptCheckService(checkRecord.getPayMerchant());
		checkBaseService.syncPayFile(checkRecord);
		this.checkRecordManager.save(checkRecord);
	}

	@Override
	public void importPayFile(CheckRecord checkRecord) {
		//0.初始化数据
		initCheckRecord(checkRecord);
		this.checkRecordManager.save(checkRecord);
		//1.业务调用
		CheckBaseService checkBaseService = getAdaptCheckService(checkRecord.getPayMerchant());
		checkBaseService.importPayFile(checkRecord);
		this.checkRecordManager.save(checkRecord);
	}

	@Override
	public void checkPayOrder(CheckRecord checkRecord) {
		//0.初始化数据
		initCheckRecord(checkRecord);
		this.checkRecordManager.save(checkRecord);
		//1.业务调用
		CheckBaseService checkBaseService = getAdaptCheckService(checkRecord.getPayMerchant());
		checkBaseService.checkPayOrder(checkRecord);
		this.checkRecordManager.save(checkRecord);
	}

	@Override
	public void syncRefundFile(CheckRecord checkRecord) {
		//0.初始化数据
		initCheckRecord(checkRecord);
		this.checkRecordManager.save(checkRecord);
		//1.业务调用
		CheckBaseService checkBaseService = getAdaptCheckService(checkRecord.getPayMerchant());
		checkBaseService.syncRefundFile(checkRecord);
		this.checkRecordManager.save(checkRecord);
	}

	@Override
	public void importRefundFile(CheckRecord checkRecord) {
		//0.初始化数据
		initCheckRecord(checkRecord);
		this.checkRecordManager.save(checkRecord);
		//1.业务调用
		CheckBaseService checkBaseService = getAdaptCheckService(checkRecord.getPayMerchant());
		checkBaseService.importRefundFile(checkRecord);
		this.checkRecordManager.save(checkRecord);
	}

	@Override
	public void checkRefundOrder(CheckRecord checkRecord) {
		//0.初始化数据
		initCheckRecord(checkRecord);
		this.checkRecordManager.save(checkRecord);
		//1.业务调用
		CheckBaseService checkBaseService = getAdaptCheckService(checkRecord.getPayMerchant());
		checkBaseService.checkRefundOrder(checkRecord);
		this.checkRecordManager.save(checkRecord);
	}

	@Override
	public void syncReturnFile(CheckRecord checkRecord) {
		//0.初始化数据
		initCheckRecord(checkRecord);
		this.checkRecordManager.save(checkRecord);
		//1.业务调用
		CheckBaseService checkBaseService = getAdaptCheckService(checkRecord.getPayMerchant());
		checkBaseService.syncReturnFile(checkRecord);
		this.checkRecordManager.save(checkRecord);
	}
	
	@Override
	public void importReturnFile(CheckRecord checkRecord) {
		//0.初始化数据
		initCheckRecord(checkRecord);
		this.checkRecordManager.save(checkRecord);
		//1.业务调用
		CheckBaseService checkBaseService = getAdaptCheckService(checkRecord.getPayMerchant());
		checkBaseService.importReturnFile(checkRecord);
		this.checkRecordManager.save(checkRecord);
	}
	
	@Override
	public void checkReturnOrder(CheckRecord checkRecord) {
		//0.初始化数据
		initCheckRecord(checkRecord);
		this.checkRecordManager.save(checkRecord);
		//1.业务调用
		CheckBaseService checkBaseService = getAdaptCheckService(checkRecord.getPayMerchant());
		checkBaseService.checkReturnOrder(checkRecord);
		this.checkRecordManager.save(checkRecord);
	}

	
	/**
	 * 根据不同支付方式找到对应PayService
	 * @param payType
	 * @return
	 * @throws PayException
	 */
	private CheckBaseService getAdaptCheckService(PayMerchant payMerchant) throws PayException {
		CheckBaseService checkService = null;
		try {
			StringBuffer sb = new StringBuffer("");
			sb.append("c").append(payMerchant.getPayChannel().getCode());
			sb.append("CheckService");
			checkService = (CheckBaseService) SpringUtils.getBean(sb.toString());
			if (null == checkService) {
				throw new PayException("91002020","不支持的通信类型:" + sb.toString() + ",或需要在spring中进行未配置！");
			}
		} catch (PayException e) {
			throw e;
		} catch (Exception e) {
			e.getMessage();
			throw new PayException("91002020","不支持的支付渠道,或需要在spring中进行未配置！");
		}
		
		return checkService;
	}
	
	private void initCheckRecord(CheckRecord checkRecord) throws PayException{
		try {
			if(null == checkRecord) {
				throw new PayException("91001010","checkRecord should not be NULL!");
			}
			if(StringUtils.isEmpty(checkRecord.getMchId())){
				throw new PayException("91001010","mchId should not be NULL!");
			}
			if(null == checkRecord.getPayMerchant()){
				PayMerchant payMerchant = this.payMerchantManager.get(checkRecord.getMchId());
				checkRecord.setPayMerchant(payMerchant);
				checkRecord.setPcId(payMerchant.getPayChannel().getId());
			}
			if(StringUtils.isEmpty(checkRecord.getFilePath())){
				throw new PayException("91001010","filePath should not be NULL!");
			}
		} catch (PayException e) {
			throw e;
		} catch (Exception e) {
			e.printStackTrace();
			throw new PayException("91001020","对账数据格式错误");
		}
	}
}
