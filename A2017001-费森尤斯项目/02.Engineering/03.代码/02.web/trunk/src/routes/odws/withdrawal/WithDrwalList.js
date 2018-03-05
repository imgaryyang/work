import React, { Component } from 'react';
import { connect } from 'dva';
import { Card } from 'antd';
import moment from 'moment';

import CommonTable from '../../../components/CommonTable';
import WithDrwalSearchBar from './WithDrwalSearchBar';
import styles from './WithDrwal.less';

class WithDrwalList extends Component {


  componentWillMount() {
    // 载入诊疗历史信息
      this.props.dispatch({
        type: 'visitRecord/loadHistoryFeeItem',
      });
  }


  constructor(props) {
    super(props);
    this.onSearch = this.onSearch.bind(this);
    this.onRowClick = this.onRowClick.bind(this);
  }

  onPageChange(page, values) {
    console.info(page);
    this.props.dispatch({
      type: 'visitRecord/loadHistoryFeeItem',
      payload: {
          query: {
          },
          page,
      },
    });
  }

  onRowClick(record, idx) {
    this.props.dispatch({
      type: 'visitRecord/loadDetailOrders',
      payload: {
        record,
        listIdx: idx,
      },
    });
  }

  onSearch(values) {
    console.log(222);
    this.props.dispatch({
      type: 'visitRecord/loadHistoryFeeItem',
      payload: {
        query: values,
      },
    });
  }

  render() {
    const { page, odws, visitRecord } = this.props;
    const { odwsWsHeight } = odws;
    const { historyRecords, listIdx } = visitRecord;
    const listCardHeight = odwsWsHeight - 6;
    const columns = [
      { title: '挂号时间', dataIndex: 'createTime', key: 'createTime', width: 140 },
      { title: '患者姓名', dataIndex: 'patient.name', key: 'patient.name', width: 90 },
      { title: '接诊医生', dataIndex: 'seeDoc.name', key: 'seeDoc.name', width: 80 },
    ];
    return (
      <Card  className={styles.listCard} >
        <WithDrwalSearchBar onSearch={this.onSearch}  />
        <CommonTable
          rowSelection={false}
          data={historyRecords}
          page={page}
          columns={columns}
          onRowClick={this.onRowClick}
          onPageChange={this.onPageChange.bind(this)}
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
  ({ odws, odwsHistory, utils, visitRecord }) => ({ odws, odwsHistory, utils, visitRecord }),
)(WithDrwalList);

