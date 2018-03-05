import React, { Component } from 'react';
import { connect } from 'dva';
import { Card } from 'antd';
import moment from 'moment';

import CommonTable from '../../../components/CommonTable';
import SearchBar from './CheckInfoSearchBar';

import styles from './CheckInfo.less';

class CheckInfoList extends Component {

  constructor(props) {
    super(props);
    this.onSearch = this.onSearch.bind(this);
    this.onConfirm = this.onConfirm.bind(this);
    this.onPageChange = this.onPageChange.bind(this);
    this.rowSelectChange = this.rowSelectChange.bind(this);
  }

  componentWillMount() {
    this.props.dispatch({
      type: 'checkInfoSearch/loadCheckInfoBillPage',
    });
  }

  onSearch(values) {
    this.props.dispatch({
      type: 'checkInfoSearch/loadCheckInfoBillPage',
      payload: {
        query: { ...values },
      },
    });
  }

  onPageChange(page) {
    this.props.dispatch({
      type: 'checkInfoSearch/loadCheckInfoBillPage',
      payload: {
        page,
      },
    });
  }

  onConfirm(record) {
    this.props.dispatch({
      type: 'checkInfoSearch/loadCheckInfo',
      payload: {
        query: {
          checkBill: record.id,
        },
        record,
      },
    });
  }
  rowSelectChange(selectedRowKeys) {
    this.props.dispatch({
      type: 'checkInfoSearch/setState',
      payload: {
        selectedRowKeys,
      },
    });
  }

  render() {
    const { data, page } = this.props.checkInfoSearch;
    const { wsHeight } = this.props.base;
    const leftHeight = wsHeight - (3 * 2);
    const { depts, deptsIdx, dicts } = this.props.utils;
    const columns = [
      { title: '盘点单号',
        dataIndex: 'id',
        key: 'id',
        width: 110,
        className: 'text-align-center',
      },
      { title: '状态',
        dataIndex: 'checkState',
        key: 'checkState',
        width: 110,
        className: 'text-align-center',
        render: (value) => {
          return dicts.dis('CHECK_STATE', value);
        },
      },
      { title: '创建信息',
        dataIndex: 'createOper',
        key: 'createOper',
        width: 140,
        render: (value, record) => {
          return (
            <div>
              {value}<br />{depts.disDeptName(deptsIdx, record.deptId)}<br />
              <font style={{ color: '#bfbfbf' }} >{record ? moment(record.createTime).format('YYYY-MM-DD') : ''}</font>
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
            data={data}
            columns={columns}
            bordered
            pagination
            page={page}
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
export default connect(({ checkInfoSearch, base, utils }) => ({ checkInfoSearch, base, utils }))(CheckInfoList);

