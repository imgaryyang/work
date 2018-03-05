import React, { Component } from 'react';
import { connect } from 'dva';
import { Table, Button, Icon, Row, Col, Popconfirm, Select, Tooltip, Spin, Form,Input, notification } from 'antd';
import CommonTable from '../../../components/CommonTable';
import SearchBar from './NameSearchBar';
import AsyncTreeCascader from '../../../components/AsyncTreeCascader';

const Option = Select.Option;
const FormItem = Form.Item;

class SelectForm extends Component {

  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleTypeChange = this.handleTypeChange.bind(this);
    this.handleDeptChange = this.handleDeptChange.bind(this);
    this.filterUser = this.filterUser.bind(this);
    this.commChangeEvent = this.commChangeEvent.bind(this);
  }

  handleSubmit() {
    this.props.form.validateFields((err, values) => {
      if (!values.outType) {
        notification.info({
          message: '提示',
          description: '请选择出库类型！',
        });
        return;
      }
      if (values.outType !== 'O3' && values.outType !== 'O5' && !values.toDept) {
        notification.info({
          message: '提示',
          description: '请选择目标科室！',
        });
        return;
      }
//      if( !values.outUser ){
//        notification.error({
//            title: '提示',
//            content: '请选择领送人！',
//         });
//        return;
//      }
      // console.info('handleSubmit', err, values);
      if (!err) {
        this.props.dispatch({
          type: 'outStock/saveOutStockInfo',
          value: values,
        });
      }
    });
  }

  handleTypeChange(value) {
  }

  handleDeptChange(value) {
    this.props.dispatch({
      type: 'outStock/loadUserByDept',
      deptId: { deptId: value },
    });
  }

  filterUser(input, options) {
    return options.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
  }

  commChangeEvent(value) {
    //console.log('commChangeEvent->value:',value);
    var val =  this.props.form.getFieldValue('comm');
    console.log('commChangeEvent->value:',val);
    this.props.dispatch({
        type: 'outStock/setState',
        payload: {
          outStockMainFormData: {comm:val}
        },
      });
  }
  
  render() {
    const { typeData, deptData, userData } = this.props.outStock;
    const { getFieldDecorator } = this.props.form;

//    const typeOptions = typeData?typeData.map(type => <Option key={type.columnKey}>{type.columnVal}</Option>):'';
    const defaultType = typeData.length > 0 ? typeData[0].columnVal : '';
    const typeOptions = typeData.map(type => <Option key={type.columnKey}>{type.columnVal}</Option>);

    // 目标科室
    const deptOptions = deptData.map(dept => <Option key={dept.id}>{dept.deptName}</Option>);

    // 领送人
//    const defaultUser = userData?{defaultValue: userData[0].userName}:{};
//    console.info("=====", defaultUser);
    const userOptions = userData ? userData.map(user => <Option key={user.id}>{user.userName}</Option>) : null;

    const { dataOutStock } = this.props.outStock;

    let totalMoney = 0.00;
    if (dataOutStock && dataOutStock.length > 0) {
      for (const i of dataOutStock) {
        i.saleCost = i.outSum * i.salePrice;
        totalMoney += i.saleCost;
      }
    }
    
    return (
      <Form inline style={{ paddingBottom: '5px' }} >
        <Row type="flex" justify="start">
          <FormItem>
            {getFieldDecorator('outType')(
              <Select
                style={{ width: 120, marginRight: 5 }}
                placeholder="出库类型" onChange={this.handleTypeChange}
                allowClear={true}
              >
                {typeOptions}
              </Select>,
            )}
          </FormItem>
          <FormItem>
            {getFieldDecorator('toDept')(
              <Select
                placeholder="目标科室" style={{ width: 120, marginRight: 5 }}
                onChange={value => this.handleDeptChange(value)} allowClear={true}
              >
                {deptOptions}
              </Select>,
            )}
          </FormItem>
          <FormItem>
            {getFieldDecorator('outUser')(
              <Select
                placeholder="领送人" style={{ width: 120, marginRight: 5 }} allowClear={true}
                showSearch filterOption={(input, option) => this.filterUser(input, option)}
              >
                {userOptions}
              </Select>,
            )}
          </FormItem>
          <FormItem>
          {getFieldDecorator('comm')(
          <Input placeholder="备注" onBlur={this.commChangeEvent} style={{width: 160, marginRight: 5}} />
          )}
          </FormItem>
          <div style={{ lineHeight: '32px' }}>总金额：{totalMoney.formatMoney()}</div>&nbsp;&nbsp;&nbsp;&nbsp;
          <FormItem>
            {getFieldDecorator('outType')(
              <Button type="primary" size="large" onClick={() => this.handleSubmit()} icon="upload" >出库</Button>,
            )}
          </FormItem>
        </Row>
      </Form>
    );
  }
}
const OutStockForm = Form.create()(SelectForm);
export default connect(({ outStock }) => ({ outStock }))(OutStockForm);
