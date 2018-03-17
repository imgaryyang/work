import React from 'react';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import { List, NavBar } from 'antd-mobile';
import moment from 'moment';
import ProfileList from '../patients/ProfileList';

const { Item } = List;
const { Brief } = Item;
class PaymentRecordList extends React.Component {
  constructor(props) {
    super(props);
    this.callback = this.callback.bind(this);
    this.loadData = this.loadData.bind(this);
  }
  gotoDeposit() {
    const { dispatch } = this.props;
    const { match } = this.props;
    console.log(match);
    dispatch(routerRedux.push({ pathname: '/payCouter/payment', state: { bizType: '00' } }));
  }
  callback(item) {
    const selectProfile = item;
    this.loadData(selectProfile);
  }

  loadData(profile) {
    const query = { proNo: profile.no, hosNo: profile.hosNo };
    console.info('query', query);
    this.props.dispatch({
      type: 'paymentRecord/findChargeList',
      payload: query,
    });
  }
  render() {
    console.log(this.props.paymentRecord.data);
    const itemList = [];
    const tmpData = this.props.paymentRecord.data;
    if (tmpData && tmpData.length > 0) {
      let i = 0;
      for (const d of tmpData) {
        itemList.push(<Item extra={`${d.cost.formatMoney()}元`} key={i} align="bottom">{d.name} <Brief>{moment(d.recipeTime).format('YYYY-MM-DD HH:mm')}</Brief></Item>);
        i += 1;
      }
    }
    return (
      <div>
        <NavBar
          mode="light"
          rightContent={
            <div key="0" type="search" style={{ marginRight: '16px' }} onClick={() => this.gotoDeposit()} >
              充值
            </div>
          }
        >门诊消费记录
        </NavBar>
        <ProfileList callback={this.callback} />
        <List className="my-list">
          {itemList}
        </List>
      </div>
    );
  }
}

PaymentRecordList.propTypes = {
};

export default connect(paymentRecord => (paymentRecord))(PaymentRecordList);
