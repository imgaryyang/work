import React, { Component } from 'react';
import { Row, Col, Button, Form, Input, Icon } from 'antd';
import { connect } from 'dva';

const FormItem = Form.Item;

class PricChargeFoot extends Component {

  state = {
    medicalCardRequired: true,
    checked: true,
    disabled: false,
    inputValue: '',
  };

  componentDidMount() {
    this.props.dispatch({
      type: 'pricCharge/setState',
      payload: { form: this.props.form },
    });
  }

  handleReset() {
    this.props.dispatch({
      type: 'pricCharge/setState',
      payload: {
        userInfo: {},
        tmpItem: [],
        itemCost: 0.00,
        itemData: [],
        record: 'clear',
        currentRecipe: '',
      },
    });
    this.props.dispatch({
      type: 'pricCharge/getCurrentInvoice',
      invoiceType: { invoiceType: '2' },
    });
    this.props.form.resetFields();
  }

  reset() {
    this.props.form.resetFields();
  }

  saveTemplate() {
    this.props.dispatch({
      type: 'pricCharge/setState',
      payload: { record: '1,2' },
    });
  }

  saveCharge() {
    this.props.dispatch({
      type: 'pricCharge/subItem',
    });
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const { itemCost } = this.props.pricCharge;

    return (
      <div style={{ height: '42px', paddingTop: `${(42 - 32)}px` }} >
        <Form inline>
          <Row>
            <Col span={14}>
              <FormItem label="合计费用" >
                { getFieldDecorator('totCost', { initialValue: itemCost ? itemCost.formatMoney(2) : '' })(<Input style={{ width: 100 }} disabled />)}
              </FormItem>
            </Col>
            <Col span={10} style={{ textAlign: 'right' }} >
              <Button size="large" type="primary" onClick={this.saveCharge.bind(this)} icon="pay-circle-o" style={{ marginRight: '10px' }} >划价</Button>
              <Button size="large" onClick={this.handleReset.bind(this)}>
                <Icon type="reload" />重置</Button>
            </Col>
          </Row>
        </Form>
      </div>
    );
  }
}

const editorForm = Form.create()(PricChargeFoot);
export default connect(
  ({ pricCharge, payCounter }) => ({ pricCharge, payCounter }))(editorForm);
