'use strict';

var React = require('react-native');
var NavBar = require('../NavBar');
var Icon = require('react-native-vector-icons/Ionicons');
var Global = require('../../Global');
var EmpVacaList = require('./empVacaList');

var t = require('tcomb-form-native');
var tStyles = require('../lib/TcombStylesThin');
var TcombSelect = require('../lib/TcombSelect');
var ImageSelect = require('../lib/ImageSelect');
var TcombHidden = require('../lib/TcombHidden');
var FilterMixin = require('../../filter/FilterMixin');
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

var Form = t.form.Form;
t.form.Form.stylesheet = tStyles;

var Person = t.struct({
	id: t.maybe(t.String),
	reson: t.String,
	sDate: t.Date,
	sTime: t.Date,
	eDate: t.Date,
	eTime: t.Date,
	days: t.Number,
	employeeId: t.String,
	employeeName: t.String,
	companyId: t.String,
	companyName: t.String,
	approveId: t.String,
	approveName: t.String,
	createdId: t.String,
	createdName: t.maybe(t.String),
});

var options = {
	fields: {
		id: {
			factory: TcombHidden,
		},
		reson: {
			label: '事由',
			factory: TcombSelect,
			type: 'single',
			display: 'row',
			disabled: false,
			options: {
				'病假': '病假',
				'产假': '产假',
				'年假': '年假',
				'婚假': '婚假',
				'事假': '事假',
				'其他': '其他',
			},
			icon: (<Icon name='ios-circle-outline' size={18} color={Global.colors.IOS_DARK_GRAY} style={[Global.styles.ICON, {marginRight: 10,}]} />),
			activeIcon: (<Icon name='ios-checkmark' size={18} color={Global.colors.ORANGE} style={[Global.styles.ICON, {marginRight: 10,}]} />),
			error: '请选择请假类别',
		},
		sDate: {
			label: '开始日期',
			mode: 'date',
			config: {
				format: function(date) {
					var date = new Date(date);
					var year = date.getFullYear();
					var month = (date.getMonth() + 1) > 9 ? (date.getMonth() + 1) : '0' + (date.getMonth() + 1);
					var day = date.getDate() > 9 ? date.getDate() : ('0' + date.getDate());
					return year + '-' + month + '-' + day ;
				}
			}
		},
		sTime: {
			label: '开始时间',
			mode: 'time',
			config: {
				format: function(time) {
					var time = new Date(time);
					var hour = (time.getHours() > 9) ? time.getHours() : '0' + time.getHours();
					var minute = (time.getMinutes() > 9) ? time.getMinutes() : '0' + time.getMinutes();
					return hour+':'+minute ;
				}
			}
		},
		eDate: {
			label: '结束日期',
			mode: 'date',
			config: {
				format: function(date) {
					var date = new Date(date);
					var year = date.getFullYear();
					var month = (date.getMonth() + 1) > 9 ? (date.getMonth() + 1) : '0' + (date.getMonth() + 1);
					var day = date.getDate() > 9 ? date.getDate() : ('0' + date.getDate());
					return year + '-' + month + '-' + day ;
				}
			}
		},
		eTime: {
			label: '结束时间',
			mode: 'time',
			config: {
				format: function(time) {
					var time = new Date(time);
					var hour = (time.getHours() > 9) ? time.getHours() : '0' + time.getHours();
					var minute = (time.getMinutes() > 9) ? time.getMinutes() : '0' + time.getMinutes();
					return hour+':'+minute ;
				}
			}
		},
		days: {
			label: '天数',
			editable: false,
		},
		employeeId: {
			factory: TcombHidden,
		},
		employeeName: {
			label: '当前人',
			editable: false,
		},
		companyId: {
			factory: TcombHidden,
		},
		companyName: {
			label: '当前人所属企业',
			editable: false,
		},
		approveId: {
			factory: TcombHidden,
		},
		approveName: {
			label: '审批人',
			editable: false,
		},
		createdId: {
			factory: TcombHidden,
		},
		createdName: {
			factory: TcombHidden,
		},

	},
};

//var FIND_URL = 'vacation/findOne';
var SUBMIT_URL = 'vacation/save';
var FIND_INFO_URL = 'vacation/findApprovePerson';

