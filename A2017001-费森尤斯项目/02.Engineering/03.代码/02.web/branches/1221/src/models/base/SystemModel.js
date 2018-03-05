import dva from 'dva';

export default {
	namespace: 'menu',
	state: {
		systems:{
			sysconfig : {name:'系统管理',code:'sysconfig',alias:'系统管理'},
			clinic : {name:'门诊医生站',code:'clinic',alias:'门诊医生站'}
		}
	},
	effects: {
	},
	reducers: {
	},
};