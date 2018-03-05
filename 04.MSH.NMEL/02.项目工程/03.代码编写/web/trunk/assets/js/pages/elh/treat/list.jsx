'use strict';

import { Component } from 'react';
import ReactDOM from 'react-dom';
import { Form, Modal,Input,Button,Checkbox,Table,Select,Radio  } from 'antd';
const confirm = Modal.confirm;
const FormItem = Form.Item;
const createForm = Form.create;
const RadioGroup = Radio.Group;
class SearchForm extends Component{
	constructor (props) {
		super(props);
	}
	onReset(e){
		e.preventDefault();
	    this.props.form.resetFields();
	}
	onSubmit(e){
		e.preventDefault();
	    this.props.form.validateFields((errors, values) => {
	      if (!!errors) {
	    	  Modal.error({title: '查询条件不允许'});
	        return;
	      }
	      if(this.props.onSearch){
	    	  this.props.onSearch(values);
	      }
	    });
	}
	getInitialState() {
	    return {
	      value: 1,
	    };
	  }
	 onChange(d) {
		    console.log('radio checked', d.target.value);
		    this.setState({
		      value: d.target.value,
		    });
		  }
	 
	render () {
		const { getFieldProps } = this.props.form;
		return (
			<Form inline className="table-top-form">
				<FormItem label="姓名">
					<Input placeholder="请输入姓名" {...getFieldProps('username')} /> 
		        </FormItem>
				
				<RadioGroup onChange={this.onChange} defaultValue={1} >
					<Radio key="man" value={1}>男</Radio>
					<Radio key="woman" value={2}>女</Radio>
				</RadioGroup>
					<FormItem label="卡号">
					<Input placeholder="请输入卡号" {...getFieldProps('siId')} /> 
				</FormItem>
				<FormItem label="手机号">
					<Input placeholder="请输入手机号" {...getFieldProps('mobile')} /> 
				</FormItem>
		        <FormItem >
		        	<Button type="primary" onClick={this.onSubmit.bind(this)} htmlType="submit">查询</Button>&nbsp;&nbsp;&nbsp;
		        	<Button type="ghost" onClick={this.onReset.bind(this)}>重置</Button>
		        </FormItem>
		    </Form>
		);
	}
}
const SearchBar = createForm()(SearchForm);

class List extends Component {
	constructor (props) {
		super(props);
		const scope = this;
		this.state = {
			searchParams:{},
			pagination : {
				current:0,                                        //当前页数	Number	无
				total:0,                                          //数据总数	Number	0
				pageSize:3,                                       //每页条数	Number	
				onChange:scope.pageChange.bind(scope),            //页码改变的回调，参数是改变后的页码	Function	noop
				showSizeChanger:true,                             //是否可以改变 pageSize	Boolfalse
				pageSizeOptions	: ['3', '4', '5', '6'],       //指定每页可以显示多少条	Array	
				onShowSizeChange:scope.pageSizeChange.bind(scope),//pageSize 变化的回调	Function	noop
				showQuickJumper:true                              //是否可以快速跳转至某页Bool	false
			},
	        loading : false
		};
		this.version= props.version;
	}
	componentWillMount () {
		this.goToPage(1);
	}
	componentDidUpdate(){
		if(this.version != this.props.version){
			 this.version = this.props.version;
			 this.refresh();
		}
	}
	getColumn (){
		const scope = this;
		
		return [{
			title: '姓名',
			dataIndex: 'name',//photo
			render(text,record,index) {
				return text;
			},
		}, {
			title: '性别',
			dataIndex: 'gender',
			render(text,record,index) {
				return ("1"==text)? '男':'女';
			},
		},{
			title: '手机号',
			dataIndex: 'mobile',
		},{
			title: '地址',
			dataIndex: 'address',
		},{
			title: '操作',
			dataIndex: 'opt',
			render(text,record,index) {
				return <a onClick={scope.onView.bind(scope,record)}>查看</a>;
			},
		}];
	}
	onSearch(data){
		console.info('onSearch',data);
		this.state.searchParams = data;
		this.refresh();
	}
	onView(row){
		if(this.props.onView){
			this.props.onView(row);
		}
	}
	onSelectChange(selectedRowKeys, selectedRows) {
	}
	refresh(){
		this.goToPage(this.state.pagination.current);
	}
	goToPage(pageNo){
		let start = (pageNo-1)*this.state.pagination.pageSize;
		//this.state.searchParams.appId="123";
		let param  = JSON.stringify(this.state.searchParams);
		let fetch = Ajax.get('api/elh/patient/org/list/'+start+'/'+this.state.pagination.pageSize+'?data='+param, null, {catch: 3600});
		fetch.then(res => {
			let data = res.result,total=res.total,start=res.start;
			let pagination = this.state.pagination;
			pagination.current=pageNo,pagination.total = total;
			this.setState({ pagination: pagination,data:data});
	    	return res;
		});
	}
	pageChange(pageNo){
		this.goToPage(pageNo);
	}
	pageSizeChange(page,pageSize){
		let pagination = this.state.pagination;
		pagination.pageSize=pageSize;
		this.setState({ pagination: pagination});
		this.refresh()
	}
	render () {
		let bStyle={marginRight:'3px'};
		const rowSelection = {
			onChange:this.onSelectChange.bind(this)
		}
		return (
			<div style={{ minHeight:'500px'}}>
				<SearchBar onSearch={this.onSearch.bind(this)}/>
				<div style={{backgroundColor: "#dee4e6"}}>
			        <Button type="primary" onClick={this.onRegister.bind(this)} style={bStyle}>挂号</Button>
			    </div>	
				<Table 
		        	columns={this.getColumn()} 
			        rowKey={record => record.id}
			        dataSource={this.state.data}
			        pagination={this.state.pagination}
			        loading={this.state.loading}
		        	dataSource={this.state.data}/>
	    	</div>
		);
	}
	viewTreatments(){
		if(this.props.viewTreatments){
			this.props.viewTreatments();
		}
	}
	onRegister(){
		if(this.props.onRegister){
			this.props.onRegister();
		}
	}
}
module.exports = List;

// onChange={this.handleTableChange}