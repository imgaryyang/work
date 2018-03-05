'use strict';

var React = require('react-native');
var NavBar = require('../NavBar');
var Icon = require('react-native-vector-icons/Ionicons');
var Global = require('../../Global');
var MngIdx = require('../mng/MngIdx');
var Checkbox = require('../lib/Checkbox');
var SearchInput = require('../lib/SearchInput');
var Edit = require('./bossApprEdit');

var UtilsMixin = require('../lib/UtilsMixin');
var TimerMixin = require('react-timer-mixin');
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
    Easing,
} = React;

var FIND_URL = 'vacation/findApprove';
var UPDATE_URL = 'vacation/operMuch';

var BossApprList = React.createClass({

	mixins: [UtilsMixin, TimerMixin, FilterMixin],
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
			showLoading: false,
			showDelBtn: false,
			delBtnLeftPos: new Animated.Value(-60),
			cond: null,
			memo: '',
			isRefreshing: false,
			refreshCheckbox:false,
		};
	},

	_genRows: function(pressData: {[key: number]: boolean}): Array<string> {
		var dataBlob = [];
		return dataBlob;
	},

    componentDidMount: function() {
    	this.param=[];
		InteractionManager.runAfterInteractions(() => {
			this.setState({doRenderScene: true});
			this.fetchData();
		});
	},

	/**
	* 调用刷新
	*/
	refresh: function() {
		this.setState({refreshCheckbox:true});
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
		this.param = [];
		this.refresh();
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
					approveId : Global.USER_LOGIN_INFO.id
				})
			});
			this.hideLoading();
			this.data = responseData.body;
			this.setState({
				dataSource: this.state.dataSource.cloneWithRows(responseData.body),
				isRefreshing: false,
				loaded: true,
				fetchForbidden: false
			});
			this.setState({refreshCheckbox:false});
		} catch(e) {
			if(e.status == 401 || e.status == 403)
				this.setState({fetchForbidden: true});
			this.requestCatch(e);
		}
	},

	doEdit: function(id) {
        this.props.navigator.push({
            title: "休假信息",
            component: Edit,
            passProps: {
            	id: id,
            	refresh: this.refresh,
            },
        });
    },

	onApprCheck : function(id){
        this.param.push(id);
        console.log(this.param);
    },
    unApprCheck : function(id){
        let idx = this.param.indexOf(id);
        this.param.splice(idx,1);
        console.log(this.param);
    },
    agree:function(){
        let count = this.param.length;
        console.log('008943834u843');
        console.log(this.param);
        console.log('0rrrrrrrrrrrrrrr3');
        console.log(count);
        if(count == 0){
             Alert.alert(
                'Warning',
                '请选择要审批的申请！', 
            );
        }else{
            Alert.alert(
                '操作确认',
                '确定同意这' + count + '条申请?', 
                [{
                    text: 'Cancel'
                }, {
                    text: 'OK',
                    onPress: () => this.checkAppr(1)
                }, ]
            );
        }       
    },
    disagree : function(){
        let count = this.param.length;
         if(count == 0){
             Alert.alert(
                'Warning',
                '请选择要驳回的申请！', 
            );
        }else{
            Alert.alert(
                '操作确认',
                '确定驳回这' + count + '条申请?', 
                [{
                    text: 'Cancel'
                }, {
                    text: 'OK',
                    onPress: () => this.checkAppr(2)
                }, ]
            );
        }
    },
    
    checkAppr:async function(flag) {
        this.showLoading();
        try {
            let responseData = await this.request(Global.host +UPDATE_URL, {
                body: JSON.stringify({
                    type: flag,
                    param: this.param,
                    comment: this.state.memo
                }),
            });
        } catch (e) {
            this.requestCatch(e);
        }
        this.hideLoading();
        this.fetchData();
        this.param = [];
        this.setState({memo : null});
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
			//console.log(refreshView);

		var bottomView = this.data.length === 0 ?
			null:
			(
			<View>
				<View style={Global.styles.PLACEHOLDER20}/>
				<View style={[Global.styles.CENTER,styles.rowInputHolder]}>
					<Text style={{marginLeft: 10, marginTop:1, fontSize: 15,}}>批注：</Text>
					<TextInput  style={[Global.styles.CENTER,styles.rowInput]} value={this.state.memo} placeholder="请填写批注" onChangeText={(memo) => {this.setState({memo:memo})}}/>
				</View>
			</View>);
		var bottomView2 = this.data.length === 0 ?
			null:
			(<View style={{flex: 1, flexDirection: 'row', marginTop: 20,}}>
				<TouchableOpacity 
					style={[Global.styles.CENTER, {height: 40, flex: 1, backgroundColor: Global.colors.IOS_BLUE, borderRadius: 3,}]} 
					onPress={this.agree}>
				<Text style={{color: '#ffffff',}}>通过</Text>
				</TouchableOpacity>
				<View style={{flex: 0.05}}></View>
				<TouchableOpacity 
					style={[Global.styles.CENTER, {height: 40, flex: 1, backgroundColor: Global.colors.IOS_BLUE, borderRadius: 3,}]} 
					onPress={this.disagree}>
				<Text style={{color: '#ffffff',}}>驳回</Text>
				</TouchableOpacity>
			</View>);

		return (
			<View style={Global.styles.CONTAINER}>
				<View style={styles.paddingPlace} />
				<ScrollView style={styles.sv} refreshControl={this.getRefreshControl(this.pullToRefresh)}>
				<View style={Global.styles.PLACEHOLDER20} />
					{refreshView}
					
					<ListView
						key={this.data}
				        dataSource={this.state.dataSource}
				        renderRow={this.renderItem}
				        style={[styles.list]} />
				        
				    {bottomView}

				    {bottomView2}
				  
					<View style={{flex: 1, height: 40,}} />
			    </ScrollView>

				<View style={[Global.styles.TOOL_BAR.BAR,styles.TOOL_BAR_Left]}>
					<SearchInput 
						value={this.state.cond}  placeholder='申请人姓名'
						onChangeText={(value) => this.setState({cond: value})} />
					<TouchableOpacity style={[Global.styles.CENTER, Global.styles.TOOL_BAR.BUTTON,]} onPress={this.search}>
						<Text style={{color: Global.colors.IOS_BLUE}}>查询</Text>
					</TouchableOpacity>
				</View>

				<NavBar 
					navigator={this.props.navigator} 
					route={this.props.route}
					hideBottomLine={true} />
		    </View>
		);
	},

	renderItem: function(item, sectionID, rowID, highlightRow) {
            
        var topLine = rowID === '0' ? <View style={Global.styles.FULL_SEP_LINE} /> : null;
        var bottomLine = (<View style={Global.styles.FULL_SEP_LINE} />);
        var stateChinese = null;
        if(item.state ==='0')
        	stateChinese = (<View style={{flex:1,flexDirection:'row',flexWrap:'nowrap'}}>
        					<Text style={[styles.item1]}>状        态：</Text>
							<Text style={[styles.item2]}>待审批</Text>
							{/*<Text style={{flex: 1, marginLeft: 10,fontSize: 15}}>状态: 待审批</Text>*/}
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
				<TouchableOpacity style={[styles.item, Global.styles.CENTER, ]} onPress={()=>{this.doEdit(item.id);}}>
					 <Checkbox  style={{marginLeft:20}} color={Global.colors.IOS_BLUE} refresh={this.state.refreshCheckbox}  onCheck={()=>{this.onApprCheck(item.id);}} onUncheck={()=>{this.unApprCheck(item.id);}}/>
					<View style={{flex:1,flexDirection:'column'}}>
						<View style={{flex:1,flexDirection:'row'}}>
							<Text style={[styles.item1]}>申  请  人：</Text>
							<Text style={[styles.item2]}>{item.employeeName}</Text>
							{/*<Text style={{flex: 1, marginLeft: 10, fontSize: 15}}>申请人：{item.employeeName}</Text>*/}
						</View>
						<View style={{flex:1,flexDirection:'row'}}>
							<Text style={[styles.item1]}>事        由：</Text>
							<Text style={[styles.item2]}>{item.reson}</Text>
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
		height: Global.NBPadding + 44,
	},

	searchInput: {
		width: Global.getScreen().width - 60,
	},

	list: {
		backgroundColor: '#ffffff',
	},
	item: {
		width: Global.getScreen().width + 30,
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
	
	rowInputHolder: {
		flex: 1, 
		marginLeft: 1, 
		marginTop: 5,
		flexDirection: 'row', 
		// borderWidth: 1 / Global.pixelRatio, 
		borderColor: Global.colors.IOS_SEP_LINE, 
		borderRadius: 3,
	},
	rowInput: {
		flex: 1, 
		height: 35, 
		borderWidth: 0, 
		textAlign: 'left', 
		paddingLeft: 10, 
		paddingRight: 10, 
		backgroundColor: '#ffffff',
		//backgroundColor: 'transparent'
	},
	TOOL_BAR_Left: {
		paddingLeft: 10, 
	},
	item1: {
		marginLeft: 10,
		width: 80, 
		fontSize: 13,
	},
	item2:{
		marginLeft: -10,
		width:Global.getScreen().width - 100,
		fontSize: 13,
	},
});

module.exports = BossApprList;
