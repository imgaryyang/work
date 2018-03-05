import React, { Component } from 'react';
import { floor } from 'lodash';
import { connect } from 'dva';
import moment from 'moment';
import CommonTable from '../../../components/CommonTable';

class CheckInfoList extends Component {

  componentWillMount() {
    this.props.dispatch({
      type: 'checkInfo/loadCheckInfo',
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
      type: 'checkInfo/loadCheckInfo',
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
    const { checkInfoPage, checkInfoData } = this.props.checkInfo;
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
        width: 80,
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
              {text || '-'}<br />
              {record.batchNo || '-'}
            </div>
          );
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
          return (record.startSum % record.drugInfo.packQty) !== 0 ?
            (floor(record.startSum / record.drugInfo.packQty) + record.drugInfo.packUnit + '/' + (record.startSum % record.drugInfo.packQty) + record.drugInfo.miniUnit)
              : (floor(record.startSum / record.drugInfo.packQty) + record.drugInfo.packUnit);
        },
      },
      {
        title: '盘点数量',
        width: 80,
        dataIndex: 'packSum',
        key: 'packSum',
        render: (value, record) => {
          return (record.writeSum % record.drugInfo.packQty) !== 0 ?
            (record.writeSum !== null ? floor(record.writeSum / record.drugInfo.packQty) + record.drugInfo.packUnit + '/' + (record.writeSum % record.drugInfo.packQty) + record.drugInfo.miniUnit : '')
              : floor(record.writeSum / record.drugInfo.packQty) + record.drugInfo.packUnit;
        },
      },
      {
        title: '结存数量',
        width: 80,
        dataIndex: 'endSum',
        key: 'endSum',
        render: (value, record) => {
          return (record.endSum % record.drugInfo.packQty) !== 0 ?
          (record.endSum !== null ? floor(record.endSum / record.drugInfo.packQty) + record.drugInfo.packUnit + '/' + (record.endSum % record.drugInfo.packQty) + record.drugInfo.miniUnit : '')
            : (record.endSum !== null ? floor(record.endSum / record.drugInfo.packQty) + record.drugInfo.packUnit : '');
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
  ({ checkInfo, utils, base }) => ({ checkInfo, utils, base }),
)(CheckInfoList);
