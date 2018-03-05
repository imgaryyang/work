'use strict';

import { Component } from 'react';
import ReactDOM from 'react-dom';
import { Form, Modal,Input,Select, Button,Checkbox,Table  } from 'antd';
const confirm = Modal.confirm;
const FormItem = Form.Item;
const createForm = Form.create;
/**
 * H1 - 院报
 * H2 - 特色
 * H3 - 政策信息
 * H4 - 健康指导
 * HA - 广告
 * */
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
				<FormItem label="代码">
					<Input placeholder="代码" {...getFieldProps('code')} />  
		        </FormItem>
		        <FormItem label="状态">
			        <Select style={{width:'100px'}}  placeholder="状态" {...getFieldProps('state')} >
		        	  <Select.Option value="1">正常</Select.Option>
		        	  <Select.Option value="2">已下线</Select.Option>
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
			title: '标题',
			dataIndex: 'caption',
		}, {
			title: '创建时间',
			dataIndex: 'createdAt',
		}, {
			title: '更新时间',
			dataIndex: 'updatedAt',
		}, {
			title: '供稿人',
			dataIndex: 'feededBy'
		},{
			title: '状态',
			dataIndex: 'state',
			render(text,record,index) {
				var opts=[],style={marginLeft:'3px'};
				if(record.state == '1')opts.push(<a  style={style} onClick={scope.offLine.bind(scope,record)}>下线</a>);
				else opts.push(<a  style={style} onClick={scope.upLine.bind(scope,record)}>上线</a>);
				return <div>{opts}</div>;
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
	onEdit(row){
		if(this.props.onEdit){
			this.props.onEdit(row);
		}
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
	upLine(data){
		this.upOrOff("/api/el/base/news/org/upLine/"+data.id,"1","上线");
	}
	offLine(data){
		this.upOrOff("/api/el/base/news/org/offLine/"+data.id,"0","下线");
	}
	upOrOff(url,state,text){
		var scope = this;
		confirm({
		    title: '您确认要此记录'+text+'吗？',
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
		    	let fetch = Ajax.del('api/el/base/news/org/'+data.id, null, {catch: 3600});
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
		    	let fetch = Ajax.del('api/el/base/news/'+selected[0], null, {catch: 3600});
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
		if(this.props.config)data.fkType = this.props.config.fkType;
		console.info(this.props.config);
		let param  = JSON.stringify(data);
		let fetch = Ajax.get('api/el/base/news/org/list/'+start+'/'+this.state.pagination.pageSize, {data:param}, {catch: 3600});
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
			type:'radio',
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