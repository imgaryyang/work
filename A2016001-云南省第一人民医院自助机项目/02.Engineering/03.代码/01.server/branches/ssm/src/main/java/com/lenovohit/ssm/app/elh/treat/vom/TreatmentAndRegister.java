package com.lenovohit.ssm.app.elh.treat.vom;

import com.lenovohit.ssm.app.elh.treat.model.Treatment;

public class TreatmentAndRegister{
	private Treatment treatment = new Treatment() ;
	private RegisterVom register = new RegisterVom();
	public Treatment getTreatment() {
		return treatment;
	}
	public void setTreatment(Treatment treatment) {
		this.treatment = treatment;
	}
	public RegisterVom getRegister() {
		return register;
	}
	public void setRegister(RegisterVom register) {
		this.register = register;
	}
}