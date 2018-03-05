'use strict';

var React = require('react-native');
var NavBar = require('../NavBar');
var Icon = require('react-native-vector-icons/Ionicons');
var Global = require('../../Global');
var List = require('./employee-list');

var t = require('tcomb-form-native');
var tStyles = require('../lib/TcombStylesThin');
var TcombSelect = require('../lib/TcombSelect');
var ImageSelect = require('../lib/ImageSelect');
var TcombHidden = require('../lib/TcombHidden');

var UtilsMixin = require('../lib/UtilsMixin');
var TimerMixin = require('react-timer-mixin');

var {
	StyleSheet,
	ScrollView,
	View,
	Text,
	Image,
	TouchableOpacity,
	InteractionManager,
	Alert,
} = React;

var styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#ffffff',
	},
	sv: {
		paddingLeft: 20,
		paddingRight: 20,
	},
	placeholder: {
		flex: 1,
		height: Global.NBPadding + 20,
	},
	portrait: {
		width: (Global.getScreen().width - 90) / 4,
		height: (Global.getScreen().width - 90) / 4,
		//resizeMode: Image.resizeMode.cover,
	},
	iconOnPortrait: {
		backgroundColor: 'transparent',
		position: 'absolute',
		top: 3,
		left: 3,
	},
});

var Form = t.form.Form;
t.form.Form.stylesheet = tStyles;

var Person = t.struct({
	id: t.maybe(t.String),
	name: t.String,
	mobile: t.String,
	bankcard: t.String,
	idcard: t.String,
	sex: t.String,	
	// image:t.maybe(t.String),
	dept: t.String,
});

var options = {
	fields: {
		id: {
			factory: TcombHidden,
		},
		name: {
			label: '姓名',
			error: '姓名必须填写且长度不能超过50个字符',
			//help: '请填写员工姓名',
			placeholder: '请输入员工姓名',
			maxLength :50,
		},
		mobile: {
			label: '手机',
			error: '手机号必须填写',
			placeholder: '请输入员工手机号',
			maxLength:11,
			minLength:11,
		},
		bankcard: {
			label: '卡号',
			error: '银行卡号必须填写',
			//help: '请填写员工银行卡号',
			placeholder: '请输入员工银行卡号'
		},
		idcard: {
			label: '身份证号',
			error: '身份证号必须填写',
			//help: '请填写员工身份证号',
			placeholder: '请输入员工身份证号'
		},
		sex: {
			label: '性别',
			factory: TcombSelect,
			type: 'single',
			display: 'one-row',
			disabled: false,
			options: {
				'1': '男',
				'0': '女',
			},
			icon: (<Icon name='ios-circle-outline' size={18} color={Global.colors.IOS_DARK_GRAY} style={[Global.styles.ICON, {marginRight: 10,}]} />),
			activeIcon: (<Icon name='ios-checkmark' size={18} color={Global.colors.ORANGE} style={[Global.styles.ICON, {marginRight: 10,}]} />),
			//help: 'Choose gender pls.',
			error: '请选择性别',
		},
		image: {
			label: '头像',
			factory: ImageSelect,
			type: 'single',
			display: 'row',
			disabled: false,
			options: {
				'head01.jpg': (<Image style={[styles.portrait]} resizeMode='cover'  source={{uri: Global.host + Global.userPortraitPath + 'head01.jpg'}} />),
				'head02.jpg': (<Image style={[styles.portrait]} resizeMode='cover'  source={{uri: Global.host + Global.userPortraitPath + 'head02.jpg'}} />),
				'head03.jpg': (<Image style={[styles.portrait]} resizeMode='cover'  source={{uri: Global.host + Global.userPortraitPath + 'head03.jpg'}} />),
				'head04.jpg': (<Image style={[styles.portrait]} resizeMode='cover'  source={{uri: Global.host + Global.userPortraitPath + 'head04.jpg'}} />),
				'head05.jpg': (<Image style={[styles.portrait]} resizeMode='cover'  source={{uri: Global.host + Global.userPortraitPath + 'head05.jpg'}} />),
				'u0003.jpg': (<Image style={[styles.portrait]} resizeMode='cover'  source={{uri: Global.host + Global.userPortraitPath + 'u0003.jpg'}} />),
				'head006.jpg': (<Image style={[styles.portrait]} resizeMode='cover'  source={{uri: Global.host + Global.userPortraitPath + 'head006.jpg'}} />),
			},
			icon: (<Icon name='ios-circle-filled' size={18} color='#ffffff' style={[Global.styles.ICON, styles.iconOnPortrait]} />),
			activeIcon: (<Icon name='ios-checkmark' size={18} color={Global.colors.ORANGE} style={[Global.styles.ICON, styles.iconOnPortrait]} />),
			error: '请选择头像',
		},
		dept: {
			label: '部门',
			error: '部门必须填写',
			//help: '请填写员工部门',
			placeholder: '请输入员工所在部门'
		},
	},
};

