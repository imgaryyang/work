import React, { Component } from 'react';
import { Col, Button, Form, Input, Icon } from 'antd';
import { connect } from 'dva';

const FormItem = Form.Item;

class EditorForm extends Component {

  saveTemplate() {
    this.props.dispatch({
      type: 'outpatientCharge/setState',
      payload: { record: '1,2' },
    });
  }

  handleReset() {
    this.props.dispatch({
      type: 'outpatientCharge/setState',
      payload: {
        itemCost: 0.00,
        itemData: [],
      },
    });
  }
  subItem() {
    this.props.dispatch({
      type: 'outpatientCharge/subItem',
    });
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const { itemCost } = this.props.outpatientCharge;

    return (
      <div style={{ height: '42px', paddingTop: `${(42 - 32)}px` }} >
        <Form inline>
          <Col span={10} >
            <FormItem label="合计费用" >
              { getFieldDecorator('totCost', { initialValue: itemCost ? itemCost.formatMoney(2) : '' })(<Input style={{ width: '100px', textAlign: 'center' }} />)}
            </FormItem>
          </Col>
          <Col span={14} style={{ textAlign: 'right' }} >
            <Button size="large" type="primary" onClick={this.subItem.bind(this)} icon="save" style={{ marginRight: '10px' }} >划价保存</Button>
            <Button size="large" onClick={this.handleReset.bind(this)}>
              <Icon type="reload" />重置
            </Button>
          </Col>
        </Form>
      </div>
    );
  }
}

const editorForm = Form.create()(EditorForm);
export default connect(
  ({ utils, outpatientCharge }) => ({ utils, outpatientCharge }))(editorForm);
