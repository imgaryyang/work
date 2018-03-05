'use strict';

var React = require('react-native');
var NavBar = require('../NavBar');
var Icon = require('react-native-vector-icons/Ionicons');
var Global = require('../../Global');
var SamList = require('./list');

var t = require('tcomb-form-native');
var tStyles = require('../lib/TcombStylesThin');
var TcombSelect = require('../lib/TcombSelect');
var ImageSelect = require('../lib/ImageSelect');
var TcombHidden = require('../lib/TcombHidden');

var InputPayPwd = require('../lib/InputPayPwd');

// var UtilsMixin = require('../lib/UtilsMixin');
var UtilsHoc = require('../lib/UtilsHoc');

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
		backgroundColor: '#ffffff',
	},
	sv: {
		paddingLeft: 20,
		paddingRight: 20,
	},
	paddingPlace: {
		flex: 1,
		height: Global.NBPadding + 20,
	},
	
	portrait: {
		width: (Global.getScreen().width - 90) / 4,
		height: (Global.getScreen().width - 90) / 4,
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
	gender: t.String,
	portrait: t.String,
	gender1: t.maybe(t.String),
	gender2: t.maybe(t.String),
});

var FIND_URL = 'samperson/findOne';
var SUBMIT_URL = 'samperson/save';

