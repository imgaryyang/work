import React from 'react';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import { List, NavBar, Icon } from 'antd-mobile';
import moment from 'moment';

const Item = List.Item;
const Brief = Item.Brief;

class InpatientPaymentRecordList extends React.Component {
  selectMenu() {
    const { dispatch } = this.props;
    dispatch(routerRedux.push({ pathname: '/payCouter/payment', state: { bizType: '02' } }));
  }
  render() {
    const itemList = [];
    const tmpData = this.props.inpatientPaymentRecord.data;
    const map = { C: '现金预存', Z: '支付宝预存', W: '微信预存', B: '银行卡预存' };
    console.log(tmpData);
    if (tmpData && tmpData.length > 0) {
      let i = 0;
      for (const d of tmpData) {
        itemList.push(<Item extra={d.amt} key={i} align="bottom">{map[d.tradeChannel]} <Brief>{moment(d.tradeTime).format('YYYY-MM-DD HH:mm')}</Brief></Item>);
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
        >住院预缴记录
        </NavBar>
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
