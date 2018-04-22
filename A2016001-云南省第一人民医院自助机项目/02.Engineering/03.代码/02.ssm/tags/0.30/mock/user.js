'use strict';

var user = {
  "id": "00000001", //用户ID，HIS中的唯一客户号
  "name": "王五四", //用户姓名
  "idCardNo": "110100198609111894", //身份证号
  "gender": "1", //性别
  "birthday": "1986-09-11", //生日
  "age": "31", //年龄
  "mobile": "13657869099", //手机号
  "medium": "1", //就诊介质 - 当前认证身份的介质 （1 - 就诊卡，2 - 社保卡/医保卡）
  "medicalCardNo": "20167890", //当前使用的诊疗卡号
  "siCardNo": "110100198609111894", //当前使用的社保卡号
  "miCardNo": "58976632", //当前使用的医保卡号
  "prepaidOpened": false//是否已开通预存
};

module.exports = {

  'GET /api/ssm/client/user/login': function (req, res) {
    setTimeout(function () {
      res.json({
        success: true,
        result: user
      });
    }, 500);
  },

  'GET /api/ssm/client/user/logout': function (req, res) {
    setTimeout(function () {
      res.json({
        success: true
      });
    }, 500);
  },

};
