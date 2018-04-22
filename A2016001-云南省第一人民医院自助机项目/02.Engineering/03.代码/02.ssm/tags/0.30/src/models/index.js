//import styles from './examples';

const models=[
//	require('./FrameModel'),
//	require('./HomeModel'),
//	require('./NavModel'),
//	require('./DeptModel'),
//	require('./DoctorModel'),
//	require('./ScheduleModel'),
//	require('./AppointmentModel'), 
//	require('./UserModel'),
//	require('./MessageModel'),
//	require('./AccountModel'),
//	require('./OrderModel'),
//	require('./InpatientModel'),
//	require('./OutpatientModel'),
//	require('./PatientModel'),
//	require('./PrepaidModel'),
//	require('./PaymentModel'),
 
	require('./frame/PatientModel'),
	require('./frame/FrameModel'),
	require('./pay/DepositModel'),
	require('./pay/ForegiftModel'),
	require('./pay/PaymentModel'),
	require('./pay/OrderModel'),
	require('./pay/RefundModel'),
	require('./pay/SettleModel'),
	require('./appoint/AppointModel'),
	require('./clinic/CaseModel'),
	require('./assay/AssayModel'),
	require('./inpatient/InpatientModel'),
	require('./tool/DeviceModel'),
]

export default models;



