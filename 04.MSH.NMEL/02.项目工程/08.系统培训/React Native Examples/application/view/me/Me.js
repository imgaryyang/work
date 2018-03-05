'use strict';

var React = require('react-native');
var NavBar = require('../NavBar');
var Global = require('../../Global');
var Icon = require('react-native-vector-icons/Ionicons');
var Profile = require('./Profile');
var Settings = require('./Settings');
var Login = require('../login');
var CompanyView = require('./CompanyView');
var Mine = require('./Mine');
var UserAction = require('../actions/UserAction');
var UtilsMixin = require('../lib/UtilsMixin');
var TimerMixin = require('react-timer-mixin');
// var ScrollableMixin = require('react-native-scrollable-mixin');


var {
	StyleSheet,
	ScrollView,
	View,
	Text,
	Image,
	TouchableOpacity,
	InteractionManager,
	AsyncStorage,
	Alert,
	StatusBarIOS,
	Animated,
	Navigator,
} = React;

var LOGIN_OUT = "login/logout";
var userModel = {};

var Me = React.createClass({

	mixins: [UtilsMixin, TimerMixin],

    statics: {
        title: 'Me',
        description: '我',
    },

    randomColors: [],

    getList: function() {
    	return [
	        {text: '个人资料', icon: 'ios-paper-outline', component: Profile},
	        {text: '企业信息', icon: 'ios-albums-outline', component: CompanyView},
            {text: '我的', icon: 'ios-list-outline', component: Mine},
	        {text: '支付方式', icon: 'ios-bookmarks-outline', component: null},
	        {text: '账户安全', icon: 'ios-medkit-outline', component: null, separator: true},
	        
	        {text: '消息提醒', icon: 'ios-bell-outline', component: null},
	        {text: '关于', icon: 'ios-color-wand-outline', component: null},
	        {text: '退出', icon: 'ios-arrow-thin-left', func: this.logout},
	    ];
    },

	getInitialState: function() {
        //this.getRandomColors();
		return {
			USER_LOGIN_INFO: this.props.USER_LOGIN_INFO,
			scrollY: new Animated.Value(0),
		};
	},

	componentWillReceiveProps: function(props) {
		this.setState({
			USER_LOGIN_INFO: props.USER_LOGIN_INFO,
		});
	},

    getRandomColors: function() {
        this.randomColors = [];
        for(var i = 0 ; i < 50 ; i++){
            this.randomColors[this.randomColors.length] = Global.getRandomColor();
        }
    },

    push: function(title, component, passProps) {
    	if(component != null)
	        this.props.navigator.push({
	            title: title,
	            component: component,
	            hideNavBar: false,
	        	sceneConfig: Global.os == 'ios' ? Navigator.SceneConfigs.FloatFromBottom : Navigator.SceneConfigs.FloatFromBottomAndroid,
                passProps: passProps ? passProps : null,
	        });
    },

	componentDidMount: function() {
		InteractionManager.runAfterInteractions(() => {
			this.setState({doRenderScene: true});
		});
	},

    settings: function() {
        this.props.navigator.push({
            title: '系统设置',
            component: Settings,
        });
    },
	
	refresh: async function(){
		var loginInfo = await LoginService.findLoginInfo();
		Global.USER_LOGIN_INFO = loginInfo;
		
	},

	doEdit: function(title, component, preComponent,preTitle,hideNavBar) {
        this.props.navigator.push({
        	title: title,
            component: component,
            hideNavBar: hideNavBar ? hideNavBar : false,
            preComponent:preComponent,
            preTitle:preTitle,
            passProps: {
        	refresh: this.refresh,
        	},
        });
    },

    logout: function(){
    	Alert.alert(
            '提示',
            '您确定要退出吗？',
            [
            	{text: '取消', style: 'cancel'},
            	{text: '确定', onPress: () => this.doLogout()},
            ]
        );
    },

    doLogout: async function(){
    	this.showLoading();
		try {
			let responseData = await this.request(Global.host + LOGIN_OUT, {method:'get'});
			UserAction.logout();
			this.hideLoading();
			this.props.refreshUser();
		} catch(e) {
			this.requestCatch(e);
		}
    },

    login: function() {
		Global.interceptedRoute = null;
		this.props.navigator._showSubNav({
			component: Login,
			hideNavBar: true,
		});
    },

    /**
     * IMPORTANT: You must return the scroll responder of the underlying
     * scrollable component from getScrollResponder() when using ScrollableMixin.
     */
    getScrollResponder() {
        return this._scrollView.getScrollResponder();
    },

    setNativeProps(props) {
      	this._scrollView.setNativeProps(props);
    },

    getPicBgHeight: function() {
    	return Global.getScreen().width * (1 - 0.618);
    },

    renderBackground: function () {
        var picBgHeight = this.getPicBgHeight();
        var { scrollY } = this.state;
        return (
            <Animated.Image
                style={[styles.bg, {
                    height: picBgHeight,
                    transform: [{
                        translateY: scrollY.interpolate({
                            inputRange: [ -picBgHeight, 0, picBgHeight],
                            outputRange: [picBgHeight/2, 0, -picBgHeight]
                        })
                    }, {
                        scale: scrollY.interpolate({
                            inputRange: [ -picBgHeight, 0, picBgHeight],
                            outputRange: [2, 1, 1]
                        })
                    }]
                }]}
                source={require('../../res/images/mng-idx-bg.png')} 
                resizeMode='cover' >
            </Animated.Image>
        );
    },

	render: function() {
		if(!this.state.doRenderScene)
			return this._renderPlaceholderView();

		if(Global.os == 'ios') {
            StatusBarIOS.setStyle('default');
        }

		let userNameHolder = null;
		if(this.state.USER_LOGIN_INFO == null) {
			userNameHolder = (
				<TouchableOpacity style={styles.userNamePos} onPress={this.login} >
					<Text style={[styles.userName]} >点击此处登录系统</Text>
				</TouchableOpacity>
			);
		} else {
			userNameHolder = (
				<Text style={[styles.userName, styles.userNamePos]} >{this.state.USER_LOGIN_INFO.name}</Text>
			);
		}

		/*var bg = (<Image resizeMode='cover' 
			style={styles.bg} 
			source={require('../../res/images/mng-idx-bg-1.png')} />
		);*/

		var pt = Global.getScreen().width * (1 - 0.618) - 47;

		var portrait = this.state.USER_LOGIN_INFO && this.state.USER_LOGIN_INFO.image ? (
            <Image resizeMode='cover' 
                key={Global.host + Global.userPortraitPath + this.state.USER_LOGIN_INFO.image}
                style={[styles.portrait]} 
                source={{uri: Global.host + Global.userPortraitPath + this.state.USER_LOGIN_INFO.image}} />
        ) : (
            <Image resizeMode='cover' 
                style={[styles.portrait]} 
                source={require('../../res/images/me-portrait-dft.png')} />
        );

		var picBgHeight = this.getPicBgHeight();
		var statusBarMask = Global.os == 'ios' ? (
			<Animated.View style={[styles.statusBarMask, {
		    	opacity: this.state.scrollY.interpolate({
	                inputRange: [-picBgHeight, 0, picBgHeight / 1.2],
	                outputRange: [0, 0, 1]
	            })
		    }]} />) : null;

        var sbh = Global.os == 'ios' ? 20 : 0;

		return (
			<View style={Global.styles.CONTAINER}>
				{this.renderBackground()}
				<ScrollView 
					automaticallyAdjustContentInsets={false} 
					ref={component => { this._scrollView = component; }} 
					style={[styles.sv]}
					onScroll={Animated.event(
                    	[{ nativeEvent: { contentOffset: { y: this.state.scrollY }}}]
                    )}
                    scrollEventThrottle={16} >

                    <View style={{height: 15 + sbh, backgroundColor: 'transparent'}} />

                    <TouchableOpacity 
                        style={[
                            Global.styles.CENTER, 
                            {
                                backgroundColor: 'transparent', 
                                left: Global.getScreen().width - 45, 
                                width: 30, 
                                height: 30,
                            }
                        ]}
                        onPress={this.settings} >
                        <Icon name='ios-gear-outline' size={25} color='white' style={[Global.styles.ICON, {width: 25, height: 25}]} />
                    </TouchableOpacity>

                    <View style={{height: pt - 50 - sbh, backgroundColor: 'transparent'}} />

                    <View style={{flexDirection: 'row'}} >
                        <View style={styles.portraitHolder} >
						  {portrait}
                        </View>
						{userNameHolder}
					</View>
					<View style={Global.styles.PLACEHOLDER20} />
					{this._renderList()}
					<View style={Global.styles.PLACEHOLDER20} />

			    </ScrollView>
			    {statusBarMask}
		    </View>
		);
		
	},

    _renderList: function() {
        
        var list = this.getList().map(({text, icon, component, func, separator, passProps}, idx) => {
            
            var topLine = idx === 0 ? (<View style={Global.styles.FULL_SEP_LINE} />) : null;
            var bottomLine = idx === this.getList().length - 1 ? (<View style={Global.styles.FULL_SEP_LINE} />) : null;

            var itemLine = idx < this.getList().length - 1 ? (<View style={{flex: 1, backgroundColor: '#ffffff'}} ><View style={Global.styles.SEP_LINE} /></View>) : null;
            if(separator === true)
            	itemLine = (
            		<View key={idx + '_' + text} >
	            		<View style={Global.styles.FULL_SEP_LINE} />
	            		<View style={Global.styles.PLACEHOLDER20} />
	            		<View style={Global.styles.FULL_SEP_LINE} />
                	</View>
            	);

            return (
                <View key={idx + '_' + text} >
                    {topLine}
                    <TouchableOpacity style={[styles.listItem, Global.styles.CENTER]} onPress={()=>{
                    	if(func)
                    		func();
                    	else
	                        this.push(text, component, passProps);
                    }} >
                        <View style={[Global.styles.CENTER, styles.listItemIcon, ]} >
                            <Icon name={icon} size={22} color={Global.colors.ORANGE} style={[styles.icon, Global.styles.ICON]} />
                        </View>
                        <Text style={{flex: 1, marginLeft: 10}}>{text}</Text>
                        <Icon name='ios-arrow-right' size={18} color={Global.colors.IOS_ARROW} style={[Global.styles.ICON, {width: 40}]} />
                    </TouchableOpacity>
                    {itemLine}
                    {bottomLine}
                </View>
            );
        });
        return list;
    },

    _renderPlaceholderView: function() {
		return (
			<View style={Global.styles.CONTAINER} >
		    </View>
		);
	},

});

