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

const icons = {
	'mi-acct':		require('../../res/images/base/mi-acct.png'),
	'mi-detail': 	require('../../res/images/base/mi-detail.png'),
	'si-acct': 		require('../../res/images/base/si-acct.png'),
	'si-detail':	require('../../res/images/base/si-detail.png'),
	'si-info':		require('../../res/images/base/si-info.png'),
	'si-pay':		require('../../res/images/base/si-pay.png'),
};

/**
 * 系统提供的服务
 */
const services = [
	{code: '010', name: '医疗账户查询', 		icon: 'mi-acct', 	component: null, 	hideNavBar: true, navTitle: '医疗账户查询',},
	{code: '001', name: '医疗消费明细', 		icon: 'mi-detail', 	component: null, 	hideNavBar: true, navTitle: '医疗消费明细',},
	{code: '002', name: '社保缴费明细', 		icon: 'si-pay', 	component: null, 	hideNavBar: true, navTitle: '社保缴费明细',},
	{code: '003', name: '养老个人账户', 		icon: 'si-acct',	component: null, 	hideNavBar: true, navTitle: '养老个人账户',},
	{code: '004', name: '养老待遇发放明细', 	icon: 'si-detail',	component: null,	hideNavBar: true, navTitle: '养老待遇发放明细',},
	{code: '005', name: '个人参保信息', 		icon: 'si-info',	component: null, 	hideNavBar: true, navTitle: '个人参保信息',},
];

const bgColors = ['#ff6666','#ffcf2f','#8b8ffa','#4dc7ee','#2bd3c2','#ff80c3',];

let itemWidth = (Global.getScreen().width - 4)/3;

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
		let iconWidth = Global.getScreen().width / 5;
		return this.state.services.map(
			({code, name, icon, iconSize, iconColor, component, hideNavBar, navTitle, passProps}, idx) => {
				
				return (
					<TouchableOpacity key = {code} style = {[styles.menuItem]} onPress = {() => {this.onPressMenuItem(component, hideNavBar, navTitle, passProps)}} >
			    		<View style = {{
							width: iconWidth,
							height: iconWidth,
							borderRadius: iconWidth / 2,
							borderColor: Global._colors.FONT_GRAY,
							borderWidth: 1 / Global._pixelRatio,
							alignItems: 'center',
							justifyContent: 'center',
						}} >
				    		<Image 
				    			resizeMode = 'cover'
				    			source = {icons[icon]}
				    			style = {{
				    				width: iconWidth / 2.5,
				    				height: iconWidth / 2.5,
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
			<NavBar title = '社会保险' 
		    	navigator = {this.props.navigator} 
				route = {this.props.route}
		    	hideBackButton = {false}
		    	hideBottomLine = {false} />
		);
	}
}

const styles = StyleSheet.create({
	scrollView: {
		flex: 1,
		marginBottom: Global._os == 'ios' ? 48 : 0,
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
		fontSize: 13,
		textAlign: 'center',
		overflow: 'hidden',
		marginTop: 15,
	},
});

export default SIServices;

