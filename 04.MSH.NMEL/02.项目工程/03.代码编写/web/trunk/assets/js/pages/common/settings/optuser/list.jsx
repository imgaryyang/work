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
			selData:{},
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
			title: '用户名',
			dataIndex: 'username',
		}, {
			title: '手机号',
			dataIndex: 'mobile',
		}, {
			title: '电子邮箱',
			dataIndex: 'email',
		}, {
			title: '创建时间',
			dataIndex: 'createAt',
		},{
			title: '状态',
			dataIndex: 'state',
			render(text,record,index) {
				var opts=[];
				if(record.state == '0')
					opts.push(<span>禁用</span>);
				else if(record.state == '1')
					opts.push(<span>启用</span>);
				return <div>{opts}</div>;
			},
		},{
			title: <div style={{textAlign:'center'}}>操作</div>,
			dataIndex: 'opt',
			render(text,record,index) {
				return <div style={{textAlign:'center'}}><a onClick={scope.onEditor.bind(scope,record)}>编辑</a> &nbsp;&nbsp;&nbsp;
				<a onClick={scope.onRolelist.bind(scope,record)}>角色授权</a></div>;
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
	onEditor(row){
		if(this.props.onEditor){
			this.props.onEditor(row);
		}
	}
	onRolelist(row){
		if(this.props.onRolelist){
			this.props.onRolelist(row);
		}
	}
	onDelete(){
		var scope = this;
		confirm({
		    title: '您是否确认要删除这项内容',
		    onOk() {
		    	let fetch = Ajax.del('/bdrp/org/optuser/remove/'+scope.state.selData.id, null, {catch: 3600});
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
	onResetPassword(){
		var scope = this;
		confirm({
		    title: '您是否确认要重置此用户密码',
		    onOk() {
		    	let fetch = Ajax.post('/bdrp/org/optuser/optuser/'+scope.state.selData.id, null, {catch: 3600});
				fetch.then(res => {
					if(res.success){
						Modal.success({title: '重置成功'});
						scope.refresh();
					}else{
						Modal.error({title: '重置失败'}); 
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
		this.setState({selData:record});
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
		let fetch = Ajax.get('/bdrp/org/optuser/list/'+start+'/'+this.state.pagination.pageSize,{data:param}, {catch: 3600});
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
		const scope = this;
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
				    <Button type="primary" onClick={this.onCreate.bind(this)} style={bStyle}>新增</Button>
				    <Button type="primary" onClick={this.onDelete.bind(this)} style={bStyle}>删除</Button>
				    <Button type="primary" onClick={this.onResetPassword.bind(this)} style={bStyle}>密码重置</Button>
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