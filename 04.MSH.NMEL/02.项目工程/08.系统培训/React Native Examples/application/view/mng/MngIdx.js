'use strict';

var React = require('react-native');
//var Icon = require('react-native-vector-icons/Ionicons');
var FAIcon = require('react-native-vector-icons/FontAwesome');
var Global = require('../../Global');
var Services = require('../../Services');
var NavBar = require('../NavBar');

var UtilsMixin = require('../lib/UtilsMixin');
var TimerMixin = require('react-timer-mixin');

var {
	StyleSheet,
	ScrollView,
	View,
	Text,
	Image,
    PixelRatio,
	TouchableOpacity,
	Navigator,
	Dimensions,
	InteractionManager,
} = React;

var MngIdx = React.createClass({

	mixins: [UtilsMixin, TimerMixin],

	services: [],

    componentDidMount: function() {
		InteractionManager.runAfterInteractions(() => {
			this.setState({doRenderScene: true});
		});
	},

	getInitialState: function() {
		let role = this.props.USER_LOGIN_INFO && this.props.USER_LOGIN_INFO.role ? this.props.USER_LOGIN_INFO.role : 0;
		this.getServices(role);
		return {
			doRenderScene: false,
			role: role, //0 - 普通用户 ； 1 - 企业主 ； 2 - 企业员工
			services: this.services,
		};
	},

	componentWillReceiveProps: function(props) {
		/*this.setState(
			{services: []},
			() => {*/
				if(props.USER_LOGIN_INFO) {
					if(props.USER_LOGIN_INFO.role != this.state.role) {
						this.getServices(props.USER_LOGIN_INFO.role);
						this.setState({
							role: props.USER_LOGIN_INFO.role,
							services: this.services,
						});
					}
				} else {
					this.getServices(0);
					this.setState({
						role: 0,
						services: this.services,
					});
				}
		/*	}
		);*/
	},

	getServices: function(role) {
		//console.log(Services.services);
		this.services = [];
		if 		(role == 0) 	this.services = this.services.concat(Services.services.basic);
		else if (role == 1) 	this.services = this.services.concat(Services.services.basic).concat(Services.services.boss);
		else if (role == 2) 	this.services = this.services.concat(Services.services.basic).concat(Services.services.empl);
		//console.log(this.services);
		this.appendBlankMenuItem();
	},

	/**
	 * 在所有服务后加选择更多服务的按钮
	 * 如果服务数量不能被4整除，则加入相应数量的空项
	 */
	appendBlankMenuItem: function() {
		this.services[this.services.length] = {key: '_MORE_', code: '_MORE_', name: '更多服务', icon: 'ellipsis-h', iconSize: 15};
		let i = 0;
		while(this.services.length % 4 != 0) {
			this.services[this.services.length] = {key: '_BLANK_' + i, code: '_BLANK_'};
			i += 1;
		}
	},

    /*onPressMenu : function(title, component, hideNavBar) {
        this.props.navigator.push({
        	title: title,
            component: component,
            hideNavBar: hideNavBar ? hideNavBar : false,
        });
    },*/

    onPressMenuItem: function(component, hideNavBar, navTitle) {
    	if(component)
	        this.props.navigator.push({
	        	title: navTitle,
	            component: component,
	            hideNavBar: hideNavBar ? hideNavBar : false,
	            sceneConfig: Global.os == 'ios' ? Navigator.SceneConfigs.FloatFromBottom : Navigator.SceneConfigs.FloatFromBottomAndroid,
	        });
	    else
	    	this.toast(navTitle + '即将开通');
    },

    addServices: function() {

    },

	render: function() {
		if(!this.state.doRenderScene)
			return this._renderPlaceholderView();

		return (
			<View style={Global.styles.CONTAINER}>
			    {this._getNavBar()}
			    <View style={[styles.fixedMenuHolder]} >
			    	{this._renderFixedMenu()}
			    </View>
				<ScrollView 
					automaticallyAdjustContentInsets={false} 
					style={[styles.sv]}>
			    	{/*<Image source={require('../../res/images/mng-idx-bg-1-blur.png')} resizeMode='cover' style={[styles.row, styles.firstRowImg]}>
				    	{this._renderFixedMenu()}
			    	</Image>*/}
			    	<View style={Global.styles.FULL_SEP_LINE} />
			    	<View style={styles.menu} >
			    		{this._renderMenu()}
			    	</View>

            		<View style={Global.styles.PLACEHOLDER20} />
			    </ScrollView>
		    </View>
		);
	},

	_renderFixedMenu: function() {
		return Services.services.fixed.map(
			({code, name, icon, iconSize, iconColor, component, hideNavBar, navTitle}, idx) => {
				return (
					<TouchableOpacity key={code} style={[styles.firstRowCol]} onPress={()=>{this.onPressMenuItem(component, hideNavBar, navTitle)}}>
			    		<FAIcon style={[styles.icon]} name={icon} size={iconSize} color={iconColor} />
			    		<Text style={[styles.text, styles.firstRowText]}>{name}</Text>
			    	</TouchableOpacity>
				);
			}
		);
	},

	/**
	 * 渲染所有菜单项
	 */
	_renderMenu: function(services) {
		return this.state.services.map(
			({code, name, icon, iconSize, iconColor, component, hideNavBar, navTitle, key}, idx) => {
				let noLeftBorder = (idx % 4 == 0) ? styles.noLeftBorder : null;
				let iconDisplayColor = component ? iconColor : iconColor;//Global.colors.IOS_GRAY_FONT;
				if(code == '_MORE_') {
					return (
						<TouchableOpacity key={key} style={[styles.menuItem, noLeftBorder]} onPress={this.addServices} >
				    		<FAIcon style={[styles.icon, {paddingTop: 10}]} name={icon} size={iconSize} color={Global.colors.IOS_LIGHT_GRAY} />
				    		<Text style={[styles.text, {color: Global.colors.IOS_GRAY_FONT}]}>{name}</Text>
				    	</TouchableOpacity>
					);
				} else if(code == '_BLANK_') {
					return (
						<View key={key} style={[styles.menuItem, noLeftBorder]} />
					);
				} else {
					return (
						<TouchableOpacity key={code} style={[styles.menuItem, noLeftBorder]} onPress={() => {this.onPressMenuItem(component, hideNavBar, navTitle)}} >
				    		<FAIcon style={[styles.icon]} name={icon} size={iconSize} color={iconDisplayColor} />
				    		<Text style={[styles.text]}>{name}</Text>
				    	</TouchableOpacity>
					);
				}
			}
		);
	},

	_renderPlaceholderView: function() {
		return (
			<View style={Global.styles.CONTAINER}>
			    {this._getNavBar()}
			</View>
		);
	},

	_getNavBar: function() {
		return (
			<NavBar title='管家' 
		    	navigator={this.props.navigator} 
				route={this.props.route}
		    	hideBackButton={true} 
		    	hideBottomLine={false} 
		    	theme={NavBar.THEME.BLUE}
		    	statusBarStyle='light-content'
		    	flow={false} />
		);
	},
});

