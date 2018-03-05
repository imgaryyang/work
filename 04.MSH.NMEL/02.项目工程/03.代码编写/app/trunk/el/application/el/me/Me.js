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
	Animated,
	Navigator,
	AsyncStorage,
    Alert,
    Switch,
} from 'react-native';

import * as Global  	from '../../Global';
import UserAction       from '../../flux/UserAction';
import AuthAction       from '../../flux/AuthAction';
import UserStore        from '../../flux/UserStore';
import AuthStore        from '../../flux/AuthStore';

import EasyIcon         from 'rn-easy-icon';
import Separator        from 'rn-easy-separator';
import {B, I, U, S}     from 'rn-easy-text';
import Switcher         from 'rn-easy-switcher';

import Profile      	from './Profile'
import SetPatternLock   from './SetPatternLock'
import SecuritySettings from './SecuritySettings'
import ContactUs      	from './ContactUs'
import AboutUs      	from './AboutUs'
import Suggest      	from './Suggest'
import Logoff      		from './Logoff'
import Login      		from './Login'

import JPush 			from 'react-native-jpush';

const IMAGES_URL    = 'el/base/images/view/';
const LOGIN_OUT     = 'el/user/logout';

var sbh = Global._os == 'ios' ? 20 : 0;

const icons = {
	'msg': 		require('../../res/images/base/me/msg.png'),
	'security': require('../../res/images/base/me/security.png'),
	'points': 	require('../../res/images/base/me/points.png'),
	'credit': 	require('../../res/images/base/me/credit.png'),
	'contact': 	require('../../res/images/base/me/contact.png'),
	'about': 	require('../../res/images/base/me/about.png'),
	'feed': 	require('../../res/images/base/me/feed.png'),
	'exit': 	require('../../res/images/base/me/exit.png'),
};

class Me extends Component {

    static displayName = 'Me';
    static description = '个人中心';

    static propTypes = {
        // console.log("Me propTypes");
    };

    static defaultProps = {
    };
    randomColors: [];

	state = {
		doRenderScene: false,
		userInfo: null,
		bankCards: null,
		scrollY: new Animated.Value(0),
        messageSwitch: true,
        //1：关 0： 开
	};

    constructor (props) {

        super(props);

        this.getList = this.getList.bind(this);
        this.componentDidMount = this.componentDidMount.bind(this);
        this.componentWillReceiveProps = this.componentWillReceiveProps.bind(this);
        this.componentWillUnmount = this.componentWillUnmount.bind(this);
        this.onUserStoreChange = this.onUserStoreChange.bind(this);
        this.setState = this.setState.bind(this);


        this.push = this.push.bind(this);
        this.refresh = this.refresh.bind(this);
        this.getUser = this.getUser.bind(this);
        this.logout = this.logout.bind(this);
        this.getList = this.getList.bind(this);
        this.doLogout = this.doLogout.bind(this);
        this.login = this.login.bind(this);
        this.getScrollResponder = this.getScrollResponder.bind(this);
        this.setNativeProps = this.setNativeProps.bind(this);
        this.getPicBgHeight = this.getPicBgHeight.bind(this);
        this.renderBackground = this.renderBackground.bind(this);

    }

	componentDidMount () {
        this.unUserStoreChange = UserStore.listen(this.onUserStoreChange);
		InteractionManager.runAfterInteractions(() => {
			this.getUser();
			this.setState({
				doRenderScene: true,
			});
		});
	}

    componentWillUnmount () {

        this.unUserStoreChange();
    }

	componentWillReceiveProps () {

	}

    onUserStoreChange (_user) {
        this.setState({
            userInfo: _user.user,
        });

    }
	getList () {
    	return [
			{text: '个人资料',	icon: 'about',		bg: '#fe80c4',	component: Profile},
			{text: '消息开关',	icon: 'msg',		bg: '#ffa122',	component: null,	icon2: true},
			{text: '安全设置',	icon: 'security',	bg: '#ff6866',	component: SecuritySettings , passProps: {userInfo: this.state.userInfo,backRoute:this.state.route}},
			{text: '积分',		icon: 'points',		bg: '#8a90f9',	component: null},
			{text: '信用值',		icon: 'credit',		bg: '#fed02f',	component: null,	separator: true},
			{text: '联系我们',	icon: 'contact',	bg: '#ffa122',	component: ContactUs},
			{text: '关于',		icon: 'about',		bg: '#fed02f',	component: AboutUs},
			{text: '反馈意见',	icon: 'feed',		bg: '#fe80c4',	component: Suggest, passProps: {userInfo: this.state.userInfo}},
            {text: '安全退出',  icon: 'exit',       bg: '#04d3be',  func: this.logout},
	    ];
    }
    async clear () {
        var clear = await AsyncStorage.clear();
    }
    push(title, component, passProps) {
    	if(component != null)
	        {this.props.navigator.push({
	            title: title,
	            component: component,
	            hideNavBar: true,
	        	sceneConfig: Global.os == 'ios' ? Navigator.SceneConfigs.FloatFromBottom : Navigator.SceneConfigs.FloatFromBottomAndroid,
                passProps: passProps ? passProps : null,
	        });}
        else if(title == '消息开关') {
            this.setState({
                messageSwitch: !this.state.messageSwitch,
            });
        } else {
            this.toast(title + '即将开通');
        }
    }

