package com.lenovohit.hwe.pay.service.impl;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.lenovohit.core.manager.GenericManager;
import com.lenovohit.hwe.pay.model.CheckDetailResult;
import com.lenovohit.hwe.pay.model.CheckDetailWxpay;
import com.lenovohit.hwe.pay.model.CheckRecord;
import com.lenovohit.hwe.pay.model.Settlement;
import com.lenovohit.hwe.pay.service.CheckBaseService;

@Service("ccashpayCheckService")
public class CcashpayCheckServiceImpl implements CheckBaseService {
    private static Log                  log = LogFactory.getLog(CcashpayCheckServiceImpl.class);

	@Autowired
	private GenericManager<CheckRecord, String> checkRecordManager;
	@Autowired
	private GenericManager<CheckDetailWxpay, String> checkDetailWxpayManager;
	@Autowired
	private GenericManager<CheckDetailResult, String> checkDetailResultManager;
	@Autowired
	private GenericManager<Settlement, String> settlementManager;
	
	
	@Override
	public void syncCheckFile(CheckRecord checkRecord) {}
	
	@Override
	public void importCheckFile(CheckRecord checkRecord) {}

	@Override
	public void checkOrder(CheckRecord checkRecord) {}
	
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

}
