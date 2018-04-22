import React, { Component } from 'react';
import { connect } from 'dva';
import { Spin, Tabs, Row, Col, Button, Modal, DatePicker, Form, Input, Select, TreeSelect } from 'antd';
import moment from 'moment'; 

import { arrayToString } from '../../../utils/tools';
import { testMobile, testCnIdNo } from '../../../utils/validation';
import MachineSelect 		from '../../../components/MachineSelect';

const FormItem = Form.Item;
const TabPane = Tabs.TabPane;
const TreeNode = TreeSelect.TreeNode;

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
    this.onChangeMaterial = this.onChangeMaterial.bind(this);
    this.close = this.close.bind(this);
    this.reset = this.reset.bind(this);
  }

  state = {
		    name: undefined,
	}
  
  reset() {
    this.props.form.resetFields();
  }

  handleCancel() {
    const values = this.props.form.getFieldsValue();
    if (values.bornDate) {
      values.bornDate = values.bornDate.format('YYYY-MM-DD');
    }
    const data = this.props.troubleDetail.record;
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
      type: 'troubleDetail/setState',
      payload: {
        record: {},
        spin: false,
        outVisible: false,
      },
    });
    this.props.form.resetFields();
  }

  handleSubmit() {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const newValues = { ...values };
        this.props.dispatch({
          type: 'troubleDetail/save',
          params: newValues,
        });
       this.props.form.resetFields();
      }
    });
  }
  onChangeMaterial(value){
	  this.props.dispatch({
		  type: 'troubleDetail/selectAccount',
		  payload: value,
	  });
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const { spin, record, outVisible, troubles, account } = this.props.troubleDetail;
    console.log('troubles=>',troubles);
   /* const options = troubles.map(d => <Option key={d.id}>{d.name}</Option>);*/
    const loop = data => data.map((item) => {
          if (item.children && item.children.length) {
            return <TreeNode key={item.id} title={item.name} value={item.id} >{loop(item.children)}</TreeNode>;
          }
          return <TreeNode key={item.id} title={item.name} value={item.id} />;
        });
    const title = '故障信息';
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 16 },
    };
    return (
      <Modal
        width={850}
        title={title}
        visible={outVisible}
        closable
        footer={null}
        maskClosable={false}
        onCancel={this.handleCancel}
      >
        <Spin spinning={spin} >
          <Form onSubmit={this.handleSubmit}>
          <FormItem style={{ display: 'none' }}>
          { 
            getFieldDecorator('id', { initialValue: record?record.id:'' || '' })(<Input />)
          }
        </FormItem>
            <Row>
	          <Col span={12}>
	            <FormItem label="自助机编号"  {...formItemLayout}>
	              {
	                getFieldDecorator('machine.id', {
	                  initialValue: record.machine?record.machine.id:"" || '',
	                  rules: [{ required: true, message: '自助机编号不能为空' }],
	                })(<MachineSelect placeholder='自助机编号' disabled={record.machine?true:false} tabIndex={1} />)
	              }
	            </FormItem>
	            <FormItem label="故障描述" {...formItemLayout}>
	              {
	                getFieldDecorator('description', {
	                  initialValue: record?record.description:'' || '',
	                  rules: [{ required: true, message: '处理方式不能为空' }],
	                })(<Input type='textarea' placeholder="请填写详细故障信息以及原因" rows={4} tabIndex={3} />)
	              }
	            </FormItem> 
	          </Col>
              <Col span={12}>
                <FormItem label="故障名称" {...formItemLayout}>
                  {
                    getFieldDecorator('trouble.id', {
                      initialValue: record.trouble?record.trouble.id:"" || '',
                      rules: [{ required: true, message: '故障名称不能为空' }],
                    })
                    (<TreeSelect
				        /*style={{ width: 300 }}*/
				        /*value={this.state.name}*/
				        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
				        /*treeData={troubles}*/
				        placeholder="选择二级故障"
				        treeDefaultExpandAll
				        onChange={this.onChange}
                    	onSelect={this.onSelect}
				      >
                    {loop(troubles)}
                    </TreeSelect>)
                  }
                </FormItem>
                <FormItem label="处理方式" {...formItemLayout}>
	              {
	                getFieldDecorator('dealWay', {
	                  initialValue: record?record.dealWay:'' || '',
	                  rules: [{ required: true, message: '处理方式不能为空' }],
	                })(<Input type='textarea' placeholder="请填写详细处理方式以及处理人" rows={4} tabIndex={3} />)
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
        </Spin>
      </Modal>
    );
  }
}
const Editor = Form.create()(EditorForm);
export default connect(({ troubleDetail, utils, machine }) => ({ troubleDetail, utils, machine }))(Editor);

