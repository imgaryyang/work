import React from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { List, Toast, ActivityIndicator, Button } from 'antd-mobile';
import moment from 'moment';

import styles from './InpatientPrepaidRecords.less';
import commonStyles from '../../utils/common.less';

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
        title: '住院预缴记录',
        hideNavBarBottomLine: false,
        showCurrHospitalAndPatient: true,
        headerRight: null,
      },
    });
  }

  componentDidMount() {
    this.loadData();
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

    const query = { proNo: currProfile.no, hosNo: currHospital.hosNo };
    // console.info('query', query);
    this.props.dispatch({
      type: 'inpatientPaymentRecord/findChargeList',
      payload: query,
    });
  }

  render() {
    const { currProfile } = this.props.base;
    const { data, isLoading } = this.props.inpatientPaymentRecord;

    if (!currProfile.id) {
      return (
        <div className={styles.container}>
          <div className={commonStyles.emptyView}>请先选择就诊人！
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
          <div className={commonStyles.emptyView}>{`暂无${currProfile.name}（卡号：${currProfile.no}）的住院预缴信息！`}</div>
        </div>
      );
    }

    const itemList = [];
    const map = { C: '现金预存', Z: '支付宝预存', W: '微信预存', B: '银行卡预存' };
    // console.log(data);
    if (data && data.length > 0) {
      let i = 0;
      for (const d of data) {
        itemList.push((
          <div key={i} className={styles.itemContainer}>
            <div className={styles.channel}>{map[d.tradeChannel] || '未知渠道'}</div>
            <div className={styles.amtContainer}>
              <span className={styles.date}>{d.tradeTime ? moment(d.tradeTime).format('YYYY-MM-DD HH:mm:ss') : ''}</span>
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
