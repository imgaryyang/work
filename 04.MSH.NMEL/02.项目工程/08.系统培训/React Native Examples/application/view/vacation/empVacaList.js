'use strict';

var React = require('react-native');
var NavBar = require('../NavBar');
var Icon = require('react-native-vector-icons/Ionicons');
var Global = require('../../Global');
var MngIdx = require('../mng/MngIdx');
var SearchInput = require('../lib/SearchInput');
var Edit = require('./empVacaEdit');
var EmpVacaDetail = require('./empVacaDetail');
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

var FIND_URL = 'vacation/findByPerson';
var DEL_URL = 'vacation/destory';

var EmpVacaList = React.createClass({

	data: [],
	mixins: [UtilsMixin, TimerMixin, FilterMixin],
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
	* 调用刷新
	*/
	refresh: function() {
		//this.setState({isRefreshing: true});
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
					createdId : Global.USER_LOGIN_INFO.id
				})
			});
			this.hideLoading();
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
            title: "休假申请",
            component: Edit,
            passProps: {
            	id: id,
            	refresh: this.refresh,
            },
        });
    },

    toEmpVaca: function(id) {
        this.props.navigator.push({
            title: "休假信息",
            component: EmpVacaDetail,
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
		this.setState({
			showConfirm: false,
		});
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

				<View style={[Global.styles.TOOL_BAR.BAR]}>
					<TouchableOpacity style={[Global.styles.CENTER, Global.styles.TOOL_BAR.BUTTON,]} onPress={this.controlDelBtn}>
						<Icon style={[Global.styles.ICON]} name='ios-minus-outline' size={25} color={Global.colors.FONT_GRAY}/>
					</TouchableOpacity>
					{/*<View style={[Global.styles.CENTER, {flex: 1,}]}>
											<TextInput style={[Global.styles.TOOL_BAR.SEARCH_INPUT, styles.searchInput, SIStyleIOS, ]} placeholder='事由' value={this.state.cond} onChangeText={(value)=>{this.setState({cond: value})}} />
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
							<TouchableOpacity style={[Global.styles.NAV_BAR.BUTTON]} onPress={()=>{this.doEdit()}}>
								<Text style={{color: Global.colors.IOS_BLUE,}}>添加</Text>
							</TouchableOpacity>
						</View>
					)} />
		    </View>
		);
	},

	renderItem: function(item, sectionID, rowID, highlightRow) {
            
        var topLine = rowID === '0' ? <View style={Global.styles.FULL_SEP_LINE} /> : null;
        var bottomLine = (<View style={Global.styles.FULL_SEP_LINE} />);

        var delIconView = item.state === '1' ?
			(<View style={[styles.delInItem,]} />):
			(<TouchableOpacity style={[styles.delInItem, Global.styles.CENTER]} onPress={()=>{this.confirmDelete(item, rowID);}}>
				<Icon name='ios-minus' size={25} color={Global.colors.IOS_RED} style={[Global.styles.ICON]} />
				</TouchableOpacity>);

        var stateChinese = null;
        if(item.state ==='0')
        	stateChinese = (<View style={{flex:1,flexDirection:'row',flexWrap:'nowrap'}}>
							<Text style={[styles.item1]}>状        态：</Text>
							<Text style={[styles.item2]}>待审批</Text>
						</View>);
        else if(item.state ==='1')
        	stateChinese = (<View style={{flex:1,flexDirection:'row',flexWrap:'nowrap'}}>
							<Text style={[styles.item1]}>状        态：</Text>
							<Text style={[styles.item2]}>审批通过</Text>
						</View>);
        else if(item.state ==='2')
        	stateChinese = (<View style={{flex:1,flexDirection:'row',flexWrap:'nowrap'}}>
							<Text style={[styles.item1]}>状        态：</Text>
							<Text style={[styles.item2]}>退回</Text>
						</View>);

		return (
			<View >
				{topLine}
				<TouchableOpacity style={[styles.item, Global.styles.CENTER, {left: this.state.delBtnLeftPos}]} onPress={()=>{this.toEmpVaca(item.id);}}>
					
					{delIconView}			
					<View style={{flex:1,flexDirection:'column',paddingLeft:10}}>
						<View style={{flex:1,flexDirection:'row'}}>
							<Text style={[styles.item1]}>事        由：</Text>
							<Text style={[styles.item2]}>{item.reson}</Text>
							{/*<Text style={{flex: 1, marginLeft: 10, fontSize: 15}}>事由：{item.reson}</Text>*/}
						</View>
						<View style={{flex:1,flexDirection:'row',flexWrap:'nowrap'}}>
							<Text style={[styles.item1]}>提交时间：</Text>
							<Text style={[styles.item2]}>{this.filterDateFmt(item.submitTime)}</Text>
						</View>
						{stateChinese}
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
	item1: {
		marginLeft: 10,
		width: 80, 
		fontSize: 14,
	},
	item2:{
		marginLeft: -10,
		width:Global.getScreen().width - 100,
		fontSize: 14,
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

module.exports = EmpVacaList;