var styles = StyleSheet.create({
	sv: {
		//flex: 1,
		marginBottom: Global.os == 'ios' ? 49 : 0,
		//paddingTop: Global.getScreen().width * (1 - 0.618) - 47,
	},

	bg: {
        position: 'absolute',
		//height: Global.getScreen().width * (1 - 0.618),
		width: Global.getScreen().width,
	},

    portraitHolder: {
        width: 80,
        height: 80,
        marginLeft: 30,
        borderRadius: 7,
        backgroundColor: 'white',
    },
	portrait:{
		width: 80,
		height: 80,
        borderRadius: 7,
	},

    listItem: {
        width: Global.getScreen().width,
        flexDirection: 'row',
        padding: 7,
        paddingLeft: 15,
        paddingRight: 0,
        backgroundColor: 'white',
    },
    listItemIcon: {
        width: 30,
        height: 30,
        borderRadius: 5,
    },
    icon: {
    },

    userName: {
    	color: 'white',
    	textShadowColor: 'rgba(0,0,0,.4)',
    	textShadowOffset: {width: .5, height: 1},
    	textShadowRadius: .5,
    	backgroundColor: 'transparent',
    	height: 20,
    },
    userNamePos: {
    	height: 20,
    	backgroundColor: 'transparent',
    	marginLeft: 20,
    	marginTop: 15,
    },

    statusBarMask: {
    	position: 'absolute',
    	top: 0,
    	left: 0,
    	width: Global.getScreen().width,
    	height: 20,
    	backgroundColor: 'rgba(255, 255, 255, .95)',
    	borderBottomWidth: 1 / Global.pixelRatio,
    	borderBottomColor: Global.colors.IOS_NAV_LINE,
    },
});

module.exports = Me;
