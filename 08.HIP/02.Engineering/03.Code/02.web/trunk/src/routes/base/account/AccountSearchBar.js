import React, { Component, PropTypes } from 'react';
import { connect } from 'dva';
import { Form, Input, Tooltip, Icon, Cascader, Select, Row, Col, Checkbox, Button,Spin } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;

class AccountSearchBar extends React.Component {

	constructor(props) {
	    super(props);
	}
	
	handleSubmit(e){
		var search = this.props.onSearch;
		console.info('bar handleSubmit ',search);
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
			<Form inline >
				<FormItem>
					{getFieldDecorator('username')(
							<Input placeholder="用户名" />
					)}
				</FormItem>	 
				<FormItem>
					{getFieldDecorator('userId')(
						<Input placeholder="用户ID" />
					)}
				</FormItem>
				<FormItem>
					<Button type="primary" onClick={this.handleSubmit.bind(this)}>查询</Button>
				</FormItem>
				<FormItem>
					<Button type="primary" onClick={ this.handleReset.bind(this)} >清空</Button>
				</FormItem>
			</Form>
		);	
	}
}
const AccountSearchBarForm = Form.create()(AccountSearchBar);
export default connect()(AccountSearchBarForm);

