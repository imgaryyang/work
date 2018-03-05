import React, { Component } from 'react';
import { connect } from 'dva';
import { Button, Icon, Row, Col, Badge } from 'antd';
import CommonTable from '../../../components/CommonTable';
import SearchBar from './CtrlParamSearchBar';

class CtrlParamList extends Component {

  constructor(props) {
    super(props);
    this.onEdit = this.onEdit.bind(this);
    this.onDelete = this.onDelete.bind(this);
    this.onSearch = this.onSearch.bind(this);
    this.onPageChange = this.onPageChange.bind(this);
    this.forAdd = this.forAdd.bind(this);
    this.forDeleteSelected = this.forDeleteSelected.bind(this);
    this.rowSelectChange = this.rowSelectChange.bind(this);
  }

  state = {
    visible: false,
    delConfirmMsg: '',
  };

  componentWillMount() {
    this.props.dispatch({
      type: 'ctrlParam/load',
    });
    this.props.dispatch({
      type: 'utils/initDicts',
      payload: ['HOS_INFO'],
    });
  }

  onEdit(record) {
    this.props.dispatch({
      type: 'ctrlParam/setState',
      payload: { record },
    });
  }

  onDelete(record) {
    this.props.dispatch({
      type: 'ctrlParam/delete',
      id: record.id,
    });
  }

  onSearch(values) {
    this.props.dispatch({
      type: 'ctrlParam/load',
      payload: {
        query: values,
        onSearch: true,
      },
    });
  }

  onPageChange(page) {
    this.props.dispatch({
      type: 'ctrlParam/load',
      payload: {
        page,
      },
    });
  }

  forAdd() {
    this.props.dispatch({
      type: 'ctrlParam/setState',
      payload: { record: {} },
    });
  }

  forDeleteSelected() {
    const { selectedRowKeys } = this.props.ctrlParam;
    if (selectedRowKeys && selectedRowKeys.length > 0) {
      this.props.dispatch({
        type: 'ctrlParam/deleteSelected',
      });
    }
  }

  rowSelectChange(selectedRowKeys) {
    this.props.dispatch({
      type: 'ctrlParam/setState',
      payload: {
        selectedRowKeys,
      },
    });
  }

  render() {
    const { ctrlParam, base, utils } = this.props;
    const { page, data } = ctrlParam;
    const { wsHeight } = base;
    const { dicts } = utils;

    const columns = [
      {
        title: '医院',
        dataIndex: 'hosId',
        key: 'hosId',
        width: 100,
        render: (value) => {
          return dicts.dis('HOS_INFO', value);
        },
      },
      { title: '控制分类', dataIndex: 'controlClass', key: 'controlClass', width: 100 },
      { title: '控制id', dataIndex: 'controlId', key: 'controlId', width: 200 },
      { title: '控制说明', dataIndex: 'controlNote', key: 'controlNote', width: 300 },
      { title: '控制参数', dataIndex: 'controlParam', key: 'controlParam', width: 80 },
      { title: '停用标志',
        dataIndex: 'stopFlag',
        key: 'stopFlag',
        width: 80,
        render: value => (
          <span><Badge status={value ? 'success' : 'error'} />{value ? '正常' : '停用'}</span>
        ),
      },
      { title: '操作',
        key: 'action',
        width: 80,
        render: (text, record) => (
          <span>
            <Icon type="edit" className="table-row-edit-btn" onClick={() => this.onEdit(record)} />
          </span>
        ),
      }];
    return (
      <div style={{ paddingLeft: '10px', paddingTop: '3px' }} >
        <div style={{ marginBottom: 8 }} >
          <Row>
            <Col span={19} >{<SearchBar onSearch={this.onSearch} />}</Col>
            <Col span={5} style={{ textAlign: 'right' }} >
              <Button type="primary" size="large" style={{ marginRight: '10px' }} onClick={this.forAdd} icon="plus" >新增</Button>
            </Col>
          </Row>
        </div>
        <CommonTable
          data={data} page={page} columns={columns}
          onPageChange={this.onPageChange.bind(this)}
          onSelectChange={this.rowSelectChange.bind(this)}
          scroll={{ y: (wsHeight - 41 - 36 - 62) }}
          bordered
        />
      </div>
    );
  }
}
export default connect(({ ctrlParam, base, utils }) => ({ ctrlParam, base, utils }))(CtrlParamList);
