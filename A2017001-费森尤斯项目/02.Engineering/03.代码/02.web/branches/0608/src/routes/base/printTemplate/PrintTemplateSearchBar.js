import React, { Component } from 'react';
import _ from 'lodash';
import { Row, Col, Form, Input, Modal, Button, notification, Icon } from 'antd';

const FormItem = Form.Item;
const confirm = Modal.confirm;

class PrintTemplateSearchBar extends Component {

  constructor(props) {
    super(props);
    this.handleSubmit = ::this.handleSubmit;
    this.handleReset = ::this.handleReset;
    this.onSearch = ::this.onSearch;
    this.setSearchObjs = ::this.setSearchObjs;
  }

  onSearch(values) {
    // console.log(values);
    this.props.dispatch({
      type: 'printTemplate/load',
      payload: { query: values },
    });
  }
  setSearchObjs(searchObj) {
    this.props.dispatch({
      type: 'printTemplate/setSearchObjs',
      payload: searchObj,
    });
  }

  handleSubmit() {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        // console.log(values);
        this.setSearchObjs(values);
        this.onSearch(this.props.searchObjs);
      }
    });
  }

  handleReset() {
    this.props.form.resetFields();
    this.setSearchObjs(null);
    this.onSearch(null);
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const {
      isSpin, selectedRowKeys, namespace, record, searchObjs } = this.props;

    const onAdd = () => {
      this.props.dispatch({ type: 'printTemplate/toggleVisible' });
      this.props.dispatch({
        type: 'utils/setState',
        payload: { record: {} },
      });
    };
    return (
      <div className="action-form-wrapper">
        <Row type="flex" justify="center">
          <Col span={12} className="action-form-searchbar">
            <Form inline>
              <FormItem>
                {getFieldDecorator('bizCode')(<Input placeholder="业务编码" onPressEnter={this.handleSubmit} />)}
              </FormItem>
              <FormItem>
                {getFieldDecorator('bizName')(<Input placeholder="业务名称" onPressEnter={this.handleSubmit} />)}
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
          <Col span={12} className="action-form-operating">
            <Button type="primary" size="large" onClick={onAdd.bind(this)} className="on-add">
              <Icon type="plus" />新增
            </Button>
          </Col>
        </Row>
      </div>
    );
  }
}

export default Form.create()(PrintTemplateSearchBar);
