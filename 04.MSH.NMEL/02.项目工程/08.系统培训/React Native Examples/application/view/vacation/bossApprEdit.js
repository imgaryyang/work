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
var UtilsMixin = require('../lib/UtilsMixin');
var TimerMixin = require('react-timer-mixin');
var FilterMixin = require('../../filter/FilterMixin');

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
	employeeName: t.String,
	reson: t.String,
	startTime: t.String,
	endTime: t.String,
	days: t.Number,	
	submitTime: t.String,
	comment: t.maybe(t.String),
});

var options = {
	fields: {
		id: {
			factory: TcombHidden,
		},
		employeeName: {
			label: '姓名',
			editable: false,
		},
		reson: {
			label: '事由',
			editable: false,
		},
		startTime: {
			label: '休假开始时间',
			editable: false,
		},
		endTime: {
			label: '休假结束时间',
			editable: false,
		},
		days: {
			label: '休假天数',
			editable: false,
		},
		submitTime: {
			label: '提交时间',
			editable: false,
		},
		comment: {
			label: '批注',
		},
	},
};

var FIND_URL = 'vacation/findOne';
var SUBMIT_URL = 'vacation/oper';

var BossApprEdit = React.createClass({
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
			showAlert: false,
			alertMsg: null,
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
		this.setState({showLoading: true});
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
					submitTime: this.filterDateFmt(responseData.body.submitTime),
					comment: responseData.body.comment,
				},
				loaded: true,
			});
		} catch(e) {
			this.hideLoading();
			this.setState({
				isRefreshing: false,
			});
			if(e.status == 401 || e.status == 403)
				this.setState({fetchForbidden: true});
			this.requestCatch(e);
		}
	},

	/**
	* 审核通过
	*/
	agree: function() {
		var value = this.refs.form.getValue();

		if(value)
			this.doAgree(value);
	},

	doAgree: async function(value) {		
		this.showLoading();
		try {
			let responseData = await this.request(Global.host +SUBMIT_URL, {
				body: JSON.stringify({
                    comment: value.comment,
					type : '1',
					param : this.param,
					id : value.id,
                }),
				
			});
			this.hideLoading();
			//回调list的刷新
			this.props.refresh.call();
			this.props.navigator.pop();
			this.toast('审批通过成功！');

		} catch(e) {
			this.requestCatch(e);
		}
	},

	/**
	*驳回
	*/
	disagree: function() {
		var value = this.refs.form.getValue();
		if(value)
			this.dodisagree(value);
	},

	dodisagree: async function(value) {
		
		this.showLoading();
		try {
			let responseData = await this.request(Global.host +SUBMIT_URL, {
				body: JSON.stringify({
                    comment: value.comment,
					type : '2',
					param : this.param,
					id : value.id,
                }),				
			});
			this.hideLoading();
			//回调list的刷新
			this.props.refresh.call();
			this.props.navigator.pop();
			this.toast('审批驳回成功！');

		} catch(e) {
			this.requestCatch(e);
		}
	},

	onFormChange: function(value, objName) {
		
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
							onPress={this.agree}>
				    		<Text style={{color: '#ffffff',}}>通过</Text>
				    	</TouchableOpacity>
				    	<View style={{flex: 0.05}}></View>
				    	<TouchableOpacity 
							style={[Global.styles.CENTER, {height: 40, flex: 1, backgroundColor: Global.colors.IOS_BLUE, borderRadius: 3,}]} 
							onPress={this.disagree}>
				    		<Text style={{color: '#ffffff',}}>驳回</Text>
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
	placeholder: {
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

module.exports = BossApprEdit;
