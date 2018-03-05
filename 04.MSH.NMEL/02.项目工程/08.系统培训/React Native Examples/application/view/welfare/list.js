'use strict';

var React = require('react-native');
var NavBar = require('../NavBar');
var Icon = require('react-native-vector-icons/Ionicons');
var Global = require('../../Global');
var WelfList = require('./welfList');
var WelfDetil = require('./welfDetil');

// var UtilsMixin = require('../lib/UtilsMixin');
// var TimerMixin = require('react-timer-mixin');
var UtilsHoc = require('../lib/UtilsHoc');
var TopGridMenu =require('../lib/TopGridMenu');

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

var DEL_URL =  'welfareinfo/delete';
var LIST_URL =  'welfareinfo/findOverview';

var WelfareOverviewList = React.createClass({

	// mixins: [UtilsMixin, TimerMixin],

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
			showDelBtn: false,
			delBtnLeftPos: new Animated.Value(-60),
			isRefreshing: false,
			list : 0,
		};

	},

	_genRows: function(pressData: {[key: number]: boolean}): Array<string> {
		var dataBlob = [];
		return dataBlob;
	},

	componentDidMount: function() {
		InteractionManager.runAfterInteractions(() => {
			this.setState({doRenderScene: true});
			this.fetchData(0);
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
	refresh: function(s) {
		this.setState({list:s});
		this.fetchData(s);
	},

	/**
	*下拉刷新
	*/
	pullRefresh:function(s){
		this.setState({isRefreshing:true,list:s});
		this.fetchData(s);
	},

	//抓取数据
	fetchData: async function(s) {
		this.props.showLoading();
		this.setState({
			list:s,
			loaded: false,
			fetchForbidden: false,
		});
		try {
			let responseData = await this.props.request(Global.host +LIST_URL, {
				body: JSON.stringify({
					flag:this.state.list,
					ownerOrg:Global.USER_LOGIN_INFO.company.id,
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
			<View style={Global.styles.CONTAINER}>
				{this._getNavBar()}
			</View>
		);
	},

	_doAdd : function(){

		this.props.navigator.push({
				title:"新增福利",
				component: WelfList,
				passProps:{
					backRoute: this.props.route,
					refresh:this.refresh,
				}
		});
	},

	_doDetil :function(item){
		this.props.navigator.push({
				title:'福利明细',
				component: WelfDetil,
				passProps :{
					id:item.id,
					ispaied:item.ispaied,
					refresh:this.refresh,
					backRoute:this.props.route,
				},
				hideNavBar:true,
		});
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

			let responseData = await this.props.request(Global.host +DEL_URL, {
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
			this.props.toast('删除成功！');
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
			this.props.getListRefreshView(refreshText, ()=>{this.refresh(this.state.list)}) : 
			null;

		return (
			<View style = {[Global.styles.CONTAINER]}>
				{this._getNavBar()}
				<ScrollView style={styles.sv} refreshControl={this.props.getRefreshControl(this.state.isRefreshing,()=>this.pullRefresh(this.state.list))}>
					<View style={Global.styles.PLACEHOLDER20} />
					{refreshView}
					<ListView
						key={this.data}
				        dataSource={this.state.dataSource}
				        renderRow={this.renderItem}
				        style={[styles.list]} />
					<View style={Global.styles.PLACEHOLDER20} />
			    </ScrollView>
			</View>
			);
	},


		_getNavBar: function() {
		var delBtn = this.state.list == 0 ? 
		(
			<TouchableOpacity style={[Global.styles.NAV_BAR.BUTTON]} onPress={this.controlDelBtn}>
				<Text style={{color: Global.colors.IOS_BLUE,}}>删除</Text>
			</TouchableOpacity>
		) : null;
		return (
			<NavBar 
				navigator={this.props.navigator} 
				route={this.props.route}
				flow={false}
				centerComponent={(
					<View style={[Global.styles.NAV_BAR.CENTER_VIEW, {flex: 2, flexDirection: 'row'}]} >
						<TopGridMenu 
							items={[
								{text: '未发放', onPress: this.fetchData,},
								{text: '已发放', onPress: this.fetchData,},
							]} 
							selected={this.state.list}/>
					</View>
				)}
				rightButtons={(
					<View style={[Global.styles.NAV_BAR.BUTTON_CONTAINER, Global.styles.NAV_BAR.RIGHT_BUTTONS]}>
						{delBtn}
						<TouchableOpacity style={[Global.styles.NAV_BAR.BUTTON]} onPress={()=>{this._doAdd()}}>
							<Text style={{color: Global.colors.IOS_BLUE,}}>添加</Text>
						</TouchableOpacity>
					</View>
				)} />
		);
	},


	renderItem : function(item: string, sectionID: number, rowID: number){

		var topLine = rowID === '0' ? <View style={Global.styles.FULL_SEP_LINE} /> : null;

		var delBtnLeftPos = this.state.list==0?this.state.delBtnLeftPos:-60;

        var bottomLine = (<View style={Global.styles.FULL_SEP_LINE} />);

		return (

			<View >
				{topLine}
				
				<TouchableOpacity activeOpacity={0.5} style={[styles.item, {left:delBtnLeftPos}]} onPress={()=>{this._doDetil(item)}}>
					<TouchableOpacity style={[styles.delInItem, Global.styles.CENTER]} onPress={()=>{this._doDelConf(item, rowID);}}>
						<Icon name='ios-minus' size={25} color={Global.colors.IOS_RED} style={[Global.styles.ICON]} />
					</TouchableOpacity>
					<Text style={{flex: 1, marginLeft: 20, fontSize: 15,}}>{item.name}</Text>
					<Icon name='ios-arrow-right' size={18} color={Global.colors.IOS_ARROW} style={[Global.styles.ICON, {width: 40}]} />
				</TouchableOpacity>
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
		backgroundColor: '#ffffff',
	},

	item: {
		width: Global.getScreen().width+60,
		height:50,
		// backgroundColor: Global.colors.IOS_BG,
        flexDirection: 'row',
        // padding:10,
        paddingLeft:5,
        alignItems: 'center',
        justifyContent: 'center',
	},
	delInItem:{
		width:60,
		height:50,
	},

});

module.exports = UtilsHoc(WelfareOverviewList) ; 