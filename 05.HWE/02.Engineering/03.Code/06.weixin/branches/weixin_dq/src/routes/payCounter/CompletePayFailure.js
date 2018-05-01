/**
 * 充值失败
 */

import React, { Component } from 'react';
import { Button, Icon, Flex } from 'antd-mobile';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import styles from './CompletePaySuccess.less';
import baseStyles from '../../utils/base.less';

class CompletePayFailure extends Component {
  constructor(props) {
    super(props);
    this.goBack = this.goBack.bind(this);
  }
  componentWillMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'base/save',
      payload: {
        title: '支付失败',
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
        <Icon type="cross-circle" className={openid ? styles.icon_wxpay : styles.icon_alipay} />
        <div className={styles.title}>支付失败</div>
        <Button className={openid ? styles.button_wxpay : styles.button_alipay} onClick={this.goBack}><span className={baseStyles.font15}>返回</span></Button>
      </Flex>
    );
  }
}

// export default connect(mapStateToProps)(CompletePaySuccess);
export default connect(({ base }) => ({ base }))(CompletePayFailure);
