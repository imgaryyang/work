import React, { Component } from 'react';
import { Row, Col, Button, Form, Input, Radio, Icon, message } from 'antd';
import { isUndefined, isEmpty } from 'lodash';
import CommonModal from '../../../components/CommonModal';
import DictRadioGroup from '../../../components/DictRadioGroup';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;

class EditorForm extends Component {

  constructor(props) {
    super(props);
    this.handleSubmit = ::this.handleSubmit;
    this.handleReset = ::this.handleReset;
  }

  componentWillReceiveProps(nextProps) {
    /* 通知提示 */
    const { success, msg } = nextProps.result;
    if (!isEmpty(nextProps.result)) {
      if (success) {
        message.success('保存成功！', 4);
      } else {
        message.warning(msg, 4);
      }
      this.props.dispatch({
        type: 'materialCompanyInfo/setState',
        payload: { result: {} },
      });
    }
  }

  handleSubmit() {
    const { record } = this.props;
    this.props.form.validateFields((err, values) => {
      if (err) {
        return;
      }
      this.props.dispatch({
        type: 'materialCompanyInfo/save',
        params: values,
      });
      if (isEmpty(record)) {
        this.handleReset();
      }
    });
  }

  handleReset() {
    this.props.form.resetFields();
  }

  render() {
    const { record, form, isSpin, visible, formCache, namespace } = this.props;
    const { getFieldDecorator } = this.props.form;
    const title = record.companyName || '新增厂商信息';
    const isCreate = isEmpty(this.props.record);
    const formItemLayout = {
      labelCol: { span: 5 },
      wrapperCol: { span: 15 },
    };
    return (
      <CommonModal
        width={600}
        title={title}
        visible={visible}
        namespace={namespace}
        form={form}
        formCache={formCache}
      >
        <Form>
          <FormItem style={{ display: 'none' }}>
            {getFieldDecorator('id', { initialValue: record.id })(<Input />)}
          </FormItem>
          <FormItem style={{ display: 'none' }}>
            {getFieldDecorator('companyId', { initialValue: record.companyId })(<Input />)}
          </FormItem>
          <Row>
            <Col span={18} offset={3}>
              <FormItem label="厂商名称" {...formItemLayout}>
                {
                  getFieldDecorator('companyName', {
                    initialValue: record.companyName || '',
                    rules: [
                      {
                        required: true,
                        message: '厂商名称不能为空',
                        max: 100,
                      },
                    ],
                  })(<Input tabIndex="2" maxLength={100} />)
                }
              </FormItem>
              <FormItem label="厂商分类" {...formItemLayout}>
                {
                  getFieldDecorator('companyType', {
                    initialValue: record.companyType || '1',
                    rules: [
                      {
                        required: true,
                        message: '厂商类型不能为空',
                      },
                    ],
                  })(
                    <DictRadioGroup
                      tabIndex="1"
                      columnName="COMPANY_TYPE"
                    />,
                  )
                }
              </FormItem>
              <FormItem label="停用标志" {...formItemLayout}>
                {
                  getFieldDecorator('stopFlag', {
                    initialValue: record.stopFlag || isUndefined(record.stopFlag),
                  })(
                    <RadioGroup tabIndex="4">
                      <Radio value>正常</Radio>
                      <Radio value={false}>停用</Radio>
                    </RadioGroup>)
                }
              </FormItem>
              <FormItem label="更新人员" {...formItemLayout} style={{ display: isCreate ? 'none' : '' }}>
                {getFieldDecorator('updateOper', { initialValue: record.updateOper })(<Input disabled />)}
              </FormItem>
              <FormItem label="更新时间" {...formItemLayout} style={{ display: isCreate ? 'none' : '' }}>
                {getFieldDecorator('updateTime', { initialValue: record.updateTime })(<Input disabled />)}
              </FormItem>
            </Col>
          </Row>
          <Row type="flex" gutter={24} className="action-form-footer">
            <Col span={24} className="action-form-operating">
              <Button size="large" onClick={this.handleReset} className="on-reload">
                <Icon type="reload" />重置
              </Button>
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
