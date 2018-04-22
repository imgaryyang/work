package com.lenovohit.ssm.treat.transfer;

import java.util.HashMap;
import java.util.Map;

public class Mapper {
	private static Map<Class<?>, Class<?>> map = new HashMap<Class<?>, Class<?>>();
	static {
		/*map.put(com.lenovohit.ssm.treat.model.Appointment.class,
				com.lenovohit.ssm.treat.transfer.mappper.Appointment.class);
		map.put(com.lenovohit.ssm.treat.model.AssayItem.class,
				com.lenovohit.ssm.treat.transfer.mappper.AssayItem.class);
		map.put(com.lenovohit.ssm.treat.model.AssayRecord.class,
				com.lenovohit.ssm.treat.transfer.mappper.AssayRecord.class);
		map.put(com.lenovohit.ssm.treat.model.DepositRecord.class,
				com.lenovohit.ssm.treat.transfer.mappper.DepositRecord.class);
		map.put(com.lenovohit.ssm.treat.model.HisDepartment.class,
				com.lenovohit.ssm.treat.transfer.mappper.HisDepartment.class);
		map.put(com.lenovohit.ssm.treat.model.HisResult.class,
				com.lenovohit.ssm.treat.transfer.mappper.HisResult.class);
		map.put(com.lenovohit.ssm.treat.model.InpatientBill.class,
				com.lenovohit.ssm.treat.transfer.mappper.InpatientBill.class);
		map.put(com.lenovohit.ssm.treat.model.InpatientDeposit.class,
				com.lenovohit.ssm.treat.transfer.mappper.InpatientDeposit.class);
		map.put(com.lenovohit.ssm.treat.model.InpatientInfo.class,
				com.lenovohit.ssm.treat.transfer.mappper.InpatientInfo.class);
		map.put(com.lenovohit.ssm.treat.model.MedicalRecord.class,
				com.lenovohit.ssm.treat.transfer.mappper.MedicalRecord.class);
		map.put(com.lenovohit.ssm.treat.model.MedicalRecordItem.class,
				com.lenovohit.ssm.treat.transfer.mappper.MedicalRecordItem.class);
		map.put(com.lenovohit.ssm.treat.model.TestPatient.class, 
				com.lenovohit.ssm.treat.transfer.mappper.Patient.class);
		map.put(com.lenovohit.ssm.treat.model.Schedule.class,
				com.lenovohit.ssm.treat.transfer.mappper.Schedule.class);*/

		// map.put(com.lenovohit.ssm.treat.model.AccountBill.class
		// ,com.lenovohit.ssm.treat.transfer.mappper.AccountBill.class );
		// map.put(com.lenovohit.ssm.treat.model.AccountBillDetail.class
		// ,com.lenovohit.ssm.treat.transfer.mappper.AccountBillDetail.class );
		// map.put(com.lenovohit.ssm.treat.model.AppointmentTimePeriod.class
		// ,com.lenovohit.ssm.treat.transfer.mappper.AppointmentTimePeriod.class
		// );
		// map.put(com.lenovohit.ssm.treat.model.HisAccount.class
		// ,com.lenovohit.ssm.treat.transfer.mappper.HisAccount.class );
		// map.put(com.lenovohit.ssm.treat.model.HisDoctor.class
		// ,com.lenovohit.ssm.treat.transfer.mappper.HisDoctor.class );
		// map.put(com.lenovohit.ssm.treat.model.InpatientBillDetail.class
		// ,com.lenovohit.ssm.treat.transfer.mappper.InpatientBillDetail.class
		// );
		// map.put(com.lenovohit.ssm.treat.model.InpatientDailyBill.class
		// ,com.lenovohit.ssm.treat.transfer.mappper.InpatientDailyBill.class );
		// map.put(com.lenovohit.ssm.treat.model.InpatientDailyBillDetail.class
		// ,com.lenovohit.ssm.treat.transfer.mappper.InpatientDailyBillDetail.class
		// );
		// map.put(com.lenovohit.ssm.treat.model.MedicalCard.class
		// ,com.lenovohit.ssm.treat.transfer.mappper.MedicalCard.class );
		// map.put(com.lenovohit.ssm.treat.model.UnPayedFeeItem.class
		// ,com.lenovohit.ssm.treat.transfer.mappper.UnPayedFeeItem.class );
		// map.put(com.lenovohit.ssm.treat.model.UnPayedFeeRecord.class
		// ,com.lenovohit.ssm.treat.transfer.mappper.UnPayedFeeRecord.class );
	}

	public static Class<?> getMapper(Class<?> modelClass) {
		Class<?> mapperClass = map.get(modelClass);
		return (mapperClass == null) ? modelClass : mapperClass;
	}
}
