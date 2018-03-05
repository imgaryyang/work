import React, { Component } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import CommonTable from '../../../components/CommonTable';

class CheckInfoList extends Component {

  componentWillMount() {
    this.props.dispatch({
      type: 'instrmCheckInfo/loadCheckInfo',
    });
  }

  onUpdate(record) {
    this.props.dispatch({
      type: 'instrmCheckInfo/setState',
      payload: { record },
    });
  }
  onDeleteCheck(record) {
    this.props.dispatch({
      type: 'instrmCheckInfo/deleteCheckInfo',
      id: record.id,
    });
  }
  onPageChange(page) {
    this.props.dispatch({
      type: 'instrmCheckInfo/loadCheckInfo',
      payload: { page },
    });
  }

  rowSelectChange(selectedRowKeys) {
    this.props.dispatch({
      type: 'instrmCheckInfo/setState',
      payload: { selectedRowKeys },
    });
  }

  render() {
    const { checkInfoPage, checkInfoData } = this.props.instrmCheckInfo;
    const { dicts } = this.props.utils;
    const { wsHeight } = this.props.base;
    const columns = [
      {
        title: '资产分类',
        dataIndex: 'instrmType',
        width: 65,
        key: 'instrmType',
        className: 'text-align-center',
        render: (value) => {
          return (
            <div>
              {value ? (this.getTreeDictCascadeValue('ASSETS_TYPE', JSON.parse(value)) || '-') : '-'}
            </div>
          );
        },
      },
      {
        title: '资产信息',
        width: 260,
        dataIndex: 'instrmCode',
        key: 'instrmCode',
        render: (text, record) => {
          return (
            <div>
              <font style={{ color: 'rgb(191, 191, 191)' }}>{text}</font><br />
              {`${record.tradeName} (${record.instrmSpecs || '-'})`}
            </div>
          );
        },
      },
      {
        title: '型号',
        width: 110,
        dataIndex: 'batchNo',
        key: 'batchNo',
      },
      { title: '出厂日期', dataIndex: 'produceDate', key: 'produceDate', width: 90, className: 'text-align-center' },
      { title: '采购/零售价',
        dataIndex: 'buyPrice',
        key: 'bugPrice',
        width: 110,
        className: 'text-align-right',
        render: (text, record) => {
          return (
            <div>
              <font style={{ color: 'rgb(191, 191, 191)' }}>(购) </font>{(text || 0.00).formatMoney(4)}<br />
              <font style={{ color: 'rgb(191, 191, 191)' }}>(售) </font>{(record.salePrice || 0.00).formatMoney(4)}
            </div>
          );
        },
      },
      {
        title: '资产位置',
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
  ({ instrmCheckInfo, utils, base }) => ({ instrmCheckInfo, utils, base }),
)(CheckInfoList);
