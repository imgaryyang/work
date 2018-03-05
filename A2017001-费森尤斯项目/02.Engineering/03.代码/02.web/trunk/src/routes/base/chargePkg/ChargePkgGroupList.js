import React, { Component } from 'react';
import { connect } from 'dva';
import { Form, Tooltip, Icon, Button, Row, Col, Input } from 'antd';
import CommonTable from '../../../components/CommonTable';
import RowDelBtn from '../../../components/TableRowDeleteButton';
import ShadowDiv from '../../../components/ShadowDiv';
import DictSelect from '../../../components/DictSelect';
import DeptSelect from '../../../components/DeptSelect';

import styles from './ChargePkg.less';

const FormItem = Form.Item;

class ChargePkgGroupList extends Component {

  constructor(props) {
    super(props);
    this.onSearch = this.onSearch.bind(this);
    this.onReset = this.onReset.bind(this);
    this.onEdit = this.onEdit.bind(this);
    this.onDelete = this.onDelete.bind(this);
    this.onRowClick = this.onRowClick.bind(this);
    this.doSearch = this.doSearch.bind(this);
    this.doAdd = this.doAdd.bind(this);
    this.onPageChange = this.onPageChange.bind(this);
  }

  componentWillMount() {
    // 载入组套列表
    this.props.dispatch({
      type: 'chargePkg/loadGroupPage',
      payload: {
        query: {},
        search: true,
      },
    });
  }

