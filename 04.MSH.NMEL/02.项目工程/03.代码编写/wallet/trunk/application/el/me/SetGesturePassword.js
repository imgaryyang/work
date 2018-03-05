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
    Alert,
    AsyncStorage,
} from 'react-native';

import * as Global      from '../../Global';
import UserStore        from '../../flux/UserStore';
import PasswordGesture  from 'react-native-gesture-password';

const FIND_URL = 'el/user/setGesturePassword/';

class SetGesturePassword extends Component {

    //根据用户id查询AsyncStorage 如果有记录则设置手势密码 否则验证
    static displayName = 'SetGesturePassword';
    static description = '设置、修改手势密码';

    static propTypes = {
    };

    static defaultProps = {
    };

    gesLists = [];
    state = {
        doRenderScene: false,
        userInfo: null,
        myGesPassword: {},
        status: 'normal',
        message: '',
    };

    constructor (props) {
        super(props);

        this.componentDidMount          = this.componentDidMount.bind(this);
        this.getUserGesture             = this.getUserGesture.bind(this);
        this.onEnd                     = this.onEnd.bind(this);
        this.onStart                     = this.onStart.bind(this);
        this.onReset                     = this.onReset.bind(this);
        this.goPop                     = this.goPop.bind(this);
        this.getUser                     = this.getUser.bind(this);

    }

    componentDidMount () {
        this.unUserStoreChange = UserStore.listen(this.onUserStoreChange);

        InteractionManager.runAfterInteractions(() => {
            this.getUser();
            this.getUserGesture();
            this.setState({doRenderScene: true,});
        });
    }
    onUserStoreChange (_user) {
        // console.log('========================profile UserStore   Changed!!! =======================');
        this.setState({
            userInfo: _user.user,
        });
        // console.log(this.state.userInfo.portrait);
        // console.log('========================hUserStore.getUser()aha UserStore   Changed!!! =======================');
    }
    componentWillUnmount () {
        this.unUserStoreChange();
    }
    async getUser () {
        this.setState({
            userInfo: UserStore.getUser(),
        });
    }
    async getUserGesture () {

        var userInfo = UserStore.getUser();
        var myGes = null ;
        this.gesLists  = await AsyncStorage.getItem(Global._ASK_USER_GESLISTS);
            this.gesLists = JSON.parse(this.gesLists);
            if(this.gesLists!= null){
            console.log("this.gesLists!= null");
            console.log("this.gesLists.lenght= "+this.gesLists.length);

                for(var ii=0;ii<this.gesLists.length;ii++){
                    var gestureLists = this.gesLists.slice( ii, parseInt( ii ) + 1 );
                    var gestureList = gestureLists[0];
                    console.log("gestureList=="+ gestureList);
                    console.log("ii=="+ ii + " id == " + gestureList.id)

                    if(gestureList.id == this.state.userInfo.id){
                        var myGes = gestureList;
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
            console.log(this.state.myGesPassword);
    }
    
    goPop (){
        this.props.navigator.pop();

    }

    onEnd (password) {
        if (this.state.myGesPassword ==null){
            this.gesLists.push({ id: this.state.userInfo.id, gesturePassword: password, });
            this.setState({
                myGesPassword: {id:this.state.userInfo.id, gesturePassword: password,},
                status: 'right',
                message: '手势密码保存成功!'
            });
            this.toast('手势密码保存成功！');
            this.goPop();

        }else{
            for(var ii=0;ii<this.gesLists.length;ii++){
                var gestureLists = this.gesLists.slice( ii, parseInt( ii ) + 1 );
                var gestureList = gestureLists[0];

                if(gestureList.id == this.state.userInfo.id){
                    this.gesLists.splice( ii, 1 ,{
                        id:this.state.userInfo.id, 
                        gesturePassword: password,
                    });
                }
            }
            
            this.setState({
                status: 'right',
                message: '手势密码修改成功！.'
            });
            this.toast('手势密码验证成功！');
            this.goPop();
        }
        AsyncStorage.setItem(Global._ASK_USER_GESLISTS,JSON.stringify(this.gesLists));
    }
    onStart () {
        if(this.state.myGesPassword==null){
            this.setState({
                status: 'normal',
                message: '请设置您的手势密码！'
            });
        }else{
            this.setState({
                status: 'normal',
                message: '请输入新的手势密码！'
            });
        }

        
    }
    onReset () {
        this.setState({
            status: 'normal',
            message: '请再次输入手势密码！'
        });
    }
    
    render () {
        return (
            <PasswordGesture
                ref='pg'
                status={this.state.status}
                message={this.state.message}
                onStart={() => this.onStart()}
                onEnd={(password) => this.onEnd(password)}/>
        );
    }
}
    

const styles = StyleSheet.create({
    scrollView: {
        flex: 1,
    },
    logoHolder: {
        height: Global.getScreen().height / 4,
    },
    logo: {
        width: Global.getScreen().height / 4 * .5,
        height: Global.getScreen().height / 4 * .5,
        backgroundColor: 'transparent',
    },
});

export default SetGesturePassword;