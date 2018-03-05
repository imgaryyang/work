'use strict';

var React = require('react-native');
var NavBar = require('../NavBar');
var Icon = require('react-native-vector-icons/Ionicons');
var Global = require('../../Global');
var MngIdx = require('../mng/MngIdx');
var Edit = require('./edit');
var SearchInput = require('../lib/SearchInput');

var UtilsHoc = require('../lib/UtilsHoc');

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

var FIND_URL = 'samperson/find';
var DEL_URL = 'samperson/destory';
var SampleList = React.createClass({

	// mixins: [UtilsMixin, TimerMixin],

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
			isRefreshing: false,
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
		this.props.showLoading();
		this.setState({
			loaded: false,
			fetchForbidden: false,
		});
		try {
			let responseData = await this.props.request(Global.host + FIND_URL, {
				body: JSON.stringify({
					cond: this.state.cond,
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

    doEdit: function(id) {
        this.props.navigator.push({
            title: "表单实例",
            component: Edit,
            passProps: {
            	id: id,
            	refresh: this.refresh,
            	backRoute: this.props.route,
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
    	this.props.showLoading();
		try {

			let responseData = await this.props.request(Global.host + DEL_URL, {
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

	render: function() {
		var listView = null;
		if(!this.state.doRenderScene)
			return this._renderPlaceholderView();
		var refreshText = this.state.fetchForbidden === true ? 
			'您还未登录，登录后点击此处刷新数据' : 
			'暂无符合条件的数据，点击此处重新载入';

		var refreshView = (this.state.loaded || this.state.fetchForbidden) && this.data.length === 0 ?
			this.props.getListRefreshView(refreshText, this.refresh) : 
			null;

		var SIStyleIOS = Global.os === 'ios' ? Global.styles.TOOL_BAR.SEARCH_INPUT_IOS : {};
		return (
			<View style={Global.styles.CONTAINER}>
				{this._getNavBar()}

				<View style={[Global.styles.TOOL_BAR.FIXED_BAR]}>
					<TouchableOpacity style={[Global.styles.CENTER, Global.styles.TOOL_BAR.BUTTON,]} onPress={this.controlDelBtn}>
						<Icon style={[Global.styles.ICON]} name='ios-minus-outline' size={25} color={Global.colors.FONT_GRAY}/>
					</TouchableOpacity>

					<SearchInput 
						value={this.state.cond} 
						onChangeText={(value) => this.setState({cond: value})} />

					<TouchableOpacity style={[Global.styles.CENTER, Global.styles.TOOL_BAR.BUTTON,]} onPress={this.search}>
						<Text style={{color: Global.colors.IOS_BLUE}}>查询</Text>
					</TouchableOpacity>
				</View>

				<ScrollView 
					automaticallyAdjustContentInsets={false} 
					style={styles.sv} 
					refreshControl={this.props.getRefreshControl( this.state.isRefreshing,this.pullToRefresh)} >

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

	renderItem: function(item, sectionID, rowID, highlightRow) {
            
        var topLine = rowID === '0' ? <View style={Global.styles.FULL_SEP_LINE} /> : null;
        var bottomLine = (<View style={Global.styles.FULL_SEP_LINE} />);

		return (
			<View >
				{topLine}
				<TouchableOpacity style={[styles.item, Global.styles.CENTER, {left: this.state.delBtnLeftPos}]} onPress={()=>{this.doEdit(item.id);}}>

					<TouchableOpacity style={[styles.delInItem, Global.styles.CENTER]} onPress={()=>{this.confirmDelete(item, rowID);}}>
						<Icon name='ios-minus' size={25} color={Global.colors.IOS_RED} style={[Global.styles.ICON]} />
					</TouchableOpacity>

					<Image style={[styles.portrait, Global.styles.BORDER]}  source={{uri: Global.host + Global.userPortraitPath + item.portrait}} />

					<Text style={{flex: 1, marginLeft: 10, fontSize: 15,}}>{item.name}</Text>

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
					title='样例'
					navigator={this.props.navigator} 
					route={this.props.route}
					flow={false} />
		    </View>
		);
	},

	_getNavBar: function() {
		return (
			<NavBar 
				title='样例'
				navigator={this.props.navigator} 
				route={this.props.route} 
				hideBottomLine={true} 
				flow={false} 
				rightButtons={(
					<View style={[Global.styles.NAV_BAR.BUTTON_CONTAINER, Global.styles.NAV_BAR.RIGHT_BUTTONS]}>
						<TouchableOpacity style={[Global.styles.NAV_BAR.BUTTON]} onPress={this.refresh}>
							<Text style={{color: Global.colors.IOS_BLUE,}}>刷新</Text>
						</TouchableOpacity>
						<TouchableOpacity style={[Global.styles.NAV_BAR.BUTTON]} onPress={() => this.doEdit()}>
							<Text style={{color: Global.colors.IOS_BLUE,}}>添加</Text>
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
		height: Global.NBPadding + 44,
	},

	searchInput: {
		width: Global.getScreen().width - 100,
	},

	list: {
		backgroundColor: '#ffffff',
	},
	item: {
		width: Global.getScreen().width + 60,
        flexDirection: 'row',
        padding: 10,
        paddingLeft: 0,
        paddingRight: 20,
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

module.exports =  UtilsHoc(SampleList);
