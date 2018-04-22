'use strict';
var moment = require('moment');

var orders = [
  {
    "id": "0000000000001", 
    "orderCode": "PPC20170123000001", 
    "orderType": "0", 
    "orderTypeName": "预存", 
    "orderType1": "", 
    "orderTypeName1": "", 
    "orderDesc": "现金预存", 
    "amt": 100, 
    "createdDate": "2017-01-01 09:34", 
    "miPaid": null, 
    "paPaid": null, 
    "selfPaid": 100, 
    "paidType": "10", 
    "paidTypeName": "现金", 
    "paidDate": "2017-01-01 09:34", 
    "state": "2", 
    "settlements": [
      {
        "id": "STMT00001", 
        "settlementCode": "STMT00001", 
        "paidType": "10", 
        "paidTypeName": "现金", 
        "amt": 100, 
        "createdDate": "2017-01-01 09:34", 
        "paidDate": "2017-01-01 09:34", 
        "state": "2", 
        "desc": ""
      }
    ]
  }, 
  {
    "id": "0000000000002", 
    "orderCode": "PPC20170123000002", 
    "orderType": "0", 
    "orderTypeName": "预存", 
    "orderType1": "", 
    "orderTypeName1": "", 
    "orderDesc": "银行卡预存", 
    "amt": 100, 
    "createdDate": "2017-01-01 09:30", 
    "miPaid": null, 
    "paPaid": null, 
    "selfPaid": 100, 
    "paidType": "20", 
    "paidTypeName": "银联", 
    "paidDate": "2017-01-01 09:30", 
    "state": "2", 
    "settlements": [
      {
        "id": "STMT00002", 
        "settlementCode": "STMT00002", 
        "paidType": "20", 
        "paidTypeName": "银联", 
        "amt": 100, 
        "createdDate": "2017-01-01 09:30", 
        "paidDate": "2017-01-01 09:30", 
        "state": "2", 
        "desc": "工商银行（****5789）"
      }
    ]
  }, 
  {
    "id": "0000000000003", 
    "orderCode": "PPC20170123000003", 
    "orderType": "3", 
    "orderTypeName": "缴费", 
    "orderType1": "", 
    "orderTypeName1": "", 
    "orderDesc": "支付宝缴费", 
    "amt": 100, 
    "createdDate": "2016-12-16 15:01", 
    "miPaid": null, 
    "paPaid": null, 
    "selfPaid": 32.3, 
    "paidType": "32", 
    "paidTypeName": "支付宝", 
    "paidDate": "2016-12-16 15:01", 
    "state": "2", 
    "settlements": [
      {
        "id": "STMT00003", 
        "settlementCode": "STMT00003", 
        "paidType": "32", 
        "paidTypeName": "支付宝", 
        "amt": 32.3, 
        "createdDate": "2016-12-16 15:01", 
        "paidDate": "2016-12-16 15:01", 
        "state": "2", 
        "desc": "支付宝账户（****vic）"
      }
    ]
  }, 
  {
    "id": "0000000000004", 
    "orderCode": "PPC20170123000004", 
    "orderType": "3", 
    "orderTypeName": "缴费", 
    "orderType1": "", 
    "orderTypeName1": "", 
    "orderDesc": "支付宝缴费", 
    "amt": 100, 
    "createdDate": "2016-12-15 09:30", 
    "miPaid": null, 
    "paPaid": null, 
    "selfPaid": 21, 
    "paidType": "20", 
    "paidTypeName": "银联", 
    "paidDate": "2016-12-15 09:30", 
    "state": "2", 
    "settlements": [
      {
        "id": "STMT00004", 
        "settlementCode": "STMT00004", 
        "paidType": "20", 
        "paidTypeName": "银联", 
        "amt": 21, 
        "createdDate": "2016-12-15 09:30", 
        "paidDate": "2016-12-15 09:30", 
        "state": "2", 
        "desc": "招商银行（****0001）"
      }
    ]
  }, 
  {
    "id": "0000000000005", 
    "orderCode": "PPC20170123000005", 
    "orderType": "2", 
    "orderTypeName": "挂号", 
    "orderType1": "", 
    "orderTypeName1": "", 
    "orderDesc": "挂号缴费", 
    "amt": 12, 
    "createdDate": "2016-12-15 13:36", 
    "miPaid": null, 
    "paPaid": null, 
    "selfPaid": 3.5, 
    "paidType": "00", 
    "paidTypeName": "就诊卡虚拟账户", 
    "paidDate": "2016-12-15 13:36", 
    "state": "2", 
    "settlements": [
      {
        "id": "STMT00005", 
        "settlementCode": "STMT00005", 
        "paidType": "00", 
        "paidTypeName": "就诊卡虚拟账户", 
        "amt": 3.5, 
        "createdDate": "2016-12-15 13:36", 
        "paidDate": "2016-12-15 13:36", 
        "state": "2", 
        "desc": "就诊卡虚拟账户支付"
      }
    ]
  }
];


