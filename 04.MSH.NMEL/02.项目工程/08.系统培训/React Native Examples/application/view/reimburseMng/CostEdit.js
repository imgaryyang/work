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
var FilterMixin = require('../../filter/FilterMixin');
var {
	StyleSheet,
	ScrollView,
	View,
	Text,
	Image,
	TouchableOpacity,
	InteractionManager,
	DatePickerAndroid,
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
		width: (Global.getScreen().width - 90) / 7,
		height: (Global.getScreen().width - 90) / 7,
		borderRadius:(Global.getScreen().width - 90) / 8,
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
var amt = t.refinement(t.Number, function(n) {
	return n >= 0;
});
var num =  t.refinement(t.Number, function(n) {
	var re = /^[0-9]{1,2}$/;
	return re.test(n) ;
});
var Cost = t.struct({
	costId: t.maybe(t.String),
	custId : t.String,
	amt: amt,
	type: t.String,
	num: num,
	memo : t.String,
	date:t.Date,
	time:t.Date
});

var options = {
	mixins:[UtilsMixin,FilterMixin],	
	fields: {
		costId: {
			factory: TcombHidden,
		},
		custId:{
			factory : TcombHidden,
		},
		amt: {
			label: '消费金额',
			error: '金额必须为大于0的数字且长度不能超过17位',
			maxLength:17
		},
		type: {
			label: '消费类型',
			factory: ImageSelect,
			type: 'single',
			display: 'row',
			disabled: false,
			options: {
				'1': (<View style={[styles.portrait,Global.styles.CENTER,{backgroundColor:'rgba(111, 172, 240, 1)'}]}><Icon style={[{color:'#ffffff',textAlign: 'center',}]} name='plane' size={25}/></View>),
				'2': (<View style={[styles.portrait,Global.styles.CENTER,{backgroundColor:'rgba(240, 216, 79, 1)'}]}><Icon style={[{color:'#ffffff',textAlign: 'center',}]} name='android-car' size={25}/></View>),
				'3': (<View style={[styles.portrait,Global.styles.CENTER,{backgroundColor:'rgba(245, 80, 150, 1)'}]}><Icon style={[{color:'#ffffff',textAlign: 'center',}]} name='ios-home' size={25}/></View>),
				'4': (<View style={[styles.portrait,Global.styles.CENTER,{backgroundColor:'rgba(88, 209, 137, 1)'}]}><Icon style={[{color:'#ffffff',textAlign: 'center',}]} name='fork' size={25}/></View>),
				'5': (<View style={[styles.portrait,Global.styles.CENTER,{backgroundColor:'rgba(234, 148, 106, 1)'}]}><Icon style={[{color:'#ffffff',textAlign: 'center',}]} name='ios-telephone' size={25}/></View>),
				'6': (<View style={[styles.portrait,Global.styles.CENTER,{backgroundColor:'rgba(186, 119, 219, 1)'}]}><Icon style={[{color:'#ffffff',textAlign: 'center',}]} name='more' size={25}/></View>),
			},
			// icon: (<Icon name='ios-circle-filled' size={18} color='#ffffff' style={[Global.styles.ICON, styles.iconOnPortrait]} />),
			activeIcon: (<Icon name='ios-checkmark' size={18} color={Global.colors.ORANGE} style={[Global.styles.ICON, styles.iconOnPortrait]} />),
			error: '请选择头像',
			/*date: {
				label: '日期',
				
			},*/
		},
		num: {
			label: '发票(张)',
			error: '发票张数必须为正整数且长度不能超过2位',
			
		},
		memo: {
			label: '描述',
			error: '描述长度不能超过100位',
		},
		date: {
			label: '日期',
			mode: 'date',
			maximumDate:new Date(),
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
		time: {
			label: '时间',
			mode: 'time',
			config: {
				format: function(time) {
					var time = new Date(time);
					var hour = (time.getHours() > 9) ? time.getHours() : '0' + time.getHours();
					var minute = (time.getMinutes() > 9) ? time.getMinutes() : '0' + time.getMinutes();
					return hour+':'+minute ;
				}
			}
		}
	}
};

var FIND_URL =  'cost/findOne';
var SUBMIT_URL =   'cost/save';

var CostEdit = React.createClass({

	mixins: [UtilsMixin],
	/**
	* 初始化状态
	*/
	getInitialState: function() {
		return {
			doRenderScene: false,
			loaded: false,
			value: {
				costId: this.props.costId,
				custId : Global.USER_LOGIN_INFO.Employees.id,
			},
			//日期时间
			// date: null,
			// time: null,
			// timeText:'',
			// dateText:''
		};
	},

    componentDidMount: function() {
		InteractionManager.runAfterInteractions(() => {
			this.setState({
				doRenderScene: true
			});
			if (this.props.costId && this.props.costId != '') {
				this.fetchData();
			}
		});
	},

	fetchData: async function() {
		this.showLoading();
		try {
			let responseData = await this.request(Global.host+FIND_URL, {
				body: JSON.stringify({
					costId: this.props.costId,
				})
			});
			console.log(responseData.body);
			this.setState({
				value: {
					custId:responseData.body.custId,
					costId:responseData.body.costId,
					num :responseData.body.num,
					amt:responseData.body.amt,
					memo:responseData.body.memo,
					type:responseData.body.type,
					time:new Date(responseData.body.date),
					date:new Date(responseData.body.date),
				},
				loaded: true,
				//显示时间日期
				/*date : new Date(responseData.body.date),
				time:{
					hour : new Date(responseData.body.date).getHours(),
					minute : new Date(responseData.body.date).getMinutes()
				},
				timeText : ((new Date(responseData.body.date).getHours()<10?'0'+new Date(responseData.body.date).getHours():new Date(responseData.body.date).getHours())+ ':' + (new Date(responseData.body.date).getMinutes()<10?'0'+new Date(responseData.body.date).getMinutes():new Date(responseData.body.date).getMinutes())),
				dateText : new Date(responseData.body.date).getFullYear() +'-'+((new Date(responseData.body.date).getMonth()+1)>9?(new Date(responseData.body.date).getMonth()+1):('0'+(new Date(responseData.body.date).getMonth()+1)))+'-'+(new Date(responseData.body.date).getDate()>9?new Date(responseData.body.date).getDate():('0'+new Date(responseData.body.date).getDate()))*/
			});
			this.hideLoading();
		} catch(e) {
			this.requestCatch(e);
		}

	},
	//获取选择日期
	// getDate:function(date,dateText){
	// 	console.log('date***********************************');
	// 	console.log(date);
	// 	this.setState({date:date,dateText:dateText});
	// },
	//获取选择时间
	// getTime:function(hour,minute,timeText){
	// 	console.log('time************************');
	// 	console.log(hour+'  '+minute);
	// 	this.setState({
	// 		time:{
	// 			hour:hour,
	// 			minute:minute
	// 		},
	// 		timeText:timeText
	// 	})
	// },
	// showTime:function(){
	// 	return this.state.timeText;
	// },
	// 
	/**
	* 保存数据
	*/
	save: function() {
		var value = this.refs.form.getValue();
		console.log(value);
		if (!value) {
			return;
		}
		var year = new Date(value.date).getFullYear();
		var month = new Date(value.date).getMonth();
		var day = new Date(value.date).getDate();
		var hour = new Date(value.time).getHours();
		var minute = new Date(value.time).getMinutes();
		var date = new Date(year,month,day,hour,minute).getTime();
		var now = new Date().getTime();
		if(date>now){
			Alert.alert('警告','消费记录日期时间不能超过当前时间！');
			return;
		}
		/*if(!this.state.date || !this.state.time){
			return;
		}*/
		//处理日期时间数据
		/*var year = this.state.date.getFullYear();
		var month = this.state.date.getMonth();
		var day = this.state.date.getDate();
		var hour = this.state.time.hour;
		var minute = this.state.time.minute;
		var date = new Date(year,month,day,hour,minute);
		this.doSave(value,date);*/
		this.doSave(value);

	},


	doSave:async function(value,date) {
		console.log(value);
		this.showLoading();
		try {
			var body = JSON.stringify(value);
			let responseData = await this.request(Global.host+SUBMIT_URL, {
				body: body
			});
			this.hideLoading();
			//回调list的刷新
			this.props.refresh.call();
			this.props.navigator.pop();
			this.toast('保存成功！');

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
		this.setState({value:value});
	},

	render: function() {
		if(!this.state.doRenderScene)
			return this._renderPlaceholderView();

		return (
			<View style={[Global.styles.CONTAINER,styles.container]}>
				<ScrollView style={styles.sv}>
					<View style={styles.placeholder} />
					<Form
						ref="form"
						type={Cost}
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
			<View style={[Global.styles.CONTAINER,styles.container]}></View>
		);
	},
});

module.exports = CostEdit;
