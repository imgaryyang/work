package com.lenovohit.ssm.payment.manager;

import com.lenovohit.ssm.payment.model.CheckRecord;
import com.lenovohit.ssm.payment.model.Settlement;

public interface PayBaseManager {
	public void precreate(Settlement settlement);
	public void payCallBack(Settlement settlement);
	public void refund(Settlement settlement);
	public void query(Settlement settlement);
	public void refundQuery(Settlement settlement);
	public void syncCheckFile(CheckRecord checkRecord);
	public void importCheckFile(CheckRecord checkRecord);
	public void checkOrder(CheckRecord checkRecord);
	public void syncReturnFile(CheckRecord checkRecord);
	public void importReturnFile(CheckRecord checkRecord);
}
