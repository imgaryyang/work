import React, { Component } from 'react';
import { connect } from 'dva';
import { Card } from 'antd';

import CommonTable from '../../../components/CommonTable';
import SearchBar from './ProcureSearchBar';

import styles from './ProcurePlanAuitd.less';

class ProcurePlanList extends Component {

  constructor(props) {
    super(props);
    this.onSearch = this.onSearch.bind(this);
    this.onConfirm = this.onConfirm.bind(this);
    this.onPageChange = this.onPageChange.bind(this);
    this.rowSelectChange = this.rowSelectChange.bind(this);
  }

  componentWillMount() {
    this.props.dispatch({
      type: 'matProcureAuitdSearch/loadBuyList',
    });
    this.props.dispatch({
      type: 'matProcureAuitdSearch/load',
    });
  }

  onSearch(values) {
    this.props.dispatch({
      type: 'matProcureAuitdSearch/loadBuyList',
      payload: {
        query: { ...values },
      },
    });
  }

  onPageChange(page) {
    this.props.dispatch({
      type: 'matProcureAuitdSearch/loadBuyList',
      payload: {
        page,
      },
    });
  }

  onConfirm(record) {
    this.props.dispatch({
      type: 'matProcureAuitdSearch/loadBuyDetail',
      payload: {
        query: {
          buyBill: record.buyBill,
        },
        record,
      },
    });
  }
  rowSelectChange(selectedRowKeys) {
    this.props.dispatch({
      type: 'matProcureAuitdSearch/setState',
      payload: {
        selectedRowKeys,
      },
    });
  }

  render() {
    const { matProcureAuitdSearch, base } = this.props;
    const { buyList } = matProcureAuitdSearch;
    const { wsHeight } = base;
    const { data, page } = buyList;
    const columns = [
      { title: '采购单',
        dataIndex: 'buyBill',
        key: 'buyBill',
        width: 110,
        className: 'text-align-center',
      },
      { title: '申请人/申请时间',
        dataIndex: 'createOper',
        key: 'createOper',
        width: 140,
        render: (value, record) => {
          return (
            <div>
              {value}<br />
              <font style={{ color: '#bfbfbf' }} >{record.createTime}</font>
            </div>
          );
        },
      },
      /* { title: '采购单', dataIndex: 'buyBill', key: 'buyBill', width: '50px', className: 'text-align-center' },
      { title: '申请人', dataIndex: 'createOper', key: 'createOper', width: '30px', className: 'text-align-center' },
      { title: '申请时间', dataIndex: 'createTime', key: 'createTime', width: '50px', className: 'text-align-center' },*/
    ];

    const leftHeight = wsHeight - (3 * 2);

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
            rowSelection={true}
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
export default connect(({ matProcureAuitdSearch, base }) => ({ matProcureAuitdSearch, base }))(ProcurePlanList);

