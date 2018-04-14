/**
 * 退款成功
 */

import React, { Component } from 'react';
import { Button, Icon, Flex } from 'antd-mobile';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import styles from './CompleteRefundSuccess.less';


class CompleteRefundSuccess extends Component {
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
        title: '退款成功',
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
    this.props.dispatch(routerRedux.go(-3));
  }
  render() {
    const { openid } = this.props.base;
    return (
      <Flex align="center" direction="column" className={styles.container} >
        <Icon type="check-circle-o" className={openid ? styles.icon_wxpay : styles.icon_alipay} />
        <div className={styles.title}>退款成功</div>
        <Button className={openid ? styles.button_wxpay : styles.button_alipay} onClick={this.goBack}><span className={styles.font15}>返回首页</span></Button>
      </Flex>
    );
  }
}

// export default connect(mapStateToProps)(CompleteRefundSuccess);
export default connect(({ base }) => ({ base }))(CompleteRefundSuccess);
