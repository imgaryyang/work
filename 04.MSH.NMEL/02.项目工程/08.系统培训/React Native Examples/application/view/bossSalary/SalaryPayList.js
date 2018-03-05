'use strict';

var Checkbox = require('../lib/Checkbox');
var SalaryInfoList = require('./SalaryInfoList');
// var PayDetail = require('./PayDetail');
var ChooseMonth = require('./ChooseMonth');
var React = require('react-native');
var NavBar = require('../NavBar');
var Icon = require('react-native-vector-icons/Ionicons');
var Global = require('../../Global');
var UtilsMixin = require('../lib/UtilsMixin');
var FilterMixin = require('../../filter/FilterMixin');
var TopGridMenu = require('../lib/TopGridMenu');
var Cashier = require('../lib/Cashier');
var AccountAction = require('../actions/AccountAction');


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

/*基本思路：1、点击复选框时，salaryPayItems增加一个，金额默认为薪酬设置信息的税后薪酬
			2、如果修改了金额，textValues数组增加一个对象，包括employeeid，value，employeename
			3、最后点击支付按钮时，循环查询textValue数组中是否有该employee的信息，如果有修改salayrPaytems中的actualAmt
			4、修改后，查询是否有actAmt任然为0 ，如果有报错。*/
var FIND_URL = 'salaryInfo/findByDate';
var GET_SEQUENCE ='sequence/next';
var KEEP_ACCT_URL = 'http://182.48.115.38:8081/jeesite/reqprocess/forBalanceChange';

