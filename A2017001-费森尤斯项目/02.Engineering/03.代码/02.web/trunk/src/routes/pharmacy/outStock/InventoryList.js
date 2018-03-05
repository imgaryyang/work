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
//    console.info('InventoryList_componentWillMount');
    const deptId = this.props.base.user.loginDepartment.id;
    this.props.dispatch({
      type: 'outStock/loadStore',
      payload: {
        query: { deptId },
      },
    });
//    console.info('InventoryList_componentWillMount_end');
  }

  onSearch(values) {
    // 根据查询条件查询库存列表
    const deptId = this.props.base.user.loginDepartment.id;
    const cond = { ...values, deptId };
//    console.info('SearchBar查询条件!', cond);
    this.props.dispatch({
      type: 'outStock/loadStore',
      payload: {
        query: cond,
      },
    });
  }

  onConfirm(record, index) {
    // 添加药品到出库列表
//    console.info('onConfirm', index, record);
    this.props.dispatch({
      type: 'outStock/addOutStockDetail',
      record,
    });
  }

  onPageChange(page) {
//    console.info('onPageChange', page);
    const deptId = this.props.base.user.loginDepartment.id;
    const {tradeName} = this.props.outStock;
    this.props.dispatch({
      type: 'outStock/loadStore',
      payload: { page, query: { deptId, tradeName } },
    });
  }

  render() {
    const { outStock, base } = this.props;
    const { wsHeight } = base;
    const { data, page } = outStock || {};
    const columns = [
      { title: '药品信息',
        dataIndex: 'tradeName',
        key: 'tradeName',
        width: 243,
        render: (text, record) => {
          return (
            <div style={{ position: 'relative' }} >
              {`${text}(${record.specs || '-'})`}<br />
              厂商：{record.companyInfo ? (record.companyInfo.companyName || '-') : '-'}
            </div>
          );
        },
      },
      { title: '有效期',
        dataIndex: 'validDate',
        key: 'validDate',
        width: 85,
      },
      /* { title: '药品名称', dataIndex: 'tradeName', key: 'tradeName', width: '20%' },
      { title: '规格', dataIndex: 'specs', key: 'specs', width: '20%' },
      { title: '厂家', dataIndex: 'companyInfo.companyName', key: 'companyInfo.companyName', width: '20%' },
      { title: '批次', dataIndex: 'batchNo', key: 'batchNo', width: '7%' },
      { title: '批号', dataIndex: 'approvalNo', key: 'approvalNo', width: '7%' },*/
      { title: '库存',
        dataIndex: 'storeSum',
        key: 'storeSum',
        width: 70,
        className: 'text-align-right text-no-wrap' ,
        render: (text, record) => {
          let storeStr = '';
          let storeSumMin = 0;
          let store = 0;
          if (record.drugInfo.packQty > 0) {
            storeSumMin = record.storeSum % record.drugInfo.packQty;
            store = record.storeSum / record.drugInfo.packQty;
          }
          if (record.storeSumMin > 0) {
            storeStr = store.formatMoney(0) +
              record.drugInfo.packUnit +
              storeSumMin.formatMoney(0) +
              record.drugInfo.miniUnit;
          } else {
            storeStr = store.formatMoney(0) +
              record.drugInfo.packUnit;
          }
          return storeStr;
        },
      },
      { title: '零售价',
        dataIndex: 'salePrice',
        key: 'salePrice',
        className: 'text-align-right text-no-wrap',
        width: 80,
        render: text => (text.formatMoney(4)),
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
  ({ outStock, base }) => ({ outStock, base }),
)(InventoryList);
