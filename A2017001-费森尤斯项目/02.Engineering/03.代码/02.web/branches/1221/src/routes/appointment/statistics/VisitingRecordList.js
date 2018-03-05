import React, { Component } from 'react';
import { connect } from 'dva';
import { Card } from 'antd';
import moment from 'moment';

import CommonTable from '../../../components/CommonTable';
import SearchBar from './VisitingRecordSearchBar';
import styles from './VisitingRecord.less';

class VisitingRecordList extends Component {


  componentWillMount() {
    // 载入诊疗历史信息
      this.props.dispatch({
        type: 'odwsHistory/loadHistory',
        payload: {
          query: {
            regState: '31',
          },
        },
      });
  }

  componentWillReceiveProps(props) {
    // 当前就诊人发生改变
    if (this.props.odws.currentReg.id !== props.odws.currentReg.id) {
      // 载入诊疗历史信息
      this.props.dispatch({
        type: 'odwsHistory/loadHistory',
        payload: {
          query: {
            patientCode: props.odws.currentReg.patient.patientId,
            regState: '31',
          },
        },
      });
    }
  }

  constructor(props) {
    super(props);
    this.onSearch = this.onSearch.bind(this);
    this.onRowClick = this.onRowClick.bind(this);
  }

  onPageChange(page, values) {
    console.info(page);
    this.props.dispatch({
      type: 'odwsHistory/loadHistory',
      payload: {
          query: {
            regState: '31',
          },
          page, 
      },
    });
  }

  onRowClick(record, idx) {
    this.props.dispatch({
      type: 'visitRecord/loadDetail',
      payload: {
        record,
        listIdx: idx,
      },
    });
  }

  onSearch(values) {
    this.props.dispatch({
      type: 'odwsHistory/loadHistory',
      payload: {
        regState: '31',
        query: values,
      },
    });
  }

  render() {
    const { page, odws, odwsHistory } = this.props;
    const { odwsWsHeight } = odws;
    const { historyRecords, listIdx } = odwsHistory;
    const listCardHeight = odwsWsHeight - 6;
    const columns = [
      { title: '挂号时间', dataIndex: 'regTime', key: 'regTime', width: 140, render: (text) => { return text ? moment(text).format('YYYY-MM-DD hh:mm:ss') : ''; } },
      { title: '患者姓名', dataIndex: 'patient.name', key: 'patient.name', width: 90 },
      { title: '接诊医生', dataIndex: 'seeDoc.name', key: 'seeDoc.name', width: 80 },
    ];
    console.info(page);
    return (
      <Card  className={styles.listCard} >
        <SearchBar onSearch={this.onSearch}  />
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
)(VisitingRecordList);

