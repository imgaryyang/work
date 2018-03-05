import React, { Component } from 'react';
import { Row, Col, Button, Form, Input, Radio, Icon, message, Select } from 'antd';
import { connect } from 'dva';
import { isUndefined, isEmpty } from 'lodash';
import CommonModal from '../../../components/CommonModal';
import DictSelect from '../../../components/DictSelect';

const FormItem = Form.Item;
const RadioGroup = Radio.Group; 

class EditorForm extends Component {

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
        type: 'interfaceconfig/setState',
        payload: { result: {} },
      });
    }
  } 

  handleReset() {
    this.props.form.resetFields();
  }

  handleHosChange(value) {
    if (value != null) {
      // 查询科室列表数据
      this.props.dispatch({
        type: 'interfaceconfig/loadDptListData',
        payload: {
          query: { hosId: value },
        },
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
        type: 'interfaceconfig/save',
        params: values,
      });
      if (isEmpty(record)) {
        this.handleReset();
      }
    });
  }

  render() {
    const { record, form, isSpin, visible, formCache, namespace, interfaceconfig } = this.props;
    console.log(namespace);
    const { getFieldDecorator } = this.props.form;
    const title = record.bizName || '新增接口配置项';
    const { hosListData } = interfaceconfig;
    console.log(record);
    const isCreate = isEmpty(this.props.record);
    const hosOptios = hosListData.map(elm =>
      <Option key={elm.id} value={elm.id}>
        {elm.hosName}
      </Option>,
    );

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
              <FormItem label="接口类型" {...formItemLayout}>
                {getFieldDecorator('interfaceType', {
                  initialValue: record.interfaceType+'' ? record.interfaceType : '',
                })(
                  <DictSelect columnName="INTERFACE_TYPE" style={{ width: '100%' }} />,
                )
              }
              </FormItem>
               <FormItem label="所属医院" {...formItemLayout} >
                    {
                      getFieldDecorator('hospital.id', {
                        initialValue: record.hospital ? record.hospital.id : '',
                        rules: [
                          { required: true, message: '所属医院必须选择' },
                        ],
                      })(
                        <Select placeholder="所属医院" style={{ width: '100%' }} allowClear >
                          {hosOptios}
                        </Select>,
                      )
                    }
                  </FormItem>
              <FormItem label="处理业务" {...formItemLayout}>
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
              <FormItem label="调用接口" {...formItemLayout}>
                {
                  getFieldDecorator('bizManager', {
                    initialValue: record.bizManager || '',
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
              <FormItem label="备注" {...formItemLayout}>
                {
                  getFieldDecorator('comment', {
                    initialValue: record.comment || '',
                  })(<Input type="textarea" rows={9} tabIndex="3" style={{ width: '100%', fontSize: '10px', fontFamily: 'Courier' }} />)
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

const Editor = Form.create()(EditorForm);
export default connect(
  ({ interfaceconfig }) => ({ interfaceconfig }),
)(Editor);
