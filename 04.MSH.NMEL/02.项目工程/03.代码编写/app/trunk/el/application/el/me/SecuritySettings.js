'use strict';

import React, {
    Component,
    PropTypes,
} from 'react';

import {
    View,
    ScrollView,
    Text,
    TextInput,
    Image,
    TouchableOpacity,
    StyleSheet,
	InteractionManager,
	Animated,
    Navigator,
} from 'react-native';

import * as Global          from '../../Global';

import NavBar				from 'rn-easy-navbar';
import EasyIcon     		from 'rn-easy-icon';

import ChangePassword       from './ChangePassword';
import SetPayPassword       from './SetPayPassword';
import FindPayPassword 		from './FindPayPassword';
import ChangePayPassword 	from './ChangePayPassword';
import SetGesturePassword   from './SetGesturePassword';
import CheckAuthCode        from './CheckAuthCode';

class SecuritySettings extends Component {

    static displayName = 'SecuritySettings';
    static description = '安全设置';

    static propTypes = {
        /*
        ** 用户信息
        */
        userInfo: PropTypes.object.isRequired,
    };

    static defaultProps = {

    };
    

	state = {
		doRenderScene: false,
		data: null,
	};

    constructor (props) {
        super(props);
        this.getUserGesture     = this.getUserGesture.bind(this);
        
       
    }

	componentDidMount () {
		InteractionManager.runAfterInteractions(() => {
            this.getUserGesture();
			this.setState({doRenderScene: true});
		});
	}

	componentWillReceiveProps () {
     }   
    async getUserGesture () {

        var userInfo = UserStore.getUser();
        var myGes = null ;
        this.gesLists  = await AsyncStorage.getItem(Global._ASK_USER_GESLISTS);
            this.gesLists = JSON.parse(this.gesLists);
            if(this.gesLists!= null){
                for(var ii=0;ii<this.gesLists.length;ii++){
                    var gestureLists = this.gesLists.slice( ii, parseInt( ii ) + 1 );
                    var gestureList = gestureLists[0];

                    if(gestureList.id == this.state.userInfo.id){
                        this.props.userInfo.gesPassword = gestureList.gesturePassword;
                    }
                }
            }else{
                this.gesLists = [];
            }

            this.setState({
                userInfo: UserStore.getUser(),
                myGesPassword: myGes,
                message: myGes==null? '请设置您的手势密码！':'请修改您的手势密码！',
            });
    }
    getList () {
        if( this.props.userInfo && this.props.userInfo.payPassword == '1'){
            if(!this.props.userInfo.gesPassword){
                return [
                    //text, component, func, separator, passProps
                    {title: '修改注册手机号',   component: CheckAuthCode, passProps:{ nextComponent: null,nextPassProps: 'value.mobile',nextTitle: '修改电话号码',title: "修改电话号码",isMobileExist:false},},
                    {title: '修改登陆密码',     component: ChangePassword},
                    {title: '修改支付密码',     component: ChangePayPassword},
                    {title: '找回支付密码',     component: CheckAuthCode, passProps:{ userInfo:this.props.userInfo, nextComponent: FindPayPassword,nextPassProps: 'value.mobile',nextTitle: '重置支付密码',title: "重置支付密码",isMobileExist:true},},
                    {title: '设置手势密码',     component: SetGesturePassword ,passProps:{ userInfo:this.props.userInfo}},
                ];
            }else{
                return [
                    //text, component, func, separator, passProps
                    {title: '修改注册手机号',   component: CheckAuthCode, passProps:{ nextComponent: null,nextPassProps: 'value.mobile',nextTitle: '修改电话号码',title: "修改电话号码",isMobileExist:false},},
                    {title: '修改登陆密码',     component: ChangePassword},
                    {title: '修改支付密码',     component: ChangePayPassword},
                    {title: '找回支付密码',     component: CheckAuthCode, passProps:{ userInfo:this.props.userInfo, nextComponent: FindPayPassword,nextPassProps: 'value.mobile',nextTitle: '重置支付密码',title: "重置支付密码",isMobileExist:true},},
                    {title: '修改手势密码',     component: CheckAuthCode, passProps:{ userInfo:this.props.userInfo, nextComponent: SetGesturePassword,nextPassProps: {userInfo:this.props.userInfo},nextTitle: '修改手势密码',title: "修改手势密码",isMobileExist:true},},
                ];
            }
        }else{
            if(!this.props.userInfo.gesPassword){
                return [
                    //text, component, func, separator, passProps
                    {title: '修改注册手机号',   component: CheckAuthCode, passProps:{ nextComponent: null,nextPassProps: 'value.mobile',nextTitle: '修改电话号码',title: "修改电话号码",isMobileExist:false},},
                    {title: '修改登陆密码',     component: ChangePassword},
                    {title: '设置支付密码',     component: CheckAuthCode, passProps:{ userInfo:this.props.userInfo, nextComponent: SetPayPassword,nextPassProps: 'value.mobile',nextTitle: '设置支付密码',title: "设置支付密码",isMobileExist:true},},
                    {title: '设置手势密码',     component: SetGesturePassword ,passProps:{ userInfo:this.props.userInfo}},
                ];   
            }else{
                return [
                    //text, component, func, separator, passProps
                    {title: '修改注册手机号',   component: CheckAuthCode, passProps:{ nextComponent: null,nextPassProps: 'value.mobile',nextTitle: '修改电话号码',title: "修改电话号码",isMobileExist:false},},
                    {title: '修改登陆密码',     component: ChangePassword},
                    {title: '设置支付密码',     component: CheckAuthCode, passProps:{ userInfo:this.props.userInfo, nextComponent: SetPayPassword,nextPassProps: 'value.mobile',nextTitle: '设置支付密码',title: "设置支付密码",isMobileExist:true},},
                    {title: '修改手势密码',     component: CheckAuthCode, passProps:{ userInfo:this.props.userInfo, nextComponent: SetGesturePassword,nextPassProps: {userInfo:this.props.userInfo},nextTitle: '修改手势密码',title: "修改手势密码",isMobileExist:true},},
                ];
            }
        }
    }