var needPay = [
  {
    "prescriptionId": "201601000001", 
    "prescriptionDate": "2017-01-20 11:00", 
    "deptId": "001001002", 
    "deptName": "物理康复", 
    "doctorId": "0001", 
    "doctorName": "蒋建光", 
    "typeId": "01", 
    "typeName": "西药费", 
    "totalAmt": 79.4, 
    "prescriptionItems": [
      {
        "index": 1, 
        "typeId": "01", 
        "typeName": "西药费", 
        "itemName": "雷尼替丁", 
        "count": 2, 
        "price": 23, 
        "totalAmt": 46
      }, 
      {
        "index": 2, 
        "typeId": "01", 
        "typeName": "西药费", 
        "itemName": "茶苯海明片", 
        "count": 1, 
        "price": 3.4, 
        "totalAmt": 3.4
      }, 
      {
        "index": 3, 
        "typeId": "01", 
        "typeName": "西药费", 
        "itemName": "百忧解", 
        "count": 3, 
        "price": 10, 
        "totalAmt": 30
      }
    ]
  }, 
  {
    "prescriptionId": "201601000002", 
    "prescriptionDate": "2017-01-20 11:00", 
    "deptId": "001001002", 
    "deptName": "物理康复", 
    "doctorId": "0001", 
    "doctorName": "蒋建光", 
    "typeId": "02", 
    "typeName": "中药费", 
    "totalAmt": 47, 
    "prescriptionItems": [
      {
        "index": 1, 
        "typeId": "02", 
        "typeName": "中药费", 
        "itemName": "蒲公英饮片", 
        "count": 2, 
        "price": 12, 
        "totalAmt": 24
      }, 
      {
        "index": 2, 
        "typeId": "02", 
        "typeName": "中药费", 
        "itemName": "六味地黄丸", 
        "count": 1, 
        "price": 23, 
        "totalAmt": 23
      }
    ]
  }, 
  {
    "prescriptionId": "201601000003", 
    "prescriptionDate": "2017-01-20 11:05", 
    "deptId": "001001002", 
    "deptName": "物理康复", 
    "doctorId": "0001", 
    "doctorName": "蒋建光", 
    "typeId": "03", 
    "typeName": "检验费", 
    "totalAmt": 113, 
    "prescriptionItems": [
      {
        "index": 1, 
        "typeId": "03", 
        "typeName": "检验费", 
        "itemName": "肝功能", 
        "count": 1, 
        "price": 45, 
        "totalAmt": 45
      }, 
      {
        "index": 2, 
        "typeId": "03", 
        "typeName": "检验费", 
        "itemName": "甲功三项", 
        "count": 1, 
        "price": 68, 
        "totalAmt": 68
      }
    ]
  }, 
  {
    "prescriptionId": "201601000004", 
    "prescriptionDate": "2017-01-20 11:05", 
    "deptId": "001001002", 
    "deptName": "物理康复", 
    "doctorId": "0001", 
    "doctorName": "蒋建光", 
    "typeId": "03", 
    "typeName": "检验费", 
    "totalAmt": 688, 
    "prescriptionItems": [
      {
        "index": 1, 
        "typeId": "03", 
        "typeName": "检验费", 
        "itemName": "癌症筛查", 
        "count": 1, 
        "price": 688, 
        "totalAmt": 688
      }
    ]
  }
];

var prepaidCashOrderInit = {
  "id": "0000000000001", 
  "orderCode": "PPC20170123000001", 
  "orderType": "0", 
  "orderTypeName": "预存", 
  "orderType1": "", 
  "orderTypeName1": "", 
  "orderDesc": "现金预存", 
  "amt": 0, 
  "createdDate": moment(new Date()).format('YYYY-MM-DD HH:mm:ss SSS'), 
  "miPaid": null, 
  "paPaid": null, 
  "selfPaid": null, 
  "paidType": "10", 
  "paidTypeName": "现金", 
  "paidDate": "", 
  "state": "2", 
  "settlements": [ ]
}

