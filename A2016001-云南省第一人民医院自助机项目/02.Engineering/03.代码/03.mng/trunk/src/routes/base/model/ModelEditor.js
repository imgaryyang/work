import React, { Component, PropTypes } from 'react';
import { connect } from 'dva';
import { Form, Input, Tooltip, Icon, Cascader, Select, Row, Col, Checkbox, Button, Spin, Modal } from 'antd';
import IconSelecter from '../../../components/IconSelecter';
import styles from './Model.css';

const FormItem = Form.Item;
const Option = Select.Option;

class ModelEditor extends React.Component {
  
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
    if (this.props.model && props.model && (this.props.model.id != props.model.id))
      this.props.form.resetFields();
  }

  handleSubmit(e){
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.dispatch({
          type: 'modelManage/save',
          params: values
        });
      }
    });
  }

  selectIcon () {
    this.props.dispatch({
      type: 'modelManage/setState',
      state: {
        showIconSelecter: true
      }
    });
  }

  onIconSelected (icon) {

    let {model} = this.props.modelManage;
    let newModel = {...model, icon: icon};

    this.props.dispatch({
      type: 'modelManage/setState',
      state: {
    	  model: newModel,
    	  showIconSelecter: false
      }
    });
  }

  clearIcon () {
    this.onIconSelected("");
  }

  reset () {
    this.props.dispatch({
      type: 'modelManage/setState',
      state: {
        checkedKeys: [],
        selectedNode: {},
        model: {},
      }
    });
  }

  onCancel () {
    this.props.dispatch({
      type: 'modelManage/setState',
      state: {
        showIconSelecter: false
      }
    });
  }

  render () {
    const { getFieldDecorator } = this.props.form;
    const model = this.props.model || {};
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 16 },
    };

    let { showIconSelecter } = this.props.modelManage;

    //排序选项
    let sortIdx = null,
        sortArr = model.parent && model.parent.children ? model.parent.children : this.props.models,
        idxForMap = [];
     for (let i = 0 ; sortArr && i < sortArr.length ; i++)
       idxForMap.push(i);
     
     if (model && !model.id)
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
          getFieldDecorator('id', { initialValue: model.id})(<Input />)
        }
        </FormItem>
         <Row>

          <Col span = {24} >
            <FormItem style = {{display: 'none'}} >
             {
               getFieldDecorator('parent', {
                 initialValue: model.parent && model.parent.id ? model['parent']['id'] : ''
               })(<Input />)
             }
            </FormItem>
            <FormItem label = "型号" labelCol = {{span: 3}} wrapperCol = {{span: 20}} >
             {
               getFieldDecorator('parentName', {
                 initialValue: model.parent && model.parent.id ? model['parent']['name']  : ''
               })(<Input disabled />)
             }
             </FormItem>
          </Col>

          <Col span={12}>
             <FormItem label="名称" {...formItemLayout} >
             {
               getFieldDecorator('name',{ 
                 initialValue: model.name,
                 rules: [{ required: true, message: '名称不能为空' },]
               })(<Input />)
             }
             </FormItem>  
             <FormItem label="编号" {...formItemLayout} >
             {
               getFieldDecorator('code',{ 
                 initialValue: model.code,
                 rules: [{ required: true, message: '名称不能为空' },]
               })(<Input placeholder='名称-编号' />)
             }
             </FormItem> 
          </Col>

          <Col span={12}>
             <FormItem label = "排序" {...formItemLayout} >
             {
               getFieldDecorator('sort', {
                 initialValue: model.sort ? model.sort + '' : '',
                 rules: [{ required: true, message: '排序不能为空' },]
               })(
                 <Select >
                   { sortIdx }
                 </Select>
               )
             }
             </FormItem>
             <FormItem label="厂商" {...formItemLayout} >
             {
               getFieldDecorator('supplier',{ 
                 initialValue: model?model.supplier:'' || '',
                 rules: [{ required: true, message: '厂商不能为空' },]
               })(<Input />)
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
const ModelEditorForm = Form.create()(ModelEditor);
export default connect(({modelManage})=>({modelManage}))(ModelEditorForm);

