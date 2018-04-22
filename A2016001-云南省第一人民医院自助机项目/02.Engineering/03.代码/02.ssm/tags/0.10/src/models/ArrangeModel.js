import dva from 'dva';
import { loadArranges, loadArrangeTimePeriod } from '../services/AppointmentService';

export default {
	namespace: 'arrange',

	state: {
		arranges: [],

		loaded: false,

		selectedDept: {},
		selectedDate: 'all',
		selectedDayPeriod: 'all',
		selectedDoctor: {},
		/*selectedDoctorId: '',
		selectedDoctorName: 'all',*/

		showDateModal: false,
		showDayPeriodModal: false,

		timePeriod: [],
	},

	//订阅
	subscriptions: {
	},

	//远程请求
	effects: {

		/**
		 * 载入所有科室排班信息
		 */
    *load({ payload }, { select, call, put }) {

    	console.log('load() in arrange model [ effects ] : ', payload);

			payload.loaded = false;
    	yield put({
				type: 'setState',
				payload: payload
    	});

			const theState = yield select(state => state.arrange);
    	/*console.log('in load.............');
    	console.log(theState);*/

    	const {data} = yield call(loadArranges, theState);

			let result = data.result ? data.result : [], filterResult = result;
    	filterResult = result.filter (
		    row => {
		    	let rtn = true;
		    	if (theState.selectedDate != 'all' && row.ArrangeDate != theState.selectedDate)
		    		rtn = false;
		    	if (theState.selectedDayPeriod != 'all' && row.DayPeriod != theState.selectedDayPeriod)
		    		rtn = false;
		    	if (theState.selectedDoctor['DoctorId'] && row.DoctorId != theState.selectedDoctor['DoctorId'])
		    		rtn = false;

		    	return rtn;
		    		
		    }
		  );
    	
    	if ( filterResult /*data && data.success*/) {
    		yield put({
	  			type: 'init',
	  			payload: filterResult,
	      })
      }
    },

		/**
		 * 载入所有可预约时段
		 */
    *loadTimePeriod ({ payload }, { select, call, put }) {
    	const {data} = yield call(loadArrangeTimePeriod, payload);
    	if (data && data.success ) {
    		yield put({
	  			type: 'initTimePeriod',
	  			payload: data.result,
	      })
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
				arranges: payload,
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
			let {...props} = payload;
			return {
				...state, 
				...props,
			};
		},

	},
};


