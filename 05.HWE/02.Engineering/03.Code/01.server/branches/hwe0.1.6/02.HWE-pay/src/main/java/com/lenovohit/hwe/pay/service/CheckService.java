package com.lenovohit.hwe.pay.service;

import com.lenovohit.hwe.pay.model.CheckRecord;

public interface CheckService {
	public void syncCheckFile(CheckRecord checkRecord);
	public void importCheckFile(CheckRecord checkRecord);
	public void checkOrder(CheckRecord checkRecord);
	public void syncPayFile(CheckRecord checkRecord);
	public void importPayFile(CheckRecord checkRecord);
	public void checkPayOrder(CheckRecord checkRecord);
	public void syncRefundFile(CheckRecord checkRecord);
	public void importRefundFile(CheckRecord checkRecord);
	public void checkRefundOrder(CheckRecord checkRecord);
	public void syncReturnFile(CheckRecord checkRecord);
	public void importReturnFile(CheckRecord checkRecord);
	public void checkReturnOrder(CheckRecord checkRecord);
}
