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
				<FormItem label="名称">
					<Input placeholder="名称" {...getFieldProps('name')} /> 
		        </FormItem>
				<FormItem label="编码">
					<Input placeholder="编码" {...getFieldProps('code')} />  
		        </FormItem>
				<FormItem label="科室类型">
					<Input placeholder="科室类型" {...getFieldProps('type')} />  
		        </FormItem>
				<FormItem label="">
					<Select style={{width:'100px'}} placeholder="" {...getFieldProps('isSpecial',{initialValue:'ALL'})} >
					  <Select.Option value="ALL">全部</Select.Option>
		        	  <Select.Option value="1">特色科室</Select.Option>
		        	  <Select.Option value="0">普通科室</Select.Option>
		        	</Select> 
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
			title: '名称',
			dataIndex: 'name',
			render(text,record,index) {
				return <a onClick={scope.onView.bind(scope,record)}>{text}</a>;
			},
		}, {
			title: '机构代码',
			dataIndex: 'code',
		}, {
			title: '科室类型',
			dataIndex: 'type'
		},{
			title: '地址',
			dataIndex: 'address',
		},{
			title: '特色科室',
			dataIndex: 'isSpecial',
			render(text,record,index) {
				return (record.isSpecial)?"特色":"普通";
			},
		},{
			title: '操作',
			dataIndex: 'opt',
			render(text,record,index) {
				var opts=[],style={marginLeft:'3px'};
				opts.push(<a  style={style} onClick={scope.onEdit.bind(scope,record)}>编辑</a>);
				opts.push(<a  style={style} onClick={scope.onDelete.bind(scope,record)}>删除</a>);
				return <div>{opts}</div>;
			},
		}];
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
	onEdit(row){
		if(this.props.onEdit){
			this.props.onEdit(row);
		}
	}
	upLine(data){
		this.upOrOff("api/elh/department/upLine/"+data.id,"1","上线");
	}
	offLine(data){
		this.upOrOff("api/elh/department/offLine/"+data.id,"0","下线");
	}
	upOrOff(url,state,text){
		var scope = this;
		confirm({
		    title: '您确认要将医院'+text+'吗？',
		    onOk() {
		    	let fetch = Ajax.put(url, null, {catch: 3600});
				fetch.then(res => { 
					if(res.success){
						Modal.success({title: text+'成功'});
						scope.refresh();
					}else{
						let msg = res.msg?res.msg:"";
						Modal.error({title: text+'失败,'+msg}); 
					}
			    	return res;
				});
		    },
		    onCancel() {},
		});
	}
	onDelete(data){
		var scope = this;
		confirm({
		    title: '您是否确认要删除这项内容',
		    onOk() {
		    	let fetch = Ajax.del('api/elh/department/'+data.id, null, {catch: 3600});
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
		    	let fetch = Ajax.del('api/elh/department/'+data.id, null, {catch: 3600});
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
		if(data.isSpecial=='ALL')delete data.isSpecial;
		else if(data.isSpecial=='1')data.isSpecial = true;
		else if(data.isSpecial=='ALL')data.isSpecial = false;
		
		let param  = JSON.stringify(data);
		let fetch = Ajax.get('api/elh/department/list/'+start+'/'+this.state.pagination.pageSize, {data:param}, {catch: 3600});
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