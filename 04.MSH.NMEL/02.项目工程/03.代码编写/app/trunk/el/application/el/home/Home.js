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
import UserAction	from '../../flux/UserAction';
import UserStore	from '../../flux/UserStore';
import AuthAction	from '../../flux/AuthAction';

import NavBar       from 'rn-easy-navbar';
import Button       from 'rn-easy-button';
import Separator    from 'rn-easy-separator';
import EasyIcon     from 'rn-easy-icon';
import Portrait     from 'rn-easy-portrait';

import SampleMenu	from '../../tmp/sample/SampleMenu';
import WebViewSample from '../../tmp/WebViewSample';
import Test         from '../../lib/nav/Test';

import ELPHome		from '../../elp/Home';
import SalaryList	from '../../els/SalaryList';
import ELHHome		from '../../elh/Home';
import SIServices	from '../../elh/si/SIServices';
import RegResource  from '../../elh/register/RegisterResource.js';
import HosHome    	from '../../hospitalhome/Home.js';
import MedAlarmList from '../../elh/medAlarm/MedAlarmList';      /*用药*/

/*add by shikai*/
import IconBadge 	from 'react-native-icon-badge';				  /*微标*/
import ScanCode		from '../scancode/ScanCode';                  /*扫一扫*/
import Message		from '../message/Message';					  /*消息*/
import CashierTest 	from '../cashier-desk/CashierTest';			  /*收银台*/

const MENU_URL = 'el/';

const icons = {
  'salary': require('../../res/images/base/salary.png'),
  'pay':  	require('../../res/images/base/pay.png'),
  'reg':    require('../../res/images/base/reg.png'),
  'treat':  require('../../res/images/base/treat.png'),
  'si':     require('../../res/images/base/si.png'),
  'med':  	require('../../res/images/base/med.png'),
};

/**
 * 系统提供的服务
 */
const services = [
	{code: '001', name: '工资', 		icon: 'salary',  component: SalaryList, 	hideNavBar: true, navTitle: '工资',},
	{code: '002', name: '缴费', 		icon: 'pay', 	 component: ELPHome, 		hideNavBar: true, navTitle: '缴费',},
	{code: '003', name: '挂号', 		icon: 'reg',	 component: RegResource, 	hideNavBar: true, navTitle: '挂号',},
	{code: '004', name: '就医', 		icon: 'treat',	 component: ELHHome,		hideNavBar: true, navTitle: '就医',},
	{code: '005', name: '社保', 		icon: 'si',		 component: SIServices, 	hideNavBar: true, navTitle: '社保',},
	{code: '006', name: '用药', 		icon: 'med',	 component: MedAlarmList, 	hideNavBar: true, navTitle: '用药',},
	/*{code: '901', name: '样例', 		icon: 'salary',  component: SampleMenu, 	hideNavBar: true, navTitle: '样例',},
	{code: '904', name: '专属APP', 	icon: 'treat', 	 component: HosHome, 		hideNavBar: true, navTitle: '专属App',},
	{code: '905', name: '收银台', 	icon: 'si', 	 component: CashierTest, 	hideNavBar: true, navTitle: '收银台',},*/
];

const bgColors = ['#ff6666','#ffcf2f','#8b8ffa','#4dc7ee','#2bd3c2','#ff80c3',];

let itemWidth = (Global.getScreen().width - 4)/3;
let topImgHeight = Global.getScreen().width * 255 / 750;

class Home extends Component {

    static displayName = 'Home';
    static description = '首页';

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

        this.fetchTest = this.fetchTest.bind(this);
    }

	componentDidMount () {
		InteractionManager.runAfterInteractions(() => {
			this.setState({doRenderScene: true});
		});
	}

	async fetchTest () {
		console.log('--------------------------------');
		try {
			let res = await this.request('http://182.48.115.37:8081/iMovie/yppt/getWillFilms.do');
			this.setState({data: JSON.stringify(res)});
		} catch(e) {
			console.log('eeeeeeeeeeeeeeeeeeeeeeee');
			console.log(e);
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
				<View automaticallyAdjustContentInsets = {false} style = {styles.scrollView} >

					<View style={styles.menu} >
			    		{this._renderMenu()}
			    	</View>
				    
				</View>

				<Image resizeMode = 'cover' source = {require('../../res/images/base/home-top-bg.jpg')} style = {[styles.topImg, Global._styles.CENTER]} >
					<Text style = {{fontSize: 15, color: '#9e9dad', marginTop: 50}} >有易在手 生活无忧</Text>
				</Image>
			</View>
		);
	}

	/**
	 * 渲染所有菜单项
	 */
	_renderMenu () {
		let iconWidth = Global.getScreen().width / 5;
		return this.state.services.map(
			({code, name, icon, component, hideNavBar, navTitle, key}, idx) => {
				let bgColor = idx >= 6 ? bgColors[idx % 6] : bgColors[idx];
				return (
					<TouchableOpacity key = {code} style = {[styles.menuItem]} onPress = {() => {this.onPressMenuItem(component, hideNavBar, navTitle)}} >
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
			<NavBar title = '易民生' 
		    	navigator = {this.props.navigator} 
				route = {this.props.route}
		    	hideBackButton = {true}
		    	hideBottomLine = {false} 
		    	leftButtons = {(
		    		<Button onPress = {() => {this.props.navigator.push({component: ScanCode, hideNavBar: true})}} stretch = {false} clear = {true} style = {Global._styles.NAV_BAR.BUTTON} >
						<Image 
			    			resizeMode = 'cover'
			    			source = {require('../../res/images/base/scan.png')}
			    			style = {{
			    				width: 16,
			    				height: 16,
			    				backgroundColor: 'transparent',
			    			}}
			    		/>
					</Button>
		    	)}
		    	rightButtons={(
		    		<View style={[Global._styles.NAV_BAR.BUTTON_CONTAINER, Global._styles.NAV_BAR.RIGHT_BUTTONS]}>
	                    <Button onPress={() => {this.onPressMenuItem(Message, true, null)}} stretch = {false} clear = {true} style = {Global._styles.NAV_BAR.BUTTON} >
							<Image 
				    			resizeMode = 'cover'
				    			source = {require('../../res/images/base/msg.png')}
				    			style = {{
				    				width: 16,
				    				height: 16,
				    				backgroundColor: 'transparent',
				    			}}
				    		/>
						</Button>
					</View>
                )}
                centerComponent = {(
	                <View style = {[Global._styles.NAV_BAR.CENTER_VIEW]}>
	                	<Image 
			    			resizeMode = 'cover'
			    			source = {Global._logo['sw']}
			    			style = {{
			    				width: 26,
			    				height: 26,
			    				backgroundColor: 'transparent',
			    			}}
			    		/>
			    	</View>
                )}
            />
		);
	}
}

const styles = StyleSheet.create({
	scrollView: {
		flex: 1,
		marginBottom: Global._os == 'ios' ? 48 : 0,
	},
	menu: {
		marginTop: topImgHeight,
        flex: 1,
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

	topImg: {
		position: 'absolute',
		top: Global._navBarHeight,
		left: 0,
		width: Global.getScreen().width,
		height: topImgHeight,
	},
});

export default Home;

