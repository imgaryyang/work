import { connect } from 'dva';
import React, { Component } from 'react';
import { Icon, Badge } from 'antd';
import _ from 'lodash';

import CommonTable from '../../../components/CommonTable';
import RowDelBtn from '../../../components/TableRowDeleteButton';

class MaterialInfoList extends Component {

  onEdit(record) {
    this.props.dispatch({ type: 'material/toggleVisible' });
    this.props.dispatch({
      type: 'material/setState',
      payload: { record },
    });
  }

  onDelete(record) {
    this.props.dispatch({
      type: 'material/delete',
      id: record.id,
    });
  }

  onPageChange(page) {
    this.props.dispatch({
      type: 'material/load',
      payload: {
        page,
        query: this.props.material.query,
        startFrom0: false,
        /* query: this.props.query,
        onSearch: false,*/
      },
    });
  }

  rowSelectChange(selectedRowKeys) {
    this.props.dispatch({
      type: 'material/setState',
      payload: { selectedRowKeys },
    });
  }

  render() {
    // const { page, data, dicts, wsHeight } = this.props;
    const { base, material, utils } = this.props;
    const { page, data } = material;
    const { wsHeight } = base;
    const { dicts } = utils;

    const columns = [
      {
        title: '物资分类',
        dataIndex: 'materialType',
        key: 'materialType',
        width: 96,
        render: (value) => {
          return (
            <div>
              {value ? (dicts.dis('MATERIAL_TYPE', _.trim(value)) || '其它') : '-'}
            </div>
          );
        },
      },
      { title: '物资名称',
        dataIndex: 'commonName',
        key: 'commonName',
        width: 270,
        render: (value, record) => {
          return (
            <div>
              {`${_.trim(record.materialCode)} · ${value} (${record.materialSpecs || '-'})`}<br />
              厂家：{record.companyInfo ? (record.companyInfo.companyName || '-') : '-'}
            </div>
          );
        },
      },
      {
        title: '包装单位',
        dataIndex: 'materialUnit',
        key: 'materialUnit',
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
      /* { title: '收费编码', dataIndex: 'priceCode', key: 'priceCode', width: 77, className: 'text-align-center' },*/
      { title: '采购价', dataIndex: 'buyPrice', key: 'buyPrice', width: 77, className: 'text-align-right', render: value => (value ? value.formatMoney() : '') },
      { title: '批发价', dataIndex: 'wholePrice', key: 'wholePrice', width: 77, className: 'text-align-right', render: value => (value ? value.formatMoney() : '') },
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
            {/* <Popconfirm placement="left" title={'您确定要删除此项么?'} cancelText={'否'} okText={'是'} onConfirm={this.onDelete.bind(this, record)}>
              <Icon type="delete" className="tableDeleteIcon" />
            </Popconfirm>*/}
            <RowDelBtn onOk={() => this.onDelete(record)} />
          </span>
        ),
      },
    ];

    const expandTable = (record) => {
      const expandColumns = [
        { title: '用户编码', dataIndex: 'userCode', key: 'userCode', width: 100 },
        { title: '中心编码', dataIndex: 'centerCode', key: 'centerCode', width: 100 },
        { title: '条形码', dataIndex: 'barcode', key: 'barcode', className: 'text-align-center', width: 120 },
        { title: '别名', dataIndex: 'alias', key: 'alias', width: 100 },
        { title: '注册证号', dataIndex: 'registerCode', key: 'registerCode', width: 100 },
        { title: '注册证名称', dataIndex: 'registerName', key: 'registerName', width: 260 },
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
  ({ material, base, utils }) => ({ material, base, utils }),
)(MaterialInfoList);
