import React, { Component } from 'react';
import { connect } from 'dva';
import { floor } from 'lodash';
import moment from 'moment';
import CommonTable from '../../../components/CommonTable';

class InStoreDetailList extends Component {

  onPageChange(page) {
    this.props.dispatch({
      type: 'hrpInStoreDetail/load',
      payload: { page },
    });
  }

  render() {
    const { page, data } = this.props;
    const { wsHeight } = this.props.base;
    const { dicts } = this.props.utils;
    const columns = [
      {
        title: '资产编码',
        dataIndex: 'instrmCode',
        width: '80px',
        key: 'instrmCode',
      },
      { title: '资产名称', dataIndex: 'tradeName', key: 'tradeName', width: '110px' },
      { title: '规格', dataIndex: 'instrmSpecs', key: 'instrmSpecs', width: '60px' },
      { title: '型号', dataIndex: 'batchNo', key: 'batchNo', width: '60px', className: 'text-align-right' },
      { title: '进价', dataIndex: 'buyPrice', key: 'buyPrice', width: '80px', render: text => (text ? text.formatMoney(4) : ''), className: 'text-align-right' },
      { title: '售价', dataIndex: 'salePrice', key: 'salePrice', width: '80px', render: text => (text ? text.formatMoney(4) : ''), className: 'text-align-right' },
      { title: '进价总额', dataIndex: 'buyCost', key: 'buyCost', width: '90px', render: text => (text ? text.formatMoney(2) : ''), className: 'text-align-right' },
      {
        title: '入库数量',
        dataIndex: 'inSum',
        key: 'inSum',
        width: '60px',
        render: (value, record) => {
          if (record.inSum != null && record.instrmInfo != null && record.instrmInfo.instrmUnit !== 0) {
            if (record.inSum === 0) {
              return 0;
            } else {
              return `${record.inSum}${record.instrmInfo.instrmUnit}`;
            }
          } else {
            return '';
          }
        },
      },
      { title: '生产商', dataIndex: 'instrmInfo.companyInfo.companyName', key: 'instrmInfo.companyInfo.companyName', width: '110px' },
      { title: '供货商', dataIndex: 'companyInfo.companyName', key: 'companyInfo.companyName', width: '110px' },
      { title: '折旧(月)', dataIndex: 'instrmInfo.limitMonth', key: 'instrmInfo.limitMonth', width: '60px' },
      { title: '出厂日期', dataIndex: 'produceDate', key: 'produceDate', width: '70px' },
      { title: '购入日期', dataIndex: 'purchaseDate', key: 'purchaseDate', width: '70px', render: (value, record) =>(moment(record.purchaseDate).format('YYYY-MM-DD')) },
      { title: '入库时间', dataIndex: 'inTime', key: 'inTime', width: '70px' },
    ];

    return (
      <CommonTable
        data={data}
        size="small"
        bordered
        columns={columns}
        page={page}
        onPageChange={this.onPageChange.bind(this)}
        rowSelection={false}
        scroll={{ y: (wsHeight - 32 - 51 - 22 - 28) }}
      />
    );
  }
}
export default connect(({ base, utils }) => ({ base, utils }))(InStoreDetailList);
