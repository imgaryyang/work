import React, { Component } from 'react';
import { floor } from 'lodash';
import { connect } from 'dva';
import moment from 'moment';
import CommonTable from '../../../components/CommonTable';

class InputDetail extends Component {

  onPageChange(page) {
    this.props.dispatch({
      type: 'instoredetail/loadDetail',
      payload: { page },
    });
  }

  rowSelectChange(selectedRowKeys) {
    this.props.dispatch({
      type: 'instoredetail/setState',
      payload: { selectedRowKeys },
    });
  }

  render() {
    const { page, data } = this.props.instoredetail;
    const { wsHeight } = this.props.base;
    const columns = [
      {
        title: '商品信息',
        width: 260,
        dataIndex: 'materialCode',
        key: 'materialCode',
        render: (text, record) => {
          return (
            <div>
              <font style={{ color: 'rgb(191, 191, 191)' }}>{text}</font><br />
              {`${record.tradeName} (${record.matInfo ? record.matInfo.materialSpecs : '-'})`}
            </div>
          );
        },
      },
      {
        title: '批号/批次',
        width: 110,
        dataIndex: 'approvalNo',
        key: 'approvalNo',
        render: (text, record) => {
          return (
            <div>
              {text || '-'}<br />
              {record.batchNo || '-'}
            </div>
          );
        },
      },
      {
        title: '入库数量',
        dataIndex: 'inSum',
        key: 'inSum',
        width: '100px',
        render: (value, record) => {
          if (record.inSum === 0) {
            return 0;
          } else {
            return `${record.inSum}${record.matInfo.materialUnit}`;
          }
        },
      },
      { title: '生产商/供货商',
        dataIndex: 'matInfo.companyInfo.companyName',
        key: 'matInfo.companyInfo.companyName',
        width: '260px',
        render: (text, record) => {
          return (
            <div>
              {`(生产)${text}`}<br />
              {`(供应)${record.companyInfo ? (record.companyInfo.companyName || '-') : '-'}`}
            </div>
          );
        },
      },
      { title: '有效期', dataIndex: 'validDate', key: 'validDate', width: '90px' },
      { title: '入库时间', dataIndex: 'inTime', key: 'inTime', width: '90px' },
    ];
    return (
      <div>
        <CommonTable
          data={data}
          page={page}
          columns={columns}
          onPageChange={this.onPageChange.bind(this)}
          rowSelection={false}
          bordered
          scroll={{ y: (wsHeight - 47 - 48 - 33 - 54 - 10) }}
          size="middle"
        />
      </div>
    );
  }
}
export default connect(
  ({ instoredetail, utils, base }) => ({ instoredetail, utils, base }),
)(InputDetail);
