'use strict';

import { Component } from 'react';
import ReactDOM from 'react-dom';
import { Table,Button,Icon,Form,Input,Row,Col,FormItem,Select } from 'antd';
//var qs = require('querystring');
class StubBatchList extends Component {
	constructor (props) {
		super(props);
		var myDate = new Date();
		var year = myDate.getFullYear();
		let children = [];
		for (let i = year; i >= 1970; i--) {
			children.push(<Select.Option key={i}>{i}</Select.Option>);
		}
		this.state = {
				orgId:'4028b8815562d296015562d879fc000b',
				year:year,
				data:[],
				pageSize:60,
				pageNo:1,
				width: '100%',
				yearOption:children,
				loading:false,
				columns:[
    			    { dataIndex: 'month', key: 'name', title: '月份',
    					render(value, row, index) {
							let obj = {
								children: value,
								props: {},
							};
							obj.props.rowSpan = row.rowSpan;
							return obj;
						}
    			    },
    			    { dataIndex: 'batchNo', key: 'batchNo', title: '批次号'
    			    },
    			    { dataIndex: 'num', key: 'num', title: '总人次'
    			    },
    			    { dataIndex: 'amount', key: 'amount',  title: '实发总额'
    			    },
    			    { dataIndex: 'template', key: 'template',  title: '模板'
    			    },
    			    { dataIndex: 'note', key: 'note',  title: '备注'
    			    },
    			    { dataIndex: 'state', key: 'state',  title: '状态',
    			    	render: (text,record) => {
    			    		return record.state=='0'?<div style={{color:'red'}}>待发放</div>:<div>已发放</div>
    			    	}
    			    },
    			    { dataIndex: 'tools', title: '操作',width: 80,
    			    	render: (text,record) => {
    			    		return <Button onClick={this.onView.bind(this,record)} style={{color:'#57c5f7'}} icon="file-text">查看</Button>;
    			    	}
    			    }
    			]
		};
		this.version= props.version;
	}
	onCreate(){
		if(this.props.onCreate){
			this.props.onCreate(arguments);
		}
	}
	onImport(){
		if(this.props.onImport){
			this.props.onImport(arguments);
		}
	}
	onExport(){
		window.location.href = "api/els/stubbatch/export/"+this.state.orgId+"/"+this.state.year;
	}
	onView(row){
		if(this.props.onView){
			this.props.onView(row);
		}
	}
	onDelete(data){
		var scope = this;
		let fetch = Ajax['delete']('api/els/StubBatch/'+data.id, null, {catch: 3600});
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
	setRowSpan(arr){
		let data = arr;
		let oldmonth='';
		for(var i=0;i<data.length;i++){
			if( oldmonth != data[i].month){
				let rowSpan=1;
				oldmonth = data[i].month;
				for( var j=i+1;j<data.length;j++ ){
					if(oldmonth==data[j].month) rowSpan++;
					else break;
				}
				data[i].rowSpan = rowSpan;
			}
			else data[i].rowSpan = 0;				
		}
		return data;
	}
	componentWillMount () {
		this.setState({loading:true});
		let fetch = Ajax.get('api/els/stubbatch/list?orgId='+this.state.orgId+'&year='+this.state.year, null, {catch: 3600});
		fetch.then(res => {
			let data = res.result,total=res.total,start=res.start;
			data = this.setRowSpan(data)
			this.setState({ total: total,data:data,loading:false });
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
		this.setState({loading:true});
		let fetch = Ajax.get('api/els/stubbatch/list?orgId='+this.state.orgId+'&year='+this.state.year, null, {catch: 3600});
		fetch.then(res => {
			let data = res.result,total=res.total,start=res.start;
			data = this.setRowSpan(data)
			this.setState({ data:data,pageNo:pageNo,loading:false });
	    	return res;
		});
	}
	pageChange(pageNo){
		this.goToPage(pageNo);
	}
	handleChange(value) {
		this.setState({year:value});
		if( this.props.refreshList )
			this.props.refreshList();
	}
	render () {
		return (
		<div style={{ height:'500px',marginRight:10}}>
			<Row type='flex' align='middle' justify='center' style={{backgroundColor:'#dee4e6',}}>
				<Col span={6}>

					<Select showSearch 
						placeholder="请选择员工"
					    optionFilterProp="children"
					    notFoundContent="无法找到"
						defaultValue={this.state.year}
						style={{ width: 120 }}
					    searchPlaceholder="标签模式"
					    onChange={this.handleChange.bind(this)}>
					    {this.state.yearOption}
					</Select>					
					<a style={{ marginLeft: 5,display:'inline'}} onClick={this.refresh.bind(this)}><Icon type="reload" /></a>
				</Col>
				<Col span={18}>
					<Button onClick={this.onImport.bind(this)}>导入</Button>
					<Button style={{marginLeft:5}} onClick={this.onExport.bind(this)}>导出</Button>
					<Button style={{float:'right'}} type='primary ' icon="plus" onClick={this.onCreate.bind(this)}>新增</Button>
				</Col>
			</Row>
			<Table columns={this.state.columns} dataSource={this.state.data} size='middle' pagination={{pageSize:60}} loading={this.state.loading}/>
    		
    	</div>
    );
  }
}
module.exports = StubBatchList;