    refresh () {
    	this.getUser();
    }
    async getUser () {
        console.log("me---getUser-----");
    	this.setState({
            userInfo: UserStore.getUser(),
        });
    }
    
    logout(){
    	Alert.alert(
            '提示',
            '您确定要退出吗？',
            [
            	{text: '取消', style: 'cancel'},
            	{text: '确定', onPress: () => this.doLogout()},
            ]
        );
    }

	/**
	 * 推送,清空别名和标签
	 */
	jPushClearAliasAndTags() {
		JPush.setTags([], '');
		console.log('清空别名和标签');
	}

    async doLogout(){
    	this.showLoading();
		try {
			let responseData = await this.request(Global._host + LOGIN_OUT, {method:'get'});
			this.hideLoading();

            if (responseData.success == false) {
                Alert.alert(
                    '提示',
                    responseData.msg +'==========Me',
                    [
                        {
                            text: '确定', onPress: () => {
                                this.setState({userInfo: null, bankCards: null,});
                            }
                        }
                    ]
                );
            } else {
                this.toast('安全退出！');
                this.setState({userInfo: null, bankCards: null,});
                UserAction.logout();
            }
            // console.log(responseData);
			// this.refreshUser();
		} catch(e) {

            this.hideLoading();
            UserAction.logout();
            this.setState({userInfo: null, bankCards: null,});
            this.handleRequestException(e);
		}

		//清空别名和标签
		this.jPushClearAliasAndTags();
    }

    login() {
        AuthAction.clearContinuePush();
        AuthAction.needLogin();
    }

    clarerr(index){
        // console.log('clare!!!!!!!!!!!!');
        // this.toast(index+' coming soon ！');

    }
    /**
     * IMPORTANT: You must return the scroll responder of the underlying
     * scrollable component from getScrollResponder() when using ScrollableMixin.
     */
    getScrollResponder() {
        return this._scrollView.getScrollResponder();
    }

    setNativeProps(props) {
      	this._scrollView.setNativeProps(props);
    }

    getPicBgHeight() {
    	return (150 + 44);
    }

