package com.infohold.elh.treat.vom;

import java.util.List;

import com.infohold.elh.pay.model.Charge;

public class ChargesTom {
	private int total;
	private List<Charge> charges;
	private double totalAmt;
	public double getTotalAmt() {
		return totalAmt;
	}
	public void setTotalAmt(double totalAmt) {
		this.totalAmt = totalAmt;
	}
	public int getTotal() {
		return total;
	}
	public void setTotal(int total) {
		this.total = total;
	}
	public List<Charge> getCharges() {
		return charges;
	}
	public void setCharges(List<Charge> charges) {
		this.charges = charges;
	}
}
