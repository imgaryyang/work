import React, { Component } from 'react';
import { connect } from 'dva';
import { Card, Row, Col, Button, Form, Input, DatePicker, notification, Icon } from 'antd';
import moment from 'moment';
import { testMobile, testCnIdNo } from '../../../utils/validation';

import FieldSet from '../../../components/FieldSet';

import MiCard from '../../../components/ScanMiCardInput';
import IdCard from '../../../components/ScanIdCardInput';
import MedicalCard from '../../../components/ScanMedicalCardInput';

import DictSelect from '../../../components/DictSelect';
import DictRadioGroup from '../../../components/DictRadioGroup';
import AsyncTreeCascader from '../../../components/AsyncTreeCascader';

import styles from './Patient.less';

const FormItem = Form.Item;

class EditorForm extends Component {

  constructor(props) {
    super(props);

    this.issueMedicalCard = this.issueMedicalCard.bind(this);
    this.changeMedicalCard = this.changeMedicalCard.bind(this);
    this.miCardCreateProfile = this.miCardCreateProfile.bind(this);

    this.handleSubmit = this.handleSubmit.bind(this);
    this.resetData = this.resetData.bind(this);
    this.reset = this.reset.bind(this);

    this.readMedicalCardDone = this.readMedicalCardDone.bind(this);
    this.readIdCardDone = this.readIdCardDone.bind(this);
    this.readMiCardDone = this.readMiCardDone.bind(this);
  }

  state = {
    medicalCardRequired: true,
    miCardRequired: false,
  };

  componentWillReceiveProps(props) {
    if (props.patient.patient.id !== this.props.patient.patient.id) {
      this.props.form.resetFields();
    }
    // 表单处于修改状态
    if (props.patient.patient.id) {
      this.setState({
        medicalCardRequired: false,
        miCardRequired: false,
      });
    }
  }

  issueMedicalCard() {
    this.setState({
      medicalCardRequired: true,
      miCardRequired: false,
    });
    this.resetData();
  }

  changeMedicalCard() {
    this.setState({
      medicalCardRequired: true,
      miCardRequired: false,
    });
    this.props.dispatch({
      type: 'patient/setState',
      payload: {
        patient: { ...this.props.patient.patient, medicalCardNo: '' },
      },
    });
  }

  miCardCreateProfile() {
    this.setState({
      medicalCardRequired: false,
      miCardRequired: true,
    });
    this.resetData();
  }

  handleSubmit() {
    this.props.form.validateFields((err, values) => {
      // console.log(values);
      // 如果就诊卡及医保卡都为空，则直接提示错误并返回
      if (!values.medicalCardNo && !values.miCardNo) {
        notification.error({
          message: '错误!',
          description: '请至少为患者绑定一张诊疗卡或医保卡！',
        });
        return;
      }
      if (!err) {
        const newValues = { ...values };
        // 将区域拆成三个字段
        if (newValues.divisions instanceof Array) {
          newValues.province = newValues.divisions.length > 0 ? newValues.divisions[0] : null;
          newValues.city = newValues.divisions.length > 1 ? newValues.divisions[1] : null;
          newValues.area = newValues.divisions.length > 2 ? newValues.divisions[2] : null;
        }
        // 将生日格式化成字符串类型
        newValues.birthday = newValues.birthday ? moment(newValues.birthday).format('YYYY-MM-DD') : null;
        // 调用保存
        this.props.dispatch({
          type: 'patient/save',
          params: newValues,
        });
      }
    });
  }

  readMedicalCardDone(info) {
    // console.log(info);
    this.props.form.resetFields(['medicalCardNo']);
    this.props.dispatch({
      type: 'patient/setState',
      payload: {
        patient: { ...this.props.patient.patient, ...info },
      },
    });
  }

  readIdCardDone(info) {
    // console.log(info);
    this.props.form.resetFields(['idNo', 'name', 'sex', 'birthday', 'nationality', 'nation', 'idAddress']);
    this.props.dispatch({
      type: 'patient/setState',
      payload: {
        patient: { ...this.props.patient.patient, ...info },
      },
    });
  }

  readMiCardDone(info) {
    // console.log(info);
    this.props.form.resetFields(['miCardNo']);
    this.props.dispatch({
      type: 'patient/setState',
      payload: {
        patient: { ...this.props.patient.patient, ...info },
      },
    });
  }

