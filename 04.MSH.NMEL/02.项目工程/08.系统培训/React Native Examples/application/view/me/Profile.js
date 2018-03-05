'use strict';

var React = require('react-native');
var NavBar = require('../NavBar');
var Global = require('../../Global');
var Icon = require('react-native-vector-icons/Ionicons');
var UserName = require('./UserName');
var password = require('./Password');
var Login = require('../login');
var PersonIdCard = require('./PersonIdCard');
var Mail = require('./Mail');
var Gender = require('./Gender');
var Portrait = require('./Portrait');

var {
	StyleSheet,
	ScrollView,
	View,
	Text,
	Image,
	TouchableOpacity,
	Navigator,
	Dimensions,
	InteractionManager,
} = React;

var FIND_URL = 'person/findOne';

var Profile = React.createClass({

	getInitialState: function() {
		return {
			doRenderScene: false,
			USER_LOGIN_INFO: Global.USER_LOGIN_INFO,
		};
	},

	componentWillReceiveProps: function(props) {
		this.setState({
			USER_LOGIN_INFO: props.USER_LOGIN_INFO,
		});
	},
	
	componentDidMount: function() {
		InteractionManager.runAfterInteractions(() => {
			this.setState({doRenderScene: true});
		});
	},
		
	doEditProfile: function(title, component, hideNavBar){

		this.props.navigator.push({
        	title: title,
            component: component,
            hideNavBar: hideNavBar,
            passProps: Global.USER_LOGIN_INFO,
        });
	},

	render:function(){
		if(!this.state.doRenderScene)
			return this._renderPlaceholderView();

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


		return (
			<View style={styles.container}>
				<ScrollView style={[styles.sv]}>
                    <View style={styles.paddingPlace} />

                    <View style={styles.list} >
                    	<View style={Global.styles.FULL_SEP_LINE} ></View>
						<TouchableOpacity style={[styles.item, Global.styles.CENTER]} onPress={()=>{this.doEditProfile('我的头像', Portrait, true)}}>
							<Text style={[styles.itemTitle]}>头像</Text>
							<View style={styles.itemPortraitContent} >
								<View style={[styles.portraitHolder, Global.styles.BORDER]} >
									{portrait}
								</View>
							</View>
							<Icon name='ios-arrow-right' size={18} color={Global.colors.IOS_ARROW} style={[Global.styles.ICON, {width: 40}]} />
						</TouchableOpacity>
						<View style={Global.styles.SEP_LINE} ></View>
						<TouchableOpacity style={[styles.item, Global.styles.CENTER, {paddingRight: 16}]}>
							<Text style={[styles.itemTitle]}>用户名</Text>
							<Text style={[styles.itemTextContent]} >{this.state.USER_LOGIN_INFO.mobile}</Text>
						</TouchableOpacity>
						<View style={Global.styles.SEP_LINE} ></View>
						<TouchableOpacity style={[styles.item, Global.styles.CENTER]} onPress={()=>{this.doEditProfile('修改姓名', UserName, true)}}>
							<Text style={[styles.itemTitle]}>姓名</Text>
							<Text style={styles.itemTextContent} >{this.state.USER_LOGIN_INFO.name}</Text>
							<Icon name='ios-arrow-right' size={18} color={Global.colors.IOS_ARROW} style={[Global.styles.ICON, {width: 40}]} />
						</TouchableOpacity>
						<View style={Global.styles.SEP_LINE} ></View>
						<TouchableOpacity style={[styles.item, Global.styles.CENTER]} onPress={()=>{this.doEditProfile('修改密码', password, true)}}>
							<Text style={[styles.itemTitle]}>密码</Text>
							<Text style={styles.itemTextContent} >******</Text>
							<Icon name='ios-arrow-right' size={18} color={Global.colors.IOS_ARROW} style={[Global.styles.ICON, {width: 40}]} />
						</TouchableOpacity>
						<View style={Global.styles.SEP_LINE} ></View>
						<TouchableOpacity style={[styles.item, Global.styles.CENTER, {paddingRight: 16}]}>
							<Text style={[styles.itemTitle]}>认证手机号</Text>
							<Text style={[styles.itemTextContent]} >{this.state.USER_LOGIN_INFO.mobile}</Text>
						</TouchableOpacity>
						<View style={Global.styles.SEP_LINE} ></View>
						<TouchableOpacity style={[styles.item, Global.styles.CENTER]} onPress={()=>{this.doEditProfile('修改身份证号', PersonIdCard, true)}}>
							<Text style={[styles.itemTitle]}>身份证号</Text>
							<Text style={styles.itemTextContent} >{this.state.USER_LOGIN_INFO.idCard}</Text>
							<Icon name='ios-arrow-right' size={18} color={Global.colors.IOS_ARROW} style={[Global.styles.ICON, {width: 40}]} />
						</TouchableOpacity>
						<View style={Global.styles.SEP_LINE} ></View>
						<TouchableOpacity style={[styles.item, Global.styles.CENTER]} onPress={()=>{this.doEditProfile('修改电子邮箱', Mail, true)}}>
							<Text style={[styles.itemTitle]}>电子邮箱</Text>
							<Text style={styles.itemTextContent} >{this.state.USER_LOGIN_INFO.mail}</Text>
							<Icon name='ios-arrow-right' size={18} color={Global.colors.IOS_ARROW} style={[Global.styles.ICON, {width: 40}]} />
						</TouchableOpacity>
						<View style={Global.styles.SEP_LINE} ></View>
						<TouchableOpacity style={[styles.item, Global.styles.CENTER]} onPress={()=>{this.doEditProfile('选择性别', Gender, true)}}>
							<Text style={[styles.itemTitle]}>性别</Text>
							<Text style={styles.itemTextContent} >
							{this.state.USER_LOGIN_INFO.gender=='0'?'女':''}
							{this.state.USER_LOGIN_INFO.gender=='1'?'男':''}
							</Text>
							<Icon name='ios-arrow-right' size={18} color={Global.colors.IOS_ARROW} style={[Global.styles.ICON, {width: 40}]} />
						</TouchableOpacity>
						<View style={Global.styles.FULL_SEP_LINE} ></View>
					</View>

				</ScrollView>
			</View>
		);
	},
	_renderPlaceholderView: function() {
		return (
			<View>
				<NavBar 
					rootNavigator={this.props.rootNavigator} 
					navigator={this.props.navigator} 
					route={this.props.route} />
		    </View>
		);
	},

});

var styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Global.colors.IOS_BG,
	},
	sv: {
	},
    paddingPlace: {
        flex: 1,
        height: Global.NBPadding + 20,
    },

	itemPortraitContent: {
		flex: 1,
		alignItems: 'flex-end',
	},
	portraitHolder: {
		width: 50,
		height: 50,
        borderRadius: 5,
		backgroundColor: Global.colors.IOS_GRAY_BG,
	},
	portrait:{
		width: (50 * Global.pixelRatio - 2) / Global.pixelRatio,
		height: (50 * Global.pixelRatio - 2) / Global.pixelRatio,
        borderRadius: 5,
	},

	list: {
		flex: 1,
		backgroundColor: '#ffffff',
	},
	item: {
		width: Global.screen.width,
        flexDirection: 'row',
        padding: 12,
        paddingLeft: 15,
        paddingRight: 0,
	},
	itemTitle: {
		width: 100,
	},
	itemTextContent: {
		flex: 1,
		textAlign: 'right',
		color: Global.colors.IOS_GRAY_FONT,
	},
});

module.exports = Profile;