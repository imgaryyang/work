'use strict';

var InputPayPwd = require('../lib/InputPayPwd');
var React = require('react-native');
var NavBar = require('../NavBar');
var Global = require('../../Global');
var Icon = require('react-native-vector-icons/Ionicons');
var BankList = require('../assets/BankList');
var UtilsMixin = require('../lib/UtilsMixin');
var FilterMixin = require('../../filter/FilterMixin');

var {
	StyleSheet,
	ScrollView,
	View,
	Text,
	Image,
    PixelRatio,
	TouchableOpacity,
	Navigator,
	Dimensions,
	InteractionManager,
	ListView,
	TextInput,
    PropTypes,
	Alert
} = React;

// var SALARY_PAY_URL = 'salaryDetail/pay';
var KEEP_ACCT_URL = 'reqprocess/forBalanceChange';
var KEEP_ACCT_URL2 = 'reqprocess/forCustomerRegister';
var GET_SEQUENCE ='sequence/next';

var Cashier = React.createClass({
	mixins: [UtilsMixin, FilterMixin],

  	statics: {
        title: 'Movie',
        description: '电影详情',
    },

    /**
     * 参数说明
     */
    propTypes: {

        /**
        * 导航容器
        * 必填
        */
        navigator: PropTypes.object.isRequired,

        /**
        * 路由
        * 必填
        */
        route: PropTypes.object.isRequired,
        /*
        *支付金额
        */
        payAmt: PropTypes.number.isRequired,
        /*
        *支付描述
        */
        payDesc: PropTypes.string.isRequired,
        /**
        *支付相关的业务动作
        */
        pay:PropTypes.func.isRequired,
        /**
        *支付之后回掉
        **/
        afterPay:PropTypes.func.isRequired,
        /**
        *支付明细
        **/
        payElcAcctDetails:PropTypes.array.isRequired,
        // payeeElcAcctDetails:PropTypes.array.isRequired,
        /*格式：
        {
            channelID:,
            channelSeq:,
            channelCust:,
            acctType:,
            acctNo:,
            tranType:,
            cdFlag:,
            tranAmt:,
        }
        */

    },

    getDefaultProps: function() {
        return {
            payAmt: 0.00,
            // route: PropTypes.object.isRequired,
        };
    },

    /**
    * 初始化状态
    */
    getInitialState: function () {
        return {
            accountInfo:{
                bankName : null,
                acctNo : null,
                bank_no : null,
                balance : 0
            },
            showLoading: false,
        };
    },
    componentDidMount: function() {
        console.log('componentDidMount');
        InteractionManager.runAfterInteractions(() => {
            this.setState({
                doRenderScene: true,
            });
        });
        console.log('dataSource:');
        // console.log(this.state.dataSource);
    },
    bankList:function(){
        var nav = this.props.navigator ? this.props.navigator : this.props.rootNavigator;
        nav.push({
            title:'付款方式',
            component:BankList,
            passProps:{
                acctNo:this.props.acctNo,
                kind:'3',
                refresh:this.refresh
            },
        });
    },
    refresh:function(data){
        console.log("BanksTransferOut refresh data:");
        console.log(data);
        this.setState({
            accountInfo:{
                bankName : data.bankName,
                acctNo : data.acctNo,
                bank_no : data.bank_no,
                balance : data.balance
            }
        });
    },
    callPwdCheck: function() {
        console.log('hello, i am in callPwdCheck');
        if (this.state.accountInfo.acctNo==null ) {
            Alert.alert(
                'Warning',
                '请选择支付账户!',
            );
            return;
        }
        let total = 0;
            total = this.props.payAmt;      
        if (parseFloat(this.state.accountInfo.balance) < parseFloat(total)) {
            Alert.alert(
                'Warning',
                '账户余额不足!',
            );
            return;
        }
            console.log('total=='+parseFloat(total));
        this.props.navigator.push({
            component: InputPayPwd,
            hideNavBar: true,
            passProps: {
                // acctNo : this.state.accountInfo.acctNo,
                pwdChecked: this.afterPwdChecked,
            },
        });
    },

    keepElcAcct:  async function(acctDetails,acctNo){
        console.log('keepElcAcct');
        
        this.showLoading();
        var sequence = 0;
        var Detail = acctDetails[0];
        /*get Sequence*/
        let responseData1 = await this.request(Global.host + GET_SEQUENCE, {
            body: JSON.stringify({
                type:2,
                }),
        });
        console.log('****************GET_SEQUENCE');
        console.log(responseData1);
        // sequence = responseData1. ;
        sequence = responseData1.body[0].sequence;
        var bodydata = 'channelID='+Detail.channelID+'&channelSeq='+sequence+'&channelCust='+Detail.channelCust+'&acctType='+Detail.acctType+'&acctNo='+acctNo+'&tranType='+Detail.tranType+'&cdFlag='+Detail.cdFlag+'&tranAmt='+Detail.tranAmt;
        console.log(bodydata);

        let responseData = await this.request(Global.acctHost+KEEP_ACCT_URL, {
            headers:{
                'Content-Type': 'application/x-www-form-urlencoded',
                'charset':'utf-8',
            },
            body:bodydata,
        });
            // console.log(responseData);
                    
        if(responseData.respCode == '00'){
            this.toast('支付成功！');
            console.log('keepElcAcct sucess');
            /*业务相关操作*/
            await this.props.pay(this.state.accountInfo.acctNo);
            console.log('pay sucess');
            /*支付后操作*/
            await this.props.afterPay();
            console.log('afterPay sucess');
        }else{
                Alert.alert(
                    '错误',
                    responseData.respMsg,
                );
                /*账务系统回退*/
        }
        this.hideLoading();
    },

    
    afterPwdChecked: async function() {

        console.log('afterPwdChecked');
        // TODO:添加密码校验后业务逻辑
        try{
            /*账户余额变更*/
            console.log(this.state.accountInfo);
            if(this.state.accountInfo.bank_no==''||this.state.accountInfo.bankName=='电子账户'){
                console.log('账户电子账户');
                
                /*电子账户*/
                await this.keepElcAcct(this.props.payElcAcctDetails,this.state.accountInfo.acctNo);
            }else{
                /*银行账户*/
            }

        }catch(e){
            console.log('afterPwdChecked failed');
            this.hideLoading();
            this.requestCatch(e);
        }
        
    },

    render: function() {
        return(
                <View style={Global.styles.CONTAINER}>
                    <ScrollView style={styles.sv}>
                        <View style={styles.paddingPlace} />
                        <View style={Global.styles.PLACEHOLDER10} />

                        <TouchableOpacity style={[styles.rend_row,{marginTop:10,height:50,}]} onPress={()=>{this.bankList()}}>
                            {this.state.accountInfo.bank_no != null?Global.bankLogos[this.state.accountInfo.bank_no]:<Icon style={{paddingLeft:21,paddingRight:11}} name="social-yen" size={20} color={Global.colors.IOS_RED}/>}
                            <View style={{paddingLeft:10,flex:1}}>
                                <Text style={styles.textA}>
                                {this.state.accountInfo.bankName == null?'请选择支付账户':this.state.accountInfo.bankName}
                                </Text> 
                                {this.state.accountInfo.acctNo == null?null:
                                    <Text style={[styles.textb]}>
                                        {'尾号'+this.filterCardNumLast4(this.state.accountInfo.acctNo)+')'}
                                    </Text>}
                                  
                            </View>
                            <Icon name='ios-arrow-right' size={18} color={Global.colors.IOS_DARK_GRAY} style={[Global.styles.ICON, {width: 30}]} />
                        </TouchableOpacity>
                      


                        <View style={styles.rend_row1}>
                            <Icon style={[styles.icon,{paddingLeft:10}]} name='information-circled' size={15} color={Global.colors.IOS_BLUE}/>
                            <Text style={{fontSize:10}}>06:00:00-21:30:00期间转出，支持5万额度最快2小时到账.</Text>
                        </View>
                        <View style={styles.rend_row}>
                            <View style={{width:45,}}>
                                <Text style={styles.textA}>金额:</Text>
                            </View>
                            <View style={{flex:1}}>
                                <Text style={{textAlign:'left'}}>{parseFloat(this.props.payAmt).toFixed(2)}元</Text>
                            </View>
                        </View>
                        <View style={styles.rend_row}>
                            <View style={{width:45,}}>
                                <Text style={styles.textA}>备注:</Text>
                            </View>
                            <View style={{flex:1}}>
                                <Text style={{textAlign:'left'}}>{this.props.payDesc}</Text>
                            </View>
                        </View>
                        <View style={Global.styles.PLACEHOLDER40} />
                        <View style={Global.styles.PLACEHOLDER40} />
                        <View style={[{flex: 1, flexDirection: 'row', marginTop: 10,paddingLeft:10,paddingRight:10}]}>
                            <TouchableOpacity 
                                style={[Global.styles.CENTER, {height: 40, flex: 1, backgroundColor: Global.colors.IOS_BLUE, borderRadius: 3,}]} 
                                onPress={()=>{this.callPwdCheck()}}>
                                <Text style={{color: '#ffffff',}}>下一步</Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </View>
            );
    },


});
	
