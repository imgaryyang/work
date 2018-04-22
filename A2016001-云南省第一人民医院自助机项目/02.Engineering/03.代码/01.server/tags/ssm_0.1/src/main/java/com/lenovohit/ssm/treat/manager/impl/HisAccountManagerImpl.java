package com.lenovohit.ssm.treat.manager.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;

import com.lenovohit.ssm.payment.model.Order;
import com.lenovohit.ssm.payment.model.Settlement;
import com.lenovohit.ssm.treat.dao.FrontendRestDao;
import com.lenovohit.ssm.treat.manager.HisAccountManager;
import com.lenovohit.ssm.treat.model.AccountBill;
import com.lenovohit.ssm.treat.model.AccountBillDetail;
import com.lenovohit.ssm.treat.model.HisAccount;
import com.lenovohit.ssm.treat.model.InpatientBill;
import com.lenovohit.ssm.treat.model.InpatientBillDetail;
import com.lenovohit.ssm.treat.model.Patient;

public class HisAccountManagerImpl implements HisAccountManager{
	
	@Autowired
	private FrontendRestDao frontendRestDao;
	@Override
	public void bizAfterPay(Order order, Settlement settle) {
		// TODO Auto-generated method stub
	}

	@Override
	public HisAccount accountInfo(Patient patient) {
		String  accountNo = patient.getAccountNo();
		// TODO Auto-generated method stub 
		return frontendRestDao.getForEntity("account/"+accountNo, HisAccount.class);
	}

	@Override
	public HisAccount openPrepaid(Patient patient) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public List<AccountBill> billList(HisAccount account) {
		String accountNo = "6210300020409000";//account.getActNo();
		List<AccountBill> accountBillList = frontendRestDao.getForList("account/"+accountNo+"/bill/list", AccountBill.class);
		List<AccountBillDetail> items = frontendRestDao.getForList("account/"+accountNo+"/bill/list/items", AccountBillDetail.class);
		
		List<AccountBill> accountBills = new ArrayList<AccountBill>();
		
		for(AccountBill accountBill : accountBillList){
			for(AccountBillDetail billDetail : items){
				if(accountBill.getId().equals(billDetail.getSettlementId())){
					accountBill.getItems().add(billDetail);
				}
			}
			accountBills.add(accountBill);
		}
		
		return accountBills;
		
	}

	@Override
	public HisAccount pay(HisAccount account) {
		// TODO Auto-generated method stub
		return null;
	}}
