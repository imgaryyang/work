import dva from 'dva';

export default {
	namespace: 'frame',
	state: {
		payload:{},
		cache:{}
	},
	subscriptions: {
		/*keyEvent(dispatch) {//订阅键盘事件
			 key('⌘+up, ctrl+up', () => { dispatch({type:'add'}) });
		},*/
		setup({ dispatch, history }) {//监听history 参数，控制参数 
			history.listen(location => {
				var {pathname} = location;
				dispatch({
					type: 'routeChange',
					payload:{location:pathname}
				});
			});
	    },
	},
	effects: {
	    *load({ payload }, { select, call, put }) {
	    	const {data} = yield call(loadMenus);
	    	if (data) {yield put({
    			type: 'init',
    			payload:data,
	        })}
	    },
	    *create(){},
	    *'delete'(){},
	    *update(){}
	},
	reducers: {
		"payload"(state,{payload}){
			return {...state,payload:payload};
		},
		"pop"(state,{payload}) {
			return state;
		},
	},
};