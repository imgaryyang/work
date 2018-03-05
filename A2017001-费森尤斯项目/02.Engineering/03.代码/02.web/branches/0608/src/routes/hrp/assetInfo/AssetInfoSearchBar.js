import React, { Component } from 'react';
import { Row, Col, Form, Input, Button, Icon } from 'antd';

import DelRowsBtn from '../../../components/TableDeleteRowsButton';
import AsyncTreeCascader from '../../../components/AsyncTreeCascader';

const FormItem = Form.Item;

class AssetInfoSearchBar extends Component {

  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleReset = this.handleReset.bind(this);
    this.onAdd = this.onAdd.bind(this);
    this.onSearch = this.onSearch.bind(this);
    this.onSelectChange = this.onSelectChange.bind(this);
    this.onDeleteSelected = this.onDeleteSelected.bind(this);
  }

  onAdd() {
    this.props.dispatch({
      type: 'asset/setState',
      payload: {
        visible: true,
        record: {},
      },
    });
  }

  onSearch(values) {
    // console.log('values in onSearch:', values);
    this.props.dispatch({
      type: 'asset/load',
      payload: {
        query: values,
        startFrom0: true,
      },
    });
  }

  onDeleteSelected() {
    const { selectedRowKeys } = this.props;
    if (selectedRowKeys && selectedRowKeys.length > 0) {
      this.props.dispatch({ type: 'asset/deleteSelected' });
    }
  }

  onSelectChange(value) {
    this.props.dispatch({
      type: 'asset/setSearchObjs',
      payload: { ...this.props.searchObj, instrmType: value },
    });
  }

  handleSubmit() {
    this.props.form.validateFields((err, values) => {
      // console.log('values:', values);
      if (err) return;
      if (!err) {
        this.onSearch(values);
      }
    });
  }

  handleReset() {
    this.props.form.resetFields();
    this.onSearch();
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { selectedRowKeys } = this.props;

    return (
      <div className="action-form-wrapper">
        <Row type="flex">
          <Col span={12} className="action-form-searchbar">
            <Form inline>
              <FormItem >
                {
                  getFieldDecorator('instrmType')(
                    <AsyncTreeCascader
                      dictType="ASSETS_TYPE"
                      placeholder="选择资产类型"
                      style={{ width: '180px' }}
                      allowClear
                      onChange={this.onSelectChange}
                    />,
                  )
                }
              </FormItem>
              {/* <FormItem>
                {
                  getFieldDecorator('materialType')(
                    <DictSelect
                      columnName="MATERIAL_TYPE"
                      placeholder="选择资产类型"
                      style={{ width: '180px' }}
                      allowClear
                      onChange={this.onSelectChange}
                    />,
                  )
                }
              </FormItem>*/}
              <FormItem>
                {getFieldDecorator('commonName')(<Input placeholder="查询码(名称/拼音/五笔)" onPressEnter={this.handleSubmit} />)}
              </FormItem>
              <FormItem>
                <Button type="primary" onClick={this.handleSubmit}>
                  <Icon type="search" />查询
                </Button>
              </FormItem>
              <FormItem>
                <Button onClick={this.handleReset}>
                  <Icon type="reload" />清空
                </Button>
              </FormItem>
            </Form>
          </Col>
          <Col lg={{ span: 12 }} md={{ span: 12 }} sm={8} xs={24} className="action-form-operating">
            <Button type="primary" size="large" onClick={this.onAdd} className="on-add">
              <Icon type="plus" />新增
            </Button>
            <DelRowsBtn onOk={this.onDeleteSelected} selectedRows={selectedRowKeys} icon="delete" />
          </Col>
        </Row>
      </div>
    );
  }
}

export default Form.create()(AssetInfoSearchBar);
