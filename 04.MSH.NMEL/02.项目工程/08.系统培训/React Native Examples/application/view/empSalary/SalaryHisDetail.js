'use strict';

var React = require('react-native');
var NavBar = require('../NavBar');
var Icon = require('react-native-vector-icons/Ionicons');
var Global = require('../../Global');
var MngIdx = require('../mng/MngIdx');
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

var FIND_URL = 'salaryDetail/findOne';

var SalaryHisDetail = React.createClass({

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
			cond: null,
			// showDetail:false,
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

	/**
	* 组件接收参数变化
	*/
	componentWillReceiveProps: function(props) {

	},

	/**
	* 调用刷新
	*/
	refresh: function() {
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
		// console.log('detai_ID');
		// console.log(this.props.id);
		try {
			let responseData = await this.request(Global.host + FIND_URL, {
				body: JSON.stringify({
					id:this.props.id,
				})
			});
			this.hideLoading();
			this.data = responseData.body;
			// console.log(this.data);
			this.data.time=this.data.time.substr(0,10)+' '+this.data.time.substr(11,8);
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

		var refreshView = (this.state.loaded || this.state.fetchForbidden) && this.data.length === 0 ?
			this.getListRefreshView(refreshText, this.refresh) : 
			null;
		

		var SIStyleIOS = Global.os === 'ios' ? Global.styles.TOOL_BAR.SEARCH_INPUT_IOS : {};
		return (
			<View style={[Global.styles.container]}>
				<View style={styles.paddingPlace} />
				<ScrollView style={[styles.sv]} refreshControl={this.getRefreshControl(this.refresh)}>
					{refreshView}
					<View style={[styles.list,Global.styles.CENTER]}>
						<View style={Global.styles.FULL_SEP_LINE} />	
						<View style={[styles.row,Global.styles.CENTER]}>
							<Text style={[styles.item1]}>公司名称：</Text>
							<Text style={[styles.item2]}>{this.data.companyName}</Text>
						</View>
						<View style={Global.styles.FULL_SEP_LINE} />
						<View style={[styles.row,Global.styles.CENTER]}>
						<Text style={[styles.item1]}>员工姓名：</Text>
						<Text style={[styles.item2]}>{this.data.employeeName}</Text>
						</View>
						<View style={Global.styles.FULL_SEP_LINE} />
						<View style={[styles.row,Global.styles.CENTER]}>
							<Text style={[styles.item1]}>工作总额：</Text>
							<Text style={[styles.item2]}>{parseFloat(this.data.actualAmt).toFixed(2)}</Text>
						</View>
						<View style={Global.styles.FULL_SEP_LINE} />
						<View style={[styles.row,Global.styles.CENTER]}>
							<Text style={[styles.item1]}>发放时间：</Text>
							<Text style={[styles.item2]}>{this.data.time}</Text>
						</View>
						<View style={Global.styles.FULL_SEP_LINE} />
						<View style={[styles.row,Global.styles.CENTER]}>
							<Text style={[styles.item1]}>税前工资：</Text>
							<Text style={[styles.item2]}>{parseFloat(this.data.amt1).toFixed(2)}</Text>
						</View>
						<View style={Global.styles.FULL_SEP_LINE} />
						<View style={[styles.row,Global.styles.CENTER]}>
							<Text style={[styles.item1]}>医社保：</Text>
							<Text style={[styles.item2]}>{parseFloat(this.data.amt2).toFixed(2)}</Text>
						</View>
						<View style={Global.styles.FULL_SEP_LINE} />
						<View style={[styles.row,Global.styles.CENTER]}>
							<Text style={[styles.item1]}>公积金：</Text>
							<Text style={[styles.item2]}>{parseFloat(this.data.amt3).toFixed(2)}</Text>
						</View>
						<View style={Global.styles.FULL_SEP_LINE} />
						<View style={[styles.row,Global.styles.CENTER]}>
							<Text style={[styles.item1]}>补助：</Text>
							<Text style={[styles.item2]}>{parseFloat(this.data.amt4==null?0:this.data.amt4).toFixed(2)}</Text>
						</View>
						<View style={Global.styles.FULL_SEP_LINE} />
						<View style={[styles.row,Global.styles.CENTER]}>
							<Text style={[styles.item1]}>税：</Text>
							<Text style={[styles.item2]}>{parseFloat(this.data.amt5==null?0:this.data.amt5).toFixed(2)}</Text>
						</View>
						<View style={Global.styles.FULL_SEP_LINE} />
						<View style={[styles.row,Global.styles.CENTER]}>
							<Text style={[styles.item1]}>税后工资：</Text>
							<Text style={[styles.item2]}>{parseFloat(this.data.amt6).toFixed(2)}</Text>
						</View>
						<View style={Global.styles.FULL_SEP_LINE} />
					</View>
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
	sv:{

	},
	list: {
		flex:1,
		backgroundColor: 'white',
	},
	paddingPlace: {
		height: Global.NBPadding + 20 ,
	},
	row: {
		flex: 1,
		paddingLeft: 10,
		paddingRight: 10,
		height: 40,
		flexDirection:'row',

	},
	item1: {
		width: 80, 
		fontSize: 13,
	},
	item2:{
		width:Global.getScreen().width - 100,
		fontSize: 13,
	},
	
	
});

module.exports = SalaryHisDetail;
