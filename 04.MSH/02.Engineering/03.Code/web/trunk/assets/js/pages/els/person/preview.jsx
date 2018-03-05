'use strict';

import { Component } from 'react';
import ReactDOM from 'react-dom';
import { Form, Modal,Input, Button, Checkbox,Table,Row,Col,message ,Alert ,Spin } from 'antd';
const confirm = Modal.confirm;
const FormItem = Form.Item;
const createForm = Form.create;


class Preview extends Component {
	constructor (props) {
		super(props);
		const scope = this;
		this.state = {
			searchParams:{},
			pagination : {
				current:0,                                        //当前页数	Number	无
				total:0, 
				showTotal:scope.showTheTotal.bind(scope),                                         //数据总数	Number	0
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
	/*获取表单数据*/
	getColumn (){
		const scope = this;
		return [{
			title: '姓名',
			dataIndex: 'name',
			
		}, {
			title: '身份证号',
			dataIndex: 'idNo',
		}, {
			title: '卡号',
			dataIndex: 'acctNo',
		}, {
			title: '行号',
			dataIndex: 'bankNo',
		}, {
			title: '行名',
			dataIndex: 'bankName',
		}, {
			title: '部门',
			dataIndex: 'department',
		}, {
			title: '手机号',
			dataIndex: 'mobile',
		}];
	}


	/*提交表单处理：确认导入*/
	onSubmit(e){
		var scope = this;
		//医院级别特殊处理
		//if(data.hosLevel && data.hosLevel.length>1)data.hosLevel=data.hosLevel[1];
		let fetch = Ajax.post('api/els/preview/importpermng?orgid=4028b8815562d296015562d879fc000b', {
			catch: 3600,dataType:'json'
		});
		fetch.then(res => {
			if(res.success){
				scope.close();
				message.success('导入成功！');
				 
			}
			else message.error('导入失败! ' + '原因:' + res.msg);
		});
	}
	close(){
		if(this.props.onClose){
			this.props.onClose(arguments);
		}
	}
	

	refresh(){
		this.goToPage(this.state.pagination.current);
	}
	/*查询结果*/
	goToPage(pageNo){
		this.setState({loading:true});
		let start = (pageNo-1)*this.state.pagination.pageSize;
		let fetch = Ajax.get('api/els/preview/list/'+start+'/'+this.state.pagination.pageSize, this.state.searchParams, {catch: 3600});
		fetch.then(res => {
		//	loading={false}
			let data = res.result,total=res.total,start=res.start;
			let pagination = this.state.pagination;
			pagination.current=pageNo,pagination.total = total;
			this.setState({ pagination: pagination,data:data,loading:false});
	    	return res;
	  //	loading={this.state.loading}
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
		let bStyle={marginRight:'3px'};

		return (
			<div style={{ minHeight:'500px'}}>
			
				<div style={{backgroundColor: "#dee4e6"}}>
				
				<Row type="flex" justify="start">
					 <Col span={22}></Col>
					 <Col span={2}><Button type="primary" onClick={this.onSubmit.bind(this)} htmlType="submit">确认导入</Button></Col>			         
			    </Row>
				
				</div>	
		        <Table 
		        	columns={this.getColumn()} 
			        rowKey={record => record.id}
			        dataSource={this.state.data}
			        pagination={this.state.pagination}
			     	loading={this.state.loading}
		        	/>
		  
	    	</div>
		);
	}
}
module.exports = Preview;