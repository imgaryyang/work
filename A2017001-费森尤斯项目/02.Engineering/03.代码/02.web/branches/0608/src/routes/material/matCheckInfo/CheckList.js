import React, { Component } from 'react';
import { connect } from 'dva';
import { testInt } from '../../../utils/validation';
import EditTable from '../../../components/editTable/EditTable';

class CheckList extends Component {

  componentWillMount() {
    this.props.dispatch({
      type: 'matCheckInfo/load',
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
      type: 'matCheckInfo/load',
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
    const { page, data } = this.props.matCheckInfo;
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
        title: '商品名称',
        width: 150,
        dataIndex: 'tradeName',
        key: 'tradeName',
      },
      {
        title: '物资规格',
        width: 80,
        dataIndex: 'specs',
        key: 'specs',
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
              {text}<br />
              {record.batchNo}
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
          return `${record.startSum}${record.minUnit ? record.minUnit : ''}`;
        },
      },
      {
        title: '盘点数量',
        width: 80,
        dataIndex: 'writeSum',
        key: 'writeSum',
        className: 'text-align-center',
        editorConfig: { verfy: (v) => { return testInt(v); } },
        addonAfter: (text, record) => {
          return record.minUnit;
        },
        render: (text, record) => {
          return `${record.writeSum ? record.writeSum : (record.startSum ? record.startSum : 0)}`;
        },
        editable: (value, record) => {
          return record.checkState === '1' || record.checkState === '2';
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
        <EditTable
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
  ({ matCheckInfo, utils, base }) => ({ matCheckInfo, utils, base }),
)(CheckList);
