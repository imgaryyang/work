'use strict';

var React = require('react-native');
var NavBar = require('../NavBar');
var Icon = require('react-native-vector-icons/Ionicons');
var Global = require('../../Global');

var t = require('tcomb-form-native');
var TcombSelect = require('../lib/TcombSelect');
var tStyles = require('../lib/TcombStylesThin');
var TcombHidden = require('../lib/TcombHidden');

// var UtilsMixin = require('../lib/UtilsMixin');
var UtilsHoc = require('../lib/UtilsHoc');
// var TimerMixin = require('react-timer-mixin');

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
	id:t.String,
	name: t.String,
	fullAmt : t.Number,
});

var options = {
	fields: {
		id: {
			factory: TcombHidden,
		},
		name: {
			label: '姓名：',
			editable:false,
		},
		fullAmt :{
			label : '金额：',
			error:'请输入福利金额且只能为数字',
		},
	},
};

var SUBMIT_URL ='welfareinfo/updWelfDetil';

var WelfareDetEdit = React.createClass({

	// mixins: [UtilsMixin, TimerMixin],

	/**
	* 初始化状态
	*/
	getInitialState: function() {
		return {
			doRenderScene: false,
			loaded: false,
			value:this.props.item,
		};
	},

    componentDidMount: function() {
		InteractionManager.runAfterInteractions(() => {
			this.setState({
				doRenderScene: true,
				// value:this.props.item,
			});
		 });
	},

	save:  function(){
		let value= this.refs.form.getValue();
		let parms = {};
		if(value){
			parms = {id:value.id,fullAmt:value.fullAmt};
			this.doSave(parms);
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
	doSave : async function(value){
		let body=JSON.stringify(value);
		this.props.showLoading();
		try{
			let responseData = await this.props.request(Global.host + SUBMIT_URL,{
				body:body,
			});
			this.props.hideLoading();
			this.props.refresh.call();
			this.props.navigator.pop();
			this.props.toast('修改成功！');
		}catch(error){
			this.props.requestCatch(error);
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

					<View style={{flex: 1, height: 40,}} />
			    </ScrollView>
				<View style={{flex: 1, flexDirection: 'row',position:'absolute',bottom:10,marginLeft:10, marginTop: 10,width:Global.getScreen().width-20,backgroundColor:Global.colors.IOS_BG,}}>
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
			    <NavBar 
					hideBottomLine={false}
					navigator={this.props.navigator} 
					route={this.props.route}/>
			</View>
		);
	},

});

module.exports = UtilsHoc(WelfareDetEdit);
