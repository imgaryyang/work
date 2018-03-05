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

import SampleMenu	from '../../tmp/sample/SampleMenu';
import WebViewSample from '../../tmp/WebViewSample';

import ELPHome		from '../../elp/Home';
import SalaryList	from '../../els/SalaryList';
import ELHHome		from '../../elh/Home';
import SIServices	from '../../elh/si/SIServices';
import RegResource  from '../../elh/register/RegisterResource.js';
import HosHome    	from '../../hospitalhome/Home.js';
import NewsMain    	from '../common/news/main.js';

import NavBar       from 'rn-easy-navbar';
import Button       from 'rn-easy-button';
import Separator    from 'rn-easy-separator';
import EasyIcon     from 'rn-easy-icon';
import Switcher		from 'rn-easy-switcher';

/*add by shikai*/
import ScanCode		from '../scancode/ScanCode';                  /*扫一扫*/
import Message		from '../message/Message';					  /*消息*/
import IconBadge 	from 'react-native-icon-badge';				  /*微标*/
import CashierTest 	from '../cashier-desk/CashierTest';			  /*收银台*/

const MENU_URL = 'el/';

/**
 * 系统提供的服务
 */
const services = [
	{code: '001', name: '工资', 		icon: 'credit-card', 	iconSize: 35, iconColor: '#FF6600', component: SalaryList, 	hideNavBar: true, navTitle: '工资',},
	{code: '002', name: '缴费', 		icon: 'fire', 			iconSize: 35, iconColor: '#FF6600', component: ELPHome, 	hideNavBar: true, navTitle: '缴费',},
	{code: '003', name: '挂号', 		icon: 'flag-checkered',	iconSize: 35, iconColor: '#FF6600', component: RegResource, hideNavBar: true, navTitle: '挂号',},
	{code: '004', name: '就医', 		icon: 'heartbeat',		iconSize: 35, iconColor: '#FF6600', component: ELHHome,		hideNavBar: true, navTitle: '就医',},
	{code: '005', name: '医保', 		icon: 'life-saver',		iconSize: 35, iconColor: '#FF6600', component: SIServices, 	hideNavBar: true, navTitle: '医保',},
	{code: '006', name: '用药', 		icon: 'flask',			iconSize: 35, iconColor: '#FF6600', component: null, 		hideNavBar: true, navTitle: '用药',},
	{code: '901', name: '样例', 		icon: 'space-shuttle', 	iconSize: 35, iconColor: '#FF6600', component: SampleMenu, 	hideNavBar: true, navTitle: '样例',},
	{code: '902', name: 'WebView', 	icon: 'chrome', 		iconSize: 35, iconColor: '#FF6600', component: WebViewSample, hideNavBar: true, navTitle: 'WebView',},
	{code: '903', name: '新闻', 		icon: 'newspaper-o', 	iconSize: 35, iconColor: '#FF6600', component: NewsMain, 	hideNavBar: true, navTitle: '新闻主页',},
	{code: '904', name: '专属APP', 	icon: 'heartbeat', 		iconSize: 35, iconColor: '#FF6600', component: HosHome, 	hideNavBar: true, navTitle: '专属App',},
	{code: '905', name: '收银台', 	icon: 'chrome', 		iconSize: 23, iconColor: '#FF6600', component: CashierTest, hideNavBar: true, navTitle: '收银台',},
];

const bgColors = ['#ff6666','#ffcf2f','#8b8ffa','#4dc7ee','#2bd3c2','#ff80c3',];

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
			<NavBar title = '易民生' 
		    	navigator = {this.props.navigator} 
				route = {this.props.route}
		    	hideBackButton = {true}
		    	hideBottomLine = {false} 
		    	leftButtons = {(
		    		<Button onPress = {() => {this.props.navigator.push({component: ScanCode, hideNavBar: true})}} stretch = {false} clear = {true} style = {Global._styles.NAV_BAR.BUTTON} >
						<EasyIcon iconLib = "fa" name = "qrcode" size = {25} />
					</Button>
		    	)}
		    	rightButtons={(
                    <View style={[Global._styles.NAV_BAR.BUTTON_CONTAINER, Global._styles.NAV_BAR.RIGHT_BUTTONS]}>
                        <IconBadge
	                        MainElement={
								<View style={[Global._styles.NAV_BAR.BUTTON_CONTAINER, Global._styles.NAV_BAR.RIGHT_BUTTONS]}>
									<TouchableOpacity style={[Global._styles.NAV_BAR.BUTTON]}  onPress={()=>{this.onPressMenuItem(Message, true, null)}}>
										<EasyIcon iconLib = 'fa' style = {[styles.icon]} name = 'envelope-o' size = {25} />
									</TouchableOpacity>
								</View>
	                        }
	                        BadgeElement={
	                          	<Text style={{color: '#FFFFFF', fontSize: 12}} >2</Text>
	                        }
	                        IconBadgeStyle={{
	                        	width: 16,
								height: 16,
								backgroundColor: '#FF0000',
							}}
                        />
                    </View>
                )}/>
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
		fontSize: 15,
		textAlign: 'center',
		overflow: 'hidden',
	},
	icon: {
		width: 60,
		height: 60,
	},
});

export default Home;

