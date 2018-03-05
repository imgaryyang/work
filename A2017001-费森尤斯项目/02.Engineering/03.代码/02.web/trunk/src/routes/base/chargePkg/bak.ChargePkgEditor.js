import React, { Component } from 'react';
import { connect } from 'dva';
import { Row, Col, Button, Modal, Form, Input, Select, Radio } from 'antd';

const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;

function compare(obj, values) {
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
    this.handleBusiChange = this.handleBusiChange.bind(this);
    this.handleGroupChange = this.handleGroupChange.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.chargePkg.record == null) this.reset();
  }

  handleCancel() {
    const values = this.props.form.getFieldsValue();
    const data = this.props.chargePkg.record;
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
      type: 'chargePkg/setState',
      payload: { record: null },
    });
  }

  handleSubmit() {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        this.props.dispatch({
          type: 'chargePkg/save',
          params: values,
        });
      }
    });
  }
  /** *业务分类***/
  handleBusiChange(value) {
      this.props.dispatch({
        type: 'chargePkg/setState',
        payload: {
          selectedGroup: value,
        },
      });
    }
  /** *维护分类***/
  handleGroupChange(value) {
      this.props.dispatch({
        type: 'chargePkg/setState',
        payload: {
          selectedGroup: value,
        },
      });
    }
  render() {
    const { getFieldDecorator } = this.props.form;
    const { tree, selectedType, selectedGroup } = this.props.chargePkg;
    const data = this.props.chargePkg.record || {};
    const dicts = this.props.chargePkg.dicts;
    console.info('zhoumin', this.props.chargePkg.selectedType);

    const initBusiCode = data.busiCode || this.props.chargePkg.selectedType.group;
    const initGroupCode = data.groupCode || this.props.chargePkg.selectedType.code;
    console.info('initBusiCode', initBusiCode);
    const busiCode = [];

        for (let i = 0; dicts.BUSI_CLASS && i < dicts.BUSI_CLASS.length; i++) {
          const item = dicts.BUSI_CLASS[i];
          busiCode.push(
  <Option key={item.columnKey + i} value={item.columnKey} >
    {item.columnVal}
  </Option>,
          );
        }


      const groupCode = [];
        for (let i = 0; dicts.GROUP_CLASS && i < dicts.GROUP_CLASS.length; i++) {
          const item = dicts.GROUP_CLASS[i];
          groupCode.push(
  <Option key={item.columnKey + i} value={item.columnKey} >
    {item.columnVal}
  </Option>,
          );
        }


    const visible = !!this.props.chargePkg.record;
    const title = data.columnName || '新增';
    const isCreate = !data.id;
    const formItemLayout = {
        labelCol: { span: 5 },
        wrapperCol: { span: 15 },
      };
    // hasFeedback 属性删除，解决firefox无法输入汉字的bug xiaweiyi
    return (
      <Modal width={850} title={title} visible={visible} closable footer={null} maskClosable={false} onCancel={this.handleCancel} >
        <Form >
          <FormItem style={{ display: 'none' }}>
            {
          getFieldDecorator('id', { initialValue: data.id })(<Input />)
        }
          </FormItem>
          <Row>
            <Col span={12}>
              <FormItem label="套餐ID" {...formItemLayout}>
                {
             getFieldDecorator('comboId', {
               initialValue: data.comboId,
               rules: [{ required: true, message: '套餐ID不能为空' }],
             })(<Input tabIndex={3} />)
           }
              </FormItem>
              <FormItem label="套餐名称" {...formItemLayout}>
                {
             getFieldDecorator('comboName', {
               initialValue: data.comboName,
               rules: [{ required: true, message: '套餐名称不能为空' }],
             })(<Input tabIndex={5} />)
           }
              </FormItem>
              <FormItem label="业务分类" {...formItemLayout}>
                {
             getFieldDecorator('busiClass', {
               initialValue: data.busiClass,

               rules: [{ required: true, message: '业务分类不能为空' }],
             })(<Select
              style={{ width: '100%' }}
              onChange={this.handlebusiChange}
              tabIndex={7}
             >
                {busiCode}
                   </Select>,
             )}
              </FormItem>
              <FormItem label="维护分类" {...formItemLayout}>
                {
             getFieldDecorator('groupClass', {
               initialValue: data.groupClass,
               rules: [{ required: true, message: '维护分类不能为空' }],
             })(<Select style={{ width: '100%' }} onChange={this.handlebusiChange} tabIndex={7}>
                {groupCode}
                   </Select>,
               )}
              </FormItem>
              <FormItem label="拼音" {...formItemLayout}>
                {
             getFieldDecorator('spellCode', {
               initialValue: data.spellCode,
               rules: [{ required: true, message: '拼音不能为空' }],
             })(<Input tabIndex={11} />)
           }
              </FormItem>
              <FormItem label="自定义码" {...formItemLayout}>
                {
             getFieldDecorator('userCode', {
               initialValue: data.userCode,
               rules: [{ required: true, message: '自定义码不能为空' }],
             })(<Input tabIndex={13} />)
           }
              </FormItem>
              <FormItem label="创建人员" {...formItemLayout} style={{ display: isCreate ? 'none' : '' }}>
                {
             getFieldDecorator('createOper', {
               initialValue: data.createOper,
             })(<Input disabled />)
           }
              </FormItem>
              <FormItem label="更新人员" {...formItemLayout} style={{ display: isCreate ? 'none' : '' }}>
                {
             getFieldDecorator('updateOper', {
               initialValue: data.updateOper,
             })(<Input disabled />)
           }
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label="所属科室" {...formItemLayout}>
                {
             getFieldDecorator('useDept', {
               initialValue: data.useDept,
               rules: [{ required: true, message: '所属科室不能为空' }],
             })(<Input tabIndex={2} />)
           }
              </FormItem>
              <FormItem label="备注" {...formItemLayout}>
                {
             getFieldDecorator('comm', {
               initialValue: data.comm,
             })(<Input tabIndex={4} />)
           }
              </FormItem>


              <FormItem label="五笔" {...formItemLayout}>
                {
             getFieldDecorator('wbCode', {
               initialValue: data.wbCode,
               rules: [{ required: true, message: '五笔不能为空' }],
             })(<Input tabIndex={6} />)
           }
              </FormItem>

              <FormItem label="停用标志" {...formItemLayout}>
                {
             getFieldDecorator('stop', {
               initialValue: data.stop,
             })(
              <RadioGroup tabIndex={8}>
                <Radio value>停用</Radio>
                <Radio value={false}>未停用</Radio>
              </RadioGroup >,
             )
           }
              </FormItem>
              <FormItem label="创建时间" {...formItemLayout} style={{ display: isCreate ? 'none' : '' }}>
                {
             getFieldDecorator('createTime', {
               initialValue: data.createTime,
             })(<Input disabled />)
           }
              </FormItem>

              <FormItem label="更新时间" {...formItemLayout} style={{ display: isCreate ? 'none' : '' }}>
                {
             getFieldDecorator('updateTime', {
               initialValue: data.updateTime,
             })(<Input disabled />)
           }
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={10} />
            <Col span={1}><Button type="primary" onClick={this.handleSubmit}>保存</Button></Col>
            <Col span={2} />
            <Col span={1}><Button onClick={this.reset}>重置</Button></Col>
            <Col span={10} />
          </Row>
        </Form>
      </Modal >
    );
  }
}
const Editor = Form.create()(EditorForm);
export default connect(({ chargePkg }) => ({ chargePkg }))(Editor);

