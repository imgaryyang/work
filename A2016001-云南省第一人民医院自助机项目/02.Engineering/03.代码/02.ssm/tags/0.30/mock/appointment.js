'use strict';

var apptRecords = [
  {
    "apptId": "0001", 
    "apptDate": "2017-01-15", 
    "apptTime": "09:00", 
    "dayPeriod": "am", 
    "deptId": "001001002", 
    "deptName": "物理康复", 
    "diagnosisType": "专科", 
    "doctorId": "0001", 
    "doctorName": "蒋建光", 
    "jobTitleId": "001", 
    "jobTitle": "主任医师", 
    "registeredAmount": "2000", 
    "bookNum": "18", 
    "address": "门诊楼二楼东侧外科诊室", 
    "state": "1"
  }, 
  {
    "apptId": "0002", 
    "apptDate": "2017-01-15", 
    "apptTime": "11:01", 
    "dayPeriod": "am", 
    "deptId": "001001002", 
    "deptName": "物理康复", 
    "diagnosisType": "专科", 
    "doctorId": "0001", 
    "doctorName": "蒋建光", 
    "jobTitleId": "001", 
    "jobTitle": "主任医师", 
    "registeredAmount": "2000", 
    "bookNum": "18", 
    "address": "门诊楼二楼东侧外科诊室", 
    "state": "2"
  }, 
  {
    "apptId": "0003", 
    "apptDate": "2017-01-10", 
    "apptTime": "10:25", 
    "dayPeriod": "pm", 
    "deptId": "001001002", 
    "deptName": "物理康复", 
    "diagnosisType": "专科", 
    "doctorId": "0001", 
    "doctorName": "徐宏", 
    "jobTitleId": "001", 
    "jobTitle": "主任医师", 
    "registeredAmount": "2000", 
    "bookNum": "18", 
    "address": "门诊楼二楼东侧外科诊室", 
    "state": "0"
  }, 
  {
    "apptId": "0004", 
    "apptDate": "2017-01-09", 
    "apptTime": "14:20", 
    "dayPeriod": "am", 
    "deptId": "001001002", 
    "deptName": "物理康复", 
    "diagnosisType": "专科", 
    "doctorId": "0001", 
    "doctorName": "白洁", 
    "jobTitleId": "001", 
    "jobTitle": "主治医师", 
    "registeredAmount": "2000", 
    "bookNum": "18", 
    "address": "门诊楼二楼东侧外科诊室", 
    "state": "2"
  }, 
  {
    "apptId": "0005", 
    "apptDate": "2017-01-01", 
    "apptTime": "16:00", 
    "dayPeriod": "am", 
    "deptId": "001001002", 
    "deptName": "物理康复", 
    "diagnosisType": "专科", 
    "doctorId": "0001", 
    "doctorName": "王刘桑", 
    "jobTitleId": "001", 
    "jobTitle": "主治医师", 
    "registeredAmount": "2000", 
    "bookNum": "18", 
    "address": "门诊楼二楼东侧外科诊室", 
    "state": "2"
  }
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
