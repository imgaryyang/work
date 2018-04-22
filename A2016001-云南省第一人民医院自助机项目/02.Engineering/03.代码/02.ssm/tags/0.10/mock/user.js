'use strict';

var user = {
	UserId: '00000001',							//用户ID，HIS中的唯一客户号
	Name: '王五四',									//用户姓名
	IDCardNo: '110100198609111894',	//身份证号
	Gender: '1',										//性别
	Birthday: '1986-09-11',					//生日
	Age: '31',											//年龄
	Mobile: '13657869099',					//手机号
	Medium: '1',										//就诊介质 - 当前认证身份的介质 （1 - 就诊卡，2 - 社保卡/医保卡）
	MedicalCardNo: '20167890',			//当前使用的诊疗卡号
	SICardNo: '110100198609111894',	//当前使用的社保卡号
	MICardNo: '58976632',						//当前使用的医保卡号
	PrepaidOpened: false,						//是否已开通预存
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
