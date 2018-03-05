import React, { Component } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import CommonTable from '../../../components/CommonTable';

class MatCheckInfoDetail extends Component {

  onPageChange(page) {
    this.props.dispatch({
      type: 'matCheckInfoSearch/loadCheckInfo',
      payload: { page },
    });
  }

  rowSelectChange(selectedRowKeys) {
    this.props.dispatch({
      type: 'matCheckInfoSearch/setState',
      payload: { selectedRowKeys },
    });
  }

  render() {
    const { checkInfoPage, checkInfoData } = this.props.matCheckInfoSearch;
    const { dicts } = this.props.utils;
    const { wsHeight } = this.props.base;
    const columns = [
      {
        title: '物资分类',
        dataIndex: 'materialType',
        width: 65,
        key: 'materialType',
        className: 'text-align-center',
        render: (value) => {
          return dicts.dis('MATERIAL_TYPE', value);
        },
      },
      {
        title: '物资信息',
        width: 260,
        dataIndex: 'materialCode',
        key: 'materialCode',
        render: (text, record) => {
          return (
            <div>
              <font style={{ color: 'rgb(191, 191, 191)' }}>{text}</font><br />
              {`${record.tradeName} (${record.materialSpecs || '-'})`}
            </div>
          );
        },
      },
      /* {
        title: '物资名称',
        width: 80,
        dataIndex: 'tradeName',
        key: 'tradeName',
      },
      {
        title: '物资规格',
        width: 80,
        dataIndex: 'materialSpecs',
        key: 'materialSpecs',
      },
      {
        title: '批次',
        width: 80,
        dataIndex: 'batchNo',
        key: 'batchNo',
      },*/
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
        title: '有效期',
        dataIndex: 'validDate',
        key: 'validDate',
        width: 110,
        className: 'text-align-center',
        render: (text, record) => {
          return record.validDate ? moment(record.validDate).format('YYYY-MM-DD') : '';
        },
      },
      {
        title: '物资位置',
        width: 80,
        dataIndex: 'location',
        key: 'location',
      },
      {
        title: '原始数量',
        width: 80,
        dataIndex: 'startSum',
        key: 'startSum',
        render: (text, record) => {
          return `${record.startSum}${record.minUnit}`;
        },
      },
      {
        title: '结存数量',
        width: 80,
        dataIndex: 'endSum',
        key: 'endSum',
        render: (value, record) => {
          return (
            <div>
              <font style={{ color: value !== record.startSum ? '#f46e65' : '' }}>{
          `${record.endSum}${record.minUnit}`
                }</font>
            </div>
          );
        },
      },
      {
        title: '状态',
        width: 76,
        dataIndex: 'checkState',
        key: 'checkState',
        className: 'text-align-center text-no-wrap',
        render: (value) => {
          return dicts.dis('CHECK_STATE', value);
        },
      },
    ];
    return (
      <div>
        <CommonTable
          data={checkInfoData}
          page={checkInfoPage}
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
  ({ matCheckInfoSearch, utils, base }) => ({ matCheckInfoSearch, utils, base }),
)(MatCheckInfoDetail);
