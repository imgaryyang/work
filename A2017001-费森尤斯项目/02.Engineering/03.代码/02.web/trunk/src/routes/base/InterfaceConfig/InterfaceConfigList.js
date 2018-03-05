import React, { Component } from 'react';
import { Icon, Popconfirm, Badge } from 'antd';
import CommonTable from '../../../components/CommonTable';

class InterfaceConfigList extends Component {

  onEdit(record) {
    this.props.dispatch({ type: 'interfaceconfig/toggleVisible' });
    this.props.dispatch({
      type: 'utils/setState',
      payload: { record }, 
    });
  }

  onDelete(record) {
    this.props.dispatch({
      type: 'interfaceconfig/delete',
      id: record.id,
    });
  }

  onSearch(values) {
    this.props.dispatch({
      type: 'interfaceconfig/load',
      payload: { values },
    });
  }

  onPageChange(page) {
    this.props.dispatch({
      type: 'interfaceconfig/load',
      payload: { page },
    });
  }

  rowSelectChange(selectedRowKeys) {
    this.props.dispatch({
      type: 'interfaceconfig/setState',
      payload: { selectedRowKeys },
    });
  }

  render() {
    const { page, data, dicts, wsHeight } = this.props;
    console.log(dicts);

    const columns = [
      /* {
        title: '医院id',
        dataIndex: 'hosId',
        width: '15%',
        key: 'hosId',
      }, */{
        title: '医院名称',
        dataIndex: 'hospital.hosName',
        width: '15%',
        key: 'bizCode',
        className: 'text-align-center',
      }, {
        title: '接口类型',
        dataIndex: 'interfaceType',
        width: '15%', 
        key: 'interfaceType',
        className: 'text-align-center',
        render: (text) => {
          return dicts.dis('INTERFACE_TYPE', text);
        },
      },
      {
        title: '业务名称',
        dataIndex: 'bizName',
        width: '15%',
        key: 'bizName',
      }, {
        title: '处理业务',
        dataIndex: 'bizManager',
        width: '20%',
        key: 'bizManager',
      },{
        title: '有效标志',
        dataIndex: 'effectiveFlag',
        width: '15%',
        key: 'effectiveFlag',
        className: 'text-align-center',
        render: value => (
          <span><Badge status={value ? 'success' : 'error'} />{value ? '启用' : '停用'}</span>
        ),
      }, {
        title: '操作',
        width: '20%',
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
          bordered
          rowSelection={false}
          scroll={{ y: (wsHeight - 47 - 33 - 62 - 2) }}
        />
      </div>
    );
  }
}
export default InterfaceConfigList;
