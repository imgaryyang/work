import React, { Component } from 'react';
import { Row, Col, Button, Form, Input, Icon, Modal, Spin } from 'antd';
import RegRefundList from './RegRefundList';

const FormItem = Form.Item;

class EditorForm extends Component {

  constructor(props) {
    super(props);
    this.handleSubmit = ::this.handleSubmit;
    this.handleCancel = ::this.handleCancel;
  }

  handleSubmit() {
    const { id } = this.props.record;
    this.props.dispatch({ type: 'regInfo/update', id });
  }

  handleCancel() {
    this.props.dispatch({ type: 'regInfo/toggleVisible' });
    this.props.dispatch({ type: 'regInfo/setState', payload: { record: {}, payWays: [] } });
  }

  render() {
    const { record, isSpin, isModalSpin, visible, payWays, dicts } = this.props;
    const regDept = record.regDept || {};
    const { getFieldDecorator } = this.props.form;
    const title = '退号操作';
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
    };
    const refundListProps = { payWays, dicts };

    return (
      <Modal
        width={600}
        title={title}
        visible={visible}
        closable
        footer={null}
        maskClosable={false}
        onCancel={this.handleCancel}
      >
        <Spin spinning={isModalSpin}>
          <Form>
            <FormItem style={{ display: 'none' }}>
              {getFieldDecorator('id', { initialValue: record.id })(<Input />)}
            </FormItem>
            <Row>
              <Col span={12}>
                <FormItem label="挂号科室" {...formItemLayout}>
                  {
                    getFieldDecorator('regDept', {
                      initialValue: regDept.deptName || '',
                    })(<Input disabled />)
                  }
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem label="挂号种类" {...formItemLayout}>
                  {
                    getFieldDecorator('regLevel', {
                      initialValue: dicts.dis('REG_LEVEL', record.regLevel) || '',
                    })(<Input disabled />)
                  }
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <FormItem label="总费用" {...formItemLayout}>
                  {
                    getFieldDecorator('totalAmt', {
                      initialValue: (record.totalAmt || 0).formatMoney(),
                    })(<Input disabled />)
                  }
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem label="应退费用" {...formItemLayout}>
                  {
                    getFieldDecorator('refundAmt', {
                      initialValue: (record.refundAmt || 0).formatMoney(),
                    })(<Input disabled />)
                  }
                </FormItem>
              </Col>
            </Row>
            <RegRefundList {...refundListProps} />
            <Row type="flex" gutter={24} className="action-form-footer">
              <Col span={24} className="action-form-operating">
                <Button size="large" type="primary" onClick={this.handleSubmit} className="on-save">
                  <Icon type={isSpin ? 'loading' : 'rollback'} />退号
                </Button>
              </Col>
            </Row>
          </Form>
        </Spin>
      </Modal>
    );
  }
}

export default Form.create()(EditorForm);
