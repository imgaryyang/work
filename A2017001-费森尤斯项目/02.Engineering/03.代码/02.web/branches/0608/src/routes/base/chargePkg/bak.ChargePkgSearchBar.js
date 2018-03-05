import React, { Component, PropTypes } from 'react';
import { connect } from 'dva';
import { Form, Input, Tooltip, Icon, Cascader, Select, Row, Col, Checkbox, Button,Spin } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;

class MngMenuSearchBar extends React.Component {

	constructor(props) {
	    super(props);
	}
	
	handleSubmit(e){
		var search = this.props.onSearch;
		console.info('bar handleSubmit ',search);
		this.props.form.validateFields((err, values) => {
			if (!err && search)search(values);
		});
	}
	handleReset(){
	    this.props.form.resetFields();
	}
	render(){
		const { getFieldDecorator } = this.props.form;
		return (
			<Form inline>
				<FormItem>
					{getFieldDecorator('columnName')(
							<Input placeholder="列名称" />
					)}
				</FormItem>	 
				<FormItem>
					{getFieldDecorator('columnVal')(
						<Input placeholder="列值" />
					)}
				</FormItem>
				<FormItem>
					{getFieldDecorator('columnDis')(
						<Input placeholder="列显示" />
					)}
				</FormItem>
				<FormItem>
					<Button type="primary" onClick={this.handleSubmit.bind(this)}>查询</Button>
				</FormItem>
				<FormItem>
					<Button type="primary" onClick={this.handleReset.bind(this)}>清空</Button>
				</FormItem>
			</Form>
		);	
	}
}
const MngMenuSearchBarForm = Form.create()(MngMenuSearchBar);
export default connect()(MngMenuSearchBarForm);

