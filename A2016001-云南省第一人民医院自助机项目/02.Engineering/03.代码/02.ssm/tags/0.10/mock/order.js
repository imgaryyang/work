'use strict';
var moment = require('moment');

var orders = [
  {
    Id: '0000000000001',
    OrderCode: 'PPC20170123000001',
    OrderType: '0',
    OrderTypeName: '预存',
    OrderType1: '',
    OrderTypeName1: '',
    OrderDesc: '现金预存',
    Amt: 100,
    CreatedDate: '2017-01-01 09:34',
    MIPaid: null, 
    PAPaid: null, 
    SelfPaid: 100, 
    PaidType: '10',
    PaidTypeName: '现金',
    PaidDate: '2017-01-01 09:34', 
    State: '2',
    Settlements: [{
      Id: 'STMT00001',
      SettlementCode: 'STMT00001',
      PaidType: '10',
      PaidTypeName: '现金',
      Amt: 100,
      CreatedDate: '2017-01-01 09:34',
      PaidDate: '2017-01-01 09:34',
      State: '2',
      Desc: '',
    }]
  },
  {
    Id: '0000000000002',
    OrderCode: 'PPC20170123000002',
    OrderType: '0',
    OrderTypeName: '预存',
    OrderType1: '',
    OrderTypeName1: '',
    OrderDesc: '银行卡预存',
    Amt: 100,
    CreatedDate: '2017-01-01 09:30',
    MIPaid: null, 
    PAPaid: null, 
    SelfPaid: 100, 
    PaidType: '20',
    PaidTypeName: '银联',
    PaidDate: '2017-01-01 09:30', 
    State: '2',
    Settlements: [{
      Id: 'STMT00002',
      SettlementCode: 'STMT00002',
      PaidType: '20',
      PaidTypeName: '银联',
      Amt: 100,
      CreatedDate: '2017-01-01 09:30',
      PaidDate: '2017-01-01 09:30',
      State: '2',
      Desc: '工商银行（****5789）',
    }]
  },
  {
    Id: '0000000000003',
    OrderCode: 'PPC20170123000003',
    OrderType: '3',
    OrderTypeName: '缴费',
    OrderType1: '',
    OrderTypeName1: '',
    OrderDesc: '支付宝缴费',
    Amt: 100,
    CreatedDate: '2016-12-16 15:01',
    MIPaid: null, 
    PAPaid: null, 
    SelfPaid: 32.30, 
    PaidType: '32',
    PaidTypeName: '支付宝',
    PaidDate: '2016-12-16 15:01', 
    State: '2',
    Settlements: [{
      Id: 'STMT00003',
      SettlementCode: 'STMT00003',
      PaidType: '32',
      PaidTypeName: '支付宝',
      Amt: 32.30,
      CreatedDate: '2016-12-16 15:01',
      PaidDate: '2016-12-16 15:01',
      State: '2',
      Desc: '支付宝账户（****vic）',
    }]
  },
  {
    Id: '0000000000004',
    OrderCode: 'PPC20170123000004',
    OrderType: '3',
    OrderTypeName: '缴费',
    OrderType1: '',
    OrderTypeName1: '',
    OrderDesc: '支付宝缴费',
    Amt: 100,
    CreatedDate: '2016-12-15 09:30',
    MIPaid: null, 
    PAPaid: null, 
    SelfPaid: 21, 
    PaidType: '20',
    PaidTypeName: '银联',
    PaidDate: '2016-12-15 09:30', 
    State: '2',
    Settlements: [{
      Id: 'STMT00004',
      SettlementCode: 'STMT00004',
      PaidType: '20',
      PaidTypeName: '银联',
      Amt: 21,
      CreatedDate: '2016-12-15 09:30',
      PaidDate: '2016-12-15 09:30',
      State: '2',
      Desc: '招商银行（****0001）',
    }]
  },
  {
    Id: '0000000000005',
    OrderCode: 'PPC20170123000005',
    OrderType: '2',
    OrderTypeName: '挂号',
    OrderType1: '',
    OrderTypeName1: '',
    OrderDesc: '挂号缴费',
    Amt: 12,
    CreatedDate: '2016-12-15 13:36',
    MIPaid: null, 
    PAPaid: null, 
    SelfPaid: 3.5, 
    PaidType: '00',
    PaidTypeName: '就诊卡虚拟账户',
    PaidDate: '2016-12-15 13:36', 
    State: '2',
    Settlements: [{
      Id: 'STMT00005',
      SettlementCode: 'STMT00005',
      PaidType: '00',
      PaidTypeName: '就诊卡虚拟账户',
      Amt: 3.5,
      CreatedDate: '2016-12-15 13:36',
      PaidDate: '2016-12-15 13:36',
      State: '2',
      Desc: '就诊卡虚拟账户支付',
    }]
  },
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

var prepaidCashOrderInit = {
  Id: '0000000000001',
  OrderCode: 'PPC20170123000001',
  OrderType: '0',
  OrderTypeName: '预存',
  OrderType1: '',
  OrderTypeName1: '',
  OrderDesc: '现金预存',
  Amt: 0,
  CreatedDate: moment(new Date()).format('YYYY-MM-DD HH:mm:ss SSS'),
  MIPaid: null, 
  PAPaid: null, 
  SelfPaid: null, 
  PaidType: '10',
  PaidTypeName: '现金',
  PaidDate: '', 
  State: '2',
  Settlements: []
}

var prepaidCashSettlementInit = {
  Id: '',
  SettlementCode: '',
  PaidType: '10',
  PaidTypeName: '现金',
  Amt: 0,
  CreatedDate: moment(new Date()).format('YYYY-MM-DD HH:mm:ss SSS'),
  PaidDate: moment(new Date()).format('YYYY-MM-DD HH:mm:ss SSS'),
  State: '2',
}

var prepaidOrderInit = {
  Id: '0000000000003',
  OrderCode: 'PPC20170123000003',
  OrderType: '0',
  OrderTypeName: '预存',
  OrderType1: '',
  OrderTypeName1: '',
  OrderDesc: '',
  Amt: 0,
  CreatedDate: moment(new Date()).format('YYYY-MM-DD HH:mm:ss SSS'),
  MIPaid: null, 
  PAPaid: null, 
  SelfPaid: null, 
  PaidType: '',
  PaidTypeName: '',
  PaidDate: '', 
  State: '1',
  Settlements: []
}

var prepaidSettlementInit = {
  Id: '',
  SettlementCode: '',
  PaidType: '',
  PaidTypeName: '',
  Amt: 0,
  CreatedDate: moment(new Date()).format('YYYY-MM-DD HH:mm:ss SSS'),
  PaidDate: '',
  State: '1',
}


var inpatientPrepaidOrderInit = {
  Id: '0000000000005',
  OrderCode: 'PPC20170123000005',
  OrderType: '4',
  OrderTypeName: '住院预缴',
  OrderType1: '',
  OrderTypeName1: '',
  OrderDesc: '',
  Amt: 0,
  CreatedDate: moment(new Date()).format('YYYY-MM-DD HH:mm:ss SSS'),
  MIPaid: null, 
  PAPaid: null, 
  SelfPaid: null, 
  PaidType: '',
  PaidTypeName: '',
  PaidDate: '', 
  State: '1',
  Settlements: []
}

var inpatientPrepaidSettlementInit = {
  Id: '',
  SettlementCode: '',
  PaidType: '',
  PaidTypeName: '',
  Amt: 0,
  CreatedDate: moment(new Date()).format('YYYY-MM-DD HH:mm:ss SSS'),
  PaidDate: '',
  State: '1',
}


var orderInit = {
  Id: '0000000000000',
  OrderCode: 'PPC20170123000000',
  OrderType: '3',
  OrderTypeName: '缴费',
  OrderType1: '',
  OrderTypeName1: '',
  OrderDesc: '',
  Amt: 0,
  CreatedDate: moment(new Date()).format('YYYY-MM-DD HH:mm:ss SSS'),
  MIPaid: null, 
  PAPaid: null, 
  SelfPaid: null, 
  PaidType: '',
  PaidTypeName: '',
  PaidDate: '', 
  State: '1',
  Settlements: []
}

function settlementInit () {
  return {
    Id: '',
    SettlementCode: '',
    PaidType: '',
    PaidTypeName: '',
    Amt: 0,
    CreatedDate: moment(new Date()).format('YYYY-MM-DD HH:mm:ss SSS'),
    PaidDate: '',
    State: '1',
  }
}

module.exports = {

  'GET /api/ssm/client/order/loadOrderList': function (req, res) {
    setTimeout(function () {
      res.json({
        success: true,
        result: orders,
      });
    }, 10);
  },

  /************ 预存 ***************/

  //现金预存
  'GET /api/ssm/client/prepaid/cash': function (req, res) {

    console.log('mock /api/ssm/client/prepaid/cash');
    console.log('req.query:', req.query);

    var prepaidCashOrder = null;

    const {OrderId, Amt, count} = req.query;

    if (!OrderId) {
      prepaidCashOrder = prepaidCashOrderInit;
    }

    prepaidCashOrder.Amt += count * parseFloat(Amt);

    for (let i = 0 ; i < count ; i++) {
      let settlement = prepaidCashSettlementInit;
      settlement.Id = '0000000' + (i + 1);
      settlement.SettlementCode = '0000000' + (i + 1);
      settlement.Amt += parseFloat(Amt);
      prepaidCashOrder.Settlements.push(settlement);
      prepaidCashOrder.PaidDate = moment(new Date()).format('YYYY-MM-DD HH:mm:ss SSS');
    }


    setTimeout(function () {
      res.json({
        success: true,
        result: prepaidCashOrder,
      });
    }, 10);
  },

  //其它渠道预存
  'GET /api/ssm/client/prepaid/other': function (req, res) {

    console.log('mock /api/ssm/client/prepaid/other');
    console.log('req.query:', req.query);

    var order = prepaidOrderInit;

    const {Amt, PaidType} = req.query;

    order.Amt += parseFloat(Amt);

    let settlement = prepaidSettlementInit;
    settlement.Id = '00000001';
    settlement.SettlementCode = '00000001';
    settlement.Amt += parseFloat(Amt);

    if (PaidType == '20') {
      order.OrderDesc += '银行卡预存';
      order.PaidType = PaidType;
      order.PaidTypeName = '银联';

      settlement.PaidType = PaidType;
      settlement.PaidTypeName = '银联';
    } else {
      order.OrderDesc += '支付宝/微信预存';
      order.PaidType = PaidType;
      order.PaidTypeName = '支付宝/微信';

      settlement.PaidType = PaidType;
      settlement.PaidTypeName = '支付宝/微信';
    }
    order.Settlements.push(settlement);


    setTimeout(function () {
      res.json({
        success: true,
        result: order,
      });
    }, 10);
  },
  

  /************ 住院预缴 ***************/

  //住院预缴
  'GET /api/ssm/client/inpatient/prepaid': function (req, res) {

    console.log('mock /api/ssm/client/inpatient/prepaid');
    console.log('req.query:', req.query);

    var order = inpatientPrepaidOrderInit;

    const {Amt, PaidType} = req.query;

    order.Amt += parseFloat(Amt);

    let settlement = inpatientPrepaidSettlementInit;
    settlement.Id = '00000001';
    settlement.SettlementCode = '00000001';
    settlement.Amt += parseFloat(Amt);

    if (PaidType == '00') {
      order.OrderDesc += '就诊卡虚拟账户转住院预缴';
      order.PaidType = PaidType;
      order.PaidTypeName = '就诊卡虚拟账户';

      settlement.PaidType = PaidType;
      settlement.PaidTypeName = '就诊卡虚拟账户';

    } else if (PaidType == '20') {
      order.OrderDesc += '银行卡住院预缴';
      order.PaidType = PaidType;
      order.PaidTypeName = '银联';

      settlement.PaidType = PaidType;
      settlement.PaidTypeName = '银联';

    } else {
      order.OrderDesc += '支付宝/微信住院预缴';
      order.PaidType = PaidType;
      order.PaidTypeName = '支付宝/微信';

      settlement.PaidType = PaidType;
      settlement.PaidTypeName = '支付宝/微信';

    }
    order.Settlements.push(settlement);


    setTimeout(function () {
      res.json({
        success: true,
        result: order,
      });
    }, 10);
  },


  /************ 缴费 ***************/

  'GET /api/ssm/client/order/loadNeedPay': function (req, res) {
    setTimeout(function () {
      res.json({
        success: true,
        result: needPay,
      });
    }, 50);
  },

  //医保预结算
  'GET /api/ssm/client/mi/preSettlement': function (req, res) {

    console.log('mock /api/ssm/client/mi/preSettlement');

    let {Amt} = req.query;
    Amt = parseFloat(Amt);

    let miPreSettlement = {};
    miPreSettlement['Amt']      = Amt;
    miPreSettlement['MIPay']    = Amt * 70 / 100;
    miPreSettlement['PAPay']    = 12;
    miPreSettlement['SelfPay']  = Amt * 30 / 100 - 12;

    setTimeout(function () {
      res.json({
        success: true,
        result: miPreSettlement,
      });
    }, 10);
  },

  //医保结算
  'GET /api/ssm/client/mi/settlement': function (req, res) {

    console.log('mock /api/ssm/client/mi/settlement');

    setTimeout(function () {
      res.json({
        success: true,
        result: order,
      });
    }, 10);
  },

  //余额账户支付
  'GET /api/ssm/client/order/accountPay': function (req, res) {

    console.log('mock /api/ssm/client/order/accountPay');
    console.log('req.query:', req.query);

    var order = orderInit;

    const {Amt, type} = req.query;

    order.Amt += parseFloat(Amt);
    order.PaidType = '00';
    order.PaidTypeName = '就诊卡虚拟账户';
    order.State = '2';

    let miPaid    = parseFloat(Amt) * .7, 
        paPaid    = 12, 
        selfPaid  = parseFloat(Amt) * .3 - paPaid;

    let MIsettlement = new settlementInit();
    MIsettlement.Id = '00000001';
    MIsettlement.SettlementCode = '00000001';
    MIsettlement.Amt = miPaid;
    MIsettlement.PaidType = 'MI';
    MIsettlement.PaidTypeName = '医保报销';
    MIsettlement.State = '2';
    order.MIPaid = miPaid;
    order.Settlements.push(MIsettlement);

    let PAsettlement = new settlementInit();
    PAsettlement.Id = '00000002';
    PAsettlement.SettlementCode = '00000002';
    PAsettlement.Amt = paPaid;
    PAsettlement.PaidType = 'PA';
    PAsettlement.PaidTypeName = '医保个人账户';
    PAsettlement.State = '2';
    order.PAPaid = paPaid;
    order.Settlements.push(PAsettlement);

    let settlement = new settlementInit();
    settlement.Id = '00000003';
    settlement.SettlementCode = '00000003';
    settlement.Amt = selfPaid;
    settlement.PaidType = '00';
    settlement.PaidTypeName = '就诊卡虚拟账户';
    settlement.State = '2';
    order.SelfPaid = selfPaid;
    order.Settlements.push(settlement);

    setTimeout(function () {
      res.json({
        success: true,
        result: order,
      });
    }, 10);
  },

  //去结算
  'GET /api/ssm/client/order/pay': function (req, res) {

    console.log('mock /api/ssm/client/order/pay');
    console.log('req.query:', req.query);

    var order = orderInit;

    const {Amt, type, typeName} = req.query;

    order.Amt += parseFloat(Amt);
    order.PaidType = type;
    order.PaidTypeName = typeName;

    let miPaid    = parseFloat(Amt) * .7, 
        paPaid    = 12, 
        selfPaid  = parseFloat(Amt) * .3 - paPaid;

    let MIsettlement = new settlementInit();
    MIsettlement.Id = '00000001';
    MIsettlement.SettlementCode = '00000001';
    MIsettlement.Amt = miPaid;
    MIsettlement.PaidType = 'MI';
    MIsettlement.PaidTypeName = '医保报销';
    order.MIPaid = miPaid;
    order.Settlements.push(MIsettlement);

    let PAsettlement = new settlementInit();
    PAsettlement.Id = '00000002';
    PAsettlement.SettlementCode = '00000002';
    PAsettlement.Amt = paPaid;
    PAsettlement.PaidType = 'PA';
    PAsettlement.PaidTypeName = '医保个人账户';
    order.PAPaid = paPaid;
    order.Settlements.push(PAsettlement);

    let settlement = new settlementInit();
    settlement.Id = '00000003';
    settlement.SettlementCode = '00000003';
    settlement.Amt = selfPaid;
    settlement.PaidType = type;
    settlement.PaidTypeName = typeName;
    order.SelfPaid = selfPaid;
    order.Settlements.push(settlement);

    setTimeout(function () {
      res.json({
        success: true,
        result: order,
      });
    }, 10);
  },

  //支付完成
  'GET /api/ssm/client/order/paid': function (req, res) {
    setTimeout(function () {
      res.json({
        success: true,
      });
    }, 10);
  },

};




