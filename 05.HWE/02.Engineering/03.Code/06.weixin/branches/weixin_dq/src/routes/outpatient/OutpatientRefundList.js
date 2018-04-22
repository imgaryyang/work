import React from 'react';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import { List, Toast, ActivityIndicator, Button } from 'antd-mobile';
import moment from 'moment';
import styles from './OutpatientRefundList.less';
import commonStyles from '../../utils/common.less';
import { filterMoney, filterTextBreak } from '../../utils/Filters';

const { Item } = List;
const { Brief } = Item;

class OutpatientRefundList extends React.Component {
  constructor(props) {
    super(props);
    this.loadData = this.loadData.bind(this);
    this.gotoRefundDetail = this.gotoRefundDetail.bind(this);
    this.onItemClick = this.onItemClick.bind(this);
    this.loadOutpatientRefund = this.loadOutpatientRefund.bind(this);
  }
  componentWillMount() {
    console.log('componentWillMount');
    const { dispatch } = this.props;
    dispatch({
      type: 'base/save',
      payload: {
        title: '就诊卡预存退款',
        hideNavBarBottomLine: false,
        showCurrHospitalAndPatient: true,
        headerRight: null,
      },
    });
  }
  componentDidMount() {
    console.log('componentDidMount');
    this.loadOutpatientRefund();
  }
  componentWillReceiveProps(props) {
    if (props.base.currProfile !== this.props.base.currProfile) {
      this.loadOutpatientRefund();
    }
  }
  componentWillUnmount() {
    console.log('componentWillUnmount');
    const { dispatch } = this.props;
    dispatch({
      type: 'base/save',
      payload: {
        hideNavBarBottomLine: false,
      },
    });
  }
  onItemClick(item) {
    this.props.dispatch({
      type: 'outpatientReturn/setRefundDetailData',
      payload: item,
      callback: () => { this.gotoRefundDetail(); },
    });
  }
  loadOutpatientRefund() {
    const { currHospital, currProfile } = this.props.base;
    if (!currHospital.id) {
      Toast.info('没有当前医院信息！', 2, null, false);
      return;
    }
    if (!currProfile.id) {
      return;
    }
    this.loadData(currProfile);
  }
  gotoRefundDetail() {
    this.props.dispatch(routerRedux.push({
      pathname: 'outpatientRefundDetail',
    }));
  }
  loadData(profile) {
    // 1. 获取当前预存余额
    this.props.dispatch({
      type: 'deposit/getPreStore',
    });
    // 2. 获取充值列表
    const now = new Date();
    const query = {
      proNo: profile.no,
      hosNo: profile.hosNo,
      // tradeChannel: openid ? "'W'" : "'Z'", // 微信/支付宝
      type: '0', // 充值
      // bizType: '00', // 门诊充值
      status: '0', // 成功
      startDate: new Date(now - (24 * 60 * 60 * 1000 * 365)),
      endDate: now,
    };
    this.props.dispatch({
      type: 'outpatientReturn/findChargeList',
      payload: { query },
    });
  }
  render() {
    const { currProfile } = this.props.base;
    const { data: depositData } = this.props.deposit;
    const balance = depositData.balance ? depositData.balance : 0;
    const itemList = [];
    const { data, isLoading } = this.props.outpatientReturn;
    const filterTradeChannel = this.props.base.openid ? 'W' : 'Z';
    // const map = { C: '现金预存', Z: '支付宝预存', W: '微信预存', B: '银行卡预存' };

    if (!currProfile.id) {
      return (
        <div className={styles.container}>
          <div className={commonStyles.emptyView}>请先选择就诊人
            <Button
              type="ghost"
              inline
              style={{ marginTop: 10, width: 200 }}
              onClick={() => this.props.dispatch(routerRedux.push({ pathname: 'choosePatient' }))}
            >选择就诊人
            </Button>
          </div>
        </div>
      );
    }
    if (isLoading) {
      return (
        <div className={styles.container}>
          <ActivityIndicator
            toast
            text="正在载入，请稍候..."
            animating={isLoading}
          />
        </div>
      );
    }

    if (data && data.length > 0) {
      let i = 0;
      for (const item of data) {
        if (item.tradeChannel === filterTradeChannel) {
          itemList.push(<Item
            key={i}
            arrow="horizontal"
            onClick={() => { this.onItemClick(item); }}
            align="top"
            multipleLine
          >
            <Brief><span className={styles.title}>订单号</span><span className={styles.content}>{item.tradeNo}</span></Brief>
            <Brief>
              <span className={styles.title}>充值时间</span>
              <span className={styles.content}>{item.tradeTime ? moment(item.tradeTime).format('YYYY-MM-DD HH:mm:ss') : '' }</span>
            </Brief>
            <Brief>
              <span className={styles.title}>支付金额</span>
              <span className={styles.content}>{item.amt ? item.amt.formatMoney() : ''}元 </span>&nbsp;
              <span className={styles.title}>已退金额</span>
              <span className={styles.content}>{item.refunded ? item.refunded.formatMoney() : '0.00'}元 </span>
            </Brief>
          </Item>);
        }
        i += 1;
      }
    }

    const content = (
      data.length === 0 ? (
        <div className={commonStyles.emptyView}>
          {filterTextBreak(`暂无${currProfile.name}（卡号：${currProfile.no}）\n的门诊充值信息！`)}
        </div>
      ) : itemList
    );
    return (
      <div className={styles.container}>
        <div className={styles.header}>当前余额&nbsp;{filterMoney(balance)}元</div>
        <div>
          {content}
        </div>
      </div>
    );
  }
}

OutpatientRefundList.propTypes = {
};
export default connect(({ outpatientReturn, deposit, base }) => ({ outpatientReturn, deposit, base }))(OutpatientRefundList);
