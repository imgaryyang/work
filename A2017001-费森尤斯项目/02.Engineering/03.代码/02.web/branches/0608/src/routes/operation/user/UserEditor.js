import React, { Component } from 'react';
import { connect } from 'dva';
import { Spin, Tabs, Row, Col, Button, Modal, DatePicker, Form, Input, Select } from 'antd';
import moment from 'moment';

import { testMobile, testCnIdNo } from '../../../utils/validation';

import UserAccounts from './UserAccounts';
import DictRadioGroup from '../../../components/DictRadioGroup';
import DictSelect from '../../../components/DictSelect';
import DeptTreeSelect from '../../../components/DeptTreeSelect';
import DeptSelect from '../../../components/DeptSelect';
import FieldSet from '../../../components/FieldSet';

import styles from './User.less';

const FormItem = Form.Item;
const TabPane = Tabs.TabPane;

function compare(obj, values) {
  // console.log(obj, values);
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
    this.props.dispatch({
      type: 'utils/initDepts',
    });
  }

  /*
  componentDidMount() {
    const { record } = this.props.user4Opt;
    console.log('record--', record);
    this.props.form.setFieldsValue({
      hosId: record.hosId,
    });

  }*/

  /* componentWillReceiveProps(nextProps) {
    if (nextProps.data == null) {
      this.reset();
    }
  } */

  onSelectDept(value, node) {
    // console.log(value, node);
    this.props.dispatch({
      type: 'user4Opt/setState',
      payload: {
        record: {
          ...this.props.user4Opt.record,
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
      type: 'user4Opt/setState',
      payload: {
        record: {
          ...this.props.user4Opt.record,
          loginDeptsCode: codes.join(';'),
          loginDeptsName: label.join(';'),
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
    // const data = this.props.user.record;
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
      type: 'user4Opt/setState',
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
      if (err) {
        return;
      }

      if (!err) {
        const newValues = { ...values };
        if (newValues.bornDate) {
          newValues.bornDate = newValues.bornDate.format('YYYY-MM-DD');
        }
        this.props.dispatch({
          type: 'user4Opt/save',
          params: newValues,
        });
        this.props.form.resetFields();
      }
    });
  }

  handleHosChange(value) {
    console.log('value: ',value);

    // 清除科室
    this.props.form.setFieldsValue({
      deptId: '',
    });

    if(value != null){
      // 查询科室列表数据
      this.props.dispatch({
        type: 'user4Opt/loadDptListData',

        payload: {
          query: {hosId: value},
        }
      });
    }
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { editorSpin, record, visible } = this.props.user4Opt;

    const title = record && record.name ? `修改${record.name}个人信息` : '新增人员';
    const isCreate = !record || !record.id;

    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
      style: { width: '100%' },
    };

    const { hosListData } = this.props.user4Opt;
    const { dptListData } = this.props.user4Opt;

    const hosOptios = hosListData.map((elm, index) =>
      <Option key={elm.hosId} value={elm.hosId}>
        {elm.hosName}
      </Option>
    );

    const dptOptios = dptListData.map((elm, index) =>
      <Option key={elm.deptId} value={elm.deptId}>
        {elm.deptName}
      </Option>
    );

    return (
      <Modal
        width={900}
        title={title}
        visible={visible}
        closable
        footer={null}
        maskClosable={false}
        onCancel={this.handleCancel}
        style={{ top: '25px' }}
      >
        <Spin spinning={editorSpin} >
          <Form >
            <FormItem style={{ display: 'none' }}>
              { getFieldDecorator('id', { initialValue: record.id })(<Input />) }
            </FormItem>
            {/*
            <FormItem style={{ display: 'none' }}>
              { getFieldDecorator('hosId', { initialValue: record.hosId })(<Input />) }
            </FormItem>
          */}
            <FormItem style={{ display: 'none' }}>
              { getFieldDecorator('active', { initialValue: record.active })(<Input />) }
            </FormItem>
            <FormItem style={{ display: 'none' }}>
              { getFieldDecorator('expired', { initialValue: record.expired })(<Input />) }
            </FormItem>
            <FormItem style={{ display: 'none' }}>
              { getFieldDecorator('createDate', { initialValue: record.createDate })(<Input />) }
            </FormItem>
            <FormItem style={{ display: 'none' }}>
              { getFieldDecorator('effectDate', { initialValue: record.effectDate })(<Input />) }
            </FormItem>
            <FormItem style={{ display: 'none' }}>
              { getFieldDecorator('expirDate', { initialValue: record.expirDate })(<Input />) }
            </FormItem>
            <FormItem style={{ display: 'none' }}>
              { getFieldDecorator('org', { initialValue: record.org })(<Input />) }
            </FormItem>
            <FormItem style={{ display: 'none' }}>
              { getFieldDecorator('deleted', { initialValue: record.deleted })(<Input />) }
            </FormItem>
            <FormItem style={{ display: 'none' }}>
              { getFieldDecorator('pinyin', { initialValue: record.pinyin })(<Input />) }
            </FormItem>
            <FormItem style={{ display: 'none' }}>
              { getFieldDecorator('shortName', { initialValue: record.shortName })(<Input />) }
            </FormItem>

            <Row>
              <Col span={8} >
                <FormItem label="姓名" {...formItemLayout}>
                  {
                    getFieldDecorator('name', {
                      initialValue: record.name,
                      rules: [{ required: true, message: '姓名不能为空' }],
                    })(<Input style={{ width: '100%' }} />)
                  }
                </FormItem>
              </Col>
              <Col span={8} >
                <FormItem label="英文名" {...formItemLayout}>
                  {
                    getFieldDecorator('enName', {
                      initialValue: record.enName,
                    })(<Input style={{ width: '100%' }} />)
                  }
                </FormItem>
              </Col>
              <Col span={8} >
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
                    })(<Input style={{ width: '100%' }} />)
                  }
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={8} >
                <FormItem label="性别" {...formItemLayout}>
                  {
                  getFieldDecorator('gender', {
                    initialValue: record.gender || '1',
                    rules: [{ required: true, message: '性别不能为空' }],
                  })(
                    <DictRadioGroup columnName="SEX" />,
                  )}
                </FormItem>
              </Col>
              <Col span={8} >
                <FormItem label="民族" {...formItemLayout}>
                  {
                    getFieldDecorator('folk', {
                      initialValue: record.folk,
                    })(
                      <DictSelect columnName="NATION" style={{ width: '100%' }} />,
                    )
                  }
                </FormItem>
              </Col>
              <Col span={8} >
                <FormItem label="生日" {...formItemLayout}>
                  {
                    getFieldDecorator('bornDate', {
                      initialValue: record.bornDate ? moment(record.bornDate, 'YYYY-MM-DD') : null,
                    })(<DatePicker format={'YYYY-MM-DD'} style={{ width: '100%' }} />)
                  }
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={8} >
                <FormItem label="婚姻状态" {...formItemLayout}>
                  {
                    getFieldDecorator('marrStatus', {
                      initialValue: record.marrStatus || '0',
                    })(
                      <DictRadioGroup columnName="MARRIAGE_STATUS" />,
                    )
                  }
                </FormItem>
              </Col>
              <Col span={8} >
                <FormItem label="手机号" {...formItemLayout} >
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
                    })(<Input maxLength={11} style={{ width: '100%' }} />)
                  }
                </FormItem>
              </Col>
              <Col span={8} >
                <FormItem label="邮箱" {...formItemLayout}>
                  {
                    getFieldDecorator('email', {
                      initialValue: record.email,
                      rules: [{ type: 'email', message: '邮箱格式不正确' }],
                    })(<Input style={{ width: '100%' }} />)
                  }
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={24} >
                <FormItem label="家庭住址" labelCol={{ span: 2 }} wrapperCol={{ span: 22 }} >
                  {
                    getFieldDecorator('address', {
                      initialValue: record.address,
                      rules: [{ required: true, message: '家庭住址不能为空' }],
                    })(<Input style={{ width: '100%' }} />)
                  }
                </FormItem>
              </Col>
            </Row>
            <FieldSet title="工作信息" >

              <Row>
                <Col span={8}>
                  <FormItem label="工号" {...formItemLayout} >
                    {
                      getFieldDecorator('userId', {
                        initialValue: record.userId,
                      })(<Input style={{ width: '100%' }} disabled maxLength={20} />)
                    }
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem label="所属病区" {...formItemLayout} >
                    {
                      getFieldDecorator('nurseId', {
                        initialValue: record.nurseId,
                      })(
                        <Input style={{ width: '100%' }} maxLength={20} />,
                      )
                    }
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem label="员工类型" {...formItemLayout} >
                    {
                      getFieldDecorator('userType', {
                        initialValue: record.userType,
                        rules: [{ required: true, message: '员工类型不能为空' }],
                      })(
                        <DictSelect columnName="EMP_TYPE" style={{ width: '100%' }} />,
                      )
                    }
                  </FormItem>
                </Col>
              </Row>

              <Row>
                <Col span={8} >
                  <FormItem label="所属医院" {...formItemLayout} >
                    {
                      getFieldDecorator('hosId', {
                        initialValue: record.hosId,
                        rules: [
                          { required: true, message: '所属医院必须选择' },
                        ],
                      })(
                        <Select placeholder="所属医院" style={{ width: '100%' }} allowClear onChange={(value)=>this.handleHosChange(value)}>
                        {hosOptios}
                        </Select>,
                      )
                    }
                  </FormItem>
                  <FormItem style={{ display: 'none' }}>
                    {getFieldDecorator('hosCode', { initialValue: record.hosCode })(<Input />)}
                  </FormItem>
                  <FormItem style={{ display: 'none' }}>
                    {getFieldDecorator('hosName', { initialValue: record.hosName })(<Input />)}
                  </FormItem>
                </Col>
                <Col span={8} >
                  <FormItem label="所属科室" {...formItemLayout} >
                    {
                      getFieldDecorator('deptId', {
                        initialValue: record.deptId,
                        rules: [
                          { required: true, message: '所属科室必须选择' },
                        ],
                      })(
                        <Select placeholder="所属科室" style={{ width: '100%' }} allowClear>
                        {dptOptios}
                        </Select>,
                      )
                    }
                  </FormItem>
                  <FormItem style={{ display: 'none' }}>
                    {getFieldDecorator('deptCode', { initialValue: record.deptCode })(<Input />)}
                  </FormItem>
                  <FormItem style={{ display: 'none' }}>
                    {getFieldDecorator('deptName', { initialValue: record.deptName })(<Input />)}
                  </FormItem>
                </Col>
              </Row>

              <Row>
                <Col span={8} >
                  <FormItem label="登录科室" {...formItemLayout} >
                    {
                      getFieldDecorator('loginDepts', {
                        initialValue: record.loginDepts,
                      })(
                        <DeptTreeSelect
                          multiple
                          treeCheckable
                          style={{ width: '100%' }}
                          className={styles.treeSelect}
                          onChange={this.onSelectDepts}
                          placeholder="可登录科室"
                          allowClear
                        />,
                      )
                    }
                  </FormItem>
                  <FormItem style={{ display: 'none' }}>
                    {getFieldDecorator('loginDeptsCode', { initialValue: record.loginDeptsCode })(<Input />)}
                  </FormItem>
                  <FormItem style={{ display: 'none' }}>
                    {getFieldDecorator('loginDeptsName', { initialValue: record.loginDeptsName })(<Input />)}
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem label="权限级别" {...formItemLayout} >
                    {
                      getFieldDecorator('operLevel', {
                        initialValue: record.operLevel,
                      })(
                        <DictSelect columnName="OPER_LEVEL" style={{ width: '100%' }} />,
                      )
                    }
                  </FormItem>
                </Col>
              </Row>

              <Row>
                <Col span={8}>
                  <FormItem label="职务" {...formItemLayout}>
                    {
                      getFieldDecorator('posiCode', {
                        initialValue: record.posiCode,
                      })(
                        <DictSelect columnName="POSI_CODE" style={{ width: '100%' }} />,
                      )
                    }
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem label="职级" {...formItemLayout}>
                    {
                      getFieldDecorator('lvlCode', {
                        initialValue: record.lvlCode,
                      })(
                        <DictSelect columnName="LVL_CODE" style={{ width: '100%' }} />,
                      )
                    }
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem label="学历" {...formItemLayout}>
                    {
                      getFieldDecorator('eduCode', {
                        initialValue: record.eduCode,
                      })(
                        <DictSelect columnName="EDU_CODE" style={{ width: '100%' }} />,
                      )
                    }
                  </FormItem>
                </Col>
              </Row>

              <Row>
                <Col span={8}>
                  <FormItem label="HR编号" {...formItemLayout}>
                    {
                      getFieldDecorator('hrCode', {
                        initialValue: record.hrCode,
                      })(
                        <Input style={{ width: '100%' }} maxLength={30} />,
                      )
                    }
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem label="合同号" {...formItemLayout}>
                    {
                      getFieldDecorator('contractNo', {
                        initialValue: record.contractNo,
                      })(
                        <Input style={{ width: '100%' }} maxLength={30} />,
                      )
                    }
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem label="工牌号" {...formItemLayout}>
                    {
                      getFieldDecorator('workId', {
                        initialValue: record.workId,
                      })(
                        <Input style={{ width: '100%' }} maxLength={30} />,
                      )
                    }
                  </FormItem>
                </Col>
              </Row>

            </FieldSet>

            <Row>
              <Col span={24}>
                <FormItem label="备注" labelCol={{ span: 2 }} wrapperCol={{ span: 22 }} >
                  {
                    getFieldDecorator('desciption', {
                      initialValue: record.desciption,
                    })(<Input type="textarea" rows={4} style={{ width: '100%' }} />)
                  }
                </FormItem>
              </Col>
            </Row>

            <div style={{ textAlign: 'right' }} >
              <Button type="primary" style={{ marginRight: '10px' }} icon="save" size="large" onClick={this.handleSubmit} >保存</Button>
              <Button onClick={this.reset} icon="reload" size="large" >重置</Button>
            </div>

          </Form>
          {
            isCreate ? null : (
              <Tabs>
                <TabPane tab={'账户'} key={'account'} >
                  <UserAccounts data={record} />
                </TabPane>
              </Tabs>
            )
          }
        </Spin> 
      </Modal>
    );
  }
}
const Editor = Form.create()(EditorForm);
export default connect(({ user4Opt, utils }) => ({ user4Opt, utils }))(Editor);
