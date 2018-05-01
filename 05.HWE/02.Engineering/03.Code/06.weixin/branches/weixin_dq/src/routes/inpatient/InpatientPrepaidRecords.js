import React from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { List, Toast, ActivityIndicator, WhiteSpace, Button } from 'antd-mobile';
import moment from 'moment';

import styles from './InpatientPrepaidRecords.less';
import baseStyles from '../../utils/base.less';

class InpatientPrepaidRecords extends React.Component {
  constructor(props) {
    super(props);
    this.loadData = this.loadData.bind(this);
  }

  componentWillMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'base/save',
      payload: {
        title: '住院预缴记录查询',
        hideNavBarBottomLine: false,
        showCurrHospitalAndPatient: true,
        allowSwitchPatient: true,
        headerRight: null,
      },
    });
  }

  componentDidMount() {
    const { currProfile } = this.props.base;
    const arr = Object.keys(currProfile);
    // 已经选择了就诊人
    if (arr.length !== 0) {
      this.loadData();
    }
  }

  componentWillReceiveProps(props) {
    if (props.base.currProfile !== this.props.base.currProfile) {
      this.loadData();
    }
  }

  loadData() {
    const { currHospital, currProfile } = this.props.base;
    if (!currHospital.id) {
      Toast.info('没有当前医院信息！', 2, null, false);
      return;
    }
    if (!currProfile.id) {
      return;
    }
    const now = new Date();
    const query = {
      proNo: currProfile.no,
      hosNo: currHospital.hosNo,
      startDate: moment(new Date(now - (24 * 60 * 60 * 1000 * 365))).format('YYYY-MM-DD'),
      endDate: moment(now).format('YYYY-MM-DD'),
    };
    this.props.dispatch({
      type: 'inpatientPaymentRecord/findChargeList',
      payload: { query },
    });
  }

  render() {
    const { currProfile } = this.props.base;
    const { data, isLoading } = this.props.inpatientPaymentRecord;

    if (!currProfile.id) {
      return (
        <div className={styles.container}>
          <div className={baseStyles.emptyView}>请先选择就诊人！
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

    if (data.length === 0) {
      return (
        <div className={styles.container}>
          <div className={baseStyles.emptyView}>{`暂无${currProfile.name}（卡号：${currProfile.no}）的住院预缴信息！`}</div>
        </div>
      );
    }

    const itemList = [];
    // const map = { C: '现金', Z: '支付宝', W: '微信', B: '银行卡' };
    // const typeMap = { 0: '充值', 1: '退款', 2: '冻结' };
    // console.log(data);
    if (data && data.length > 0) {
      let i = 0;
      for (const d of data) {
        itemList.push((
          <div key={i} className={styles.itemContainer}>
            <div className={styles.date}>{d.tradeTime ? moment(d.tradeTime).format('YYYY-MM-DD HH:mm:ss') : ''}</div>
            <WhiteSpace size="md" />
            <div className={styles.amtContainer}>
              <span className={styles.channel}>{d.tradeChannel || '未知渠道'}</span>
              {/* <span className={styles.date}>{typeMap[d.type]}</span> */}
              <span className={styles.amt}>{`${d.amt.formatMoney()}元`}</span>
            </div>
          </div>
        ));
        i += 1;
      }
    }
    return (
      <div className={styles.container}>
        <List className="my-list">
          {itemList}
        </List>
      </div>
    );
  }
}

InpatientPrepaidRecords.propTypes = {
};

export default connect(({ inpatientPaymentRecord, base }) => ({ inpatientPaymentRecord, base }))(InpatientPrepaidRecords);
