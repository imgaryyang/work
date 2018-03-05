'use strict';

var React = require('react-native');
var NavBar = require('../NavBar');
var Icon = require('react-native-vector-icons/Ionicons');
var Global = require('../../Global');
var List = require('./list');
var empList = require('./empList');

var t = require('tcomb-form-native');
var TcombSelect = require('../lib/TcombSelect');
var tStyles = require('../lib/TcombStylesThin');
var TcombHidden = require('../lib/TcombHidden');

// var UtilsMixin = require('../lib/UtilsMixin');
// var TimerMixin = require('react-timer-mixin');

var UtilsHoc = require('../lib/UtilsHoc');

var {
	Alert,
	StyleSheet,
	ScrollView,
	View,
	Text,
	Image,
	TouchableOpacity,
	InteractionManager,
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
});

var Form = t.form.Form;
t.form.Form.stylesheet = tStyles;

var Welfare = t.struct({
	id:t.maybe(t.String),
	name: t.String,
	typeid : t.String,
});

var options = {
	fields: {
		id: {
			factory: TcombHidden,
		},
		name: {
			label: '福利名称：',
			error: '福利名称必填且长度不能超过20个字',
			// help: '福利名称必填且长度不能超过20个字',
			maxLength:20,
		},

		typeid :{
			label : '福利类别：',
			factory: TcombSelect,
			type: 'single',
			display: 'col',
			disabled: false,
			options: {
				'1': '月度奖金',
				'2': '季度奖金',
				'3': '半年度奖金',
				'4': '年度奖金',
			},
			icon: (<Icon name='ios-circle-outline' size={18} color={Global.colors.IOS_DARK_GRAY} style={[Global.styles.ICON, {marginRight: 10,}]} />),
			activeIcon: (<Icon name='ios-checkmark' size={18} color={Global.colors.ORANGE} style={[Global.styles.ICON, {marginRight: 10,}]} />),
			error:'请选择福利类别',
		},
		

	},
};

//用于emplist查找员工
var FIND_URL = 'employee/find';

var WelfareAdd = React.createClass({

	// mixins: [UtilsMixin, TimerMixin],

	data: [],
	/**
	* 初始化状态
	*/
	getInitialState: function() {
		return {
			doRenderScene: false,
			loaded: false,
		};
	},

    componentDidMount: function() {
		InteractionManager.runAfterInteractions(() => {
			this.setState({doRenderScene: true});
			this.fetchData();
		 });
	},

	/**
	* 选择员工
	*/
	chooseEmp: function() {
		var value = this.refs.form.getValue();
		if(value){
			this.props.navigator.push({
				title:"选择员工",
				component: empList,
				passProps :{
					welfareName:value.name,
					typeid : value.typeid,
					employees:this.data,
					backRoute:this.props.backRoute,
					refresh : this.props.refresh ,
				},
			});
		}
	},

	_renderPlaceholderView: function() {
		return (
			<View>
				<NavBar 
					route={this.props.route}
					navigator={this.props.navigator} 
					hideBottomLine={false}/>
			</View>
		);
	},

	//作为下个页面查找员工使用
	fetchData: async function() {
		this.props.showLoading();
		this.setState({
			loaded: false,
			fetchForbidden: false,
		});
		try {
			let responseData = await this.props.request( Global.host + FIND_URL, {
				body: JSON.stringify({
					ownerOrg:Global.USER_LOGIN_INFO.company.id,
				})
			});
			this.props.hideLoading();
			this.data = responseData.body;
		} catch(e) {		
			this.props.requestCatch(e);
		}
	},


	render: function() {
		var listView =null;
		if(!this.state.doRenderScene)
			return this._renderPlaceholderView();		

		return (
			<View style={[styles.container]}>
				<ScrollView style={styles.sv}>
					<View style={styles.placeholder} />
					<Form
						ref="form"
						type={Welfare}
						options={options}
						value={this.state.value}
						onChange={this.onFormChange} />
					<View style={Global.styles.PLACEHOLDER20} />
			    </ScrollView>
			    <View style={{flex: 1, flexDirection: 'row',position:'absolute',bottom:10,width:Global.getScreen().width-20,marginLeft:10, marginTop: 10,}}>
						<TouchableOpacity 
							style={[Global.styles.CENTER, {height: 40, flex: 1, backgroundColor: Global.colors.IOS_BLUE, borderRadius: 3,}]} 
							onPress={this.chooseEmp}>
				    		<Text style={{color: '#ffffff',}}>下一步</Text>
				    	</TouchableOpacity>
				    	<View style={{flex: 0.05}}></View>
				    	<TouchableOpacity 
				    		style={[Global.styles.CENTER, {height: 40, flex: 1, backgroundColor: Global.colors.IOS_BLUE, borderRadius: 3,}]} 
				    		onPress={()=>{this.props.navigator.pop();}}>
				    		<Text style={{color: '#ffffff',}}>取消</Text>
				    	</TouchableOpacity>
					</View>
			    <NavBar 
					hideBottomLine={false}
					navigator={this.props.navigator} 
					route={this.props.route}/>
			</View>
		);
	},

});

module.exports = UtilsHoc(WelfareAdd);
