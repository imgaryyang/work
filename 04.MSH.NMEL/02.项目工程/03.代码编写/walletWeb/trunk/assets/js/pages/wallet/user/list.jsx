'use strict';

import { Component } from 'react';
import ReactDOM from 'react-dom';
import { Form, Modal,Input,Select, Button,Cascader , Checkbox,Table  } from 'antd';
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
				<FormItem label="手机号">
					<Input placeholder="手机号" {...getFieldProps('mobile')} /> 
		        </FormItem>
				<FormItem label="姓名">
					<Input placeholder="姓名" {...getFieldProps('name')} />  
		        </FormItem>
				<FormItem label="性别">
					<Select style={{width:'100px'}} placeholder="性别" {...getFieldProps('gender')} >
		        	  <Select.Option value="1">男</Select.Option>
		        	  <Select.Option value="0">女</Select.Option>
		        	</Select> 
		        </FormItem>
		        <FormItem label="身份证号">
					<Input placeholder="身份证号" {...getFieldProps('idCardNo')} />  
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
			selectedRowKeys:[],
			selectedRows:[],
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
			dataIndex: 'name',
		}, {
			title: '身份证号',
			dataIndex: 'idCardNo',
		}, {
			title: '性别',
			dataIndex: 'gender',
			render(text,record,index) {
				 if('1' == text) return '男';
				 else if('0' == text) return '女';
				 else  return '';
			},
		},{
			title: '手机号码',
			dataIndex: 'mobile',
		},{
			title: '操作',
			dataIndex: 'opt',
			render(text,record,index) {
				var style={marginLeft:'3px'};
				return <a  style={style} onClick={scope.onChangePwd.bind(scope,record)}>修改密码</a>
			},
		}];
	}
	onChangePwd(data){
		var scope = this;
		/*confirm({
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
		});*/
		Modal.error({title: '暂未开通'}); 
	}
	onSearch(data){
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
		let selected = this.state.selectedRowKeys;
		let param  = JSON.stringify(selected);
		if(selected.length<1){
			Modal.error({title: '你没有选中任何数据'}); 
			return;
		}
		confirm({
		    title: '您是否确认要删除这'+selected.length+'条内容',
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
		this.state.selectedRowKeys =selectedRowKeys;
		this.state.selectedRows = selectedRows;
		//这里不用setState触发更新
	}
	onSelect(record, selected, selectedRows) {
		//console.log(record, selected, selectedRows);
	}
	onSelectAll(selected, selectedRows, changeRows) {
		//console.log(selected, selectedRows, changeRows);
	}
	refresh(){
		this.goToPage(this.state.pagination.current);
	}
	goToPage(pageNo){
		this.setState({loading:true});
		let start = (pageNo-1)*this.state.pagination.pageSize;
		let data = this.state.searchParams;
		if(data.hosLevel && data.hosLevel.length>1)data.hosLevel=data.hosLevel[1];
		let param  = JSON.stringify(data);
		let fetch = Ajax.get('/api/wallet/web/user/list/'+start+'/'+this.state.pagination.pageSize, {data:param}, {catch: 3600});
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
					<Button type="primary" onClick={this.onCreate.bind(this)} style={bStyle}>新增</Button>
			        <Button type="primary" onClick={this.onDeleteAll.bind(this)} style={bStyle}>删除</Button>
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