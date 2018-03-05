import React, { Component } from 'react';
import { connect } from 'dva';
import { Row, Col, Button, Form, Input, Radio } from 'antd';

import ShadowDiv from '../../../components/ShadowDiv';
import FieldSet from '../../../components/FieldSet';
import DictSelect from '../../../components/DictSelect';
import DeptSelect from '../../../components/DeptSelect';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;

class PatientRecordsTemplateEditor extends Component {

  constructor(props) {
    super(props);
    this.selectIcon = this.selectIcon.bind(this);
    this.onCancel = this.onCancel.bind(this);
    this.clearIcon = this.clearIcon.bind(this);
    this.selectShareLevel = this.selectShareLevel.bind(this);
    this.reset = this.reset.bind(this);
  }
  state={
    /* deptDisable: false,
    deptRequired: false,
    defaultdept: false,*/
  }
  componentWillReceiveProps(props) {
    // 解决校验后接收新表单数据不刷新的问题
    if (this.props.prt && props.prt && (this.props.prt.id !== props.prt.id)) {
      this.props.form.resetFields();
    }
  }

  onCancel() {
    this.props.dispatch({
      type: 'patientRecordsTemplate/setState',
      state: {
        showIconSelecter: false,
      },
    });
  }

  handleSubmit() {
    this.props.form.validateFields((err, values) => {
      if (err) return;
      if (!err) {
        this.props.dispatch({
          type: 'patientRecordsTemplate/save',
          params: values,
        });
      }
    });
  }

  selectIcon() {
    this.props.dispatch({
      type: 'patientRecordsTemplate/setState',
      state: {
        showIconSelecter: true,
      },
    });
  }

  selectShareLevel(value) {
    this.props.dispatch({
      type: 'patientRecordsTemplate/setState',
      state: {
        prt: { ...this.props.patientRecordsTemplate.prt, shareLevel: value },
      },
    });
    /* if (value === '3') {
      this.setState({ deptRequired: false, deptDisable: true, defaultdept: false });
    } else if (value === '2') {
      this.setState({ deptRequired: true, deptDisable: false, defaultdept: true });
    } else {
      this.setState({ deptRequired: false, deptDisable: false, defaultdept: false });
    }*/
  }

  clearIcon() {
    this.onIconSelected('');
  }

