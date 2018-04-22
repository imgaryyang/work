'use strict';

var dailyBill = {
  InpatientId: '15',
  BedNo: '005',
  PatientId: '02993030',
  PatientName: '王洁实',
  AdmissionDate: '2017-02-01',
  BillDate: '2017-02-10',
  FeeType: '001',
  FeeTypeName: '自费',
  items: [
    {
      ItemId: '001',
      ItemName: '普通病房床位费',
      Price: 44,
      Count: 1,
      Amt: 44,
    },
    {
      ItemId: '002',
      ItemName: '病房空调费',
      Price: 12,
      Count: 1,
      Amt: 12,
    },
    {
      ItemId: '003',
      ItemName: '导尿',
      Price: 12,
      Count: 1,
      Amt: 12,
    },
    {
      ItemId: '004',
      ItemName: '动脉采血',
      Price: 5.9,
      Count: 1,
      Amt: 5.9,
    },
    {
      ItemId: '005',
      ItemName: '住院诊查费',
      Price: 14,
      Count: 1,
      Amt: 14,
    },
    {
      ItemId: '006',
      ItemName: '敷贴X（小儿科）',
      Price: 2.95,
      Count: 1,
      Amt: 2.95,
    },
  ]
}

var inpatientBill = {
  InpatientId: '15', //住院号
  BedArea: '02', //病区
  BedNo: '005', //床位号
  PatientId: '02993030', //患者id
  PatientName: '王洁实', //患者姓名
  AdmissionDate: '2017-02-01', //入院日期
  BillStartDate: '2017-02-01', //费用开始日期
  BillEndDate: '2017-02-09', //费用结束日期
  FeeType: '001',
  FeeTypeName: '自费',
  TotalAmt: 990.86, //总金额
  TotalSelfPaid: 990.86, //总自付金额
  TotalBookAmt: 0.00, //总记账金额
  TotalReductionAmt: 0.00, //总减免金额
  items: [
    {
      FeeType: '01',
      FeeTypeName: '材料费',
      TotalAmt: 2.95,
      TotalSelfPaid: 2.95,
      items: [
        {
          TypeCode: '',
          TypeName: '甲类',
          ItemId: '006',
          ItemName: '敷贴X（小儿科）',
          Price: 2.95,
          Count: 1,
          Amt: 2.95,
          SelfPaid: 2.95,
          BookAmt: 0.00,
          ReductionAmt: 0.00,
        },
      ]
    },
    {
      FeeType: '02',
      FeeTypeName: '床位费',
      TotalAmt: 484.00,
      TotalSelfPaid: 484.00,
      items: [
        {
          TypeCode: '11090000100',
          TypeName: '甲类',
          ItemId: '001',
          ItemName: '普通病房床位费',
          Price: 44.00,
          Count: 11,
          Amt: 484.00,
          SelfPaid: 484.00,
          BookAmt: 0.00,
          ReductionAmt: 0.00,
        },
      ]
    },
    {
      FeeType: '03',
      FeeTypeName: '护理费',
      TotalAmt: 192.00,
      TotalSelfPaid: 192.00,
      items: [
        {
          TypeCode: '12010000300',
          TypeName: '甲类',
          ItemId: '001',
          ItemName: '等级护理',
          Price: 18.00,
          Count: 12,
          Amt: 192.00,
          SelfPaid: 192.00,
          BookAmt: 0.00,
          ReductionAmt: 0.00,
        },
      ]
    },
    {
      FeeType: '04',
      FeeTypeName: '诊察费',
      TotalAmt: 154.00,
      TotalSelfPaid: 154.00,
      items: [
        {
          TypeCode: '11020000501',
          TypeName: '甲类',
          ItemId: '005',
          ItemName: '住院诊查费',
          Price: 14.00,
          Count: 11,
          Amt: 154.00,
          SelfPaid: 154.00,
          BookAmt: 0.00,
          ReductionAmt: 0.00,
        },
      ]
    },
    {
      FeeType: '05',
      FeeTypeName: '治疗费',
      TotalAmt: 25.90,
      TotalSelfPaid: 25.90,
      items: [
        {
          TypeCode: '12160000100',
          TypeName: '甲类',
          ItemId: '003',
          ItemName: '导尿',
          Price: 12.00,
          Count: 1,
          Amt: 12.00,
          SelfPaid: 12.00,
          BookAmt: 0.00,
          ReductionAmt: 0.00,
        },
        {
          TypeCode: '12040000400',
          TypeName: '甲类',
          ItemId: '004',
          ItemName: '动脉采血',
          Price: 5.90,
          Count: 1,
          Amt: 5.90,
          SelfPaid: 5.90,
          BookAmt: 0.00,
          ReductionAmt: 0.00,
        },
        {
          TypeCode: '12010001300',
          TypeName: '甲类',
          ItemId: '004',
          ItemName: '动静脉置管护理',
          Price: 8.00,
          Count: 1,
          Amt: 8.00,
          SelfPaid: 8.00,
          BookAmt: 0.00,
          ReductionAmt: 0.00,
        },
      ]
    },
    {
      FeeType: '06',
      FeeTypeName: '其他',
      TotalAmt: 132.00,
      TotalSelfPaid: 132.00,
      items: [
        {
          TypeCode: '11070000100',
          TypeName: '自费',
          ItemId: '002',
          ItemName: '病房空调费',
          Price: 18.00,
          Count: 11,
          Amt: 132.00,
          SelfPaid: 132.00,
          BookAmt: 0.00,
          ReductionAmt: 0.00,
        },
      ]
    },
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