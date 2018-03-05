'use strict';

var SalaryInfoItem = require('./SalaryInfoItem');
var SearchInput = require('../lib/SearchInput');
var React = require('react-native');
var NavBar = require('../NavBar');
var Icon = require('react-native-vector-icons/Ionicons');
var Global = require('../../Global');
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

var FIND_URL = 'salaryInfo/findEmployee';

var SalaryInfoList = React.createClass({

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
			loaded: false,
			cond: null,
			isRefreshing: false,
			delBtnLeftPos: new Animated.Value(-60),
			showDelBtn: false,
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
		// console.log('@salaryinfolist __companId '+ this.props.companId);
		this.showLoading();
		try {
			let responseData = await this.request(Global.host + FIND_URL, {
				body: JSON.stringify({
				companyId:Global.USER_LOGIN_INFO.company.id,
				cond:this.state.cond,
				})
			});
			this.hideLoading();
			this.data = responseData.body;
			// console.log('@salaryinfolist __this.data ');
			// console.log(this.data);
			this.setState({
				dataSource: this.state.dataSource.cloneWithRows(responseData.body),
				isRefreshing: false,
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

    onPressEdit: function( title, component, hideNavBar,itemid) {
		var nav = this.props.navigator ? this.props.navigator : this.props.rootNavigator;
	        nav.push({
	        	title: title,
	            component: component,
	            hideNavBar: hideNavBar ? hideNavBar : false,
	            passProps: {
            		emplyeeId:itemid,
            		companyId:Global.USER_LOGIN_INFO.company.id,
            	},
	            
	        });
	},
    
    
	render: function() {
		var listView = null;
		if(!this.state.doRenderScene)
			return this._renderPlaceholderView();

		var refreshText = this.state.fetchForbidden === true ? 
			'您还未登录，登录后点击此处刷新数据' : 
			'暂无符合条件的数据，点击此处重新载入';

		var refreshView = this.data.length === 0 ?
			this.getListRefreshView(refreshText, this.pullToRefresh) : 
			null;

		var SIStyleIOS = Global.os === 'ios' ? Global.styles.TOOL_BAR.SEARCH_INPUT_IOS : {};
		return (
			<View style={Global.styles.CONTAINER}>
				<View style={styles.paddingPlace} />
				<ScrollView style={styles.sv} refreshControl={this.getRefreshControl(this.pullToRefresh)} >
					{refreshView}
					<ListView
						key={this.data}
				        dataSource={this.state.dataSource}
				        renderRow={this.renderItem}
				        style={[styles.list]} />
			    </ScrollView>
			   <View style={[Global.styles.TOOL_BAR.BAR]}>
					<TouchableOpacity style={[Global.styles.CENTER, Global.styles.TOOL_BAR.BUTTON,]} onPress={this.controlDelBtn}>
						<Icon style={[Global.styles.ICON]} name='ios-minus-outline' size={25} color={Global.colors.FONT_GRAY}/>
					</TouchableOpacity>

					{/*<View style={[Global.styles.CENTER, {flex: 1,}]}>
						<TextInput style={[Global.styles.TOOL_BAR.SEARCH_INPUT, styles.searchInput, SIStyleIOS, ]} placeholder='请输入查询条件' value={this.state.cond} onChangeText={(value)=>{this.setState({cond: value})}} />
					</View>*/}
					<SearchInput 
						value={this.state.cond} 
						onChangeText={(value) => this.setState({cond: value})} />

					<TouchableOpacity style={[Global.styles.CENTER, Global.styles.TOOL_BAR.BUTTON,]} onPress={this.search}>
						<Text style={{color: Global.colors.IOS_BLUE}}>查询</Text>
					</TouchableOpacity>
				</View>

				<NavBar 
					navigator={this.props.navigator} 
					route={this.props.route}
					hideBottomLine={true} 
					rightButtons={(
						<View style={[Global.styles.NAV_BAR.BUTTON_CONTAINER, Global.styles.NAV_BAR.RIGHT_BUTTONS]}>
							<TouchableOpacity style={[Global.styles.NAV_BAR.BUTTON]} onPress={this.refresh}>
								<Text style={{color: Global.colors.IOS_BLUE,}}>刷新</Text>
							</TouchableOpacity>
						</View>
					)} />

		    </View>
		);
	},

	renderItem: function(item, sectionID, rowID, highlightRow) {
            
        var topLine = rowID === '0' ? <View style={Global.styles.FULL_SEP_LINE} /> : null;
        var bottomLine = (<View style={Global.styles.FULL_SEP_LINE} />);

		return (
			<View style={[styles.touchholder,Global.styles.CENTER]}>
				{topLine}
				<TouchableOpacity style={[styles.row, Global.styles.CENTER]} onPress={()=>{this.onPressEdit('薪资信息',SalaryInfoItem,true,item.id);}} >
					<Text style={[styles.itemname]}>{item.name}</Text>
					<Text style={[styles.itemdep]}>{item.dept}</Text>
					<View style={{flex:1}}></View>
					<Icon name='ios-arrow-right' size={18} color={Global.colors.IOS_BLUE} style={[Global.styles.ICON, {width: 40}]} />
				</TouchableOpacity>
				{bottomLine}
			</View>
			
		);
	},

	_renderPlaceholderView: function() {
		return (
			<View>
				<NavBar 
					navigator={this.props.navigator} 
					route={this.props.route}
					rightButtons={(
						<View style={[Global.styles.NAV_BAR.BUTTON_CONTAINER, Global.styles.NAV_BAR.RIGHT_BUTTONS]}>
							<TouchableOpacity style={[Global.styles.NAV_BAR.BUTTON]} onPress={this.refresh}>
								<Text style={{color: Global.colors.IOS_BLUE,}}>刷新</Text>
							</TouchableOpacity>
						</View>
					)} />
		    </View>
		);
	},
});

var styles = StyleSheet.create({
	sv: {
		flex: 1,
		// backgroundColor:'red',

	},
	paddingPlace: {
		height: Global.NBPadding + 44 +20,
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
		height: 50,
	},
	itemname: {
		width: 80, 
		fontSize: 13,
		// textAlign: 'center',
	},
	itemdep: {
		width: 120, 
		fontSize: 13,
		// textAlign: 'center',
	},
	searchInput: {
		width: Global.getScreen().width - 100,
	},
});

module.exports = SalaryInfoList;
