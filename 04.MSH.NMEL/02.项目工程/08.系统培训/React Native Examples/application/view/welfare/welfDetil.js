'use strict';

var React = require('react-native');
var NavBar = require('../NavBar');
var Icon = require('react-native-vector-icons/Ionicons');
var Global = require('../../Global');
var welfDetilEdit =require('./welfDetilEdit');

var UtilsHoc = require('../lib/UtilsHoc');
var FilterMoneyHoc = require('../../filter/FilterMoneyHoc');
// var UtilsMixin = require('../lib/UtilsMixin');
// var TimerMixin = require('react-timer-mixin');
// var FilterMixin = require('../../filter/FilterMixin');
var AccountAction = require('../actions/AccountAction');
//var PayDetail = require('./PayDetail');
var Cashier = require('../lib/Cashier');


var {
		Animated,
		Alert,
		StyleSheet,
		ScrollView,
		View,
		Text,
		Image,
		TouchableOpacity,
		InteractionManager,
		ListView,
} = React;

var FIND_URL = 'welfareinfo/findWelfDetil';
var DEL_URL =  'welfareinfo/delete';
var totalamt = '';

var WelfareOverviewList = React.createClass({

	// mixins: [UtilsMixin, TimerMixin,FilterMixin],
	
	data:[],
	item:null,
	rowID :null ,


	getInitialState: function() {
		var ds = new ListView.DataSource({
			rowHasChanged: (row1, row2) => row1 !== row2,
		});
		return {
			doRenderScene: false,
			dataSource: ds.cloneWithRows(this._genRows({})),
			loaded: false,
			delBtnLeftPos: new Animated.Value(-60),
		};

	},

	_genRows: function(pressData: {[key: number]: boolean}): Array<string> {
		var dataBlob = [];
		return dataBlob;
	},

	componentDidMount: function() {
		InteractionManager.runAfterInteractions(() => {
			this.setState({doRenderScene: true});
			this.fetchData();
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
	},

	/**
	*下拉刷新
	*/
	pullRefresh:function(){
		this.setState({isRefreshing:true});
		this.fetchData();
	},

	//抓取数据
	fetchData: async function() {
		this.props.showLoading();
		this.setState({
			loaded: false,
			fetchForbidden: false,
		});
		try {
			let responseData = await this.props.request(Global.host+FIND_URL, {
				body: JSON.stringify({
					overview:this.props.id,
				})
			});
			this.props.hideLoading();
			this.data = responseData.body;
			this.setState({
				dataSource: this.state.dataSource.cloneWithRows(responseData.body),
				isRefreshing: false,
				loaded: true,
			});
		} catch(e) {
			this.setState({
				isRefreshing: false,
			});
			if(e.status == 401 || e.status == 403)
				this.setState({fetchForbidden: true});
			this.props.requestCatch(e);
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

	_doDelConf : function(item,rowID){
		this.item = item;
    	this.rowID = rowID;
		Alert.alert(
				'警告',
				'确认删除？',
				[
					{text:'取消',style:'cancel'},
					{text:'确定' , onPress:()=>this._doDel()},
				]
			);
	},

	showDelBtn : function(){
		Animated.timing(
			this.state.delBtnLeftPos,
			{
				toValue:0,
				duration:100,
			},
		).start();
	},

	hideDelBtn : function(){
		Animated.timing(
			this.state.delBtnLeftPos,
			{
				toValue:-60,
				duration:100,
			},
		).start();
	},

	_doEdit:function(item){
		console.log(item);
		this.props.navigator.push({
			title:'修改福利明细',
			component:welfDetilEdit,
			passProps:{
				item:{
					id:item.id,
					name:item.employee.name,
					fullAmt:item.fullAmt,
				},
				refresh:this.refresh,
			}
		})
	},

	//福利发放
	_confirmPay:function(){
		//let totalamt=0;
		totalamt=0;
		for(var i=0;i<this.data.length;i++){
			totalamt += parseFloat(this.data[i].fullAmt);
		}
		Alert.alert(
			'警告',
			'发放总金额：'+this.props.filterMoney(totalamt)+'确定发放？',
			[
				{text:'取消',style:'cancel'},
				{text:'确定' , onPress:()=>this._doPay(totalamt)},
			]
		);

	},

	_doPay:function(totalamt){
		/*this.props.navigator.push({
			title:'发放福利',
			component:Cashier,
			passProps:{
				overview:this.props.id,
				totalamt:totalamt,
				refresh:this.props.refresh,
				backRoute:this.props.backRoute,
			}
		})*/

		this.props.showLoading();
			
		var nav = this.props.navigator ? this.props.navigator : this.props.rootNavigator;
	    nav.push({
	    	title: '支付',
	        component: Cashier,
	        //hideNavBar: hideNavBar ? hideNavBar : false,	            
	        passProps: {

	    		payAmt:totalamt,
	    		payDesc:'发放福利',
	    		pay: this.pay,
	    		afterPay:this.afterPay,
	    	},
	    });
	    this.props.hideLoading();
	},

	pay: async function(acctNo) {
		this.props.showLoading();
		var WELFARE_PAY_URL = 'welfareinfo/pay';
		console.log('iiiiiiiiiiiiiiiii');
		console.log(totalamt);
		console.log(acctNo);
		try {
			let responseData = await this.props.request(Global.host +WELFARE_PAY_URL, {
				body: JSON.stringify({
                	//付款信息
                    overview:this.props.id,
                    totalamt:totalamt,
                    mobile: Global.USER_LOGIN_INFO.mobile,
                    acctNo : acctNo,
				}),
			});
			if(responseData.status == 'success' && responseData.body != undefined){
               AccountAction.updateAccount(responseData.body);
            }
			this.props.hideLoading();
			// this.props.refresh.call(this,0);
			// this.props.navigator.popToRoute(this.props.backRoute); 
			//this.toast('发放成功');
		} catch (e) {
			this.props.requestCatch(e);
		}
	},

	afterPay: function() {
		// this.pullRefresh.call();
		// this.props.navigator.popToRoute(this.props.route);
		this.props.refresh.call(this,0);
		this.props.navigator.popToRoute(this.props.backRoute); 
	},

	controlDelBtn : function(){
		if(!this.state.showDelBtn){
			this.showDelBtn();
		}else{
			this.hideDelBtn();
		}
		this.setState({showDelBtn: !this.state.showDelBtn});
	},

	_doDel : async function() {
    	this.props.showLoading();
		try {
			let responseData = await this.props.request(Global.host+DEL_URL, {
				body: JSON.stringify({
					id: this.item.id,
				})
			});
			this.props.hideLoading();
			//从前端数组中删除该条数据
			this.data.splice(this.rowID, 1);
			this.setState({
				dataSource: this.state.dataSource.cloneWithRows(this.data),
			});
			this.controlDelBtn();
			this.props.toast('删除成功');
		} catch(e) {
			this.props.requestCatch(e);
		}
    },

	render : function(){
		var listView =null;
		if(!this.state.doRenderScene)
			return this._renderPlaceholderView();

		var refreshText = this.state.fetchForbidden === true ? 
			'您还未登录，登录后点击此处刷新数据' : 
			'暂无符合条件的数据，点击此处重新载入';

		var refreshView = (this.state.loaded || this.state.fetchForbidden) && this.data.length === 0 ?
			this.props.getListRefreshView(refreshText, this.refresh) : 
			null;
		var paybtn = this.props.ispaied ==='0'?
				(<TouchableOpacity style={[Global.styles.NAV_BAR.BUTTON]} onPress={this._confirmPay}>
					<Text style={{color:Global.colors.IOS_BLUE,}}>发放</Text>
				</TouchableOpacity>):null;
		return (
			<View style = {[Global.styles.CONTAINER]}>
				<ScrollView style={styles.sv} refreshControl={this.props.getRefreshControl(this.state.isRefreshing,this.pullRefresh)}>
					<View style={Global.styles.PLACEHOLDER40} />
					<View style={Global.styles.PLACEHOLDER20} />
					{refreshView}
					<ListView
						key={this.data}
				        dataSource={this.state.dataSource}
				        renderRow={this.renderItem}
				        style={[styles.list]} />
				    <View style={Global.styles.PLACEHOLDER20} />
			    </ScrollView>			
				<NavBar 
					route={this.props.route}
					navigator={this.props.navigator} 
					hideBottomLine={false}
					rightButtons={(
							<View style={[Global.styles.NAV_BAR.BUTTON_CONTAINER, Global.styles.NAV_BAR.RIGHT_BUTTONS]}>
								<TouchableOpacity style={[Global.styles.NAV_BAR.BUTTON]} onPress={this.refresh}>
									<Text style={{color:Global.colors.IOS_BLUE,}}>刷新</Text>
								</TouchableOpacity>
								{paybtn}
							</View>
						)}
				>
				</NavBar>
			</View>
			);
	},

	renderItem : function(item: string, sectionID: number, rowID: number){
		var topLine=rowID ==='0' ? <View style={Global.styles.FULL_SEP_LINE}/> : null;
		var bottomLine = (<View style={Global.styles.FULL_SEP_LINE} />);
		var amt = this.props.filterMoney(item.fullAmt);
		var listItem = this.props.ispaied ==='0'? 
				(
					<TouchableOpacity onPress={()=>{this._doEdit(item)}}>
						<View style={[styles.item,]}>
							<Text style={{flex:1,marginLeft:40,fontSize:15,}}>{item.employee.name}</Text>
							<Text style={{flex:1,marginRight:10,fontSize:15,textAlign:'right',color:Global.colors.ORANGE,}}>金额：{amt}</Text>
							<Icon name='ios-arrow-right' size={18} color={Global.colors.IOS_ARROW} style={[Global.styles.ICON, {width: 40}]} />
						</View>						
					</TouchableOpacity>
				):(
				<View style={[styles.item,]}>
					<Text style={{flex:1,marginLeft:40,fontSize:15,}}>{item.employee.name}</Text>
					<Text style={{flex:1,marginRight:10,fontSize:15,textAlign:'right',color:Global.colors.ORANGE,}}>金额：{amt}</Text>
				</View>
				)
		return (
			<View>
				{topLine}
				{listItem}
				{bottomLine}
			</View>
			);
	},

});

var styles = StyleSheet.create({

	sv: {
		flex:1,
	},
	list:{
		backgroundColor:'#ffffff'
	},

	del : {
		paddingRight:10,
		width:50,
	},

	item: {
		flexDirection:'row',
		flex:1,
		height:50,
		flexWrap:'nowrap',
		width:Global.getScreen().width,
        justifyContent: 'center',
        alignItems:'center',
	},

	
});

module.exports = UtilsHoc(FilterMoneyHoc(WelfareOverviewList)) ; 