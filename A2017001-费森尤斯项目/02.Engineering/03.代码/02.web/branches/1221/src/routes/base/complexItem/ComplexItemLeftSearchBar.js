import React, { Component } from 'react';
import { connect } from 'dva';
import { Row, Col, Form, Input, Button } from 'antd';

const FormItem = Form.Item;

class LeftSearchBar extends Component {

  constructor(props) {
    super(props);
    this.handleSubmit = ::this.handleSubmit;
    this.handleReset = ::this.handleReset;
    this.doSearch = ::this.doSearch;
  }

  handleSubmit() {
    this.props.form.validateFields((err, values) => {
      if (err) return;
      this.doSearch(values);
    });
  }

  handleReset() {
    this.props.form.resetFields();
    this.doSearch({ itemName: '' });
  }

  doSearch(values) {
    if (typeof this.props.onSearch === 'function') { this.props.onSearch(values); }
  }

  render() {
    const { getFieldDecorator } = this.props.form;

    const formItemLayout = {
      labelCol: { span: 0 },
      wrapperCol: { span: 24 },
      style: { width: '100%', marginBottom: 0 },
    };

    return (
      <Form>
        <Row style={{ marginBottom: '5px' }} gutter={4}>
          <Col span={12} >
            <FormItem {...formItemLayout} >
              {getFieldDecorator('itemName')(
                <Input
                  placeholder="项目名称/拼音/五笔"
                  style={{ width: '100%' }}
                  onPressEnter={this.handleSubmit}
                />,
              )}
            </FormItem>
          </Col>
          <Col span={6} >
            <Button type="primary" onClick={this.handleSubmit} style={{ width: '100%' }} icon="search" size="large" >查询</Button>
          </Col>
          <Col span={6} >
            <Button onClick={this.handleReset} style={{ width: '100%' }} icon="rollback" size="large" >重置</Button>
          </Col>
        </Row>
      </Form>
    );
  }
}

const selfForm = Form.create()(LeftSearchBar);
export default connect(
  ({ utils }) => ({ utils }),
)(selfForm);