    renderBackground () {
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
                source={require('../../res/images/base/me/bgWithNav.jpg')} 
                resizeMode='cover' >
            </Animated.Image>
        );
    }


	render () {
		if(!this.state.doRenderScene)
			return this._renderPlaceholderView();

		let userNameHolder = null;
		if(this.state.userInfo == null) {
			userNameHolder = (
				<TouchableOpacity style={styles.userNamePos} onPress={this.login} >
					<Text style={[styles.userName]} >点击此处登录系统</Text>
				</TouchableOpacity>
			);
		} else {
			userNameHolder = (
				<Text style={[styles.userName, styles.userNamePos]} >{this.state.userInfo.name?this.state.userInfo.name : (this.state.userInfo.nickname?this.state.userInfo.nickname:"未填写")}</Text>
			);
		}

		/*var bg = (<Image resizeMode='cover' 
			style={styles.bg} 
			source={require('../../res/images/mng-idx-bg-1.png')} />
		);*/

		var pt = Global.getScreen().width * (1 - 0.618) - 47;

		var portrait = this.state.userInfo && this.state.userInfo.portrait ? (
            <Image resizeMode='cover' 
                key={Global._host + Global.userPortraitPath + this.state.userInfo.portrait}
                style={[styles.portrait]} 
                source={{uri: Global._host + IMAGES_URL + this.state.userInfo.portrait}} />
                
        ) : (
            <Image resizeMode='cover' 
                style={[styles.portrait]} 
                source={require('../../res/images/me-portrait-dft.png')} />
        );

		var picBgHeight = this.getPicBgHeight();
		var statusBarMask = Global._os == 'ios' ? (
			<Animated.View style={[styles.statusBarMask, {
		    	opacity: this.state.scrollY.interpolate({
	                inputRange: [-picBgHeight, 0, picBgHeight / 1.2],
	                outputRange: [0, 0, 1]
	            })
		    }]} />) : null;
		return (
			<View style = {Global._styles.CONTAINER} >
				{this.renderBackground()}
				
				<ScrollView automaticallyAdjustContentInsets = {false} style = {styles.scrollView} 
                    keyboardShouldPersistTaps = {true}
					ref={component => { this._scrollView = component; }} 
					onScroll={Animated.event(
                    	[{ nativeEvent: { contentOffset: { y: this.state.scrollY }}}]
                    )}
                    scrollEventThrottle={16}>

					<View style={[styles.portraitView]} >
                        <TouchableOpacity style={styles.portraitHolder}  onPress={()=>{this.push("个人资料",Profile);}}>
							{portrait}
                        </TouchableOpacity>
						{userNameHolder}
					</View>

					{this._renderList()}
					<Separator height = {40} />

				</ScrollView>
				{statusBarMask}
			</View>
			);
	}

	_renderList () {

		var list = this.getList().map(({text, icon, bg, component, func, separator, passProps, icon2}, idx) => {

			var topLine = idx === 0 ? (<View style={Global._styles.FULL_SEP_LINE} />) : null;
			var bottomLine = idx === this.getList().length - 1 ? (<View style={Global._styles.FULL_SEP_LINE} />) : null;

			var itemLine = idx < this.getList().length - 1 ? <View style={Global._styles.FULL_SEP_LINE} /> : null;
            if(separator === true)
            	itemLine = (
            		<View key={idx + '_' + text} >
	            		<View style={Global._styles.FULL_SEP_LINE} />
	            		<Separator height = {20} />
	            		<View style={Global._styles.FULL_SEP_LINE} />
                	</View>
            	);

            var itsIcon = icon2 == true ? 
            	<Switcher 
	            	value = {this.state.messageSwitch} 
	            	width = {45}
	            	height = {22.5}
	            	onSwitch = {
	            		() => {
	            			if(this.state.messageSwitch) {
	            				JPush.stopPush();
	            			} else {
	            				JPush.resumePush();
	            			}
	            			this.setState({messageSwitch: !this.state.messageSwitch});
	            		}
	            	} 
	            	style = {{marginRight: 10}} /> 
	            : null;

            var chevron = itsIcon ? null : <EasyIcon iconLib='fa' name='angle-right' size={20} color={Global._colors.IOS_ARROW} style={[{width: 40}]} />

            return (
                <View key={idx + '_' + text} >
                    {topLine}
                    <TouchableOpacity style={[styles.listItem, Global._styles.CENTER]} onPress={()=>{
                        if(func)
                            func();
                        else
	                        this.push(text, component, passProps);
                    }} >

                        <View style={[Global._styles.CENTER, styles.listItemIcon, {backgroundColor: bg}]} >
							<Image 
				    			resizeMode = 'cover'
				    			source = {icons[icon]}
				    			style = {{
				    				width: 30*0.567,
				    				height: 30*0.567,
				    				backgroundColor: 'transparent',
				    			}}
				    		/>
                        </View>

                        <Text style={{flex: 1, marginLeft: 10}}>{text}</Text>
                        {itsIcon}
                        {chevron}
                    </TouchableOpacity>
                    {itemLine}
                    {bottomLine}
                </View>
            );
        });
        return list;
    }

	_renderPlaceholderView () {
		return (
			<View style = {Global._styles.CONTAINER}>
			</View>
		);
	}

}

const styles = StyleSheet.create({
	scrollView: {
		flex: 1,
		marginBottom: Global._os == 'ios' ? 48 : 0,
	},
    bg: {
        position: 'absolute',
		//height: Global.getScreen().width * (1 - 0.618),
		width: Global.getScreen().width,
	},

    portraitHolder: {
        width: 64,
        height: 64,
        borderRadius: 32,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
        backgroundColor: 'rgba(255,255,255,.3)',
    },
	portrait:{
		width: 60,
		height: 60,
        borderRadius: 30,
	},

    listItem: {
    	flex: 1,
    	height: 49,
        flexDirection: 'row',
        paddingLeft: 6,
        paddingRight: 0,
        backgroundColor: 'white',
    },
    listItemIcon: {
        width: 30,
        height: 30,
        borderRadius: 15,
    },
    icon: {
    },

    userName: {
        flex: 1,
        fontSize: 17,
    	color: 'white',
    	textShadowColor: 'rgba(0,0,0,.4)',
    	textShadowOffset: {width: .5, height: 1},
    	textShadowRadius: .5,
    	backgroundColor: 'transparent',
    },
    userNamePos: {
    	backgroundColor: 'transparent',
    },

    statusBarMask: {
    	position: 'absolute',
    	top: 0,
    	left: 0,
    	width: Global.getScreen().width,
    	height: 20,
    	backgroundColor: 'rgba(0, 0, 0, .5)',
    	borderBottomWidth: 1 / Global.pixelRatio,
    	borderBottomColor: Global._colors.IOS_NAV_LINE,
    },
    portraitView: {
        height: (150 + 44 + 20), 
        paddingTop: (88 + 54) / 2, 
        alignItems: 'center'
    },
});

export default Me;

