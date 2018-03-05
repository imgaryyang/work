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

import * as Global  from '../../Global';

import NavBar       from 'rn-easy-navbar';
import EasyIcon     from 'rn-easy-icon';

const MENU_URL = 'elh/';

/**
 * 系统提供的服务
 */
const services = [
	{code: '010', name: '医疗账户查询', 	icon: 'list-alt', 		iconSize: 23, iconColor: '#FF6600', component: null, 	hideNavBar: true, navTitle: '医疗账户查询',},
	{code: '001', name: '医疗消费明细', 	icon: 'plus-square-o', 	iconSize: 23, iconColor: '#FF6600', component: null, 	hideNavBar: true, navTitle: '医疗消费明细',},
	{code: '002', name: '社保缴费明细', 	icon: 'bar-chart', 		iconSize: 23, iconColor: '#FF6600', component: null, 	hideNavBar: true, navTitle: '社保缴费明细',},
	{code: '003', name: '养老个人账户', 	icon: 'heartbeat',		iconSize: 26, iconColor: '#FF6600', component: null, 	hideNavBar: true, navTitle: '养老个人账户',},
	{code: '004', name: '养老待遇发放明细', icon: 'tasks',			iconSize: 26, iconColor: '#FF6600', component: null,	hideNavBar: true, navTitle: '养老待遇发放明细',},
	{code: '005', name: '个人参保信息', 	icon: 'newspaper-o',	iconSize: 22, iconColor: '#FF6600', component: null, 	hideNavBar: true, navTitle: '个人参保信息',},
];

class SIServices extends Component {

    static displayName = 'SIServices';
    static description = '社会保险';

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

        this.fetchTest = this.fetchTest.bind(this);

        this.onPressMenuItem = this.onPressMenuItem.bind(this);

        this._renderMenu = this._renderMenu.bind(this);
    }

	componentDidMount () {
		InteractionManager.runAfterInteractions(() => {
			this.setState({doRenderScene: true});
		});
	}

	async fetchTest () {
		try {
			/*let res = await this.request('http://182.48.115.37:8081/iMovie/yppt/getWillFilms.do');
			this.setState({data: JSON.stringify(res)});*/
		} catch(e) {
		}
	}

	onPressMenuItem (component, hideNavBar, navTitle) {
    	if(component)
	        this.props.navigator.push({
				title: navTitle,
	            component: component,
	            hideNavBar: hideNavBar ? hideNavBar : false,
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
					<View style={{
						height: 1 / Global._pixelRatio, 
						backgroundColor: Global._colors.IOS_SEP_LINE, 
						top: -(1 / Global._pixelRatio)}} 
					/>

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
		return this.state.services.map(
			({code, name, icon, iconSize, iconColor, component, hideNavBar, navTitle, key}, idx) => {
				let noLeftBorder = ((idx + 1) % 3 == 0) ? styles.noLeftBorder : null;
				let iconDisplayColor = component ? iconColor : iconColor;
				
				return (
					<TouchableOpacity key = {code} style = {[styles.menuItem, noLeftBorder]} onPress = {() => {this.onPressMenuItem(component, hideNavBar, navTitle)}} >
			    		<EasyIcon iconLib = 'fa' style = {[styles.icon]} name = {icon} size = {iconSize} color = {iconDisplayColor} />
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
			<NavBar title = '社会保险' 
		    	navigator = {this.props.navigator} 
				route = {this.props.route}
		    	hideBackButton = {false}
		    	hideBottomLine = {false} />
		);
	}
}

let itemWidth = (Global.getScreen().width * Global._pixelRatio - 1)/3/Global._pixelRatio;

const styles = StyleSheet.create({
	scrollView: {
		flex: 1,
		backgroundColor: 'white',
		marginBottom: Global._os == 'ios' ? 48 : 0,
	},
	menu: {
        flex: 1,
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
        backgroundColor: 'rgba(0,0,0,0)',
		borderWidth: 1 / Global._pixelRatio,
		borderColor: Global._colors.IOS_SEP_LINE,
		borderLeftWidth: 0,
		borderTopWidth: 0,
	},
	noLeftBorder: {
		borderRightWidth: 0,
	},

	text: {
		width: itemWidth - 10,
		fontSize: 13,
		textAlign: 'center',
		overflow: 'hidden',
	},
	icon: {
		width: 40,
		height: 40,
	},
});

export default SIServices;

