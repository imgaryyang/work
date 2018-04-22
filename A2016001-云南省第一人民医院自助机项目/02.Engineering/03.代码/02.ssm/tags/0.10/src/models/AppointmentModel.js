import dva from 'dva';
import { loadAppointmentRecords, sign, cancel } from '../services/AppointmentService';

export default {

	namespace: 'appointment',

	state: {
		loaded: false,
		apptRecords: [],
		unusedAppt: [],
		signed: false,
		cancelConfirmVisible: false,
		cancelRecord: null,
	},

	//订阅
	subscriptions: {
	},

	//远程请求
	effects: {

		/**
		 * 载入所有预约信息
		 */
    * loadAllApptRecords ({ payload }, { select, call, put }) {

			payload.loaded = false;
    	yield put({
				type: 'setState',
				payload: payload
    	});

			const theState = yield select(state => state.appointment);

    	const {data} = yield call(loadAppointmentRecords, {state: '-1'});
    	
    	if (data && data.success ) {
    		yield put({
	  			type: 'setAllApptRecords',
	  			payload: data.result,
	      })
      }
    },

    /**
		 * 载入未就诊的预约信息
		 */
    * loadUnusedApptRecords ({ payload }, { select, call, put }) {
			//console.log('in effects loadUnusedApptRecords:', payload);
			payload.loaded = false;
    	yield put({
				type: 'setState',
				payload: payload
    	});

			const theState = yield select(state => state.appointment);

    	const {data} = yield call(loadAppointmentRecords, {state: '1'});
    	
    	if (data && data.success ) {
    		yield put({
	  			type: 'setUnusedApptRecords',
	  			payload: data.result,
	      })
      }
    },

    /**
		 * 签到
		 */
    * sign ({ payload }, { select, call, put }) {
			
    	const {data} = yield call(sign, payload);

    	yield put({
				type: 'setState',
				payload: {
					signed: true,
				},
    	});

    },

    /**
		 * 取消预约
		 */
    * cancel ({ payload }, { select, call, put }) {

    	yield put({
				type: 'setState',
				payload: payload
    	});
			
			const theState = yield select(state => state.appointment);
    	const {data} = yield call(cancel, theState);

    	yield put({
				type: 'setState',
				payload: {
					cancelRecord: null,
					cancelSuccess: true,
				},
    	});

    },

	},

	//处理state
	reducers: {

		/**
		 * 初始化排班信息
		 */
		setAllApptRecords (state, {payload}) {
			return {
				...state, 
				apptRecords: payload,
				loaded: true,
			};
		},

		setUnusedApptRecords (state, {payload}) {
			console.log('in reducers setUnusedApptRecords:', payload);
			return {
				...state, 
				unusedAppt: payload,
				loaded: true,
			};
		},

		/**
		 * 通用setState
		 */
		setState (state, {payload}) {
			let {...props} = payload;
			return {
				...state, 
				...props,
			};
		},

	},
};


