'use strict';

var SalaryHisMonthList = require('./SalaryHisMonthList');
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

var FIND_URL =  'salaryDetail/findByYear';

var SalaryHisList = React.createClass({

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
			// loaded: false,
			cond: null,
			// salarydetaillist:null,
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

	componentWillReceiveProps: function(props) {

	},

	onPressDetail: function( title, component, hideNavBar,month) {
		console.log('month:' + month);

		var nav = this.props.navigator ? this.props.navigator : this.props.rootNavigator;
	        nav.push({
	        	title: title,
	            component: component,
	            hideNavBar: hideNavBar ? hideNavBar : false,
	            passProps: {
            		companyId:Global.USER_LOGIN_INFO.company.id,
            		month:month,
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
	
	fetchData: async function() {
		this.showLoading();
		this.setState({
			loaded: false,
			fetchForbidden: false,
		});
		try {
			let responseData = await this.request( Global.host + FIND_URL, {
				body: JSON.stringify({
					companyId:Global.USER_LOGIN_INFO.company.id,
				})
			});
			this.hideLoading();
			this.data = responseData.body;
			// console.log(this.data);
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
	
		var refreshView = (this.state.loaded || this.state.fetchForbidden)&& this.data.length === 0  ?
			this.getListRefreshView(refreshText, this.pullToRefresh) : 
			null;
		// && this.data.length === 0

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
		// console.log('rowID===item====='+rowID);
		// console.log(item);
		var topLine = rowID === '0' ? <View style={Global.styles.FULL_SEP_LINE} /> : null;
        var bottomLine = (<View style={Global.styles.FULL_SEP_LINE} />);

		return (
			<View style={[styles.rowholder,Global.styles.CENTER]}>
				{topLine}
				<TouchableOpacity  style={[styles.row,Global.styles.CENTER]}  onPress={()=>{this.onPressDetail("薪资详情", SalaryHisMonthList ,true,item.name)}}>
					<Text style={[styles.item]}>{item.name}月份工资发放记录</Text>
					<Icon name='ios-arrow-right' size={18} color={Global.colors.IOS_ARROW} style={[Global.styles.ICON, {width: 40}]} />
				</TouchableOpacity>
				{bottomLine}
			</View>
		);
	},

	_renderPlaceholderView: function() {
		return (
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
		);
	},
});

var styles = StyleSheet.create({
	sv: {
		flex:1 ,

	},
	paddingPlace: {
		height: Global.NBPadding + 20 ,
	},
	list: {
		flex:1,
		backgroundColor: 'white',
	},
	rowholder:{
		flex:1,
	},
	row: {
		paddingLeft: 10,
		paddingRight: 10,
		height: 50,
		width: Global.getScreen().width,
        flexDirection: 'row',
	},
	item: {
		flex:1,
		color:Global.colors.IOS_BLUE,
	},
	
});

module.exports = SalaryHisList;
