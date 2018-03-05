'use strict';

import React, {
  Component,

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
  Alert,
  AsyncStorage,
} from 'react-native';

import PropTypes from 'prop-types';
import * as Global      from '../../Global';
import UserStore        from '../../flux/UserStore';
import UserAction        from '../../flux/UserAction';
// import PasswordGesture  from 'react-native-gesture-password';

const FIND_URL = 'el/user/setGesturePassword/';

class SetGesturePassword extends Component {

  //根据用户id查询AsyncStorage 如果有记录则设置手势密码 否则验证
  static displayName = 'SetGesturePassword';
  static description = '设置、修改手势密码';

  static propTypes = {
    /*
    ** 用户信息
    */
    userInfo: PropTypes.object.isRequired,
    state: PropTypes.string.isRequired,
  };

  static defaultProps = {
  };
  gesLists = [];
  state = {
    doRenderScene: false,
    userInfo: this.props.userInfo,
    status: 'normal',
    message: '请输入手势密码',
    gesPassword:null,
  };

  constructor (props) {
    super(props);

    this.componentDidMount          = this.componentDidMount.bind(this);
    this.onUserStoreChange          = this.onUserStoreChange.bind(this);
    this.getUserGesture             = this.getUserGesture.bind(this);
    this.onEnd                     = this.onEnd.bind(this);
    this.onStart                     = this.onStart.bind(this);
    this.onReset                     = this.onReset.bind(this);
    this.goPop                     = this.goPop.bind(this);

  }

  componentDidMount () {
    // this.unUserStoreChange = UserStore.listen(this.onUserStoreChange);
    InteractionManager.runAfterInteractions(() => {
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
    // this.unUserStoreChange();
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
  }

  goPop (){
    this.props.navigator.pop();

  }

  onEnd (password) {
    if(this.state.gesPassword==null){
      // this.toast("第11111次======");
      //第一次输入
      this.state.gesPassword=password;
      this.setState({
        status: 'normal',
        message: '请再次设置您的手势密码！'
      });
      this.onReset();
    }else{
      //第二次输入手势密码
      // this.toast("第二次======");
      if(this.state.gesPassword != password){
        //两次输入不相同
        this.setState({
          status: 'wrong',
          message: '两次输入手势密码不同，请重新输入!',
          gesPassword:null,
        });
      }else{
        //两次输入相同
        if(!this.state.userInfo.gesPassword){
          //没有设置过手势密码
          this.state.userInfo.gesPassword = password;
          UserAction.onUpdateUser(this.state.userInfo);
          this.gesLists.push({ id: this.state.userInfo.id, gesturePassword: password, });
          this.setState({
            status: 'right',
            message: '手势密码保存成功!'
          });
          this.goPop();
          // this.toast('手势密码
        }else{
          //修改手势密码
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
          // this.toast('手势密码验证成功！');
          this.props.navigator.goToTop();
        }
        AsyncStorage.setItem(Global._ASK_USER_GESLISTS,JSON.stringify(this.gesLists));
      }
    }
  }
  onStart () {

  }
  onReset() {

  }


  render () {
    return (
      <PasswordGesture
        ref='pg'
        status={this.state.status}
        message={this.state.message}
        onStart={() => this.onStart()}
        onReset={() => this.onReset()}
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