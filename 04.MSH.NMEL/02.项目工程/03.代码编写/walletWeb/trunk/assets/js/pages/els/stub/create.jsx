'use strict';

import { Component } from 'react';
import ReactDOM from 'react-dom';
import { Table,Button,Icon,Form,Input,Row,Col,Select,DatePicker,Message } from 'antd';

const FormItem = Form.Item;
const MonthPicker = DatePicker.MonthPicker;
const Option = Select.Option;

class CreateForm extends Component {
	constructor (props) {
		super(props);
		var myDate = new Date();
		var year = myDate.getFullYear();
		var month = myDate.getMonth()+1;
		if(month<10) month = '-0'+month;
		this.state = {
			month:year+month,
			orgId:'4028b8815562d296015562d879fc000b',
			select :<Select />,
			optionEl:[],
			selSet:null
		};
	}

	onSubmit(e){
		e.preventDefault();

		var data = this.props.form.getFieldsValue();
		console.log('收到表单值：', data);
		var postData = new Object();
		postData.orgId = this.state.orgId;
		postData.month = data.month.substring(0,4)+data.month.substring(5,7);
		postData.note = data.note;
		postData.templateId = data.template.split('-')[0];
		postData.template = data.template.split('-')[1];

		let fetch = Ajax.post('api/els/stubbatch/create', postData, {
			catch: 3600,dataType:'json'
		});
		fetch.then(res => {
			if(res.success){
				Message.success('操作成功!');
				if(this.props.onSubmit)
					this.props.onSubmit(res.result);
			}
			else Message.error(res.msg,3);
		});
	}

	componentWillMount () {
		const setName = this.props.form.getFieldProps;
		let fetch = Ajax.get('api/els/stubtemplate/list/0/100?orgId='+this.state.orgId, null, {catch: 3600});
		fetch.then(res => {
			if(res.success){
				let data = res.result;

				let options = data.map((domain) => {
			        return <Option key={domain.id+'-'+domain.template}>{domain.template}</Option>;
			      });
					
				this.setState({ optionEl:options, selSet:setName('template',{
							initialValue:data[0].id+'-'+data[0].template,
						})
				});
		    	return res;
		    }
		});
	}

	handleChange(value){
		const setName = this.props.form.getFieldProps;
	    this.setState({ selSet:setName('template',{
				initialValue:value
			})
		});
	}

	render () {
		const formItemLayout = {
	    	labelCol: { span: 5 },
	    	wrapperCol: { span: 18 },
	    };
		const setName = this.props.form.getFieldProps;

		return (
			<Row>
				<Col span={10} offset={6}>
			        <Form horizontal onSubmit={this.onSubmit.bind(this)}>
			        	<FormItem {...formItemLayout} label="年月" required>
							<MonthPicker format='yyyy-MM' {...setName('month',{initialValue:this.state.month,
								getValueFromEvent:(date, dateString) => dateString
							})}/>
			        	</FormItem>
			        	<FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 14}} label="模板" required>
				        	<Select {...this.state.selSet} onChange={this.handleChange.bind(this)} >
				    			{this.state.optionEl}
							</Select>
			        	</FormItem>
			        	<FormItem {...formItemLayout} label="备注">
			        		<Input type='textarea' {...setName('note',{initialValue:''})}/>
			        	</FormItem>
				        <FormItem style={{textAlign:'center'}}>
				        	<Button type="primary" htmlType="submit">下一步</Button>
				        </FormItem>
			       </Form>
				</Col>
	       </Row>);
  }
}

const BatchCreate = Form.create()(CreateForm);

module.exports = BatchCreate;