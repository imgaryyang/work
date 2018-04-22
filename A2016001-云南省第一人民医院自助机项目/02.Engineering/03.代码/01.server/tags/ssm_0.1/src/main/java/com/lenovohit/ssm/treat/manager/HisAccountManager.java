package com.lenovohit.ssm.treat.manager;

import java.util.List;

import com.lenovohit.ssm.payment.manager.HisPayManager;
import com.lenovohit.ssm.treat.model.AccountBill;
import com.lenovohit.ssm.treat.model.HisAccount;
import com.lenovohit.ssm.treat.model.Patient;

public interface HisAccountManager extends HisPayManager {
	
	
	/**
	 * account/{accountNo} 虚拟账户信息查询（余额、状态等）
	 * @param patient
	 * @return
	 */

	HisAccount accountInfo(Patient patient);
	/**
	 * account/open 开通预存功能
	 * @param patient
	 * @return
	 */
	HisAccount openPrepaid(Patient patient);
	
	
	/**
	 * account/{accountNo}/bill/list 预存/消费记录
	 * @param account
	 * @return
	 */
	List<AccountBill> billList(HisAccount account);
	
	/**
	 * account/{accountNo}/pay 虚拟账户扣款
	 * @param account
	 * @return
	 */
	HisAccount pay(HisAccount account);

	/**
	 *  account/{accountNo}/prepaid/book 预存记账（返回余额） 继承自父类
	 * @param order
	 * @param settle
	 */
	//void bizAfterPay(Order order,Settlement settle);
	
}
