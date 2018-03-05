'use strict';

var React = require('react-native');
var NavBar = require('../NavBar');
var Icon = require('react-native-vector-icons/Ionicons');
var Global = require('../../Global');
var chooseLoanLeader = require('./ChooseLoanLeader');
var t = require('tcomb-form-native');
var tStyles = require('../lib/TcombStylesThin');
var TcombSelect = require('../lib/TcombSelect');
var ImageSelect = require('../lib/ImageSelect');
var TcombHidden = require('../lib/TcombHidden');
var UtilsMixin = require('../lib/UtilsMixin');

var {
	StyleSheet,
	ScrollView,
	View,
	Text,
	Image,
	TouchableOpacity,
	InteractionManager,
	Alert
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
		resizeMode: Image.resizeMode.cover,
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

var loanamt = t.refinement(t.Number, function(n) {
	return n >= 0;
});
var Loan = t.struct({
	loanId: t.maybe(t.String),
	custId: t.maybe(t.String),
	account1: t.maybe(t.String),
	loanname: t.String,
	loanamt: loanamt,
	reason : t.String,
	state : t.String
});

var options = {	
	fields: {
		custId:{
			factory: TcombHidden,
		},
		loanId: {
			factory: TcombHidden,
		},
		account1:{
			factory: TcombHidden,
		},
		state : {
			factory: TcombHidden,
		},
		loanamt: {
			label: '借款金额',
			error: '金额必须为大于0的数字且长度不能超过17位',
			maxLength:17
		},
		loanname: {
			label: '借款类型',
			factory: TcombSelect,
			type: 'single',
			display: 'one-row',
			disabled: false,
			options: {
				'0': '日常',
				'1': '差旅',
			},
			icon: (<Icon name='ios-circle-outline' size={18} color={Global.colors.IOS_DARK_GRAY} style={[Global.styles.ICON, {marginRight: 10,}]} />),
			activeIcon: (<Icon name='ios-checkmark' size={18} color={Global.colors.ORANGE} style={[Global.styles.ICON, {marginRight: 10,}]} />),
			error: '请选择借款类型',
		},
		
		
		reason: {
			label: '事由',
			error: '描述长度不能超过100位',
		},
	}
};

var FIND_URL =  'loan/findOne';
var SAVE_URL =  'loan/save';

var LoanEdit = React.createClass({

	mixins: [UtilsMixin],
	
	/**
	* 初始化状态
	*/
	getInitialState: function() {
		return {
			doRenderScene: false,
			loaded: false,
			value: {
				loanId: this.props.loanId,
				state : '0',
				custId:Global.USER_LOGIN_INFO.Employees.id,
				account1:Global.USER_LOGIN_INFO.Employees.bankcard
			},
		};
	},

    componentDidMount: function() {
		InteractionManager.runAfterInteractions(() => {
			this.setState({doRenderScene: true});
			
		});
		if(this.props.loanId && this.props.loanId != '')
				this.fetchData();
	},

	fetchData: async function() {
		this.showLoading();
		try {
			let responseData = await this.request(Global.host +FIND_URL, {
				body: JSON.stringify({
					loanId: this.props.loanId,
				}),
			});
			this.hideLoading();
			this.setState({
				value: {
					loanId: responseData.body.loanId,
					state : responseData.body.state,
					custId:Global.USER_LOGIN_INFO.Employees.id,
					account1:responseData.body.account1,
					loanname:responseData.body.loanname,
					loanamt:responseData.body.loanamt,
					reason:responseData.body.reason
				},
				// value : responseData.body,
				loaded: true,
			});
		} catch (e) {
			this.requestCatch(e);
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

	chooseLeader(){
		var data = this.refs.form.getValue();
		if(data){
			this.props.navigator.push({
		            title: "选择审批人",
		            component: chooseLoanLeader,
		            // hideNavBar: true,
		            passProps: {
		            	data: data,
		            	refreshLoanList:this.props.refreshLoanList,
		            	backRoute: this.props.backRoute,
		            },
		        });
		}
	},
	
	doSave: async function(value) {
		this.showLoading();
		try {
			var body = JSON.stringify(value);
			let responseData = await this.request(Global.host +SAVE_URL, {
				body: body,
			});
			this.hideLoading();
			//回调list的刷新
			this.props.refreshLoanList(0);
			this.props.navigator.pop();
			this.toast('保存成功！');
		} catch (e) {
			this.requestCatch(e);
		}
	},

	/**
	* 为表单绑定 onChange 事件，表单中的任何元素更改都会触发此方法
	* value: 表单所有元素的值，本例中为 {id : '', name: '', gender: '' ... }
	* objName: 触发此事件的元素，类型为数组（支持多个元素同时触发？），如 name 被更改时，传入的值为 ['name']
	*/
	onFormChange: function(value, objName) {
		/*console.log('``````````````````` arguments in edit.onChange():');
		console.log(arguments);
		console.log('``````````````````` end of arguments in edit.onChange():');*/
	},

	render: function() {
		if(!this.state.doRenderScene)
			return this._renderPlaceholderView();

		return (
			<View style={[styles.container]}>
				<ScrollView style={styles.sv}>
					<View style={styles.placeholder} />
					<Form
						ref="form"
						type={Loan}
						options={options}
						value={this.state.value}
						onChange={this.onFormChange} />
						
					<View style={{flex: 1, height: 20,}} />
					<View style={{flex: 1, flexDirection: 'row', marginTop: 10,}}>
						<TouchableOpacity 
							style={[Global.styles.CENTER, {height: 40, flex: 1, backgroundColor: Global.colors.IOS_BLUE, borderRadius: 3,}]} 
							onPress={this.save}>
				    		<Text style={{color: '#ffffff',}}>保存</Text>
				    	</TouchableOpacity>
				    	<View style={{flex: 0.05}}></View>
				    	<TouchableOpacity 
				    		style={[Global.styles.CENTER, {height: 40, flex: 1, backgroundColor: Global.colors.IOS_BLUE, borderRadius: 3,}]} 
				    		onPress={()=>{this.chooseLeader()}}>
				    		<Text style={{color: '#ffffff',}}>送审</Text>
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

module.exports = LoanEdit;
