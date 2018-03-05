'use strict';

var React = require('react-native');
var NavBar = require('../NavBar');
var FAIcon = require('react-native-vector-icons/FontAwesome');
var Icon = require('react-native-vector-icons/Ionicons');
var Global = require('../../Global');
var costEdit = require('./CostEdit');

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
var FIND_URL =  'cost/find';
var DEL_URL =  'cost/destory';

var CostList = React.createClass({

	mixins: [UtilsMixin,,FilterMixin],
	data: [],
	rowID:null,
	getInitialState: function() {
		var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
			return {
		   		doRenderScene: false,
				dataSource: ds.cloneWithRows(this._genRows({})),
				showDelBtn: false,
				delBtnLeftPos: new Animated.Value(-60),
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
		try {
			let responseData = await this.request(Global.host+FIND_URL, {
				body: JSON.stringify({
					custId: Global.USER_LOGIN_INFO.Employees.id
				}),
			});
			for (let i = 0; i < responseData.body.length; i++) {
				/*let date = new Date(responseData.body[i].date);
				let hours = (date.getHours() > 9) ? date.getHours() : '0' + date.getHours();
				let minute = (date.getMinutes() > 9) ? date.getMinutes() : '0' + date.getMinutes();
				// let second = (date.getSeconds() > 9) ? date.getSeconds() : '0' + date.getSeconds();
				let year = date.getFullYear();
				let month = (date.getMonth() + 1) > 9 ? (date.getMonth() + 1) : '0' + (date.getMonth() + 1);
				var day = date.getDate()> 9 ? date.getDate()  : ('0' + date.getDate());
				responseData.body[i].date = year + '-' + month + '-' + day + ' ' + hours + ':' + minute ;*/
				responseData.body[i].date = this.filterDateFmt(responseData.body[i].date);
			}
			this.data = responseData.body;
			this.hideLoading();
			this.setState({
				dataSource: this.state.dataSource.cloneWithRows(responseData.body),
				isRefreshing: false,
				loaded: true,
			});
		} catch (e) {

			this.setState({
				isRefreshing: false,
			});
			if (e.status == 401 || e.status == 403)
				this.setState({
					fetchForbidden: true
				});
			this.requestCatch(e);
			
		}
	},
	
	doEdit: function(costId) {
        this.props.navigator.push({
            title: "新建消费记录",
            component: costEdit,
            passProps: {
            	costId: costId,
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

	deleteItem:async function() {
		this.showLoading();
		try {
			let responseData = await this.request(Global.host + DEL_URL, {
				method: 'POST',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					costId: this.item.costId,
				}),
			});
			this.hideLoading();
			this.data.splice(this.rowID, 1);
			this.setState({
				dataSource: this.state.dataSource.cloneWithRows(this.data),
			});
			this.controlDelBtn();
			this.toast('删除成功!');
		} catch (e) {
			this.hideLoading();
			this.requestCatch(e);
		}
	},

	render : function(){
		var listView = null;

		if(!this.state.doRenderScene)
			return this._renderPlaceholderView();
		var refreshText = this.state.fetchForbidden === true ? 
			'您还未登录，登录后点击此处刷新数据' : 
			'暂无消费记录，点击此处重新载入';

		var refreshView = (this.state.loaded || this.state.fetchForbidden) && this.data.length === 0 ?
			this.getListRefreshView(refreshText, this.refresh) : 
			null;
		return (
			<View style={[styles.container]}>
				<ScrollView style={styles.sv} automaticallyAdjustContentInsets={false}  refreshControl={this.getRefreshControl(this.pullToRefresh)}>
					<View style={styles.placeholder}  />
					{refreshView}
					<ListView
						key={this.data}
				        dataSource={this.state.dataSource}
				        renderRow={this.renderItem}
				        style={[styles.list]} />
					<View style={{flex: 1, height: 40,}} />
			    </ScrollView>
			    <NavBar 
					rootNavigator={this.props.rootNavigator} 
					navigator={this.props.navigator} 
					route={this.props.route}
					rightButtons={(
						<View style={[Global.styles.NAV_BAR.BUTTON_CONTAINER, Global.styles.NAV_BAR.RIGHT_BUTTONS]}>
							<TouchableOpacity style={[Global.styles.NAV_BAR.BUTTON]} onPress={this.controlDelBtn}>
								<Text style={{color: Global.colors.IOS_BLUE,}}>删除</Text>
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
		//console.log(rowID);
		var topLine = rowID === '0' ? <View style={Global.styles.FULL_SEP_LINE} /> : null;
        var bottomLine = (<View style={Global.styles.FULL_SEP_LINE} />);
        var image=null;
        switch (item.type){
        	case '1':
        		image=(<View style={[styles.portrait, Global.styles.CENTER, Global.styles.BORDER,{backgroundColor:'rgba(111, 172, 240, 1)'}]}><Icon style={[{color:'#ffffff',textAlign: 'center',}]} name='plane' size={25}/></View>);
        		break;
        	case '2':
        		image=(<View style={[styles.portrait, Global.styles.CENTER, Global.styles.BORDER,{backgroundColor:'rgba(240, 216, 79, 1)'}]}><Icon style={[{color:'#ffffff',textAlign: 'center',}]} name='android-car' size={25}/></View>);
        		break;
        	case '3':
        		image=(<View style={[styles.portrait, Global.styles.CENTER, Global.styles.BORDER,{backgroundColor:'rgba(245, 80, 150, 1)'}]}><Icon style={[{color:'#ffffff',textAlign: 'center',}]} name='ios-home' size={25}/></View>);
        		break;
        	case '4':
        		image=(<View style={[styles.portrait, Global.styles.CENTER, Global.styles.BORDER,{backgroundColor:'rgba(88, 209, 137, 1)'}]}><Icon style={[{color:'#ffffff',textAlign: 'center',}]} name='fork' size={25}/></View>);
        		break;
        	case '5':
        		image=(<View style={[styles.portrait, Global.styles.CENTER, Global.styles.BORDER,{backgroundColor:'rgba(234, 148, 106, 1)'}]}><Icon style={[{color:'#ffffff',textAlign: 'center',}]} name='ios-telephone' size={25}/></View>);
        		break;
        	case '6':
        		image=(<View style={[styles.portrait, Global.styles.CENTER, Global.styles.BORDER,{backgroundColor:'rgba(186, 119, 219, 1)'}]}><Icon style={[{color:'#ffffff',textAlign: 'center',}]} name='more' size={25}/></View>);
        		break;
        }
		return (
			<View>
				{topLine}
				<TouchableOpacity style={[styles.item, Global.styles.CENTER,{left: this.state.delBtnLeftPos}]} onPress={()=>{this.doEdit(item.costId);}}>
					<TouchableOpacity style={[styles.delInItem, Global.styles.CENTER]} onPress={()=>{this.confirmDelete(item, rowID);}}>
						<Icon name='ios-minus' size={25} color={Global.colors.IOS_RED} style={[Global.styles.ICON]} />
					</TouchableOpacity>
					{image}

					<View style={{flex:1,flexDirection:'column'}}>
						<View style={{flex:1,flexDirection:'row'}}>
							<Text style={{flex: 1, marginLeft: 10, fontSize: 15,fontWeight:'bold',color:Global.colors.ORANGE}}>￥{this.filterMoney(item.amt)}</Text>
							<Text style={{flex: 1, fontSize: 12}}>{item.num}张发票</Text>
						</View>
						<View style={{flex:1,flexDirection:'row',flexWrap:'nowrap'}}>
							<Text style={{flex: 1, marginLeft: 10,fontSize: 12}}>{item.date}</Text>
							<Text style={{flex: 1,fontSize: 12}}>{item.memo}</Text>
						</View>
					</View>
					<Icon name='ios-arrow-right' size={18} color={Global.colors.IOS_DARK_GRAY} style={[Global.styles.ICON, {width: 20}]} />
				</TouchableOpacity>
				{bottomLine}
			</View>
		);
	},

	_renderPlaceholderView: function() {
		return (
			<View style={[styles.container]}>
				<NavBar 
					rootNavigator={this.props.rootNavigator} 
					navigator={this.props.navigator} 
					route={this.props.route}
					rightButtons={(
						<View style={[Global.styles.NAV_BAR.BUTTON_CONTAINER, Global.styles.NAV_BAR.RIGHT_BUTTONS]}>
							<TouchableOpacity style={[Global.styles.NAV_BAR.BUTTON]} onPress={this.controlDelBtn}>
								<Text style={{color: Global.colors.IOS_BLUE,}}>删除</Text>
							</TouchableOpacity>
							<TouchableOpacity style={[Global.styles.NAV_BAR.BUTTON]} onPress={()=>{this.doEdit()}}>
								<Text style={{color: Global.colors.IOS_BLUE,}}>添加</Text>
							</TouchableOpacity>
						</View>
					)} />
			</View>
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
		flex: 1,
		height: Global.NBPadding +20,
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

module.exports = CostList;