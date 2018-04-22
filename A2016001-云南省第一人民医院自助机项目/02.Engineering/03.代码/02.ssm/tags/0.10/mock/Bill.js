'use strict';

var bills = [
];

var needPay = [
  {
    PrescriptionId: '201601000001',
    PrescriptionDate: '2017-01-20 11:00',
    DeptId: '001001002',
    DeptName: '物理康复',
    DoctorId: '0001',
    DoctorName: '蒋建光',
    TypeId: '01',
    TypeName: '西药费',
    TotalAmt: 79.40,
    PrescriptionItems: [
      {
        Index: 1,
        TypeId: '01',
        TypeName: '西药费',
        ItemName: '雷尼替丁',
        Count: 2,
        Price: 23.00,
        TotalAmt: 46.00,
      },
      {
        Index: 2,
        TypeId: '01',
        TypeName: '西药费',
        ItemName: '茶苯海明片',
        Count: 1,
        Price: 3.40,
        TotalAmt: 3.40,
      },
      {
        Index: 3,
        TypeId: '01',
        TypeName: '西药费',
        ItemName: '百忧解',
        Count: 3,
        Price: 10.00,
        TotalAmt: 30.00,
      },
    ]
  },
  {
    PrescriptionId: '201601000002',
    PrescriptionDate: '2017-01-20 11:00',
    DeptId: '001001002',
    DeptName: '物理康复',
    DoctorId: '0001',
    DoctorName: '蒋建光',
    TypeId: '02',
    TypeName: '中药费',
    TotalAmt: 47.00,
    PrescriptionItems: [
      {
        Index: 1,
        TypeId: '02',
        TypeName: '中药费',
        ItemName: '蒲公英饮片',
        Count: 2,
        Price: 12.00,
        TotalAmt: 24.00,
      },
      {
        Index: 2,
        TypeId: '02',
        TypeName: '中药费',
        ItemName: '六味地黄丸',
        Count: 1,
        Price: 23.00,
        TotalAmt: 23.00,
      },
    ]
  },
  {
    PrescriptionId: '201601000003',
    PrescriptionDate: '2017-01-20 11:05',
    DeptId: '001001002',
    DeptName: '物理康复',
    DoctorId: '0001',
    DoctorName: '蒋建光',
    TypeId: '03',
    TypeName: '检验费',
    TotalAmt: 113.00,
    PrescriptionItems: [
      {
        Index: 1,
        TypeId: '03',
        TypeName: '检验费',
        ItemName: '肝功能',
        Count: 1,
        Price: 45.00,
        TotalAmt: 45.00,
      },
      {
        Index: 2,
        TypeId: '03',
        TypeName: '检验费',
        ItemName: '甲功三项',
        Count: 1,
        Price: 68.00,
        TotalAmt: 68.00,
      },
    ]
  },
  {
    PrescriptionId: '201601000004',
    PrescriptionDate: '2017-01-20 11:05',
    DeptId: '001001002',
    DeptName: '物理康复',
    DoctorId: '0001',
    DoctorName: '蒋建光',
    TypeId: '03',
    TypeName: '检验费',
    TotalAmt: 688.00,
    PrescriptionItems: [
      {
        Index: 1,
        TypeId: '03',
        TypeName: '检验费',
        ItemName: '癌症筛查',
        Count: 1,
        Price: 688.00,
        TotalAmt: 688.00,
      },
    ]
  },
];

module.exports = {

  'GET /api/ssm/client/bill/loadBillList': function (req, res) {
    setTimeout(function () {
      res.json({
        success: true,
        result: bills,
      });
    }, 500);
  },

  'GET /api/ssm/client/bill/loadNeedPayBills': function (req, res) {
    setTimeout(function () {
      res.json({
        success: true,
        result: needPay,
      });
    }, 500);
  },
  
};




