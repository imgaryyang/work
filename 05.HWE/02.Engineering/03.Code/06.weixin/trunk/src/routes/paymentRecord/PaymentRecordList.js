import React from 'react';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import { List, NavBar, Icon } from 'antd-mobile';
import moment from 'moment';

const Item = List.Item;
const Brief = Item.Brief;
class PaymentRecordList extends React.Component {
  selectMenu() {
    const { dispatch } = this.props;
    const { match } = this.props;
    console.log(match);
    dispatch(routerRedux.push({ pathname: '/payCouter/payment', state: { bizType: '01' } }));
  }
  render() {
    console.log(this.props.paymentRecord.data);
    const itemList = [];
    const tmpData = this.props.paymentRecord.data;
    if (tmpData && tmpData.length > 0) {
      let i = 0;
      for (const d of tmpData) {
        itemList.push(<Item extra={d.cost} key={i} align="bottom">{d.name} <Brief>{moment(d.recipeTime).format('YYYY-MM-DD HH:mm')}</Brief></Item>);
        i += 1;
      }
    }
    return (
      <div>
        <NavBar
          mode="light"
          icon={<Icon type="left" />}
          onLeftClick={() => console.log('onLeftClick')}
          rightContent={
            <div key="0" type="search" style={{ marginRight: '16px' }} onClick={() => this.selectMenu()} >
              充值
            </div>
          }
        >门诊消费记录
        </NavBar>
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
