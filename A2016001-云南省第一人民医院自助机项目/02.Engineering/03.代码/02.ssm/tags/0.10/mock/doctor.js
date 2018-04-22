'use strict';

var doctors = [
	{
		DeptId: '001001002',
		DeptName: '物理康复',
		DoctorId: '0001',
		DoctorName: '蒋建光',
		Gender: '1',
		JobTitleId: '001',
		JobTitle: '主任医师',
		ShortPinYin: 'JJG',
	},
	{
		DeptId: '001001002',
		DeptName: '物理康复',
		DoctorId: '0002',
		DoctorName: '徐宏',
		Gender: '1',
		JobTitleId: '002',
		JobTitle: '副主任医师',
		ShortPinYin: 'XH',
	},
	{
		DeptId: '001001002',
		DeptName: '物理康复',
		DoctorId: '0003',
		DoctorName: '张晓',
		Gender: '1',
		JobTitleId: '001',
		JobTitle: '主任医师',
		ShortPinYin: 'ZX',
	},
	{
		DeptId: '001001002',
		DeptName: '物理康复',
		DoctorId: '0004',
		DoctorName: '王刘桑',
		Gender: '1',
		JobTitleId: '001',
		JobTitle: '主任医师',
		ShortPinYin: 'WLS',
	},
	{
		DeptId: '001001002',
		DeptName: '物理康复',
		DoctorId: '0005',
		DoctorName: '王睫茹',
		Gender: '1',
		JobTitleId: '003',
		JobTitle: '主治医师',
		ShortPinYin: 'WJR',
	},
	{
		DeptId: '001001002',
		DeptName: '物理康复',
		DoctorId: '0006',
		DoctorName: '张青',
		Gender: '1',
		JobTitleId: '003',
		JobTitle: '主治医师',
		ShortPinYin: 'ZQ',
	},
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
