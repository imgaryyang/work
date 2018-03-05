import React, { Component } from 'react';
import { connect } from 'dva';
import { Button, Icon, Row, Col, Popconfirm, notification } from 'antd';
import CommonTable from '../../../components/CommonTable';
// import Editor from './RoleEditor';
import SearchBar from './RoleSearchBar';


class RoleList extends Component {

  componentWillMount() {
    this.props.dispatch({
      type: 'role/load',
    });
  }
  onPageChange(page) {
    this.props.dispatch({
      type: 'role/load',
      payload: {
        page,
      },
    });
  }
  onEdit(record) {
    // console.info('onEdit', record);
    this.props.dispatch({
      type: 'role/setState',
      payload: { record },
    });
  }
  onDelete(record) {
    this.props.dispatch({
      type: 'role/delete',
      id: record.id,
    });
  }
  onSearch(values) {
    // console.info('list search ', values);
    this.props.dispatch({
      type: 'role/load',
      payload: {
        query: values,
      },
    });
  }

  forAdd() {
    this.props.dispatch({
      type: 'role/setState',
      payload: { record: {} },
    });
  }

  forDeleteAll() {
    // console.info('deleteAll', this.props);
    const { selectedRowKeys } = this.props.role;
    if (selectedRowKeys && selectedRowKeys.length > 0) { // selectedRowKeys是跨页的，selectedRows不是
      this.props.dispatch({
        type: 'role/deleteSelected',
      });
    } else {
      notification.warning({
        message: '警告!',
        description: '您目前没有选择任何数据！',
      });
    }
  }

  rowSelectChange(selectedRowKeys) {
    // console.info('rowSelectChange', selectedRowKeys);
    this.props.dispatch({
      type: 'role/setState',
      payload: { selectedRowKeys },
    });
  }

  render() {
    const { role } = this.props;
    const { page, data, selectedRowKeys } = role;
    // console.log('RoleList data:', data);
    const deleteAllF = this.forDeleteAll.bind(this);
    const columns = [
      { title: '编码', dataIndex: 'code', key: 'code', width: 200 },
      { title: '名称', dataIndex: 'name', key: 'name', width: 200 },
      /* { title: '创建人', dataIndex: 'creator', key: 'creator' },
      { title: '创建时间', dataIndex: 'createTime', key: 'createTime' },
      { title: '更新人', dataIndex: 'updater', key: 'updater' },
      { title: '更新时间', dataIndex: 'updateTime', key: 'updateTime' },*/
      // {title:'描述',  dataIndex :'description', key:'description'},
      { title: '操作',
        key: 'action',
        width: 100,
        className: 'text-align-center',
        render: (text, record) => (
          <span>
            <Icon type="edit" style={{ cursor: 'pointer', color: 'blue' }} onClick={this.onEdit.bind(this, record)} />
            <span className="ant-divider" />
            <Popconfirm
              placement="left" title={'您确定要删除此项么?'} cancelText={'否'} okText="是"
              onConfirm={this.onDelete.bind(this, record)}
            >
              <Icon type="delete" style={{ cursor: 'pointer', color: 'red' }} />
            </Popconfirm>
          </span>
        ),
      },
    ];

    const { wsHeight } = this.props.base;

    return (
      <div>
        <div style={{ marginBottom: '5px' }}>
          <Row>
            <Col span={17}><SearchBar onSearch={this.onSearch.bind(this)} /></Col>
            <Col span={7} style={{ textAlign: 'right' }} >
              <Button type="primary" style={{ marginRight: '4px' }} onClick={this.forAdd.bind(this)} icon="plus" size="large" >新增</Button>
              {
                (selectedRowKeys.length > 0) ? (
                  <Popconfirm
                    placement="left" cancelText={'否'} okText="是" onConfirm={deleteAllF}
                    title={(`您确定要删除所有的${selectedRowKeys.length}选中项么?`)}
                  >
                    <Button type="danger" icon="delete" size="large" >删除</Button>
                  </Popconfirm>
                ) : (<Button type="danger" onClick={deleteAllF} icon="delete" size="large" >删除</Button>)
              }
            </Col>
          </Row>
        </div>
        <CommonTable
          data={data}
          page={page}
          columns={columns}
          onPageChange={this.onPageChange.bind(this)}
          onSelectChange={this.rowSelectChange.bind(this)}
          bordered
          size="middle"
          scroll={{ y: (wsHeight - 6 - 10 - 37 - 33 - 60) }}
          expandedRowRender={record => <p>{`描述：${record.description || ''}`}</p>}
        />
      </div>
    );
  }
}
export default connect(
  ({ role, base }) => ({ role, base }),
)(RoleList);

