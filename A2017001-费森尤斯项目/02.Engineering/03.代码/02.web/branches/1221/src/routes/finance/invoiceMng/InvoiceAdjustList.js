import React, { Component } from 'react';
import { Icon, Tooltip } from 'antd';
import CommonTable from '../../../components/CommonTable';
// import EditTable from '../../../components/editTable/EditTable';
class InvoiceAdjustList extends Component {

  onEdit(record) {
    this.props.dispatch({ type: 'invoiceAdjust/toggleVisible' });
    this.props.dispatch({
      type: 'utils/setState',
      payload: { record },
    });
  }

  onSearch(values) {
    this.props.dispatch({
      type: 'invoiceAdjust/load',
      payload: { values },
    });
  }

  onPageChange(page) {
    this.props.dispatch({
      type: 'invoiceAdjust/load',
      payload: { page },
    });
  }

  rowSelectChange(selectedRowKeys) {
    this.props.dispatch({
      type: 'invoiceAdjust/setState',
      payload: { selectedRowKeys },
    });
  }

  render() {
    const { page, data, dicts, wsHeight } = this.props;

    const columns = [
      {
        title: '发票分类',
        dataIndex: 'invoiceType',
        key: 'invoiceType',
        width: '10%',
        render: (value) => {
          return dicts.dis('INVOICE_TYPE', value);
        },
      }, {
        title: '起始号',
        dataIndex: 'invoiceStart',
        width: '15%',
        key: 'invoiceStart',
      }, {
        title: '结束号',
        dataIndex: 'invoiceEnd',
        width: '15%',
        key: 'invoiceEnd',
      }, {
        title: '在用号',
        dataIndex: 'invoiceUse',
        width: '15%',
        key: 'invoiceUse',
      }, {
        title: '领用人',
        dataIndex: 'getOper',
        width: '10%',
        key: 'getOper',
      }, {
        title: '领用时间',
        dataIndex: 'getTime',
        width: '15%',
        key: 'getTime',
      }, {
        title: '停用标志',
        dataIndex: 'invoiceState',
        width: '10%',
        key: 'invoiceState',
        render: (value) => {
          return value
            ? '正在使用'
            : '停用';
        },
      }, {
        title: '操作',
        key: 'action',
        render: (text, record) => {
          return (
            <Tooltip placement="top" title={'调号'}>
              <span>
                <Icon type="edit" className="tableEditIcon" onClick={this.onEdit.bind(this, record)} />
              </span>
            </Tooltip>
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
          rowSelection={false}
          onPageChange={this.onPageChange.bind(this)}
          onSelectChange={this.rowSelectChange.bind(this)}
          bordered
          scroll={{ y: (wsHeight - 47 - 33 - 62 - 2) }}
        />
      </div>
    );
  }
}
export default InvoiceAdjustList;
