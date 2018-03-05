'use strict';

import React, {
  Component,

} from 'react';

import {
  View,
  StyleSheet,
  Animated,
  Easing,
  BackAndroid,
  Text,
  TouchableOpacity,
} from 'react-native';

import PropTypes from 'prop-types';
import UserStore    from '../../flux/UserStore';
import UserAction   from '../../flux/UserAction';
import AuthStore    from '../../flux/AuthStore';
import AuthAction   from '../../flux/AuthAction';

export default class Test extends Component {

  static displayName = 'Test';
  static description = '测试组件';

  static propTypes = {
    idx: PropTypes.number.isRequired,
  };

  static defaultProps = {
    idx: 1,
  };

  /**
   * 构造函数
   */
  constructor (props) {
    super(props);
  }

  /**
   * 重载push，实现权限拦截
   */
  push (route) {
    console.log('xxxxxxxxxxxxxxxx');
    super.pop(route);
  }

  render () {
    return (
      <View>
        <Text style = {{marginTop: 50}} >{this.props.idx}</Text>
        <TouchableOpacity onPress = {() => this.props.navigator.push({
          component: Test,
          passProps: {
            idx: this.props.idx + 1,
          }
        })} >
          <Text>Push</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress = {() => {
          UserAction.login({userName: 'the one', mobile: '13899009876'});
          AuthAction.continuePush();
        }} >
          <Text>模拟登陆</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress = {() => this.props.navigator.pop()} >
          <Text>Pop</Text>
        </TouchableOpacity>
      </View>
    );
  }

}