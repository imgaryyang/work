'use strict';

import { Component } from 'react';
import ReactDOM from 'react-dom';
import { Input,Button,Table,Form } from 'antd';

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
					<Input placeholder="请输入身份证号码" {...getFieldProps('idno')} /> 
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
				bordered: true,
				selectAble: true,
				filters: [],
				  data:[],
				pagination : {
					current:0,                                        //当前页数	Number	无
					total:0,                                          //数据总数	Number	0
					pageSize:5,                                       //每页条数	Number	
					onChange:scope.pageChange.bind(scope),            //页码改变的回调，参数是改变后的页码	Function	noop
					showSizeChanger:true,                             //是否可以改变 pageSize	Boolfalse
					pageSizeOptions	: ['3', '4', '5', '6'],       //指定每页可以显示多少条	Array	
					onShowSizeChange:scope.pageSizeChange.bind(scope),//pageSize 变化的回调	Function	noop
					showQuickJumper:true                              //是否可以快速跳转至某页Bool	false
				},
		        loading : false,
				striped: true,
				total: 0,
				pageSize:5,
				pageNo:1,
				width: '100%'
		};
		this.version= props.version;
	}
	
	onView(row){
		if(this.props.onView){
			this.props.onView(row);
		}
	}
	componentWillMount () {
		this.goToPage(1);
	}
	
	goToPage(pageNo) {
		this.setState({loading:true});
		let data = this.state.searchParams;
		let param = JSON.stringify(data);
		let start = (pageNo-1)*this.state.pagination.pageSize;
		let fetch = Ajax.get('api/elh/order/list/'+start+'/'+this.state.pageSize, {data:param}, {catch: 3600});
		fetch.then(res => {
			let data = res.result,total=res.total,start=res.start;
			let pagination = this.state.pagination;
			pagination.current=pageNo,pagination.total = total;
			this.setState({data:data,pagination: pagination,loading:false});
	    	return res;
		});
	}
	
	componentDidUpdate(){
		if(this.version != this.props.version){
			 this.version = this.props.version;
			 this.refresh();
		}else{
		}
	}
	
	onSearch(data){
		this.state.searchParams = data;
		this.refresh();
	}
	
	onReset(data){
		this.state.searchParams = {};
		this.refresh();
	}
	
	refresh(){
		this.goToPage(this.state.pageNo);
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
	
	
	getColumn (){
		const scope = this;
		return [{
			title: '订单号',
			dataIndex: 'orderNo',
			render(text,record,index){
				return <a onClick={scope.onView.bind(scope,record)}>{record[0].orderNo}</a>
			},
		}, {
			title: '姓名',
			dataIndex: 'patientId',
			render(text,record,index) {
				return <p>{record[1].name}</p>;
			},
		},{
			title: '身份证号',
			dataIndex: 'idno',
			render(text,record,index) {
				return <p>{record[1].idno}</p>;
			},
		},{
			title: '手机号',
			dataIndex: 'mobile',
			render(text,record,index) {
				return <p>{record[1].mobile}</p>;
			},
		},{
			title: '金额（元）',
			dataIndex: 'amount',
			render(text,record,index){
				var num = record[0].amount.toFixed(2);
				return <p>{num}</p>;
			},
		},{
			title: '状态',
			dataIndex: 'status',
			render(text,record,index){
				if(record[0].status=='1'){
					return <p>已支付</p>;
				}else{
					return <p>未支付</p>;
				}
			},
		},{
			title: '支付时间',
			dataIndex: 'payTime',
			render(text,record,index){
				return <p>{record[0].payTime}</p>
			}
		}];
	}
	
	render () {
	   return (
			<div>
			<SearchBar onSearch={this.onSearch.bind(this)} onReset={this.onReset.bind(this)}/>
    		<Table ref="table"
    			columns={this.getColumn()} 
		    	dataSource={this.state.data}
	        	rowKey={record => record.id}
	        	pagination={this.state.pagination}
	        	loading={this.state.loading}/>
    		</div>
    );
  }
}
module.exports = List;
