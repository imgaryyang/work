import React, { Component } from 'react';
import { connect } from 'dva';
import { Modal, Row, Col, Form, Input, Button } from 'antd';

import DictSelect from '../../../components/DictSelect';
import DeptSelect from '../../../components/DeptSelect';

import styles from './ChargePkg.less';

const FormItem = Form.Item;

function compare(obj, values) {
  for (const key in obj) {
    if (obj[key] !== values[key]) return true;
  }
  return false;
}

class ChargePkgEdit extends Component {

  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.save = this.save.bind(this);
    this.handleReset = this.handleReset.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.close = this.close.bind(this);
    this.chooseShareLevel = this.chooseShareLevel.bind(this);
  }

  handleSubmit() {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        // console.log(values);
        const newValues = values;
        const { groupRecord } = this.props.chargePkg;
        // 共享等级不为科室时清空所属科室
        // 共享等级为科室时将 useDept 组合为带 id 的对象
        if (newValues.shareLevel !== '2') {
          newValues.useDept = null;
        } else {
          newValues.useDept = { id: newValues.useDept };
        }

        if (typeof newValues.id === 'undefined' || newValues.id === '') {
          this.save(newValues);

        // 处于修改状态且药品标识发生改变时，提示会删除所有明细
        } else {
          if (groupRecord.drugFlag !== newValues.drugFlag) {
            Modal.confirm({
              title: '确认',
              content: '药品标志发生改变，将删除所有对应的组套明细，您确认吗？',
              okText: '确认',
              cancelText: '我再看看',
              onOk: () => {
                this.save(newValues);
              },
            });
          } else this.save(newValues);
        }
      }
    });
  }

  handleReset() {
    this.props.form.resetFields();
  }

  handleCancel() {
    /* const values = this.props.form.getFieldsValue();
    const data = this.props.chargePkg.groupRecord;*/
    // const changed = compare(values, data);
    /* if (changed) {
      Modal.confirm({
        title: '确认',
        content: '您要放弃保存您所作的修改吗？',
        okText: '放弃',
        cancelText: '我再看看',
        onOk: () => {
          this.close();
        },
      });
    } else {
      this.close();
    }*/
    this.close();
  }

  chooseShareLevel(value) {
    const { groupRecord } = this.props.chargePkg;
    this.props.dispatch({
      type: 'chargePkg/setState',
      payload: {
        groupRecord: {
          ...groupRecord,
          shareLevel: value,
          useDept: value === '2' ? groupRecord.useDept : '',
        },
      },
    });
    if (value !== '2') this.props.form.resetFields(['useDept']);
  }

  save(values) {
    // console.log('values in save():', values);
    this.props.dispatch({
      type: 'chargePkg/savePkg',
      payload: values,
    });
    this.close();
  }

  close() {
    this.props.dispatch({
      type: 'chargePkg/setState',
      payload: {
        groupEditVisible: false,
      },
    });
    this.props.form.resetFields();
  }

  render() {
    const { form, chargePkg } = this.props;
    const { getFieldDecorator } = form;
    const { groupRecord, groupEditVisible } = chargePkg;

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

    const title = groupRecord.id ? `修改${groupRecord.comboName}` : '新建组套';

    const useDeptDisabled = groupRecord.shareLevel === '2' ? false : true;

    /* CommonItemSearchInput : 0 - 收费项目 ；1 - 药品 */
    return (
      <Modal
        width={850} title={title} visible={groupEditVisible} closable
        footer={null} maskClosable={false} onCancel={this.handleCancel}
      >
        <Form inline className={styles.form} >
          <Row style={{ marginTop: '10px' }} >
            <Col span={12}>
              <FormItem style={{ display: 'none' }} >
                {getFieldDecorator('id', {
                  initialValue: groupRecord.id,
                })(<Input />)}
              </FormItem>
              <FormItem style={{ display: 'none' }} >
                {getFieldDecorator('comboId', {
                  initialValue: groupRecord.comboId,
                })(<Input />)}
              </FormItem>
              <FormItem style={{ width: '100%' }} label="业务分类" {...formItemLayout} >
                {getFieldDecorator('busiClass', {
                  initialValue: groupRecord.busiClass,
                  rules: [{ required: true, message: '业务分类不能为空' }],
                })(
                  <DictSelect
                    style={{ width: '100%' }}
                    tabIndex={0}
                    columnName="BUSI_CLASS"
                    allowClear
                  />,
                )}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem style={{ width: '100%' }} label="共享等级" {...formItemLayout} >
                {getFieldDecorator('shareLevel', {
                  initialValue: groupRecord.shareLevel,
                  rules: [{ required: true, message: '共享等级不能为空！' }],
                })(
                  <DictSelect
                    style={{ width: '100%' }}
                    tabIndex={0}
                    columnName="SHARE_LEVEL"
                    allowClear
                    onSelect={this.chooseShareLevel}
                  />,
                )}
              </FormItem>
            </Col>
          </Row>
          <Row style={{ marginTop: '10px' }} >
            <Col span={12}>
              <FormItem style={{ width: '100%' }} label="药品标志" {...formItemLayout} >
                {getFieldDecorator('drugFlag', {
                  initialValue: groupRecord.drugFlag,
                  rules: [{ required: true, message: '药品标志不能为空！' }],
                })(
                  <DictSelect
                    style={{ width: '100%' }}
                    tabIndex={0}
                    columnName="GROUP_TYPE"
                    allowClear
                  />,
                )}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem style={{ width: '100%' }} label="模板所属科室" {...formItemLayout} >
                {getFieldDecorator('useDept', {
                  initialValue: groupRecord.useDept ? groupRecord.useDept.id : '',
                  rules: [
                    { validator: (rule, value, callback) => {
                      const values = this.props.form.getFieldsValue();
                      if (values.shareLevel === '2' && (typeof value === 'undefined' || value === '')) {
                        callback('共享等级为科室时模板所属科室必须填写！');
                      } else callback();
                    } },
                  ],
                })(
                  <DeptSelect allowClear disabled={useDeptDisabled} />,
                )}
              </FormItem>
            </Col>
          </Row>
          <Row style={{ marginTop: '10px' }} >
            <Col span={24}>
              <FormItem style={{ width: '100%' }} label="模板名称" {...formItemLayoutColSpan} >
                {getFieldDecorator('comboName', {
                  initialValue: groupRecord.comboName,
                  rules: [
                    { required: true, message: '模板名称不能为空！' },
                    { max: 50, message: '模板名称不能不能超过50个字符！' },
                  ],
                })(
                  <Input maxLength={10} placeholder="模板名称" />,
                )}
              </FormItem>
            </Col>
          </Row>

          <div style={{ marginTop: '10px', textAlign: 'right' }} >
            <Button type="primary" onClick={this.handleSubmit} style={{ marginRight: '10px' }} icon="plus" size="large" >保存</Button>
            <Button onClick={this.handleReset} icon="reload" size="large" >清空</Button>
          </div>

        </Form>
      </Modal>
    );
  }
}
const ChargePkgEditForm = Form.create()(ChargePkgEdit);
export default connect(
  ({ chargePkg, base }) => ({ chargePkg, base }),
)(ChargePkgEditForm);

