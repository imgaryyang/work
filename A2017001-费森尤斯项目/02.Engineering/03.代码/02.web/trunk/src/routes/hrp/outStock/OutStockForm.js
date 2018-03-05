import React, { Component } from 'react';
import { connect } from 'dva';
import { Button, Row, Select, Form, notification } from 'antd';

const Option = Select.Option;
const FormItem = Form.Item;

class SelectForm extends Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleTypeChange = this.handleTypeChange.bind(this);
    this.handleDeptChange = this.handleDeptChange.bind(this);
    this.filterUser = this.filterUser.bind(this);
  }

  handleSubmit() {
    this.props.form.validateFields((err, values) => {
      if (!values.outType) {
        notification.info({
          message: '提示',
          description: '请选择出库类型！',
        });
        //        Modal.error({
        //          title: '错误',
        //          content: '请选择出库类型！',
        //        });
        return;
      }
      console.log(values.outType);
      if (values.outType !== 'O3' && values.outType !== 'O5' && !values.toDept) {
        notification.info({
          message: '提示',
          description: '请选择目标科室！',
        });
        //        Modal.error({
        //          title: '错误',
        //          content: '请选择目标科室！',
        //        });
        return;
      }
      if (!err) {
        this.props.dispatch({
          type: 'hrpOutputStock/saveOutStockInfo',
          value: values,
        });
      }
    });
  }

  handleTypeChange(value) {
  }

  handleDeptChange(value) {
    this.props.dispatch({
      type: 'hrpOutputStock/loadUserByDept',
      deptId: { deptId: value },
    });
  }

  filterUser(input, options) {
    return options.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
  }

  render() {
    const { typeData, deptData, userData } = this.props.hrpOutputStock;
    const { getFieldDecorator } = this.props.form;

    //    const typeOptions = typeData?typeData.map(type => <Option key={type.columnKey}>{type.columnVal}</Option>):'';
    const defaultType = typeData.length > 0 ? typeData[0].columnVal : '';
    const typeOptions = typeData.map(type => <Option key={type.columnKey}>{type.columnVal}</Option>);

    // 目标科室
    console.log(deptData);
    const deptOptions = deptData.map(dept => <Option key={dept.id}>{dept.deptName}</Option>);

    // 领送人
    const userOptions = userData ? userData.map(user => <Option key={user.id}>{user.userName}</Option>) : null;

    return (
      <Form inline style={{ paddingBottom: '5px' }} >
        <Row type="flex" justify="start">
          <FormItem>
            {getFieldDecorator('outType')(<Select
              style={{ width: 120, marginRight: 5 }}
              placeholder="出库类型"
              onChange={this.handleTypeChange}
              allowClear="true"
            >
              {typeOptions}
            </Select>)}
          </FormItem>
          <FormItem>
            {getFieldDecorator('toDept')(<Select
              placeholder="目标科室"
              style={{ width: 120, marginRight: 5 }}
              onChange={value => this.handleDeptChange(value)}
              allowClear="true"
            >
              {deptOptions}
            </Select>)}
          </FormItem>
          <FormItem>
            {getFieldDecorator('outUser')(<Select
              placeholder="领送人"
              style={{ width: 120, marginRight: 5 }}
              allowClear
              showSearch
              filterOption={(input, option) => this.filterUser(input, option)}
            >
              {userOptions}
            </Select>)}
          </FormItem>
          <FormItem>
            {getFieldDecorator('outType')(<Button type="primary" size="large" onClick={() => this.handleSubmit()} icon="upload" >出库</Button>)}
          </FormItem>
        </Row>
      </Form>
    );
  }
}
const OutStockForm = Form.create()(SelectForm);
export default connect(({ hrpOutputStock }) => ({ hrpOutputStock }))(OutStockForm);
