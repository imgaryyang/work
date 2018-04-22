'use strict';

var dailyBill = {
  "inpatientId": "15", 
  "bedNo": "005", 
  "patientId": "02993030", 
  "patientName": "王洁实", 
  "admissionDate": "2017-02-01", 
  "BillDate": "2017-02-10", 
  "feeType": "001", 
  "feeTypeName": "自费", 
  "items": [
    {
      "itemId": "001", 
      "itemName": "普通病房床位费", 
      "price": 44, 
      "count": 1, 
      "amt": 44
    }, 
    {
      "itemId": "002", 
      "itemName": "病房空调费", 
      "price": 12, 
      "count": 1, 
      "amt": 12
    }, 
    {
      "itemId": "003", 
      "itemName": "导尿", 
      "price": 12, 
      "count": 1, 
      "amt": 12
    }, 
    {
      "itemId": "004", 
      "itemName": "动脉采血", 
      "price": 5.9, 
      "count": 1, 
      "amt": 5.9
    }, 
    {
      "itemId": "005", 
      "itemName": "住院诊查费", 
      "price": 14, 
      "count": 1, 
      "amt": 14
    }, 
    {
      "itemId": "006", 
      "itemName": "敷贴X（小儿科）", 
      "price": 2.95, 
      "count": 1, 
      "amt": 2.95
    }
  ]
}

var inpatientBill = {
  "inpatientId": "15", 
  "bedArea": "02", 
  "bedNo": "005", 
  "patientId": "02993030", 
  "patientName": "王洁实", 
  "admissionDate": "2017-02-01", 
  "billStartDate": "2017-02-01", 
  "billEndDate": "2017-02-09", 
  "feeType": "001", 
  "feeTypeName": "自费", 
  "totalAmt": 990.86, 
  "totalSelfPaid": 990.86, 
  "TotalBookAmt": 0, 
  "TotalReductionAmt": 0, 
  "items": [
    {
      "feeType": "01", 
      "feeTypeName": "材料费", 
      "totalAmt": 2.95, 
      "totalSelfPaid": 2.95, 
      "items": [
        {
          "typeCode": "", 
          "typeName": "甲类", 
          "itemId": "006", 
          "itemName": "敷贴X（小儿科）", 
          "price": 2.95, 
          "count": 1, 
          "amt": 2.95, 
          "selfPaid": 2.95, 
          "bookAmt": 0, 
          "reductionAmt": 0
        }
      ]
    }, 
    {
      "feeType": "02", 
      "feeTypeName": "床位费", 
      "totalAmt": 484, 
      "totalSelfPaid": 484, 
      "items": [
        {
          "typeCode": "11090000100", 
          "typeName": "甲类", 
          "itemId": "001", 
          "itemName": "普通病房床位费", 
          "price": 44, 
          "count": 11, 
          "amt": 484, 
          "selfPaid": 484, 
          "bookAmt": 0, 
          "reductionAmt": 0
        }
      ]
    }, 
    {
      "feeType": "03", 
      "feeTypeName": "护理费", 
      "totalAmt": 192, 
      "totalSelfPaid": 192, 
      "items": [
        {
          "typeCode": "12010000300", 
          "typeName": "甲类", 
          "itemId": "001", 
          "itemName": "等级护理", 
          "price": 18, 
          "count": 12, 
          "amt": 192, 
          "selfPaid": 192, 
          "bookAmt": 0, 
          "reductionAmt": 0
        }
      ]
    }, 
    {
      "feeType": "04", 
      "feeTypeName": "诊察费", 
      "totalAmt": 154, 
      "totalSelfPaid": 154, 
      "items": [
        {
          "typeCode": "11020000501", 
          "typeName": "甲类", 
          "itemId": "005", 
          "itemName": "住院诊查费", 
          "price": 14, 
          "count": 11, 
          "amt": 154, 
          "selfPaid": 154, 
          "bookAmt": 0, 
          "reductionAmt": 0
        }
      ]
    }, 
    {
      "feeType": "05", 
      "feeTypeName": "治疗费", 
      "totalAmt": 25.9, 
      "totalSelfPaid": 25.9, 
      "items": [
        {
          "typeCode": "12160000100", 
          "typeName": "甲类", 
          "itemId": "003", 
          "itemName": "导尿", 
          "price": 12, 
          "count": 1, 
          "amt": 12, 
          "selfPaid": 12, 
          "bookAmt": 0, 
          "reductionAmt": 0
        }, 
        {
          "typeCode": "12040000400", 
          "typeName": "甲类", 
          "itemId": "004", 
          "itemName": "动脉采血", 
          "price": 5.9, 
          "count": 1, 
          "amt": 5.9, 
          "selfPaid": 5.9, 
          "bookAmt": 0, 
          "reductionAmt": 0
        }, 
        {
          "typeCode": "12010001300", 
          "typeName": "甲类", 
          "itemId": "004", 
          "itemName": "动静脉置管护理", 
          "price": 8, 
          "count": 1, 
          "amt": 8, 
          "selfPaid": 8, 
          "bookAmt": 0, 
          "reductionAmt": 0
        }
      ]
    }, 
    {
      "feeType": "06", 
      "feeTypeName": "其他", 
      "totalAmt": 132, 
      "totalSelfPaid": 132, 
      "items": [
        {
          "typeCode": "11070000100", 
          "typeName": "自费", 
          "itemId": "002", 
          "itemName": "病房空调费", 
          "price": 18, 
          "count": 11, 
          "amt": 132, 
          "selfPaid": 132, 
          "bookAmt": 0, 
          "reductionAmt": 0
        }
      ]
    }
  ]
}

module.exports = {

  'GET /api/ssm/client/inpatient/loadPrepaidBalance': function (req, res) {
  	
    setTimeout(function () {
      res.json({
        success: true,
        result: {
          PrepaidBalance: 1600.00
        },
      });
    }, 10);
  },

  'GET /api/ssm/client/inpatient/loadDailyBill': function (req, res) {
    dailyBill['BillDate'] = req.query.BillDate;
    setTimeout(function () {
      res.json({
        success: true,
        result: dailyBill,
      });
    }, 10);
  },

  'GET /api/ssm/client/inpatient/loadInpatientBill': function (req, res) {
    setTimeout(function () {
      res.json({
        success: true,
        result: inpatientBill,
      });
    }, 10);
  },
  
};