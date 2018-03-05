/**
 * 电影主页
 */

'use strict';

import React, {
    Component,
    PropTypes,
} from 'react';

import {
    TouchableOpacity,
    ScrollView,
    View,
    Text,
    StyleSheet,
    Image,
    InteractionManager,
    WebView,
    Dimensions,
} from 'react-native';

import * as Global      from '../Global';
import NavBar           from '../store/common/TopNavBar';
import EasyIcon         from 'rn-easy-icon';
import UserAction from '../flux/UserAction';
import UserStore from '../flux/UserStore';

const BANKS_URL 		= 'el/user/getBankCards';
const FIND_CARDS_URL 	= 'el/bankCards/list';

var WEBVIEW_REF = '__WebViewSample__';

class WebViewPage extends Component {

    static displayName = 'WebViewPage';
    static description = '银联WebView';

    static propTypes = {

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
    };

    static defaultProps = {
    };

    state = {
        doRenderScene: false,
        url: 'http://110.76.186.47/store/index.php?act=app_pay&op=frontOpen',
        //url: 'http://110.76.186.47/store/index.php?act=app_pay&op=t',
        // url: 'http://www.baidu.com',
        loading: true,
        scalesPageToFit: true,
        title: 'loading...',
        userInfo:{}

    };

    constructor (props) {
        super(props);

        this.goBack = this.goBack.bind(this);
        this.goForward = this.goForward.bind(this);
        this.reload = this.reload.bind(this);
        this.onNavigationStateChange = this.onNavigationStateChange.bind(this);
        this.onLoad = this.onLoad.bind(this);
        this._renderPlaceholderView = this._renderPlaceholderView.bind(this);
        this._getNavBar = this._getNavBar.bind(this);
        this.toQueryString = this.toQueryString.bind(this);
    }

    componentDidMount () {
        var x = [];
        InteractionManager.runAfterInteractions(() => {
            this.setState({doRenderScene: true});
        });
    }
    goBack () {
        if(this.state.backButtonEnabled)
            this.refs[WEBVIEW_REF].goBack();
    }

    goForward () {
        if(this.state.forwardButtonEnabled)
            this.refs[WEBVIEW_REF].goForward();
    }

    reload () {
        this.refs[WEBVIEW_REF].reload();
    }

    async onNavigationStateChange (navState) {  
        if(navState.title === 'bdok'){

            this.showLoading();

            let data = encodeURI(JSON.stringify({
                personId: UserStore.getUser().personId,
            }));
            try {
                let responseData = await this.request(Global._host + FIND_CARDS_URL + '?data=' + data,{
                    method:'GET',
                });
                if(responseData.success){
                    UserStore.onUpdateBankCards(responseData.result);
                    this.hideLoading();
                }
            } catch(e) {
                this.hideLoading();
                this.handleRequestException(e);
            }

            this.props.navigator.popToTop();
        }
    }

    onLoad () {
        
    }

    onBridgeMessage(message){
        const { webviewbridge } = this.refs;
        
    }

    toQueryString(obj) {
        return obj ? Object.keys(obj).sort().map(function(key) {
            var val = obj[key];
            if (Array.isArray(val)) {
                return val.sort().map(function(val2) {
                    return encodeURIComponent(key) + '=' + encodeURIComponent(val2);
                }).join('&');
            }

            return encodeURIComponent(key) + '=' + encodeURIComponent(val);
        }).join('&') : '';
    }

    render () {
        if(!this.state.doRenderScene)
            return this._renderPlaceholderView();

        var backBtnTextStyle = this.state.backButtonEnabled ? styles.btnText : styles.disabledBtnText;
        var forwardBtnTextStyle = this.state.forwardButtonEnabled ? styles.btnText : styles.disabledBtnText;
        let {
			height, width
		} = Dimensions.get('window');
        
        return (
            
            <View style = {[Global._styles.CONTAINER/*, {backgroundColor: 'white'}*/]}>
                {this._getNavBar()}
                <WebView
                    style={{
                        backgroundColor: '#fff',
                        height: height,
                        width: width,
                    }}
                        source = {{uri: this.state.url, method:'POST', body: this.toQueryString({
                            accNo : '6226090000000048',//this.props.accNo,//卡号
                            orderId : this.props.orderId,//订单号
                            txnTime :  this.props.txnTime,//订单时间
                            phoneNo : '18100000000',//     this.props.phoneNo,//手机号
                            certifId : '510265790128303',//     this.props.certifId,//身份证号
                            customerNm :  '张三',//   this.props.customerNm,//姓名
                            cvn2 : '',//信用卡三位识别码
                            expired : '',//信用卡有效期，YYMM格式
                            str:this.props.str,//32md5加密串*/
                            })
                        }}
                scalesPageToFit={true} 
                onNavigationStateChange={this.onNavigationStateChange.bind(this)}/>
                <View style = {[Global._styles.CENTER, styles.statusBar]}>
                    <TouchableOpacity style = {[Global._styles.CENTER, styles.bottomBtn]} onPress = {this.goBack} >
                        <Text style = {backBtnTextStyle} >后退</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style = {[Global._styles.CENTER, styles.bottomBtn]} onPress = {this.goForward} >
                        <Text style = {forwardBtnTextStyle} >前进</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style = {[Global._styles.CENTER, styles.bottomBtn]} onPress = {this.reload} >
                        <Text style = {styles.btnText} >刷新</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
        
    }

    _renderPlaceholderView () {
        return (
            <View style = {[Global._styles.CONTAINER/*, {backgroundColor: 'white'}*/]}>
                {this._getNavBar()}
            </View>
        );
    }

    _getNavBar () {
        return (
            <NavBar title = {this.state.title} 
                navigator = {this.props.navigator} 
                route = {this.props.route} 
                hideBackButton = {false} 
                hideBackText = {true}
                hideBottomLine = {false} 
                flow = {false} 
                centerComponent = {(
                    <View style = {[Global._styles.NAV_BAR.CENTER_VIEW, {flex: 4, flexDirection: 'row'}]} >
                        <Text numberOfLines = {1} style = {Global._styles.NAV_BAR.TITLE_TEXT} >{this.state.title}</Text>
                    </View>
                )} />
        );
    }
}

const styles = StyleSheet.create({
    webView: {
        flex: 1,
    },
    statusBar: {
        flexDirection: 'row',
        height: 40,
        backgroundColor: 'white',
        borderTopWidth: 1 / Global._pixelRatio,
        borderTopColor: 'rgba(167,167,170,1)',
    },
    bottomBtn: {
        flex: 1,
    },
    disabledBtnText: {
        color: 'gray',
    },
    btnText: {
        color: 'rgba(0,122,255,1)',
    },

});

export default WebViewPage;

