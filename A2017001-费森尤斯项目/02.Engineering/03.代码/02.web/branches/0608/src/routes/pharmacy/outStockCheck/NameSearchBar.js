import React, { Component } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Form, Input, Button, DatePicker, Row, Col } from 'antd';

import styles from './StockOutCheck.less';

const FormItem = Form.Item;

class InvSearchBar extends Component {

  constructor(props) {
    super(props);
    this.doSearch = this.doSearch.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleReset = this.handleReset.bind(this);
  }

  handleSubmit() {
    this.props.form.validateFields((err, values) => {
      if (!err) this.doSearch(values);
    });
  }

  doSearch(values) {
    if (typeof this.props.onSearch === 'function') { this.props.onSearch(values); }
  }

  handleReset() {
    this.props.form.resetFields();
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
              {getFieldDecorator('appOper')(
                <Input
                  placeholder="申请人"
                  onPressEnter={this.handleSubmit}
                  style={{ width: '100%' }}
                />,
              )}
            </FormItem>
          </Col>
          <Col span={12} style={{ paddingLeft: '3px' }} >
            <FormItem {...formItemLayout} >
              {getFieldDecorator('appTime',{ initialValue: moment() })(
                <DatePicker
                  placeholder="请领时间"
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
  ({ outStockCheck, utils }) => ({ outStockCheck, utils }),
)(InvSearchBarForm);
