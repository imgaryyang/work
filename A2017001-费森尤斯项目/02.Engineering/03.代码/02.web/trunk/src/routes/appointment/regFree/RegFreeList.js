import React, { Component } from 'react';
import { Icon, Popconfirm } from 'antd';
import CommonTable from '../../../components/CommonTable';

class RegInfoList extends Component {

  onDelete(record) {
    this.props.dispatch({ type: 'regFree/delete', id: record.id });
  }

  onSearch(values) {
    this.props.dispatch({
      type: 'regFree/load',
      payload: { values },
    });
  }

  onPageChange(page) {
    this.props.dispatch({
      type: 'regFree/load',
      payload: { page },
    });
  }

  rowSelectChange(selectedRowKeys) {
    this.props.dispatch({
      type: 'regFree/setState',
      payload: { selectedRowKeys },
    });
  }

  render() {
    const { page, data, dicts } = this.props;
    const columns = [
      {
        title: '编码',
        dataIndex: 'itemInfo.itemCode',
        width: '25%',
        key: 'itemCode',
      }, {
        title: '名称',
        dataIndex: 'itemInfo.itemName',
        width: '25%',
        key: 'feeCode',
      }, {
        title: '单价',
        dataIndex: 'itemInfo.unitPrice',
        width: '20%',
        key: 'unitPrice',
      }, {
        title: '备注',
        dataIndex: 'regLevel',
        width: '20%',
        key: 'regLevel',
        render: (value) => {
          return dicts.dis('REG_LEVEL', value);
        },
      }, {
        title: '操作',
        width: '10%',
        key: 'action',
        render: (text, record) => (
          <span>
            <Popconfirm placement="left" title={'您确定要删除此项么?'} cancelText={'否'} okText={'是'} onConfirm={this.onDelete.bind(this, record)}>
              <Icon type="delete" className="tableDeleteIcon" />
            </Popconfirm>
          </span>
      ),
      },
    ];
    return (
      <div>
        <CommonTable
          data={data}
          page={page}
          columns={columns}
          onPageChange={this.onPageChange.bind(this)}
          onSelectChange={this.rowSelectChange.bind(this)}
          bordered
          rowSelection={false}
        />
      </div>
    );
  }
}
export default RegInfoList;
