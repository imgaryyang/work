'use strict';

import { Component } from 'react';
import ReactDOM from 'react-dom';
import { Table,Button,Icon,Form,Input,Row,Col,Select,DatePicker,message,Modal } from 'antd';

const FormItem = Form.Item;
const MonthPicker = DatePicker.MonthPicker;
const Option = Select.Option;

class EditForm extends Component {
	constructor (props) {
		super(props);
		
		this.state = {
			orgId:'4028b8815562d296015562d879fc000b',
			optionEl:[],
			selSet:null,
			data:[]
		};
	}

	onSubmit(e){

		e.preventDefault();

		const scope = this;
		var data = this.props.form.getFieldsValue();
		var inData = this.props.data;

		data.id = inData.id;
		data.perId = data.person.split('-')[0];
		data.name = data.person.split('-')[1];
		data.idNo = data.person.split('-')[2];
		data.batchId = inData.batchId;
		data.batchNo = inData.batchNo;
		data.month = inData.month;
		data.templateId = inData.templateId;
		data.template = inData.template;
		//console.log('收到表单值：', data);


		let fetch = Ajax.put('api/els/stubbatchinfo/update', data, {
			catch: 3600,dataType:'json'
		});
		fetch.then(res => {
			if(res.success){
				message.success('操作成功!');
				scope.close();
				scope.refresh();
			}
			else Modal.error({title:'操作失败:'+res.msg});
		});
	}

	close(){
		if(this.props.onClose){
			this.props.onClose(arguments);
		}
	}
	refresh(){
		if(this.props.refreshList){
			this.props.refreshList();
		}
	}
	componentWillMount () {
		
		const setName = this.props.form.getFieldProps;
		let fetch = Ajax.get('api/els/permng/list/0/5000', null, {catch: 3600});
		fetch.then(res => {
			if(res.success){
				let data = res.result;

				let options = data.map((domain) => {
			        return <Option key={domain.id+'-'+domain.name+'-'+domain.idNo}>{domain.name+'-'+domain.idNo}</Option>;
			      });
					
				this.setState({ optionEl:options, selSet:setName('person',{
							initialValue:this.props.data.perId+'-'+this.props.data.name+'-'+this.props.data.idNo,
						})
				});
		    	return res;
		    }
		    else {
		    	Modal.error({title:'人员列表加载失败:'+res.msg})
		    }
		});
		fetch = Ajax.get('api/els/stubtemplate/detail/'+this.props.data.templateId, null, {catch: 3600});
		fetch.then(res => {
			if(res.success){
				let data = res.result;
				this.setState({ data:data });
		    	return res;
		    }
		    else {
		    	Modal.error({title:'工资明细模板加载失败:'+res.msg})
		    }
		});
	}

	handleChange(value){
		const setName = this.props.form.getFieldProps;
	    this.setState({ selSet:setName('person',{
				initialValue:value
			})
		});
	}

	render () {
		const formItemLayout = {
	    	labelCol: { span: 5 },
	    	wrapperCol: { span: 14 },
	    };
		const setName = this.props.form.getFieldProps;

		let stubinfoItems = this.state.data.map((domain) => {
		        return <Col span={10}><FormItem {...formItemLayout} label={domain.item} >
		        		<Input {...setName(`item${domain.seqNo}`,{initialValue:this.props.data[`item${domain.seqNo}`]})}  />
		        	</FormItem></Col>;
	      });
		
		return (
		        <Form horizontal onSubmit={this.onSubmit.bind(this)}>
					<Row gutter={16} type='flex' align='middle' justify='center' >
			        	<Col span={14}><FormItem labelCol={{ span: 7 }} wrapperCol={{ span: 12}} label="员工" required>
				        	<Select showSearch placeholder="请选择员工"
								    optionFilterProp="children"
								    notFoundContent="无法找到"
								    {...this.state.selSet} onChange={this.handleChange.bind(this)} >
				    			{this.state.optionEl}
							</Select>
			        	</FormItem></Col><Col span={10}></Col>
			        	<Col span={19} ><FormItem labelCol={{span:2}} wrapperCol={{span:20}} label="备注">
			        		<Input type='text' {...setName('note',{initialValue:this.props.data.note})}/>
			        	</FormItem></Col>
			        </Row>
			        <div style={{boder:'thin solid red'}}></div>
					<Row type='flex' align='middle' justify='center' style={{marginBottom:'3px'}} ><h3>工资明细项</h3></Row>
					<Row type='flex' align='middle' justify='center' style={{backgroundColor:'#FFFFFF'}}>
			        	{stubinfoItems}
			        </Row>
			        <FormItem style={{textAlign:'center'}}>
			        	<Button type="primary" style={{marginRight:'3px'}} htmlType="submit">修改</Button>
			        	<Button type="normal" onClick={this.close.bind(this)} >取消</Button>
			        </FormItem>
		       </Form>
		);
  }
}

const BatchinfoEdit = Form.create()(EditForm);

module.exports = BatchinfoEdit;