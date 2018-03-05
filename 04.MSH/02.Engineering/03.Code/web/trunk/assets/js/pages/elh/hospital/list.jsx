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
		const levelOptions = [
  		    {value: '3',label: '三级',children: [{
  			    value: '3A',label: '甲等',
  			  },{
  			    value: '3B',label: '乙等',
  			  },{
  			    value: '3C',label: '丙等',
  			  }],
  			},{value: '2',label: '二级',children: [{
  			    value: '2A',label: '甲等',
  			  },{
  			    value: '2B',label: '乙等',
  			  },{
  			    value: '2C',label: '丙等',
  			  }],
  			},{value: '1',label: '一级',children: [{
  			    value: '1A',label: '甲等',
  			  },{
  			    value: '1B',label: '乙等',
  			  },{
  			    value: '1C',label: '丙等',
  			  }],
  		}];
		return (
			<Form inline className="table-top-form">
				<FormItem label="名称">
					<Input placeholder="名称" {...getFieldProps('name')} /> 
		        </FormItem>
				<FormItem label="代码">
					<Input placeholder="代码" {...getFieldProps('code')} />  
		        </FormItem>
				<FormItem label="医院类型">
					<Select style={{width:'100px'}} placeholder="医院类型" {...getFieldProps('hosType')} >
		        	  <Select.Option value="1">综合医院</Select.Option>
		        	  <Select.Option value="2">专科医院</Select.Option>
		        	</Select> 
		        </FormItem>
		        <FormItem label="医院级别" >
		        	<Cascader style={{width:'100px'}} placeholder="医院级别" options={levelOptions} {...getFieldProps('hosLevel')} />
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
			title: '名称',
			dataIndex: 'name',
			render(text,record,index) {
				return <a onClick={scope.onView.bind(scope,record)}>{text}</a>;
			},
		}, {
			title: '机构代码',
			dataIndex: 'code',
		}, {
			title: '医院类型',
			dataIndex: 'hosType',
			render(text,record,index) {
				 if('1' == text) return '综合医院';
				 else if('2' == text) return '专科医院';
				 else  return '';
			},
		},{
			title: '医院级别',
			dataIndex: 'hosLevel',
			render(text,record,index) {
				if(!(text && text.length==2))return '';
				let L1='',L2='';
				if('1'==text[0]){L1='一级'}else if('2'==text[0]){L1='二级'}else if('3'==text[0]){L1='三级'}
				if('A'==text[1]){L2='甲等'}else if('B'==text[1]){L2='乙等'}else if('C'==text[1]){L2='丙等'}
				return L1+L2;
			},
		},{
			title: '联系人',
			dataIndex: 'linkman',
		},{
			title: '地址',
			dataIndex: 'address',
		},{
			title: '状态',
			dataIndex: 'state',
			render(text,record,index) {
				return (text == '1')?"正常":"已下线";
			},
		},{
			title: '操作',
			dataIndex: 'opt',
			render(text,record,index) {
				var opts=[],style={marginLeft:'3px'};
				if(record.state == '1')opts.push(<a  style={style} onClick={scope.offLine.bind(scope,record)}>下线</a>);
				else opts.push(<a  style={style} onClick={scope.upLine.bind(scope,record)}>上线</a>);
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