var SampleEdit = React.createClass({

	// mixins: [UtilsMixin],

	getOptions: function() {
		return {
			fields: {
				id: {
					factory: TcombHidden,
				},
				name: {
					label: '姓名',
					error: '姓名必须填写且长度不能超过50个字符',
					help: '请填写您的姓名',
				},
				gender: {
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
					help: 'Choose gender pls.',
					error: '请选择性别',
				},
				portrait: {
					label: '头像',
					factory: ImageSelect,
					type: 'single',
					display: 'row',
					disabled: false,
					options: {
						'head01.jpg': (<Image style={[styles.portrait]} resizeMode='cover'  source={{uri: Global.getHost() + Global.userPortraitPath + 'head01.jpg'}} />),
						'head02.jpg': (<Image style={[styles.portrait]} resizeMode='cover'  source={{uri: Global.getHost() + Global.userPortraitPath + 'head02.jpg'}} />),
						'head03.jpg': (<Image style={[styles.portrait]} resizeMode='cover'  source={{uri: Global.getHost() + Global.userPortraitPath + 'head03.jpg'}} />),
						'head04.jpg': (<Image style={[styles.portrait]} resizeMode='cover'  source={{uri: Global.getHost() + Global.userPortraitPath + 'head04.jpg'}} />),
						'head05.jpg': (<Image style={[styles.portrait]} resizeMode='cover'  source={{uri: Global.getHost() + Global.userPortraitPath + 'head05.jpg'}} />),
						'u0003.jpg':  (<Image style={[styles.portrait]} resizeMode='cover'  source={{uri: Global.getHost() + Global.userPortraitPath + 'u0003.jpg' }} />),
					},
					icon: (<Icon name='ios-circle-filled' size={18} color='#ffffff' style={[Global.styles.ICON, styles.iconOnPortrait]} />),
					activeIcon: (<Icon name='ios-checkmark' size={18} color={Global.colors.ORANGE} style={[Global.styles.ICON, styles.iconOnPortrait]} />),
					error: '请选择头像',
				},
				gender1: {
					label: '性别1',
					factory: TcombSelect,
					type: 'multi',
					display: 'row',
					disabled: false,
					options: {
						'1': '男',
						'0': '女',
						'2': '不男不女',
						'3': '亦男亦女',
						'4': '男女莫辨',
						'5': '焉能辨我是雌雄',
					},
					icon: (<Icon name='ios-circle-outline' size={18} color={Global.colors.IOS_DARK_GRAY} style={[Global.styles.ICON, {marginRight: 10,}]} />),
					activeIcon: (<Icon name='ios-checkmark' size={18} color={Global.colors.ORANGE} style={[Global.styles.ICON, {marginRight: 10,}]} />),
					error: '请选择性别',
				},
				gender2: {
					label: '性别2',
					factory: TcombSelect,
					type: 'multi',
					display: 'col',
					disabled: false,
					options: {
						'1': '男',
						'0': '女',
						'2': '不男不女',
						'3': '亦男亦女',
					},
					icon: (<Icon name='ios-circle-outline' size={18} color={Global.colors.IOS_DARK_GRAY} style={[Global.styles.ICON, {marginRight: 10,}]} />),
					activeIcon: (<Icon name='ios-checkmark' size={18} color={Global.colors.ORANGE} style={[Global.styles.ICON, {marginRight: 10,}]} />),
					error: '请选择性别',
				},
			},
		};
	},

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
			showLoading: false,
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
		this.props.showLoading();
		try {
			let responseData = await this.props.request(Global.host + FIND_URL, {
				body: JSON.stringify({
					id: this.props.id,
				})
			});
			this.props.hideLoading();
			this.setState({
				value: responseData.body,
				loaded: true,
			});
		} catch(e) {
			this.props.requestCatch(e);
		}
	},

	/**
	* 保存数据
	*/
	save: function() {
		var value = this.refs.form.getValue();

		if(value)
			this.doSave(value);
	},

	/**
	* 测试报错
	*/
	saveWhenError: function() {
		var value = this.refs.form.getValue();
		//console.log('in saveWhenError.');
		if(value) {
			var v = {
				id: value.id,
				name: null,
				gender: value.gender,
				portrait: value.portrait,
			}
			this.doSave(v);
		}
	},

	doSave: async function(value) {
    	this.props.showLoading();
		try {
			var body = JSON.stringify(value);
			let responseData = await this.props.request(Global.host + SUBMIT_URL, {
				body: body,
			});
			this.props.hideLoading();
			//回调list的刷新
			this.props.refresh.call();
			this.props.navigator.pop();
			this.props.toast('保存用户信息成功！');

		} catch(e) {
			this.props.requestCatch(e);
		}
	},

	/**
	* 为表单绑定 onChange 事件，表单中的任何元素更改都会触发此方法
	* value: 表单所有元素的值，本例中为 {id : '', name: '', gender: '' ... }
	* objName: 触发此事件的元素，类型为数组（支持多个元素同时触发？），如 name 被更改时，传入的值为 ['name']
	*/
	onFormChange: function(value, objName) {
	},

	addOther: function() {
		//console.log(this.props.backRoute);
		//this.toast(JSON.stringify(this.props.backRoute));
        this.props.navigator.push({
            title: "Add Another",
            component: SampleEdit,
            passProps: {
            	backRoute: this.props.backRoute,
            },
        });
	},

	goBackToList: function() {
		this.props.navigator.popToRoute(this.props.backRoute);
	},

	callPwdCheck: function() {
		this.props.navigator.push({
			component: InputPayPwd,
			hideNavBar: true,
			passProps: {
				pwdChecked: this.afterPwdChecked,
			},
		});
	},

	afterPwdChecked: function() {
		//TODO:添加密码校验后业务逻辑
		this.toast('支付成功！');
		this.props.navigator.replace({
            title: "Add Another",
            component: SampleEdit,
            passProps: {
            	backRoute: this.props.backRoute,
            },
        });
		//this.props.navigator.popToRoute(this.props.backRoute);
	},

	render: function() {
		if(!this.state.doRenderScene)
			return this._renderPlaceholderView();

		return (
			<View style={[Global.styles.CONTAINER, styles.container]}>
				<ScrollView style={styles.sv}>
					<View style={styles.paddingPlace} />
					<Form
						ref="form"
						type={Person}
						options={this.getOptions()}
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
					<TouchableOpacity style={[Global.styles.CENTER, {height: 40, flex: 1, backgroundColor: Global.colors.ORANGE, borderRadius: 3, marginTop: 20,}]} onPress={this.saveWhenError}>
			    		<Text>测试报错</Text>
			    	</TouchableOpacity>

					<View style={{flex: 1, flexDirection: 'row', marginTop: 10,}}>
						<TouchableOpacity 
							style={[Global.styles.CENTER, {height: 40, flex: 1, backgroundColor: Global.colors.IOS_BLUE, borderRadius: 3,}]} 
							onPress={this.addOther}>
				    		<Text style={{color: '#ffffff',}}>继续添加</Text>
				    	</TouchableOpacity>
				    	<View style={{flex: 0.05}}></View>
				    	<TouchableOpacity 
				    		style={[Global.styles.CENTER, {height: 40, flex: 1, backgroundColor: Global.colors.IOS_BLUE, borderRadius: 3,}]} 
				    		onPress={this.goBackToList}>
				    		<Text style={{color: '#ffffff',}}>回到列表</Text>
				    	</TouchableOpacity>
					</View>

					<TouchableOpacity style={[Global.styles.CENTER, {height: 40, flex: 1, backgroundColor: Global.colors.ORANGE, borderRadius: 3, marginTop: 20,}]} onPress={this.callPwdCheck}>
			    		<Text>调用校验支付密码</Text>
			    	</TouchableOpacity>

					<View style={{flex: 1, height: 40,}} />
			    </ScrollView>
			</View>
		);
	},

	_renderPlaceholderView: function() {
		return (
			<View style={[Global.styles.CONTAINER, styles.container]} ></View>
		);
	},
});

module.exports = UtilsHoc(SampleEdit);
