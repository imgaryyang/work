'use strict';

var React = require('react-native');
var NavBar = require('../NavBar');
var Icon = require('react-native-vector-icons/Ionicons');
var Global = require('../../Global');

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
	startTime: t.String,
	endTime: t.String,
	days: t.Number,
	employeeId: t.String,
	employeeName: t.String,
	companyId: t.String,
	companyName: t.String,
	approveId: t.String,
	approveName: t.String,
	createdId: t.String,
	createdName: t.String,
	comment: t.maybe(t.String),
});

var options = {
	fields: {
		id: {
			factory: TcombHidden,
		},
		reson: {
			label: '事由',
			editable: false,
		},
		startTime: {
			label: '开始时间',
			editable: false,
		},
		endTime: {
			label: '结束时间',
			editable: false,
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
		comment: {
			label: '批注',
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

var FIND_URL = 'vacation/findOne';
var FIND_INFO_URL = 'vacation/findApprovePerson';

var EmpVacaDetail = React.createClass({

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
		//this.findInfo();
	},

	/*findInfo: async function() {
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
	},*/
	
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
				//value: responseData.body,
				value: {
					id: responseData.body.id,
					reson: responseData.body.reson,
					startTime: this.filterDateFmt(responseData.body.startTime),
					endTime: this.filterDateFmt(responseData.body.endTime),
					days: parseFloat(responseData.body.days),
					employeeName: responseData.body.employeeName,
					companyName: responseData.body.companyName,
					approveName: responseData.body.approveName,
					comment: responseData.body.comment,
				},
				loaded: true,
			});
		} catch(e) {
			this.requestCatch(e);
		}
	},

	
	onFormChange: function(value, objName) {
	
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
					
					<View style={{flex: 1, height: 40,}} />
			    </ScrollView>
			    {/*<Loading show={this.state.showLoading} />*/}
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
		//resizeMode: Image.resizeMode.cover,
	},
	iconOnPortrait: {
		backgroundColor: 'transparent',
		position: 'absolute',
		top: 3,
		left: 3,
	},
});
module.exports = EmpVacaDetail;
