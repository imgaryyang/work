'use strict';

import { Component } from 'react';
import ReactDOM from 'react-dom';
import { Form, Modal,Input, Button, Checkbox,Table,Row,Col  } from 'antd';
const confirm = Modal.confirm;
const FormItem = Form.Item;
const createForm = Form.create;
class Rolelist extends Component{
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
				
		    </Form>
		);
	}
}
const SearchBar = createForm()(Rolelist);

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
			title: '名称',
			dataIndex: 'name',
			
		},{
			title: '备注',
			dataIndex: 'memo',
		}];
	}
	onSubmit(){
		var scope = this;
		confirm({
		    title: '您是否确认要授权这项角色',
		    onOk() {
		    	let fetch = Ajax.post("/bdrp/org/role/user/link?uIds='"+scope.props.data.personId+"'"+"&rId='"+scope.state.selData.id+"'",null, {catch: 3600});
				fetch.then(res => {
					if(res.success){
						Modal.success({title: '授权成功'});
						scope.refresh();
					}else{
						Modal.error({title: '授权失败'}); 
					}
			    	return res;
				});
		    },
		    onCancel() {},
		});
	}
	onSearch(data){
		console.info('onSearch',data);
		this.state.searchParams = data;
		this.refresh();
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
		let fetch = Ajax.get('/bdrp/org/role/list',{data:param}, {catch: 3600});
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
			    <Button type="primary" onClick={this.onSubmit.bind(this)} style={bStyle}>授权</Button>
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