import React from 'react';
import { connect } from 'dva';
import { Icon, notification } from 'antd';
import RowDelBtn from '../../../components/TableRowDeleteButton';
import CommonTable from '../../../components/CommonTable';

class ItemInfoList extends React.Component {

  onEdit(record) {
    this.props.dispatch({ type: 'itemInfo/setState', payload: { visible: true } });
    this.props.dispatch({ type: 'itemInfo/setState', payload: { record } });
  }

  onDelete(record) {
    this.props.dispatch({ type: 'itemInfo/delete', id: record.id });
  }

  onPageChange(page) {
    this.props.dispatch({ type: 'itemInfo/load', payload: { page } });
  }

  rowSelectChange(selectedRowKeys) {
    this.props.dispatch({ type: 'itemInfo/setState', payload: { selectedRowKeys } });
  }

  forDeleteAll() {
    const { selectedRowKeys } = this.props.itemInfo;
    if (selectedRowKeys && selectedRowKeys.length > 0) { // selectedRowKeys是跨页的，selectedRows不是
      this.props.dispatch({ type: 'itemInfo/deleteSelected' });
    } else {
      notification.warning({
        message: '警告!',
        description: '您目前没有选择任何数据！',
      });
    }
  }

  forAdd() {
    this.props.dispatch({ type: 'itemInfo/setState', payload: { record: {} } });
  }

  render() {
    const { page, data } = this.props.itemInfo;
    const { depts } = this.props.utils;
    const { dicts } = this.props.utils;
    const columns = [
      { title: '项目名称', dataIndex: 'itemName', key: 'itemName', width: 180 },
      // { title: '拼音', dataIndex: 'spellCode', key: 'spellCode' },
      // { title: '五笔', dataIndex: 'wbCode', key: 'wbCode' },
      { title: '自定义码', dataIndex: 'userCode', key: 'userCode', width: 75 },
      { title: '中心编码', dataIndex: 'groupCode', key: 'groupCode', width: 75 },
      { title: '物价编码', dataIndex: 'priceCode', key: 'priceCode', width: 75 },
      { title: '规格', dataIndex: 'specs', key: 'specs', width: 60 },
      { title: '单位', dataIndex: 'unit', key: 'unit', width: 60 },
      { title: '标准价格', dataIndex: 'unitPrice', key: 'unitPrice', width: 85, render: text => (text || 0.00).formatMoney(4), className: 'text-align-right' },
      { title: '维护分类',
        dataIndex: 'classCode',
        key: 'classCode',
        width: 70,
        className: 'text-align-center',
        render: (value) => {
          return dicts.dis('CLASS_CODE', value);
        },
      },
      { title: '费用分类',
        dataIndex: 'feeCode',
        key: 'feeCode',
        width: 70,
        className: 'text-align-center',
        render: (value) => {
          return dicts.dis('FEE_CODE', value);
        },
      },
      { title: '默认科室',
        dataIndex: 'defaultDept',
        key: 'defaultDept',
        width: 70,
        className: 'text-align-center',
        render: (value) => {
          return depts.disDeptName(this.props.utils.deptsIdx, value);
        },
      },
      /* { title: '备注', dataIndex: 'comm', key: 'comm' },*/
      { title: '复合项目',
        dataIndex: 'isgather',
        key: 'isgather',
        width: 70,
        className: 'text-align-center',
        render: (value) => {
          return value ? '是' : '否';
        },
      },
      { title: '执行确认',
        dataIndex: 'exec',
        key: 'exec',
        width: 70,
        className: 'text-align-center',
        render: (value) => {
          return value ? '是' : '否';
        },
      },
      { title: '停用标志',
        dataIndex: 'stop',
        key: 'stop',
        width: 70,
        className: 'text-align-center',
        render: (value) => {
          return value ? '正常' : '停用';
        },
      },
      { title: '操作',
        key: 'action',
        width: 75,
        className: 'text-align-center',
        render: (text, record) => (
          <span>
            <Icon type="edit" className="table-row-edit-btn" onClick={this.onEdit.bind(this, record)} />
            <span className="ant-divider" />
            <RowDelBtn onOk={this.onDelete.bind(this, record)} />
          </span>
          ),
      }];
    const { wsHeight } = this.props.base;

    return (
      <div>
        <CommonTable
          data={data} page={page} columns={columns}
          onPageChange={this.onPageChange.bind(this)}
          onSelectChange={this.rowSelectChange.bind(this)}
          bordered
          size="middle"
          scroll={{ y: (wsHeight - 85 - 33 - 60) }}
        />
      </div>
    );
  }
}

export default connect(
  ({ itemInfo, utils, base }) => ({ itemInfo, utils, base }),
)(ItemInfoList);
