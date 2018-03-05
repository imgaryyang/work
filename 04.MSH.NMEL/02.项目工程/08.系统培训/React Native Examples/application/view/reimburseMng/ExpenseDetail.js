'use strict';
var React = require('react-native');
var NavBar = require('../NavBar');
var Icon = require('react-native-vector-icons/Ionicons');
var Global = require('../../Global');
var Cashier = require('../lib/Cashier');
// var payDetail = require('./PayDetail');
var UtilsMixin = require('../lib/UtilsMixin');
var FilterMixin = require('../../filter/FilterMixin');
var AccountAction = require('../actions/AccountAction');

var {
	StyleSheet,
	ScrollView,
	View,
	Text,
	Image,
	TouchableOpacity,
	InteractionManager,
	ListView
} = React;

var FIND_URL =  'expense/findOne';
var FIND_COST_URL ='cost/findIds';
var FIND_LEADER_URL =  'person/findOne';
var EXPENSE_PAY_URL =  'expense/pay';
var ExpenseDetail = React.createClass({
	mixins: [UtilsMixin,FilterMixin],
	expenses:[],
	payElcAcctDetails:[],/*调用账户管理系统的数据*/
	getInitialState: function() {
		var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
		return {
			doRenderScene: false,
			loaded: false,
			dataSource: ds.cloneWithRows(this._genRows({})),
			expense: {
				name: '',
				id: this.props.id,
				totalamt: 0,
				memo1: '',
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
	_genRows: function(pressData: {[key: number]: boolean}): Array<string> {
		var dataBlob = [];
		for (var ii = 0; ii <5; ii++) {
			var pressedText = pressData[ii] ? ' (pressed)' : '';
			dataBlob.push('Row ' + ii + pressedText);
		}
		return dataBlob;
	},
	findCost: async function() {
		this.showLoading();
		try {
			let responseData = await this.request(Global.host +FIND_COST_URL, {
				body: JSON.stringify({
					id: this.state.expense.id,
					custId: this.state.expense.custId.id
				}),
			});
			for (let i = 0; i < responseData.body.length; i++) {
				responseData.body[i].date = this.filterDateFmt(responseData.body[i].date);
			}
			this.hideLoading();
			this.data = responseData.body;
			this.setState({
				dataSource: this.state.dataSource.cloneWithRows(responseData.body),
			});
		} catch (e) {
			this.requestCatch(e);
		}
	},
	findLeaderName: async function(leader) {
		if (leader != null) {
			try {
				let responseData = await this.request(Global.host +FIND_LEADER_URL, {
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
	
	fetchData: async function() {
		this.expenses=[];
		this.showLoading();
		try {
			let responseData = await this.request(Global.host +FIND_URL, {
				body: JSON.stringify({
					id: this.props.id,
				}),
			});
			responseData.body.leader = await this.findLeaderName(responseData.body.leader);
			responseData.body.submittime =  this.filterDateFmt(responseData.body.submittime);
			responseData.body.time =  this.filterDateFmt(responseData.body.time);
			responseData.body.time2 =  this.filterDateFmt(responseData.body.time2);
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
			switch(responseData.body.name){
				case '0':
					responseData.body.name ='日常报销';
					break;
				case '1' :
					responseData.body.name ='差旅报销';
					break;
				default:
					responseData.body.name ='日常报销';
			}
			this.hideLoading();
			this.expenses.push({
                    id: responseData.body.id,
                    totalamt: responseData.body.totalamt,
                    custId: responseData.body.custId
                });
			// console.log(responseData)
			this.setState({
				expense: {
					name: responseData.body.name,
					id: responseData.body.id,
					totalamt: responseData.body.totalamt,
					memo1: responseData.body.memo1,
					custId: responseData.body.custId,
					allowance: responseData.body.allowance,
					state: responseData.body.state,
					leader: responseData.body.leader,
					submittime: responseData.body.submittime,
					time: responseData.body.time,
					time2: responseData.body.time2

				},
				loaded: true,
			});
			this.findCost();
		}catch(e) {
			this.requestCatch(e);
		}

	},
	pay: async function(acctNo) {
        this.showLoading();
        try {
            let responseData = await this.request(Global.host + EXPENSE_PAY_URL, {
                body: JSON.stringify({
                    mobile: Global.USER_LOGIN_INFO.mobile,
                    params: this.expenses,
                    accountNum: acctNo,
                }),
            });
            if(responseData.status == 'success' && responseData.body != undefined){
               AccountAction.updateAccount(responseData.body);
            }

        } catch (e) {
            this.requestCatch(e);
        }

        this.hideLoading();

    },
    afterPay: function() {
        this.props.refreshPayList();
        this.props.navigator.popToRoute(this.props.backRoute);
        
    },
    refreshPayList: function() {
        this.setState({refreshCheckbox:true});
        this.expenses=[];
        this.fetchData();
    },
	paynext:function(){
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
                tranAmt:this.state.expense.totalamt,
        });
        	this.props.navigator.push({
        		title: "报销借款发放",
                component: Cashier,
                passProps: {
                    payAmt:this.state.expense.totalamt,
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
     //    this.expenses.push(this.props.expense);
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
		var state2 = this.state.expense.state=='通过'?(
			<View style={Global.styles.CENTER}>
				<View style={[styles.arrowPortrait,Global.styles.CENTER]}>
					<Icon style={{color:'green',textAlign:'center'}} name='arrow-down-a' size={27} />
				</View>
				<View style={[{flexDirection:'row'},Global.styles.CENTER]}>
					<View style={[styles.itemPortrait,Global.styles.BORDER,{backgroundColor:'green'},Global.styles.CENTER]}>
							<Icon style={{color:'#ffffff',textAlign:'center'}} name='android-done' size={15} />
					</View>
					<View style={{paddingLeft:40}}>
						<Text style={{fontSize:15,textAlign:'left',width:150}}>{this.state.expense.leader}同意报销申请</Text>
						<Text style={{fontSize:10,textAlign:'left',width:150}}>{this.state.expense.time}</Text>
					</View>
				</View>
			</View>):null;
		var state4 = this.state.expense.state =='结束'?(
					<View style={Global.styles.CENTER}>
						<View style={[styles.arrowPortrait]}>
							<Icon style={{color:'green',textAlign:'center'}} name='arrow-down-a' size={27} />
						</View>
						<View style={[{flexDirection:'row'},Global.styles.CENTER]}>
							<View style={[styles.itemPortrait,Global.styles.BORDER,{backgroundColor:'green'},Global.styles.CENTER]}>
								<Icon style={{color:'#ffffff',textAlign:'center'}} name='android-done' size={15} />
							</View>
							<View style={{paddingLeft:40}}>
								<Text style={{fontSize:15,textAlign:'left',width:150}}>{this.state.expense.leader}同意报销申请</Text>
								<Text style={{fontSize:10,textAlign:'left',width:150}}>{this.state.expense.time}</Text>
							</View>
						</View>
						<View style={[styles.arrowPortrait]}>
							<Icon style={{color:'green',textAlign:'center'}} name='arrow-down-a' size={27} />
						</View>
						<View style={[{flexDirection:'row'},Global.styles.CENTER]}>
							<View style={[styles.itemPortrait,Global.styles.BORDER,{backgroundColor:'green'},Global.styles.CENTER]}>
								<Icon style={{color:'#ffffff',textAlign:'center'}} name='stop' size={10} />
							</View>
							<View style={{paddingLeft:40}}>
								<Text style={{fontSize:15,textAlign:'left',width:150}}>报销结束</Text>
								<Text style={{fontSize:10,textAlign:'left',width:150}}>{this.state.expense.time2}</Text>
							</View>
						</View>
					</View>):null;
		var ex_view = this.state.div==1 ?(<ListView
						key={this.data}
				        dataSource={this.state.dataSource}
				        renderRow={this.renderItem}
				        style={[styles.list,Global.styles.BORDER]} />):
				<View style={[Global.styles.BORDER,{flex:1,backgroundColor:'#FFFFFF',padding:15},Global.styles.CENTER]}>
					<View style={[{flexDirection:'row'},Global.styles.CENTER]}>
						<View style={[styles.itemPortrait,Global.styles.BORDER,{backgroundColor:'green'},Global.styles.CENTER]}>
							<Icon style={{color:'#ffffff',textAlign:'center'}} name='ios-play' size={15} />
						</View>
						<View style={{paddingLeft:40}}>
							<Text style={{fontSize:15,textAlign:'left',width:150}}>{this.state.expense.custId.name}提交给{this.state.expense.leader}</Text>
							<Text style={{fontSize:10,textAlign:'left',width:150}}>{this.state.expense.submittime}</Text>
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
						<Text style={{textAlign:'center',fontSize:18,flex:1}} >{this.state.expense.name}</Text>
					</View>
					<View style={Global.styles.FULL_SEP_LINE} />
					<View style={[{flex:1,flexDirection:'row',backgroundColor:'#FFFFFF'}]}>
						<View style={[{flex:1,height:40,paddingTop:5}]}>
							<Text style={[{textAlign:'center',fontSize:18,}]}>{this.state.expense.custId.name}</Text>
						</View>
						<View style={[{flex:1,height:40,paddingTop:5,borderLeftWidth:1/Global.pixelRatio,borderColor:Global.colors.IOS_SEP_LINE}]}>
							<Text style={[{textAlign:'center',fontSize:18},]}>{this.state.expense.custId.dept}</Text>
						</View>
					</View>
					<View style={Global.styles.FULL_SEP_LINE} />
					<View style={{flex:1,flexDirection:'row',}}>
						<TouchableOpacity  style={clickStyle1} onPress={()=>this.changeView(1)}>
							<Text style={{color:Global.colors.ORANGE}}>￥{this.filterMoney(this.state.expense.totalamt)}</Text>
							<Text style={clickStyle3}>报销金额</Text>
						</TouchableOpacity>
						<TouchableOpacity style={clickStyle2} onPress={()=>this.changeView(2)}>
							<Text style={{color:Global.colors.ORANGE}}>{this.state.expense.state}</Text>
							<Text style={clickStyle4}>进度与审批</Text>
						</TouchableOpacity>
					</View>
					<View style={{height:20,flex:1,backgroundColor:Global.colors.IOS_GRAY_BG}}/>
					{ex_view}
					<View style={Global.styles.PLACEHOLDER20}/>
					{this.props.payFlag?
						<TouchableOpacity 
				    		style={[Global.styles.CENTER, {height: 40, flex: 1, backgroundColor: Global.colors.IOS_BLUE, borderRadius: 3,marginLeft: 20,marginRight:20}]} 
				    		onPress={()=>{this.paynext()}}>
				    		<Text style={{color: '#ffffff'}}>发放</Text>
				    	</TouchableOpacity>
				    :null}
				    <View style={Global.styles.PLACEHOLDER40}/>
				</ScrollView>
			</View>
			);
	},
	renderItem: function(item: string, sectionID: number, rowID: number) {
		var image=null;
		switch (item.type){
    	case '1':
    		image=(<View style={[styles.portrait,Global.styles.CENTER, Global.styles.BORDER,{backgroundColor:'rgba(111, 172, 240, 1)'}]}><Icon style={[{color:'#ffffff'}]} name='plane' size={20}/></View>);
    		break;
    	case '2':
    		image=(<View style={[styles.portrait,Global.styles.CENTER, Global.styles.BORDER,{backgroundColor:'rgba(240, 216, 79, 1)'}]}><Icon style={[{color:'#ffffff'}]} name='android-car' size={20}/></View>);
    		break;
    	case '3':
    		image=(<View style={[styles.portrait,Global.styles.CENTER, Global.styles.BORDER,{backgroundColor:'rgba(245, 80, 150, 1)'}]}><Icon style={[{color:'#ffffff'}]} name='ios-home' size={20}/></View>);
    		break;
    	case '4':
    		image=(<View style={[styles.portrait,Global.styles.CENTER, Global.styles.BORDER,{backgroundColor:'rgba(88, 209, 137, 1)'}]}><Icon style={[{color:'#ffffff'}]} name='fork' size={20}/></View>);
    		break;
    	case '5':
    		image=(<View style={[styles.portrait,Global.styles.CENTER, Global.styles.BORDER,{backgroundColor:'rgba(234, 148, 106, 1)'}]}><Icon style={[{color:'#ffffff'}]} name='ios-telephone' size={20}/></View>);
    		break;
    	case '6':
    		image=(<View style={[styles.portrait,Global.styles.CENTER, Global.styles.BORDER,{backgroundColor:'rgba(186, 119, 219, 1)'}]}><Icon style={[{color:'#ffffff'}]} name='more' size={20}/></View>);
    		break;
        }
        var topLine = rowID === '0' ? <View style={Global.styles.FULL_SEP_LINE} /> : null;
        var bottomLine = (<View style={Global.styles.FULL_SEP_LINE} />);
		return (
			<View>
				{topLine}
				<TouchableOpacity style={[styles.item, Global.styles.CENTER]} >
					{image}
					<View style={{flex:1,flexDirection:'column'}}>
						<View style={{flex:1,flexDirection:'row'}}>
							<Text style={{flex: 1, marginLeft: 20, fontSize: 15,fontWeight:'bold'}}>￥{this.filterMoney(item.amt)}</Text>
							<Text style={{flex: 1, fontSize: 12}}>{item.num}张发票</Text>
						</View>
						<View style={{flex:1,flexDirection:'row',flexWrap:'nowrap'}}>
							<Text style={{flex: 1, marginLeft: 20,fontSize: 12}}>{item.date}</Text>
							<Text style={{flex: 1, fontSize: 12}}>{item.memo}</Text>
						</View>
					</View>
				</TouchableOpacity>
				{bottomLine}
			</View>
		);
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
		width: Global.getScreen().width ,
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
	}
});
module.exports = ExpenseDetail;
