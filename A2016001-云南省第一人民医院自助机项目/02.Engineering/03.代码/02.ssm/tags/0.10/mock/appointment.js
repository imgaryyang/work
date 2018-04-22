'use strict';

var apptRecords = [
	{
		ApptId: '0001',
		ApptDate: '2017-01-15',
		ApptTime: '09:00',
		DayPeriod: 'am',
		DeptId: '001001002',
		DeptName: '物理康复',
		DiagnosisType: '专科',
		DoctorId: '0001',
		DoctorName: '蒋建光',
		JobTitleId: '001',
		JobTitle: '主任医师',
		RegisteredAmount: '2000',
		BookNum: '18',
		Address: '门诊楼二楼东侧外科诊室',
		State: '1',	// 0 - 取消 1 - 未就诊 2 - 已就诊
	},
	{
		ApptId: '0002',
		ApptDate: '2017-01-15',
		ApptTime: '11:01',
		DayPeriod: 'am',
		DeptId: '001001002',
		DeptName: '物理康复',
		DiagnosisType: '专科',
		DoctorId: '0001',
		DoctorName: '蒋建光',
		JobTitleId: '001',
		JobTitle: '主任医师',
		RegisteredAmount: '2000',
		BookNum: '18',
		Address: '门诊楼二楼东侧外科诊室',
		State: '2',
	},
	{
		ApptId: '0003',
		ApptDate: '2017-01-10',
		ApptTime: '10:25',
		DayPeriod: 'pm',
		DeptId: '001001002',
		DeptName: '物理康复',
		DiagnosisType: '专科',
		DoctorId: '0001',
		DoctorName: '徐宏',
		JobTitleId: '001',
		JobTitle: '主任医师',
		RegisteredAmount: '2000',
		BookNum: '18',
		Address: '门诊楼二楼东侧外科诊室',
		State: '0',
	},
	{
		ApptId: '0004',
		ApptDate: '2017-01-09',
		ApptTime: '14:20',
		DayPeriod: 'am',
		DeptId: '001001002',
		DeptName: '物理康复',
		DiagnosisType: '专科',
		DoctorId: '0001',
		DoctorName: '白洁',
		JobTitleId: '001',
		JobTitle: '主治医师',
		RegisteredAmount: '2000',
		BookNum: '18',
		Address: '门诊楼二楼东侧外科诊室',
		State: '2',
	},
	{
		ApptId: '0005',
		ApptDate: '2017-01-01',
		ApptTime: '16:00',
		DayPeriod: 'am',
		DeptId: '001001002',
		DeptName: '物理康复',
		DiagnosisType: '专科',
		DoctorId: '0001',
		DoctorName: '王刘桑',
		JobTitleId: '001',
		JobTitle: '主治医师',
		RegisteredAmount: '2000',
		BookNum: '18',
		Address: '门诊楼二楼东侧外科诊室',
		State: '2',
	},
];

module.exports = {

  'GET /api/ssm/client/appointment/list': function (req, res) {
  	
    setTimeout(function () {
      res.json({
        success: true,
        result: apptRecords,
      });
    }, 500);
  },

  'GET /api/ssm/client/appointment/sign': function (req, res) {
  	
    setTimeout(function () {
      res.json({
        success: true,
      });
    }, 500);
  },

  'GET /api/ssm/client/appointment/cancel': function (req, res) {
    setTimeout(function () {
      res.json({
        success: true,
      });
    }, 500);
  },
  
};
