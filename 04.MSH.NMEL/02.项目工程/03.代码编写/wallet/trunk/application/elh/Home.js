/**
 * 就医功能首页
 */
'use strict';

import React, {
    Component,
    PropTypes,
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

import EasyIcon     	from 'rn-easy-icon';
import NavBar       	from 'rn-easy-navbar';

import Register     	from './register/Register';
import TreatList    	from './treatment-his/TreatmentHis';
import PatientsList 	from './patients/PatientsList';
import OGList 			from './outpatient/OutpatientGuidanceList';
import OGNoticeBoard 	from './outpatient/OGNoticeBoard';
import CheckReportList 	from './check/CheckReportList';
import HospList 		from './hospital/HospList';
import News 			from './news/News';

const MENU_URL = 'el/';

/**
 * 系统提供的服务
 */
const services = [
	{code: '000', name: '医院',		icon: 'hospital-o', iconSize: 26, iconColor: '#FF6600', component: HospList, 		hideNavBar: true, navTitle: '找医院',},
	{code: '001', name: '常用就诊人',	icon: 'group', 		iconSize: 26, iconColor: '#FF6600', component: PatientsList, 	hideNavBar: true, navTitle: '常用就诊人',},
	{code: '002', name: '实时挂号',	icon: 'flag',		iconSize: 26, iconColor: '#FF6600', component: Register, 		hideNavBar: true, navTitle: '实时挂号',},
	{code: '003', name: '报告单',	icon: 'book',		iconSize: 26, iconColor: '#FF6600', component: CheckReportList, hideNavBar: true, navTitle: '报告单',},
	{code: '004', name: '就诊记录',	icon: 'database',	iconSize: 26, iconColor: '#FF6600', component: TreatList,		hideNavBar: true, navTitle: '就诊记录',},
	{code: '006', name: '公共资讯',	icon: 'newspaper-o',iconSize: 26, iconColor: '#FF6600', component: News, 			hideNavBar: true, navTitle: '公共资讯',},
	{code: '999', name: '导诊',		icon: 'chain',		iconSize: 26, iconColor: '#FF6600', component: OGList, 			hideNavBar: true, navTitle: '导诊', passProps: {hideBackButton: false}},
];

const bgColors = ['#ff6666','#ffcf2f','#8b8ffa','#4dc7ee','#2bd3c2','#ff80c3',];

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
		let iconWidth = Global.getScreen().width / 6;
		return this.state.services.map(
			({code, name, icon, iconSize, iconColor, component, hideNavBar, navTitle, passProps}, idx) => {
				let bgColor = idx >= 6 ? bgColors[idx % 6] : bgColors[idx];
				return (
					<TouchableOpacity key = {code} style = {[styles.menuItem]} onPress = {() => {this.onPressMenuItem(component, hideNavBar, navTitle, passProps)}} >
			    		<EasyIcon 
			    			iconLib = "fa" 
			    			name = {icon} 
			    			size = {iconSize} 
			    			color = "white" 
			    			width = {iconWidth} 
			    			height = {iconWidth} 
			    			radius = {iconWidth / 2}
			    			bgColor = {bgColor} 
			    		/>
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
		height: itemWidth,
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