var itemWidth = (Global.getScreen().width * Global.pixelRatio - 1)/4/Global.pixelRatio;

var styles = StyleSheet.create({
	sv: {
		flex: 1,
		backgroundColor: 'white',
		marginBottom: Global.os == 'ios' ? 48 : 0,
	},

	row: {
		flexDirection: 'row',
		height: itemWidth,
		backgroundColor: '#FFFFFF',
	},
	firstRowImg: {
		borderWidth: 0,
		flex: 1,
		width: Global.getScreen().width,
	},
	firstRowCol: {
		flex: 1,
		backgroundColor: 'transparent',
		justifyContent: 'center',
		alignItems: 'center',
	},
	firstRowText: {
		color: '#ffffff',
		fontSize: 16,
	},

	fixedMenuHolder: {
		width: Global.getScreen().width,
		height: Global.getScreen().width / 4,
		backgroundColor: 'rgba(68, 92, 149, 1)',
		flexDirection: 'row',
	},

	/*col: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		width: Global.getScreen().width/4,
		borderLeftWidth: 1 / Global.pixelRatio,
		borderLeftColor: Global.colors.IOS_SEP_LINE,
	},
	firstCol: {
		borderLeftWidth: 0,
	},*/

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
		borderWidth: 1 / Global.pixelRatio,
		borderColor: Global.colors.IOS_SEP_LINE,
		borderRightWidth: 0,
		borderTopWidth: 0,
	},
	noLeftBorder: {
		borderLeftWidth: 0,
	},

	text: {
		width: itemWidth - 10,
		fontSize: 13,
		textAlign: 'center',
		overflow: 'hidden',
	},
	icon: {
		textAlign: 'center',
		width: 40,
		height: 40,
	},
});

module.exports = MngIdx;
