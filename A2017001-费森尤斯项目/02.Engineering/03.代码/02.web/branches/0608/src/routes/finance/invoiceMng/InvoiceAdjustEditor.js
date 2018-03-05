import React, { Component } from 'react';
import { Row, Col, Button, Form, Input, Icon } from 'antd';
import { isEmpty } from 'lodash';
import DictSelect from '../../../components/DictSelect';
import CommonModal from '../../../components/CommonModal';
import NumberInput from '../../../components/NumberInput';

const FormItem = Form.Item;

class EditorForm extends Component {

  constructor(props) {
    super(props);
    this.handleSubmit = ::this.handleSubmit;
  }

  handleSubmit() {
    const { record } = this.props;
    this.props.form.validateFields((err, values) => {
      if (err) {
        return;
      }
      this.props.dispatch({
        type: 'invoiceAdjust/save',
        params: values,
      });
      if (isEmpty(record)) {
        this.props.form.resetFields();
      }
    });
  }

  render() {
    const { record, form, isSpin, visible, formCache, namespace } = this.props;
    const { getFieldDecorator } = this.props.form;
    const title = '发票调号';
    // const checkInvoiceNo = (rule, value, callback) => {
    //   if (parseInt(value, 10) < record.invoiceStart || parseInt(value, 10) > record.invoiceEnd) {
    //     callback('发票号必须在起始号和结束号之间!');
    //   }
    // };
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 12 },
    };
    return (
      <CommonModal
        width={400}
        title={title}
        visible={visible}
        namespace={namespace}
        form={form}
        formCache={formCache}
      >
        <Form>
          <Row>
            <Col span={24}>
              <FormItem style={{ display: 'none' }}>
                {getFieldDecorator('id', { initialValue: record.id })(<Input />)}
              </FormItem>
              <FormItem style={{ display: 'none' }}>
                {getFieldDecorator('invoiceState', { initialValue: record.invoiceState })(<Input />)}
              </FormItem>
              <FormItem label="发票分类" {...formItemLayout}>
                { getFieldDecorator('invoiceType', { initialValue: record.invoiceType })(
                  <DictSelect
                    showSearch disabled
                    style={{ width: '100%' }}
                    tabIndex="8"
                    columnName="INVOICE_TYPE"
                  />,
                )}
              </FormItem>
              <FormItem label="起始号码" {...formItemLayout} >
                { getFieldDecorator('invoiceStart', { initialValue: record.invoiceStart })(<Input disabled />) }
              </FormItem>
              <FormItem label="结束号码" {...formItemLayout}>
                { getFieldDecorator('invoiceEnd', { initialValue: record.invoiceEnd })(<Input disabled />) }
              </FormItem>
              <FormItem label="在用号码" {...formItemLayout}>
                {
                  getFieldDecorator('invoiceUse', {
                    initialValue: record.invoiceUse,
                    // rules: [{ validator: checkInvoiceNo }],
                  })(
                    <NumberInput
                      numberType="integer"
                      size="large"
                      tabIndex="10"
                    />,
                  )
                }
              </FormItem>
            </Col>
          </Row>
          <Row type="flex" gutter={24} className="action-form-footer">
            <Col span={24} className="action-form-operating">
              <Button size="large" type="primary" onClick={this.handleSubmit} className="on-save">
                <Icon type={isSpin ? 'loading' : 'save'} />保存
              </Button>
            </Col>
          </Row>
        </Form>
      </CommonModal>
    );
  }
}

export default Form.create()(EditorForm);
