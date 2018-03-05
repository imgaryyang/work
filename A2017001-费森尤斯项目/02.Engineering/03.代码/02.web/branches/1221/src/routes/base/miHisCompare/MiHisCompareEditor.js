import React, { Component } from 'react';
import { Row, Col, Button, Form, Input, Radio, Icon, message } from 'antd';
import { isUndefined, isEmpty } from 'lodash';
import CommonModal from '../../../components/CommonModal';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;

class MiHisCompareEditorForm extends Component {

  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleReset = this.handleReset.bind(this);
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
        type: 'miHisCompare/setState',
        payload: { result: {} },
      });
    }
  }

  handleReset() {
    this.props.form.resetFields();
  }

  handleSubmit() {
    const { record } = this.props;
    this.props.form.validateFields((err, values) => {
      if (err) {
        return;
      }
      this.props.dispatch({
        type: 'miHisCompare/save',
        params: values,
      });
      if (isEmpty(record)) {
        this.handleReset();
      }
    });
  }

  render() {
    const { record, form, isSpin, visible, formCache, namespace } = this.props;
    const { getFieldDecorator } = this.props.form;
    const title = record.bizName || '新增打印模板';
    const isCreate = isEmpty(this.props.record);
    const formItemLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 20 },
      width: '100%',
    };
    return (
      <CommonModal
        width={600}
        title={title}
        visible={visible}
        namespace={namespace}
        form={form}
        formCache={formCache}
        style={{ top: '30px' }}
      >
        <Form style={{ paddingRight: '20px' }} >
          <FormItem style={{ display: 'none' }}>
            {getFieldDecorator('id', { initialValue: record.id })(<Input />)}
          </FormItem>
          <Row>
            <Col span={24}>
              <FormItem label="业务编码" {...formItemLayout}>
                {
                  getFieldDecorator('bizCode', {
                    initialValue: record.bizCode || '',
                    rules: [
                      {
                        required: true,
                        message: '业务编码不能为空',
                        max: 100,
                      },
                    ],
                  })(<Input tabIndex="1" maxLength={100} style={{ width: '100%' }} />)
                }
              </FormItem>
              <FormItem label="业务名称" {...formItemLayout}>
                {
                  getFieldDecorator('bizName', {
                    initialValue: record.bizName || '',
                    rules: [
                      {
                        required: true,
                        message: '业务名称不能为空',
                        max: 100,
                      },
                    ],
                  })(<Input tabIndex="2" maxLength={100} style={{ width: '100%' }} />)
                }
              </FormItem>
              <FormItem label="处理业务" {...formItemLayout}>
                {
                  getFieldDecorator('printDataManager', {
                    initialValue: record.printDataManager || '',
                    rules: [
                      {
                        required: true,
                        message: '处理业务不能为空',
                        max: 100,
                      },
                    ],
                  })(<Input tabIndex="2" maxLength={100} style={{ width: '100%' }} />)
                }
              </FormItem>
              <FormItem label="打印模板" {...formItemLayout}>
                {
                  getFieldDecorator('printTemplate', {
                    initialValue: record.printTemplate || '',
                    rules: [
                      {
                        required: true,
                        message: '打印模板不能为空',
                      },
                    ],
                  })(<Input type="textarea" rows={9} tabIndex="3" style={{ width: '100%', fontSize: '10px', fontFamily: 'Courier' }} />)
                }
              </FormItem>
              <FormItem label="版本号" {...formItemLayout}>
                {
                  getFieldDecorator('version', {
                    initialValue: record.version || '',
                    rules: [
                      {
                        required: true,
                        message: '业务名称不能为空',
                        max: 100,
                      },
                    ],
                  })(<Input tabIndex="4" maxLength={100} />)
                }
              </FormItem>
              <FormItem label="启用标志" {...formItemLayout}>
                {
                  getFieldDecorator('effectiveFlag', {
                    initialValue: record.effectiveFlag || isUndefined(record.effectiveFlag),
                  })(
                    <RadioGroup tabIndex="4">
                      <Radio value>启用</Radio>
                      <Radio value={false}>停用</Radio>
                    </RadioGroup>)
                }
              </FormItem>
            </Col>
          </Row>
          <Row type="flex" gutter={24} className="action-form-footer">
            <Col span={24} style={{ textAlign: 'right' }} >
              <Button size="large" onClick={this.handleSubmit} type="primary" className="on-save" style={{ marginRight: '10px' }} >
                <Icon type={isSpin ? 'loading' : 'save'} />保存
              </Button>
              <Button size="large" onClick={this.reset} className="on-reload">
                <Icon type="reload" />重置
              </Button>
            </Col>
          </Row>
        </Form>
      </CommonModal>
    );
  }
}

export default Form.create()(MiHisCompareEditorForm);
