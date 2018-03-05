'use strict';

import { Component } from 'react';
import ReactDOM from 'react-dom';
import { Table,Form,Input,Button  } from 'antd';

const FormItem = Form.Item;
const createForm = Form.create;

class SearchForm extends Component{
	
	constructor (props) {
		super(props);
	}
	
	onRet(e){
		e.preventDefault();
	    this.props.form.resetFields();
	    this.props.form.validateFields((errors, values) => {
		    this.props.onReset(values);
		    });
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
					<Input placeholder="请输入患者姓名" {...getFieldProps('name')} /> 
		        </FormItem>
				<FormItem label="身份证号码">
					<Input placeholder="请输入身份证号码" {...getFieldProps('idCardNo')} /> 
		        </FormItem>
					<FormItem label="手机号码">
					<Input placeholder="请输入手机号码" {...getFieldProps('mobile')} /> 
		        </FormItem>	
		        <FormItem >
		        	<Button type="primary" onClick={this.onSubmit.bind(this)} htmlType="submit">查询</Button>&nbsp;&nbsp;&nbsp;
		        	<Button type="ghost" onClick={this.onRet.bind(this)}  htmlType="submit">重置</Button>
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
				total:0,                                          //数据总数	Number	0
				pageSize:5,                                       //每页条数	Number	
				onChange:scope.pageChange.bind(scope),            //页码改变的回调，参数是改变后的页码	Function	noop
				showSizeChanger:true,                             //是否可以改变 pageSize	Boolfalse
				pageSizeOptions	: ['5', '10', '15', '20'],       //指定每页可以显示多少条	Array	
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
			title: 'App名称',
			dataIndex: 'appId',
			render(text,record,index){
				return <p>{record[0].name}</p>
			},
		}, {
			title: '姓名',
			dataIndex: 'name',
			render(text,record,index) {
				return <a onClick={scope.onView.bind(scope,record)}>{record[1].name}</a>;
			},
		},{
			title: '性别',
			dataIndex: 'gender',
			render(text,record,index){
				if(record[1].gender=='1'){
					return <p>男</p>
				}else{
					return <p>女</p>
				}
			},
		},{
			title: '昵称',
			dataIndex: 'nickname',
			render(text,record,index){
				return <p>{record[1].nickname}</p>
			},
		},{
			title: '身份证号码',
			dataIndex: 'idCardNo',
			render(text,record,index){
				return <p>{record[1].idCardNo}</p>
			},
		},{
			title: '手机号',
			dataIndex: 'mobile',	
			render(text,record,index){
				return <p>{record[1].mobile}</p>
			},
		},{
			title: '是否为注册App',
			dataIndex: 'isReg',
			render(text,record,index){
				if(record[2].isReg=='1'){
					return <p>是</p>
				}else{
					return <p>否</p>
				}
			},
		}
		
		];
	}

	onSearch(data){
		this.state.searchParams = data;
		this.refresh();
	}
	
	onReset(data){
		this.state.searchParams = {};
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
	
	refresh(){
		this.goToPage(this.state.pagination.current);
	}
	
	goToPage(pageNo){
		this.setState({loading:true});
		let start = (pageNo-1)*this.state.pagination.pageSize;
		let data = this.state.searchParams;
//		data.appId = '123';
		let param = JSON.stringify(data);
		let fetch = Ajax.get('api/el/user/patients/'+start+'/'+this.state.pagination.pageSize,{data: param}, {catch: 3600});
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
		return (
			<div style={{ minHeight:'500px'}}>
				<SearchBar onSearch={this.onSearch.bind(this)} onReset={this.onReset.bind(this)}/>
				<Table 
			     	columns={this.getColumn()} 
				    dataSource={this.state.data}
			        rowKey={record => record.id}
			        pagination={this.state.pagination}
			        loading={this.state.loading}
		        	/>
	    	</div>
				
		);
	}
}
module.exports = List;
