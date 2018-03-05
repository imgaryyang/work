import React, { Component } from 'react';
import { connect } from 'dva';
import { Row, Col, Form, Input, Button, Card, Radio, Modal } from 'antd';

import ShadowDiv from '../../../components/ShadowDiv';
import styles from './MedicalRecord.less';
import NumberInput from '../../../components/NumberInput';
import { testtemperature } from '../../../utils/validation';

const RadioGroup = Radio.Group;
const FormItem = Form.Item;

class MedicalRecordEdit extends Component {

  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.print = this.print.bind(this);
    this.handleReset = this.handleReset.bind(this);
  }

  handleSubmit() {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.dispatch({
          type: 'odwsMedicalRecord/saveMedicalRecord',
          payload: values,
        });
      }
    });
  }
  print() {
    const c = this.props.odws.currentReg;
    console.log(c);
    Modal.confirm({
      content: '确定要打印吗？',
      okText: '确定',
      cancelText: '取消',
      onOk: () => {
        this.props.dispatch({
          type: 'print/getPrintInfo',
          payload: { code: '115', bizId: c.regId },
        });
      },
    });
  }
  handleReset() {
    this.props.form.resetFields();
  }

  // TODO: 门诊病历保存为模板
  /* saveToTemplate() {
  }*/
 
  render() {
    const { getFieldDecorator } = this.props.form;
    const { odws, odwsMedicalRecord } = this.props;
    const { odwsWsHeight } = odws;
    const { medicalRecord } = odwsMedicalRecord;
    const { currentReg } = odws;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
      size: 'small',
    };

    const formItemLayoutColSpan = {
      labelCol: { span: 3 },
      wrapperCol: { span: 21 },
      size: 'small',
    };

    return (
      <Form inline className={styles.form} style={{ padding: '3px' }} >
        <FormItem style={{ display: 'none' }} >
          {getFieldDecorator('id', {
            initialValue: medicalRecord.id,
          })(<Input />)}
        </FormItem>
        <FormItem style={{ display: 'none' }} >
          {getFieldDecorator('regId', {
            initialValue: currentReg.id,
          })(<Input />)}
        </FormItem>
        <Card style={{ height: `${odwsWsHeight - 6}px` }} className={styles.inputCard} >
          <ShadowDiv style={{ height: `${odwsWsHeight - 6 - 62}px` }} bodyStyle={{ height: `${odwsWsHeight - 6 - 62}px`, padding: '15px 0' }} >
            <Row>
              <Col span={24} >
                <FormItem style={{ width: '100%' }} label="病历分型" {...formItemLayoutColSpan} >
                  {getFieldDecorator('medicalRecordsType', {
                    initialValue: medicalRecord && medicalRecord.medicalRecordsType ? medicalRecord.medicalRecordsType : '1',
                  })(
                    <RadioGroup>
                      <Radio value="1">普通病历</Radio>
                      <Radio value="-1">传染病病历</Radio>
                    </RadioGroup>,
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={24} >
                <FormItem style={{ width: '100%' }} label="主述" {...formItemLayoutColSpan} >
                  {getFieldDecorator('chiefComplaint', {
                    initialValue: medicalRecord.chiefComplaint,
                    rules: [
                      { required: true, message: '主述必须填写！' },
                    ],
                  })(
                    <Input maxLength={150} type="textarea" rows={3} />,
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={12} >
                <FormItem style={{ width: '100%' }} label="现病史" {...formItemLayout} >
                  {getFieldDecorator('presentIllness', {
                    initialValue: medicalRecord.presentIllness,
                  })(
                    <Input maxLength={150} type="textarea" rows={3} />,
                  )}
                </FormItem>
              </Col>
              <Col span={12} >
                <FormItem style={{ width: '100%' }} label="既往病史" {...formItemLayout} >
                  {getFieldDecorator('pastHistory', {
                    initialValue: medicalRecord.pastHistory,
                  })(
                    <Input maxLength={150} type="textarea" rows={3} />,
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={12} >
                <FormItem style={{ width: '100%' }} label="体格检查" {...formItemLayout} >
                  {getFieldDecorator('physicalExam', {
                    initialValue: medicalRecord.physicalExam,
                  })(
                    <Input maxLength={150} type="textarea" rows={3} />,
                  )}
                </FormItem>
              </Col>
              <Col span={12} >
                <FormItem style={{ width: '100%' }} label="辅助检查" {...formItemLayout} >
                  {getFieldDecorator('otherExam', {
                    initialValue: medicalRecord.otherExam,
                  })(
                    <Input maxLength={150} type="textarea" rows={3} />,
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={12} >
                <FormItem style={{ width: '100%' }} label="患者体重" {...formItemLayout} >
                  <Row>
                    <Col span={18} style={{ paddingRight: '5px' }} >
                      {getFieldDecorator('weight', {
                        initialValue: medicalRecord.weight ? medicalRecord.weight : '',
                      })(
                        //<InputNumber maxLength={3} style={{ width: '100%' }} />,
                        <NumberInput
                          numberType="currency4"
                          size="large"
                          maxLength={4}
                        />,
                      )}
                    </Col>
                    <Col span={6} className={styles.unit} >公斤(kg)</Col>
                  </Row>
                </FormItem>
              </Col>
              <Col span={12} >
                <FormItem style={{ width: '100%' }} label="患者身高" {...formItemLayout} >
                  <Row>
                    <Col span={18} style={{ paddingRight: '5px' }} >
                      {getFieldDecorator('height', {
                        initialValue: medicalRecord.height ? medicalRecord.height : '',
                      })(
                        //<InputNumber maxLength={3} style={{ width: '100%' }} />,
                        <NumberInput
                          numberType="currency4"
                          size="large"
                          maxLength={4}
                        />,
                      )}
                    </Col>
                    <Col span={6} className={styles.unit} >厘米(cm)</Col>
                  </Row>
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={12} >
                <FormItem style={{ width: '100%' }} label="血压" {...formItemLayout} >
                  <Row>
                   <Col span={18} style={{ paddingRight: '5px' }} >
                      {getFieldDecorator('bloodPressureprMin', {
                        initialValue: medicalRecord.bloodPressureprMin ? medicalRecord.bloodPressureprMin : '',
                      })(
                        <NumberInput
                          numberType="currency4"
                          size="large"
                          style={{ width: '40%' }}
                          maxLength={4}
                        />,
                      )}
                      /
                       {getFieldDecorator('bloodPressureprMax', {
                        initialValue: medicalRecord.bloodPressureprMax ? medicalRecord.bloodPressureprMax : '',
                      })(
                        //<NumberInput maxLength={3} style={{ width: '40%' }} />,
                        <NumberInput
                          numberType="currency4"
                          size="large"
                          style={{ width: '40%' }}
                          maxLength={4}
                        />,
                      )}
                    </Col>
                    <Col span={6} className={styles.unit} >mmHg</Col>
                  </Row>
                </FormItem>
              </Col>
              <Col span={12} >
                <FormItem style={{ width: '100%' }} label="体温" {...formItemLayout} >
                  <Row>
                    <Col span={18} style={{ paddingRight: '5px' }} >
                      {getFieldDecorator('temperature', {
                        initialValue: medicalRecord.temperature ? medicalRecord.temperature : '',
                        rules: [
                          { validator: (rule, value, callback) => {
                            if (!testtemperature(value)) callback('体温不能大于42℃');
                            else callback();
                          } },
                        ],
                      })(
                        <NumberInput
                          numberType="currency4"
                          size="large"
                          maxLength={4}
                        />,
                      )}
                    </Col>
                    <Col span={6} className={styles.unit} >摄氏度(℃)</Col>
                  </Row>
                </FormItem>
              </Col>
            </Row>
                  <Row>
              <Col span={12} >
                <FormItem style={{ width: '100%' }} label="心率/脉搏" {...formItemLayout} >
                  <Row>
                    <Col span={18} style={{ paddingRight: '5px' }} >
                      {getFieldDecorator('pulseRate', {
                        initialValue: medicalRecord.pulseRate ? medicalRecord.pulseRate : '',
                      })(
                        //<NumberInput maxLength={3} style={{ width: '100%' }} />,
                        <NumberInput
                          numberType="currency4"
                          size="large"
                          maxLength={4}
                        />,
                      )}
                    </Col>
                    <Col span={6} className={styles.unit} >bpm</Col>
                  </Row>
                </FormItem>
              </Col>
              <Col span={12} >
                <FormItem style={{ width: '100%' }} label="呼吸" {...formItemLayout} >
                  <Row>
                      <Col span={18} style={{ paddingRight: '5px' }} >
                      {getFieldDecorator('breath', {
                        initialValue: medicalRecord.breath ? medicalRecord.breath : '',
                      })(
                        <NumberInput
                          numberType="currency4"
                          size="large"
                          maxLength={4}
                        />,
                      )}
                    </Col>
                   
                    <Col span={6} className={styles.unit} >次/分</Col>
                  </Row>
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={24} >
                <FormItem style={{ width: '100%' }} label="注意事项" {...formItemLayoutColSpan} >
                  {getFieldDecorator('moOrder', {
                    initialValue: medicalRecord.moOrder,
                  })(
                    <Input maxLength={150} type="textarea" rows={3} />,
                  )}
                </FormItem>
              </Col>
            </Row>
          </ShadowDiv>
          <div style={{ textAlign: 'right', padding: '10px 0' }} >
            <Button type="primary" onClick={this.handleSubmit} style={{ marginRight: '10px' }} icon="plus" size="large" >保存</Button>
            <Button type="primary" onClick={this.print} style={{ marginRight: '10px' }} icon="plus" size="large" >打印</Button>
            {/* <Button onClick={this.saveToTemplate} style={{ marginRight: '10px' }} icon="reload" size="large" >存为模板</Button>*/}
            <Button onClick={this.handleReset} icon="reload" size="large" >清空</Button>
          </div>
        </Card>
      </Form>
    );
  }
}
const MedicalRecordEditForm = Form.create()(MedicalRecordEdit);
export default connect(
  ({ odws, odwsMedicalRecord, base }) => ({ odws, odwsMedicalRecord, base }),
)(MedicalRecordEditForm);

