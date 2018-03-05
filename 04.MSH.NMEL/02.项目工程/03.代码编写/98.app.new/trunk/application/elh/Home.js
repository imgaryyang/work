/**
 * 就医功能首页
 */
'use strict';

import React, {
    Component,

} from 'react';

import {
    View,
    ScrollView,
    Text,
    Image,
    TouchableOpacity,
    StyleSheet,
	InteractionManager,
} from 'react-native';

import * as Global  	from '../Global';

import NavBar       	from 'rn-easy-navbar';

import TreatList    	from './treatment-his/TreatmentHis';
import PatientsList 	from './patients/PatientsList';
import OGNoticeBoard 	from './outpatient/OGNoticeBoard';
import CheckReportList 	from './check/CheckReportList';
import HospList 		from './hospital/HospList';
import News 			from './news/News';

const MENU_URL = 'el/';

const icons = {
	'hosp':			require('../res/images/base/hosp.png'),
	'patient': 		require('../res/images/base/patient.png'),
	'regRealtime': 	require('../res/images/base/reg-realtime.png'),
	'report':		require('../res/images/base/report.png'),
	'treat':		require('../res/images/base/treat.png'),
	'news':			require('../res/images/base/news.png'),
};

const bgColors = ['#ff6666','#ffcf2f','#8b8ffa','#4dc7ee','#2bd3c2','#ff80c3',];

/**
 * 系统提供的服务
 */
const services = [
	{code: '000', name: '医院',		icon: 'hosp', 			component: HospList, 		hideNavBar: true, navTitle: '找医院',},
	{code: '001', name: '常用就诊人',	icon: 'patient', 		component: PatientsList, 	hideNavBar: true, navTitle: '常用就诊人',},
	{code: '002', name: '实时挂号',	icon: 'regRealtime',		hideNavBar: true, navTitle: '实时挂号',},
	{code: '003', name: '报告单',	icon: 'report',			component: CheckReportList, hideNavBar: true, navTitle: '报告单',},
	{code: '004', name: '就诊记录',	icon: 'treat',			component: TreatList,		hideNavBar: true, navTitle: '就诊记录',},
	{code: '006', name: '公共资讯',	icon: 'news',			component: News, 			hideNavBar: true, navTitle: '公共资讯',},
	/*{code: '999', name: '导诊',		icon: 'chain',		component: OGList, 			hideNavBar: true, navTitle: '导诊', passProps: {hideBackButton: false}},*/
];

let itemWidth = (Global.getScreen().width - 4)/3;

class Home extends Component {

    static displayName = 'ELH_Home';
    static description = '就医首页';

    static propTypes = {
    };

    static defaultProps = {
    };

	state = {
		doRenderScene: false,
		data: null,
		services: services,
	};

    constructor (props) {
        super(props);

        this.onPressMenuItem = this.onPressMenuItem.bind(this);
        this._renderMenu = this._renderMenu.bind(this);
    }

	componentDidMount () {
		InteractionManager.runAfterInteractions(() => {
			this.setState({doRenderScene: true});
		});
	}

	onPressMenuItem (component, hideNavBar, navTitle, passProps) {
    	if(component)
	        this.props.navigator.push({
	        	title: navTitle,
	            component: component,
	            hideNavBar: hideNavBar ? hideNavBar : false,
	            passProps: passProps,
	        });
	    else
	    	this.toast(navTitle + '即将开通');
    }

	render () {
		if(!this.state.doRenderScene)
			return this._renderPlaceholderView();

		return (
			<View style = {Global._styles.CONTAINER} >
				{this._getNavBar()}
				<ScrollView automaticallyAdjustContentInsets = {false} style = {styles.scrollView} >

					<OGNoticeBoard navigator = {this.props.navigator} route = {this.props.route} />

					<View style={styles.menu} >
			    		{this._renderMenu()}
			    	</View>

				</ScrollView>
			</View>
		);
	}

	/**
	 * 渲染所有菜单项
	 */
	_renderMenu () {
		let iconWidth = Global.getScreen().width / 5;
		return this.state.services.map(
			({code, name, icon, iconSize, iconColor, component, hideNavBar, navTitle, passProps}, idx) => {
				let bgColor = idx >= 6 ? bgColors[idx % 6] : bgColors[idx];
				return (
					<TouchableOpacity key = {code} style = {[styles.menuItem]} onPress = {() => {this.onPressMenuItem(component, hideNavBar, navTitle, passProps)}} >
			    		<View style = {{
							width: iconWidth,
							height: iconWidth,
							borderRadius: iconWidth / 2,
							backgroundColor: bgColor,
							alignItems: 'center',
							justifyContent: 'center',
						}} >
				    		<Image 
				    			resizeMode = 'cover'
				    			source = {icons[icon]}
				    			style = {{
				    				width: iconWidth / 2,
				    				height: iconWidth / 2,
				    				backgroundColor: 'transparent',
				    			}}
				    		/>
			    		</View>
			    		<Text style = {[styles.text]}>{name}</Text>
			    	</TouchableOpacity>
				);
			}
		);
	}

	_renderPlaceholderView () {
		return (
			<View style = {Global._styles.CONTAINER}>
			    {this._getNavBar()}
			</View>
		);
	}

	_getNavBar () {
		return (
			<NavBar title = '就医' 
		    	navigator = {this.props.navigator} 
				route = {this.props.route} />
		);
	}

}

const styles = StyleSheet.create({
	scrollView: {
		flex: 1,
	},

	menu: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        overflow: 'hidden', 
        backgroundColor: 'transparent',
	},
	menuItem: {
		width: itemWidth,
		height: itemWidth + 30,
		justifyContent: 'center',
		alignItems: 'center',
		marginLeft: 1,
	},
	text: {
		width: itemWidth - 10,
		fontSize: 15,
		textAlign: 'center',
		overflow: 'hidden',
		marginTop: 15,
	},
});

export default Home;

