import React, { Component } from 'react';
import { connect } from 'dva';
import { Button, Icon, Row, Col } from 'antd';
import CommonTable from '../../../components/CommonTable';
import DelRowsBtn from '../../../components/TableDeleteRowsButton';
import RowDelBtn from '../../../components/TableRowDeleteButton';
import SearchBar from './DictionarySearchBar';

class DictionaryList extends Component {
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
  };

  componentWillMount() {
    this.props.dispatch({
      type: 'dict/load',
    });
  }

  onEdit(record) {
    this.props.dispatch({
      type: 'dict/setState',
      payload: { record },
    });
  }

  onDelete(record) {
    // console.log('record in onDelete():', record);
    this.props.dispatch({
      type: 'dict/delete',
      id: record.id,
    });
  }

  onSearch(values) {
    // console.info('list search ',values)
    this.props.dispatch({
      type: 'dict/load',
      payload: {
        query: values,
        onSearch: true,
      },
    });
  }

  onPageChange(page) {
    this.props.dispatch({
      type: 'dict/load',
      payload: {
        page,
      },
    });
  }

  forAdd() {
    this.props.dispatch({
      type: 'dict/setState',
      payload: { record: {} },
    });
  }

  forDeleteSelected() {
    const { selectedRowKeys } = this.props.dict;
    if (selectedRowKeys && selectedRowKeys.length > 0) {
      this.props.dispatch({
        type: 'dict/deleteSelected',
      });
    }
  }

  rowSelectChange(selectedRowKeys) {
    // console.info('rowSelectChange', selectedRowKeys);
    this.props.dispatch({
      type: 'dict/setState',
      payload: {
        selectedRowKeys,
      },
    });
  }

  render() {
    const { dict, base } = this.props;
    const { page, data, selectedRowKeys } = dict;
    const { wsHeight } = base;

    const columns = [
      /* {title:'医院id', dataIndex :'hosId', key:'hosId', }, */
      {
        title: '分组', dataIndex: 'columnGroup', key: 'columnGroup', width: 110,
      },
      {
        title: '类别码', dataIndex: 'columnName', key: 'columnName', width: 110,
      },
      {
        title: '类别名', dataIndex: 'columnDis', key: 'columnDis', width: 110,
      },
      {
        title: '键', dataIndex: 'columnKey', key: 'columnKey', width: 100,
      },
      {
        title: '值', dataIndex: 'columnVal', key: 'columnVal', width: 130,
      },
      {
        title: '是否默认',
        dataIndex: 'defaulted',
        key: 'defaulted',
        render(value) {
          return value ? '是' : '否';
        },
        className: 'text-align-center',
        width: 70,
      },
      /* { title: '拼音', dataIndex: 'spellCode', key: 'spellCode', width: 60 },
      { title: '五笔', dataIndex: 'wbCode', key: 'wbCode', width: 60 },
      { title: '自定义码', dataIndex: 'userCode', key: 'userCode', width: 70 }, */
      {
        title: '停用标志',
        dataIndex: 'stop',
        key: 'stop',
        render: (value) => {
          return value ? '正常' : '停用';
        },
        className: 'text-align-center',
        width: 70,
      },
      {
        title: '排序', dataIndex: 'sortId', key: 'sortId', width: 60, className: 'text-align-center',
      },
      {
        title: '操作',
        key: 'action',
        render: (text, record) => (
          <span>
            <Icon type="edit" className="table-row-edit-btn" onClick={() => this.onEdit(record)} />
              <span className="ant-divider" />
                <RowDelBtn onOk={() => this.onDelete(record)} />
          </span>
        ),
        className: 'text-align-center',
        width: 70,
      }];
    return (
      <div style={{ paddingLeft: '10px', paddingTop: '3px' }} >
        <div style={{ marginBottom: 8 }} >
          <Row>
            <Col span={19} >{<SearchBar onSearch={this.onSearch} />}</Col>
              <Col span={5} style={{ textAlign: 'right' }} >
                <Button type="primary" size="large" style={{ marginRight: '10px' }} onClick={this.forAdd} icon="plus" >新增</Button>
                  <DelRowsBtn onOk={this.forDeleteSelected} selectedRows={selectedRowKeys} icon="delete" />
              </Col>
          </Row>
        </div>
          <CommonTable
            data={data}
            page={page}
            columns={columns}
            onPageChange={this.onPageChange.bind(this)}
            onSelectChange={this.rowSelectChange.bind(this)}
            scroll={{ y: (wsHeight - 41 - 35 - 62) }}
            bordered
          />
      </div>
    );
  }
}
export default connect(({ dict, base }) => ({ dict, base }))(DictionaryList);