  reset() {
    this.props.dispatch({
      type: 'patientRecordsTemplate/setState',
      state: {
        checkedKeys: [],
        selectedNode: {},
        prt: {},
      },
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const prt = this.props.prt || {};
    const { deptCode } = this.props.base.user;
    // console.log('menu:', menu);

    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
      style: { width: '100%' },
    };
    const formItemLayoutSpan2 = {
      labelCol: { span: 3 },
      wrapperCol: { span: 21 },
      style: { width: '100%' },
    };

    // 排序选项
    // let sortIdx = null;
    const sortArr = prt.parent && prt.parent.children ? prt.parent.children : this.props.prts;
    const idxForMap = [];
    for (let i = 0; sortArr && i < sortArr.length; i++) { idxForMap.push(i); }

    if (prt && !prt.id) { idxForMap.push(idxForMap.length); }

    /* const sortIdx = idxForMap.map(
      (row, idx) => {
        return (
          <Option key={`_sort_idx_${idx}`} value={`${idx + 1}`} >{`${idx + 1}`}</Option>
        );
      },
    );*/

    const { wsHeight } = this.props.base;

    return (
      <Form>
        <ShadowDiv
          showTopShadow={false}
          style={{ height: `${wsHeight - 6 - 52}px` }}
          bodyStyle={{ height: `${wsHeight - 6 - 54}px`, overflow: 'auto', padding: '15px', paddingRight: '30px' }}
        >
          <FieldSet title="病历模板属性">
            <Row>
              <Col span={12}>
                <FormItem label="模板ID" {...formItemLayout}>
                  {
                    getFieldDecorator('modelId', {
                      initialValue: prt.modelId,
                    })(<Input tabIndex={1} style={{ width: '100%' }} disabled />)
                  }
                </FormItem>
                <FormItem label="共享等级" {...formItemLayout}>
                  {
                    getFieldDecorator('shareLevel', {
                      initialValue: prt.shareLevel || '1',
                      rules: [{ required: true, message: '共享等级不能为空' }] })(
                        <DictSelect
                          onChange={this.selectShareLevel}
                          showSearch tabIndex={3}
                          columnName="SHARE_LEVEL"
                          style={{ width: '100%' }}
                        />,
                    )
                  }
                </FormItem>
                <FormItem label="科室名称" {...formItemLayout}>
                  { getFieldDecorator('deptId', {
                    rules: [
                      { required: prt.shareLevel === '2', message: '科室名称不能为空' },
                    ],
                    initialValue: prt.deptId || (prt.shareLevel === '2' && !prt.deptId ? deptCode : ''),
                  })(
                    <DeptSelect
                      disabled={!(prt.shareLevel === '2')}
                      style={{ width: '100%' }}
                      tabIndex={5}
                      deptType={['001', '002', '003']}
                      returnType="deptId"
                    />,
                  )}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem label="模板名称" {...formItemLayout}>
                  {
                    getFieldDecorator('modelName', {
                      initialValue: prt.modelName,
                      rules: [{ required: true, message: '模板名称不能为空' }],
                    })(<Input tabIndex={2} style={{ width: '100%' }} />)
                  }
                </FormItem>
                <FormItem label="停用标志" {...formItemLayout}>
                  {
                    getFieldDecorator('stopFlag', {
                      initialValue: prt.stopFlag || '1',
                    })(
                      <RadioGroup tabIndex={4}>
                        <Radio value={'1'} >正常</Radio>
                        <Radio value={'0'} >停用</Radio>
                      </RadioGroup>,
                    )

                  }
                </FormItem>
              </Col>
            </Row>
          </FieldSet>
          <FieldSet title="病历模板内容">
            <Row>
              <Col span={12}>
                <FormItem label="主诉" {...formItemLayout} >
                  {
                getFieldDecorator('chiefComplaint', {
                  initialValue: prt.chiefComplaint,
                  rules: [{ max: 250, message: '不能超过250个字符' }],
                })(<Input type="textarea" rows={4} tabIndex={12} style={{ width: '100%' }} />)
              }
                </FormItem>
                <FormItem label="现病史" {...formItemLayout} >
                  {
                getFieldDecorator('presentIllness', {
                  initialValue: prt.presentIllness,
                  rules: [{ max: 250, message: '不能超过250个字符' }],
                })(<Input type="textarea" rows={4} tabIndex={13} style={{ width: '100%' }} />)
              }
                </FormItem>
                <FormItem label="体格检查" {...formItemLayout} >
                  {
                getFieldDecorator('physicalExam', {
                  initialValue: prt.physicalExam,
                  rules: [{ max: 250, message: '不能超过250个字符' }],
                })(<Input type="textarea" rows={4} tabIndex={16} style={{ width: '100%' }} />)
              }
                </FormItem>
              </Col>
              <Col span={12} >
                <FormItem label="药物过敏史" {...formItemLayout} >
                  {
                getFieldDecorator('allergicHistory', {
                  initialValue: prt.allergicHistory,
                  rules: [{ max: 250, message: '不能超过250个字符' }],
                })(<Input type="textarea" rows={4} tabIndex={15} style={{ width: '100%' }} />)
              }
                </FormItem>
                <FormItem label="既往史" {...formItemLayout} >
                  {
                getFieldDecorator('pastHistory', {
                  initialValue: prt.pastHistory,
                  rules: [{ max: 250, message: '不能超过250个字符' }],
                })(<Input type="textarea" rows={4} tabIndex={14} style={{ width: '100%' }} />)
              }
                </FormItem>
                <FormItem label="辅助检查" {...formItemLayout} >
                  {
                getFieldDecorator('otherExam', {
                  initialValue: prt.otherExam,
                  rules: [{ max: 250, message: '不能超过250个字符' }],
                })(<Input type="textarea" rows={4} tabIndex={17} style={{ width: '100%' }} />)
              }
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <FormItem label="嘱托" {...formItemLayoutSpan2} >
                  {
                getFieldDecorator('moOrder', {
                  initialValue: prt.moOrder,
                  rules: [{ max: 250, message: '不能超过250个字符' }],
                })(<Input type="textarea" rows={4} tabIndex={18} style={{ width: '100%' }} />)
              }
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <FormItem label="初诊记录" {...formItemLayout} >
                  {
                getFieldDecorator('firstRecode', {
                  initialValue: prt.firstRecode,
                  rules: [{ max: 250, message: '不能超过250个字符' }],
                })(<Input type="textarea" rows={4} tabIndex={19} style={{ width: '100%' }} />)
              }
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem label="复诊记录" {...formItemLayout} >
                  {
                getFieldDecorator('reviewRecode', {
                  initialValue: prt.reviewRecode,
                  rules: [{ max: 250, message: '不能超过250个字符' }],
                })(<Input type="textarea" rows={4} tabIndex={20} style={{ width: '100%' }} />)
              }
                </FormItem>
              </Col>
            </Row>
          </FieldSet>
        </ShadowDiv>
        <div style={{ height: '52px', textAlign: 'right', paddingTop: '10px', paddingRight: '30px' }} >
          <Button type="primary" onClick={this.handleSubmit.bind(this)} style={{ marginRight: '10px' }} size="large" icon="save" >保存</Button>
          {/* <Button onClick={this.reset} style={{ marginRight: '10px' }} size="large" icon="copy" >复制</Button>*/}
          <Button onClick={this.reset} size="large" icon="reload" >重置</Button>
        </div>
      </Form>
    );
  }
}
const PatientRecordsTemplateEditorFrom = Form.create()(PatientRecordsTemplateEditor);
export default connect(
  ({ patientRecordsTemplate, base }) => ({ patientRecordsTemplate, base }),
)(PatientRecordsTemplateEditorFrom);

