import React, { Component, PropTypes } from 'react';
import { connect } from 'dva';
import { Form, Input, Tooltip, Icon, Cascader, Select, Row, Col, Checkbox, Button, Spin, DatePicker } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;

class LoggerSearchBar extends React.Component {

	constructor(props) {
	    super(props);
	}
	
	handleSubmit(e){
		var search = this.props.onSearch;
		this.props.form.validateFields((err, values) => {
			if (!err && search){
				const newValues = {...values};
		    	  if(newValues.createDay){
		    		  newValues.createDay = newValues.createDay.format('YYYY-MM-DD');
		    	  }
				search(newValues);
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
		        {getFieldDecorator('createDay')(
		        		<DatePicker format={'YYYY-MM-DD'} placeholder="时间" />,
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
const LoggerSearchBarForm = Form.create()(LoggerSearchBar);
export default connect()(LoggerSearchBarForm);