var prepaidCashSettlementInit = {
  "id": "", 
  "settlementCode": "", 
  "paidType": "10", 
  "paidTypeName": "现金", 
  "amt": 0, 
  "createdDate": moment(new Date()).format('YYYY-MM-DD HH:mm:ss SSS'), 
  "paidDate": moment(new Date()).format('YYYY-MM-DD HH:mm:ss SSS'), 
  "state": "2"
}

var prepaidOrderInit = {
  "id": "0000000000003", 
  "orderCode": "PPC20170123000003", 
  "orderType": "0", 
  "orderTypeName": "预存", 
  "orderType1": "", 
  "orderTypeName1": "", 
  "orderDesc": "", 
  "amt": 0, 
  "createdDate": moment(new Date()).format('YYYY-MM-DD HH:mm:ss SSS'), 
  "miPaid": null, 
  "paPaid": null, 
  "selfPaid": null, 
  "paidType": "", 
  "paidTypeName": "", 
  "paidDate": "", 
  "state": "1", 
  "settlements": [ ]
}

var prepaidSettlementInit = {
  "id": "", 
  "settlementCode": "", 
  "paidType": "", 
  "paidTypeName": "", 
  "amt": 0, 
  "createdDate": moment(new Date()).format('YYYY-MM-DD HH:mm:ss SSS'), 
  "paidDate": "", 
  "state": "1"
}


var inpatientPrepaidOrderInit = {
  "id": "0000000000005", 
  "orderCode": "PPC20170123000005", 
  "orderType": "4", 
  "orderTypeName": "住院预缴", 
  "orderType1": "", 
  "orderTypeName1": "", 
  "orderDesc": "", 
  "amt": 0, 
  "createdDate": moment(new Date()).format('YYYY-MM-DD HH:mm:ss SSS'), 
  "miPaid": null, 
  "paPaid": null, 
  "selfPaid": null, 
  "paidType": "", 
  "paidTypeName": "", 
  "paidDate": "", 
  "state": "1", 
  "settlements": [ ]
}

var inpatientPrepaidSettlementInit = {
  "id": "", 
  "settlementCode": "", 
  "paidType": "", 
  "paidTypeName": "", 
  "amt": 0, 
  "createdDate": moment(new Date()).format('YYYY-MM-DD HH:mm:ss SSS'), 
  "paidDate": "", 
  "state": "1"
}


var orderInit = {
  "id": "0000000000000", 
  "orderCode": "PPC20170123000000", 
  "orderType": "3", 
  "orderTypeName": "缴费", 
  "orderType1": "", 
  "orderTypeName1": "", 
  "orderDesc": "", 
  "amt": 0, 
  "createdDate": moment(new Date()).format('YYYY-MM-DD HH:mm:ss SSS'), 
  "miPaid": null, 
  "paPaid": null, 
  "selfPaid": null, 
  "paidType": "", 
  "paidTypeName": "", 
  "paidDate": "", 
  "state": "1", 
  "settlements": [ ]
}

