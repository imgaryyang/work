import React, { Component } from 'react';
import { connect } from 'dva';
import { floor } from 'lodash';
import CommonTable from '../../../components/CommonTable';

class InStoreDetailList extends Component {

  onPageChange(page) {
    this.props.dispatch({
      type: 'matInStoreDetail/load',
      payload: { page },
    });
  }

  render() {
    const { page, data } = this.props;
    const { wsHeight } = this.props.base;
    const { dicts } = this.props.utils;
    const columns = [
      {
        title: '物资分类',
        dataIndex: 'materialType',
        width: '80px',
        key: 'materialType',
        render: (value) => {
          return dicts.dis('MATERIAL_TYPE', value);
        },
      },
      { title: '物资名称', dataIndex: 'matInfo.commonName', key: 'matInfo.commonName', width: '120px' },
      { title: '规格', dataIndex: 'materialSpecs', key: 'materialSpecs', width: '100px' },
      { title: '进价', dataIndex: 'buyPrice', key: 'buyPrice', width: '80px', render: text => (text ? text.formatMoney(4) : ''), className: 'text-align-right' },
      { title: '售价', dataIndex: 'salePrice', key: 'salePrice', width: '80px', render: text => (text ? text.formatMoney(4) : ''), className: 'text-align-right' },
      { title: '进价总额', dataIndex: 'buyCost', key: 'buyCost', width: '100px', render: text => (text ? text.formatMoney(2) : ''), className: 'text-align-right' },
      {
        title: '入库数量',
        dataIndex: 'inSum',
        key: 'inSum',
        width: '100px',
        render: (value, record) => {
          if (record.inSum != null && record.matInfo != null && record.matInfo.materialUnit !== 0) {
            if (record.inSum === 0) {
              return 0;
            } else {
              return `${record.inSum}${record.matInfo.materialUnit}`;
            }
          } else {
            return '';
          }
        },
      },
      { title: '批号', dataIndex: 'approvalNo', key: 'approvalNo', width: '80px' },
      { title: '生产商', dataIndex: 'matInfo.companyInfo.companyName', key: 'matInfo.companyInfo.companyName', width: '120px' },
      { title: '供货商', dataIndex: 'companyInfo.companyName', key: 'companyInfo.companyName', width: '120px' },
      { title: '有效期', dataIndex: 'validDate', key: 'validDate', width: '120px' },
      { title: '入库时间', dataIndex: 'inTime', key: 'inTime', width: '120px' },
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
