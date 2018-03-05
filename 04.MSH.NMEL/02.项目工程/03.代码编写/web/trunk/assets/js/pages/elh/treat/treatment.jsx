'use strict';

import { Component } from 'react';
import ReactDOM from 'react-dom';
import { Form, Modal,Input,Select, Button,Cascader , Checkbox,Table  } from 'antd';
const confirm = Modal.confirm;
const FormItem = Form.Item;
const createForm = Form.create;

class List extends Component {
	constructor (props) {
		super(props);
		const scope = this;
		this.state = {
			searchParams:{patient:props.patient.id},
			selectedRowKeys:[],
			selectedRows:[],
			pagination : {
				current:0,                                        //当前页数	Number	无
				total:0,                                          //数据总数	Number	0
				pageSize:10,                                       //每页条数	Number	
				onChange:scope.pageChange.bind(scope),            //页码改变的回调，参数是改变后的页码	Function	noop
				showSizeChanger:true,                             //是否可以改变 pageSize	Boolfalse
				pageSizeOptions	: ['10', '20'],       //指定每页可以显示多少条	Array	
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
			title: '就诊医院',
			dataIndex: 'hospitalName',
		}, {
			title: '就诊科室',
			dataIndex: 'departmentName'
		},{
			title: '就诊人',
			dataIndex: 'patientName',
		},{
			title: '就诊卡类型',
			dataIndex: 'cardTypeName',
		},{
			title: '就诊卡号',
			dataIndex: 'cardNo',
		},{
			title: '状态',
			dataIndex: 'status',
			render(text,record,index) {
				return (text=='1')?"已结束":"进行中";
			},
		},{
			title: '类型',
			dataIndex: 'type',
			render(text,record,index) {
				return (text=='1')?"急诊":"普通";
			},
		},{
			title: '当前提醒',
			dataIndex: 'notification',
		},{
			title: '创建时间',
			dataIndex: 'createTime',
		},{
			title: '开始时间',
			dataIndex: 'startTime',
		},{
			title: '更新时间',
			dataIndex: 'updateTime',
		},{
			title: '操作',
			dataIndex: 'opt',
			render(text,record,index) {
				if(record.status != '0' ) return "";
				var opts=[],style={marginLeft:'3px'};
				opts.push(<a  style={style} onClick={scope.onView.bind(scope,record)}>导诊</a>);
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
		if(this.props.onGuide){
			this.props.onGuide(row);
		}
	}
	onEdit(row){
		if(this.props.onEdit){
			this.props.onEdit(row);
		}
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
		let fetch = Ajax.get('api/elh/treatment/treatmentrd/list/'+start+'/'+this.state.pagination.pageSize, data, {catch: 3600});
//		let fetch = Ajax.get('api/elh/treatment/treatmentrd/unclose/list', data, {catch: 3600});
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
				<div style={{backgroundColor: "#dee4e6"}}>
					<Button type="primary" onClick={this.refresh.bind(this)} style={bStyle}>刷新</Button>
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