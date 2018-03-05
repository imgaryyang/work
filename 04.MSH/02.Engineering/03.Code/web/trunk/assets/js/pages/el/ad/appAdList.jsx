'use strict';

import { Component } from 'react';
import ReactDOM from 'react-dom';
import { Form, Modal,Input,Select, Button,Cascader , Checkbox,Table  } from 'antd';
const confirm = Modal.confirm;
const FormItem = Form.Item;
const createForm = Form.create;
class Image extends Component{
	constructor (props) {
		super(props);
	}
	render () {
		
	}
}

class List extends Component {
	constructor (props) {
		super(props);
		const scope = this;
		this.state = {

		};
	}
	componentWillMount () {
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
		this.upOrOff("api/elh/hospital/mng/upLine/"+data.id,"1","上线");
	}
	offLine(data){
		this.upOrOff("api/elh/hospital/mng/offLine/"+data.id,"0","下线");
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
		let fetch = Ajax.get('api/elh/hospital/mng/list/'+start+'/'+this.state.pagination.pageSize, {data:param}, {catch: 3600});
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