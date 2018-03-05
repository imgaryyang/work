'use strict';

var SalaryHisDetail = require('./SalaryHisDetail');
var React = require('react-native');
var NavBar = require('../NavBar');
var Icon = require('react-native-vector-icons/Ionicons');
var Global = require('../../Global');
var MngIdx = require('../mng/MngIdx');
var UtilsMixin = require('../lib/UtilsMixin');
var FilterMixin = require('../../filter/FilterMixin');
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



var FIND_URL ='salaryDetail/findByPersonDetailList';

var SalaryHisList = React.createClass({

	mixins: [UtilsMixin, FilterMixin],

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
			loaded: false,
			showLoading: false,
			showDelBtn: false,
			delBtnLeftPos: new Animated.Value(-60),
			cond: null,
			showDetail:false,
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
			this.setState({doRenderScene: true});
			this.fetchData();
		});
	},

	onPressDetail: function( title, component, hideNavBar,item) {
		// console.log('iiiiii');
		// console.log(item);

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
	* 组件接收参数变化
	*/
	componentWillReceiveProps: function(props) {

	},

	/**
	* 调用刷新
	*/
	refresh: function() {
		this.setState({isRefreshing: true});
		this.fetchData();
	},

	
	fetchData: async function() {
		// console.log('jjjjjjjj');
		// console.log(Global.USER_LOGIN_INFO);
		this.showLoading();
		this.setState({
			loaded: false,
			fetchForbidden: false,
		});
		try {
			let responseData = await this.request( Global.host + FIND_URL, {
				body: JSON.stringify({
					companyId:Global.USER_LOGIN_INFO.Employees.ownerOrg,
					employeeId:Global.USER_LOGIN_INFO.Employees.id,
				})
			});
			this.hideLoading();
			this.data = responseData.body;
			// console.log('@@@@@@@@responseData.body');
			// console.log(responseData.body);
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
			this.getListRefreshView(refreshText, this.refresh) : 
			null;
		

		var SIStyleIOS = Global.os === 'ios' ? Global.styles.TOOL_BAR.SEARCH_INPUT_IOS : {};
		return (
			<View style={[Global.styles.container]}>
				<View style={styles.paddingPlace} />
				<ScrollView style={styles.sv} refreshControl={this.getRefreshControl(this.refresh)}>
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

		var topLine = rowID === '0' ? <View style={Global.styles.FULL_SEP_LINE} /> : null;
        var bottomLine = (<View style={Global.styles.FULL_SEP_LINE} />);

		return (
			<View style={[Global.styles.CENTER,{flex:1}]}>
				{topLine}
				<View style={[styles.rowitem,Global.styles.CENTER]}>
					<Text style={[styles.itemConpanyName]}>{item.companyName}</Text>
					<Text style={[styles.itemName]}>{this.filterDateFmtToDay(item.month)}</Text>
					<Text style={[styles.itemAmt]}>{parseFloat(item.actualAmt).toFixed(2)}</Text>
					<TouchableOpacity  style={[styles.touchable,Global.styles.CENTER]} onPress={()=>{this.onPressDetail("薪资详情信息", SalaryHisDetail,true,item)}} >
						<Text style={{flex:1,color:Global.colors.IOS_BLUE}}>详细信息</Text>
					</TouchableOpacity>
				</View>
				{bottomLine}
			</View>
		);		
	},

	_renderPlaceholderView: function() {
		return (
			<View style={[Global.styles.container]}>
				<View style={[styles.paddingPlace]}>
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
			</View>
		);
	},
});

var styles = StyleSheet.create({
	sv: {
		height: Global.NBPadding + 200 ,
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
	},
	itemAmt:{
		width: 80, 
		fontSize: 13,
	},
	itemConpanyName:{
		width: 80, 
		fontSize: 13,
	},
	touchable:{
		flex:1,
	},
	
});


module.exports = SalaryHisList;
