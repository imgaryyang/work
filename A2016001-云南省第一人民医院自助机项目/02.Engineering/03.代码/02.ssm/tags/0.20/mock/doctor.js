'use strict';

var doctors = [
  {
    "deptId": "001001002", 
    "deptName": "物理康复", 
    "doctorId": "0001", 
    "doctorName": "蒋建光", 
    "gender": "1", 
    "jobTitleId": "001", 
    "jobTitle": "主任医师", 
    "shortPinYin": "JJG"
  }, 
  {
    "deptId": "001001002", 
    "deptName": "物理康复", 
    "doctorId": "0002", 
    "doctorName": "徐宏", 
    "gender": "1", 
    "jobTitleId": "002", 
    "jobTitle": "副主任医师", 
    "shortPinYin": "XH"
  }, 
  {
    "deptId": "001001002", 
    "deptName": "物理康复", 
    "doctorId": "0003", 
    "doctorName": "张晓", 
    "gender": "1", 
    "jobTitleId": "001", 
    "jobTitle": "主任医师", 
    "shortPinYin": "ZX"
  }, 
  {
    "deptId": "001001002", 
    "deptName": "物理康复", 
    "doctorId": "0004", 
    "doctorName": "王刘桑", 
    "gender": "1", 
    "jobTitleId": "001", 
    "jobTitle": "主任医师", 
    "shortPinYin": "WLS"
  }, 
  {
    "deptId": "001001002", 
    "deptName": "物理康复", 
    "doctorId": "0005", 
    "doctorName": "王睫茹", 
    "gender": "1", 
    "jobTitleId": "003", 
    "jobTitle": "主治医师", 
    "shortPinYin": "WJR"
  }, 
  {
    "deptId": "001001002", 
    "deptName": "物理康复", 
    "doctorId": "0006", 
    "doctorName": "张青", 
    "gender": "1", 
    "jobTitleId": "003", 
    "jobTitle": "主治医师", 
    "shortPinYin": "ZQ"
  }
];

module.exports = {

  'GET /api/ssm/client/doctor/list': function (req, res) {
  	
    setTimeout(function () {
      res.json({
        success: true,
        result: doctors,
      });
    }, 200);
  },
  
};
