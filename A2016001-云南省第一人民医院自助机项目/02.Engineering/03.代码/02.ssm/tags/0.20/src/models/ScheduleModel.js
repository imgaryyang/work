import dva from 'dva';
import { loadDeptList, loadSchedulePage,loadTimePeriodBySchedule,book } from '../services/AppointmentService';
/**
 * 排班，获取排班医生，获取排班科室，获取排班信息，获取排班时间段
 */
export default {
	namespace: 'schedule',
	
	state: {
		timePeriod : [],	//时间段
		
		departments : [],	//部门
		doctors : [],		//医生
		
		schedules : [],		//排班
		timePeriods : [],	//时间段
		
		searchParam:{		//排班查询条件
			department : null,
			doctor : null,
			date : null,
			dayPeriod : null,
		},
		loaded: false,
	},

	//订阅
	subscriptions: {
	},

	//远程请求
	effects: {
		/**
		 * 载入所有科室排班信息
		 */
		*loadDepartments({ payload }, { select, call, put }) {
			
			yield put({type: 'setState',payload:{loaded:false}});
			
			const theState = yield select(state => state.schedule);
			
			const {data} = yield call(loadDeptList, theState);
			let result = data.result;// ? data.result : [], filterResult = result;
			
			var tree = [], map = {};
			for(var d of result){
				map[d.id] = d;
				d.children = [];
			}
			for(var d of result){
				if(d.parentId && map[d.parentId]){
					map[d.parentId].children.push(d);
					d.parent=map[d.parentId];
				}
				else{
					tree.push(d);
				}
			}
			
			yield put({ 
				type: 'init', 
				payload: tree, 
			})
		},
		
		/**
		 * 载入排班信息
		 */
	    *loadSchedules({ payload }, { select, call, put }) {
	    	const {data} = yield call(loadSchedulePage, {start:0,limit:10});
	    	if (data && data.success && data.result) {
	    		yield put({
	    			type: 'setState',
		  			payload: {
		  				schedules : data.result
		  			},
		      })
	    	}
	    },
	    
		/**
		 * 载入所有可预约时段
		 */
	    *loadTimePeriod ({ payload }, { select, call, put }) {
	    	const scheduleId = payload.schedule.id;
	    	const {data} = yield call(loadTimePeriodBySchedule, {scheduleId : scheduleId});
	    	if ( data && data.success && data.result ) {
	    		yield put({
		  			type: 'setState',
		  			payload: {
		  				timePeriods : data.result
		  			},
	    		})
	    	}
	    },
	    
	    /**
		 * 预约请求
		 */
	    *book ({ payload }, { select, call, put }) {
	    	const {data} = yield call(book,payload.timePeriod);
	    	if ( data && data.success && data.result ) {//预约成功，执行回调
	    		if(payload.callback){
	    			payload.callback(data.result);
	    		}
	    	}
	    },
	},

	//处理state
	reducers: {

		/**
		 * 初始化排班信息
		 */
		init (state, {payload}) {
			return {
				...state, 
				departments: payload,
				loaded: true,
			};
		},

		/**
		 * 获取可预约时段
		 */
		initTimePeriod (state, {payload}) {
			return {
				...state, 
				timePeriod: payload,
			};
		},

		/**
		 * 通用setState
		 */
		setState (state, {payload}) {
			return {
				...state, 
				...payload,
			};
		},
		
		/**
		 * 
		 */
		setSearchParam (state, {payload}) {
			var searchParam = {
					...state.searchParam,
					...payload
				};
			return {
				...state, 
				searchParam : searchParam
			};
		},

	},
};