  resetData() {
    this.props.dispatch({
      type: 'patient/setState',
      payload: {
        patient: {},
      },
    });
    this.props.form.resetFields();
  }

  reset() {
    this.resetData();
  }

  render() {
    const { form, base } = this.props;
    const { getFieldDecorator } = form;
    const { wsHeight } = base;

    const { patient } = this.props.patient;

    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 16 },
    };
    const twoColLayout = {
      labelCol: { span: 3 },
      wrapperCol: { span: 20 },
    };
    /* const threeColLayout = {
      labelCol: { span: 2 },
      wrapperCol: { span: 21 },
    }; */

    // hasFeedback 属性删除，解决firefox无法输入汉字的bug xiaweiyi
    return (
      <div>
        <Form >
          <div className={styles.topBtnContainer} >
            <Button icon="plus-circle-o" onClick={this.issueMedicalCard} >发卡</Button>
            <Button icon="swap" onClick={this.changeMedicalCard} disabled={!(patient.id && patient.medicalCardNo)} >换卡</Button>
            <Button icon="folder-add" onClick={this.miCardCreateProfile} >医保卡初次就诊建档</Button>
          </div>
          <div className={styles.topShadow} />
          <div style={{ height: `${wsHeight - 10}px` }} className={styles.formContainer} >
            <FormItem style={{ display: 'none' }} >
              {getFieldDecorator('hosId', {
                initialValue: patient.hosId,
              })(
                <Input />,
              )}
            </FormItem>
            <FormItem style={{ display: 'none' }} >
              {getFieldDecorator('id', {
                initialValue: patient.id,
              })(
                <Input />,
              )}
            </FormItem>
            <Row className={styles.mainRow} >

              <Col span={8} style={{ paddingLeft: '3px' }} >
                <Card bodyStyle={{ padding: 0, paddingTop: '3px' }} >
                  <div className={styles.customImage} >
                    {/* <img alt="example" width="100%" src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png" />*/}
                    <Icon type="user" style={{ fontSize: '120px', color: '#d9d9d9', lineHeight: `${300 - 52}px` }} />
                  </div>
                  <div className={styles.customCard} >
                    <h3>患者照片</h3>
                  </div>
                </Card>
              </Col>
              <Col span={16} >
                <Row>
                  <Col span={12} className={styles.formCol} >
                    <FormItem label="患者ID" {...formItemLayout} >
                      {getFieldDecorator('patientId', {
                        initialValue: patient.patientId,
                      })(
                        <Input disabled tabIndex={0} />,
                      )}
                    </FormItem>
                    <FormItem label="医保卡" {...formItemLayout} >
                      {getFieldDecorator('miCardNo', {
                        initialValue: patient.miCardNo,
                        rules: [
                          { required: this.state.miCardRequired, message: '医保卡号不能为空' },
                          { max: 10, message: '医保卡长度不能超过10个字符' },
                        ],
                      })(
                        <MiCard iconOnly maxLength={10} tabIndex={2} readed={this.readMiCardDone} random />,
                      )}
                    </FormItem>
                    <FormItem label="姓名" {...formItemLayout} >
                      {getFieldDecorator('name', {
                        initialValue: patient.name,
                        rules: [
                          { required: true, message: '姓名不能为空' },
                          { max: 15, message: '姓名长度不能超过15个汉字' },
                        ],
                      })(
                        <Input maxLength={15} tabIndex={4} />,
                      )}
                    </FormItem>
                    <FormItem label="性别" {...formItemLayout} >
                      {getFieldDecorator('sex', {
                        initialValue: patient.sex,
                        rules: [
                          { required: true, message: '性别不能为空' },
                        ],
                      })(
                        <DictRadioGroup columnName="SEX" tabIndex={6} />,
                      )}
                    </FormItem>
                    <FormItem label="国籍" {...formItemLayout} >
                      {getFieldDecorator('nationality', {
                        initialValue: patient.nationality,
                        rules: [{ required: true, message: '国籍不能为空' }],
                      })(
                        <DictSelect
                          style={{ width: '100%' }}
                          tabIndex={0}
                          columnName="NATIONALITY"
                          tabIndex={8}
                        />,
                      )}
                    </FormItem>
                  </Col>
                  <Col span={12} className={styles.formCol} >
                    <FormItem label="诊疗卡" {...formItemLayout} >
                      {getFieldDecorator('medicalCardNo', {
                        initialValue: patient.medicalCardNo,
                        rules: [
                          { required: this.state.medicalCardRequired, message: '诊疗卡号不能为空' },
                          { max: 10, message: '诊疗卡长度不能超过10个字符' },
                        ],
                      })(
                        <MedicalCard iconOnly maxLength={10} tabIndex={1} readed={this.readMedicalCardDone} random />,
                      )}
                    </FormItem>
                    <FormItem label="身份证" {...formItemLayout} >
                      {getFieldDecorator('idNo', {
                        initialValue: patient.idNo,
                        rules: [
                          { required: true, message: '身份证号不能为空' },
                          { max: 18, message: '身份证长度不能超过18个字符' },
                          { validator: (rule, value, callback) => {
                            if (!testCnIdNo(value)) callback('不是有效的身份证号');
                            else callback();
                          } },
                        ],
                      })(
                        <IdCard iconOnly maxLength={18} tabIndex={3} readed={this.readIdCardDone} />,
                      )}
                    </FormItem>
                    <FormItem label="别名" {...formItemLayout} >
                      {getFieldDecorator('alias', {
                        initialValue: patient.alias,
                        rules: [
                          { max: 15, message: '别名长度不能超过15个汉字' },
                        ],
                      })(
                        <Input maxLength={15} tabIndex={5} />,
                      )}
                    </FormItem>
                    <FormItem label="生日" format="YYYY-MM-DD" placeholder="请选择生日" style={{ width: '100%' }} {...formItemLayout} >
                      {getFieldDecorator('birthday', {
                        initialValue: patient.birthday ? moment(patient.birthday) : null,
                      })(
                        <DatePicker style={{ width: '100%' }} tabIndex={7} />,
                      )}
                    </FormItem>
                    <FormItem label="民族" {...formItemLayout} >
                      {getFieldDecorator('nation', {
                        initialValue: patient.nation,
                        rules: [{ required: true, message: '民族不能为空' }],
                      })(
                        <DictSelect
                          style={{ width: '100%' }}
                          tabIndex={0}
                          columnName="NATION"
                          tabIndex={9}
                        />,
                      )}
                    </FormItem>
                  </Col>
                  <Col span={24} className={styles.formCol} >
                    <FormItem label="身份证地址" {...twoColLayout} >
                      {getFieldDecorator('idAddress', {
                        initialValue: patient.idAddress,
                        rules: [
                          { max: 100, message: '身份证地址长度不能超过100个汉字' },
                        ],
                      })(
                        <Input maxLength={100} tabIndex={10} />,
                      )}
                    </FormItem>
                  </Col>
                </Row>
              </Col>
            </Row>

            <FieldSet title="联系方式" >
              <Row >
                <Col span={8} className={styles.formCol} >
                  <FormItem label="所属区域" {...formItemLayout} >
                    {getFieldDecorator('divisions', {
                      initialValue: [ patient.province, patient.city, patient.area ],
                    })(
                      <AsyncTreeCascader dictType="DIVISIONS" onChange={this.onDivisionsChange} />,
                    )}
                  </FormItem>
                </Col>
                <Col span={16} className={styles.formCol} >
                  <FormItem label="通讯地址" {...twoColLayout} >
                    {getFieldDecorator('linkAddress', {
                      initialValue: patient.linkAddress,
                      rules: [
                        { max: 100, message: '通讯地址长度不能超过100个汉字' },
                      ],
                    })(
                      <Input maxLength={100} />,
                    )}
                  </FormItem>
                </Col>
                <Col span={8} className={styles.formCol} >
                  <FormItem label="手机号码" {...formItemLayout} help="" >
                    {getFieldDecorator('mobile', {
                      initialValue: patient.mobile,
                      rules: [
                        { max: 11, message: '手机号码长度不能超过11个数字' },
                        { validator: (rule, value, callback) => {
                          if (!testMobile(value)) callback('不是有效的手机号码');
                          else callback();
                        } },
                      ],
                    })(
                      <Input maxLength={11} />,
                    )}
                  </FormItem>
                </Col>
                <Col span={16} className={styles.formCol} >
                  <FormItem label="余址详情" {...twoColLayout} >
                    {getFieldDecorator('othDetail', {
                      initialValue: patient.othDetail,
                      rules: [
                        { max: 100, message: '余址详情长度不能超过100个汉字' },
                      ],
                    })(
                      <Input maxLength={100} />,
                    )}
                  </FormItem>
                </Col>
                <Col span={8} className={styles.formCol} >
                  <FormItem label="电子邮箱" {...formItemLayout} >
                    {getFieldDecorator('eMail', {
                      initialValue: patient.eMail,
                      rules: [
                        { max: 30, message: '电子邮箱长度不能超过30个字符' },
                        { type: 'email', message: '不是有效的电子邮件地址' },
                      ],
                    })(
                      <Input maxLength={30} />,
                    )}
                  </FormItem>
                </Col>
                <Col span={8} className={styles.formCol} >
                  <FormItem label="微信号" {...formItemLayout} >
                    {getFieldDecorator('wechat', {
                      initialValue: patient.wechat,
                      rules: [
                        { max: 50, message: '微信号长度不能超过50个字符' },
                      ],
                    })(
                      <Input maxLength={50} />,
                    )}
                  </FormItem>
                </Col>
                <Col span={8} className={styles.formCol} >
                  <FormItem label="QQ号" {...formItemLayout} >
                    {getFieldDecorator('qq', {
                      initialValue: patient.qq,
                      rules: [
                        { max: 20, message: 'QQ号长度不能超过20个字符' },
                      ],
                    })(
                      <Input maxLength={20} />,
                    )}
                  </FormItem>
                </Col>
              </Row>
            </FieldSet>

            <FieldSet title="家属 | 紧急联系人信息" >
              <Row >
                <Col span={8} className={styles.formCol} >
                  <FormItem label="家属姓名" {...formItemLayout} >
                    {getFieldDecorator('linkName', {
                      initialValue: patient.linkName,
                      rules: [
                        { max: 15, message: '家属姓名长度不能超过15个汉字' },
                      ],
                    })(
                      <Input maxLength={15} />,
                    )}
                  </FormItem>
                </Col>
                <Col span={8} className={styles.formCol} >
                  <FormItem label="身份证" {...formItemLayout} >
                    {getFieldDecorator('linkIdNo', {
                      initialValue: patient.linkIdNo,
                      rules: [
                        { max: 18, message: '家属身份证号长度不能超过18个字符' },
                      ],
                    })(
                      <Input maxLength={18} />,
                    )}
                  </FormItem>
                </Col>
                <Col span={8} className={styles.formCol} >
                  <FormItem label="家属关系" {...formItemLayout} >
                    {getFieldDecorator('linkRelation', {
                      initialValue: patient.linkRelation,
                    })(
                      <DictSelect
                        style={{ width: '100%' }}
                        tabIndex={0}
                        columnName="LINK_RELATION"
                      />,
                    )}
                  </FormItem>
                </Col>
                <Col span={16} className={styles.formCol} >
                  <FormItem label="联系方式" {...twoColLayout} >
                    {getFieldDecorator('linkTel', {
                      initialValue: patient.linkTel,
                      rules: [
                        { max: 30, message: '家属联系方式长度不能超过30个字符' },
                      ],
                    })(
                      <Input maxLength={30} />,
                    )}
                  </FormItem>
                </Col>
              </Row>
            </FieldSet>

            <FieldSet title="其他" >
              <Row >
                <Col span={16} className={styles.formCol} >
                  <FormItem label="信息来源" {...twoColLayout} >
                    {getFieldDecorator('infoSource', {
                      initialValue: '2',
                    })(
                      <DictRadioGroup
                        disabled
                        tabIndex={0}
                        columnName="INFO_SOURCE"
                      />,
                    )}
                  </FormItem>
                </Col>
                {/* <Col span={8} className={styles.formCol} >
                  <FormItem label="停用标识" {...formItemLayout} >
                    {getFieldDecorator('stopFlag', {
                      initialValue: '0',
                    })(
                      <DictRadioGroup columnName="STOP_FLAG" />,
                    )}
                  </FormItem>
                </Col> */}
              </Row>
            </FieldSet>
          </div>
          <div className={styles.bottomShadow} />
          <div className={styles.bottomBtnContainer} >
            <Row>
              <Col span={24} style={{ textAlign: 'right' }} >
                <Button type="primary" onClick={this.handleSubmit} style={{ marginRight: '10px' }} icon="save" size="large" >保存</Button>
                <Button onClick={this.reset} icon="reload" size="large" >重置</Button>
              </Col>
            </Row>
          </div>
        </Form>
      </div >
    );
  }
}

const Editor = Form.create()(EditorForm);
export default connect(({ patient, utils, base }) => ({ patient, utils, base }))(Editor);

