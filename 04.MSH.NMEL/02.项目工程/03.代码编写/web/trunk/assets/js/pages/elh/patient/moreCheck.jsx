'use strict';

import { Component } from 'react';
import ReactDOM from 'react-dom';
import {Row,Col,Card,Pagination} from 'antd';

class Create extends Component {
	
	constructor (props) {
		super(props);
		const scope = this;
		this.state = {
				treatmentrd:[],
				medcheck:[],
				searchParams:{},
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
	}
	
	close(){ 
		if(this.props.onClose){
			this.props.onClose(arguments);
		}
	}
	
	refreshList(){
		if(this.props.refreshList){
			this.props.refreshList(arguments);
		}
	}
	
	componentWillMount(){
		this.goToPage(1);
	}
	
	goToPage(pageNo) {
		this.setState({loading:true});
		let start = (pageNo-1)*this.state.pagination.pageSize;
		let medfetch = Ajax.get('/api/elh/treatment/medicalcheck/list/0/100',null, {catch: 3600});
		medfetch.then(res => {
			let medcheck=res.result,total=res.total,start=res.start;
			let pagination = this.state.pagination;
			pagination.current=pageNo,pagination.total = total;
			this.setState({medcheck:medcheck,pagination:pagination,loading:false});
	    	return res;
		});
	}
	
	onChange(){
		this.pageChange(this.state.pagination.pageSize);
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
	
	onCheckDetail(row){
		if(this.props.onCheckDetail){
			this.props.onCheckDetail(row);
			}
		}
	
	render () {
		const gscope = this;
return (
<Card title="报告单" style={{ width: '85%' }}>
{
	this.state.medcheck.map(function(check,index){
		return <p style={{fontSize:'1.3em'}}><a onClick={gscope.onCheckDetail.bind(gscope,check)}>{check.department}-{check.subject} [{check.checkTime}]</a></p>;
		})
}
<br/>
<Pagination onChange={gscope.onChange} showSizeChanger={true} total={gscope.state.pagination.total} showQuickJumper={true}/>
</Card>
    );
  }
}
module.exports = Create

