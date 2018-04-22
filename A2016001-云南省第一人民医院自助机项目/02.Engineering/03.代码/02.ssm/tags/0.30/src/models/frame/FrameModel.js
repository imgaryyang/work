import dva from 'dva';
import { loadMenus,loadOperatorMenus } from '../../services/MenuService';
import { machineLogin,machineRegister,machineConfig } from '../../services/MachineService';
import ajax from "../../utils/ajax"
import baseUtil from "../../utils/baseUtil"
// import logUtil,{ log } from  "../../utils/logUtil"
const defaultNav = {
		onBack : null,
		onForward : null,
		onHome : null,
		display : true,
		backDisabled : false,
		homeDisabled : false,
		title:"自助机",
};
export default {
	namespace: 'frame',
	state: {
		nav : {
			onBack: null,
			onHome: null,
			backDisabled: false,
			homeDisabled: false, 
			title: '自助机'
		},
		notice : {
			msg: null,				//消息内容可支持字符串或element
			showSwitch: false,
			hideSwitch: false,

			info: null,
			autoBack: true,		//公共info界面是否显示自动返回首页
		},
		error : {
			msg: null,				//消息内容可支持字符串或element
			quit:true,
		},
		menus:[],
		machine:{},
		loading:false,
		
	},
	subscriptions: {
//		logger({dispatch, history }){
//			logUtil.startLogLoop();
//		},
		msgProvider({dispatch, history }){
			baseUtil.addNoticeProvider((msg)=>{
			  dispatch({type:'showNotice',payload:{msg}});	
			});
			baseUtil.addErrorProvider((msg)=>{
			  dispatch({type:'showError',payload:{msg}});	
			});
			baseUtil.addWarningProvider((msg)=>{
			  dispatch({type:'showWarning',payload:{msg}});	
			});
		},
		ajaxError({dispatch, history }) {//监听ajax错误
			ajax.addErrorHandler("400+",function(status,reponse){
				var msg = "网络异常";
				dispatch({type:'showError',payload:{msg}});	
			});
			ajax.addErrorHandler("500+",function(status,reponse){
				var msg = "远程服务异常，请检查网络";
				dispatch({type:'showError',payload:{msg}});	
			});
			ajax.addErrorHandler("biz",function(status,msg){
				console.info('业务错误：',msg);
			});
			ajax.addErrorHandler("beforeSend",function(status,msg){
				dispatch({type:'setState',payload:{loading:true}});
			});
			ajax.addErrorHandler("afterSend",function(status,msg){
				dispatch({type:'setState',payload:{loading:false}});
			});
		},
		
		setup({ dispatch, history }) {
			history.listen(location => { //监听history 参数，控制导航条
				var state = location.state || {};
				var nav = state.nav ||{};
				dispatch({
					type: 'refreshNav',
					nav:nav
				});
			});
	    },
	},
	
	effects: {
	    *loadMenus({ payload }, { select, call, put }) {
	    	const {data} = yield call(loadMenus);
	    	if (data && data.success ) {
	    		//log(data);
	    		yield put({
	    			type: 'setState',
	    			payload: { menus:data.result }
	    		})
	    	}
	    	const {data:config} = yield call(machineConfig);
	    	if (config && config.success ) {
	    		window.ssmConfig = config.result||{};
	    		// console.info('window.ssmConfig ',window.ssmConfig);
	    	}
	    },
	    *loadOperatorMenus({ payload }, { select, call, put }) {
	    	const {data} = yield call(loadOperatorMenus);
	    	if (data && data.success ) {
	    		yield put({
	    			type: 'setState',
	    			payload: { menus:data.result }
	    		})
	    	}
	    },
	    *machineLogin({ payload }, { select, call, put }){
	    	const {data} = yield call(machineLogin);
	    	if (data && data.success ) {
	    		yield put({
	    			type: 'setState',
	    			payload: { machine:data.result }
	    		})
	    	}else if( data && data.msg ){
	    		baseUtil.error(data.msg );
	    	}else{
	    		baseUtil.error("未授权的自助机");
	    	}
	    	
	    },
	    *machineRegister({ payload }, { select, call, put }){
	    	const { machine } = payload;
	    	const { data } = yield call(machineRegister,machine);
	    	if(data && data.success){
	    		baseUtil.error("注册成功");
	    	}else if(data.msg){
	    		baseUtil.error(data.msg);
	    	}else{
	    		console.info(data);
	    		baseUtil.error("注册失败");
	    	}
	    },
	    *checkDevice({ payload }, { select, call, put }){
	    	
	    },
	    *setState({ payload ,callback}, { select, call, put }) {
	    	yield put({
    			type: 'changeState',
    			payload: payload
    		});
	    	if(callback)callback();
		},
	},
	
	reducers: {
		"changeState"(state,{ payload}) {
			return {...state,...payload};
		},
		"refreshNav"(state,{nav}){
			const newNav = {...defaultNav,...nav};
			return {...state,nav:newNav};
		},
		"setNotice"(state,{payload}){
			const notice = {...notice,...payload};
			return {...state,notice};
		},
		"showNotice"(state, {payload}) {
			if (payload && payload.msg) {
				const notice = {...notice,...payload,showSwitch: true,};
				return {...state,notice};
			}
		},
		"showError"(state, {payload}) {
			if (payload && payload.msg) {
				const error = {msg:payload.msg,quit:true,};
				return {...state,error};
			}
		},
		"showWarning"(state, {payload}) {
			if (payload && payload.msg) {
				const error = {msg:payload.msg,quit:false,};
				return {...state,error};
			}
		},
		"hideNotice"(state, {payload}) {
			const notice = {...notice,msg: null,hideSwitch: true,};
			return {...state,notice};
		},
	},
};