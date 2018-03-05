'use strict';
// SalaryInfo

var t = require('tcomb-form-native');
var tStyles = require('../lib/TcombStylesThin');
var TcombSelect = require('../lib/TcombSelect');
var ImageSelect = require('../lib/ImageSelect');
var TcombHidden = require('../lib/TcombHidden');

var React = require('react-native');
var NavBar = require('../NavBar');
var Icon = require('react-native-vector-icons/Ionicons');
var Global = require('../../Global');
var UtilsMixin = require('../lib/UtilsMixin');
var TimerMixin = require('react-timer-mixin');

var {
    Animated,
    StyleSheet,
    ScrollView,
    View,
    Text,
    Image,
    TouchableOpacity,
    TextInput,
    InteractionManager,
    ListView,
    Alert,
} = React;


var styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#ffffff',
	},
	sv: {
		flex: 1,
		paddingLeft: 20,
		paddingRight: 20,
	},
	paddingPlace: {
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

var SalaryInfo = t.struct({
	amt1: t.Number,
	amt2: t.Number,
	amt3: t.Number,
	amt4: t.maybe(t.Number),
	amt5: t.maybe(t.Number),
	amt6: t.Number,
	memo1: t.maybe(t.String),
	memo2: t.maybe(t.String),
});

var options = {
	fields: {
		amt1: {
			label: '税前工资',
			error: '税前工资不可为空且输入必须是有效数字！',
		},
		amt2: {
			label: '医社保',
			error: '医社不可为空且输入必须是有效数字！',
		},
		amt3: {
			label: '公积金',
			error: '公积金不可为空且输入必须是有效数字！',
		},
		amt4: {
			label: '补助',
			// placeholder:this.value.amt4,
			// error: '姓名必须填写且长度不能超过50个字符',
			// help: '请填写补助',
		},
		amt5: {
			label: '税',
			// placeholder:this.value.amt5,
			// error: '姓名必须填写且长度不能超过50个字符',
			// help: '请填写税',
		},
		amt6: {
			label: '税后工资',
			error: '税后工资不可为空且输入必须是有效数字！',
		},
		memo1: {
			label: '备注1',
		},
		memo2: {
			label: '备注2',
		},
	},
};

var SUBMIT_URL = 'salaryinfo/save';

var SalaryInfoEdit = React.createClass({

	mixins: [UtilsMixin, TimerMixin],

	data: [],
	item: null,
	rowID: null,
	id:0,
	body:null,

	getInitialState: function() {

		console.log('this.props.emplyeeId');
		console.log(this.props.value);
		
		return {
			doRenderScene: false,
			loaded: false,
			cond: null,
			isRefreshing: false,
			value:this.props.value,
		};
	},


    componentDidMount: function() {
		InteractionManager.runAfterInteractions(() => {
			this.setState({doRenderScene: true});
		});
	},

	/**
	* 组件接收参数变化
	*/
	componentWillReceiveProps: function(props) {
	},



	/**
	* 调用刷新
	*/
	refresh: function() {
    	this.setState({isRefreshing: true});
	},
	
	/**
	* 保存数据
	*/
	save: function() {
		var value = this.refs.form.getValue();
		console.log('SalaryitemEdit_value');

		// console.log('vvvvvvvvvvvvvvvvvvv refs.form.getValue() in edit.save():');
		console.log(value);
		// console.log('vvvvvvvvvvvvvvvvvvv end of refs.form.getValue() in edit.save():');
		/*数字校验*/
		/*if(!/^[0-9]*$/.test(value.amt1)){  
	        Alert.alert(
	            '提示',
	            '税前工资请输入数字！',
	            [
	            	{text: '确定', },
	            ]
	        );  
   		} */
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
		console.log('this.id = '+ this.props.id );
		console.log('emplyeeId = '+ this.props.emplyeeId );
		this.showLoading();
		try {
			let responseData = await this.request(Global.host + SUBMIT_URL, {
				body: JSON.stringify({
					amt1:value.amt1,
					amt2:value.amt2,
					amt3:value.amt3,
					amt4:value.amt4,
					amt5:value.amt5,
					amt6:value.amt6,
					memo1:value.memo1,
					memo2:value.memo2,
					id:this.props.id,
					employee: this.props.emplyeeId,
				})
			});
			this.hideLoading();
			//回调list的刷新
			this.props.refresh.call();
			this.props.navigator.pop();
			this.toast('薪资设置成功！');
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
		/*console.log('``````````````````` arguments in edit.onChange():');
		console.log(arguments);
		console.log('``````````````````` end of arguments in edit.onChange():');*/
	},

	render: function() {

		var listView = null;
		if(!this.state.doRenderScene)
			return this._renderPlaceholderView();

		var refreshText = this.state.fetchForbidden === true ? 
			'您还未登录，登录后点击此处刷新数据' : 
			'暂无符合条件的数据，点击此处重新载入';

		var refreshView = (this.state.loaded || this.state.fetchForbidden) && this.data.length === 0 ?
			this.getListRefreshView(refreshText, this.pullToRefresh) : 
			null;

		var SIStyleIOS = Global.os === 'ios' ? Global.styles.TOOL_BAR.SEARCH_INPUT_IOS : {};
	
	return (
			<View style={[styles.container]}>
			<View style={styles.paddingPlace} />
				<ScrollView style={styles.sv} >
				{refreshView}
					<Form
						ref="form"
						type={SalaryInfo}
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

module.exports = SalaryInfoEdit;