    // refresh(){
    //     this.fetchData();
    // // }

    push(title, component,mypassProps) {

        if(component != null){
            this.props.navigator.push({
                title: title,
                component: component,
                hideNavBar: true,
                passProps: mypassProps,})
            }else
                this.toast(title + '即将开通');
    }

    render () {
        if(!this.state.doRenderScene)
            return this._renderPlaceholderView();
        

        return (
            <View style = {Global._styles.CONTAINER} >
                {this._getNavBar()}
                <ScrollView >
                    <View style={Global._styles.PLACEHOLDER20} />
                    {this._renderList()}

                </ScrollView>
            </View>

                );
    }
    _renderList () {

        var list = this.getList().map(({title, component, separator,passProps}, idx) => {

            var topLine = idx === 0 ? (<View style={Global._styles.FULL_SEP_LINE} />) : null;
            var bottomLine = idx === this.getList().length - 1 ? (<View style={Global._styles.FULL_SEP_LINE} />) : null;

            var itemLine = idx < this.getList().length - 1 ? <View style={Global._styles.SEP_LINE} /> : null;
            if(separator === true)
                itemLine = (
                    <View key={idx + '_' + title} >
                        <View style={Global._styles.FULL_SEP_LINE} />
                        <View style={Global._styles.PLACEHOLDER20} />
                        <View style={Global._styles.FULL_SEP_LINE} />
                    </View>
                );

            return (
                <View key={idx + '_' + title} >
                    {topLine}
                    <TouchableOpacity style={[styles.listItem, Global._styles.CENTER]} onPress={()=>{
                        this.push(title, component, passProps);
                    }} >
                        <Text style={styles.title}>{title}</Text>
                        <EasyIcon iconLib = 'fa' name='angle-right' size={18} color={Global._colors.IOS_ARROW} style={[{width: 30,}]} />
                    </TouchableOpacity>
                    {itemLine}
                    {bottomLine}
                </View>
            );
        });
        return list;
    }
    _renderPlaceholderView () {
        return (
            <View style = {Global._styles.CONTAINER}>
            {this._getNavBar()}
            </View>
        );
    }
    _getNavBar(){
        return(
                <NavBar 
                    navigator={this.props.navigator} 
                    route={this.props.route}
                    title={"安全设置"}
                    backText={"我"}
                     />
            );
    }
}

const styles = StyleSheet.create({
    scrollView: {
        flex: 1,
        backgroundColor: 'white',
        marginBottom: Global._os == 'ios' ? 48 : 0,
    },
    listItem: {
        alignItems: 'center', 
        justifyContent: 'center',//上下
        height: 40,
        width: Global.getScreen().width,
        backgroundColor:'white',
        flexDirection: 'row',
    },
    title:{
        width: Global.getScreen().width/3,
        left: 20,
        flex: 1,
        textAlign:'left',
    },
});

export default SecuritySettings;