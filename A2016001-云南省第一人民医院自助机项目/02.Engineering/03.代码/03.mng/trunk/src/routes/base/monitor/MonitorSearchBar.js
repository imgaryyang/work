import React, { Component, PropTypes } from 'react';
import { connect } from 'dva';
import { Form, Input, Tooltip, Icon, Cascader, Select, Row, Col, Checkbox, Button, Spin } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;

class MonitorSearchBar extends React.Component {

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
				{getFieldDecorator('code')(
						( <Select tabIndex={1} style={{width:'100px'}} placeholder="选择银行" mode="combobox" >
		 		    	<Option value={"0308"}>招商银行</Option>
		 		    	<Option value={"0306"}>广发银行</Option>
		 		    	<Option value={"0103"}>农业银行</Option>
		 		    	<Option value={"0301"}>交通银行</Option>
		 	      </Select>)
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
const MonitorSearchBarForm = Form.create()(MonitorSearchBar);
export default connect()(MonitorSearchBarForm);