var styles = StyleSheet.create({
	paddingPlace: {
		flex: 1,
		height: Global.NBPadding,
	},
	sv: {
		// paddingLeft: 20,
		// paddingRight: 20,
	},
    rend_row1: {
        backgroundColor:Global.colors.IOS_BG,
        height:35,
        flexDirection: 'row',
        paddingLeft:30,
        borderWidth: 1 / PixelRatio.get(),
        borderColor:Global.colors.TAB_BAR_LINE,
        //justifyContent: 'center',
        alignItems: 'center',
    },
	rend_row: {
        height:50,
    	flexDirection: 'row',
    	paddingLeft:30,
    	backgroundColor:'#FFFFFF',
    	borderWidth: 1 / PixelRatio.get(),
    	borderColor:Global.colors.TAB_BAR_LINE,
    	//justifyContent: 'center',
		alignItems: 'center',
    },
    separator: {
    	height: 1,
    	backgroundColor: '#CCCCCC',
    },
    thumb: {
    	width: 40,
    	height: 40,
    	borderRadius:20,
    },
    textA: {
    	flex: 1,
        fontSize:16,
  	},
    textb:{
        fontSize:12,
        color:'grey',
        paddingTop:5,
    },
  	icon: {
		textAlign: 'center',
	},

	button:{
		marginLeft:90,
		width:50,
		height:25,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor:'#ef473a',
		borderColor:'#ffffff',
		borderWidth:1 / PixelRatio.get(),
	},
	item: {
        // width: Global.getScreen().width ,
        // backgroundColor: '#ffffff',
        flexDirection: 'row',
        height : 30
        // borderBottomWidth: 0,
        // borderLeftWidth: 0,
        // borderRightWidth: 0,
        // padding: 10,
        // paddingLeft: 0,
        // paddingRight: 20,
    },

});

module.exports = Cashier;