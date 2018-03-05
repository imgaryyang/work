'use strict';
/*
** 6位密码控件
** Global.NBPadding
** 平台显示6位密码键盘：this.inputPwd( callback )
**						callback(pwd): 
							密码错误时return false, 其他return true, 函数完成后this.hidePwd()隐藏
							参数pwd:密码
** 平台隐藏6位密码键盘：this.hidePwd()
*/
import React, {
	Component,
	PropTypes
} from 'react';
import * as Global 		from '../../Global';
import Password6 		from './Password6';
import UserAction       from '../../flux/UserAction';
import UserStore        from '../../flux/UserStore';
import RNKeyboard 		from './RandomNumberKeyboard';
import InputPwdStore 	from '../../flux/InputPwdStore';
import FindPayPassword	from '../../el/me/FindPayPassword';

import EasyIcon 		from 'rn-easy-icon';

import {
	StyleSheet,
	ScrollView,
	View,
	Text,
    PixelRatio,
	TouchableOpacity,
	Navigator,
	Dimensions,
	InteractionManager,
	TextInput,
	Alert,
} from 'react-native';

var CONFIRMPWD_URL = 'person/confirmPwd';

class InputPwd extends Component {

	constructor(props) {
		super(props);
        this.onUserStoreChange = this.onUserStoreChange.bind(this);
		

		this.state = {
			pwd: '',
			checked: false,
			correctMsg: null,
			callback : null,
			show: false,
			userInfo:null,
		}
	}

	componentDidMount() {
		InputPwdStore.listen((show, callback)=> {
			this.setState({
				show: show,
				callback: callback,
			});
		});
		this.unUserStoreChange = UserStore.listen(this.onUserStoreChange);

		// InteractionManager.runAfterInteractions(() => {
		// 	this.setState({doRenderScene: true});
		// });

		// this.props.showRNKeyboard((key)=>{this.input(key)});
	}
	componentWillUnmount () {

        this.unUserStoreChange();
    }
    onUserStoreChange (_user) {
        // console.log("onUserStoreChange=========================Me ");
        // console.log(_user);
        this.setState({
            userInfo: _user.user,
        });
        // console.log("onUserStoreChange=========================Me ");
    }

	input(key) {
		this.setState({
			inputting: key + '',
			correctMsg:'',

		});
	}

	async inputEnded(pwd) {

		//TODO:调用后台逻辑校验支付密码
		// this.showLoading();
		// try {
		// 	let responseData = await this.request(Global._host + CONFIRMPWD_URL, {
		// 		body: JSON.stringify({
		// 			pwd: pwd,
		// 			// id: Global.USER_LOGIN_INFO.id
		// 		}),
		// 	});
		// 	this.hideLoading();
		// 	if (responseData.body == false) {
		// 		Alert.alert(
		// 			'提示',
		// 			'支付密码输入错误,请重新输入!', [{
		// 				text: '确定',
		// 				onPress: () => {
		// 					this.setState({
		// 						pwd: '',
		// 						inputting: 'clear',
		// 					})
		// 				}
		// 			}]
		// 		);
		// 	} else {
		// 		this.props.hideRNKeyboard();
		// 		this.setState({
		// 			checked: true,
		// 			correctMsg: '密码校验正确！',
		// 		});
		// 	}
		// } catch (e) {
		// 	this.requestCatch(e);
		// }
		let correctMsg = null;
		if ( null != this.state.callback && 'function' == typeof this.state.callback ) {
			let res = await this.state.callback(pwd);
			if ( !res ) {
				correctMsg = '密码错误，请重新输入！';
			}

			this.setState({
				inputting: 'clear',
				correctMsg: correctMsg,
			})
		}
		return;
	}

	hidePasswd() {
		this.setState({
			show : false,
			correctMsg: null,
		})
	}

	findPayPwd() {

		this.props.navigator.push({
            component: CheckAuthCode,
            hideNavBar: true,
        	passProps:{ 
        		userInfo:this.state.userInfo, 
        		nextComponent: FindPayPassword,
        		nextPassProps: 'value.mobile',
        		nextTitle: '重置支付密码',
        		title: "重置支付密码",
        		isMobileExist:true,
        	},
        });

        this.hidePwd();
	}

	done(){
		//密码校验成功后回调业务逻辑
		if(typeof this.props.pwdChecked == 'function') {
			// this.props.navigator.pop();
			this.props.pwdChecked();
		}
	}

	render(){

		if( !this.state.show )
			return ( <View></View> );

		var btnStyle = this.state.checked == true ? Global._styles.BLUE_BTN : Global._styles.GRAY_BTN;
		var btnPress = this.state.checked == true ? this.done : null;

		return(
			<View style={styles.CONTAINER} >
				<ScrollView style={[styles.sv]} keyboardShouldPersistTaps={true}>
					<TouchableOpacity style={{ flexDirection:'row', justifyContent:'flex-end'}} onPress={()=>this.hidePasswd()} >
						<Text style={{fontSize: 14, color: Global._colors.IOS_BLUE, marginBottom: 10}}>取消</Text>
					</TouchableOpacity>
					<View style = {Global._styles.SEP_LINE} />
					<Text style = {{marginTop:20}}>请输入6位支付密码</Text>
					<View style = {Global._styles.PLACEHOLDER20} />

					<Password6 
						inputEnded={(pwd)=>this.inputEnded(pwd)} 
						inputting={this.state.inputting} />

					<View style={{flexDirection: 'row'}}>
						<Text style={{width:240, height: 20, color: Global._colors.IOS_BLUE, fontSize: 14, marginTop: 8, marginLeft: 5}} >{this.state.correctMsg}</Text>
						<TouchableOpacity style={{ flexDirection:'row', justifyContent:'flex-end'}} onPress={()=>this.findPayPwd()} >
							<Text style={{width:80, height: 20, color: Global._colors.IOS_BLUE, fontSize: 14, marginTop: 8, marginRight: 5}} >忘记密码？</Text>
						</TouchableOpacity>
					</View>

					<View style={Global._styles.PLACEHOLDER20} />
				</ScrollView>
			    <RNKeyboard input={(key)=>this.input(key)} show={this.state.show} />
			</View>
		)
	}
}

var styles = StyleSheet.create({
	CONTAINER: {
		position: 'absolute',
		left: 0,
		top: 0,
		width: Global.getScreen().width,
		height: Global.getScreen().height,
		flex: 1,
		backgroundColor: Global._colors.IOS_BG,
		flexDirection: 'column',
	},
	paddingPlace: {
		flex: 1,
		// height: Global.NBPadding + 20,
	},
	sv: {
		flex: 1,
		padding: 20,
	},
	inputBlock:{
		flexDirection:'row',
		borderColor: 'gray', 
		borderWidth: 1 / Global._pixelRatio,
	},
	textInput:{
		height:40,
		fontSize:13,
		width:(Dimensions.get('window').width-41)/6,
		borderColor: 'gray', 
		borderWidth: 1 / Global._pixelRatio,
		borderBottomWidth: 0,
		borderTopWidth: 0,
		borderLeftWidth:1,
		borderRightWidth:0,
		textAlign:'center',
		backgroundColor: '#FFFFFF',
	},
});

module.exports = InputPwd;
