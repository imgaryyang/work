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
import * as Global  	from '../../Global';
import UserAction       from '../../flux/UserAction';
import Form             from '../../lib/form/EasyForm';
import FormConfig       from '../../lib/form/config/DefaultConfig';

import NavBar       	from 'rn-easy-navbar';
import Button           from 'rn-easy-button';
import Separator        from 'rn-easy-separator';

const FIND_URL 		= 'el/user/changeUserInfo';

class EditProfile extends Component {

  static displayName = 'EditPrfile';
  static description = '个人资料编辑';
  form = null;
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
    value: {
      nickname: this.props.userInfo.nickname,
      gender:this.props.userInfo.gender,
      email:this.props.userInfo.email,},
    userInfo: this.props.userInfo,
    buttonDisable: false,

  };

  constructor (props) {
    super(props);
    this.componentWillReceiveProps = this.componentWillReceiveProps.bind(this);
    this.onChange = this.onChange.bind(this);
    this.saveCheck = this.saveCheck.bind(this);
    this.doSave = this.doSave.bind(this);
    this.goPop = this.goPop.bind(this);
    this.componentDidMount = this.componentDidMount.bind(this);

  }

  async componentDidMount () {

    InteractionManager.runAfterInteractions(() => {
      // console.log("HHHHHHHHHHHHHHHHHH");
      // console.log(this.state.userInfo);
      this.setState({
        doRenderScene: true,
      });
    });
  }
  componentWillReceiveProps () {

  }
  onChange (fieldName, fieldValue, formValue) {
    // console.log(this.state.value);
    this.setState({value: formValue});
  }

  saveCheck (){
    if(!this.form.validate()){
      Alert.alert(
        '错误',
        '输入数据不满足格式要求,请重新输入!',
        [
          {
            text: '确定', onPress: () => {
            this.setState({value: {
              nickname: this.props.userInfo.nickname,
              gender:this.props.userInfo.gender,
              email:this.props.userInfo.email,},
            });
          }
          }
        ]
      );
    }else{
      this.doSave();
    }
  }
  async doSave () {

    this.showLoading();
    this.setState({
      loaded: false,
      fetchForbidden: false,
      buttonDisable: true,
    });
    try {
      let responseData = await this.request(Global._host + FIND_URL, {
        body: JSON.stringify(this.state.value)
      });
      this.hideLoading();

      this.toast('修改成功！');
      UserAction.onUpdateUser(responseData.result);
      // this.goPop();
      this.props.navigator.popToTop();
      // console.log(responseData);

    } catch(e) {
      this.setState({
        buttonState: true,
      });
      this.hideLoading();
      this.handleRequestException(e);
    }
  }
  // refresh(){
  //     this.fetchData();
  // }

  goPop(){
    this.props.navigator.pop();

  }
  render () {
    if(!this.state.doRenderScene)
      return this._renderPlaceholderView();
    var picBgHeight =100;

    let genders = [
      {label: '女', value: '0'},
      {label: '男', value: '1'},
    ];
    return (
      <View style = {Global._styles.CONTAINER} >
        {this._getNavBar()}

        <ScrollView style={styles.scrollView} keyboardShouldPersistTaps = {true}>
          <View style={Global._styles.PLACEHOLDER20} />

          <Form ref = {(c) => this.form = c} onChange = {this.onChange} config = {FormConfig} labelWidth={80} value = {this.state.value} showLabel = {true}>
            <Form.TextInput name = "nickname" label = "昵称" placeholder = {this.state.userInfo.nickname==null?'昵称将用与显示':this.state.userInfo.nickname}  clearTextOnFocus={true} />
            <Form.Checkbox name = "gender" label = "性别"  dataSource = {genders} />
            <Form.TextInput name = "email" label = "电子邮箱" disable ={false} placeholder = {this.state.userInfo.email==null?'未填写':this.state.userInfo.email} dataType = "email" clearTextOnFocus={true} />
          </Form>



          <View style={Global._styles.PLACEHOLDER20} />
          <View style={Global._styles.PLACEHOLDER20} />

          <View style = {styles.buttonHolder} >
            <Button text = "取消" onPress = {this.goPop} theme = {Button.THEME.BLUE}/>
            <Separator width = {10} />
            <Button text = "保存" onPress = {this.saveCheck} theme = {Button.THEME.BLUE} disable={this.state.buttonDisable}/>
          </View>
          <View style={Global._styles.PLACEHOLDER20} />
          <View style={Global._styles.PLACEHOLDER20} />

        </ScrollView>

      </View>

    );
  }
  _renderPlaceholderView () {
    return (
      <View style = {Global._styles.CONTAINER}>
        {this._getNavBar}
      </View>
    );
  }
  _getNavBar(){
    return(
      <NavBar
        navigator={this.props.navigator}
        route={this.props.route}
        hideBackButton = {false}
        title={"个人资料编辑"}
        backText={"个人资料"}
      />
    );
  }
}

const styles = StyleSheet.create({
  // <Form.TextInput name = "wechat" label = "微信" placeholder = {this.state.userInfo.wechat} clearTextOnFocus={true} />
  // <Form.TextInput name = "qq" label = "QQ" placeholder = {this.state.userInfo.qq} clearTextOnFocus={true} />
  // <Form.TextInput name = "email" label = "电子邮箱" placeholder = {this.state.userInfo.email} dataType = "email" clearTextOnFocus={true} />

  scrollView: {
    flex: 1,
    // backgroundColor: 'white',
  },
  listItem: {
    alignItems: 'center',
    paddingLeft: 10,
    paddingRight: 30,
    justifyContent: 'center',//上下
    height: 40,
    backgroundColor:'white',
    flexDirection: 'row',
  },
  portrait:{
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  buttonHolder:{
    flexDirection: 'row',
    marginTop: 0,
    marginLeft: 10,
    marginRight: 10,
  },
});

export default EditProfile;