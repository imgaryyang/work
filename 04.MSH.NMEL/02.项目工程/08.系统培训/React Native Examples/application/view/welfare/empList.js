'use strict';

var React = require('react-native');
var NavBar = require('../NavBar');
var Icon = require('react-native-vector-icons/Ionicons');
var Global = require('../../Global');
var WelfList = require('./welfList');
var Add = require('./add');

var t = require('tcomb-form-native');
var TcombSelect = require('../lib/TcombSelect');
var tStyles = require('../lib/TcombStylesThin');

var {
	Alert,
	StyleSheet,
	ScrollView,
	View,
	Text,
	Image,
	TouchableOpacity,
	TextInput,
	InteractionManager,
	ListView,
} = React;


var Form = t.form.Form;
t.form.Form.stylesheet = tStyles;

var Employees = t.struct({
	employee : t.String,
});

var EmployeeList = React.createClass({

	data: [],

	getInitialState: function() {
		var ds = new ListView.DataSource({
			rowHasChanged: (row1, row2) => row1 !== row2,
		});
		return {
			doRenderScene: false,
			loaded: false,
			value :{
				welfareName:this.props.welfareName,
				typeid : this.props.typeid,
				employees:this.props.employees,
			},
			cond: null,
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

    save: function() {
    	var value = this.refs.form.getValue();
    	if(value){
    		this.props.navigator.push({
	            title: "填写福利金额",
	            component: Add,
	            passProps: {
	            	ids: value.employee.split(';'),
	            	welfareName:this.props.welfareName,
	            	typeid:this.props.typeid,
	            	backRoute:this.props.backRoute,
	            	refresh:this.props.refresh,
	            },
	            hideNavBar:true,
      	  });
    	}
        
    },



	render: function() {
		var items = '{';
		var employees = this.props.employees;
		for (var i = employees.length - 1; i >= 0; i--) {
			items += '"'+employees[i].id+'":"'+employees[i].name+'",';
		};
		items = items.substring(0,items.length-1);
		if(items.length>0)
			items +='}';
		else
			items='{}';
		var item = JSON.parse(items); 
		var options = {
				fields: {
					employee :{
						label : '员工列表：',
						factory: TcombSelect,
						type: 'multi',
						display: 'col',
						disabled: false,
						options: item,
						icon: (<Icon name='ios-circle-outline' size={18} color={Global.colors.IOS_DARK_GRAY} style={[Global.styles.ICON, {marginRight: 10,}]} />),
						activeIcon: (<Icon name='ios-checkmark' size={18} color={Global.colors.ORANGE} style={[Global.styles.ICON, {marginRight: 10,}]} />),
						error:'请选择员工',
					},
				},
			};
		if(!this.state.doRenderScene)
			return this._renderPlaceholderView();

		var SIStyleIOS = Global.os === 'ios' ? Global.styles.TOOL_BAR.SEARCH_INPUT_IOS : {};
		return (
			<View style={Global.styles.CONTAINER}>
				<ScrollView style={styles.sv}>
					<View style={Global.styles.PLACEHOLDER40} />
					<View style={Global.styles.PLACEHOLDER20} />
				 	<Form
						ref="form"
						type={Employees}
						options={options}
						value={this.state.value}
						onChange={this.onFormChange} />
				<View style={Global.styles.PLACEHOLDER20} />
			    </ScrollView>
			    <View style={{flex: 1, flexDirection: 'row',position:'absolute',bottom:10,marginLeft:10, marginTop: 10,width:Global.getScreen().width-20,backgroundColor:Global.colors.IOS_BG,}}>
						<TouchableOpacity 
							style={[Global.styles.CENTER, {height: 40, flex: 1, backgroundColor: Global.colors.IOS_BLUE, borderRadius: 3,}]} 
							onPress={this.save}>
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


	_renderPlaceholderView: function() {
		return (
			<View></View>
		);
	},
});

var styles = StyleSheet.create({

	sv: {
		flex:1,
		paddingLeft: 20,
		paddingRight: 20,
	},


	item: {
		width: Global.getScreen().width ,
        flexDirection: 'row',
        padding: 10,
        paddingLeft: 0,
        paddingRight: 20,
	},

	
});

module.exports = EmployeeList;
