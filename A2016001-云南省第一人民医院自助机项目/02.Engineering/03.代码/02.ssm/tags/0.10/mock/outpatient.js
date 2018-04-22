'use strict';
var moment = require('moment');

var caseHistoryRecords = [
	{
		Id: '00000001',
		TreatmentDate: '2017-01-03 13:35',
		DeptId: '001001002',
		DeptName: '物理康复',
		DoctorId: '0001',
		DoctorName: '蒋建光',
		JobTitleId: '001',
		JobTitle: '主任医师',
		PrintTimes: 0,
	},
	{
		Id: '00000002',
		TreatmentDate: '2017-01-02 09:00',
		DeptId: '001001002',
		DeptName: '物理康复',
		DoctorId: '0001',
		DoctorName: '蒋建光',
		JobTitleId: '001',
		JobTitle: '主任医师',
		PrintTimes: 0,
	},
	{
		Id: '00000003',
		TreatmentDate: '2016-12-25 10:25',
		DeptId: '001001003',
		DeptName: '内分泌科',
		DoctorId: '0006',
		DoctorName: '白洁',
		JobTitleId: '003',
		JobTitle: '副主任医师',
		PrintTimes: 1,
	},
	{
		Id: '00000004',
		TreatmentDate: '2016-12-12 11:00',
		DeptId: '001001003',
		DeptName: '内分泌科',
		DoctorId: '0006',
		DoctorName: '白洁',
		JobTitleId: '003',
		JobTitle: '副主任医师',
		PrintTimes: 1,
	},
	{
		Id: '00000005',
		TreatmentDate: '2016-12-01 08:46',
		DeptId: '001001009',
		DeptName: '肛肠科',
		DoctorId: '0009',
		DoctorName: '徐寅同',
		JobTitleId: '001',
		JobTitle: '主任医师',
		PrintTimes: 1,
	},
];

var checkRecords = [
	{
		Id: '00000001',
		RequestDate: '2017-01-03 13:35',
		CheckType: '02',
		CheckTypeName: '血常规',
		DeptId: '001001002',
		DeptName: '物理康复',
		DoctorId: '0001',
		DoctorName: '蒋建光',
		JobTitleId: '001',
		JobTitle: '主任医师',
		State: '0', //0 - 未缴费 1 - 未出结果 2 - 已出结果
		PrintTimes: 0,
	},
	{
		Id: '00000002',
		RequestDate: '2017-01-02 09:00',
		CheckType: '02',
		CheckTypeName: '血常规',
		DeptId: '001001002',
		DeptName: '物理康复',
		DoctorId: '0001',
		DoctorName: '蒋建光',
		JobTitleId: '001',
		JobTitle: '主任医师',
		State: '1',
		PrintTimes: 0,
	},
	{
		Id: '00000003',
		RequestDate: '2016-12-25 10:25',
		CheckType: '01',
		CheckTypeName: '甲功三项',
		DeptId: '001001003',
		DeptName: '内分泌科',
		DoctorId: '0006',
		DoctorName: '白洁',
		JobTitleId: '003',
		JobTitle: '副主任医师',
		State: '2',
		PrintTimes: 1,
	},
	{
		Id: '00000004',
		RequestDate: '2016-12-12 11:00',
		CheckType: '01',
		CheckTypeName: '甲功三项',
		DeptId: '001001003',
		DeptName: '内分泌科',
		DoctorId: '0006',
		DoctorName: '白洁',
		JobTitleId: '003',
		JobTitle: '副主任医师',
		State: '2',
		PrintTimes: 1,
	},
	{
		Id: '00000005',
		RequestDate: '2016-12-01 08:46',
		CheckType: '03',
		CheckTypeName: '肝功',
		DeptId: '001001009',
		DeptName: '肛肠科',
		DoctorId: '0009',
		DoctorName: '徐寅同',
		JobTitleId: '001',
		JobTitle: '主任医师',
		State: '2',
		PrintTimes: 1,
	},
];

var checkInfo = {
	CheckId: '00000005',
	PatientId: '00001',
	PatientName: '王玉杰',
	RequestDate: '2016-12-01 08:46',
	CheckType: '03',
	CheckTypeName: '甲功三项',
	RequestDeptId: '001001009',
	RequestDeptName: '内分泌科',
	RequestDoctorId: '0009',
	RequestDoctorName: '徐寅同',
	JobTitleId: '001',
	JobTitle: '主任医师',
	ReceiveDate: '2016-12-01 08:55',
	SpecimenType: '01',
	SpecimenTypeName: '血',
	CheckDoctorId: 'D00005',
	CheckDoctorName: '卢玉双',
	CheckDate: '2016-12-02 12:00',
	State: '2',
	PrintTimes: 1,
	items: [
		{
			Index: 0,
			Item: '游离三碘甲状腺氨酸',
			Result: '1.53',
			State: '3', //1 - 正常 2 - 偏高 3 - 偏低
			Range: '1.80 - 4.10',
			Unit: 'pg/ml',
		},
		{
			Index: 1,
			Item: '游离甲状腺素',
			Result: '0.376',
			State: '3', //1 - 正常 2 - 偏高 3 - 偏低
			Range: '0.81 - 1.89',
			Unit: 'ng/dl',
		},
		{
			Index: 2,
			Item: '三碘甲状腺原氨酸',
			Result: '0.484',
			State: '3', //1 - 正常 2 - 偏高 3 - 偏低
			Range: '0.66 - 1.92',
			Unit: 'ng/ml',
		},
		{
			Index: 3,
			Item: '甲状腺素',
			Result: '2.13',
			State: '3', //1 - 正常 2 - 偏高 3 - 偏低
			Range: '4.30 - 12.50',
			Unit: 'μg/ml',
		},
		{
			Index: 4,
			Item: '促甲状腺激素',
			Result: '85.120',
			State: '2', //1 - 正常 2 - 偏高 3 - 偏低
			Range: '0.38 - 4.34',
			Unit: 'μIU/mL',
		},
	]
};

module.exports = {

  'GET /api/ssm/client/outpatient/loadCaseHistoryRecords': function (req, res) {
    setTimeout(function () {
      res.json({
        success: true,
        result: caseHistoryRecords,
      });
    }, 10);
  },

  'GET /api/ssm/client/outpatient/loadCaseHistory': function (req, res) {
    setTimeout(function () {
      res.json({
        success: true,
        result: {},
      });
    }, 10);
  },

  'GET /api/ssm/client/outpatient/loadCheckRecords': function (req, res) {
    setTimeout(function () {
      res.json({
        success: true,
        result: checkRecords,
      });
    }, 10);
  },

  'GET /api/ssm/client/outpatient/loadCheckInfo': function (req, res) {
    setTimeout(function () {
      res.json({
        success: true,
        result: checkInfo,
      });
    }, 10);
  },

};



