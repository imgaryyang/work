package com.infohold.elh.treat.manager;

import java.util.List;

import com.infohold.elh.base.model.Department;
import com.infohold.elh.base.model.Doctor;
import com.infohold.elh.base.model.Hospital;
import com.infohold.elh.base.model.MedicalCard;
import com.infohold.elh.pay.model.Charge;
import com.infohold.elh.pay.model.Order;
import com.infohold.elh.treat.model.MedicalCheck;
import com.infohold.elh.treat.model.RegistSource;
import com.infohold.elh.treat.model.Register;

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
