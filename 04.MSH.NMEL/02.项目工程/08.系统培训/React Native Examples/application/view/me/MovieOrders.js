'use strict';

var React = require('react-native');
var NavBar = require('../NavBar');
var Icon = require('react-native-vector-icons/Ionicons');
var Global = require('../../Global');
var MovieOrder = require('./MovieOrder');

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

var FIND_URL = 'yppt/getOrderList.do';

var MovieOrders = React.createClass({

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

	
	fetchData: async function() {
		this.showLoading();
		this.setState({
			loaded: false,
			fetchForbidden: false,
		});
		try {
			console.log(Global.movieHost+FIND_URL+'?userId='+Global.USER_LOGIN_INFO.id);
            let responseData = await this.request(Global.movieHost+FIND_URL+'?userId='+Global.USER_LOGIN_INFO.id,{
                method:'GET'
            });
			this.hideLoading();
			if(responseData.return_code == '0'){
				console.log('responseData-------------------------');
				console.log(responseData);
				if(responseData.data != undefined){
					for(let i=0;i<responseData.data.length;i++){
						switch (responseData.data[i].orderStatus){
							case '0':
								responseData.data[i].orderStatus = '未支付';
								break;
							case '1':
								responseData.data[i].orderStatus = '已支付';
								break;
							case '2':
								responseData.data[i].orderStatus = '订票成功';
								break;
							case '3':
								responseData.data[i].orderStatus = '交易完成';
								break;
							case '4':
								responseData.data[i].orderStatus = '在途';
								break;														
							case '5':
								responseData.data[i].orderStatus = '已支付 锁座失败';
								break;
							case '6':
								responseData.data[i].orderStatus = '发货成功';
								break;
							case '7':
								responseData.data[i].orderStatus = '发货失败(生成兑换码失败)';
								break;
							case '8':
								responseData.data[i].orderStatus = '已退票';
								break;	
							case '9':
								responseData.data[i].orderStatus = '订单取消';
								break;
							case '10':
								responseData.data[i].orderStatus = '退款中';
								break;																																		
						}

					}
					this.data = responseData.data;
					this.setState({
						dataSource: this.state.dataSource.cloneWithRows(responseData.data),
						isRefreshing: false,
						loaded: true,
					});
				}
			}
		} catch(e) {
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
            title: "订单详情",
            component: MovieOrder,
            passProps: {
            	id : id,
            	refresh : this.refresh,
            	backRoute:this.props.route
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
				{this._getNavBar()}
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
		    </View>
		);
	},

	renderItem: function(item, sectionID, rowID, highlightRow) {
            
        var topLine = rowID === '0' ? <View style={Global.styles.FULL_SEP_LINE} /> : null;
        var bottomLine = (<View style={Global.styles.FULL_SEP_LINE} />);
        var orderInfo = item.orderName.split(':');
		return (
			<View >
				{topLine}
				<TouchableOpacity style={[styles.item]} onPress={()=>{this.doEdit(item.id);}}>
					<View style={{flex:1}}>
						<View style={{flex:1,flexDirection:'row'}}>
							<Text style={{fontSize:15}}>电影名称：{orderInfo[4]}</Text>
						</View>
						<View style={{flex:1,flexDirection:'row'}}>
							<Text style={{flex:1,fontSize:15,color:Global.colors.ORANGE}}>总价：{this.filterMoney(item.price)}元</Text>
							{/*<Text style={{flex:1,fontSize:15}}>购买数量：{item.buyCount}</Text>*/}
						</View>
						<View style={{flex:1,flexDirection:'row'}}>
							<Text style={{flex:1,fontSize:15}}>订单时间：{item.orderTime}</Text>
						</View>
					</View>
					<Text style={{marginLeft:5,fontSize:15,color:'red'}}>{item.orderStatus}</Text>
					
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
				navigator={this.props.navigator} 
				route={this.props.route} 
				hideBottomLine={true} 
				flow={false} 
				rightButtons={(
					<View style={[Global.styles.NAV_BAR.BUTTON_CONTAINER, Global.styles.NAV_BAR.RIGHT_BUTTONS]}>
						<TouchableOpacity style={[Global.styles.NAV_BAR.BUTTON]} onPress={this.refresh}>
							<Text style={{color: Global.colors.IOS_BLUE,}}>刷新</Text>
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
	
	list: {
		backgroundColor: '#ffffff',
	},
	item: {
		width: Global.getScreen().width ,
        flexDirection: 'row',
        padding: 10,
        alignItems: 'center', 
        // paddingLeft: 10,
        // paddingRight: 20,
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

module.exports = MovieOrders;
