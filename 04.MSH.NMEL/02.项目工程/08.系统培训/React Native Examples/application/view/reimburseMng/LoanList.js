var React = require('react-native');
var NavBar = require('../NavBar');
var Icon = require('react-native-vector-icons/Ionicons');
var Global = require('../../Global');
var loanEdit = require('./LoanEdit');
var loanDetail = require('./LoanDetail');
var TopGridMenu = require('../lib/TopGridMenu');
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
	Alert
}=React;

var FIND_URL =  'loan/find';
var FIND_LEADER_URL =  'person/findOne';
var DEL_URL = 'loan/destory';

LoanList = React.createClass({
	
	mixins: [UtilsMixin,,FilterMixin],

	data:[],

	getInitialState: function() {
		var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
			return {
		   		doRenderScene: false,
				dataSource: ds.cloneWithRows(this._genRows({})),
				loaded: false,
				showDelBtn: false,
				delBtnLeftPos: new Animated.Value(-60),
				cond: null,
				list : 0,
				isRefreshing: false,
			};
		},
	componentDidMount: function() {
		InteractionManager.runAfterInteractions(() => {
			this.setState({doRenderScene: true});
			this.fetchData(0);
		});
	},
	_genRows: function(pressData: {[key: number]: boolean}): Array<string> {
		var dataBlob = [];
		/*for (var ii = 0; ii < 30; ii++) {
			var pressedText = pressData[ii] ? ' (pressed)' : '';
			dataBlob.push('Row ' + ii + pressedText);
		}*/
		return dataBlob;
	},
	refreshLoanList : function(flag){
		this.setState({list:flag});
		this.fetchData(flag);
	},
	pullToRefresh: function(flag) {
    	this.setState({isRefreshing: true});
		this.fetchData(flag);
	},
	doEdit: function(state,loanId) {
		if(state=="未提交"||state =="驳回"||state==undefined){
	        this.props.navigator.push({
	            title: "新建借款单",
	            component: loanEdit,
	            hideNavBar: false,
	            passProps: {
	            	loanId: loanId,
	            	refreshLoanList: this.refreshLoanList,
	            	backRoute: this.props.route,
	            },
	        });
        }else{
        	this.props.navigator.push({
	            title: "借款单详情",
	            component: loanDetail,
	            hideNavBar:false,
	            passProps: {
	            	loanId: loanId,
	            },
	        });
        }
    },
	fetchData: async function(s) {
		var c = s == 0 ? [0, 3] : [1, 2, 4]; //借款单状态
		this.setState({
			list: s,
			cond: c,
			loaded: false,
			fetchForbidden: false,
		});
		this.showLoading();
		try {
			let responseData = await this.request(Global.host + FIND_URL, {
				body: JSON.stringify({
					state: this.state.cond,
					custId: Global.USER_LOGIN_INFO.Employees.id
				}),
			});
			for (var i in responseData.body) {
				switch (responseData.body[i].state) {
					case '0':
						responseData.body[i].state = '未提交';
						break;
					case '1':
						responseData.body[i].state = '已提交';
						break;
					case '2':
						responseData.body[i].state = '通过';
						break;
					case '3':
						responseData.body[i].state = '驳回';
						break;
					case '4':
						responseData.body[i].state = '结束';
						break;
				}
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
			this.hideLoading();
			this.data = responseData.body;
			this.setState({
				dataSource: this.state.dataSource.cloneWithRows(responseData.body),
				isRefreshing: false,
				loaded:true
			})
		}catch(e) {
			this.hideLoading();
			this.setState({
				isRefreshing: false,
			});
			if(e.status == 401 || e.status == 403)
				this.setState({fetchForbidden: true});
			this.requestCatch(e);
		}
	},
	
	async findLeaderName(leader) {
		if (leader != null) {
			try {
				let responseData = await this.request(Global.host + FIND_LEADER_URL, {
					body: JSON.stringify({
						id: leader,
					})
				});
				var leaderName = await responseData.body.name;
				return leaderName;
			} catch (e) {
				this.requestCatch(e);
			}
		}
		return null;
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

	deleteItem:async function() {
		this.showLoading();
		try {
			let responseData = await this.request(Global.host + DEL_URL, {
				body: JSON.stringify({
					loanId: this.item.loanId,
				}),
			});
			this.hideLoading();
			this.data.splice(this.rowID, 1);
			this.setState({
				dataSource: this.state.dataSource.cloneWithRows(this.data),
			});
			this.controlDelBtn();
		} catch (e) {
			this.requestCatch(e);
		}
	},
	render : function(){
		if(!this.state.doRenderScene)
			return this._renderPlaceholderView();

			var refreshText = this.state.fetchForbidden === true ? 
			'您还未登录，登录后点击此处刷新数据' : 
			'暂无符合条件的数据，点击此处重新载入';

			var refreshView = (this.state.loaded || this.state.fetchForbidden) && this.data.length === 0 ?
				this.getListRefreshView(refreshText,()=> this.refreshLoanList(this.state.list)) : 
				null;
		return (
			<View style={Global.styles.CONTAINER}>
				{this._getNavBar()}
				<ScrollView style={styles.sv} 
				automaticallyAdjustContentInsets={false} 
				refreshControl={this.getRefreshControl(()=>this.pullToRefresh(this.state.list))}>
					<View style={Global.styles.PLACEHOLDER20} />
					{refreshView}
					<ListView
						key={this.data}
				        dataSource={this.state.dataSource}
				        renderRow={this.renderItem}
				        style={[styles.list]} />
					<View style={{flex: 1, height: 40,}} />
			    </ScrollView>
			</View>
			);
			
	},

	renderItem: function(item: string, sectionID: number, rowID: number) {
		var detail = null;
		if(item.state ==='驳回')
			detail = (<Text style={{flex: 1, marginLeft: 20, marginTop: 2, fontSize: 12, color: Global.colors.IOS_GRAY_FONT}}>批注:{item.memo}</Text>);
		var topLine = rowID === '0' ? <View style={Global.styles.FULL_SEP_LINE} /> : null;
        var bottomLine = (<View style={Global.styles.FULL_SEP_LINE} />);
		var delBtnLeftPos = this.state.list==0?this.state.delBtnLeftPos:-60;
		return (
			<View>
				{topLine}
				<TouchableOpacity style={[styles.item, Global.styles.CENTER, {left:delBtnLeftPos}]} onPress={()=>{this.doEdit(item.state,item.loanId);}}>
					<TouchableOpacity style={[styles.delInItem, Global.styles.CENTER]} onPress={()=>{this.confirmDelete(item, rowID);}}>
						<Icon name='ios-minus' size={25} color={Global.colors.IOS_RED} style={[Global.styles.ICON]} />
					</TouchableOpacity>
					
					<View style={{flex: 1, flexDirection: 'column'}}>
						<Text style={{flex: 1, marginLeft: 20, fontSize: 15, fontWeight: '400'}}>{item.loanname}</Text>
						<Text style={{flex: 1, marginLeft: 20, fontSize: 13, marginTop: 3, color: Global.colors.IOS_GRAY_FONT}}>状态：{item.state}</Text>
						<Text style={{flex: 1, marginLeft: 20, fontSize: 13, marginTop: 3, color: Global.colors.IOS_GRAY_FONT}}>事由：{item.reason}</Text>
						{detail}
					</View>

					<Text style={{width: 100, marginLeft: 10, marginRight: 10, fontSize: 13, textAlign: 'right', color:Global.colors.ORANGE}}>￥{this.filterMoney(item.loanamt)}</Text>

					<Icon name='ios-arrow-right' size={18} color={Global.colors.IOS_DARK_GRAY} style={[Global.styles.ICON, {width: 20}]} />

				</TouchableOpacity>
				{bottomLine}
			</View>
		);
	},
	_getNavBar: function() {
		var delBtn = this.state.list == 0 ? 
		(
			<TouchableOpacity style={[Global.styles.NAV_BAR.BUTTON]} onPress={this.controlDelBtn}>
				<Text style={{color: Global.colors.IOS_BLUE,}}>删除</Text>
			</TouchableOpacity>
		) : null;
		return (
			<NavBar 
				navigator={this.props.navigator} 
				route={this.props.route}
				flow={false}
				centerComponent={(
					<View style={[Global.styles.NAV_BAR.CENTER_VIEW, {flex: 2, flexDirection: 'row'}]} >
						<TopGridMenu 
							items={[
								{text: '未提交', onPress: this.fetchData},
								{text: '已提交', onPress: this.fetchData},
							]} 
							selected={this.state.list}/>
					</View>
				)}
				rightButtons={(
					<View style={[Global.styles.NAV_BAR.BUTTON_CONTAINER, Global.styles.NAV_BAR.RIGHT_BUTTONS]}>
						{delBtn}
						<TouchableOpacity style={[Global.styles.NAV_BAR.BUTTON]} onPress={()=>{this.doEdit()}}>
							<Text style={{color: Global.colors.IOS_BLUE,}}>添加</Text>
						</TouchableOpacity>
					</View>
				)} />
		);
	},
	_renderPlaceholderView: function() {
		return (
			<View style={Global.styles.CONTAINER}>
				{this._getNavBar()}
			</View>
		);
	},
});
var styles = StyleSheet.create({
	
	sv: {
		flex:1
	},
	placeholder: {
		flex: 1,
		height: Global.NBPadding+60 ,
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
        padding: 10,
        paddingLeft: 0,
        paddingRight: 5,
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

module.exports = LoanList;