import React, { Component } from 'react';
import { connect } from 'dva';
import { Form, Input, Select, Button } from 'antd';

import MachineSelect 		from '../../../../components/MachineSelect';

const FormItem = Form.Item;

class InMaterialDetailSearchBar extends Component {

  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleReset = this.handleReset.bind(this);
  }

  handleSubmit() {
    const search = this.props.onSearch;
    this.props.form.validateFields((err, values) => {
      if (!err && search) {
        search(values);
      }
    });
  }

  handleReset() {
    this.props.form.resetFields();
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { materials } = this.props.inMaterialDetail;
    const options = materials.map(d => <Option key={d.id}>{d.name}</Option>);
    return (
      <Form inline onSubmit={this.handleSubmit.bind(this)}>
      	<FormItem>
      	{getFieldDecorator('material.id')(
      			<Select style={{width:'150px'}} placeholder="材料" >
      				{options}
    	  		</Select>
      	)}
      	</FormItem>	
        <FormItem>
          <Button type="primary" htmlType="submit" size="large" icon="search" >查询</Button>
        </FormItem>
        <FormItem>
          <Button onClick={this.handleReset.bind(this)} size="large" icon="reload" >清空</Button>
        </FormItem>
      </Form>
    );
  }
}
const MaterialDetailSearchBarForm = Form.create()(InMaterialDetailSearchBar);
export default connect(({ machine, inMaterialDetail }) => ({ machine, inMaterialDetail }))(MaterialDetailSearchBarForm); 

