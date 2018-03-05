import React, { Component } from 'react';
import { Row, Col, Form, Input, Button } from 'antd';

const FormItem = Form.Item;

class InvoiceAdjustSearchBar extends Component {

  constructor(props) {
    super(props);
    this.handleSubmit = ::this.handleSubmit;
    this.handleReset = ::this.handleReset;
  }

  onSearch(values) {
    this.props.dispatch({
      type: 'invoiceAdjust/load',
      payload: { query: values },
    });
  }

  setSearchObjs(searchObj) {
    this.props.dispatch({
      type: 'invoiceAdjust/setSearchObjs',
      payload: searchObj,
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
    const { invoiceType } = this.props;
    const searchObj = { invoiceType };
    this.setSearchObjs(null);
    this.setSearchObjs(searchObj);
    this.props.form.resetFields();
    this.onSearch(searchObj);
  }

  render() {
    const { getFieldDecorator } = this.props.form;

    return (
      <div className="action-form-wrapper">
        <Row type="flex" justify="left">
          <Col span={20} className="action-form-searchbar">
            <Form inline>
              <FormItem>
                {getFieldDecorator('invoiceStart')(<Input placeholder="发票起始号" />)}
              </FormItem>
              <FormItem>
                {getFieldDecorator('invoiceEnd')(<Input placeholder="发票结束号" />)}
              </FormItem>
              <FormItem>
                <Button type="primary" onClick={this.handleSubmit}>查询</Button>
              </FormItem>
              <FormItem>
                <Button onClick={this.handleReset}>清空</Button>
              </FormItem>
            </Form>
          </Col>
        </Row>
      </div>
    );
  }
}

export default Form.create()(InvoiceAdjustSearchBar);
