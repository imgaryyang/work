package com.infohold.elh.treat.vom;

import java.util.List;

public class ChecksTom {
	private int total;
	private List<MedicalCheckVom> checks;
	public List<MedicalCheckVom> getChecks() {
		return checks;
	}
	public void setChecks(List<MedicalCheckVom> checks) {
		this.checks = checks;
	}
	public int getTotal() {
		return total;
	}
	public void setTotal(int total) {
		this.total = total;
	}
}
