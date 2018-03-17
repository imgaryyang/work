import React from 'react';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import { List, NavBar } from 'antd-mobile';
import moment from 'moment';
import ProfileList from '../patients/ProfileList';

const { Item } = List;
const { Brief } = Item;
class InpatientPaymentRecordList extends React.Component {
  constructor(props) {
    super(props);
    this.callback = this.callback.bind(this);
    this.loadData = this.loadData.bind(this);
  }
  gotoForegift() {
    const { dispatch } = this.props;
    dispatch(routerRedux.push({ pathname: '/payCouter/payment', state: { bizType: '04' } }));
  }
  callback(item) {
    const selectProfile = item;
    this.loadData(selectProfile);
  }

  loadData(profile) {
    const query = { proNo: profile.no, hosNo: profile.hosNo };
    console.info('query', query);
    this.props.dispatch({
      type: 'inpatientPaymentRecord/findChargeList',
      payload: query,
    });
  }
  render() {
    const itemList = [];
    const tmpData = this.props.inpatientPaymentRecord.data;
    const map = { C: '现金预存', Z: '支付宝预存', W: '微信预存', B: '银行卡预存' };
    console.log(tmpData);
    if (tmpData && tmpData.length > 0) {
      let i = 0;
      for (const d of tmpData) {
        itemList.push(<Item extra={`${d.amt.formatMoney()}元`} key={i} align="bottom">{map[d.tradeChannel]} <Brief>{moment(d.tradeTime).format('YYYY-MM-DD HH:mm:ss')}</Brief></Item>);
        i += 1;
      }
    }
    return (
      <div>
        <NavBar
          mode="light"
          rightContent={
            <div key="0" type="search" style={{ marginRight: '16px' }} onClick={() => this.gotoForegift()} >
              充值
            </div>
          }
        >住院预缴记录
        </NavBar>
        <ProfileList callback={this.callback} />
        <List className="my-list">
          {itemList}
        </List>
      </div>
    );
  }
}

InpatientPaymentRecordList.propTypes = {
};

export default connect(({ inpatientPaymentRecord, base }) => ({ inpatientPaymentRecord, base }))(InpatientPaymentRecordList);
