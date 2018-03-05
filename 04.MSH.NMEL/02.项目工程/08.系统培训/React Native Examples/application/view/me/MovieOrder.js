/**
 * 电影票确认订单
 */
'use strict';

var React = require('react-native');
var NavBar = require('../NavBar');
var Icon = require('react-native-vector-icons/Ionicons');
var Global = require('../../Global');
var InputPayPwd = require('../lib/InputPayPwd');
var BankList = require('../assets/BankList');
var movieQrView = require('./MovieQrView');

var AccountAction = require('../actions/AccountAction');
var UtilsMixin = require('../lib/UtilsMixin');
var FilterMixin = require('../../filter/FilterMixin');

var {
    TouchableOpacity,
    ScrollView,
    View,
    Text,
    StyleSheet,
    PropTypes,
    Navigator,
    PixelRatio,
    Dimensions,
    Alert,
    Image,
    InteractionManager,   
} = React;

var MP_Detail_URL = 'yppt/getOrderDetail';
var ACCOUNT_PAY_URL = 'person/pay';
var Movie_Pay_URL = 'yppt/handoutQrcode';
var Movie_Del_URL = 'yppt/unLockSeats';

var MoviePay = React.createClass({

    mixins: [UtilsMixin,FilterMixin],

    statics: {
        title: 'MovieOrder',
        description: '订单详情',
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

        /**
        * 订单id
        */
        id:PropTypes.string.isRequired
    },

    /**
     * 默认参数
     */
    getDefaultProps: function() {
        return {
        };
    },

    /**
    * 初始化状态
    */
    getInitialState: function () {

        return {
        	doRenderScene: false,
            orderId: this.props.id,
            accountInfo: {
                bankName: null,
                acctNo: null,
                bank_no: null,
                balance: 0
            },
            //price: this.props.price,
           // filmName: this.props.filmName,
            //id: this.props.id,
        };
    },

    _genRows: function(pressData: {[key: number]: boolean}): Array<string> {
        var dataBlob = [];       
        return dataBlob;
    },

    componentDidMount: async function() {
		InteractionManager.runAfterInteractions(async() => {
            await this.fetchData();
			this.setState({doRenderScene: true});
		});
	},

    /**
    * 渲染完成后接收参数变化
    */
    componentWillReceiveProps: function() {
    },


    bankList: function(){
        console.log('*****************acctNo******************************');
        console.log(this.props.acctNo);
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
    refresh: function(data){
        this.setState({
            accountInfo:{
                bankName : data.bankName,
                acctNo : data.acctNo,
                bank_no : data.bank_no,
                balance : data.balance
            }
        })
    },

    //付款
    pay: function(){
        if (this.state.accountInfo.acctNo == null) {
            Alert.alert(
                'Warning',
                '请选择支付账户!',
            );
            return;
        }
        let total = parseFloat(this.state.price);
        
        if (parseFloat(this.state.accountInfo.balance) < parseFloat(total)) {
            Alert.alert(
                'Warning',
                '账户余额不足!',
            );
            return;
        }
        
        this.props.navigator.push({
            component: InputPayPwd,
            hideNavBar: true,
            passProps: {
                    pwdChecked: this.done,
            },
        });
    },

    done: async function() {
        this.showLoading();
        //调小管家后台，改账户余额
        try {
            let responseData1 = await this.request(Global.host + ACCOUNT_PAY_URL, {
                body: JSON.stringify({
                    mobile: Global.USER_LOGIN_INFO.mobile,
                    accountNum: this.state.accountInfo.acctNo,
                    price: this.state.price,
                }),
            });
            if(responseData1.status == 'success'){
                AccountAction.updateAccount(responseData1.body);
                //调影票接口
                console.log(Global.movieHost+Movie_Pay_URL+'.do?payment_sn=8&order_code='+this.state.orderId+'&merchant_code=1&pay_status=0&pay_channel=PO_UPMP&amount='+this.state.price);
                let responseData = await this.request(Global.movieHost+Movie_Pay_URL+'.do?payment_sn=8&order_code='+this.state.orderId+'&merchant_code=1&pay_status=0&pay_channel=PO_UPMP&amount='+this.state.price);
                if(responseData.return_code != '0'){
                    Alert.alert('提示','订单支付未成功！');
                }
            }
            
        } catch (e) {
            this.requestCatch(e);
        }
       
        //this.toDetail();
        this.props.refresh.call();
        this.props.navigator.popToRoute(this.props.backRoute);
        this.toast('支付完成！');
        this.hideLoading();
    },

    //取消订单，释放座位
    cancelOrder: function() {
        Alert.alert(
            '提示',
            '您确定要取消此笔订单吗？',
            [
                {text: '取消', style: 'cancel'},
                {text: '确定', onPress: () => this.doCancel()},
            ]
        );
    },


    fetchData: async function() {

        try {
            console.log(Global.movieHost+MP_Detail_URL+'.do?orderId='+this.state.orderId);
            let responseData = await this.request(Global.movieHost+MP_Detail_URL+'.do?orderId='+this.state.orderId);
            console.log(responseData.data);
            if(responseData.return_code =='0'){
                this.data = responseData.data;
                var seats = '';
                console.log(this.data.tic.length);
                for (var i = 0; i < this.data.tic.length; i++) {
                    seats = seats + '  ' + this.data.tic[i].seatInfo;
                };
                this.setState({
                    price: this.data.price,
                    seatInfos: seats,
                    loaded: true,
                });
            }
            this.hideLoading();
        } catch(e) {
            this.requestCatch(e);
        }
    },
    
    showQrView:function(){
        this.props.navigator.push({
            title: "影票二维码",
            component: movieQrView,
            passProps: {
                tic : this.data.tic,
            },
        });
    },
    render: function() {
        if(!this.state.doRenderScene)
            return this._renderPlaceholderView();

        var QrView = this.data.orderStatus == '2'?(
            <View>
                    <View style={Global.styles.PLACEHOLDER20} />
                    <View style={Global.styles.FULL_SEP_LINE} />
                    <TouchableOpacity style={{flex:1,flexDirection:'row',padding:10,backgroundColor:'#ffffff'}} onPress={this.showQrView}>
                        <Text style={{flex:1,marginLeft:10,color:Global.colors.IOS_BLUE}}>查看二维码</Text>
                        <Icon name='ios-arrow-right' size={18} color={Global.colors.IOS_ARROW} style={[Global.styles.ICON, {width: 40}]} />
                    </TouchableOpacity>
                    <View style={Global.styles.FULL_SEP_LINE} />
            </View>
            ):null;
        var choosePayView = this.data.orderStatus == '0'?(<View style={Global.styles.container}>
                            <ScrollView style={styles.sv}>
                                <View style={Global.styles.FULL_SEP_LINE} />
                                 <TouchableOpacity style={[styles.rend_row,]} onPress={()=>{this.bankList()}}>
                                    {this.state.accountInfo.bank_no != null?Global.bankLogos[this.state.accountInfo.bank_no]:<Icon style={{paddingLeft:11,paddingRight:11}} name="social-yen" size={20} color={Global.colors.IOS_RED}/>}
                                    <View style={{paddingLeft:10}}>
                                        <Text style={[styles.text],{fontSize:15}}>
                                        {this.state.accountInfo.bankName == null?'请选择支付账户':this.state.accountInfo.bankName}
                                        </Text>
                                        {this.state.accountInfo.acctNo == null?null:
                                            <Text style={[styles.text],{fontSize:12,color:'grey',paddingTop:5}}>
                                                {'尾号('+this.filterCardNumLast4(this.state.accountInfo.acctNo)+')'}
                                            </Text>}
                                    </View>
                                    <Icon name='ios-arrow-right' size={18} color={Global.colors.IOS_DARK_GRAY} style={[Global.styles.ICON, {width: 20,marginLeft: 135,}]} />
                                </TouchableOpacity>
                                <View style={Global.styles.FULL_SEP_LINE} />
                                <View style={Global.styles.PLACEHOLDER20} />
                                <View style={[{flex: 1, flexDirection: 'row',paddingLeft:20,paddingRight:20}]}>
                                    <TouchableOpacity 
                                        style={[Global.styles.CENTER, {height: 40, flex: 1, backgroundColor: Global.colors.IOS_BLUE, borderRadius: 3,}]} 
                                        onPress={()=>{this.pay()}}>
                                        <Text style={{color: '#ffffff',}}>付款</Text>
                                    </TouchableOpacity>
                                    <View style={{flex: 0.05}}></View>
                                    <TouchableOpacity 
                                        style={[Global.styles.CENTER, {height: 40, flex: 1, backgroundColor: Global.colors.IOS_BLUE, borderRadius: 3,}]}
                                        onPress={()=>{this.cancelOrder()}}>
                                        <Text style={{color: '#ffffff',}}>取消</Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={Global.styles.PLACEHOLDER40} />
                            </ScrollView>
                        </View>):null;
       
        return (
            <View style={Global.styles.CONTAINER}>
                {this._getNavBar()}
                <View style={Global.styles.PLACEHOLDER20} />        
                <ScrollView style={[styles.sv]}>
                <View style={Global.styles.FULL_SEP_LINE} />
                    <View style={[styles.item]}>
                        <View style={[styles.itemtext]}>
                            <Text style={{fontSize:18, color: Global.colors.FONT,}}>{this.data.tic[0].filmName}</Text>
                            <Text style={{fontSize:11,marginTop:5}}>({this.data.tic[0].copyLanguage}{this.data.tic[0].copyType})</Text>
                         </View>
                         <View style={[styles.itemtext1]}> 
                            <Text>{this.data.tic[0].cienmaName}</Text>
                         </View>
                         <View style={[styles.itemtext1]}>
                            <Text>{this.data.tic[0].waitDate.substring(0,10)} {this.data.tic[0].waitTime}</Text>
                         </View>
                         <View style={[styles.itemtext1]}>
                            <Text>{this.data.tic[0].hallName}{this.state.seatInfos}</Text>
                         </View>
                         <View style={[styles.itemtext1]}>
                            <Text>票价：{this.filterMoney(this.data.tic[0].price)} x {this.data.buyCount}张</Text>
                         </View>
                         <View style={[styles.itemtext1]}>
                            <Text style={{color:Global.colors.ORANGE}}>总价：{this.filterMoney(this.data.price)}元</Text>
                         </View>
                        <View style={[styles.itemtext1]}>
                           <Text>购票手机号：{this.data.buyerPhone}</Text>
                        </View>
                    </View>
                    <View style={Global.styles.FULL_SEP_LINE} />
                    {QrView}
                    <View style={Global.styles.PLACEHOLDER20} />
                    {choosePayView}

                </ScrollView>

            </View>
        );       
    },

	_renderPlaceholderView: function() {
		return (
			<View style={Global.styles.CONTAINER}>
			    {this._getNavBar()}
			</View>
		);
	},
    
	_getNavBar: function() {
		return (
			<NavBar title='确认订单'
		    	navigator={this.props.navigator} 
				route={this.props.route} 
		    	hideBackButton={false} 
		    	hideBottomLine={false} 
		    	flow={false} 
				centerComponent={(
					<View style={[Global.styles.NAV_BAR.CENTER_VIEW, {flex: 2, flexDirection: 'row'}]} >
						<Text numberOfLines={1} style={[{fontSize: 16, color: '#000000'}]}>{this.state.navTitle}</Text>
					</View>
				)} />
		);
	},
});

var styles = StyleSheet.create({
    sv: {
    	flex: 1,
    },
    item: {
        backgroundColor: '#ffffff', 
        paddingTop:10,
        paddingBottom:10        
    },
    itemtext: {
        flexDirection: 'row',
        paddingLeft: 10,
    },
    itemtext1: {
        paddingLeft: 10,
    },
    itemButton: {
        flex: 1, 
        flexDirection: 'row', 
    },
   
    paddingPlace: {
        flex: 1,
        height: Global.NBPadding-45,
    },
    rend_row: {
        flexDirection: 'row',
        height:50,
        paddingLeft:10,
        backgroundColor:'#FFFFFF',
        borderLeftWidth: 1 / PixelRatio.get(),
        borderRightWidth: 1 / PixelRatio.get(),
        borderColor:Global.colors.TAB_BAR_LINE,
        alignItems: 'center',
    },
   
    separator: {
        height: 1,
        backgroundColor: '#CCCCCC',
    },
    thumb: {
        width: 30,
        height: 20,
    },
    text: {
        flex: 1,
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
});

module.exports = MoviePay;


