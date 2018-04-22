import React, { Component, PropTypes } from 'react';
import { connect } from 'dva';
import { Form, Input, Tooltip, Icon, Cascader, Select, Row, Col, Checkbox, Button, Spin, Modal } from 'antd';
import IconSelecter from '../../../components/IconSelecter';
import styles from './Area.css';

const FormItem = Form.Item;
const Option = Select.Option;

class AreaEditor extends React.Component {
  
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
    if (this.props.area && props.area && (this.props.area.id != props.area.id))
      this.props.form.resetFields();
  }

  handleSubmit(e){
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.dispatch({
          type: 'areaManage/save',
          params: values
        });
      }
    });
  }

  selectIcon () {
    this.props.dispatch({
      type: 'areaManage/setState',
      state: {
        showIconSelecter: true
      }
    });
  }

  onIconSelected (icon) {

    let {area} = this.props.areaManage;
    let newArea = {...area, icon: icon};

    this.props.dispatch({
      type: 'areaManage/setState',
      state: {
        area: newArea,
        showIconSelecter: false
      }
    });
  }

  clearIcon () {
    this.onIconSelected("");
  }

  reset () {
    this.props.dispatch({
      type: 'areaManage/setState',
      state: {
        checkedKeys: [],
        selectedNode: {},
        area: {},
      }
    });
  }

  onCancel () {
    this.props.dispatch({
      type: 'areaManage/setState',
      state: {
        showIconSelecter: false
      }
    });
  }

  render () {
    const { getFieldDecorator } = this.props.form;
    const area = this.props.area || {};
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 16 },
    };

    let { showIconSelecter } = this.props.areaManage;

    //排序选项
    let sortIdx = null,
        sortArr = area.parent && area.parent.children ? area.parent.children : this.props.areas,
        idxForMap = [];
     for (let i = 0 ; sortArr && i < sortArr.length ; i++)
       idxForMap.push(i);
     
     if (area && !area.id)
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
          getFieldDecorator('id', { initialValue: area.id})(<Input />)
        }
        </FormItem>
         <Row>

          <Col span = {24} >
            <FormItem style = {{display: 'none'}} >
             {
               getFieldDecorator('parent', {
                 initialValue: area.parent && area.parent.id ? area['parent']['id'] : ''
               })(<Input />)
             }
            </FormItem>
            <FormItem label = "院区" labelCol = {{span: 3}} wrapperCol = {{span: 20}} >
             {
               getFieldDecorator('parentName', {
                 initialValue: area.parent && area.parent.id ? area['parent']['name']  : ''
               })(<Input disabled />)
             }
             </FormItem>
          </Col>

          <Col span={12}>
             <FormItem label="名称" {...formItemLayout} >
             {
               getFieldDecorator('name',{ 
                 initialValue: area.name,
                 rules: [{ required: true, message: '名称不能为空' },]
               })(<Input />)
             }
             </FormItem>  
             <FormItem label="编号" {...formItemLayout} >
             {
               getFieldDecorator('code',{ 
                 initialValue: area.code,
                 rules: [{ required: true, message: '名称不能为空' },]
               })(<Input placeholder='昆华医院：khyy' />)
             }
             </FormItem> 
          </Col>

          <Col span={12}>
             <FormItem label = "排序" {...formItemLayout} >
             {
               getFieldDecorator('sort', {
                 initialValue: area.sort ? area.sort + '' : '',
                 rules: [{ required: true, message: '排序不能为空' },]
               })(
                 <Select >
                   { sortIdx }
                 </Select>
               )
             }
             </FormItem>
             <FormItem label="位置" {...formItemLayout} >
             {
               getFieldDecorator('location',{ 
                 initialValue: area?area.location:'' || '',
                 rules: [{ required: true, message: '位置不能为空' },]
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
const AreaEditorForm = Form.create()(AreaEditor);
export default connect(({areaManage})=>({areaManage}))(AreaEditorForm);