  onSearch() {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const newValues = values;
        if (newValues.useDept) newValues.useDept = { id: newValues.useDept };
        console.log(values);
        this.doSearch(newValues);
      }
    });
  }

  onReset() {
    this.props.form.resetFields();
    this.doSearch({});
  }
  onPageChange(page) {
    this.props.dispatch({
      type: 'chargePkg/loadGroupPage',
      payload: {
        page,
      },
    });
  }
  onEdit(record, idx) {
    this.props.dispatch({
      type: 'chargePkg/setState',
      payload: {
        groupRecord: record,
        groupListIdx: idx,
        groupEditVisible: true,
      },
    });
  }

  onDelete(record) {
    this.props.dispatch({
      type: 'chargePkg/deleteGroup',
      id: record.id,
    });
  }

  onRowClick(record, idx) {
    this.props.dispatch({
      type: 'chargePkg/setState',
      payload: {
        groupRecord: record,
        groupListIdx: idx,
        listIdx: -1,
        selectedItemRowKeys: [],
      },
    });
  }

  doSearch(query) {
    this.props.dispatch({
      type: 'chargePkg/loadGroupPage',
      payload: {
        query,
        search: true,
      },
    });
  }

  doAdd() {
    this.props.dispatch({
      type: 'chargePkg/setState',
      payload: {
        groupRecord: {},
        groupListIdx: -1,
        groupEditVisible: true,
      },
    });
  }

  render() {
    const { chargePkg, base, utils, form } = this.props;
    const { getFieldDecorator } = form;
    const { groups, groupListIdx, query, page } = chargePkg;

    const { wsHeight } = base;

    const formItemLayout = {
      wrapperCol: { span: 24 },
    };

    const columns = [
      { title: '模板名称',
        dataIndex: 'comboName',
        key: 'comboName',
        width: 210,
        render: (text, record) => {
          return (
            <span>
              {text}<br />
              <font style={{ color: '#d9d9d9' }} >
                {utils.dicts.dis('BUSI_CLASS', record.busiClass)}&nbsp;-&nbsp;
                {utils.dicts.dis('GROUP_TYPE', record.drugFlag)}&nbsp;-&nbsp;
                {utils.dicts.dis('SHARE_LEVEL', record.shareLevel)}
                {record.useDept ? `（${utils.depts.disDeptName(utils.deptsIdx, record.useDept.id)}）` : ''}
              </font>
            </span>
          );
        },
      },
      { title: '操作',
        dataIndex: 'id',
        key: 'operation',
        className: 'text-align-center',
        render: (value, record, idx) => {
          return (
            <span>
              <Tooltip placement="topLeft" title="修改" >
                <Icon type="edit" className="table-row-edit-btn" onClick={() => this.onEdit(record, idx)} />
              </Tooltip>
              <span className="ant-divider" />
              <Tooltip placement="topLeft" title="删除" >
                <RowDelBtn onOk={() => this.onDelete(record, idx)} />
              </Tooltip>
            </span>
          );
        },
        width: 75,
      },
    ];

    return (
      <div>
        <Form inline className={styles.form} >
          <Row className={styles.searchRow} >
            <Col span={12} >
              <FormItem style={{ width: '100%' }} {...formItemLayout} >
                {getFieldDecorator('busiClass', {
                  initialValue: query.busiClass,
                })(
                  <DictSelect
                    style={{ width: '100%' }}
                    tabIndex={0}
                    columnName="BUSI_CLASS"
                    placeholder="业务分类"
                    allowClear
                  />,
                )}
              </FormItem>
            </Col>
            <Col span={12} >
              <FormItem style={{ width: '100%' }} {...formItemLayout} >
                {getFieldDecorator('shareLevel', {
                  initialValue: query.shareLevel,
                })(
                  <DictSelect
                    style={{ width: '100%' }}
                    tabIndex={0}
                    columnName="SHARE_LEVEL"
                    placeholder="共享等级"
                    allowClear
                  />,
                )}
              </FormItem>
            </Col>
          </Row>
          <Row className={styles.searchRow} >
            <Col span={12} >
              <FormItem style={{ width: '100%' }} {...formItemLayout} >
                {getFieldDecorator('drugFlag', {
                  initialValue: query.drugFlag,
                })(
                  <DictSelect
                    style={{ width: '100%' }}
                    tabIndex={0}
                    columnName="GROUP_TYPE"
                    onSelect={this.chooseDrugFlag}
                    placeholder="药品标志"
                    allowClear
                  />,
                )}
              </FormItem>
            </Col>
            <Col span={12} >
              <FormItem style={{ width: '100%' }} {...formItemLayout} >
                {getFieldDecorator('useDept', {
                  initialValue: query.useDept ? query.useDept.id : '',
                })(
                  <DeptSelect
                    allowClear
                    placeholder="模板所属科室"
                  />,
                )}
              </FormItem>
            </Col>
          </Row>
          <Row className={styles.searchRow} >
            <Col span={24} style={{ paddingRight: '0', paddingLeft: '0' }} >
              <FormItem style={{ width: '100%' }} {...formItemLayout} >
                {getFieldDecorator('comboName', {
                  initialValue: query.comboName,
                })(
                  <Input maxLength={50} placeholder="模板名称" onPressEnter={this.onSearch} />,
                )}
              </FormItem>
            </Col>
          </Row>
          <Row className={styles.searchRow} >
            <Col span={12} >
              <Button onClick={this.onSearch} style={{ width: '100%' }} icon="search" >搜索</Button>
            </Col>
            <Col span={12} >
              <Button onClick={this.onReset} style={{ width: '100%' }} icon="reload" >清除</Button>
            </Col>
          </Row>
        </Form>
        <ShadowDiv showTopShadow={false} style={{ height: `${wsHeight - 10 - 130 - 54}px`, marginTop: '5px' }} >
          <CommonTable
            data={groups}
            columns={columns}
            paginationStyle="mini"
            pagination
            page={page}
            rowSelection={false}
            onPageChange={this.onPageChange}
            bordered
            onRowClick={this.onRowClick}
            style={{ cursor: 'pointer' }}
            scroll={{
              y: ((wsHeight - 10 - 130 - 54) - 33 - 48),
            }}
            rowClassName={
              (record, idx) => { return idx === groupListIdx ? 'selectedRow' : ''; }
            }
          />
        </ShadowDiv>
        <div className={styles.btnContainer} >
          <Button onClick={this.doAdd} icon="plus" size="large" >新建组套</Button>
        </div>
      </div>
    );
  }
}

const ChargePkgGroupListForm = Form.create()(ChargePkgGroupList);
export default connect(
  ({ chargePkg, base, utils }) => ({ chargePkg, base, utils }),
)(ChargePkgGroupListForm);

