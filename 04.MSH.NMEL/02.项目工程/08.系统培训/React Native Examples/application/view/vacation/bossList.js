'use strict';

var React = require('react-native');
var NavBar = require('../NavBar');
var Icon = require('react-native-vector-icons/Ionicons');
var Global = require('../../Global');
var MngIdx = require('../mng/MngIdx');
var SearchInput = require('../lib/SearchInput');
var VacaDetail = require('./vacaDetail');

var FilterMixin = require('../../filter/FilterMixin');
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

var FIND_URL = 'vacation/findApproveHis';

var BossList = React.createClass({

	data: [],
	item: null,
	rowID: null,
	mixins: [UtilsMixin, TimerMixin, FilterMixin],

	getInitialState: function() {
		var ds = new ListView.DataSource({
			rowHasChanged: (row1, row2) => row1 !== row2,
		});
		return {
			doRenderScene: false,
			dataSource: ds.cloneWithRows(this._genRows({})),
			loaded: false,
			showLoading: false,
			cond: null,
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
	* 调用刷新
	*/
	refresh: function() {
		this.fetchData();
	},

	/**
	 * 下拉刷新
	 */
	pullToRefresh: function() {
    	this.setState({isRefreshing: true});
		this.fetchData();
	},

	search: function() {
		this.fetchData();
	},

	fetchData: async function() {
		this.showLoading();
		try {
			let responseData = await this.request(Global.host +FIND_URL, {
				body: JSON.stringify({
					cond: this.state.cond,
					approveId : Global.USER_LOGIN_INFO.id
				})
			});
			this.hideLoading();
			console.log('111111111111111111111111111111');
			console.log(responseData.body);
			this.data = responseData.body;
			this.setState({
				dataSource: this.state.dataSource.cloneWithRows(responseData.body),
				isRefreshing: false,
				loaded: true,
			});
		} catch(e) {
			this.requestCatch(e);
		}
	},

    doEdit: function(id) {
        this.props.navigator.push({
            title: "休假内容",
            component: VacaDetail,
            passProps: {
            	id: id,
            	refresh: this.refresh,
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

		var refreshView = (this.state.loaded || this.state.fetchForbidden) && this.data.length === 0 ?
			this.getListRefreshView(refreshText, this.refresh) : 
			null;

		//var SIStyleIOS = Global.os === 'ios' ? Global.styles.TOOL_BAR.SEARCH_INPUT_IOS : {};
		return (
			<View style={Global.styles.CONTAINER}>
			<View style={styles.paddingPlace} />
				<ScrollView style={styles.sv} refreshControl={this.getRefreshControl(this.pullToRefresh)}>
					{refreshView}
					<ListView
						key={this.data}
				        dataSource={this.state.dataSource}
				        renderRow={this.renderItem}
				        style={[styles.list]} />
					<View style={{flex: 1, height: 40,}} />
			    </ScrollView>

				<View style={[Global.styles.TOOL_BAR.BAR,styles.TOOL_BAR_Left]}>
					<SearchInput 
						value={this.state.cond} 
						onChangeText={(value) => this.setState({cond: value})} />
					{/*<View style={[Global.styles.CENTER, styles.TOOL_BAR_Left,]}>
											<TextInput style={[Global.styles.TOOL_BAR.SEARCH_INPUT, styles.searchInput, ]} placeholder='请输入员工姓名' value={this.state.cond} onChangeText={(value)=>{this.setState({cond: value})}} />
										</View>*/}
					<TouchableOpacity style={[Global.styles.CENTER, Global.styles.TOOL_BAR.BUTTON,]} onPress={this.search}>
						<Text style={{color: Global.colors.IOS_BLUE}}>查询</Text>
					</TouchableOpacity>
				</View>

				<NavBar 
					navigator={this.props.navigator} 
					route={this.props.route}
					hideBottomLine={true} 
					 />
		    </View>
		);
	},

	renderItem: function(item, sectionID, rowID, highlightRow) {
            
        var topLine = rowID === '0' ? <View style={Global.styles.FULL_SEP_LINE} /> : null;
        var bottomLine = (<View style={Global.styles.FULL_SEP_LINE} />);
     
		return (
			<View >
				{topLine}
				<TouchableOpacity style={[styles.item, Global.styles.CENTER ]} onPress={()=>{this.doEdit(item.ID);}}>
					<View style={{flex:1,flexDirection:'column',paddingLeft: 10, }}>
						<View style={{flex:1,flexDirection:'row'}}>
							<Text style={{flex: 1, marginLeft: 10, fontSize: 15}}>员工:  {item.NAME}</Text>
						</View>
						<View style={{flex:1,flexDirection:'row',}}>
							<Text style={{flex: 1, marginLeft: 10,fontSize: 15}}>电话:  {item.MOBILE}</Text>
						</View>						
					</View>

					<Icon name='ios-arrow-right' size={18} color={Global.colors.IOS_ARROW} style={[Global.styles.ICON, {width: 40}]} />

				</TouchableOpacity>
				{bottomLine}
			</View>
		);
	},

	_renderPlaceholderView: function() {
		return (
			<View>
				<NavBar 
					rootNavigator={this.props.rootNavigator} 
					navigator={this.props.navigator} 
					route={this.props.route} />
		    </View>
		);
	},
});

var styles = StyleSheet.create({
	sv: {
	},
	paddingPlace: {
		height: Global.NBPadding + 64,
	},
	
	searchInput: {
		width: Global.getScreen().width - 60,
	},

	list: {
		backgroundColor: '#ffffff',
	},
	item: {
		width: Global.getScreen().width + 10,
        flexDirection: 'row',
        padding: 10,
        paddingLeft: 0,
        paddingRight: 20,
	},
	portrait: {
		width: 40,
		height: 40,
        borderRadius: 20,
        marginLeft: 20,
	},
	TOOL_BAR_Left: {
		paddingLeft: 10, 
	},
	
});

module.exports = BossList;
