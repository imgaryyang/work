import { connect } from 'dva';
import React, { Component } from 'react';
import { Icon, Badge } from 'antd';
import _ from 'lodash';

import CommonTable from '../../../components/CommonTable';
import RowDelBtn from '../../../components/TableRowDeleteButton';

class AssetInfoList extends Component {

  onEdit(record) {
    this.props.dispatch({ type: 'asset/toggleVisible' });
    this.props.dispatch({
      type: 'asset/setState',
      payload: { record },
    });
  }

  onDelete(record) {
    this.props.dispatch({
      type: 'asset/delete',
      id: record.id,
    });
  }

  onPageChange(page) {
    this.props.dispatch({
      type: 'asset/load',
      payload: {
        page,
        query: this.props.asset.query,
        startFrom0: false,
      },
    });
  }

  rowSelectChange(selectedRowKeys) {
    this.props.dispatch({
      type: 'asset/setState',
      payload: { selectedRowKeys },
    });
  }

  render() {
    const { base, asset } = this.props;
    const { page, data } = asset;
    const { wsHeight } = base;
    // console.log(this.props.utils.flatDictTrees);
    const columns = [
      {
        title: '资产分类',
        dataIndex: 'instrmType',
        key: 'instrmType',
        width: 120,
        render: (value) => {
          // console.log((value ? JSON.parse(value) : ''), this.getTreeDictCascadeValue('ASSETS_TYPE', JSON.parse(value)));
          return (
            <div>
              {value ? (this.getTreeDictCascadeValue('ASSETS_TYPE', JSON.parse(value)) || '-') : '-'}
            </div>
          );
        },
      },
      { title: '资产名称',
        dataIndex: 'commonName',
        key: 'commonName',
        width: 270,
        render: (value, record) => {
          return (
            <div>
              {`${_.trim(record.instrmCode)} · ${value} (${_.trim(record.instrmSpecs) || '-'})`}<br />
              厂家：{record.companyInfo ? (record.companyInfo.companyName || '-') : '-'}
            </div>
          );
        },
      },
      {
        title: '包装单位',
        dataIndex: 'instrmUnit',
        key: 'instrmUnit',
        width: 80,
        className: 'text-align-center',
        render: (value) => {
          return (
            <div>
              {value}
            </div>
          );
        },
      },
      { title: '采购价', dataIndex: 'buyPrice', key: 'buyPrice', width: 77, className: 'text-align-right', render: value => (value ? value.formatMoney() : '') },
      { title: '销售价', dataIndex: 'salePrice', key: 'salePrice', width: 77, className: 'text-align-right', render: value => (value ? value.formatMoney() : '') },
      {
        title: '停用标志',
        dataIndex: 'stopFlag',
        key: 'stopFlag',
        width: 75,
        className: 'text-align-center',
        render: value => (
          <span><Badge status={value ? 'success' : 'error'} />{value ? '正常' : '停用'}</span>
        ),
      }, {
        title: '操作',
        key: 'action',
        width: 75,
        className: 'text-align-center',
        render: (text, record) => (
          <span>
            <Icon type="edit" className="tableEditIcon" onClick={this.onEdit.bind(this, record)} />
            <span className="ant-divider" />
            <RowDelBtn onOk={() => this.onDelete(record)} />
          </span>
        ),
      },
    ];

    const expandTable = (record) => {
      const expandColumns = [
        { title: '用户编码', dataIndex: 'userCode', key: 'userCode', width: 100, render: text => (text || <font>&nbsp;</font>) },
        { title: '中心编码', dataIndex: 'centerCode', key: 'centerCode', width: 100 },
        { title: '条形码', dataIndex: 'barcode', key: 'barcode', className: 'text-align-center', width: 120 },
        { title: '别名', dataIndex: 'alias', key: 'alias', width: 100 },
      ];
      return (
        <CommonTable
          data={data.filter(item => item.id === record.id)}
          size="small"
          bordered
          columns={expandColumns}
          pagination={false}
          rowSelection={false}
        />
      );
    };

    return (
      <div>
        <CommonTable
          data={data}
          page={page}
          columns={columns}
          onPageChange={this.onPageChange.bind(this)}
          onSelectChange={this.rowSelectChange.bind(this)}
          expandedRowRender={expandTable}
          bordered
          size="middle"
          scroll={{ y: (wsHeight - 48 - 34 - 54 - 2) }}
        />
      </div>
    );
  }
}
export default connect(
  ({ asset, base, utils }) => ({ asset, base, utils }),
)(AssetInfoList);

