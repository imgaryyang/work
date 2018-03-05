import React, { Component } from 'react';
import { connect } from 'dva';
import { Card } from 'antd';
import moment from 'moment';

import CommonTable from '../../../components/CommonTable';

import styles from './Fee.less';

class ChargeFeeList extends Component {

  render() {
    const { odws, odwsOrder, utils } = this.props;
    const { odwsWsHeight } = odws;
    const { orders } = odwsOrder;
    const listCardHeight = (odwsWsHeight - 6 - 80) / 2;

    const columns = [
      { title: '收费项编号', dataIndex: 'patientId', key: 'patientCode', width: 120 },
      { title: '收费项名称', dataIndex: 'name', key: 'patientName', width: 150 },
      { title: '单价', dataIndex: 'sex', key: 'patientGender', width: 60, render: text => utils.dicts.dis('SEX', text) },
      { title: '数量', dataIndex: 'birthday', key: 'patientAge', width: 60, render: text => moment().diff(moment(text), 'years') },
      { title: '总价', dataIndex: 'feeType', key: 'feeType', width: 60, render: text => utils.dicts.dis('FEE_TYPE', text) },
    ];

    return (
      <Card style={{ height: `${listCardHeight}px` }} className={styles.listCard} >
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
)(ChargeFeeList);

