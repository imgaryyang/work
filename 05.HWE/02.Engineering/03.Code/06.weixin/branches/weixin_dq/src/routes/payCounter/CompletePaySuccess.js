/**
 * 充值完成
 */

import React, { Component } from 'react';
import { Button, Icon, Flex } from 'antd-mobile';
// import {
//   InteractionManager,
//   StyleSheet,
//   Text,
//   View,
// } from 'react-native';
// import { connect } from 'react-redux';
// import Button from 'rn-easy-button';
// import Icon from 'rn-easy-icon';
// import Global from '../../Global';
// import PlaceholderView from '../../modules/PlaceholderView';

import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import styles from './CompletePaySuccess.less';
import baseStyles from '../../utils/base.less';


class CompletePaySuccess extends Component {
  constructor(props) {
    super(props);
    this.goBack = this.goBack.bind(this);
  }
  componentWillMount() {
    console.log('componentWillMount begin');
    console.info(this.props);
    console.log('componentWillMount end');
    const { dispatch } = this.props;
    dispatch({
      type: 'base/save',
      payload: {
        title: '支付成功',
        hideNavBarBottomLine: false,
        showCurrHospitalAndPatient: false,
        headerRight: null,
      },
    });
  }
  componentDidMount() {
    // todo
  }
  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'base/save',
      payload: {
        hideNavBarBottomLine: false,
      },
    });
  }
  goBack() {
    this.props.dispatch(routerRedux.go(-2));
  }
  render() {
    const { openid } = this.props.base;
    return (
      <Flex align="center" direction="column" className={styles.container} >
        <Icon type="check-circle-o" className={openid ? styles.icon_wxpay : styles.icon_alipay} />
        <div className={styles.title}>支付成功</div>
        <Button className={openid ? styles.button_wxpay : styles.button_alipay} onClick={this.goBack}><span className={baseStyles.font15}>返回</span></Button>
      </Flex>
    );
  }
}

// export default connect(mapStateToProps)(CompletePaySuccess);
export default connect(({ base }) => ({ base }))(CompletePaySuccess);
