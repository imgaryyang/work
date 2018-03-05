'use strict';

var React = require('react-native');
var NavBar = require('../NavBar');
var Icon = require('react-native-vector-icons/Ionicons');
var Global = require('../../Global');
var MngIdx = require('../mng/MngIdx');
var Checkbox = require('../lib/Checkbox');
var expenseDetail = require('./ExpenseDetail');
var loanDetail = require('./LoanDetail');
// var payDetail = require('./PayDetail');
var UtilsMixin = require('../lib/UtilsMixin');
var Cashier = require('../lib/Cashier');
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

var FIND_EXPENSE_URL =  'expense/findByLeader';
var FIND_LOAN_URL = 'loan/findByLeader';
var UPDATE_LOAN_URL =  'loan/updateState';
var UPDATE_EXPENSE_URL =  'expense/updateState';
var EXPENSE_PAY_URL =  'expense/pay';
var LOAN_PAY_URL =  'loan/pay';


var PayList = React.createClass({

    mixins: [UtilsMixin,FilterMixin],
    data1:[],
    data2:[],
    payElcAcctDetails:[],

    getInitialState : function(){
        var ds1 = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        var ds2 = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        return {
            doRenderScene: false,
            dataSource1: ds1.cloneWithRows(this._genRows1({})),
            dataSource2: ds2.cloneWithRows(this._genRows2({})),
            showLoading: false,
            isRefreshing: false,
            refreshCheckbox:false,
        };
    },
    _genRows1: function(pressData: {[key: number]: boolean}): Array<string> {
        var dataBlob1 = [];
        /*for (var ii = 0; ii < 5; ii++) {
            var pressedText = pressData[ii] ? ' (pressed)' : '';
            dataBlob1.push('Row ' + ii + pressedText);
        }*/
        return dataBlob1;
    },
     _genRows2: function(pressData: {[key: number]: boolean}): Array<string> {
        var dataBlob2 = [];
        /*for (var ii = 0; ii < 5; ii++) {
            var pressedText = pressData[ii] ? ' (pressed)' : '';
            dataBlob2.push('Row ' + ii + pressedText);
        }*/
        return dataBlob2;
    },
    componentDidMount: function() {
        this.expenses =[];
        this.loans=[];
        InteractionManager.runAfterInteractions(() => {
            this.setState({doRenderScene: true});
            this.fetchData();
        });
    },
    fetchData: async function() {
        this.showLoading();
        this.setState({
            loaded: false,
            fetchForbidden: false,
        });
        try {
            let responseData = await this.request(Global.host +FIND_EXPENSE_URL, {
                body: JSON.stringify({
                    leader: Global.USER_LOGIN_INFO.id,
                    state: '2'
                }),
            });
            for (let i = 0; i < responseData.body.length; i++) {
                responseData.body[i].submittime = this.filterDateFmt(responseData.body[i].submittime);
                responseData.body[i].state = this.stateFmt(responseData.body[i].state);
                switch (responseData.body[i].name) {
                    case '0':
                        responseData.body[i].name = '日常报销';
                        break;
                    case '1':
                        responseData.body[i].name = '差旅报销';
                        break;
                    default:
                        responseData.body[i].name = '日常报销';
                }
                this.expenses.push({
                    id: responseData.body[i].id,
                    totalamt: responseData.body[i].totalamt,
                    custId: responseData.body[i].custId
                });
            }
            this.data1=responseData.body;
            if(responseData.body.length != 0){
                this.data1s=JSON.stringify(responseData.body);
            }else{
                this.data1s='1';
            }
            this.setState({
                dataSource1: this.state.dataSource1.cloneWithRows(responseData.body),
                isRefreshing: false,
            });
            // console.log(responseData.body);
        } catch (e) {
            this.hideLoading();
            this.setState({
                isRefreshing: false,
            });
            if (e.status == 401 || e.status == 403)
                this.setState({
                    fetchForbidden: true
                });
            this.requestCatch(e);
        }
        try {
            let responseData1 = await this.request(Global.host +FIND_LOAN_URL, {
                body: JSON.stringify({
                    leader: Global.USER_LOGIN_INFO.id,
                    state: '2'
                }),
            });
            for (let i = 0; i < responseData1.body.length; i++) {
                responseData1.body[i].time1 = this.filterDateFmt(responseData1.body[i].time1);
                responseData1.body[i].state = this.stateFmt(responseData1.body[i].state);
                switch (responseData1.body[i].loanname) {
                    case '0':
                        responseData1.body[i].loanname = '日常借款';
                        break;
                    case '1':
                        responseData1.body[i].loanname = '差旅借款';
                        break;
                    default:
                        responseData1.body[i].loanname = '日常借款';
                }
                this.loans.push({
                    loanId: responseData1.body[i].loanId,
                    loanamt: responseData1.body[i].loanamt,
                    custId: responseData1.body[i].custId
                });
            }
            this.data2=responseData1.body;
            if(responseData1.body.length !=0){
                this.data2s=JSON.stringify(responseData1.body);
            }else{
                this.data2s='2';
            }
            this.setState({
                dataSource2: this.state.dataSource2.cloneWithRows(responseData1.body),
                isRefreshing: false,
                loaded: true,
            });
        } catch (e) {
            this.hideLoading();
            this.setState({
                isRefreshing: false,
            });
            if (e.status == 401 || e.status == 403)
                this.setState({
                    fetchForbidden: true
                });
            this.requestCatch(e);
        }
           
        this.setState({refreshCheckbox:false});
        this.hideLoading();
    },
    
    stateFmt:function(state){
        switch (state) {
                case '0':
                    return'未提交';
                case '1':
                    return '已提交';
                case '2':
                    state = '通过';
                case '3':
                    return '驳回';
                case '4':
                    return '结束';

            }
    },
    refreshPayList: function() {
        this.setState({refreshCheckbox:true});
        this.expenses=[];
        this.loans=[];
        this.fetchData();
    },
    pullToRefresh: function() {
        this.setState({isRefreshing: true,refreshCheckbox:true});
        this.expenses=[];
        this.loans=[];
        this.fetchData();
    },
    showExpenseDetail:function(id,item){
        this.props.navigator.push({
                title: "报销单详情",
                component: expenseDetail,
                passProps: {
                    id: id,
                    expense:item,
                    refreshPayList : this.refreshPayList,
                    payFlag:true,
                    backRoute:this.props.route
                },
            });
    },
    showLoanDetail: function(loanId,item) {
        this.props.navigator.push({
            title: "借款单详情",
            component: loanDetail,
            passProps: {
                loanId: loanId,
                loan:item,
                refreshPayList : this.refreshPayList,
                payFlag:true,
                backRoute:this.props.route
            },
        });
    },
    onExpenseCheck : function(id,amt,custId){
        this.expenses.push({id:id,totalamt:amt,custId});
    },
    unExpenseCheck : function(id){
        for(let i=0;i<this.expenses.length;i++){
            if(id == this.expenses[i].id){
                this.expenses.splice(i,1);
            }
        }
    },
    onLoanCheck : function(loanId,amt,custId){
        this.loans.push({loanId:loanId,loanamt:amt,custId:custId});
    },
    unLoanCheck : function(loanId){
        for(let i=0;i<this.loans.length;i++){
            if(loanId == this.loans[i].loanId){
                this.loans.splice(i,1);
            }
        }
    },
    next : function(){
        this.payElcAcctDetails=[];
        // console.log(this.expenses);
    	let count = this.expenses.length+this.loans.length;
        let amt = 0;
        for(let i =0; i<this.expenses.length;i++){
            amt += this.expenses[i].totalamt;
        }
        for(let i = 0; i<this.loans.length;i++){
            amt += this.loans[i].loanamt;
        }
         if(count == 0){
             Alert.alert(
                'Warning',
                '请选择要支付的申请！', 
            );
        }else{
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
                tranAmt:amt,
        });
        	this.props.navigator.push({
        		title: "报销借款发放",
                component: Cashier,
                passProps: {
                    payAmt:amt,
                    payDesc:'报销借款发放',
                    pay:this.pay,
                    afterPay:this.afterPay,
                    payElcAcctDetails:this.payElcAcctDetails,
                    // refreshPayList:this.refreshPayList,
                    // backRoute: this.props.route,
                    // payinfo : '支付报销借款共：'+this.filterMoney(amt)+'元'
                },
        	});
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
        this.refreshPayList();
        this.props.navigator.popToRoute(this.props.route);
        
    },
   
    render : function(){
        var listView = null;
        if(!this.state.doRenderScene)
            return this._renderPlaceholderView();

        var refreshText = this.state.fetchForbidden === true ? 
            '您还未登录，登录后点击此处刷新数据' : 
            '暂无需要发放的记录，点击此处重新载入';

        var refreshView = (this.state.loaded || this.state.fetchForbidden) && this.data1.length === 0 && this.data2.length === 0?
            this.getListRefreshView(refreshText, this.refreshPayList) : 
            null;
        var footBar = this.data1.length === 0 && this.data2.length === 0 ?
            null:
            ( <View style={[styles.footBar,Global.styles.CENTER]}>
                    <TouchableOpacity style={[styles.footBarBtn,Global.styles.CENTER,Global.styles.BORDER]} onPress={()=>{this.next()}}>
                        <Text style={{textAlign:'center',color:'#FFFFFF',fontSize:16}}>发放</Text>
                    </TouchableOpacity>
                </View>);
        return (
            <View style={styles.container}>
                <ScrollView 
                automaticallyAdjustContentInsets={false} 
                refreshControl={this.getRefreshControl(this.pullToRefresh)}>
                    <View style={styles.placeholder} />
                    {refreshView}
                       <ListView
                        key={this.data1s}
                        dataSource={this.state.dataSource1}
                        renderRow={this.renderExpenseItem}
                        style={[styles.list]} />
                        <ListView
                        key={this.data2s}
                        dataSource={this.state.dataSource2}
                        renderRow={this.renderLoanItem}
                        style={[styles.list]} />
                    <View style={{flex: 1, height: 40,}} />
                </ScrollView>
               {footBar}
            </View>
       );

    },
    renderExpenseItem: function(item: string, sectionID: number, rowID: number) {
        //console.log(rowID);
        var topLine = rowID === '0' ? <View style={Global.styles.FULL_SEP_LINE} /> : null;
        var bottomLine = (<View style={Global.styles.FULL_SEP_LINE} />);
        return (
            <View>
                {topLine}
               <TouchableOpacity style={[styles.item, Global.styles.CENTER, ]} onPress={()=>{this.showExpenseDetail(item.id,item);}}>
                    <Checkbox  style={{marginLeft:20}} color={Global.colors.IOS_BLUE}  checked={true} refresh={this.state.refreshCheckbox} onCheck={()=>{this.onExpenseCheck(item.id,item.totalamt,item.custId);}} onUncheck={()=>{this.unExpenseCheck(item.id);}}/>
                    <View style={{marginLeft:10,flex:1,flexDirection:'row'}}>
                        <View style={{flex:4,flexDirection:'column'}}>
                             <View style={{flex:1,flexDirection:'row',flexWrap:'nowrap'}}>
                                <Text style={{flex: 1, marginLeft: 10, fontSize: 15,fontWeight:'bold'}}>{item.name}</Text>
                            </View>
                             <View  style={{flex:1,flexDirection:'row',flexWrap:'nowrap'}} >
                                <Text style={{flex: 1, marginLeft: 10,fontSize: 15}}>提交人：{item.custId.name}</Text>
                            </View>
                            <View  style={{flex:1,flexDirection:'row',flexWrap:'nowrap'}} >
                                <Text style={{flex: 1, marginLeft: 10,fontSize: 12}}>提交时间：{item.submittime}</Text>
                            </View>
                        </View>
                    </View>
                    <Text style={{flex: 0.5, marginLeft: 10,fontSize: 15,color:Global.colors.ORANGE,textAlign:'right'}}>￥{this.filterMoney(item.totalamt)}</Text>
                    <Icon name='ios-arrow-right' size={18} color={Global.colors.IOS_DARK_GRAY} style={[Global.styles.ICON, {width: 20}]} />

                </TouchableOpacity>
                {bottomLine}
            </View>
        );
    },
    renderLoanItem: function(item: string, sectionID: number, rowID: number) {
        //console.log(rowID);
        var topLine = rowID === '0' ? <View style={Global.styles.FULL_SEP_LINE} /> : null;
        var bottomLine = (<View style={Global.styles.FULL_SEP_LINE} />);
        return (
            <View>
                {topLine}
               <TouchableOpacity style={[styles.item, Global.styles.CENTER, ]} onPress={()=>{this.showLoanDetail(item.loanId,item);}}>
                    <Checkbox  style={{marginLeft:20}} color={Global.colors.IOS_BLUE} checked={true} refresh={this.state.refreshCheckbox} onCheck={()=>{this.onLoanCheck(item.loanId,item.loanamt,item.custId);}} onUncheck={()=>{this.unLoanCheck(item.loanId);}}/>
                    <View style={{marginLeft:10,flex:1,flexDirection:'row'}}>
                        <View style={{flex:4,flexDirection:'column'}}>
                             <View style={{flex:1,flexDirection:'row',flexWrap:'nowrap'}}>
                                <Text style={{flex: 1, marginLeft: 10, fontSize: 15,fontWeight:'bold'}}>{item.loanname}</Text>
                            </View>
                            <View  style={{flex:1,flexDirection:'row',flexWrap:'nowrap'}} >
                                <Text style={{flex: 1, marginLeft: 10,fontSize: 15}}>提交人：{item.custId.name}</Text>
                            </View>
                            <View  style={{flex:1,flexDirection:'row',flexWrap:'nowrap'}} >
                                <Text style={{flex: 1, marginLeft: 10,fontSize: 12}}>提交时间：{item.time1}</Text>
                            </View>
                        </View>
                    </View>
                    <Text style={{flex: 0.5, marginLeft: 10,fontSize: 15,color:Global.colors.ORANGE,textAlign:'right'}}>￥{this.filterMoney(item.loanamt,item)}</Text>
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
    container: {
        flex: 1,
        backgroundColor: Global.colors.IOS_GRAY_BG,
    },
    sv: {
        
    },
    placeholder: {
        flex: 1,
        height: Global.NBPadding+20 ,
    },
    list: {
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
    footBar: {
        flex: 1,
        width: Global.getScreen().width,
        height: 40,
        position: 'absolute',
        bottom: 0,
        left: 0,
        flexDirection: 'row'
    },
    footBarBtn: {
        flex: 1,
        backgroundColor: Global.colors.IOS_BLUE,
        height: 40
    }
});
module.exports = PayList;