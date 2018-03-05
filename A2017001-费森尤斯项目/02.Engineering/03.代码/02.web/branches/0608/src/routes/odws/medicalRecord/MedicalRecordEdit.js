import React, { Component } from 'react';
import { connect } from 'dva';
import { Row, Col, Form, Input, Button, InputNumber, Card } from 'antd';

import ShadowDiv from '../../../components/ShadowDiv';

import styles from './MedicalRecord.less';

const FormItem = Form.Item;

class MedicalRecordEdit extends Component {

  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleReset = this.handleReset.bind(this);
    // this.saveToTemplate = this.saveToTemplate.bind(this);
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
                        <InputNumber maxLength={3} style={{ width: '100%' }} />,
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
                        <InputNumber maxLength={3} style={{ width: '100%' }} />,
                      )}
                    </Col>
                    <Col span={6} className={styles.unit} >厘米(cm)</Col>
                  </Row>
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={24} >
                <FormItem style={{ width: '100%' }} label="嘱托" {...formItemLayoutColSpan} >
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

