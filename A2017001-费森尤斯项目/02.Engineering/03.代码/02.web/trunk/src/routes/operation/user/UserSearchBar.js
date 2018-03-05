import React, { Component } from 'react';

import { connect } from 'dva';
import { Form, Input, Button, Select } from 'antd';

import DeptSelect from '../../../components/DeptSelect';

const FormItem = Form.Item;

class UserSearchBar extends Component {

  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleReset = this.handleReset.bind(this);

    this.handleHosChange = this.handleHosChange.bind(this);
  }

  handleSubmit() {
    const search = this.props.onSearch;
    // console.info('bar handleSubmit ',search);
    this.props.form.validateFields((err, values) => {
      console.log('1-');
      if (!err && search) {
        search(values);
      }
    });
  }

  handleReset() {
    this.props.form.resetFields();
  }

  handleHosChange(value) {
    console.log('value: ',value);

    // 清除科室
    this.props.form.setFieldsValue({
      deptId: '',
    });

    if(value != null){
      // 查询科室列表数据
      this.props.dispatch({
        type: 'user4Opt/loadDptListData',

        payload: {
          query: {hosId: value},
        }
      });
    }
  }

  render() {
    
    //console.log('state-' + this.state);
    const { getFieldDecorator } = this.props.form;
    
    const { hosListData } = this.props.user4Opt;
    const { dptListData } = this.props.user4Opt;

    const hosOptios = hosListData.map((elm, index) =>
      <Option key={elm.hosId} value={elm.hosId}>
        {elm.hosName}
      </Option>
    );

    const dptOptios = dptListData.map((elm, index) =>
      <Option key={elm.deptId} value={elm.deptId}>
        {elm.deptName}
      </Option>
    );

    return (
      <Form inline>
        <FormItem>
          {getFieldDecorator('hosId')(
            <Select placeholder="所属医院" style={{ width: '126px' }} allowClear onSelect={(value)=>this.handleHosChange(value)}>
            {hosOptios}
            </Select>
            ,
          )}
        </FormItem>
        <FormItem>
          {
            getFieldDecorator('deptId')(
              <Select placeholder="所属科室" style={{ width: '126px' }} allowClear>
            {dptOptios}
            </Select>
            ,
            )
          }
        </FormItem>
        <FormItem>
          {getFieldDecorator('name')(
            <Input placeholder="中文名" />,
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('idNo')(
            <Input placeholder="身份证号" />,
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('mobile')(
            <Input placeholder="手机" />,
          )}
        </FormItem>
        <FormItem>
          <Button type="primary" onClick={this.handleSubmit} size="large" icon="search" >查询</Button>
        </FormItem>
        <FormItem>
          <Button onClick={this.handleReset.bind(this)} size="large" icon="reload" style={{ width: '100%' }} >清空</Button>
        </FormItem>
      </Form>
    );
  }
}
const UserSearchBarForm = Form.create()(UserSearchBar);
export default connect(({ user4Opt }) => ({ user4Opt }))(UserSearchBarForm);