function settlementInit () {
  return {
    "id": "", 
    "settlementCode": "", 
    "paidType": "", 
    "paidTypeName": "", 
    "amt": 0, 
    "createdDate": moment(new Date()).format('YYYY-MM-DD HH:mm:ss SSS'), 
    "paidDate": "", 
    "state": "1"
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

    prepaidCashOrder.amt += count * parseFloat(Amt);

    for (let i = 0 ; i < count ; i++) {
      let settlement = prepaidCashSettlementInit;
      settlement.id = '0000000' + (i + 1);
      settlement.settlementCode = '0000000' + (i + 1);
      settlement.amt += parseFloat(Amt);
      prepaidCashOrder.settlements.push(settlement);
      prepaidCashOrder.paidDate = moment(new Date()).format('YYYY-MM-DD HH:mm:ss SSS');
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

    order.amt += parseFloat(Amt);

    let settlement = prepaidSettlementInit;
    settlement.id = '00000001';
    settlement.settlementCode = '00000001';
    settlement.amt += parseFloat(Amt);

    if (PaidType == '20') {
      order.orderDesc += '银行卡预存';
      order.paidType = PaidType;
      order.paidTypeName = '银联';

      settlement.paidType = PaidType;
      settlement.paidTypeName = '银联';
    } else {
      order.orderDesc += '支付宝/微信预存';
      order.paidType = PaidType;
      order.paidTypeName = '支付宝/微信';

      settlement.paidType = PaidType;
      settlement.paidTypeName = '支付宝/微信';
    }
    order.settlements.push(settlement);


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

    order.amt += parseFloat(Amt);

    let settlement = inpatientPrepaidSettlementInit;
    settlement.id = '00000001';
    settlement.settlementCode = '00000001';
    settlement.amt += parseFloat(Amt);

    if (PaidType == '00') {
      order.orderDesc += '就诊卡虚拟账户转住院预缴';
      order.paidType = PaidType;
      order.paidTypeName = '就诊卡虚拟账户';

      settlement.paidType = PaidType;
      settlement.paidTypeName = '就诊卡虚拟账户';

    } else if (PaidType == '20') {
      order.orderDesc += '银行卡住院预缴';
      order.paidType = PaidType;
      order.paidTypeName = '银联';

      settlement.paidType = PaidType;
      settlement.paidTypeName = '银联';

    } else {
      order.orderDesc += '支付宝/微信住院预缴';
      order.paidType = PaidType;
      order.paidTypeName = '支付宝/微信';

      settlement.paidType = PaidType;
      settlement.paidTypeName = '支付宝/微信';

    }
    order.settlements.push(settlement);


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

    order.amt += parseFloat(Amt);
    order.paidType = '00';
    order.paidTypeName = '就诊卡虚拟账户';
    order.State = '2';

    let miPaid    = parseFloat(Amt) * .7, 
        paPaid    = 12, 
        selfPaid  = parseFloat(Amt) * .3 - paPaid;

    let MIsettlement = new settlementInit();
    MIsettlement.id = '00000001';
    MIsettlement.settlementCode = '00000001';
    MIsettlement.amt = miPaid;
    MIsettlement.paidType = 'MI';
    MIsettlement.paidTypeName = '医保报销';
    MIsettlement.State = '2';
    order.miPaid = miPaid;
    order.settlements.push(MIsettlement);

    let PAsettlement = new settlementInit();
    PAsettlement.id = '00000002';
    PAsettlement.settlementCode = '00000002';
    PAsettlement.amt = paPaid;
    PAsettlement.paidType = 'PA';
    PAsettlement.paidTypeName = '医保个人账户';
    PAsettlement.State = '2';
    order.PAPaid = paPaid;
    order.settlements.push(PAsettlement);

    let settlement = new settlementInit();
    settlement.id = '00000003';
    settlement.settlementCode = '00000003';
    settlement.amt = selfPaid;
    settlement.paidType = '00';
    settlement.paidTypeName = '就诊卡虚拟账户';
    settlement.State = '2';
    order.SelfPaid = selfPaid;
    order.settlements.push(settlement);

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

    order.amt += parseFloat(Amt);
    order.paidType = type;
    order.paidTypeName = typeName;

    let miPaid    = parseFloat(Amt) * .7, 
        paPaid    = 12, 
        selfPaid  = parseFloat(Amt) * .3 - paPaid;

    let MIsettlement = new settlementInit();
    MIsettlement.id = '00000001';
    MIsettlement.settlementCode = '00000001';
    MIsettlement.amt = miPaid;
    MIsettlement.paidType = 'MI';
    MIsettlement.paidTypeName = '医保报销';
    order.miPaid = miPaid;
    order.settlements.push(MIsettlement);

    let PAsettlement = new settlementInit();
    PAsettlement.id = '00000002';
    PAsettlement.settlementCode = '00000002';
    PAsettlement.amt = paPaid;
    PAsettlement.paidType = 'PA';
    PAsettlement.paidTypeName = '医保个人账户';
    order.PAPaid = paPaid;
    order.settlements.push(PAsettlement);

    let settlement = new settlementInit();
    settlement.id = '00000003';
    settlement.settlementCode = '00000003';
    settlement.amt = selfPaid;
    settlement.paidType = type;
    settlement.paidTypeName = typeName;
    order.SelfPaid = selfPaid;
    order.settlements.push(settlement);

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




