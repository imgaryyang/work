var React = require('react-native');
var NavBar = require('../NavBar');
var Icon = require('react-native-vector-icons/Ionicons');
var Global = require('../../Global');
var loanEdit = require('./LoanEdit');
var Cashier = require('../lib/Cashier');
var UtilsMixin = require('../lib/UtilsMixin');
var FilterMixin = require('../../filter/FilterMixin');
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
	Alert
}=React;
var FIND_URL =  'loan/findOne';
var FIND_LEADER_URL = 'person/findOne';
var LOAN_PAY_URL =  'loan/pay';
var LoanDetail = React.createClass({
	mixins: [UtilsMixin,FilterMixin],
	loans:[],
	payElcAcctDetails:[],/*调用账户管理系统的数据*/
	getInitialState: function() {
		return {
			doRenderScene: false,
			loaded: false,
			loan: {
				loanname: '',
				loanId: this.props.loanId,
				loanamt: 0,
				reason: '',
				custId : '',
			},
			div : 1
			

		};
	},

    componentDidMount: function() {
		InteractionManager.runAfterInteractions(() => {
			this.setState({doRenderScene: true});
			this.fetchData();

		});
		

	},
	findLeaderName: async function(leader) {
		if (leader != null) {
			try {
				let responseData = await this.request( Global.host +FIND_LEADER_URL, {
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
	
	fetchData:async function() {
		this.loans=[];
		this.showLoading();
		try {
			let responseData = await this.request( Global.host +FIND_URL, {
			body: JSON.stringify({
				loanId: this.props.loanId,
			}),
		});
			responseData.body.leader = await this.findLeaderName(responseData.body.leader);
			responseData.body.time1 = await this.dateFmt(responseData.body.time1);
			responseData.body.time2 = await this.dateFmt(responseData.body.time2);
			responseData.body.time3= await this.dateFmt(responseData.body.time3);
			switch (responseData.body.state) {
				case '0':
					responseData.body.state = '未提交';
					break;
				case '1':
					responseData.body.state = '已提交';
					break;
				case '2':
					responseData.body.state = '通过';
					break;
				case '3':
					responseData.body.state = '驳回';
					break;
				case '4':
					responseData.body.state = '结束';
					break;
			}
			switch(responseData.body.loanname){
				case '0':
					responseData.body.loanname ='日常借款';
					break;
				case '1' :
					responseData.body.loanname ='差旅借款';
					break;
				default:
					responseData.body.loanname ='日常借款';
			}
			this.hideLoading();
			this.setState({
				loan: {
					loanname: responseData.body.loanname,
					loanId: responseData.body.loanId,
					loanamt: responseData.body.loanamt,
					reason: responseData.body.reason,
					custId: responseData.body.custId,
					state: responseData.body.state,
					leader : responseData.body.leader,
					time1 : responseData.body.time1,
					time2 : responseData.body.time2,
					time3 : responseData.body.time3,
					// flag : responseData.body.flag,
					account1:responseData.body.account1,
				},
				
				loaded: true,
			});
			this.loans.push({
                    loanId: responseData.body.loanId,
                    loanamt: responseData.body.loanamt,
                    custId: responseData.body.custId
                });
		}catch(e) {
			this.requestCatch(e);
		}
		
	},
	dateFmt :async function (date) {
		if(date != null && date != undefined){
				var date = new Date(date);
				var hours = (date.getHours() > 9) ? date.getHours() : '0' + date.getHours();
				var minute = (date.getMinutes() > 9) ? date.getMinutes() : '0' + date.getMinutes();
				var year = date.getFullYear();
				var month = (date.getMonth() + 1) > 9 ? (date.getMonth() + 1) : '0' + (date.getMonth() + 1);
				var day = date.getDate()>9?(date.getDate()):('0'+date.getDate());
				return year + '-' + month + '-' + day + ' ' + hours + ':' + minute ;
		}
		return null;
	},
	nextpay:function(){

		this.payElcAcctDetails=[];
		this.payElcAcctDetails.push({
            channelID:Global.channelID,
                channelCust:Global.USER_LOGIN_INFO.custCode,
                acctType:'0001',
                acctNo:'',
                tranType:'T005',/*A001  注册
                                A002    单开户
                                T001    充值
                                T002    提现
                                T003    消费
                                T004    退货
                                T005    转账
                                T006    冲正
                                */
                cdFlag:1, /*1 支 0：收*/
                tranAmt:this.state.loan.loanamt,
        });

        	this.props.navigator.push({
        		title: "报销借款发放",
                component: Cashier,
                passProps: {
                    payAmt:this.state.loan.loanamt,
                    payDesc:'报销借款发放',
                    pay:this.pay,
                    afterPay:this.afterPay,
                    payElcAcctDetails:this.payElcAcctDetails,
                    // refreshPayList:this.refreshPayList,
                    // backRoute: this.props.route,
                    // payinfo : '支付报销借款共：'+this.filterMoney(amt)+'元'
                },
        	});
		// let count = this.expenses.length+this.loans.length;
     //    this.expenses=[];
     //    this.loans=[];
     //    this.loans.push(this.props.loan);
    	// this.props.navigator.push({
    	// 	title: "报销借款发放",
     //        component: payDetail,
     //        passProps: {
     //            loans: this.loans,
     //            expenses:this.expenses,
     //            refreshPayList:this.props.refreshPayList,
     //            backRoute: this.props.backRoute,
     //        },
    	// });
		
	},
	pay: async function(acctNo) {
        this.showLoading();
        
        try {
            let responseData1 = await this.request(Global.host + LOAN_PAY_URL, {
                body: JSON.stringify({
                    mobile: Global.USER_LOGIN_INFO.mobile,
                    params: this.loans,
                    accountNum: acctNo,
                }),
            });
            if(responseData1.status == 'success' && responseData1.body != undefined){
               AccountAction.updateAccount(responseData1.body);
            }

        } catch (e) {
            this.requestCatch(e);
        }
        this.hideLoading();

    },
    afterPay: function() {
        this.props.refreshPayList();
        // console.log(this.props.backRoute);
        this.props.navigator.popToRoute(this.props.backRoute);
        
    },
    refreshPayList: function() {
        this.setState({refreshCheckbox:true});
        
        this.fetchData();
    },
	changeView (s){
		this.setState({div : s});
	},
	render(){
		if(!this.state.doRenderScene)
			return this._renderPlaceholderView();
		// var clickStyle1 = this.state.div==1 ? [Global.styles.CENTER,Global.styles.BORDER,{flex:1,height:40,backgroundColor: Global.colors.IOS_BLUE}] : [Global.styles.CENTER,Global.styles.BORDER,{flex:1,height:40,backgroundColor: '#FFFFFF'}];
		// var clickStyle2 = this.state.div==2 ? [Global.styles.CENTER,Global.styles.BORDER,{flex:1,height:40,backgroundColor: Global.colors.IOS_BLUE}] : [Global.styles.CENTER,Global.styles.BORDER,{flex:1,height:40,backgroundColor: '#FFFFFF'}];
		var clickStyle1 = this.state.div==1 ? [Global.styles.CENTER,{flex:1,height:40,borderBottomWidth:2,borderBottomColor:Global.colors.IOS_BLUE,backgroundColor:'#FFFFFF'}] : [Global.styles.CENTER,{flex:1,height:40,backgroundColor:'#FFFFFF',borderBottomWidth:1/Global.pixelRatio,borderBottomColor:Global.colors.IOS_SEP_LINE}];
		var clickStyle2 = this.state.div==2 ? [Global.styles.CENTER,{flex:1,height:40,borderBottomWidth:2,borderBottomColor:Global.colors.IOS_BLUE,backgroundColor:'#FFFFFF'}] : [Global.styles.CENTER,{flex:1,height:40,backgroundColor:'#FFFFFF',borderBottomWidth:1/Global.pixelRatio,borderBottomColor:Global.colors.IOS_SEP_LINE}];
		var clickStyle3 = this.state.div==1 ? {color:Global.colors.IOS_BLUE}:null;
		var clickStyle4 = this.state.div==2 ? {color:Global.colors.IOS_BLUE}:null;
		var state2 = this.state.loan.state=='通过'?(
			<View style={Global.styles.CENTER}>
				<View style={[styles.arrowPortrait,Global.styles.CENTER]}>
					<Icon style={{color:'green',textAlign:'center'}} name='arrow-down-a' size={27} />
				</View>
				<View style={[{flexDirection:'row'},Global.styles.CENTER]}>
					<View style={[styles.itemPortrait,Global.styles.CENTER,Global.styles.BORDER,{backgroundColor:'green'}]}>
							<Icon style={{color:'#ffffff',textAlign:'center'}} name='android-done' size={15} />
					</View>
					<View style={{paddingLeft:40}}>
						<Text style={{fontSize:15,textAlign:'left',width:150}}>{this.state.loan.leader}同意报销申请</Text>
						<Text style={{fontSize:10,textAlign:'left',width:150}}>{this.state.loan.time2}</Text>
					</View>
				</View>
			</View>):null;
		var state4 = this.state.loan.state =='结束'?(
					<View style={Global.styles.CENTER}>
						<View style={[styles.arrowPortrait,Global.styles.CENTER]}>
							<Icon style={{color:'green',textAlign:'center'}} name='arrow-down-a' size={27} />
						</View>
						<View style={[{flexDirection:'row'},Global.styles.CENTER]}>
							<View style={[styles.itemPortrait,Global.styles.CENTER,Global.styles.BORDER,{backgroundColor:'green'}]}>
								<Icon style={{color:'#ffffff',textAlign:'center'}} name='android-done' size={15} />
							</View>
							<View style={{paddingLeft:40}}>
								<Text style={{fontSize:15,textAlign:'left',width:150}}>{this.state.loan.leader}同意报销申请</Text>
								<Text style={{fontSize:10,textAlign:'left',width:150}}>{this.state.loan.time2}</Text>
							</View>
						</View>
						<View style={[styles.arrowPortrait,Global.styles.CENTER]}>
							<Icon style={{color:'green',textAlign:'center'}} name='arrow-down-a' size={27} />
						</View>
						<View style={[{flexDirection:'row'},Global.styles.CENTER]}>
							<View style={[styles.itemPortrait,Global.styles.CENTER,Global.styles.BORDER,{backgroundColor:'green'}]}>
								<Icon style={{color:'#ffffff',textAlign:'center'}} name='stop' size={10} />
							</View>
							<View style={{paddingLeft:40}}>
								<Text style={{fontSize:15,textAlign:'left',width:150}}>报销结束</Text>
								<Text style={{fontSize:10,textAlign:'left',width:150}}>{this.state.loan.time3}</Text>
							</View>
						</View>
					</View>):null;
		var ex_view = this.state.div==1 ?(
				<View style={[Global.styles.BORDER,{flex:1,flexDirection:'row',backgroundColor:'#FFFFFF'}]}>
					<View style={{flex:1,flexDirection:'column',padding:15}}>
						<Text style={styles.text}>事由：{this.state.loan.reason}</Text>
						<Text style={styles.text}>账户尾号：{this.filterCardNumLast4(this.state.loan.account1)}</Text>
						<Text style={styles.text}>提交时间：{this.state.loan.time1}</Text>
						
					</View>
				</View>):
				<View style={[Global.styles.BORDER,{flex:1,backgroundColor:'#FFFFFF',padding:15},Global.styles.CENTER]}>
					<View style={[{flexDirection:'row'},Global.styles.CENTER]}>
						<View style={[styles.itemPortrait,Global.styles.CENTER,Global.styles.BORDER,{backgroundColor:'green'}]}>
							<Icon style={{color:'#ffffff',textAlign:'center'}} name='ios-play' size={15} />
						</View>
						<View style={{paddingLeft:40}}>
							<Text style={{fontSize:15,textAlign:'left',width:150}}>{this.state.loan.custId.name}提交给{this.state.loan.leader}</Text>
							<Text style={{fontSize:10,textAlign:'left',width:150}}>{this.state.loan.time1}</Text>
						</View>
					</View>
					{state2}
					{state4}
				</View>;

		return (
			<View style={styles.container}>
				<ScrollView style={styles.sv}>
					<View style={styles.placeholder} />
					<View style={Global.styles.FULL_SEP_LINE} />
					<View style={[{flex:1,flexDirection:'row',backgroundColor:'#FFFFFF',height:40,paddingTop:5}]}>
						<Text style={{textAlign:'center',fontSize:18,flex:1}} >{this.state.loan.loanname}</Text>
					</View>
					<View style={Global.styles.FULL_SEP_LINE} />
					<View style={[{flex:1,flexDirection:'row',backgroundColor:'#FFFFFF'}]}>
						<View style={[{flex:1,height:40,paddingTop:5}]}>
							<Text style={[{textAlign:'center',fontSize:18,}]}>{this.state.loan.custId.name}</Text>
						</View>
						<View style={[{flex:1,height:40,paddingTop:5,borderLeftWidth:1/Global.pixelRatio,borderColor:Global.colors.IOS_SEP_LINE}]}>
							<Text style={[{textAlign:'center',fontSize:18},]}>{this.state.loan.custId.dept}</Text>
						</View>
					</View>
					<View style={Global.styles.FULL_SEP_LINE} />
					<View style={{flex:1,flexDirection:'row',}}>
						<TouchableOpacity  style={clickStyle1} onPress={()=>this.changeView(1)}>
							<Text style={{color:Global.colors.ORANGE}}>￥{this.filterMoney(this.state.loan.loanamt)}</Text>
							<Text style={clickStyle3}>借款金额</Text>
						</TouchableOpacity>
						<TouchableOpacity style={clickStyle2} onPress={()=>this.changeView(2)}>
							<Text style={{color:Global.colors.ORANGE}}>{this.state.loan.state}</Text>
							<Text style={clickStyle4}>进度与审批</Text>
						</TouchableOpacity>
					</View>
					
					<View style={{height:20,flex:1,backgroundColor:Global.colors.IOS_GRAY_BG}}/>
					{ex_view}
					<View style={Global.styles.PLACEHOLDER20}/>
					{this.props.payFlag?
						<TouchableOpacity 
				    		style={[Global.styles.CENTER, {height: 40, flex: 1, backgroundColor: Global.colors.IOS_BLUE, borderRadius: 3,marginLeft: 20,marginRight:20}]} 
				    		onPress={()=>{this.nextpay()}}>
				    		<Text style={{color: '#ffffff'}}>发放</Text>
				    	</TouchableOpacity>
				    :null}
				    <View style={Global.styles.PLACEHOLDER40}/>
				</ScrollView>
			</View>);
	},
	_renderPlaceholderView: function() {
		return (
			<View style={[Global.styles.CONTAINER, styles.container]} ></View>
		);
	},
});
var styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Global.colors.IOS_GRAY_BG,
	},
	sv: {
		// paddingLeft: 20,
		// paddingRight: 20,
	},
	placeholder: {
		flex: 1,
		height: Global.NBPadding + 20,
		backgroundColor: Global.colors.IOS_GRAY_BG,
	},
	item: {
		width: Global.getScreen().width-40 ,
		backgroundColor: '#ffffff',
        flexDirection: 'row',
        borderBottomWidth: 0,
        borderLeftWidth: 0,
        borderRightWidth: 0,
        padding: 10,
        paddingLeft: 0,
        paddingRight: 20,
	},
	portrait: {
		width: 30,
		height: 30,
        borderRadius: 15,
        marginLeft: 20,
	},
	itemPortrait: {
		width: 25,
		height: 25,
        borderRadius: 12.5,
	},
	arrowPortrait :{
		marginTop : 10,
		marginBottom :10,
		backgroundColor:'#ffffff'
	},
	text : {
		flex: 1,
		marginLeft: 10,
		fontSize: 15
	}
});
module.exports = LoanDetail;