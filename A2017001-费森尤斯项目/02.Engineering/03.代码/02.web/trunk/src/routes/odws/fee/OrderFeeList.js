import React, { Component } from 'react';
import { connect } from 'dva';
import { Card } from 'antd';
import moment from 'moment';

import CommonTable from '../../../components/CommonTable';

import styles from './Fee.less';

class OrderFeeList extends Component {

  render() {
    const { odws, odwsOrder, utils } = this.props;
    const { odwsWsHeight } = odws;
    const { orders } = odwsOrder;
    const listCardHeight = (odwsWsHeight - 6 - 80) / 2;

    const columns = [
      { title: '处方号', dataIndex: 'patientId', key: 'patientCode', width: 80 },
      { title: '医嘱编号', dataIndex: 'name', key: 'patientName', width: 80 },
      { title: '医嘱子号', dataIndex: 'sex', key: 'patientGender', width: 80, render: text => utils.dicts.dis('SEX', text) },
      { title: '医嘱名称', dataIndex: 'birthday', key: 'patientAge', width: 150, render: text => moment().diff(moment(text), 'years') },
      { title: '剂量', dataIndex: 'feeType', key: 'feeType', width: 60, render: text => utils.dicts.dis('FEE_TYPE', text) },
      { title: '持续时间', dataIndex: 'regId', key: 'regId', width: 80 },
      { title: '单价', dataIndex: 'regLevel', key: 'regLevel', width: 60, render: text => utils.dicts.dis('REG_LEVEL', text) },
      { title: '数量', dataIndex: 'emergencyFalg', key: 'emergencyFalg', width: 60, render: text => utils.dicts.dis('BOOLEAN', text) },
      { title: '总价', dataIndex: 'regTime', key: 'regTime', width: 60, render: (text) => { return text ? moment(text).format('YYYY-MM-DD') : ''; } },
      { title: '状态', dataIndex: 'name', key: 'seeDoc', width: 60 },
    ];

    return (
      <Card style={{ height: `${listCardHeight}px`, marginBottom: '10px' }} className={styles.listCard} >
        <CommonTable
          rowSelection={false}
          data={orders}
          columns={columns}
          pagination={false}
          scroll={{ y: (listCardHeight - 10 - 37) }}
          bordered
          size="middle"
        />
      </Card>
    );
  }
}
export default connect(
  ({ odws, odwsFee, odwsOrder, utils }) => ({ odws, odwsFee, odwsOrder, utils }),
)(OrderFeeList);

