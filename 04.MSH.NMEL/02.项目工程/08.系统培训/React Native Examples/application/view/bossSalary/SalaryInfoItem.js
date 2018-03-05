'use strict';
// SalaryInfo

var SalaryInfoEdit = require('./SalaryInfoEdit');

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


var FIND_URL =  'salaryinfo/findOne';


var SalaryInfoItem = React.createClass({

	mixins: [UtilsMixin, TimerMixin],

	data: [],
	item: null,
	rowID: null,

	
getInitialState: function() {
		return {
			doRenderScene: false,
			id:'0',
			isRefreshing: false,
		};
	},

    componentDidMount: function() {
		InteractionManager.runAfterInteractions(() => {
			this.fetchData();
			// this.setState({doRenderScene: true});
			
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
		this.fetchData();
		// this.setState({isRefreshing: true});
	},
	pullToRefresh: function() {
 		this.setState({isRefreshing: true});
 		this.fetchData();
 	},
	fetchData: async function() {
		
		this.showLoading();
		try {
			let responseData = await this.request(Global.host + FIND_URL, {
				body: JSON.stringify({
					emplyeeId: this.props.emplyeeId,
				})
			});
			this.hideLoading();
			this.data=responseData.body;
			this.setState({
					isRefreshing: false,
					doRenderScene: true,
				});

			if(this.data!=null){
				/*有薪酬信息*/
				console.log('data！=null');
				this.setState({
					id:this.data.id,
				});
				// var aa=this.data.amt1;
				// var bb= parseFloat(aa).toFixed(2);
				// console.log(bb);
				}else{
					/*无薪酬信息*/
					this.setState({
						id:'0',
					});
				}	
		} catch(e) {
			this.hideLoading();
			this.setState({
				isRefreshing: false,
			});
			
			this.requestCatch(e);
		}
	},

	
	onPressEdit: function( title, component, hideNavBar) {
		console.log('Id'+this.state.id);
		var nav = this.props.navigator ? this.props.navigator : this.props.rootNavigator;
	        nav.push({
	        	title: title,
	            component: component,
	            hideNavBar: hideNavBar ? hideNavBar : false,
	            passProps: {
            		emplyeeId: this.props.emplyeeId,
            		id:this.state.id,
            		refresh: this.refresh,
            		value:this.data,
            	},
	            
	        });
	},


	render: function() {

		if(!this.state.doRenderScene)
			return this._renderPlaceholderView();

		var refreshText = this.state.fetchForbidden === true ? 
			'您还未登录，登录后点击此处刷新数据' : 
			'该用户还未设置薪酬，请点击设置进行薪酬设置！';

		var refreshView = (this.data==null )?
			this.getListRefreshView(refreshText, this.pullToRefresh) : 
			null;

		var salaryinfoView = this.data!=null ?
			(	<View style={styles.list}>
					<View style={Global.styles.FULL_SEP_LINE} />
					<View style={[styles.row]}>
						<Text style={[styles.item1]}>税前工资：</Text>
						<Text style={[styles.item2]}>{parseFloat(this.data.amt1).toFixed(2)}</Text>
					</View>
					<View style={Global.styles.FULL_SEP_LINE} />
					<View style={[styles.row]}>
						<Text style={[styles.item1]}>医 社 保：</Text>
						<Text style={[styles.item2]}>{parseFloat(this.data.amt2).toFixed(2)}</Text>
					</View>
					<View style={Global.styles.FULL_SEP_LINE} />
					<View style={[styles.row]}>
						<Text style={[styles.item1]}>公 积 金：</Text>
						<Text style={[styles.item2]}>{parseFloat(this.data.amt3).toFixed(2)}</Text>

					</View>
					<View style={Global.styles.FULL_SEP_LINE} />
					<View style={[styles.row]}>
						<Text style={[styles.item1]}>补     助：</Text>
						<Text style={[styles.item2]}>{parseFloat(this.data.amt4==null?0:this.data.amt4).toFixed(2)}</Text>
					</View>
					<View style={Global.styles.FULL_SEP_LINE} />
					<View style={[styles.row]}>
						<Text style={[styles.item1]}>税     收：</Text>
						<Text style={[styles.item2]}>{parseFloat(this.data.amt5==null?0:this.data.amt5).toFixed(2)}</Text>
					</View>
					<View style={Global.styles.FULL_SEP_LINE} />
					<View style={[styles.row]}>
						<Text style={[styles.item1]}>税后工资：</Text>
						<Text style={[styles.item2]}>{parseFloat(this.data.amt6).toFixed(2)}</Text>
					</View>
					<View style={Global.styles.FULL_SEP_LINE} />
					<View style={[styles.row]}>
						<Text style={[styles.item1]}>备注1：</Text>
						<Text style={[styles.item1]}>{this.data.memo1}</Text>
					</View>
					<View style={Global.styles.FULL_SEP_LINE} />
					<View style={[styles.row]}>
						<Text style={[styles.item1]}>备注2：</Text>
						<Text style={[styles.item1]}>{this.data.memo2}</Text>
					</View>
					<View style={Global.styles.FULL_SEP_LINE} />
				</View>) : 
			null;	

		var SIStyleIOS = Global.os === 'ios' ? Global.styles.TOOL_BAR.SEARCH_INPUT_IOS : {};

	
	return (
			<View style={[Global.styles.CONTAINER]}>
				<View style={styles.paddingPlace} />
				<ScrollView style={styles.sv} refreshControl={this.getRefreshControl(this.pullToRefresh)}>	
					{refreshView}
					{salaryinfoView}
						
			    </ScrollView>
			    <NavBar 
					rootNavigator={this.props.rootNavigator} 
					navigator={this.props.navigator} 
					route={this.props.route}
					rightButtons={(
						<View style={[Global.styles.NAV_BAR.BUTTON_CONTAINER, Global.styles.NAV_BAR.RIGHT_BUTTONS]}>
							<TouchableOpacity style={[Global.styles.NAV_BAR.BUTTON]} onPress={()=>{this.onPressEdit('编辑薪资',SalaryInfoEdit)}}>
								<Text style={{color: Global.colors.IOS_BLUE,}}>设置</Text>
							</TouchableOpacity>
							<TouchableOpacity style={[Global.styles.NAV_BAR.BUTTON]} onPress={()=>{this.refresh()}}>
								<Text style={{color: Global.colors.IOS_BLUE,}}>刷新</Text>
							</TouchableOpacity>
						</View>
					)} />
			</View>
		);
	},

	
	_renderPlaceholderView: function() {
		return (
			 <NavBar 
					rootNavigator={this.props.rootNavigator} 
					navigator={this.props.navigator} 
					route={this.props.route}
					rightButtons={(
						<View style={[Global.styles.NAV_BAR.BUTTON_CONTAINER, Global.styles.NAV_BAR.RIGHT_BUTTONS]}>
							<TouchableOpacity style={[Global.styles.NAV_BAR.BUTTON]} onPress={()=>{this.onPressEdit('编辑薪资',SalaryInfoEdit)}}>
								<Text style={{color: Global.colors.IOS_BLUE,}}>设置</Text>
							</TouchableOpacity>
							<TouchableOpacity style={[Global.styles.NAV_BAR.BUTTON]} onPress={()=>{this.refresh()}}>
								<Text style={{color: Global.colors.IOS_BLUE,}}>刷新</Text>
							</TouchableOpacity>
						</View>
					)} />
		);
	},
});
var styles = StyleSheet.create({
	sv: {
		flex: 1,

	},
	paddingPlace: {
		height: Global.NBPadding +20,
	},

	list: {
		backgroundColor: 'white',
	},
	touchholder:{
		flex:1,
	},
	row: {
		width: Global.getScreen().width,
        flexDirection: 'row',
        paddingLeft: 10,
        paddingRight: 10,
		height: 40,
		alignItems:'center',
	},
	item1: {
		width: 80, 
		fontSize: 13,
		textAlign: 'left',
		// backgroundColor:'red',
			},
	item2: {
		width: 80, 
		fontSize: 13,
		textAlign: 'right',
		// backgroundColor:'red',
	},
	searchInput: {
		width: Global.getScreen().width - 100,
	},
});

module.exports = SalaryInfoItem;