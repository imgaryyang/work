import React, { Component, PropTypes } from 'react';
import { connect } from 'dva';
import { Form, Input, Tooltip, Icon, Cascader, Select, Row, Col, Checkbox, Button, Spin, Modal } from 'antd';
import IconSelecter from '../../../components/IconSelecter';
import styles from './Trouble.css';

const FormItem = Form.Item;
const Option = Select.Option;

class TroubleEditor extends React.Component {
  
  state = {
  }

  constructor(props) {
    super(props);
    this.selectIcon     = this.selectIcon.bind(this);
    this.onIconSelected = this.onIconSelected.bind(this);
    this.reset           = this.reset.bind(this);
    this.onCancel       = this.onCancel.bind(this);
    this.clearIcon       = this.clearIcon.bind(this);
  }

  componentWillReceiveProps (props) {
    //解决校验后接收新表单数据不刷新的问题
    if (this.props.trouble && props.trouble && (this.props.trouble.id != props.trouble.id))
      this.props.form.resetFields();
  }

  handleSubmit(e){
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.dispatch({
          type: 'troubleManage/save',
          params: values
        });
      }
    });
  }

  selectIcon () {
    this.props.dispatch({
      type: 'troubleManage/setState',
      state: {
        showIconSelecter: true
      }
    });
  }

  onIconSelected (icon) {

    let {trouble} = this.props.troubleManage;
    let newTrouble = {...trouble, icon: icon};

    this.props.dispatch({
      type: 'troubleManage/setState',
      state: {
        trouble: newTrouble,
        showIconSelecter: false
      }
    });
    /*this.props.form.setFieldsValue({
      "icon": icon
    });*/
  }

  clearIcon () {
    this.onIconSelected("");
  }

  reset () {
    this.props.dispatch({
      type: 'troubleManage/setState',
      state: {
        checkedKeys: [],
        selectedNode: {},
        trouble: {},
      }
    });
  }

  onCancel () {
    this.props.dispatch({
      type: 'troubleManage/setState',
      state: {
        showIconSelecter: false
      }
    });
  }

  render () {
    const { getFieldDecorator } = this.props.form;
    const trouble = this.props.trouble || {};
    //console.log('trouble:', trouble);
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 16 },
    };

    let { showIconSelecter } = this.props.troubleManage;

    //排序选项
    let sortIdx = null,
        sortArr = trouble.parent && trouble.parent.children ? trouble.parent.children : this.props.troubles,
        idxForMap = [];
     for (let i = 0 ; sortArr && i < sortArr.length ; i++)
       idxForMap.push(i);
     
     if (trouble && !trouble.id)
       idxForMap.push(idxForMap.length);
     
    sortIdx = idxForMap.map (
      (row, idx) => {
        return (
          <Option key = {'_sort_idx_' + idx} value = {(idx + 1) + ''} >{(idx + 1) + ''}</Option>
        )
      }
    );
    
    return (
      <Form >
        <FormItem style={{display:'none'}}>
        {
          getFieldDecorator('id', { initialValue: trouble.id})(<Input />)
        }
        </FormItem>
         <Row>

          <Col span = {24} >
            <FormItem style = {{display: 'none'}} >
             {
               getFieldDecorator('parent', {
                 initialValue: trouble.parent && trouble.parent.id ? trouble['parent']['id'] : ''
               })(<Input />)
             }
            </FormItem>
            <FormItem label = "父故障" labelCol = {{span: 3}} wrapperCol = {{span: 20}} >
             {
               getFieldDecorator('parentName', {
                 initialValue: trouble.parent && trouble.parent.id ? trouble['parent']['name']  : ''
               })(<Input disabled />)
             }
             </FormItem>
          </Col>

          <Col span={12}>
             <FormItem label="名称" {...formItemLayout} >
             {
               getFieldDecorator('name',{ 
                 initialValue: trouble.name,
                 rules: [{ required: true, message: '名称不能为空' },]
               })(<Input />)
             }
             </FormItem>      
          </Col>

          <Col span={12}>
             <FormItem label = "排序" {...formItemLayout} >
             {
               getFieldDecorator('sort', {
                 initialValue: trouble.sort ? trouble.sort + '' : '',
                 rules: [{ required: true, message: '排序不能为空' },]
               })(
                 <Select >
                   { sortIdx }
                 </Select>
               )
             }
             </FormItem>
          </Col>
         
         </Row>
        <div style = {{textAlign: 'center'}} >
          <Button type="primary" size = "large" htmlType="button" style = {{width: '20%'}} onClick={this.handleSubmit.bind(this)} >保存</Button>
          <Button size = "large" htmlType="reset" style = {{width: '20%', marginLeft: '10px'}} onClick = {this.reset} >重置</Button>
        </div>
      </Form>
    );  
  }

}
const TroubleEditorForm = Form.create()(TroubleEditor);
export default connect(({troubleManage})=>({troubleManage}))(TroubleEditorForm);

