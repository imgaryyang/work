import React, { Component } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import CommonTable from '../../../components/CommonTable';

class CheckInfoList extends Component {

  componentWillMount() {
    this.props.dispatch({
      type: 'matCheckInfo/loadCheckInfo',
    });
  }

  onUpdate(record) {
    this.props.dispatch({
      type: 'matCheckInfo/setState',
      payload: { record },
    });
  }
  onDeleteCheck(record) {
    this.props.dispatch({
      type: 'matCheckInfo/deleteCheckInfo',
      id: record.id,
    });
  }
  onPageChange(page) {
    this.props.dispatch({
      type: 'matCheckInfo/loadCheckInfo',
      payload: { page },
    });
  }

  rowSelectChange(selectedRowKeys) {
    this.props.dispatch({
      type: 'matCheckInfo/setState',
      payload: { selectedRowKeys },
    });
  }

  render() {
    const { matCheckInfoPage, matCheckInfoData } = this.props.matCheckInfo;
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
        title: '商品信息',
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
        title: '盘点数量',
        width: 80,
        dataIndex: 'writeSum',
        key: 'writeSum',
        render: (text, record) => {
          return `${record.writeSum}${record.minUnit}`;
        },
      },
      {
        title: '结存数量',
        width: 80,
        dataIndex: 'endSum',
        key: 'endSum',
        render: (text, record) => {
          return `${record.endSum}${record.minUnit}`;
        },
      },
      {
        title: '盘清时间',
        width: 130,
        dataIndex: 'createTime',
        key: 'createTime',
        render: (value) => {
          return moment(value).format('YYYY-MM-DD HH:mm:ss');
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
          data={matCheckInfoData}
          page={matCheckInfoPage}
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
  ({ matCheckInfo, utils, base }) => ({ matCheckInfo, utils, base }),
)(CheckInfoList);