var EmpVacaEdit = React.createClass({

	mixins: [UtilsMixin, TimerMixin, FilterMixin],

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
		this.findInfo();
	},
	
	findInfo: async function() {
		
		this.showLoading();
		try {
			let responseData = await this.request(Global.host +FIND_INFO_URL, {
				body: JSON.stringify({
					id: Global.USER_LOGIN_INFO.id,
				})
			});
			this.hideLoading();
			this.setState({
				value:{
						id:this.state.value.id,
						days:'0',
						reson:'病假',
						employeeId:responseData.body.employee.id,
						employeeName:responseData.body.employee.name,
						companyId:responseData.body.employee.ownerOrg,
						companyName:responseData.body.company.name,
						approveId:responseData.body.boss.id,
						approveName:responseData.body.boss.name,
						createdId : Global.USER_LOGIN_INFO.id,
						createdName : Global.USER_LOGIN_INFO.name,
					},
				loaded: true,
			});

		} catch(e) {
			this.requestCatch(e);
		}
	},
	
	/*fetchData: async function() {
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
	},*/

	/**
	* 保存数据
	*/
	save: function() {
		var value = this.refs.form.getValue();
		if(value.days == '0'){
			this.toast('请假天数不能为0');
			return;
		}
		if(value)
			this.doSave(value);
	},

	doSave: async function(value) {
		this.showLoading();
		try {
			var body = JSON.stringify(value);
			let responseData = await this.request(Global.host +SUBMIT_URL, {
				body: body,
			});
			this.hideLoading();
			//回调list的刷新
			this.props.refresh.call();
			this.props.navigator.pop();
			this.toast('请假申请送审成功！');

		} catch(e) {
			this.requestCatch(e);
		}
	},

	/**
	* 为表单绑定 onChange 事件，表单中的任何元素更改都会触发此方法
	* value: 表单所有元素的值，本例中为 {id : '', name: '', gender: '' ... }
	* objName: 触发此事件的元素，类型为数组（支持多个元素同时触发？），如 name 被更改时，传入的值为 ['name']
	*/
	onFormChange: function(value, objName) {
		
		//拼时间
		console.log(value);
		var sYear1 = "";
		var sMonth1 = "";
		var sDay1 = "";
		var sHour1 = "";
		var sMinute1 = "";
		var sSecond1 = "";
		var eYear1 = "";
		var eMonth1 = "";
		var eDay1 = "";
		var eHour1 = "";
		var eMinute1 = "";
		var eSecond1 = "";

		//请假开始时间
		if(value.sTime == undefined && value.sDate == undefined){
			sYear1 = new Date().getFullYear();
			sMonth1 = new Date().getMonth();
			sDay1 = new Date().getDate();
			sHour1 = new Date().getHours();
			sMinute1 = new Date().getMinutes();
			sSecond1 = new Date().getSeconds();
		}if(value.sTime == undefined && value.sDate != undefined){
			sYear1 = value.sDate.getFullYear();
			sMonth1 = value.sDate.getMonth();
			sDay1 = value.sDate.getDate();
			sHour1 = new Date().getHours();
			sMinute1 = new Date().getMinutes();
			sSecond1 = new Date().getSeconds();
		}if(value.sTime != undefined && value.sDate == undefined){
			sYear1 = new Date().getFullYear();
			sMonth1 = new Date().getMonth();
			sDay1 = new Date().getDate();
			sHour1 = value.sTime.getHours();
			sMinute1 = value.sTime.getMinutes();
			sSecond1 = value.sTime.getSeconds();
		}if(value.sTime != undefined && value.sDate != undefined){
			sYear1 = value.sDate.getFullYear();
			sMonth1 = value.sDate.getMonth();
			sDay1 = value.sDate.getDate();
			sHour1 = value.sTime.getHours();
			sMinute1 = value.sTime.getMinutes();
			sSecond1 = value.sTime.getSeconds();
		};

		//请假结束时间
		if(value.eTime == undefined && value.eDate == undefined){
			eYear1 = new Date().getFullYear();
			eMonth1 = new Date().getMonth();
			eDay1 = new Date().getDate();
			eHour1 = new Date().getHours();
			eMinute1 = new Date().getMinutes();
			eSecond1 = new Date().getSeconds();
		}if(value.eTime == undefined && value.eDate != undefined){
			eYear1 = value.eDate.getFullYear();
			eMonth1 = value.eDate.getMonth();
			eDay1 = value.eDate.getDate();
			eHour1 = new Date().getHours();
			eMinute1 = new Date().getMinutes();
			eSecond1 = new Date().getSeconds();
		}if(value.eTime != undefined && value.eDate == undefined){
			eYear1 = new Date().getFullYear();
			eMonth1 = new Date().getMonth();
			eDay1 = new Date().getDate();
			eHour1 = value.eTime.getHours();
			eMinute1 = value.eTime.getMinutes();
			eSecond1 = value.eTime.getSeconds();
		}if(value.eTime != undefined && value.eDate != undefined){
			eYear1 = value.eDate.getFullYear();
			eMonth1 = value.eDate.getMonth();
			eDay1 = value.eDate.getDate();
			eHour1 = value.eTime.getHours();
			eMinute1 = value.eTime.getMinutes();
			eSecond1 = value.eTime.getSeconds();
		};

		var sDate1 = new Date(sYear1,sMonth1,sDay1);
		var sTime1 = new Date( sYear1,sMonth1,sDay1,sHour1,sMinute1,sSecond1);
		var startTime= new Date(sYear1,sMonth1,sDay1,sHour1,sMinute1,sSecond1);
		var eDate1 = new Date(eYear1,eMonth1,eDay1);
		var eTime1 = new Date(eYear1,eMonth1,eDay1,eHour1,eMinute1,eSecond1);
		var endTime= new Date(eYear1,eMonth1,eDay1,eHour1,eMinute1,eSecond1);

		if(startTime.getTime() > endTime.getTime()){
			this.toast('休假开始时间不能大于结束时间！');
			return;
		};

		if(value.sTime == undefined && value.sDate == undefined && value.eTime == undefined && value.eDate == undefined){
			startTime = new Date();
			endTime = new Date();
		}else{
			if((startTime.getTime()-sDate1.getTime()) <=(9*60*60*1000)){
				startTime = new Date(sYear1,sMonth1,sDay1,'09','00','00');
			 }else if((startTime.getTime()-sDate1.getTime()) >=(17*60*60*1000)){
			 	startTime = new Date(sYear1,sMonth1,sDay1,'17','00','00');
			 	/*this.toast('休假开始时间不能晚于下班时间17点！');
			 	return;*/
			 }else{
			 	startTime = startTime;
			 }

			if((endTime.getTime()-eDate1.getTime()) >=(17*60*60*1000)){
				endTime = new Date(eYear1,eMonth1,eDay1,'17','00','00');
			 }else if((endTime.getTime()-eDate1.getTime()) <=(9*60*60*1000)){
			 	endTime = new Date(eYear1,eMonth1,eDay1,'09','00','00');
			 	/*this.toast('休假结束时间不能小于上班时间9点！');
			 	return;*/
			 }else{
			 	endTime = endTime;
			 }
		};

		//天数的整数部分
		var days2 = (parseInt(endTime.getTime())-parseInt(startTime.getTime()))/parseInt(24*60*60*1000);
		if((endTime.getTime()-startTime.getTime()) <= (8*60*60*1000)){
		 	var days3 = (parseInt(endTime.getTime())-parseInt(startTime.getTime()) - (parseInt(days2)*parseInt(24*60*60*1000)))/parseInt(8*60*60*1000);
		}else{
			var days3 = parseInt(new Date(sYear1,sMonth1,sDay1,'17','00','00').getTime()-startTime.getTime())/parseInt(8*60*60*1000) + parseInt(endTime.getTime()-new Date(eYear1,eMonth1,eDay1,'09','00','00').getTime())/parseInt(8*60*60*1000)-1;
		}
		
		//var days3 = (parseInt(endTime.getTime())-parseInt(startTime.getTime()) - (parseInt(days2)*parseInt(24*60*60*1000)))/parseInt(8*60*60*1000);
		var days1 = parseFloat(days2.toFixed(0)) + parseFloat(days3.toFixed(1));

		//按24小时算一天的天数算法
		//var days1 = ((parseInt(endTime)-parseInt(startTime))/parseInt(24*60*60*1000)).toFixed(1);

		this.setState({
			value:{
					id:this.state.value.id,
					days: days1,
					reson: value.reson,
					sDate: sDate1,
					sTime: sTime1,
					eDate: eDate1,
					eTime: eTime1,
					employeeId: this.state.value.employeeId,
					employeeName: this.state.value.employeeName,
					companyId: this.state.value.companyId,
					companyName: this.state.value.companyName,
					approveId: this.state.value.approveId,
					approveName: this.state.value.approveName,
					createdId: Global.USER_LOGIN_INFO.id,
					createdName: Global.USER_LOGIN_INFO.name,
				},
			loaded: true,
		});
	},

	render: function() {
		if(!this.state.doRenderScene)
			return this._renderPlaceholderView();

		return (
			<View style={[styles.container]}>
				<ScrollView style={styles.sv}>
					<View style={styles.paddingPlace} />
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
				    		<Text style={{color: '#ffffff',}}>送审</Text>
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

var styles = StyleSheet.create({
	container: {
		flex: 1,
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

module.exports = EmpVacaEdit;
