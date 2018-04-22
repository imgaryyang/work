import React, { Component } from 'react';
import { connect } from 'dva';
import { Spin, Tabs, Row, Col, Button, Modal, DatePicker, Form, Input } from 'antd';
import moment from 'moment';

import { arrayToString } from '../../../utils/tools';
import { testMobile, testCnIdNo } from '../../../utils/validation';

import UserAccounts from './UserAccounts';
/* import DictRadioGroup from '../../../components/DictRadioGroup';
import DictSelect from '../../../components/DictSelect';
import DeptTreeSelect from '../../../components/DeptTreeSelect';
import DeptSelect from '../../../components/DeptSelect';*/

const FormItem = Form.Item;
const TabPane = Tabs.TabPane;

function compare(obj, values) {
  for (const key in obj) {
    if (obj[key] !== values[key]) {
      return true;
    }
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
    this.onSelectDept = this.onSelectDept.bind(this);
    this.onSelectDepts = this.onSelectDepts.bind(this);
  }

  componentWillMount() {
    /* this.props.dispatch({
      type: 'utils/initDepts',
    });*/
  }

  /* componentWillReceiveProps(nextProps) {
    if (nextProps.data == null) {
      this.reset();
    }
  } */

  onSelectDept(value, node) {
    // console.log(value, node);
    this.props.dispatch({
      type: 'user/setState',
      payload: {
        record: {
          ...this.props.user.record,
          deptCode: node.props.originData.deptId,
          deptName: node.props.title,
        },
      },
    });
  }

  onSelectDepts(value, label) {
    // console.log(value, label);
    const codes = [];
    for (let i = 0; i < value.length; i += 1) {
      codes.push(this.props.utils.depts.getDept(this.props.utils.deptsIdx, value[i]).deptId);
      // console.log(this.props.utils.depts.disDeptName(this.props.utils.deptsIdx, value[i]));
    }
    this.props.dispatch({
      type: 'user/setState',
      payload: {
        record: {
          ...this.props.user.record,
          loginDeptsCode: arrayToString(codes),
          loginDeptsName: arrayToString(label),
        },
      },
    });
  }

  reset() {
    this.props.form.resetFields();
  }

  handleCancel() {
    const values = this.props.form.getFieldsValue();
    if (values.bornDate) {
      values.bornDate = values.bornDate.format('YYYY-MM-DD');
    }
    const data = this.props.user.record;
    const changed = compare(values, data);
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
      type: 'user/setState',
      payload: {
        record: {},
        spin: false,
        visible: false,
      },
    });
    this.props.form.resetFields();
  }

  handleSubmit() {
    this.props.form.validateFields((err, values) => {
      // console.log('Received values of form: ', values);
      if (!err) {
        const newValues = { ...values };
        if (newValues.bornDate) {
          newValues.bornDate = newValues.bornDate.format('YYYY-MM-DD');
        }
        this.props.dispatch({
          type: 'user/save',
          params: newValues,
        });
        this.props.form.resetFields();
      }
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { spin, record, visible } = this.props.user;

    const title = record && record.name ? `修改${record.name}个人信息` : '新增人员';
    const isCreate = !record || !record.id;

    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 16 },
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
          <Form onSubmit={this.handleSubmit}>
            <FormItem style={{ display: 'none' }}>
              {
                getFieldDecorator('id', { initialValue: record.id })(<Input />)
              }
            </FormItem>
            <FormItem style={{ display: 'none' }}>
              {
                getFieldDecorator('hosId', { initialValue: record.hosId })(<Input />)
              }
            </FormItem>
            <FormItem style={{ display: 'none' }}>
              {
                getFieldDecorator('active', { initialValue: record.active })(<Input />)
              }
            </FormItem>
            <FormItem style={{ display: 'none' }}>
              {
                getFieldDecorator('expired', { initialValue: record.expired })(<Input />)
              }
            </FormItem>
            <FormItem style={{ display: 'none' }}>
              {
                getFieldDecorator('createDate', { initialValue: record.createDate })(<Input />)
              }
            </FormItem>
            <FormItem style={{ display: 'none' }}>
              {
                getFieldDecorator('effectDate', { initialValue: record.effectDate })(<Input />)
              }
            </FormItem>
            <FormItem style={{ display: 'none' }}>
              {
                getFieldDecorator('expirDate', { initialValue: record.expirDate })(<Input />)
              }
            </FormItem>
            <FormItem style={{ display: 'none' }}>
              {
                getFieldDecorator('org', { initialValue: record.org })(<Input />)
              }
            </FormItem>
            <FormItem style={{ display: 'none' }}>
              {
                getFieldDecorator('deleted', { initialValue: record.deleted })(<Input />)
              }
            </FormItem>
            <Row>
              <Col span={12}>
                <FormItem label="姓名" {...formItemLayout}>
                  {
                    getFieldDecorator('name', {
                      initialValue: record.name,
                      rules: [{ required: true, message: '姓名不能为空' }],
                    })(<Input tabIndex={1} />)
                  }
                </FormItem>
                <FormItem label="英文名" {...formItemLayout}>
                  {
                    getFieldDecorator('enName', {
                      initialValue: record.enName,
                    })(<Input tabIndex={3} />)
                  }
                </FormItem>
                <FormItem label="身份证号" {...formItemLayout}>
                  {
                    getFieldDecorator('idNo', {
                      initialValue: record.idNo,
                      rules: [
                        { required: true, message: '身份证号不能为空' },
                        { max: 18, message: '身份证长度不能超过18个字符' },
                        { validator: (rule, value, callback) => {
                          if (!testCnIdNo(value)) callback('不是有效的身份证号');
                          else callback();
                        } },
                      ],
                    })(<Input tabIndex={5} />)
                  }
                </FormItem>
                {/* <FormItem label="性别" {...formItemLayout}>
                  {
                  getFieldDecorator('gender', {
                    initialValue: record.gender,
                    rules: [{ required: true, message: '性别不能为空' }],
                  })(
                    <DictRadioGroup tabIndex={7} columnName="SEX" />,
                  )}
                </FormItem>*/}
                <FormItem label="手机号" {...formItemLayout}>
                  {
                    getFieldDecorator('mobile', {
                      initialValue: record.mobile,
                      rules: [
                        { required: true, message: '手机号码不能为空' },
                        { max: 11, message: '手机号码长度不能超过11个数字' },
                        { validator: (rule, value, callback) => {
                          if (!testMobile(value)) callback('不是有效的手机号码');
                          else callback();
                        } },
                      ],
                    })(<Input tabIndex={9} maxLength={11} />)
                  }
                </FormItem>
                {/* <FormItem label="婚姻状态" {...formItemLayout}>
                  {
                    getFieldDecorator('marrStatus', {
                      initialValue: record.marrStatus,
                    })(
                      <DictRadioGroup tabIndex={11} columnName="MARRIAGE_STATUS" />,
                    )
                  }
                </FormItem>*/}
              </Col>
              <Col span={12}>
                <FormItem label="拼音" {...formItemLayout}>
                  {
                    getFieldDecorator('pinyin', {
                      initialValue: record.pinyin,
                    })(<Input tabIndex={2} disabled />)
                  }
                </FormItem>
                <FormItem label="简称" {...formItemLayout}>
                  {
                    getFieldDecorator('shortName', {
                      initialValue: record.shortName,
                    })(<Input tabIndex={4} />)
                  }
                </FormItem>
                {/* <FormItem label="民族" {...formItemLayout}>
                  {
                    getFieldDecorator('folk', {
                      initialValue: record.folk,
                    })(
                      <DictSelect
                        tabIndex={6}
                        columnName="NATION"
                      />,
                    )
                  }
                </FormItem>*/}
                <FormItem label="生日" {...formItemLayout}>
                  {
                    getFieldDecorator('bornDate', {
                      initialValue: record.bornDate ? moment(record.bornDate, 'YYYY-MM-DD') : null,
                    })(<DatePicker tabIndex={8} format={'YYYY-MM-DD'} style={{ width: '100%' }} />)
                  }
                </FormItem>
                <FormItem label="邮箱" {...formItemLayout}>
                  {
                    getFieldDecorator('email', {
                      initialValue: record.email,
                      rules: [{ type: 'email', message: '邮箱格式不正确' }],
                    })(<Input tabIndex={10} />)
                  }
                </FormItem>
                {/* <FormItem label="所属科室" {...formItemLayout}>
                  {
                    getFieldDecorator('deptId', {
                      initialValue: record.deptId,
                      rules: [
                        { required: true, message: '所属科室必须选择' },
                      ],
                    })(
                      <DeptTreeSelect tabIndex={12} onSelect={this.onSelectDept} />,
                    )
                  }
                </FormItem>*/}
                <FormItem style={{ display: 'none' }}>
                  {getFieldDecorator('deptCode', { initialValue: record.deptCode })(<Input />)}
                </FormItem>
                <FormItem style={{ display: 'none' }}>
                  {getFieldDecorator('deptName', { initialValue: record.deptName })(<Input />)}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                {/* <FormItem label="登录科室" labelCol={{ span: 3 }} wrapperCol={{ span: 20 }}>
                  {
                    getFieldDecorator('loginDepts', {
                      initialValue: record.loginDepts,
                    })(
                      <DeptTreeSelect multiple treeCheckable tabIndex={13} onChange={this.onSelectDepts} />,
                    )
                  }
                </FormItem>*/}
                {/* <FormItem label="登录科室" labelCol={{ span: 3 }} wrapperCol={{ span: 20 }}>
                  {
                    getFieldDecorator('loginDepts', {
                      initialValue: record.loginDepts,
                    })(
                      <DeptSelect tabIndex={13} />,
                    )
                  }
                </FormItem>
                <FormItem label="登录科室" labelCol={{ span: 3 }} wrapperCol={{ span: 20 }}>
                  {
                    getFieldDecorator('loginDepts', {
                      initialValue: record.loginDepts,
                    })(
                      <DeptSelect tabIndex={13} isRegdept />,
                    )
                  }
                </FormItem>
                <FormItem label="登录科室" labelCol={{ span: 3 }} wrapperCol={{ span: 20 }}>
                  {
                    getFieldDecorator('loginDepts', {
                      initialValue: record.loginDepts,
                    })(
                      <DeptSelect tabIndex={13} isRegdept={false} />,
                    )
                  }
                </FormItem>*/}
                <FormItem style={{ display: 'none' }}>
                  {getFieldDecorator('loginDeptsCode', { initialValue: record.loginDeptsCode })(<Input />)}
                </FormItem>
                <FormItem style={{ display: 'none' }}>
                  {getFieldDecorator('loginDeptsName', { initialValue: record.loginDeptsName })(<Input />)}
                </FormItem>
              </Col>
              <Col span={24}>
                <FormItem label="地址" labelCol={{ span: 3 }} wrapperCol={{ span: 20 }}>
                  {
                    getFieldDecorator('address', {
                      initialValue: record.address,
                      rules: [{ required: true, message: '地址不能为空' }],
                    })(<Input tabIndex={14} />)
                  }
                </FormItem>
              </Col>
              <Col span={24}>
                <FormItem label="描述" labelCol={{ span: 3 }} wrapperCol={{ span: 20 }} >
                  {
                    getFieldDecorator('desciption', {
                      initialValue: record.desciption,
                    })(<Input type="textarea" rows={4} tabIndex={15} />)
                  }
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={23} style={{ textAlign: 'right' }} >
                <Button type="primary" htmlType="submit" style={{ marginRight: '10px' }} icon="save" size="large" >保存</Button>
                <Button onClick={this.reset} icon="reload" size="large" >重置</Button>
              </Col>
            </Row>
          </Form>
          {
            isCreate ? null : (
              <Tabs type="card">
                <TabPane tab={'账户'} key={'account'} >
                  <UserAccounts data={record} />
                </TabPane>
                <TabPane tab={'角色'} key={'role'} />
              </Tabs>
            )
          }
        </Spin>
      </Modal>
    );
  }
}
const Editor = Form.create()(EditorForm);
export default connect(({ user, utils }) => ({ user, utils }))(Editor);

