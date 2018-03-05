import React, { Component } from 'react';
import { floor } from 'lodash';
import { connect } from 'dva';
import moment from 'moment';
import { testInt } from '../../../utils/validation';
import EditTable from '../../../components/editTable/EditTable';

class CheckList extends Component {

  componentWillMount() {
    this.props.dispatch({
      type: 'checkInfo/load',
    });
  }

  onUpdate(record) {
    this.props.dispatch({
      type: 'checkInfo/setState',
      payload: { record },
    });
  }
  onDeleteCheck(record) {
    this.props.dispatch({
      type: 'checkInfo/deleteCheckInfo',
      id: record.id,
    });
  }
  onPageChange(page) {
    this.props.dispatch({
      type: 'checkInfo/load',
      payload: { page },
    });
  }

  rowSelectChange(selectedRowKeys) {
    this.props.dispatch({
      type: 'checkInfo/setState',
      payload: { selectedRowKeys },
    });
  }

  render() {
    const { page, data } = this.props.checkInfo;
    const { dicts } = this.props.utils;
    const { wsHeight } = this.props.base;
    const columns = [
      {
        title: '药品分类',
        dataIndex: 'drugType',
        width: 65,
        key: 'drugType',
        className: 'text-align-center',
        render: (value) => {
          return dicts.dis('DRUG_TYPE', value);
        },
      },
      {
        title: '商品信息',
        width: 260,
        dataIndex: 'drugCode',
        key: 'drugCode',
        render: (text, record) => {
          return (
            <div>
              <font style={{ color: 'rgb(191, 191, 191)' }}>{text}</font><br />
              {`${record.tradeName} (${record.specs || '-'})`}
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
        title: '药品规格',
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
        title: '药品位置',
        width: 80,
        dataIndex: 'location',
        key: 'location',
      },
      {
        title: '原始数量',
        width: 80,
        dataIndex: 'startSum',
        key: 'startSum',
        render: (value, record) => {
          return  (record.startSum % record.drugInfo.packQty) !== 0 ?
            (floor(record.startSum / record.drugInfo.packQty) + record.drugInfo.packUnit + '/' + (record.startSum % record.drugInfo.packQty) + record.drugInfo.miniUnit)
              : (floor(record.startSum / record.drugInfo.packQty) + record.drugInfo.packUnit);
        },
      },
      {
        title: '盘点包装数量',
        width: 80,
        dataIndex: 'packSum',
        key: 'packSum',
        className: 'text-align-center',
        editorConfig: { verfy: (v) => { return testInt(v); } },
        editable: (value, record) => {
          return record.checkState === '1' || record.checkState === '2';
        },
        render: (value, record) => {
          return record.writeSum ? floor(record.writeSum / record.drugInfo.packQty) : (record.startSum ? floor(record.startSum / record.drugInfo.packQty) : 0);
        },
        addonAfter: (text, record) => {
          return record.drugInfo.packUnit;
        },
      },
      {
        title: '盘点零散数量',
        width: 80,
        dataIndex: 'miniSum',
        key: 'miniSum',
        className: 'text-align-center',
        editorConfig: { verfy: (v) => { return testInt(v); } },
        addonAfter: (text, record) => {
          return record.drugInfo.miniUnit;
        },
        editable: (value, record) => {
          return record.checkState === '1' || record.checkState === '2';
        },
        render: (value, record) => {
          return record.writeSum ? (record.writeSum % record.drugInfo.packQty) : (record.startSum ? record.startSum % record.drugInfo.packQty : 0);
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
  ({ checkInfo, utils, base }) => ({ checkInfo, utils, base }),
)(CheckList);
