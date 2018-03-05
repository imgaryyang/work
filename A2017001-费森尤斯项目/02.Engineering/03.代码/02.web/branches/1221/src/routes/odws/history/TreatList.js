import React, { Component } from 'react';
import { connect } from 'dva';
import { Card } from 'antd';
import moment from 'moment';

import CommonTable from '../../../components/CommonTable';

import styles from './History.less';

class TreatList extends Component {

  constructor(props) {
    super(props);
    this.onRowClick = this.onRowClick.bind(this);
  }

  onRowClick(record, idx) {

    this.props.dispatch({
      type: 'odwsHistory/setState',
      payload: {
        record,
        listIdx: idx,
      },
    });
  }

  render() {
    const { odws, odwsHistory } = this.props;
    const { odwsWsHeight } = odws;
    const { historyRecords, listIdx } = odwsHistory;
    const listCardHeight = odwsWsHeight - 6;

    const columns = [
      { title: '就诊时间', dataIndex: 'seeBegin', key: 'seeBegin', width: 140, render: (text) => { return text ? moment(text).format('YYYY-MM-DD hh:mm:ss') : ''; } },
      { title: '科室', dataIndex: 'seeDept.deptName', key: 'seeDept.deptName', width: 90 },
      { title: '医生', dataIndex: 'seeDoc.name', key: 'seeDoc.name', width: 80 },
    ];

    return (
      <Card style={{ height: `${listCardHeight}px` }} className={styles.listCard} >
        <CommonTable
          rowSelection={false}
          data={historyRecords}
          columns={columns}
          onRowClick={this.onRowClick}
          paginationStyle="mini"
          scroll={{ y: (listCardHeight - 10 - 37) }}
          rowClassName={
            (record, idx) => { return idx === listIdx ? 'selectedRow' : ''; }
          }
          bordered
          size="middle"
        />
      </Card>
    );
  }
}
export default connect(
  ({ odws, odwsHistory, utils }) => ({ odws, odwsHistory, utils }),
)(TreatList);

