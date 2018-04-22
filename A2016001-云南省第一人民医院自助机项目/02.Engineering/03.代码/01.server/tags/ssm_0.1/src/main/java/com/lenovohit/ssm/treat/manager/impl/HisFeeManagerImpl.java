package com.lenovohit.ssm.treat.manager.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;

import com.lenovohit.ssm.payment.model.Fee;
import com.lenovohit.ssm.payment.model.Order;
import com.lenovohit.ssm.payment.model.Settlement;
import com.lenovohit.ssm.treat.dao.FrontendRestDao;
import com.lenovohit.ssm.treat.manager.HisFeeManager;
import com.lenovohit.ssm.treat.model.Patient;
import com.lenovohit.ssm.treat.model.UnPayedFeeItem;
import com.lenovohit.ssm.treat.model.UnPayedFeeRecord;

public class HisFeeManagerImpl implements HisFeeManager{

	@Autowired
	private FrontendRestDao frontendRestDao;
	
	@Override
	public void bizAfterPay(Order order, Settlement settle) {
		// TODO Auto-generated method stub
		
	}

	@Override
	public List<UnPayedFeeRecord> getUnPayedFees(Patient patient) {
		List<UnPayedFeeRecord> unPayedFeeList = frontendRestDao.getForList("fee/list", UnPayedFeeRecord.class);
		List<UnPayedFeeItem> items = frontendRestDao.getForList("fee/list/items", UnPayedFeeItem.class);
		
		List<UnPayedFeeRecord> unPayedFees = new ArrayList<UnPayedFeeRecord>();
		
		for(UnPayedFeeRecord unPayedFeeRecord : unPayedFeeList){
			for(UnPayedFeeItem unPayedFeeItem : items){
				if(unPayedFeeRecord.getPrescriptionId().equals(unPayedFeeItem.getPrescriptionId())){
					unPayedFeeRecord.getItems().add(unPayedFeeItem);
				}
			}
			unPayedFees.add(unPayedFeeRecord);
		}
		
		return unPayedFees;
	}
}
