package com.lenovohit.ssm.payment.manager;

import com.lenovohit.ssm.payment.model.Settlement;

public abstract class BankPayManager implements PayBaseManager{

	public abstract void queryCard(Settlement settlement);
}
