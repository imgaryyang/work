package com.lenovohit.ssm.treat.manager.impl;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;

import com.lenovohit.ssm.treat.dao.FrontendRestDao;
import com.lenovohit.ssm.treat.manager.HisInpatientManager;
import com.lenovohit.ssm.treat.model.InpatientBill;
import com.lenovohit.ssm.treat.model.InpatientBillDetail;
import com.lenovohit.ssm.treat.model.InpatientDailyBillDetail;
import com.lenovohit.ssm.treat.model.InpatientInfo;
import com.lenovohit.ssm.treat.model.Patient;

public class HisInpatientManagerImpl implements HisInpatientManager{

	@Autowired
	private FrontendRestDao frontendRestDao;
	
	@Override
	public InpatientInfo getBaseInfo(Patient patient) {
		String patientId = "00000001";//patient.getId();
		InpatientInfo inpatientInfo = frontendRestDao.getForEntity("inpatient/"+patientId, InpatientInfo.class);
		return inpatientInfo;
	}

	@Override
	public List<InpatientDailyBillDetail> getDailyBill(InpatientInfo baseInfo, String billDate) {
		List<InpatientDailyBillDetail> dailyBill = frontendRestDao.getForList("inpatient/dailyBill/list", InpatientDailyBillDetail.class);
		return dailyBill;
	}

	@Override
	public List<InpatientBill> getInpatientBill(InpatientInfo baseInfo) {
		List<InpatientBill> inpatientBillList = frontendRestDao.getForList("inpatient/inpatientBill/list", InpatientBill.class);
		List<InpatientBillDetail> items = frontendRestDao.getForList("inpatient/inpatientBill/list/items", InpatientBillDetail.class);
		
		List<InpatientBill> inpatientBills = new ArrayList<InpatientBill>();
		
		for(InpatientBill inpatientBill : inpatientBillList){
			for(InpatientBillDetail billDetail : items){
				if(inpatientBill.getId().equals(billDetail.getBillId())){
					inpatientBill.getItems().add(billDetail);
				}
			}
			inpatientBills.add(inpatientBill);
		}
		
		return inpatientBills;
	}

	@Override
	public BigDecimal depositBalance(Patient patient) {
		InpatientInfo inpatientInfo = frontendRestDao.getForEntity("inpatient/deposit/balance", InpatientInfo.class);
		BigDecimal balance = inpatientInfo.getPrepaidBalance();
		return balance;
	}}
