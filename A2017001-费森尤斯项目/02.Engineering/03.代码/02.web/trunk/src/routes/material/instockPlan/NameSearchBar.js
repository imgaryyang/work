import React, { Component } from 'react';
import { connect } from 'dva';
import { Form, Input, Button, Row, Col } from 'antd';

import styles from './InstockPlan.less';

const FormItem = Form.Item;

class InvSearchBar extends Component {

  constructor(props) {
    super(props);
    this.doSearch = ::this.doSearch;
    this.handleSubmit = ::this.handleSubmit;
    this.handleReset = ::this.handleReset;
  }

  doSearch(values) {
    if (typeof this.props.onSearch === 'function') { this.props.onSearch(values); }
  }

  handleSubmit() {
    this.props.form.validateFields((err, values) => {
      if (!err) this.doSearch(values);
    });
  }

  handleReset() {
    this.props.form.resetFields();
    this.doSearch();
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 0 },
      wrapperCol: { span: 24 },
      style: { width: '100%' },
    };
    return (
      <Form className={styles.form} >
        <Row>
          <Col span={12} style={{ paddingRight: '2px' }} >
            <FormItem {...formItemLayout} >
              {getFieldDecorator('appBill')(
                <Input
                  placeholder="申请单号"
                  onPressEnter={this.handleSubmit}
                  style={{ width: '100%' }}
                />,
              )}
            </FormItem>
          </Col>
          <Col span={12} style={{ paddingLeft: '3px' }} >
            <FormItem {...formItemLayout} >
              {getFieldDecorator('appOper')(
                <Input
                  placeholder="申请人"
                  onPressEnter={this.handleSubmit}
                  style={{ width: '100%' }}
                />,
              )}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={12} style={{ paddingRight: '2px' }} >
            <Button type="primary" size="large" onClick={() => this.handleSubmit()} style={{ width: '100%' }} icon="search" >查询</Button>
          </Col>
          <Col span={12} style={{ paddingLeft: '3px' }} >
            <Button onClick={this.handleReset} size="large" style={{ width: '100%' }} icon="reload" >清空</Button>
          </Col>
        </Row>
      </Form>
    );
  }
}

const InvSearchBarForm = Form.create()(InvSearchBar);
export default connect(
  ({ instockPlan, utils }) => ({ instockPlan, utils }),
)(InvSearchBarForm);
