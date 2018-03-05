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
} from 'react-native';

import * as Global  from '../../Global';
import NavBar       from 'rn-easy-navbar';

class ContactUs extends Component {



  static displayName = 'ContactUs';
  static description = '联系我们';

  static propTypes = {

  };

  static defaultProps = {

  };


  state = {
    doRenderScene: false,
    data: null,
  };

  constructor (props) {
    super(props);
  }

  componentDidMount () {
    InteractionManager.runAfterInteractions(() => {
      this.setState({doRenderScene: true});
    });
  }

  componentWillReceiveProps () {

  }
  async fetchData () {
    //获取消息
    var FIND_URL = 'el//';
    this.showLoading();
    this.setState({
      loaded: false,
      fetchForbidden: false,
    });
    try {
      let responseData = await this.request(Global._host + FIND_URL, {
        body: JSON.stringify({

        })
      });
      this.hideLoading();
      this.data = responseData.body;
      // console.log(responseData);
      if (responseData1.success == false) {
        Alert.alert(
          '提示',
          responseData.msg ,
          [
            {
              text: '确定', onPress: () => {
              this.setState({bankCards: null,});
            }
            }
          ]
        );
      } else {
        this.toast('成功！');
      }
    } catch(e) {
      this.hideLoading();

      this.handleRequestException(e);
    }
  }
  // refresh(){
  //     this.fetchData();
  // }
  render () {
    if(!this.state.doRenderScene)
      return this._renderPlaceholderView();


    return (
      <View style = {Global._styles.CONTAINER} >
        <ScrollView style={styles.scrollView}>

          {this._getNavBar()}
          <View style={Global._styles.PLACEHOLDER20} />
          <View style={Global._styles.FULL_SEP_LINE} />
          <View style={[styles.holder]}>
            <Text>内蒙古科电数据服务有限公司</Text>
          </View>
          <View style={Global._styles.FULL_SEP_LINE} />
          <View style={[styles.holder]}>
            <Text>客 服 电 话： 0471-12345678</Text>
          </View>
          <View style={Global._styles.FULL_SEP_LINE} />
          <View style={[styles.holder]}>
            <Text>商户合作电话：0471-12345678</Text>
          </View>
          <View style={Global._styles.FULL_SEP_LINE} />
          <View style={[styles.holder]}>
            <Text>邮  箱：ides@ides.com.cn</Text>
          </View>
          <View style={Global._styles.FULL_SEP_LINE} />
          <View style={[styles.holder]}>
            <Text>地  址：呼和浩特市赛罕区学府康都B座4层</Text>
          </View>
          <View style={Global._styles.FULL_SEP_LINE} />
          <View style={[styles.holder2]}>
            <Text style={styles.text}>工作时间：周一至周五9：00-18：00</Text>
            <Text style={styles.text}>法定节假日休息！</Text>
          </View>

        </ScrollView>
      </View>

    );
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
        title={"联系我们"}
        backText={"我"}/>
    );
  }
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    marginBottom: Global._os == 'ios' ? 48 : 0,
  },
  text:{
    fontSize: 13,
  },
  holder: {
    height: 40,
    paddingLeft:20,
    // alignItems: 'center',
    justifyContent: 'center',//上下
    backgroundColor: 'white',
  },
  holder2: {
    height: 40,
    paddingLeft:20,
    // alignItems: 'center',
    justifyContent: 'center',//上下
  },
});

export default ContactUs;