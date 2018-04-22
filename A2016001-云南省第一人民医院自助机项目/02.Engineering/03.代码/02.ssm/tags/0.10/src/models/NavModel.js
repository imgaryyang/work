import dva from 'dva';
import { loadMenus } from '../services/MenuService';
const defaultConfig = {
		onBack : null,
		onForward : null,
		onHome : null,
		display : true,
		backDisabled : false,
		homeDisabled : false,
		title:"自助机",
};
export default {
	namespace: 'nav',
	state: defaultConfig,
	subscriptions: {
		setup({ dispatch, history }) {
			history.listen(location => { //监听history 参数，控制导航条
				var state = location.state || {};
				var nav = state.nav ||{};
				dispatch({
					type: 'refresh',
					nav:nav
				});
			});
	    },
	},
	effects: {
	},
	reducers: {
		"refresh"(state,{nav}){
			return {...defaultConfig,...nav};
		},
	},
};