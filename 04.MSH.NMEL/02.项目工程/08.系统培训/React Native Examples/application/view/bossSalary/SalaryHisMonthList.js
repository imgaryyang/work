'use strict';

var SalaryHisDetail = require('./SalaryHisDetail');

var React = require('react-native');
var NavBar = require('../NavBar');
var Icon = require('react-native-vector-icons/Ionicons');
var Global = require('../../Global');
var MngIdx = require('../mng/MngIdx');
var UtilsMixin = require('../lib/UtilsMixin');

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

var FIND_URL = 'salarydetail/findByYearDetailList';

var SalaryHisMonthList = React.createClass({

	mixins: [UtilsMixin],

	data: [],
	item: null,
	rowID: null,
	
	getInitialState: function() {
		var ds = new ListView.DataSource({
			rowHasChanged: (row1, row2) => row1 !== row2,
		});
		return {
			doRenderScene: false,
			dataSource: ds.cloneWithRows(this._genRows({})),
			cond: null,
			loaded:false,
			isRefreshing:false,
			salarydetaillist:null,
		};
	},

	_genRows: function(pressData: {[key: number]: boolean}): Array<string> {
		var dataBlob = [];
		/*for (var ii = 0; ii < 30; ii++) {
			var pressedText = pressData[ii] ? ' (pressed)' : '';
			dataBlob.push('Row ' + ii + pressedText);
		}*/
		return dataBlob;
	},

    componentDidMount: function() {
		InteractionManager.runAfterInteractions(() => {
			this.fetchData();
			this.setState({doRenderScene: true});
		});
	},

	/**
	* 组件接收参数变化
	*/
	componentWillReceiveProps: function(props) {

	},

	onPressDetail: function( title, component, hideNavBar,item) {
		var nav = this.props.navigator ? this.props.navigator : this.props.rootNavigator;
	        nav.push({
	        	title: title,
	            component: component,
	            hideNavBar: hideNavBar ? hideNavBar : false,
	            passProps: {
            	id:item.id,
            },
	        });
	},
	/**
	* 调用刷新
	*/
	refresh: function() {
		// this.setState({isRefreshing: true});
		this.fetchData();
	},
	pullToRefresh: function() {
		 this.setState({isRefreshing: true});
		 this.fetchData();
	},
	search: function() {
		this.fetchData();
	},

	fetchData: async function() {
		this.showLoading();
		this.setState({
			loaded: false,
			fetchForbidden: false,
		});
		try {
			let responseData = await this.request(Global.host + FIND_URL, {
				body: JSON.stringify({
					companyId:this.props.companyId,
					month:this.props.month,
				})
			});
			this.hideLoading();
			this.data = responseData.body;
			console.log('HHHHHHHH');
			console.log(this.data);
			this.setState({
				dataSource: this.state.dataSource.cloneWithRows(responseData.body),
				isRefreshing: false,
				loaded: true,
			});
			
		} catch(e) {
			this.hideLoading();
			this.setState({
				isRefreshing: false,
			});
			if(e.status == 401 || e.status == 403)
				this.setState({fetchForbidden: true});
			this.requestCatch(e);
		}

		
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
			<View style={[Global.styles.CONTAINER]}>
				<View style={styles.paddingPlace} />
				<ScrollView style={styles.sv} refreshControl={this.getRefreshControl(this.pullToRefresh)}>
					{refreshView}
					<ListView key={this.data}  
						dataSource={this.state.dataSource} 
						renderRow={this.renderItem}
						style={styles.list}/>
			    </ScrollView>
			    <NavBar 
					navigator={this.props.navigator} 
					route={this.props.route}
					rightButtons={(
						<View style={[Global.styles.NAV_BAR.BUTTON_CONTAINER, Global.styles.NAV_BAR.RIGHT_BUTTONS]}>
							<TouchableOpacity style={[Global.styles.NAV_BAR.BUTTON]} onPress={()=>{this.refresh()}}>
								<Text style={{color: Global.colors.IOS_BLUE,}}>刷新</Text>
							</TouchableOpacity>
						</View>
					)} />
		    </View>
		);
	},

	renderItem: function(item: string, sectionID: number, rowID: number) {
		console.log('rowID===item====='+rowID);
		// console.log(item);
		var topLine = rowID === '0' ? <View style={Global.styles.FULL_SEP_LINE} /> : null;
        var bottomLine = (<View style={Global.styles.FULL_SEP_LINE} />);

		return (
			<View style={[Global.styles.CENTER,{flex:1}]}>
				{topLine}
				<View style={[styles.rowitem,Global.styles.CENTER]}>
					<Text style={[styles.itemName]}>{item.employeeName}</Text>
					<Text style={[styles.itemAmt]}>{parseFloat(item.actualAmt).toFixed(2)}</Text>
					<Text style={[styles.itemConpanyName]}></Text>
					<TouchableOpacity  style={[styles.touchable,Global.styles.CENTER,{flexDirection:'row',flex:1}]} onPress={()=>{this.onPressDetail("薪资详情信息", SalaryHisDetail,true,item)}} >
						<Text style={{width:60,fontSize: 13,color:Global.colors.IOS_BLUE,}}>详细信息</Text>
						<Icon name='ios-arrow-right' size={18} color={Global.colors.IOS_BLUE} style={[Global.styles.ICON, {width: 20}]} />
					</TouchableOpacity>
				</View>
				{bottomLine}
			</View>
		);
	},

	_renderPlaceholderView: function() {
		return (
			<NavBar 
					navigator={this.props.navigator} 
					route={this.props.route}
					// hideBottomLine={true}
					rightButtons={(
						<View style={[Global.styles.NAV_BAR.BUTTON_CONTAINER, Global.styles.NAV_BAR.RIGHT_BUTTONS]}>
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
		flex:1,
	},
	paddingPlace: {
		height: Global.NBPadding + 20 ,
	},
	list: {
		flex:1,
		backgroundColor: 'white',
	},
	rowitem: {
		flex: 1,
		paddingLeft: 10,
		paddingRight: 10,
		height: 40,
		flexDirection:'row',
	},
	itemName: {
		width: 80, 
		fontSize: 13,
		textAlign:'left',
		// backgroundColor:'red',
	},
	itemAmt:{
		width: 80, 
		fontSize: 13,
		textAlign:'right',
		// backgroundColor:'green',
	},
	itemConpanyName:{
		width: Global.getScreen().width-260,
		// backgroundColor:'red',
	},
	touchable:{
		width:80, 
		
	},
	
});

module.exports = SalaryHisMonthList;
