'use strict';

var React = require('react-native');
var NavBar = require('../NavBar');
var Icon = require('react-native-vector-icons/Ionicons');
var Global = require('../../Global');
var List = require('./list');

var UtilsHoc = require('../lib/UtilsHoc');
var FilterMoneyHoc = require('../../filter/FilterMoneyHoc');
// var UtilsMixin = require('../lib/UtilsMixin');
// var TimerMixin = require('react-timer-mixin');
// var FilterMixin =require('../../filter/FilterMixin');
var {
	Alert,
	StyleSheet,
	ScrollView,
	View,
	Text,
	Image,
	TouchableOpacity,
	TextInput,
	InteractionManager,
	ListView,
} = React;

var FIND_URL =  'welfareinfo/findWelfEmployee';
var SUBMIT_URL = 'welfareinfo/save';

var EmployeeList = React.createClass({

	// mixins: [UtilsMixin, TimerMixin,FilterMixin],

	data: [],
	
	getInitialState: function() {
		
		var ds = new ListView.DataSource({
			rowHasChanged: (row1, row2) => row1 !== row2,
		});
		return {
			doRenderScene: false,
			dataSource: ds.cloneWithRows(this._genRows({})),
			fetchForbidden: false,
			value:{
				ids:this.props.ids,
				welfareName:this.props.welfareName,
				typeid:this.props.typeid,
			},
			text:[],
		};
	},

	_genRows: function(pressData: {[key: number]: boolean}): Array<string> {
		var dataBlob = [];
		return dataBlob;
	},

    componentDidMount: function() {

		InteractionManager.runAfterInteractions(() => {
			this.fetchData();
			this.setState({doRenderScene: true});
			
		});
	},

	fetchData: async function(id) {
		this.props.showLoading();
		try {
			let responseData = await this.props.request(Global.host + FIND_URL, {
				body: JSON.stringify({
					cond: this.props.ids,
					ownerOrg:Global.USER_LOGIN_INFO.company.id,
				})
			});
			this.props.hideLoading();
			this.data = responseData.body;
			this.setState({doRenderScene: true});
			this.setState({
				dataSource: this.state.dataSource.cloneWithRows(responseData.body),
				isRefreshing: false,
				loaded: true,
				text:[],
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
	
	/**
	* 组件接收参数变化
	*/
	componentWillReceiveProps: function(props) {
		
	},

    save: function() {
    	var res = true;
    	var re = /^[1-9]+[0-9]*(.[0-9]+)?$/;
    	var parm = '{"welfareName":"'+this.props.welfareName+'","typeid":"'+this.props.typeid+'","ownerOrg":"'+Global.USER_LOGIN_INFO.company.id+'","welfares":[';
    	var obj=null;
    	var damt=null;
		for (var i = 0; i < this.data.length ; i++) {
    		if(this.state.text[i]){
    			damt=this.state.text[i].replace(/\,/g, '');
    			if(re.test(damt)) {
    				obj='{"id":"'+this.data[i].id+'","fullAmt":"'+damt+'"}';
    				parm+=obj+",";  				
    			}else{
						Alert.alert('错误','员工：'+this.data[i].name+'福利金额只能为数字');
    					res = false;
    					i=this.data.length;    				
    			}

    		}else
    			{
    				Alert.alert('错误','员工：'+this.data[i].name+'福利金额不能为空');
    				res = false;
    				i=this.data.length;
    			}
		};

		if(res){
			//清除历史记录，防止再次录入时仍有记录缓存
			// this.amt=[];
			parm = parm.substring(0,parm.length-1)+']}';
			var value = JSON.parse(parm);
			this.doSave(value);
		}
    },

    doSave: async function(value){
    	this.props.showLoading();
    	var body = JSON.stringify(value);
		try{
			let responseData = await this.props.request(Global.host + SUBMIT_URL,{
				body:body
			});
			this.props.hideLoading();
			this.props.navigator.popToRoute(this.props.backRoute);
			this.props.refresh.call(this,0);
			this.props.toast('保存成功！');

		} catch(e) {
			this.props.requestCatch(e);
		}
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

    submitEdit: function(){

    },

	ChangeText:function( rowID,value){
		this.state.text[rowID]= value;
		// console.log(this.state.text);
		this.setState({
    		showFlag:!this.state.showFlag,
    	});
	},

    onBlur:function(rowID){
    	var showValue = null;
		// console.log('==onBlur='+this.state.text);
		if(this.state.text!=null&&this.state.text[rowID]!=undefined&&this.state.text[rowID]!='')
			showValue=this.props.filterMoney(this.state.text[rowID]);
    	this.state.text[rowID]= showValue;
		this.setState({
    		showFlag:!this.state.showFlag,
    	});
    },
    onFocus:function(rowID){
    	var showValue = null;
		// console.log('==onFocus='+this.state.text);
		if(this.state.text!=null&&this.state.text[rowID]!=undefined&&this.state.text[rowID]!='')
			showValue=this.state.text[rowID].replace(/\,/g, '');
    	this.state.text[rowID]= showValue;
		this.setState({
    		showFlag:!this.state.showFlag,
    	});
    },

	render: function() {

		var choosedLiseView = null;
		if(!this.state.doRenderScene)
			return this._renderPlaceholderView();

		var refreshText = this.state.fetchForbidden === true ? 
			'您还未登录，登录后点击此处刷新数据' : 
			'暂无符合条件的数据，点击此处重新载入';

		var refreshView = (this.state.loaded || this.state.fetchForbidden) && this.data.length === 0 ?
			this.props.getListRefreshView(refreshText, this.pullToRefresh) : 
			null;

		var SIStyleIOS = Global.os === 'ios' ? Global.styles.TOOL_BAR.SEARCH_INPUT_IOS : {};
		return (
			<View style={[Global.styles.CONTAINER]}>
				<View style={styles.paddingPlace} />
				<ScrollView style={styles.sv} refreshControl={this.props.getRefreshControl(this.state.isRefreshing,this.pullToRefresh)}>
					<View style={Global.styles.PLACEHOLDER20} />
					{refreshView}
					<ListView 
						style={styles.list}
						key={this.data}  
						dataSource={this.state.dataSource} 
						renderRow={this.renderItem} />
			    </ScrollView>
				<View style={{flex: 1, flexDirection: 'row', margin: 10,position:'absolute',bottom:10,width: Global.getScreen().width-20 ,}}>
					<TouchableOpacity 
						style={[Global.styles.CENTER, {height: 40, flex: 1, backgroundColor: Global.colors.IOS_BLUE, borderRadius: 3,}]} 
						onPress={this.save}>
			    		<Text style={{color: '#ffffff',}}>保存</Text>
			    	</TouchableOpacity>
			    	<View style={{flex: 0.05}}></View>
			    	<TouchableOpacity 
			    		style={[Global.styles.CENTER, {height: 40, flex: 1, backgroundColor: Global.colors.IOS_BLUE, borderRadius: 3,}]} 
			    		onPress={()=>{this.props.navigator.pop();}}>
			    		<Text style={{color: '#ffffff',}}>取消</Text>
			    	</TouchableOpacity>
				</View>					    
			    <View style={styles.paddingPlace} />
				<NavBar 
					navigator={this.props.navigator} 
					route={this.props.route}
					rightButtons={(
						<View style={[Global.styles.NAV_BAR.BUTTON_CONTAINER, Global.styles.NAV_BAR.RIGHT_BUTTONS]}>
							<TouchableOpacity style={[Global.styles.NAV_BAR.BUTTON]} onPress={()=>{this.refresh();}} >
								<Text style={{color: Global.colors.IOS_BLUE,}}>刷新</Text>
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
			<View style={[styles.row, Global.styles.CENTER]}>
				{topLine}
				<View style={[styles.item, Global.styles.CENTER,  ]} >
					<Text style={{flex: 1, paddingLeft: 10, fontSize: 15,}}>姓名：{item.name}</Text>
					<Text style={{flex: 1,paddingRight: 5, fontSize: 15,textAlign:'right',}}>金额:</Text>
					<View style={styles.rowInputHolder} >
						<TextInput style={styles.rowInput} 
						     value={this.state.text[rowID]}
						    onChangeText={(value) => {this.ChangeText(rowID,value);}}
						     onFocus={()=>{this.onFocus(rowID);}}
						     onBlur={()=>{this.onBlur(rowID);}}
						     placeholder={'0.00'}
							 keyboardType='numeric' />
					</View>
				</View>
				{bottomLine}
			</View>
		);
	},

	_renderPlaceholderView: function(){
		return (
			<NavBar 
					navigator={this.props.navigator} 
					route={this.props.route}
					rightButtons={(
						<View style={[Global.styles.NAV_BAR.BUTTON_CONTAINER, Global.styles.NAV_BAR.RIGHT_BUTTONS]}>
							<TouchableOpacity style={[Global.styles.NAV_BAR.BUTTON]} onPress={()=>{this.refresh();}} >
								<Text style={{color: Global.colors.IOS_BLUE,}}>刷新</Text>
							</TouchableOpacity>
						</View>
				)} />
		);
	},
	
});

var styles = StyleSheet.create({
	container: {
		justifyContent:'center',	/*主轴对齐方式*/
		alignItems: 'center',
		flex: 1,
		backgroundColor: Global.colors.IOS_BG,
	},
	sv: {
		flex:1,
		
	},
	paddingPlace: {
		height: Global.NBPadding ,
	},

	list: {
		backgroundColor: 'white',
	},
	row: {
		flex: 1,
	},
	
	rowItem: {
		width: Global.getScreen().width,
        flexDirection: 'row',
        paddingLeft: 20,
        paddingRight: 10,
		height: 50,
	},

	item: {
		flex:1,
		flexDirection:'row',
		width: Global.getScreen().width ,
		height:50,
        paddingLeft: 20,
        paddingRight: 20,
	},

	rowInputHolder: {
		flex: 1, 
		marginLeft: 10, 
		flexDirection: 'row', 
		borderWidth: 1 / Global.pixelRatio, 
		borderColor: Global.colors.IOS_SEP_LINE, 
		borderRadius: 3,
	},
	rowInput: {
		flex: 1, 
		height: 35, 
		borderWidth: 0, 
		textAlign: 'right', 
		paddingLeft: 10, 
		paddingRight: 10, 
		backgroundColor: 'transparent'
	},

	
});

module.exports = UtilsHoc(FilterMoneyHoc(EmployeeList));
