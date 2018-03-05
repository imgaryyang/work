import React, { Component } from 'react';
import { Icon, Popconfirm, Badge } from 'antd';
import CommonTable from '../../../components/CommonTable';

class PrintTemplateList extends Component {

  onEdit(record) {
    this.props.dispatch({ type: 'printTemplate/toggleVisible' });
    this.props.dispatch({
      type: 'utils/setState',
      payload: { record },
    });
  }

  onDelete(record) {
    this.props.dispatch({
      type: 'printTemplate/delete',
      id: record.id,
    });
  }

  onSearch(values) {
    this.props.dispatch({
      type: 'printTemplate/load',
      payload: { values },
    });
  }

  onPageChange(page) {
    this.props.dispatch({
      type: 'printTemplate/load',
      payload: { page },
    });
  }

  rowSelectChange(selectedRowKeys) {
    this.props.dispatch({
      type: 'printTemplate/setState',
      payload: { selectedRowKeys },
    });
  }

  render() {
    const { page, data, dicts, wsHeight } = this.props;

    const columns = [
      /* {
        title: '医院id',
        dataIndex: 'hosId',
        width: '15%',
        key: 'hosId',
      }, */{
        title: '业务编码',
        dataIndex: 'bizCode',
        width: '10%',
        key: 'bizCode',
        className: 'text-align-center',
      }, {
        title: '业务名称',
        dataIndex: 'bizName',
        width: '15%',
        key: 'bizName',
      }, {
        title: '打印数据manager',
        dataIndex: 'printDataManager',
        width: '25%',
        key: 'printDataManager',
      }, {
        title: '版本',
        dataIndex: 'version',
        width: '10%',
        key: 'version',
        className: 'text-align-center',
      }, {
        title: '有效标志',
        dataIndex: 'effectiveFlag',
        width: '10%',
        key: 'effectiveFlag',
        className: 'text-align-center',
        render: value => (
          <span><Badge status={value ? 'success' : 'error'} />{value ? '启用' : '停用'}</span>
        ),
      }, {
        title: '操作',
        width: '10%',
        key: 'action',
        className: 'text-align-center text-no-wrap',
        render: (text, record) => (
          <span>
            <Icon type="edit" className="tableEditIcon" onClick={this.onEdit.bind(this, record)} />
            <span className="ant-divider" />
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
          scroll={{ y: (wsHeight - 47 - 33 - 62 - 2) }}
        />
      </div>
    );
  }
}
export default PrintTemplateList;
