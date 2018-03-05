import React, { Component } from 'react';
import { connect } from 'dva';
import { Row, Col, Form, Input, InputNumber, Button, notification } from 'antd';

import DictSelect from '../../../components/DictSelect';
import DeptSelect from '../../../components/DeptSelect';
import FieldSet from '../../../components/FieldSet';
import CommonItemSearchInput from '../../../components/searchInput/CommonItemSearchInput';
import FreqSearchInput from '../../../components/searchInput/FreqSearchInput';

import styles from './ChargePkg.less';

const FormItem = Form.Item;

class ChargePkgItemInput extends Component {

  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleReset = this.handleReset.bind(this);
    this.onSelectCommonItem = this.onSelectCommonItem.bind(this);
    this.onSelectFreq = this.onSelectFreq.bind(this);
    this.onSelectDrugFlag = this.onSelectDrugFlag.bind(this);
  }

  componentWillReceiveProps(props) {
    // 当前组套发生改变
    if (this.props.chargePkg.groupRecord.id !== props.chargePkg.groupRecord.id ||
      this.props.chargePkg.itemRecord.id !== props.chargePkg.itemRecord.id) {
      // 重置表单
      this.props.form.resetFields();
    }
  }

  onSelectCommonItem(item) {
    const newRecord = { ...item };
    // console.log(newRecord);
    this.props.dispatch({
      type: 'chargePkg/setState',
      payload: {
        itemRecord: {
          ...this.props.chargePkg.itemRecord,
          itemId: newRecord.itemId,
          itemCode: newRecord.itemCode,
          itemName: newRecord.itemName,
          unit: newRecord.itemUnit,
          dosageUnit: newRecord.doseUnit,
          defaultDept: newRecord.exeDept,
          feeCode: newRecord.feeCode, // 费用类型
          specs: newRecord.itemSpecs, // 规格
        },
      },
    });
  }

  onSelectFreq(item) {
    this.props.dispatch({
      type: 'chargePkg/setState',
      payload: {
        itemRecord: {
          ...this.props.chargePkg.itemRecord,
          freq: item.freqId,
          freqDesc: `${item.freqName} | ${item.freqTime}`,
        },
      },
    });
  }

   onSelectDrugFlag(value) {
    const { groupRecord } = this.props.chargePkg;
    this.props.dispatch({
      type: 'chargePkg/setState',
      payload: {
        groupRecord: {
          drugFlag: value,
          id: groupRecord.id,
        },
      },
    });
    this.props.form.resetFields();
  }

  handleSubmit() {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        // console.log(values);
        const newValues = values;
        newValues.itemName = this.props.chargePkg.itemRecord.itemName; 
        const { groupRecord } = this.props.chargePkg;

        if (!groupRecord.id) {
          notification.warning({
            message: '警告',
            description: '请先选择组套！',
          });
          return;
        }
        if (!newValues.itemId) {
          notification.warning({
            message: '警告',
            description: '请选择项目！',
          });
          return;
        }
        if (!newValues.defaultNum) {
          notification.warning({
            message: '警告',
            description: '请填写数量！',
          });
          return;
        }
        this.props.dispatch({
          type: 'chargePkg/saveItem',
          payload: newValues,
        });
      }
    });
  }

  handleReset() {
    this.props.dispatch({
      type: 'chargePkg/setState',
      payload: {
        itemRecord: {},
      },
    });
    this.props.form.resetFields();
  }

  render() {
    const { form, chargePkg } = this.props;
    const { getFieldDecorator } = form;
    const { groupRecord, itemRecord } = chargePkg;
    const formItemLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 16 },
      size: 'small',
    };

    const formItemLayoutColSpan = {
      labelCol: { span: 4 },
      wrapperCol: { span: 20 },
      size: 'small',
    };

    const btnText = itemRecord.id ? '保存修改' : '保存新增';

    /* CommonItemSearchInput : 0 - 收费项目 ；1 - 药品 */
    return (
      <Form inline className={styles.form} >
        <Row style={{ marginTop: '10px' }} >
            <FormItem style={{ display: 'none' }} >
              {getFieldDecorator('comboId', {
                initialValue: groupRecord.id,
              })(<Input />)}
            </FormItem>
            <FormItem style={{ display: 'none' }} >
              {getFieldDecorator('drugFlag', {
                initialValue: groupRecord.drugFlag,
              })(<Input />)}
            </FormItem>
            <FormItem style={{ display: 'none' }} >
              {getFieldDecorator('id', {
                initialValue: itemRecord.id,
              })(<Input />)}
            </FormItem>
            <FormItem style={{ display: 'none' }} >
              {getFieldDecorator('itemId', {
                initialValue: itemRecord.itemId,
              })(<Input />)}
            </FormItem>
            <FormItem style={{ display: 'none' }} >
              {getFieldDecorator('itemCode', {
                initialValue: itemRecord.itemCode,
              })(<Input />)}
            </FormItem>
            <FormItem style={{ display: 'none' }} >
              {getFieldDecorator('comboNo', {
                initialValue: itemRecord.comboNo || '',
              })(<Input />)}
            </FormItem>
            <FormItem style={{ display: 'none' }} >
              {getFieldDecorator('comboSort', {
                initialValue: itemRecord.comboSort || '',
              })(<Input />)}
            </FormItem>
            <FormItem style={{ display: 'none' }} >
              {getFieldDecorator('feeCode', {
                initialValue: itemRecord.feeCode,
              })(<Input />)}
            </FormItem>
            <FormItem style={{ display: 'none' }} >
              {getFieldDecorator('specs', {
                initialValue: itemRecord.specs,
              })(<Input />)}
            </FormItem>
            <FormItem style={{ display: 'none' }} >
              {getFieldDecorator('stop', {
                initialValue: itemRecord.stop === false ? '0' : '1',
              })(<Input />)}
            </FormItem>
            <FormItem style={{ display: 'none' }} >
              {getFieldDecorator('unit', {
                initialValue: itemRecord.unit,
              })(<Input />)}
            </FormItem>
          <Col span={6}>
            <FormItem style={{ width: '100%' }} label="药品标志" {...formItemLayout} >
              {getFieldDecorator('drugFlag', {
                initialValue: groupRecord.drugFlag,
              })(
                <DictSelect
                  style={{ width: '100%' }}
                  tabIndex={0}
                  columnName="GROUP_TYPE"
                  onSelect={this.onSelectDrugFlag}
                  disabled={!!itemRecord.id}
                  allowClear = 'true'
                />,
              )}
            </FormItem>
          </Col>
          <Col span={6} >
            <FormItem style={{ width: '100%' }} label="收费项目" {...formItemLayout} >
              {getFieldDecorator('itemNameDis', {
                initialValue: itemRecord.itemName,
              })(
                <CommonItemSearchInput
                  onSelect={this.onSelectCommonItem}
                  drugFlag={groupRecord.drugFlag}
                  placeholder="收费项目"
                  disabled={!!itemRecord.id}
                  allowClear = 'true'
                />,
              )}
            </FormItem>
          </Col>
          <Col span={6} >
            <FormItem style={{ width: '100%' }} label="数量" {...formItemLayout} >
              {getFieldDecorator('defaultNum', {
                initialValue: itemRecord.defaultNum || '',
              })(
                <Input
                  maxLength={3}
                  placeholder="数量"
                  style={{ width: '100%' }}
                  addonAfter={itemRecord.unit}
                />,
              )}
            </FormItem>
          </Col>
          <Col span={6} >
            <FormItem style={{ width: '100%' }} label="执行科室" {...formItemLayout} >
              {getFieldDecorator('defaultDept', {
                initialValue: itemRecord.defaultDept,
              })(
                <DeptSelect
                  allowClear
                  placeholder="执行科室"
                  allowClear = 'true'
                />,
              )}
            </FormItem>
          </Col>
        </Row>

        {
          typeof groupRecord.drugFlag === 'undefined' || groupRecord.drugFlag !== '3' ? (
            /* <FieldSet title="用法/用量" className={styles.fieldSet} >*/
            <div>
              <Row style={{ marginTop: '10px' }} >
                <Col span={6} >
                  <FormItem style={{ width: '100%' }} label="用药方法" {...formItemLayout} >
                    {getFieldDecorator('usage', {
                      initialValue: itemRecord.usage,
                    })(
                      <DictSelect
                        style={{ width: '100%' }}
                        tabIndex={0}
                        columnName="USAGE"
                        placeholder="用药方法"
                        allowClear = 'true'
                      />,
                    )}
                  </FormItem>
                </Col>
                <Col span={6} >
                  <FormItem style={{ display: 'none' }} >
                    {getFieldDecorator('freq', {
                      initialValue: itemRecord.freq,
                    })(<Input />)}
                  </FormItem>
                  <FormItem style={{ width: '100%' }} label="执行频率" {...formItemLayout} >
                    {getFieldDecorator('freqDesc', {
                      initialValue: itemRecord.freqDesc,
                    })(
                      <FreqSearchInput
                        onSelect={this.onSelectFreq}
                        placeholder="执行频率"
                        allowClear = 'true'
                      />,
                    )}
                  </FormItem>
                </Col>
                <Col span={6} >
                  <FormItem style={{ width: '100%' }} label="一次剂量" {...formItemLayout} >
                    {getFieldDecorator('dosage', {
                      initialValue: itemRecord.dosage || '',
                    })(
                      <Input
                        maxLength={20}
                        placeholder="一次剂量"
                        style={{ width: '100%' }}
                        addonAfter={itemRecord.dosageUnit}
                      />,
                    )}
                  </FormItem>
                  <FormItem style={{ display: 'none' }} >
                    {getFieldDecorator('dosageUnit', {
                      initialValue: itemRecord.dosageUnit,
                    })(
                      <Input />,
                    )}
                  </FormItem>
                </Col>
                <Col span={6} >
                  <FormItem style={{ width: '100%' }} label="执行天数" {...formItemLayout} >
                    {getFieldDecorator('days', {
                      initialValue: itemRecord.days || '',
                    })(
                      <InputNumber maxLength={3} placeholder="执行天数" style={{ width: '100%' }} />,
                    )}
                  </FormItem>
                </Col>
              </Row>
            </div>
            /* </FieldSet>*/
          ) : null
        }
        <Row>
          <Col span={12} />
          <Col span={12} style={{ textAlign: 'right', paddingTop: '10px' }} >
            <Button type="primary" onClick={this.handleSubmit} style={{ marginRight: '10px' }} icon="plus" size="large" >{btnText}</Button>
            <Button onClick={this.handleReset} icon="reload" size="large" >重置</Button>
          </Col>
        </Row>

        {/* <div className={styles.btnContainer} >
        </div>*/}

      </Form>
    );
  }
}
const ChargePkgItemInputForm = Form.create()(ChargePkgItemInput);
export default connect(
  ({ chargePkg, base }) => ({ chargePkg, base }),
)(ChargePkgItemInputForm);

