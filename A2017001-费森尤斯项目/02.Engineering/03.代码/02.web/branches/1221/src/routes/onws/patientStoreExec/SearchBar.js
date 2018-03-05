import React, { Component } from 'react';
import { Row, Col, Form, Input, Modal, Button, notification, Icon } from 'antd';

const FormItem = Form.Item;
const confirm = Modal.confirm;

class SearchBar extends Component {

  onSearch(values) {
    this.props.dispatch({
      type: 'patientStoreExec/load',
      payload: { query: values },
    });
  }

  setSearchObjs(searchObj) {
    this.props.dispatch({
      type: 'patientStoreExec/setSearchObjs',
      payload: searchObj,
    });
  }

  setTag(selectedTag) {
    this.props.dispatch({
      type: 'patientStoreExec/setState',
      payload: { selectedTag },
    });
  }

  handleSubmit() {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.setSearchObjs(values);
        this.onSearch(this.props.searchObjs);
      }
    });
  }

  handleReset() {
    this.props.form.resetFields();
    this.setTag(null);
    this.setSearchObjs(null);
    this.onSearch();
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 16 },
    };
    return (
      <div className="action-form-wrapper">
        <Row type="flex">
          <Col span={12} className="action-form-searchbar">
            <Form inline >
              <FormItem>
                {getFieldDecorator('commonName')(<Input placeholder="查询码(名称/拼音/五笔)" />)}
              </FormItem>
              <FormItem {...formItemLayout} label="就诊号">
                {getFieldDecorator('commonName')(<Input placeholder="查询码(名称/拼音/五笔)" />)}
              </FormItem>
              <FormItem {...formItemLayout} label="姓名">
                {getFieldDecorator('commonName')(<Input placeholder="查询码(名称/拼音/五笔)" />)}
              </FormItem>
              <FormItem {...formItemLayout} label="身份证号">
                {getFieldDecorator('commonName')(<Input placeholder="查询码(名称/拼音/五笔)" />)}
              </FormItem>
              <FormItem {...formItemLayout} label="收费时间">
                {getFieldDecorator('commonName')(<Input placeholder="查询码(名称/拼音/五笔)" />)}
              </FormItem>
              <FormItem>
                <Button type="primary" onClick={this.handleSubmit.bind(this)}>
                  <Icon type="search" />查询
                </Button>
              </FormItem>
              <FormItem>
                <Button onClick={this.handleReset.bind(this)}>
                  <Icon type="reload" />清空
                </Button>
              </FormItem>
            </Form>
          </Col>
        </Row>
      </div>
    );
  }
}

export default Form.create()(SearchBar);
