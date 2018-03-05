import React, { Component } from 'react';
import { Icon, Popconfirm } from 'antd';
import CommonTable from '../../../components/CommonTable';

class InvoiceMngList extends Component {

  onRowClick(record) {
    this.props.dispatch({
      type: 'invoiceMng/setState',
      payload: { record },
    });
  }

  onDelete(record) {
    this.props.dispatch({
      type: 'invoiceMng/delete',
      id: record.id,
    });
  }

  onPageChange(page) {
    this.props.dispatch({
      type: 'invoiceMng/load',
      payload: { page },
    });
  }

  rowSelectChange(selectedRowKeys) {
    this.props.dispatch({
      type: 'invoiceMng/setState',
      payload: { selectedRowKeys },
    });
  }

  render() {
    const { page, data, dicts, wsHeight } = this.props;

    const columns = [
      {
        title: '发票分类',
        dataIndex: 'invoiceType',
        width: '10%',
        key: 'invoiceType',
        render: (value) => {
          return dicts.dis('INVOICE_TYPE', value);
        },
      }, {
        title: '起始号',
        width: '15%',
        dataIndex: 'invoiceStart',
        key: 'invoiceStart',
      }, {
        title: '结束号',
        width: '15%',
        dataIndex: 'invoiceEnd',
        key: 'invoiceEnd',
      }, {
        title: '在用号',
        width: '15%',
        dataIndex: 'invoiceUse',
        key: 'invoiceUse',
      }, {
        title: '领用人',
        width: '10%',
        dataIndex: 'getOper',
        key: 'getOper',
      }, {
        title: '领用时间',
        width: '15%',
        dataIndex: 'getTime',
        key: 'getTime',
      }, {
        title: '发票状态',
        dataIndex: 'invoiceState',
        width: '10%',
        key: 'invoiceState',
        render: (value) => {
          return value
            ? '未停用'
            : '已停用';
        },
      }, {
        title: '操作',
        key: 'action',
        width: '5%',
        className: 'text-align-center text-no-wrap',
        render: (text, record) => {
          return (
            <span>
              <Popconfirm placement="left" title={'您确定要删除此项么?'} cancelText={'否'} okText={'是'} onConfirm={this.onDelete.bind(this, record)}>
                <Icon type="delete" className="tableDeleteIcon" />
              </Popconfirm>
            </span>
          );
        },
      },
    ];

    return (
      <div>
        <CommonTable
          data={data}
          page={page}
          columns={columns}
          onRowClick={this.onRowClick.bind(this)}
          onPageChange={this.onPageChange.bind(this)}
          onSelectChange={this.rowSelectChange.bind(this)}
          bordered
          scroll={{ y: (wsHeight - 95 - 33 - 62 - 2) }}
        />
      </div>
    );
  }
}
export default InvoiceMngList;
