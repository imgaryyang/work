'use strict';

var depts = [

	{DeptId: '001', DeptName: '专病', children: [
		{DeptId: '001001', DeptName: '康复治疗', children: [
			{DeptId: '001001002', DeptName: '物理康复'},
			{DeptId: '001001003', DeptName: '中风康复'},
			{DeptId: '001001004', DeptName: '小儿麻痹康复'},
		]},
		{DeptId: '001002', DeptName: '心里咨询'},
		{DeptId: '001003', DeptName: '更年期保健门诊'},
		{DeptId: '001004', DeptName: '周围神经病门诊'},
		{DeptId: '001005', DeptName: '手外科', children: [
			{DeptId: '001005002', DeptName: '手创伤外科'},
			{DeptId: '001005003', DeptName: '手畸形专科'},
		]},
		{DeptId: '001006', DeptName: '脊柱外科'},
		{DeptId: '001007', DeptName: '肠道肿瘤门诊'},
		{DeptId: '001008', DeptName: '学生和儿童青少年心理门诊'},
		{DeptId: '001009', DeptName: '创口治疗门诊'},
		{DeptId: '001010', DeptName: '乳腺、肿瘤门诊'},
		{DeptId: '001011', DeptName: '骨质酥松'},
		{DeptId: '001012', DeptName: '脑卒中门诊'},
		{DeptId: '001013', DeptName: '白癜风门诊'},
		{DeptId: '001014', DeptName: '心胸外科随访门诊'},
		{DeptId: '001015', DeptName: '记忆门诊'},
		{DeptId: '001016', DeptName: '房颤'},
		{DeptId: '001017', DeptName: '糖尿病门诊'},
		{DeptId: '001018', DeptName: '激光门诊'},
		{DeptId: '001019', DeptName: '起搏器随访门诊'},
		{DeptId: '001020', DeptName: '鼾症咨询门诊'},
		{DeptId: '001021', DeptName: '胆囊、胆结石门诊'},
		{DeptId: '001022', DeptName: '瘢痕整形门诊'},
		{DeptId: '001023', DeptName: '小儿视光门诊'},
		{DeptId: '001024', DeptName: '慢性肾病团队诊疗'},
		{DeptId: '001025', DeptName: '男性病门诊'},
		{DeptId: '001026', DeptName: '再生育门诊'},
		{DeptId: '001027', DeptName: '高血压'},
		{DeptId: '001028', DeptName: '洗牙'},
		{DeptId: '001029', DeptName: 'PICC'},
		{DeptId: '001030', DeptName: '经颅磁治疗'},
		{DeptId: '001031', DeptName: '疝（小肠）气门诊'},
		{DeptId: '001032', DeptName: '药物咨询'},
		{DeptId: '001033', DeptName: '肝癌微创介入门诊'},
		{DeptId: '001034', DeptName: '脑胶质瘤专病门诊'},
		{DeptId: '001035', DeptName: '妇科治疗门诊'},
		{DeptId: '001036', DeptName: '伤口/造口护理门诊'},
		{DeptId: '001037', DeptName: '产前筛查咨询门诊'},
		{DeptId: '001038', DeptName: '宫颈门诊'},
	]},
	{DeptId: '002', DeptName: '外科', children: [
		{DeptId: '002001', DeptName: '肠胃外科'},
		{DeptId: '002002', DeptName: '胆结石诊疗中心'},
		{DeptId: '002003', DeptName: '肛肠外科'},
		{DeptId: '002004', DeptName: '血管外科'},
		{DeptId: '002005', DeptName: '泌尿外科', children: [
			{DeptId: '002005002', DeptName: '前列腺专科'},
			{DeptId: '002005003', DeptName: '尿路感染专科'},
			{DeptId: '002005004', DeptName: '前列腺肥大专科'},
		]},
		{DeptId: '002006', DeptName: '烧伤/伤口中心'},
		{DeptId: '002007', DeptName: '创伤外科'},
		{DeptId: '002008', DeptName: '肝胆外科'},
		{DeptId: '002009', DeptName: '移植科'},
		{DeptId: '002010', DeptName: '胸外科'},
		{DeptId: '002011', DeptName: '神经外科'},
		{DeptId: '002012', DeptName: '骨科'},
	]},
	{DeptId: '003', DeptName: '内科', children: [
		{DeptId: '003001', DeptName: '消化内科'},
		{DeptId: '003002', DeptName: '呼吸内科'},
		{DeptId: '003003', DeptName: '感染科'},
		{DeptId: '003004', DeptName: '神经内科'},
		{DeptId: '003005', DeptName: '全科医学（门诊体检）'},
		{DeptId: '003006', DeptName: '甲状腺诊疗中心'},
		{DeptId: '003007', DeptName: '老年病（门诊体检）'},
		{DeptId: '003008', DeptName: '心血管内科'},
		{DeptId: '003009', DeptName: '神经卫生科'},
		{DeptId: '003010', DeptName: '康复科'},
		{DeptId: '003011', DeptName: '肾内科'},
		{DeptId: '003012', DeptName: '血液内科'},
		{DeptId: '003013', DeptName: '风湿免疫科'},
		{DeptId: '003014', DeptName: '内分泌科'},
		{DeptId: '003015', DeptName: '核医学'},
	]},
	{DeptId: '004', DeptName: '生殖中心', children: [
		{DeptId: '004001', DeptName: '生殖中心'},
	]},
	{DeptId: '005', DeptName: '五官', children: [
		{DeptId: '005001', DeptName: '眼科'},
		{DeptId: '005002', DeptName: '口腔科'},
		{DeptId: '005003', DeptName: '耳鼻喉科'},
	]},
	{DeptId: '006', DeptName: '皮肤', children: [
		{DeptId: '006001', DeptName: '皮肤科'},
	]},
	{DeptId: '007', DeptName: '中医', children: [
		{DeptId: '007001', DeptName: '中医科'},
		{DeptId: '007002', DeptName: '骨伤科'},
		{DeptId: '007003', DeptName: '针推理疗科'},
	]},
	{DeptId: '008', DeptName: '妇产', children: [
		{DeptId: '008001', DeptName: '产科'},
		{DeptId: '008002', DeptName: '妇科'},
	]},
	{DeptId: '009', DeptName: '儿科', children: [
		{DeptId: '009001', DeptName: '儿科'},
	]},
	{DeptId: '010', DeptName: '疼痛', children: [
		{DeptId: '010001', DeptName: '疼痛科'},
	]},
	{DeptId: '011', DeptName: '肿瘤', children: [
		{DeptId: '011001', DeptName: '肿瘤科'},
		{DeptId: '011002', DeptName: '放化疗科'},
	]},
	{DeptId: '012', DeptName: '医学美容', children: [
		{DeptId: '012001', DeptName: '医学美容'},
	]},
];

module.exports = {

  'GET /api/ssm/client/dept/list': function (req, res) {
    setTimeout(function () {
      res.json({
        success: true,
        result: depts,
      });
    }, 500);
  },

};
