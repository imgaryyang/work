'use strict';

var React = require('react-native');
var NavBar = require('../NavBar');
var Icon = require('react-native-vector-icons/Ionicons');
var Global = require('../../Global');
var MngIdx = require('../mng/MngIdx');
var SearchInput = require('../lib/SearchInput');
var loanDetail = require('./LoanDetail');
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

var FIND_EMP_URL = 'expense/findEmp';
var FIND_URL = 'loan/findByLeader';

var LoanHisList = React.createClass({

	mixins: [UtilsMixin,FilterMixin],

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
			cond: null,
			isRefreshing: false,
			custId:null
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
	pullToRefresh: function() {
    	this.setState({isRefreshing: true});
		this.fetchData();
	},
	search:async function() {
		try {
			let responseData = await this.request(Global.host + FIND_EMP_URL, {
				body: JSON.stringify({
					name : this.state.cond,
					ownerOrg : Global.USER_LOGIN_INFO.company.id
				})
			});
			this.hideLoading();
			this.setState({custId:responseData.body});
		} catch(e) {
			this.requestCatch(e);
		}
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
					custId:this.state.custId,
					state:'4',
					leader:Global.USER_LOGIN_INFO.id
				})
			});
			this.hideLoading();
			for (var i in responseData.body) {
				switch (responseData.body[i].loanname) {
					case '0':
						responseData.body[i].loanname = '日常借款';
						break;
					case '1':
						responseData.body[i].loanname = '差旅借款';
						break;
					default:
						responseData.body[i].loanname = '日常借款';
				}
			}
			this.data = responseData.body;
			this.setState({
				dataSource: this.state.dataSource.cloneWithRows(responseData.body),
				isRefreshing: false,
				loaded: true,
			});
			/*this.toast('载入完成！');
			this.setTimeout(
				() => {
					this.toast('载入完成1111！');
					this.setTimeout(
						() => {
							this.toast('载入完成2222！');
						},
						500
					);
				},
				500
			);*/
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
	showDetail:function(loanId){
		this.props.navigator.push({
	            title: "借款单详情",
	            component: loanDetail,
	            passProps: {
	            	loanId: loanId,
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

		var SIStyleIOS = Global.os === 'ios' ? Global.styles.TOOL_BAR.SEARCH_INPUT_IOS : {};
		return (
			<View style={Global.styles.CONTAINER}>
				<View style={styles.paddingPlace} />
				<ScrollView 
					automaticallyAdjustContentInsets={false} 
					style={styles.sv} 
					refreshControl={this.getRefreshControl(this.pullToRefresh)} >
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
					<View style={[Global.styles.CENTER, Global.styles.TOOL_BAR.BUTTON,]}>
						<Icon style={[Global.styles.ICON]} name='ios-search' size={25} color={Global.colors.FONT_GRAY}/>
					</View>
					{/*<View style={[Global.styles.CENTER, {flex: 1,}]}>
						<TextInput style={[Global.styles.TOOL_BAR.SEARCH_INPUT, styles.searchInput, SIStyleIOS, ]} placeholder='请输入员工姓名' value={this.state.cond} onChangeText={(value)=>{this.setState({cond: value})}} />
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
			<View>
				{topLine}
				<TouchableOpacity style={[styles.item, Global.styles.CENTER]} onPress={()=>{this.showDetail(item.loanId)}}>
					<View style={{flex: 1, flexDirection: 'column'}}>
						<Text style={{flex: 1, marginLeft: 20, fontSize: 15, fontWeight: '400'}}>{item.loanname}</Text>
						<Text style={{flex: 1, marginLeft: 20, fontSize: 13, marginTop: 3, color: Global.colors.IOS_GRAY_FONT}}>提交人：{item.custId.name}</Text>
						<Text style={{flex: 1, marginLeft: 20, fontSize: 13, marginTop: 3, color: Global.colors.IOS_GRAY_FONT}}>事由：{item.reason}</Text>
					</View>

					<Text style={{width: 100, marginLeft: 10, marginRight: 10, fontSize: 13, textAlign: 'right', color:Global.colors.ORANGE}}>￥{this.filterMoney(item.loanamt)}</Text>

					<Icon name='ios-arrow-right' size={18} color={Global.colors.IOS_DARK_GRAY} style={[Global.styles.ICON, {width: 20}]} />

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
		width: Global.getScreen().width,
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

module.exports = LoanHisList;