var SalaryPayList = React.createClass({

	mixins: [UtilsMixin, FilterMixin],

	data: [],
	salaryPayItems: [],
	textValues:[],/*textInput输入数组*/
	payElcAcctDetails:[],/*调用账户管理系统的数据*/
	payeeElcAcctDetails:[],
	item: null,
	rowID: null,
	payTotal:null,
	
	getInitialState: function() {
		
		var ds = new ListView.DataSource({
			rowHasChanged: (row1, row2) => row1 !== row2,
		});
		return {
			doRenderScene: false,
			dataSource: ds.cloneWithRows(this._genRows({})),
			fetchForbidden: false,
			// choosedLise: 0,/*默认选择未支付*/
			month: null,/*默认选择当前月份*/
			value: null,/*用于默认显示输入框中员工薪资*/
			text:[],
			refreshCheckbox:false
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
			this.fetchData();
			// this.setState({doRenderScene: true})	
		});
	},
	pay: async function(acctNo) {

		console.log('ConfirmPay!!!!');
		console.log(this.salaryPayItems);
		this.showLoading();
		var SALARY_PAY_URL = 'salaryDetail/pay';
		try {
			let responseData = await this.request( Global.host + SALARY_PAY_URL, {
				body: JSON.stringify({
					mobile: Global.USER_LOGIN_INFO.mobile,
					params: this.salaryPayItems,
					accountNum: acctNo,
					month:this.state.month,
					id:1,
				}),
			});
			 if(responseData.status == 'success' && responseData.body != undefined){
               AccountAction.updateAccount(responseData.body);
            }
			// this.props.refreshPayList.call();
			// this.props.navigator.popToRoute(this.props.backRoute); 
		} catch (e) {
			this.requestCatch(e);
		}

		/*企业账户金额减少，员工账户金额增加*/

		this.hideLoading();

	},
	
	afterPay: function() {
		this.refreshPayList.call();
		this.props.navigator.popToRoute(this.props.route);
		
	},
	fetchData: async function(id) {
		this.salaryPayItems = [] ;
		this.textValues = [] ;
		this.setState({
				text: [],
				});

		this.showLoading();
		// console.log('NNNNNNNNNNNN');
		// console.log(this.state.refreshCheckbox);
		try {
			let responseData = await this.request(Global.host + FIND_URL, {
				body: JSON.stringify({
					companId:Global.USER_LOGIN_INFO.company.id,
					date:this.state.month,
				})
			});
			this.hideLoading();
			this.data = responseData.body;
				this.data = responseData.body.unpayList;
				this.setState({doRenderScene: true});
				/*未发放*/
				this.setState({
					dataSource: this.state.dataSource.cloneWithRows(responseData.body.unpayList),
					isRefreshing: false,
					loaded: true,
					// choosedLise:0,
					month: responseData.body.payDate,
				});
				this.setState({refreshCheckbox:false});
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
	
	/**
	* 组件接收参数变化
	*/
	componentWillReceiveProps: function(props) {
		
	},

	/*支付*/
	next : function(title, component, hideNavBar) {
		var hh=true;
		this.payTotal=null;
		this.payElcAcctDetails=[];
		this.payeeElcAcctDetails=[];
		if(this.salaryPayItems.length<=0){
			Alert.alert(
            '提示',
            '请至少选择一位员工！',
            [
            	{text: '确定', },
            ]
        );
			hh=false;
		}
		/*金额为0 不可支付*/
		for( var ii=0 ; ii<this.salaryPayItems.length ; ii++){
			var emplyees = this.salaryPayItems.slice( ii, parseInt( ii ) + 1 );
			var employee = emplyees[0];
			console.log(' ID:=====Id:====='+ employee.actualAmt);

			/*找到该员工的textinput的值，置换*/
			for(var jj=0;jj<this.textValues.length; jj++){
				var texts = this.textValues.slice( jj, parseInt( jj ) + 1 );
				var text = texts[0];
				/*如果金额经过了修改，则*/
				if(employee.employee==text.employeeid){
					this.salaryPayItems.splice(ii, 1,
						{
							amt1: employee.amt1,
							amt2: employee.amt2,
							amt3: employee.amt3,
							amt4: employee.amt4,
							amt5: employee.amt5,
							amt6: employee.amt6,
							actualAmt: text.actualAmt,
							memo1: employee.memo1,
							memo2: employee.memo2,
							employee: employee.employee,
							employeeName: employee.employeeName,
							employeeBankcard: employee.employeeBankcard,
							company: employee.company,
							companyName: employee.companyName
						});
				}
			}
		}
		for( var ii=0 ; ii<this.salaryPayItems.length ; ii++){
			var emplyees = this.salaryPayItems.slice( ii, parseInt( ii ) + 1 );
			var employee = emplyees[0];
			console.log('hhahhhhh');
			console.log(employee.actualAmt);
				/*赋值完成后*/	
			if ( parseFloat(employee.actualAmt)<= 0 ){
					Alert.alert(
					'提示',
		            '支付员工薪酬不可以小于0元！',
		            [
		            	{text: '确定'},
		            ]
					);
					hh=false;
				}
				
			var re = /^[1-9][0-9]*(.[0-9]{1,2})?$/;
			if(!re.test(employee.actualAmt)){
				// console.log('hhahah 我进来了呢！！！');
				Alert.alert(
					'提示',
		            '输入金额格式不正确！',
		            [
		            	{text: '确定'},
		            ]
					);
					hh=false;
			}
			/*电子账户相关扣款*/
			// this.payeeElcAcctDetails.push({
			// 	channelID:'CH20160411000001',
			// 	channelCust:'111111',
			// 	acctType:'0001',
			// 	acctNo:employee.employeeBankcard,
			// 	tranType:'T005',A001	注册
			// 					A002	单开户
			// 					T001	充值
			// 					T002	提现
			// 					T003	消费
			// 					T004	退货
			// 					T005	转账
			// 					T006	冲正
								
			// 	cdFlag:0, /*1 支 0：收*/
			// 	tranAmt:employee.actualAmt,
			// });
			this.payTotal+=parseFloat(employee.actualAmt);	
		}
		console.log('this.pay===' );
		console.log(this.payTotal);
		/*电子账户扣款*/
		this.payElcAcctDetails.push({
			channelID:Global.channelID,
				channelCust:Global.USER_LOGIN_INFO.custCode,
				acctType:'0001',
				acctNo:'',
				tranType:'T005',/*A001	注册
								A002	单开户
								T001	充值
								T002	提现
								T003	消费
								T004	退货
								T005	转账
								T006	冲正
								*/
				cdFlag:1, /*1 支 0：收*/
				tranAmt:this.payTotal,
		});
		if( hh === true){
			this.showLoading();
			// console.log('Pay_onpress');
			console.log('Cashier');
			console.log(this.payTotal);
	    	var nav = this.props.navigator ? this.props.navigator : this.props.rootNavigator;
	        nav.push({
	        	title: title,
	            component: Cashier,
	            hideNavBar: hideNavBar ? hideNavBar : false,	            
	            passProps: {
	            	payeeElcAcctDetails:this.payeeElcAcctDetails,
	            	payElcAcctDetails:this.payElcAcctDetails,
            		payAmt:this.payTotal,
            		payDesc:'薪酬支付',
            		pay: this.pay,
            		afterPay:this.afterPay,
            	},
	        });
	        this.hideLoading();
		}
		
    },
	/**
	* 调用刷新
	*/
	refresh: function() {
		this.fetchData();
		this.setState({
				refreshCheckbox:true,
				});
		
	},
	pullToRefresh: function() {
		 this.setState({
		 	isRefreshing: true,
		 	refreshCheckbox:true,
		 	text:[],
		 });
		 this.fetchData();
	},

	/*输入薪资金额 id:员工id，value：输入金额*/
	ChangeText:function( item,value,rowID){
		console.log('-------------ChangeText-------------');

		/*校验金额*/
		
		var find = 0;
		
		// console.log('我进到2号门了');
		for( var ii=0 ; ii<this.textValues.length ; ii++){
		var texts = this.textValues.slice( ii, parseInt( ii ) + 1 );
		var text = texts[0];
		// console.log(' ID:=====Id:====='+ ID +' '+ item.employeeID);
		if (text.employeeid == item.id )
			{
				find = 1;	
				this.textValues.splice(ii, 1,
					{
						employeeid: item.id,
						emplyeeName:item.name,
						actualAmt: value
					});
			}
		}

		if( find == 0 ){
			this.textValues.push(
			{
				employeeid: item.id,
				emplyeeName:item.name,
				actualAmt: value
			});
		}

		this.state.text[rowID]= value;
		this.setState({
    		showFlag:true,
    	});
    	// console.log(showValue);
    	this.setState({
    		showFlag:false,
    	});
		console.log('ChangeText——————this.textValues====');
		console.log(this.textValues);	
	},

	/*点击复选框*/
	onCheck: function (item){
		var actualAmtTemp = 0.00;

		/*如果有薪酬信息*/
		if(item.salaryInfo)
		{
			this.salaryPayItems.push({
				amt1: item.salaryInfo.amt1,
				amt2: item.salaryInfo.amt2,
				amt3: item.salaryInfo.amt3,
				amt4: item.salaryInfo.amt4,
				amt5: item.salaryInfo.amt5,
				amt6: item.salaryInfo.amt6,
				actualAmt: item.salaryInfo.amt6,
				memo1: item.salaryInfo.memo1,
				memo2: item.salaryInfo.memo2,
				employee: item.id,
				employeeName: item.name,
				employeeBankcard: item.bankcard,
				company: item.ownerOrg,
				companyName: Global.USER_LOGIN_INFO.company.name
			});
		}else{
			/*没有薪酬信息*/
			this.salaryPayItems.push({
				amt1: 0.00,
				amt2: 0.00,
				amt3: 0.00,
				amt4: 0.00,
				amt5: 0.00,
				amt6: 0.00,
				actualAmt: actualAmtTemp,
				memo1: null,
				memo2: null,
				employee: item.id,
				employeeName: item.name,
				employeeBankcard: item.bankcard,
				company: item.ownerOrg,
				companyName: Global.USER_LOGIN_INFO.company.name
			});
		}	
		console.log('onCheck——————salaryPayItems');
		console.log(this.salaryPayItems);
	},

	/*取消复选框*/		
	unCheck: function(item){
		// console.log(' unCheck=====Id:====='+ ID);

		for( var ii=0 ; ii<this.salaryPayItems.length ; ii++){
			var emplyees = this.salaryPayItems.slice( ii, parseInt( ii ) + 1 );
			var employee = emplyees[0];
			// console.log(' ID:=====Id:====='+ ID +' '+ item.employeeID);
			if (employee.employee == item.id )
				{	
					this.salaryPayItems.splice(ii, 1);	
				}

			}
		console.log('unCheck————salaryPayItems');	
		console.log(this.salaryPayItems);
	},

	chooseMonth: function(title, component, hideNavBar){
		console.log('chooseMonth:' );

		var nav = this.props.navigator ? this.props.navigator : this.props.rootNavigator;
	        nav.push({
	        	title: title,
	            component: component,
	            hideNavBar: hideNavBar ? hideNavBar : false,	            
	            passProps: {
            		month:this.state.month,
            		fresh:this.fresh,
            	},
	        });

	},
	fresh:function(hh){
		console.log('before' + this.state.month);
		// this.setState({
		// 			month: hh,
		// 		});
		this.state.month=hh;
		console.log('after' + this.state.month);
		// this.setState({month: '2016-11'});
		this.fetchData();
		// this.fetchData(this.state.choosedLise);
	},

	refreshPayList: function() {
       
        this.fetchData();
        this.setState({isRefreshing: true});
        // this.salaryPayItems=[];
    },
    submitEdit: function(){

    },
    onBlur:function(item,rowID){
    	var showValue = null;
    	/*找到该用户的输入信息*/
    	for( var ii=0 ; ii<this.textValues.length ; ii++){
		var texts = this.textValues.slice( ii, parseInt( ii ) + 1 );
		var text = texts[0];
		// console.log(' ID:=====Id:====='+ ID +' '+ item.employeeID);
		if (text.employeeid == item.id )
			{	
				showValue = this.filterMoney(text.actualAmt);
			}
		}
    	this.state.text[rowID]= showValue;
    	this.setState({
    		showFlag:true,
    	});
    	console.log('onBlur_showValue===');
    	console.log(showValue);
    	this.setState({
    		showFlag:false,
    	});


    },
    onFocus:function(item,rowID){
    	console.log('我进到onFocus中了！！！！');
    	console.log(this.state.text[rowID]);
    	var showValue = null;
    	/*找到该用户的输入信息*/
    	for( var ii=0 ; ii<this.textValues.length ; ii++){
		var texts = this.textValues.slice( ii, parseInt( ii ) + 1 );
		var text = texts[0];
		// console.log(' ID:=====Id:====='+ ID +' '+ item.employeeID);
		if (text.employeeid == item.id )
			{
				showValue = text.actualAmt;
			}
		}
    	this.state.text[rowID]= showValue;
    	this.setState({
    		showFlag:true,
    	});
    	console.log('onBlur_showValue===');
    	console.log(showValue);
    	this.setState({
    		showFlag:false,
    	});
    	// console.log('text_before'+ this.state.text);
    	// console.log('text_before2'+ this.state.defaultValue);
    	// this.setState({text: 999});
    	// console.log('text_after'+ this.state.text);
    },

	render: function() {

		var choosedLiseView = null;
		if(!this.state.doRenderScene)
			return this._renderPlaceholderView();

		var refreshText = this.state.fetchForbidden === true ? 
			'您还未登录，登录后点击此处刷新数据' : 
			'暂无符合条件的数据，点击此处重新载入';

		var refreshView = (this.state.loaded || this.state.fetchForbidden) && this.data.length === 0 ?
			this.getListRefreshView(refreshText, this.pullToRefresh) : 
			null;

		var showDate=String(this.state.month);
		var yyyy = showDate.substr(0,4);
		var mmmm=parseInt(showDate.substr(5,2))+1;
		var showDate22 = yyyy + '年' + mmmm + '月';

		var SIStyleIOS = Global.os === 'ios' ? Global.styles.TOOL_BAR.SEARCH_INPUT_IOS : {};
		return (
			<View style={[Global.styles.CONTAINER]}>
				<View style={styles.paddingPlace} />
				<ScrollView style={styles.sv} refreshControl={this.getRefreshControl(this.pullToRefresh)}>
					<View>
						<View style={Global.styles.PLACEHOLDER20} />
						<View style={Global.styles.FULL_SEP_LINE} />
						<TouchableOpacity style={[Global.styles.CENTER, {flex: 1, backgroundColor: 'white', padding: 10, height: 40}]} onPress={()=>{this.chooseMonth('选择月份',ChooseMonth)}} >
							<Text style={{color: Global.colors.IOS_BLUE,}}>{showDate22}</Text>
						</TouchableOpacity>
						<View style={Global.styles.FULL_SEP_LINE} />
						<View style={Global.styles.PLACEHOLDER20} />
					</View>
					{refreshView}
					<ListView 
						style={styles.list}
						key={this.data}  
						dataSource={this.state.dataSource} 
						renderRow={this.renderItem} />
			    </ScrollView>
			    <View style={styles.paddingPlace} />
			    <View style={styles.PayButton}>
			    	<TouchableOpacity style={styles.PayButton} onPress={()=>{this.next('支付',Cashier)}}>
				    	<Text style={{color: '#ffffff',}}>支付</Text>
				    </TouchableOpacity>
				</View>
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
				<View style={[styles.rowItem, Global.styles.CENTER]} >
					<Text style={[styles.itemtext, styles.rowName]}>{item.name}</Text>
					<Text style={[styles.itemtext, styles.rowCardnum]}>{'****' + this.filterCardNumLast4(item.bankcard)}</Text>
					<View style={[Global.styles.CENTER, styles.rowInputHolder]}>
						<TextInput
						    style={[styles.rowInput]}
						     value={this.state.text[rowID]}
						    onChangeText={(value) => {this.ChangeText(item,value,rowID);}}
						     onFocus={()=>{this.onFocus(item,rowID);}}
						     onBlur={()=>{this.onBlur(item,rowID);}}
						     placeholder={String((item.showMoney).toFixed(2))}
						    keyboardType='numeric' />
					
			    	</View>
			    	<View style={[styles.rowCheckboxHolder]} >
						<Checkbox color={Global.colors.IOS_BLUE} size={28}
							refresh={this.state.refreshCheckbox}
							onCheck={()=>{this.onCheck(item);}}  
							onUncheck={()=>{this.unCheck(item);}}/>
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

	click:{
		flex: 1,
	},
	onClicked: {
	},

	list: {
		backgroundColor: 'white',
	},
	row: {
		flex: 1,
		//flexDirection:'row',
	},
	rowItem: {
		width: Global.getScreen().width,
        flexDirection: 'row',
        paddingLeft: 20,
        paddingRight: 10,
		height: 50,
	},

	rowName: {
		width: 80, 
		fontSize: 13,
	},
	rowCardnum: {
		width: 80, 
		fontSize: 12, 
		textAlign: 'center',
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

	rowCheckboxHolder: {
		width: 30, 
		marginLeft: 10,
	},

	itemtext:{
	},

	PayButton: {
		position:'absolute',
		bottom:0,
		width:Global.getScreen().width,
		alignItems: 'center', 
		justifyContent: 'center',
		height: 50, 
		flex: 1, 
		backgroundColor: Global.colors.IOS_BLUE, 
		// borderRadius: 10,
	},
	
});

module.exports =SalaryPayList;
