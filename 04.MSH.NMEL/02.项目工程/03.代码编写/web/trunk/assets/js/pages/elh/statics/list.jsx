'use strict';

import { Component } from 'react';
import ReactDOM from 'react-dom';
//var qs = require('querystring');
class List extends Component {
	constructor (props) {
		super(props);
		this.state = {
				bordered: true,
				selectAble: true,
				filters: [],
				data:[],
				pagination: true,
				striped: true,
				total: 0,
				pageSize:2,
				pageNo:1,
				width: '100%'
		};
		this.version= props.version;
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
	onDelete(data){
		var scope = this;
		let fetch = Refetch['delete']('api/elh/doctor/'+data.id, null, {catch: 3600});
		fetch.then(res => {
			if(res.success){
				Modal.alert('删除成功'); 
				scope.refresh();
			}else{
				Modal.alert('删除失败'); 
			}
	    	return res;
		});
	}
	componentWillMount () {
		//let paramString =qs.stringify({start:0,pageSize:this.state.pageSize});
		let fetch = Refetch.get('api/elh/doctor/list/0'+'/'+this.state.pageSize, null, {catch: 3600});
		fetch.then(res => {
			let data = res.result,total=res.total,start=res.start;
			this.setState({ total: total,data:data });
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
	refresh(){
		this.goToPage(this.state.pageNo);
	}
	goToPage(pageNo){
		let start = (pageNo-1)*this.state.pageSize;
		let fetch = Refetch.get('api/elh/doctor/list/'+start+'/'+this.state.pageSize, null, {catch: 3600});
		fetch.then(res => {
			let data = res.result,total=res.total,start=res.start;
			this.setState({ total: total,data:data,pageNo:pageNo });
	    	return res;
		});
	}
	pageChange(pageNo){
		this.goToPage(pageNo);
	}
	render () {
		return (
			<div style={{ height:'500px'}}>
			<Grid style={{background: '#eee',height:'33px'}} width={ 1/4 }>
				<div style={{ textAlign: 'left'}}>
					用户列表
					<a onClick={this.refresh.bind(this)} ><Icon  icon="refresh" /></a>
				</div>
			</Grid>
			<Grid style={{background: '#eee'}} width={ 3/4 }>
				<Grid width={ 10/12 }></Grid>
				<Grid width={ 1/12 }><Button status="primary" onClick={this.onCreate.bind(this)}>新增</Button></Grid>
				<Grid width={ 1/12 }><Button status="primary" onClick={this.onDelete.bind(this)}>删除</Button></Grid>
			</Grid>
    		<Table ref="table"
    			  	bordered={this.state.bordered}
    			  	filters={this.state.filters}
    			  	selectAble={this.state.selectAble}
    			  	striped={this.state.striped}
    			  	width={this.state.width}
    			  	height={this.state.height}
    				data = {this.state.data}
    			  	headers={[
	    			    { name: 'name', sortAble: true, header: '姓名',content: (d) => {
	    			        return <a onClick={this.onView.bind(this,d)}>{d.name}</a>;
	    			    	}
	    			    },
	    			    { name: 'userCode', hidden: true },
	    			    { name: 'tools', width: 60,content: (d) => {return <a onClick={this.onDelete.bind(this,d)}>删除</a>;}}
	    			]}
    			  pagination={null} />
	    	<div>
    			<Pagination  style={{float:'right'}} 
    				size={this.state.pageSize}  			// 每页显示条数，默认为 20
    				index={this.state.pageNo}         // 显示的页码数， 默认为 10
    				total={this.state.total}         // 总条目数，默认为 0
    				jumper={true} 
    				size={this.state.pageSize} 
    				onChange={this.pageChange.bind(this)} />
	        </div>
    	</div>
    );
  }
}
module.exports = List;