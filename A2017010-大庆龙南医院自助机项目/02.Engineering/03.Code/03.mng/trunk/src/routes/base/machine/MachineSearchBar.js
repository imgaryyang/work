import React, { Component, PropTypes } from 'react';
import { connect } from 'dva';
import { Form, Input, Tooltip, Icon, Cascader, Select, Row, Col, Checkbox, Button, Spin } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;

class MachineSearchBar extends React.Component {

	constructor(props) {
	    super(props);
	}
	
	handleSubmit(e){
		var search = this.props.onSearch;
		//console.info('bar handleSubmit ',search);
		this.props.form.validateFields((err, values) => {
			if (!err && search){
				search(values);
			}
		});
	}
	
	handleReset(){
	    this.props.form.resetFields();
	}
	
	render(){
		const { getFieldDecorator } = this.props.form;
		return (
			<Form inline onSubmit={this.handleSubmit.bind(this)}>
				<FormItem>
					{getFieldDecorator('name')(
						<Input placeholder="中文名" />
					)}
				</FormItem>
				<FormItem>
				{getFieldDecorator('enName')(
						<Input placeholder="英文名" />
					)}
				</FormItem>	 
				<FormItem>
					{getFieldDecorator('idNo')(
						<Input placeholder="身份证号" />
					)}
				</FormItem>
				<FormItem>
					{getFieldDecorator('mobile')(
						<Input placeholder="手机" />
					)}
				</FormItem>
				<FormItem>
					<Button type="primary" htmlType="submit">查询</Button>
				</FormItem>
				<FormItem>
					<Button type="primary" onClick={ this.handleReset.bind(this) }>清空</Button>
				</FormItem>
			</Form>
		);	
	}
}
const MachineSearchBarForm = Form.create()(MachineSearchBar);
export default connect()(MachineSearchBarForm);

