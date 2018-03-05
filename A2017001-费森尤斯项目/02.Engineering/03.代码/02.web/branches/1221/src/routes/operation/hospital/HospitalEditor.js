import React, { Component } from 'react';
import { connect } from 'dva';
import { Row, Col, Button, Modal, Form, Input, Radio, Spin, DatePicker } from 'antd';
import moment from 'moment';
import { isNull, isUndefined } from 'lodash';
import DictSelect from '../../../components/DictSelect';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;

function compare(obj, values) {
  if (typeof obj.id === 'undefined') {
    return false;
  }
  for (const key in obj) {
    if (obj[key] !== values[key]) return true;
  }
  return false;
}

class EditorForm extends Component {

  constructor(props) {
    super(props);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.close = this.close.bind(this);
    this.reset = this.reset.bind(this);
  }

  componentWillMount() {
    this.props.dispatch({
      type: 'utils/initDicts',
      payload: ['PARENT_ID', 'HOS_AREA', 'HOS_GRADE', 'HOS_TYPE'],
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.data == null) this.reset();
  }

  reset() {
    this.props.form.resetFields();
  }

  handleCancel() {
    const values = this.props.form.getFieldsValue();
    const data = this.props.data;
    const changed = false; // compare(values, data);
    if (changed) {
      Modal.confirm({
        title: '确认',
        content: '放弃保存您的修改？',
        okText: '放弃',
        cancelText: '我再看看',
        onOk: () => { this.close(); },
      });
    } else {
      this.close();
    }
  }

  close() {
    this.props.dispatch({
      type: 'optHospital/setState',
      payload: { record: null },
    });
  }

  handleSubmit() {
    this.props.form.validateFields((err, values) => {
      if (err) {
        return;
      }
      this.props.dispatch({
        type: 'optHospital/save',
        params: values,
      });
    });
  }
  render() {
    const { spin } = this.props.optHospital;

    const { getFieldDecorator } = this.props.form;
    const data = this.props.data || {};
    const visible = !isNull(this.props.data);
    const title = data.hosName ? `修改 - ${data.hosName}` : '新增';
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
    };

    return (
      <Modal
        width={850}
        title={title}
        visible={visible}
        closable
        footer={null}
        maskClosable={false}
        onCancel={this.handleCancel}
      >
        <Spin spinning={spin} >
          <Form>
            <FormItem style={{ display: 'none' }}>
              {
                getFieldDecorator('id', {
                  initialValue: data.id,
                })(
                  <Input />,
                  )
              }
            </FormItem>
            <FormItem style={{ display: 'none' }} >
              {getFieldDecorator('hosId', {
                initialValue: data.hosId,
              })(
                <Input />,
              )}
            </FormItem>
            <Row>
              <Col span={8}>
                <FormItem label="上级机构" {...formItemLayout}>
                  {
                    getFieldDecorator('parentId', {
                      initialValue: data.parentId,
                    })(
                      <DictSelect columnName="PARENT_ID" />,
                    )
                  }
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem label="医院名称" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
                  {
                    getFieldDecorator('hosName', {
                      initialValue: data.hosName,
                      rules: [{ required: true, message: '医院名称不能为空' }],
                    })(<Input tabIndex={3} />)
                 }
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem label="医院简称" {...formItemLayout}>
                  {
                     getFieldDecorator('hName', {
                       initialValue: data.hName,
                     })(<Input tabIndex={4} />)
                   }
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={8}>
                <FormItem label="机构代码" {...formItemLayout}>
                  {
                    getFieldDecorator('groupId', {
                      initialValue: data.groupId,
                    })(<Input tabIndex={11} />)
                  }
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem label="医院编码" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
                  {
                    getFieldDecorator('customCode', {
                      initialValue: data.customCode,
                    })(<Input tabIndex={7} />)
                  }
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem label="院区" {...formItemLayout}>
                  {
                    getFieldDecorator('hosArea', {
                      initialValue: data.hosArea,
                    })(
                      <DictSelect columnName="HOS_AREA" />,
                    )
                  }
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={8}>
                <FormItem label="医院类型" {...formItemLayout}>
                  {
                      getFieldDecorator('hosType', {
                        initialValue: data.hosType,
                      })(
                        <DictSelect columnName="HOS_TYPE" />,
                       )
                }
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem label="医院等级" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
                  {
                      getFieldDecorator('hosGrade', {
                        initialValue: data.hosGrade,
                      })(
                        <DictSelect columnName="HOS_GRADE" />,
                      )
                }
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem label="状态" {...formItemLayout}>
                  {
                     getFieldDecorator('stopFlag', {
                       initialValue: data.stopFlag || isUndefined(data.stopFlag),
                       rules: [{ required: true, message: '状态不能为空' }],
                     })(
                       <RadioGroup tabIndex="4">
                         <Radio value>正常</Radio>
                         <Radio value={false}>停用</Radio>
                       </RadioGroup>,
                     )
                  }
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={8}>
                <FormItem label="开业时间" {...formItemLayout}>
                  {
                     getFieldDecorator('busiTime', {
                       initialValue: data.busiTime ? moment(data.startTime) : null,
                     })(<DatePicker tabIndex={16} style={{ width: '100%' }} />)
                }
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem label="医院坐标" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
                  {
                    getFieldDecorator('hosLocation', {
                      initialValue: data.hosLocation,
                    })(<Input tabIndex={15} />)
                }
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem label="医院地址" {...formItemLayout}>
                  {
                     getFieldDecorator('pAddress', {
                       initialValue: data.pAddress,
                     })(<Input tabIndex={17} />)
                  }
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={16}>
                <FormItem label="简介" labelCol={{ span: 3 }} wrapperCol={{ span: 21 }}>
                  {
                     getFieldDecorator('introduce', {
                       initialValue: data.introduce,
                     })(<Input tabIndex={13} />)
                 }
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem label="联系电话" {...formItemLayout}>
                  {
                    getFieldDecorator('linkTel', {
                      initialValue: data.linkTel,
                    })(<Input tabIndex={14} />)
               }
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={6}>
                <FormItem label="英文名称" {...formItemLayout} style={{ display: 'none' }}>
                  {
                    getFieldDecorator('eName', {
                      initialValue: data.eName,
                    })(<Input tabIndex={8} />)
                  }
                </FormItem>
              </Col>
              <Col span={6}>
                <FormItem label="拼音" {...formItemLayout} style={{ display: 'none' }}>
                  {
                    getFieldDecorator('spellCode', {
                      initialValue: data.spellCode,
                    })(<Input disabled />)
                  }
                </FormItem>
              </Col>
              <Col span={6}>
                <FormItem label="五笔" {...formItemLayout} style={{ display: 'none' }}>
                  {
                    getFieldDecorator('wbCode', {
                      initialValue: data.wbCode,
                    })(<Input disabled />)
                  }
                </FormItem>
              </Col>
              <Col span={6}>
                <FormItem label="医院ID" {...formItemLayout} style={{ display: 'none' }}>
                  {
                    getFieldDecorator('hosId', {
                      initialValue: data.hosId,
                    })(<Input disabled />)
                  }
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={24} style={{ textAlign: 'right' }} >
                <Button type="primary" style={{ marginRight: '10px' }} icon="save" size="large" onClick={this.handleSubmit} >保存</Button>
                <Button onClick={this.reset} icon="reload" size="large" >重置</Button>
              </Col>
            </Row>
          </Form>
        </Spin>
      </Modal>
    );
  }
}
const Editor = Form.create()(EditorForm);
export default connect(({ optHospital }) => ({ optHospital }))(Editor);
