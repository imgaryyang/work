'use strict';

import { Component } from 'react';
import ReactDOM from 'react-dom';
import { Table, Modal, message, Row, Col, Button, Form,DatePicker,Select,Input,Icon,Affix,Tag} from 'antd';

const FormItem = Form.Item;
const MonthPicker = DatePicker.MonthPicker;
const Option = Select.Option;

class List extends Component {
	constructor (props) {
		super(props);
		const scope = this;
		this.state = {
			data:[],
			orgId:'4028b8815562d296015562d879fc000b',
			columns:[
			    { dataIndex: 'template', key: 'template', title: '名称'
			    },
			    { dataIndex: 'createAt', key:'createAt', title: "创建日期" },
			    { dataIndex: '', key: 'x',title: <div style={{textAlign:'center'}}>操作</div>,
			    render: (text,d) => {
			    	return <div style={{textAlign:'right'}}><Button style={{color:'green'}} onClick={this.props.onView.bind(this,d)} icon="file-text">修改</Button>
			    			<Button style={{color:'red'}} onClick={this.onDeleteInfo.bind(this,d)} icon="delete">删除</Button>
			    			<Button onClick={this.onDownload.bind(this,d)} icon="download">下载</Button></div>
			    	}
				}
			],
			selectedRowKeys:[],
			selectedRows:[],
			pagination : {
				current:0,                                        //当前页数	Number	无
				total:0,                                          //数据总数	Number	0
				pageSize:10,                                       //每页条数	Number	
				onChange:scope.pageChange.bind(scope),            //页码改变的回调，参数是改变后的页码	Function	noop
				showSizeChanger:true,                             //是否可以改变 pageSize	Boolfalse
				pageSizeOptions	: ['5', '10', '20', '40'],       //指定每页可以显示多少条	Array	
				onShowSizeChange:scope.pageSizeChange.bind(scope),//pageSize 变化的回调	Function	noop
				showQuickJumper:true                              //是否可以快速跳转至某页Bool	false
			},
	        loading : false
		};
		this.version= props.version;
	}
	
	
	close(){
		if(this.props.onClose){
			this.props.onClose(arguments);
		}
	}
	componentWillMount () {
		this.goToPage(1);		
	}
	componentDidUpdate(){
		if(this.version != this.props.version){
			 this.version = this.props.version;
			 this.refresh();
		}else{
		}
	}
	onSearch(){
		let template = this.refs.qtemplate.refs.input.value;
		let create = this.refs.qcreate.refs.input.value;
		this.goToPage(1,template,create);
	}

	onDeleteInfo(data){
		var scope = this;
		Modal.confirm({
		    title: '您是否确认要删除这项数据',
		    onOk() {
		    	let fetch = Ajax.del('api/els/stubtemplate/'+data.id, null, {catch: 3600});
				fetch.then(res => {
					if(res.success){
						message.success('操作成功');
						scope.refresh();
					}else{
						Modal.error({title: '操作失败:'+res.msg}); 
					}
			    	return res;
				});
		    },
		    onCancel() {},
		});
	}
	onDownload(data){
		window.location.href = "api/els/stubtemplate/export/"+data.id;
	}
	deleteSelected(Rows){
		var scope = this;
		Modal.confirm({
		    title: '您是否确认要删除这'+Rows.length+'项数据',
		    onOk() {
		    	Rows.map((data)=>{
					let fetch = Ajax.del('api/els/stubtemplate/'+data.id, null, {catch: 3600});
					fetch.then(res => {
						if(res.success){
							message.success('操作成功');
							scope.setState({selectedRowKeys:[],selectedRows:[]});
							scope.refresh();
						}else{
							Modal.error({title: '操作失败:'+res.msg}); 
						}
				    	return res;
					});
		    })},
		    onCancel() {},
		});

	}

	onCreate()
	{
		if(this.props.onCreate)
			this.props.onCreate()
	}
	onView(data)
	{
		if(this.props.onView)
			this.props.onView(data)
	}

	refresh(){
		this.goToPage(this.state.pagination.current);
	}
	goToPage(pageNo,itemplate,icreateAt){
		let template='',createAt='';
		if(typeof(itemplate)=='undefined') template=''; else template=itemplate;
		if(typeof(icreateAt)=='undefined') createAt=''; else createAt=icreateAt;

		this.setState({loading:true});
		let start = (pageNo-1)*this.state.pagination.pageSize;
		let fetch = Ajax.get('api/els/stubtemplate/list/'+start+'/'+this.state.pagination.pageSize+'?orgId='+this.state.orgId+'&template='+template+'&createAt='+createAt, null, {catch: 3600});
		fetch.then(res => {
			let data = res.result,total=res.total,start=res.start;
			let pagination = this.state.pagination;
			pagination.current = pageNo;
			pagination.total = total;
			this.setState({ data:data,pagination:pagination, loading:false });
	    	return res;
		});
	}
	pageChange(pageNo){
		this.goToPage(pageNo);
	}
	pageSizeChange(page,pageSize){
		let pagination = this.state.pagination;
		pagination.pageSize=pageSize;
		this.setState({ pagination: pagination });
		this.refresh()
	}
	onSelectChange(selectedRowKeys, selectedRows) {
		this.state.selectedRowKeys =selectedRowKeys;
		this.setState({selectedRows : selectedRows});
		//这里不用setState触发更新
	}
	
	onSelect(record, selected, selectedRows) {
		//console.log(record, selected, selectedRows);
	}
	
	onSelectAll(selected, selectedRows, changeRows) {
		//console.log(selected, selectedRows, changeRows);
	}
	
	render () {
		const rowSelection = {
			onChange:this.onSelectChange.bind(this)
		}
		let tagStyle = {marginLeft: '5px', height: '30', lineHeight: '30px'};
		let rightButtonStyle = {marginRight: '3px', float: 'right'};
		let deleteButtonStyle = {marginRight: '3px', float: 'right',color:'red'};
		return (
			<div style={{ height:'500px',width:'85%', margin:'auto'}}>
				
				<Row type='flex' align='middle' justify='space-between' style={{backgroundColor:'#dee4e6',}}>
					<Col span={4}><Input ref="qtemplate" id="qtemplate" placeholder="模板名" type="text" maxLength={48}/></Col>
					<Col span={4}><Input ref="qcreate" id="qcreate" placeholder="创建日期" type="text" maxLength={30}/></Col>					
					<Col span={2}><Button type="primary" htmlType="submit" onClick={this.onSearch.bind(this)}>查询</Button></Col>
					<Col span={1}><a style={{ marginLeft: 5,display:'inline'}} onClick={this.refresh.bind(this)}><Icon type="reload" /></a>
					</Col>
					<Col span={12}>
						<Button style={deleteButtonStyle} type='normal' icon="delete" 
							onClick={this.deleteSelected.bind(this,this.state.selectedRows)}>{'删除'+this.state.selectedRows.length+'项'}
						</Button>
						<Button style={rightButtonStyle} type='primary' icon="plus" 
							onClick={this.onCreate.bind(this)}>新增
						</Button>
					</Col>
				</Row>
				<Table 
					rowSelection={rowSelection}
					columns={this.state.columns} 
					dataSource={this.state.data} 
					size='middle'
					rowKey={record => record.id}
					pagination={this.state.pagination}
					loading={this.state.loading}
				/>
			    <div style={{height:40}}></div>
	    	</div>
    );
  }
}
module.exports = List;