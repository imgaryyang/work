import React, { Component } from 'react';
import { connect } from 'dva';
import { Card } from 'antd';
import moment from 'moment';

import CommonTable from '../../../components/CommonTable';
import SearchBar from './InputSearchBar';

import styles from './InStore.less';

class InputList extends Component {

  constructor(props) {
    super(props);
    this.onSearch = this.onSearch.bind(this);
    this.onConfirm = this.onConfirm.bind(this);
    this.onPageChange = this.onPageChange.bind(this);
    this.rowSelectChange = this.rowSelectChange.bind(this);
  }

  componentWillMount() {
    this.props.dispatch({
      type: 'instoredetail/loadRecord',
    });
  }

  onSearch(values) {
    this.props.dispatch({
      type: 'instoredetail/loadRecord',
      payload: {
        query: { ...values },
      },
    });
  }

  onPageChange(page) {
    this.props.dispatch({
      type: 'instoredetail/loadRecord',
      payload: {
        page,
      },
    });
  }

  onConfirm(record) {
    this.props.dispatch({
      type: 'instoredetail/loadDetail',
      payload: {
        query: {
          inBill: record.id,
        },
        page: {
          total: 0,
          pageSize: 10,
          pageNo: 1,
        },
        record,
      },
    });
  }
  rowSelectChange(selectedRowKeys) {
    this.props.dispatch({
      type: 'instoredetail/setState',
      payload: {
        selectedRowKeys,
      },
    });
  }

  render() {
    const { recordData, recordPage } = this.props.instoredetail;
    const { wsHeight } = this.props.base;
    const leftHeight = wsHeight - (3 * 2);
    const { depts, deptsIdx, dicts } = this.props.utils;
    const columns = [
      { title: '入库单号/库房',
        dataIndex: 'id',
        key: 'id',
        width: 200,
        render: (value, record) => {
          return (
            <div>
              {value}<br />{depts.disDeptName(deptsIdx, record.deptId)}
            </div>
          );
        },
      },
      { title: '创建信息',
        dataIndex: 'inOper',
        key: 'inOper',
        width: 160,
        render: (value, record) => {
          return (
            <div>
              {value}<br />
              <font style={{ color: '#bfbfbf' }} >{record ? moment(record.inTime).format('YYYY-MM-DD : HH:mm') : ''}</font>
            </div>
          );
        },
      },
    ];

    return (
      <div style={{ padding: 3 }} >
        <Card className={styles.leftCard} style={{ height: leftHeight }} >
          <SearchBar onSearch={values => this.onSearch(values)} />
          <CommonTable
            data={recordData}
            columns={columns}
            bordered
            pagination
            page={recordPage}
            paginationStyle="mini"
            rowSelection
            onSelectChange={this.rowSelectChange}
            onPageChange={this.onPageChange}
            onRowClick={(record, index) => this.onConfirm(record, index)}
            scroll={{ y: (leftHeight - 160) }}
          />
        </Card>
      </div>
    );
  }
}
export default connect(({ instoredetail, base, utils }) => ({ instoredetail, base, utils }))(InputList);

