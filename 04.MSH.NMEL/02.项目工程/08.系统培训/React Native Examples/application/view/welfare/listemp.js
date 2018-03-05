'use strict';

var React = require('react-native');
var NavBar = require('../NavBar');
var Icon = require('react-native-vector-icons/Ionicons');
var Global = require('../../Global');

// var UtilsMixin = require('../lib/UtilsMixin');
// var TimerMixin = require('react-timer-mixin');
// var FilterMixin =require('../../filter/FilterMixin');
var UtilsHoc = require('../lib/UtilsHoc');
var FilterMoneyHoc = require('../../filter/FilterMoneyHoc');

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

var FIND_URL =  'welfareinfo/findEmpWelfs';

var WelfareOverviewList = React.createClass({

	// mixins: [UtilsMixin, TimerMixin,FilterMixin],
	
	data:[],

	getInitialState: function() {
		var ds = new ListView.DataSource({
			rowHasChanged: (row1, row2) => row1 !== row2,
		});
		return {
			doRenderScene: false,
			dataSource: ds.cloneWithRows(this._genRows({})),
			loaded: false,
			isRefreshing: false,
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
					id : Global.USER_LOGIN_INFO.Employees.id,
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
					hideBottomLine={false}
					navigator={this.props.navigator} 
					route={this.props.route}/>
			</View>
		);
	},


	render : function(){
		if(!this.state.doRenderScene)
			return this._renderPlaceholderView();
		var refreshText = this.state.fetchForbidden === true ? 
			'您还未登录，登录后点击此处刷新数据' : 
			'暂无符合条件的数据，点击此处重新载入';

		var topTitle = (this.state.loaded || this.state.fetchForbidden) && this.data.length === 0 ?
			null:
			(<View style = {styles.topBar}>
			    	<Text style={styles.textTitle}>我的福利信息明细:</Text>
			</View>);

		var refreshView = (this.state.loaded || this.state.fetchForbidden) && this.data.length === 0 ?
			this.props.getListRefreshView(refreshText, this.refresh) : 
			null;		
		return (
			<View style = {[Global.styles.CONTAINER]}>
				
				<ScrollView style={styles.sv} refreshControl={this.props.getRefreshControl(this.state.isRefreshing,this.pullRefresh)}>
					<View style={Global.styles.PLACEHOLDER40} />
					<View style={Global.styles.PLACEHOLDER20} />
					{topTitle}
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
					hideBottomLine={false}
					navigator={this.props.navigator} 
					route={this.props.route}
					rightButtons={(
							<View style={[Global.styles.NAV_BAR.BUTTON_CONTAINER, Global.styles.NAV_BAR.RIGHT_BUTTONS]}>
								<TouchableOpacity style={[Global.styles.NAV_BAR.BUTTON]} onPress={this.refresh}>
									<Text style={{color:Global.colors.IOS_BLUE,}}>刷新</Text>
								</TouchableOpacity>
							</View>
						)}
				>
				</NavBar>
			</View>
			);
	},

	renderItem : function(item: string, sectionID: number, rowID: number){
		var welfTypeNum=item.overview.typeid;
		var welfType = '';
		if(welfTypeNum == '1')
			welfType='月度奖金';
		if(welfTypeNum == '2')
			welfType='季度奖金';
		if(welfTypeNum =='3')
			welfType='半年度奖金';
		if(welfTypeNum=='4')
			welfType='年度奖金';
		var payTime = item.payTime.substring(0,10);
		var topLine = rowID === '0' ? <View style={Global.styles.FULL_SEP_LINE} /> : null;
        var bottomLine = (<View style={Global.styles.FULL_SEP_LINE} />);
        if(item.overview.ispaied=='1')
			return (
				<View style={[{flex:1,flexDirection:'column'},styles.item]}>
					{topLine}
					<View style={{flex:1,flexDirection:'row',paddingTop:10,}}>
						<Text style={{flex: 1, marginLeft: 10, fontSize: 15,}}>{item.overview.name}</Text>
						<Text style={{flex: 1, marginLeft: 10,fontSize: 15,}}>类型：{welfType}</Text>
					</View>
					<View style={{flex:1,flexDirection:'row',flexWrap:'nowrap',paddingTop:5,}}>
						<Text style={{flex: 1, marginLeft: 10,fontSize: 15,color:Global.colors.ORANGE,}}>金额：{this.props.filterMoney(item.fullAmt)}</Text>
						<Text style={{flex: 1, marginLeft: 10,fontSize: 15,}}>发放时间：{payTime}</Text>
					</View>				
					{bottomLine}
				</View>
			);
		else 
			return null;
	},

});

var styles = StyleSheet.create({

	sv: {
		flex:1,
	},
	list:{
		backgroundColor: '#ffffff',
	},

	topBar:{
		flex:1,
		width: Global.getScreen().width,
		height: 50,
		backgroundColor: '#ffffff',
		flexDirection: 'row',
		//水平居中
		// justifyContent: 'center',
		//垂直居中
		alignItems: 'center', 
	},

	item: {
		width: Global.getScreen().width ,
        padding: 0,
        height:70,
        justifyContent: 'center',
	},

	textTitle : {
		marginLeft:15,
		fontSize:17,
		color:Global.colors.FONT,
		width:Global.getScreen().width,
	},

	
});

module.exports = UtilsHoc(FilterMoneyHoc(WelfareOverviewList)) ; 