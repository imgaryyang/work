import React, { Component } from 'react';
import { connect } from 'dva';
import { Card } from 'antd';
import CommonTable from '../../../components/CommonTable';
import SearchBar from './NameSearchBar';

import styles from './DirectOut.less';

class InventoryList extends Component {

  constructor(props) {
    super(props);
    this.onSearch = this.onSearch.bind(this);
    this.onConfirm = this.onConfirm.bind(this);
    this.onPageChange = this.onPageChange.bind(this);
  }

  componentWillMount() {
    // init查询库存列表
    const deptId = this.props.base.user.loginDepartment.id;
    this.props.dispatch({
      type: 'hrpOutputStock/loadStore',
      payload: {
        query: { deptId },
      },
    });
  }

  onSearch(values) {
    // 根据查询条件查询库存列表
    const deptId = this.props.base.user.loginDepartment.id;
    const cond = { ...values, deptId };
    this.props.dispatch({
      type: 'hrpOutputStock/loadStore',
      payload: {
        query: cond,
      },
    });
  }

  onConfirm(record, index) {
    // 添加药品到出库列表
    this.props.dispatch({
      type: 'hrpOutputStock/addOutStockDetail',
      record,
    });
  }

  onPageChange(page) {
    const deptId = this.props.base.user.loginDepartment.id;
    const {tradeName} = this.props.hrpOutputStock;
//    console.info("onPageChange", tradeName);
    this.props.dispatch({
      type: 'hrpOutputStock/loadStore',
      payload: { page, query: { deptId, tradeName } },
    });
  }

  render() {
    const { hrpOutputStock, base } = this.props;
    const { wsHeight } = base;
    const { data, page } = hrpOutputStock || {};
    const columns = [
      { title: '物资信息',
        dataIndex: 'instrmInfo.commonName',
        key: 'instrmInfo.commonName',
        width: 243,
        render: (text, record) => {
          return (
            <div style={{ position: 'relative' }} >
              {`${text}(${record.instrmSpecs || '-'})`}<br />
              厂商：{record.instrmInfo.companyInfo.companyName ? (record.instrmInfo.companyInfo.companyName || '-') : '-'}
            </div>
          );
        },
      },
//      { title: '批号/批次',
//        dataIndex: 'approvalNo',
//        key: 'approvalNo',
//        width: 85,
//        render: (text, record) => {
//          return (
//            <div>
//              {text}<br />
//              {record.batchNo}
//            </div>
//          );
//        },
//      },
      { title: '库存',
        dataIndex: 'storeSum',
        key: 'storeSum',
        width: 70,
        render: (text, record) => {
          return (
            <div style={{ textAlign: 'right' }}>
              {text}{record.instrmInfo ? record.instrmInfo.instrmUnit : ''}
            </div>
          );
        },
      },
      { title: '零售价',
        dataIndex: 'salePrice',
        key: 'salePrice',
        className: 'text-align-right text-no-wrap',
        width: 80,
        render: text => (text.formatMoney != null ? text.formatMoney(4) : ''),
      },
    ];

    // console.info('render-data', data);

    const leftHeight = wsHeight - (3 * 2);

    return (
      <div style={{ padding: 3 }} >
        <Card className={styles.leftCard} style={{ height: leftHeight }} >
          <SearchBar onSearch={this.onSearch} />
          <CommonTable
            data={data}
            pagination
            bordered
            page={page}
            paginationStyle="mini"
            onPageChange={this.onPageChange}
            onRowClick={(record, index) => this.onConfirm(record, index)}
            columns={columns}
            rowSelection={false}
            size="middle"
            scroll={{ y: (leftHeight - 38 - 34 - 55) }}
          />
        </Card>
      </div>
    );
  }
}
export default connect(
  ({ hrpOutputStock, base }) => ({ hrpOutputStock, base }),
)(InventoryList);
