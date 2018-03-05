'use strict';

var React = require('react-native');
var NavBar = require('../NavBar');
var Icon = require('react-native-vector-icons/Ionicons');
var Global = require('../../Global');
var MngIdx = require('../mng/MngIdx');
var Edit = require('./employee-edit');
var SearchInput = require('../lib/SearchInput');

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
	Alert
} = React;

var FIND_URL = 'employee/find';
var DEL_URL =  'employee/destory';

var EmployeeList = React.createClass({

	mixins: [UtilsMixin, TimerMixin],

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
			showDelBtn: false,
			delBtnLeftPos: new Animated.Value(-60),
			cond: null,
			isRefreshing:false,
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
		this.setState({
			loaded: false,
			fetchForbidden: false,
		});
		try {
			let responseData = await this.request(Global.host +FIND_URL, {
				body: JSON.stringify({
					cond: this.state.cond,
					ownerOrg:Global.USER_LOGIN_INFO.company.id
				})
			});
			this.hideLoading();
			this.data = responseData.body;
			this.setState({
				dataSource: this.state.dataSource.cloneWithRows(responseData.body),
				loaded: true,
				isRefreshing:false,
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

    doEdit: function(id) {
        this.props.navigator.push({
            title: "添加员工",
            component: Edit,
            passProps: {
            	id: id,
            	refresh: this.refresh,
            },
        });
    },

    doModify: function(id) {
        this.props.navigator.push({
            title: "修改员工信息",
            component: Edit,
            passProps: {
            	id: id,
            	refresh: this.refresh,
            },
        });
    },

   showDelBtn: function() {
		Animated.timing(
	       	this.state.delBtnLeftPos,
	       	{
	       		toValue: 0,
	       		duration: 100,
	       	},
	    ).start();
    },

    hideDelBtn: function() {
		Animated.timing(
	       	this.state.delBtnLeftPos,
	       	{
	       		toValue: -60,
	       		duration: 100,
	       	},
	    ).start();
    },

    controlDelBtn: function() {
    	if(!this.state.showDelBtn) {
    		this.showDelBtn();
    	} else {
    		this.hideDelBtn();
    	}
    	this.setState({showDelBtn: !this.state.showDelBtn});
    },

    confirmDelete: function(item, rowID) {
    	this.item = item;
    	this.rowID = rowID;
    	Alert.alert(
            '提示',
            '您确定要删除此条记录吗？',
            [
            	{text: '取消', style: 'cancel'},
            	{text: '确定', onPress: () => this.deleteItem()},
            ]
        );
    },
    deleteItem: async function() {
    	this.showLoading();
		try {

			let responseData = await this.request(Global.host +DEL_URL, {
				body: JSON.stringify({
					id: this.item.id,
				})
			});
			this.hideLoading();
			//从前端数组中删除该条数据
			this.data.splice(this.rowID, 1);
			this.setState({
				dataSource: this.state.dataSource.cloneWithRows(this.data),
			});
			this.controlDelBtn();

		} catch(e) {
			this.hideLoading();
			this.requestCatch(e);
		}
    },

	render: function() {
		var listView =null;
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
			<View style={Global.styles.CONTAINER}>
			<View style={styles.placeholder} />
				<ScrollView style={styles.sv} refreshControl={this.getRefreshControl(this.pullToRefresh)}>
				<View style={Global.styles.PLACEHOLDER20} />
					{refreshView}
					<ListView
						key={this.data}
				        dataSource={this.state.dataSource}
				        renderRow={this.renderItem}
				        style={[styles.list]} />
				    
					<View style={Global.styles.PLACEHOLDER20} />
			    </ScrollView>

				<View style={[Global.styles.TOOL_BAR.BAR]}>
					<TouchableOpacity style={[Global.styles.CENTER, Global.styles.TOOL_BAR.BUTTON,]} onPress={this.controlDelBtn}>
						<Icon style={[Global.styles.ICON]} name='ios-minus-outline' size={25} color={Global.colors.FONT_GRAY}/>
					</TouchableOpacity>
					<SearchInput 
						value={this.state.cond} 
						onChangeText={(value) => this.setState({cond: value})} />
					{/*<View style={[Global.styles.CENTER, {flex: 1,}]}>
											<TextInput style={[Global.styles.TOOL_BAR.SEARCH_INPUT, styles.searchInput, SIStyleIOS, ]} placeholder='请输入查询条件' value={this.state.cond} onChangeText={(value)=>{this.setState({cond: value})}} />
										</View>*/}
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
							<TouchableOpacity style={[Global.styles.NAV_BAR.BUTTON]} onPress={()=>{this.doEdit()}}>
								<Text style={{color: Global.colors.IOS_BLUE,}}>添加</Text>
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
			<View >
				{topLine}
				<TouchableOpacity style={[styles.item, Global.styles.CENTER, {left: this.state.delBtnLeftPos}]} onPress={()=>{this.doModify(item.id);}}>

					<TouchableOpacity style={[styles.delInItem, Global.styles.CENTER]} onPress={()=>{this.confirmDelete(item, rowID);}}>
						<Icon name='ios-minus' size={25} color={Global.colors.IOS_RED} style={[Global.styles.ICON]} />
					</TouchableOpacity>

					{/*<Image style={[styles.portrait, Global.styles.BORDER]}  source={{uri: Global.host + Global.userPortraitPath + item.portrait}} />*/}

					<Text style={{flex: 1, marginLeft: 10, fontSize: 15,}}>{item.name}({item.mobile})</Text>

					<Icon name='ios-arrow-right' size={18} color={Global.colors.IOS_ARROW} style={[Global.styles.ICON, {width: 40}]} />

				</TouchableOpacity>
				{bottomLine}
			</View>
		);
		/*return (
			<TouchableOpacity style={[styles.item, Global.styles.CENTER, Global.styles.BORDER, {left: this.state.delBtnLeftPos}]} onPress={()=>{this.doEdit(item.id);}}>

				<TouchableOpacity style={[styles.delInItem, Global.styles.CENTER]} onPress={()=>{this.confirmDelete(item, rowID);}}>
					<Icon name='ios-minus' size={25} color={Global.colors.IOS_RED} style={[Global.styles.ICON]} />
				</TouchableOpacity>

				<Image style={[styles.portrait, Global.styles.BORDER]}  source={{uri: Global.host + Global.userPortraitPath + item.image}} />
				<Text style={{flex: 1, marginLeft: 10, fontSize: 15,}}>{item.name}</Text>
				<Icon name='ios-arrow-right' size={18} color={Global.colors.IOS_DARK_GRAY} style={[Global.styles.ICON, {width: 20}]} />

			</TouchableOpacity>
		);*/
	},

	_renderPlaceholderView: function() {
		return (
			<View></View>
		);
	},
});

var styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Global.colors.IOS_GRAY_BG,
	},
	sv: {
	},
	placeholder: {
		height: Global.NBPadding + 40,
	},
	searchInput: {
		width: Global.getScreen().width - 110,
	},

	list: {
	},
	item: {
		width: Global.getScreen().width + 60,
		backgroundColor: '#ffffff',
        flexDirection: 'row',
        borderBottomWidth: 0,
        borderLeftWidth: 0,
        borderRightWidth: 0,
        padding: 10,
        paddingLeft: 0,
        paddingRight: 20,
	},
	separator: {
		width: Global.getScreen().width, 
		backgroundColor: Global.colors.VIEW_BG, 
		height: 40/Global.pixelRatio,
	},
	delInItem: {
		width: 60,
		height: 40,
	},
	portrait: {
		width: 40,
		height: 40,
        borderRadius: 20,
        marginLeft: 20,
	},
	
});

module.exports = EmployeeList;
