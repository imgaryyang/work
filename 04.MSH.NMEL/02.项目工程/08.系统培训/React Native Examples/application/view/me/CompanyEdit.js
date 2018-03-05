'use strict';

var React = require('react-native');
var NavBar = require('../NavBar');
var Global = require('../../Global');
var Icon = require('react-native-vector-icons/Ionicons');
var Loading = require('../lib/Loading');
var t = require('tcomb-form-native');

var UserAction = require('../actions/UserAction');
var UtilsMixin = require('../lib/UtilsMixin');
var TimerMixin = require('react-timer-mixin');

var {
	StyleSheet,
	ScrollView,
	View,
	Text,
	Image,
    PixelRatio,
	TouchableOpacity,
	Navigator,
	Dimensions,
	TextInput,
	AsyncStorage,
	Alert,
	InteractionManager,
} = React;

var Form = t.form.Form;
//t.form.Form.stylesheet = tStyles;

var Company = t.struct({
	name: t.maybe(t.String),
	licnum: t.maybe(t.String),
	brccode: t.maybe(t.String),
	phone: t.maybe(t.String),
	fax: t.maybe(t.String),
	address: t.maybe(t.String),
});
var options = {
	fields: {
		name: {
			label: '名称',
			error: '名称长度不能超过50个字符',
			maxLength:50,
		},
		licnum:{
			label:'营业执照代码',
			error:'长度为11位',
		},
		brccode:{
			label:'组织机构代码',
			error:'长度为11位',
		},
		phone:{
			label:'电话',
			error:'长度为11位',
		},
		fax:{
			label:'传真',
			error:'长度为11位',
		},
		address:{
			label:'地址',
			maxLength:200,
			error:'长度不能超过200字符',
		}

	}
}
var SAVE_URL = 'company/save';

var CompanyEdit = React.createClass({

	mixins: [UtilsMixin, TimerMixin],

    statics: {
        title: 'CompanyEdit',
        description: '编辑企业信息',
    },

	getInitialState:function(){
		return{
			showLoading: false,
			doRenderScene: false,
			value:{
				name:this.props.name,
				licnum:this.props.licnum,
				brccode:this.props.brccode,
				phone:this.props.phone,
				fax:this.props.fax,
				address:this.props.address,
				owner:Global.USER_LOGIN_INFO.id,
				id:this.props.id?this.props.id:'',
			}
		};
	},
	componentDidMount: function() {
		InteractionManager.runAfterInteractions(() => {
			this.setState({doRenderScene: true});
		});
	},
	/**
	* 保存数据
	*/
	save: function() {
		var value = this.refs.form.getValue();
		if(value)
			this.doSave(value);
	},

	doSave: async function(value){
		this.showLoading();
		try {

			this.setState({
				value:{
					name:value.name,
					licnum:value.licnum,
					brccode:value.brccode,
					phone:value.phone,
					fax:value.fax,
					address:value.address,
					owner:Global.USER_LOGIN_INFO.id,
					id:this.props.id?this.props.id:''
				}
			});

			var body = JSON.stringify(this.state.value);

			let responseData = await this.request(
				Global.host + SAVE_URL, 
				{
					body: body,
				}
			);
			//console.log(responseData.body);
			var updateInfo =  {
				company:responseData.body,
				role:1
			};
			UserAction.updateUser(updateInfo);
			// await this.updateUserInfo(updateInfo);
		    this.props.refresh.call();
			this.props.navigator.pop();	
			this.hideLoading();
		} catch(e) {
			this.requestCatch(e);
		}
	
	},
	onFormChange: function(value, objName) {
		
	},
	render:function(){
		if(!this.state.doRenderScene)
			return this._renderPlaceholderView();

		return(
			<View style={Global.styles.CONTAINER} >
				<ScrollView style={styles.sv}>
					<View style={styles.paddingPlace} />
					<Form
						ref="form"
						type={Company}
						options={options}
						value={this.state.value}
						onChange={this.onFormChange} />

					<TouchableOpacity 
						style={[Global.styles.BLUE_BTN]} 
						onPress={this.save}>
			    		<Text style={{color: '#ffffff',}}>保存</Text>
			    	</TouchableOpacity>

					<View style={Global.styles.PLACEHOLDER40} />

				</ScrollView>
			</View>
		);
	},

	_renderPlaceholderView: function() {
		return (
			<View style={Global.styles.CONTAINER} />
		);
	},

});
var styles = StyleSheet.create({
	paddingPlace: {
		flex: 1,
		height: Global.NBPadding+20 ,
	},
	sv: {
		paddingLeft: 20,
		paddingRight: 20,
		backgroundColor: 'white',
	},

	rend_row: {
    	flexDirection: 'row',
    	height:50,
    	paddingLeft:10,
    	backgroundColor:'#FFFFFF',
    	borderWidth: 1 / PixelRatio.get(),
    	borderColor:Global.colors.TAB_BAR_LINE,
    	//justifyContent: 'center',
		alignItems: 'center',
    },

});
module.exports = CompanyEdit;