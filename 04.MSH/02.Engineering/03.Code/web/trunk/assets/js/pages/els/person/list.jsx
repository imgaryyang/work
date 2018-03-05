'use strict';

import { Component } from 'react';
import ReactDOM from 'react-dom';
import { Form, Modal,Input, Button, Checkbox,Table,Row,Col  } from 'antd';
const confirm = Modal.confirm;
const FormItem = Form.Item;
const createForm = Form.create;
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
	render () {
		const { getFieldProps } = this.props.form;
		return (
			<Form inline className="table-top-form">
				<FormItem label="姓名">
					<Input placeholder="请输入姓名" {...getFieldProps('name')} /> 
		        </FormItem>
				<FormItem label="身份证号">
					<Input  placeholder="请输入身份证号" {...getFieldProps('idNo')} /> 
		        </FormItem>
		        <FormItem label="卡号">
					<Input  placeholder="请输入卡号" {...getFieldProps('acctNo')} /> 
		        </FormItem>
		        <FormItem label="部门">
					<Input  placeholder="请输入部门" {...getFieldProps('department')} /> 
		        </FormItem>
		        <FormItem label="手机号">
					<Input  placeholder="请输入手机号" {...getFieldProps('mobile')} /> 
		        </FormItem>
		        <FormItem >
		        	<Button type="primary" onClick={this.onSubmit.bind(this)} htmlType="submit">查询</Button>&nbsp;&nbsp;&nbsp;
		       
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
				total:0, 
				showTotal:scope.showTheTotal.bind(scope),                                        //数据总数	Number	0
				pageSize:10,                                       //每页条数	Number	
				onChange:scope.pageChange.bind(scope),            //页码改变的回调，参数是改变后的页码	Function	noop
				showSizeChanger:true,                             //是否可以改变 pageSize	Boolfalse
				pageSizeOptions	: ['5', '10', '20'],       //指定每页可以显示多少条	Array	
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
			dataIndex: 'name',
			
		}, {
			title: '身份证号',
			dataIndex: 'idNo',
		}, {
			title: '卡号',
			dataIndex: 'acctNo',
		}, {
			title: '部门',
			dataIndex: 'department',
		}, {
			title: '手机号',
			dataIndex: 'mobile',
		},{
			title: '操作',
			dataIndex: 'opt',
			render(text,record,index) {
				return <a onClick={scope.onView.bind(scope,record)}>编辑</a>;
			},
		}];
	}
	onSearch(data){
		console.info('onSearch',data);
		this.state.searchParams = data;
		this.refresh();
	}
	onCreate(){
		if(this.props.onCreate){
			this.props.onCreate(arguments);
		}
	}
	onView(row){
		if(this.props.onView){
			this.props.onView(row);
		}
	}
	onPutOut(){
		if(this.props.onPutOut){
			this.props.onPutOut(arguments);
		}
		window.location.href="api/els/permng/export" + "?data={'orgId':'4028b8815562d296015562d879fc000b'}";
	}
	onPutIn(){
		if(this.props.onPutIn){
			this.props.onPutIn(arguments);
		}
	}
	onPutDemo(){
		if(this.props.onPutDemo){
			this.props.onPutDemo(arguments);
		}
		window.location.href="api/els/permng/exporttemplate";
	}	
	onDelete(data){
		var scope = this;
		confirm({
		    title: '您是否确认要删除这项内容',
		    onOk() {
		    	let fetch = Ajax.del('api/elh/hospital/mng/'+data.id, null, {catch: 3600});
				fetch.then(res => {
					if(res.success){
						Modal.success({title: '删除成功'});
						scope.refresh();
					}else{
						Modal.error({title: '删除成功'}); 
					}
			    	return res;
				});
		    },
		    onCancel() {},
		});
	}
	onDeleteAll(data){
		var scope = this;
		confirm({
		    title: '您是否确认要删除这些内容',
		    onOk() {
		    	let fetch = Ajax.del('api/elh/hospital/mng/'+data.id, null, {catch: 3600});
				fetch.then(res => {
					if(res.success){
						Modal.success({title: '删除成功'});
						scope.refresh();
					}else{
						Modal.error({title: '删除成功'}); 
					}
			    	return res;
				});
		    },
		    onCancel() {},
		});
	}
	onSelectChange(selectedRowKeys, selectedRows) {
	}
	onSelect(record, selected, selectedRows) {
		console.log(record, selected, selectedRows);
	}
	onSelectAll(selected, selectedRows, changeRows) {
		console.log(selected, selectedRows, changeRows);
	}
	refresh(){
		this.goToPage(this.state.pagination.current);
	}
	goToPage(pageNo){
		this.setState({loading:true});
		let start = (pageNo-1)*this.state.pagination.pageSize;
		let data = this.state.searchParams;
		let param  = JSON.stringify(data);
		let fetch = Ajax.get('api/els/permng/list/'+start+'/'+this.state.pagination.pageSize,{data:param}, {catch: 3600});
		fetch.then(res => {
			let data = res.result,total=res.total,start=res.start;
			let pagination = this.state.pagination;
			pagination.current=pageNo,pagination.total = total;
			this.setState({ pagination: pagination,data:data,loading:false});
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
	showTheTotal(page,total){
		let pagination = this.state.pagination;
		let totalshow = this.state.pagination.total;
		return `共 ${totalshow} 条`;
		
	}
	render () {
		let bStyle={marginRight:'3px'};
		const rowSelection = {
			onChange:this.onSelectChange.bind(this),
			onSelect:this.onSelect.bind(this),
			onSelectAll:this.onSelectAll.bind(this)
		}
		return (
			<div style={{ minHeight:'500px'}}>
				<SearchBar onSearch={this.onSearch.bind(this)}/>
				<div style={{backgroundColor: "#dee4e6"}}>
				
        		<div style = {{backgroundColor: "#dee4e6"}}>
	        		<Button type="primary" onClick={this.onPutOut.bind(this)}style={bStyle}>导出Excel</Button>
					<Button type="primary" onClick={this.onPutIn.bind(this)}style={bStyle}>人员文件导入</Button>
					<Button type="primary" onClick={this.onPutDemo.bind(this)}style={bStyle}>下载导入模板</Button>
				    <Button type="primary" onClick={this.onCreate.bind(this)} style={bStyle}>新增</Button>
				</div>
				
				</div>	
		        <Table 
		        	rowSelection={rowSelection} 
		        	columns={this.getColumn()} 
			        rowKey={record => record.id}
			        dataSource={this.state.data}
			        pagination={this.state.pagination}
			        loading={this.state.loading}
		        	dataSource={this.state.data}/>
	    	</div>
		);
	}
}
module.exports = List;

// onChange={this.handleTableChange}