var FIND_URL = 'employee/findOne';
var SUBMIT_URL =  'employee/save';

var EmployeeEdit = React.createClass({

	mixins: [UtilsMixin, TimerMixin],

	/**
	* 初始化状态
	*/
	getInitialState: function() {
		return {
			doRenderScene: false,
			loaded: false,
			value: {
				id: this.props.id,
			},
		};
	},

    componentDidMount: function() {
		InteractionManager.runAfterInteractions(() => {
			this.setState({doRenderScene: true});
			if(this.props.id && this.props.id != '')
				this.fetchData();
		});
	},

	fetchData: async function() {
		this.showLoading();
		try {
			let responseData = await this.request(Global.host +FIND_URL, {
				body: JSON.stringify({
					id: this.props.id,
				})
			});
			this.hideLoading();
			this.setState({
				value: responseData.body,
				loaded: true,
			});
		} catch(e) {
			this.requestCatch(e);
		}
	},

	/**
	* 保存数据
	*/
	save: function() {
		var value = this.refs.form.getValue();
		if(value){
			var parm = JSON.stringify(value);
			var resu = parm.substring(0,parm.length-1)+',"ownerOrg":"'+Global.USER_LOGIN_INFO.company.id+'"}';
			this.doSave(resu);
		}
	},

	doSave: async function(value) {
    	this.showLoading();
		try {
			let responseData = await this.request(Global.host +SUBMIT_URL, {
				body: value
			});
		this.hideLoading();
		//回调list的刷新
		this.props.refresh.call();
		this.props.navigator.pop();
		this.toast('保存用户信息成功！');

		} catch(e) {
			this.requestCatch(e);
		}
	},


	render: function() {
		/*if(!this.state.doRenderScene)
			return this._renderPlaceholderView();*/

		return (
			<View style={[styles.container]}>
				<ScrollView style={styles.sv}>
					<View style={styles.placeholder} />
					<Form
						ref="form"
						type={Person}
						options={options}
						value={this.state.value}
						onChange={this.onFormChange} />
					<View style={{flex: 1, flexDirection: 'row', marginTop: 10,}}>
						<TouchableOpacity 
							style={[Global.styles.CENTER, {height: 40, flex: 1, backgroundColor: Global.colors.IOS_BLUE, borderRadius: 3,}]} 
							onPress={this.save}>
				    		<Text style={{color: '#ffffff',}}>保存</Text>
				    	</TouchableOpacity>
				    	<View style={{flex: 0.05}}></View>
				    	<TouchableOpacity 
				    		style={[Global.styles.CENTER, {height: 40, flex: 1, backgroundColor: Global.colors.IOS_BLUE, borderRadius: 3,}]} 
				    		onPress={()=>{this.props.navigator.pop();}}>
				    		<Text style={{color: '#ffffff',}}>取消</Text>
				    	</TouchableOpacity>
					</View>
					<View style={{flex: 1, height: 40,}} />
			    </ScrollView>
			</View>
		);
	},

	_renderPlaceholderView: function() {
		return (
			<View></View>
		);
	},
});

module.exports = EmployeeEdit;
