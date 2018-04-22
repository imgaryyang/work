'use strict';
var moment = require('moment');

var caseHistoryRecords = [
  {
    "id": "00000001", 
    "treatmentDate": "2017-01-03 13:35", 
    "deptId": "001001002", 
    "deptName": "物理康复", 
    "doctorId": "0001", 
    "doctorName": "蒋建光", 
    "jobTitleId": "001", 
    "jobTitle": "主任医师", 
    "printTimes": 0
  }, 
  {
    "id": "00000002", 
    "treatmentDate": "2017-01-02 09:00", 
    "deptId": "001001002", 
    "deptName": "物理康复", 
    "doctorId": "0001", 
    "doctorName": "蒋建光", 
    "jobTitleId": "001", 
    "jobTitle": "主任医师", 
    "printTimes": 0
  }, 
  {
    "id": "00000003", 
    "treatmentDate": "2016-12-25 10:25", 
    "deptId": "001001003", 
    "deptName": "内分泌科", 
    "doctorId": "0006", 
    "doctorName": "白洁", 
    "jobTitleId": "003", 
    "jobTitle": "副主任医师", 
    "printTimes": 1
  }, 
  {
    "id": "00000004", 
    "treatmentDate": "2016-12-12 11:00", 
    "deptId": "001001003", 
    "deptName": "内分泌科", 
    "doctorId": "0006", 
    "doctorName": "白洁", 
    "jobTitleId": "003", 
    "jobTitle": "副主任医师", 
    "printTimes": 1
  }, 
  {
    "id": "00000005", 
    "treatmentDate": "2016-12-01 08:46", 
    "deptId": "001001009", 
    "deptName": "肛肠科", 
    "doctorId": "0009", 
    "doctorName": "徐寅同", 
    "jobTitleId": "001", 
    "jobTitle": "主任医师", 
    "printTimes": 1
  }
];

var checkRecords = [
  {
    "id": "00000001", 
    "requestDate": "2017-01-03 13:35", 
    "checkType": "02", 
    "checkTypeName": "血常规", 
    "deptId": "001001002", 
    "deptName": "物理康复", 
    "doctorId": "0001", 
    "doctorName": "蒋建光", 
    "jobTitleId": "001", 
    "jobTitle": "主任医师", 
    "state": "0", 
    "printTimes": 0
  }, 
  {
    "id": "00000002", 
    "requestDate": "2017-01-02 09:00", 
    "checkType": "02", 
    "checkTypeName": "血常规", 
    "deptId": "001001002", 
    "deptName": "物理康复", 
    "doctorId": "0001", 
    "doctorName": "蒋建光", 
    "jobTitleId": "001", 
    "jobTitle": "主任医师", 
    "state": "1", 
    "printTimes": 0
  }, 
  {
    "id": "00000003", 
    "requestDate": "2016-12-25 10:25", 
    "checkType": "01", 
    "checkTypeName": "甲功三项", 
    "deptId": "001001003", 
    "deptName": "内分泌科", 
    "doctorId": "0006", 
    "doctorName": "白洁", 
    "jobTitleId": "003", 
    "jobTitle": "副主任医师", 
    "state": "2", 
    "printTimes": 1
  }, 
  {
    "id": "00000004", 
    "requestDate": "2016-12-12 11:00", 
    "checkType": "01", 
    "checkTypeName": "甲功三项", 
    "deptId": "001001003", 
    "deptName": "内分泌科", 
    "doctorId": "0006", 
    "doctorName": "白洁", 
    "jobTitleId": "003", 
    "jobTitle": "副主任医师", 
    "state": "2", 
    "printTimes": 1
  }, 
  {
    "id": "00000005", 
    "requestDate": "2016-12-01 08:46", 
    "checkType": "03", 
    "checkTypeName": "肝功", 
    "deptId": "001001009", 
    "deptName": "肛肠科", 
    "doctorId": "0009", 
    "doctorName": "徐寅同", 
    "jobTitleId": "001", 
    "jobTitle": "主任医师", 
    "state": "2", 
    "printTimes": 1
  }
];

var checkInfo = {
  "checkId": "00000005", 
  "patientId": "00001", 
  "patientName": "王玉杰", 
  "requestDate": "2016-12-01 08:46", 
  "checkType": "03", 
  "checkTypeName": "甲功三项", 
  "requestDeptId": "001001009", 
  "requestDeptName": "内分泌科", 
  "requestDoctorId": "0009", 
  "requestDoctorName": "徐寅同", 
  "jobTitleId": "001", 
  "jobTitle": "主任医师", 
  "receiveDate": "2016-12-01 08:55", 
  "specimenType": "01", 
  "specimenTypeName": "血", 
  "checkDoctorId": "D00005", 
  "checkDoctorName": "卢玉双", 
  "checkDate": "2016-12-02 12:00", 
  "state": "2", 
  "printTimes": 1, 
  "items": [
    {
      "index": 0, 
      "item": "游离三碘甲状腺氨酸", 
      "result": "1.53", 
      "state": "3", 
      "range": "1.80 - 4.10", 
      "unit": "pg/ml"
    }, 
    {
      "index": 1, 
      "item": "游离甲状腺素", 
      "result": "0.376", 
      "state": "3", 
      "range": "0.81 - 1.89", 
      "unit": "ng/dl"
    }, 
    {
      "index": 2, 
      "item": "三碘甲状腺原氨酸", 
      "result": "0.484", 
      "state": "3", 
      "range": "0.66 - 1.92", 
      "unit": "ng/ml"
    }, 
    {
      "index": 3, 
      "item": "甲状腺素", 
      "result": "2.13", 
      "state": "3", 
      "range": "4.30 - 12.50", 
      "unit": "μg/ml"
    }, 
    {
      "index": 4, 
      "item": "促甲状腺激素", 
      "result": "85.120", 
      "state": "2", 
      "range": "0.38 - 4.34", 
      "unit": "μIU/mL"
    }
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



