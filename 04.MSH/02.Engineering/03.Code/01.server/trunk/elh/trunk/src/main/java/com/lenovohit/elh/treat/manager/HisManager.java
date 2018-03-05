package com.lenovohit.elh.treat.manager;

import java.util.List;

import com.lenovohit.elh.base.model.Department;
import com.lenovohit.elh.base.model.Doctor;
import com.lenovohit.elh.base.model.Hospital;
import com.lenovohit.elh.base.model.MedicalCard;
import com.lenovohit.elh.pay.model.Charge;
import com.lenovohit.elh.pay.model.Order;
import com.lenovohit.elh.treat.model.MedicalCheck;
import com.lenovohit.elh.treat.model.RegistSource;
import com.lenovohit.elh.treat.model.Register;

public interface HisManager {
	
	public List<RegistSource> getRegistSource(Hospital hospital,Department department, Doctor doctor, String reqType,String date);

	public Order siCardPay(Order order);

	public List<MedicalCheck> requireCheck(List<MedicalCheck> check);

	public RegistSource registAppiont(RegistSource source);
	
	public RegistSource lockRegistSource(RegistSource source);

	public MedicalCard getMedicalCard(String hospitalId, String cardNo);

	public MedicalCard makeMedicalCard(MedicalCard card);

	public List<Charge> payCharges(List<Charge> charges);

	public Register registRealTime(Register register);

}
