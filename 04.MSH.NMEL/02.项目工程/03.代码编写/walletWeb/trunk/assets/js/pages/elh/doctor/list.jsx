'use strict';

import { Component } from 'react';
import ReactDOM from 'react-dom';
import { Form, Modal,Affix,Button,Cascader,Checkbox,Table,Card,Tree,Row,Col} from 'antd';
const confirm = Modal.confirm;
const FormItem = Form.Item;
const createForm = Form.create;
const TreeNode = Tree.TreeNode;
const hospId = "8a8c7d9b55298217015529a9844e0000";
class List extends Component {
	constructor (props) {
		super(props);
		const scope = this;
		this.state = {
			imitems:[],
			cditems:[],
			}
		this.version= props.version;
	}
	componentWillMount () {
		const scope = this;
		let fetch = Ajax.get('/api/elh/department/list/0/10',{data:{}}, {catch: 3600});
		const arrtype=[];
		fetch.then(res => {
			let resdata = res.result;
			const dps = res.result;
			scope.setState({departMent:resdata});
			let items=[];
			let chitems=[];
				resdata.map(function(depart,index){
					let cmps = [];
					if(arrtype.indexOf(depart.type) === -1){
						arrtype.push(depart.type);
						chitems = [];
						 cmps =  dps.map(function(dp,idx){
							if(dp.type === depart.type){
								return <TreeNode title={dp.name} key={dp.id}/>;
							}
						});
						 for(var i = 0 ;i<cmps.length;i++){
							 if(cmps[i] == "" || typeof(cmps[i]) == "undefined"){
								 cmps.splice(i,1);
								 i= i-1;
								 }
							 }
						items.push(<TreeNode title={depart.type} key={depart.id+index}>{cmps}</TreeNode>);
					}
	    		});
			scope.setState({imitems:items});
			});
	}
	
	countAge(date){
		var nowdate = new Date();
		var age =nowdate.getFullYear() - date.substr(0,4);
		return age;
	}
	
	componentDidUpdate(){
		if(this.version != this.props.version){
			 this.version = this.props.version;
			 this.refresh();
		}
	}
	onSelect(info) {
		const scope = this;
		let dc = {};
		dc.hospitalId = hospId;
		dc.departmentId = info[0];
		let param = JSON.stringify(dc);
		let fetch = Ajax.get('/api/elh/doctor/list/0/10',{data:param}, {catch: 3600});
		this.setState({cditems:[]});
		fetch.then(res => {
			let doctor = res.result;
			let items=[];
			doctor.map(function(dc,index){
				let imgUrl = "/api/el/base/images/view/"+dc.portrait;
				items.push(<Card style={{lineHeight:2 }}>
				<Row>
				<Col span={8}><img style={{width:"100px",height:"120px"}} src={imgUrl}/></Col>
				<Col span={16}>
				<div>
				<Row>
				<Col span={8}><h2>{dc.name}</h2></Col>
				<Col span={7} push={9}>
				<a onClick={scope.onEdit.bind(scope,dc)}>编辑　</a>
				<a onClick={scope.onDelete.bind(scope,dc)}>删除</a>
				</Col>
				</Row>
		        </div>
		        <div><font style={{fontSize:'13px',fontWeight:'bold'}}>职称:</font>　{dc.jobTitle}</div>
		        <div><font style={{fontSize:'13px',fontWeight:'bold'}}>年龄:</font> 　{scope.countAge(dc.birthday)}岁</div>
		        <div><font style={{fontSize:'13px',fontWeight:'bold'}}>医龄:</font> 　{scope.countAge(dc.entryDate)}年</div>
		        <Row><Col span={2}><font style={{fontSize:'13px',fontWeight:'bold'}}>专长:</font></Col><Col span={22}>{dc.speciality}</Col></Row>
		        <Row><Col span={2}><font style={{fontSize:'13px',fontWeight:'bold'}}>出诊:</font></Col><Col span={22}>{dc.clinicDesc}</Col></Row>
		        </Col>
				</Row>
				</Card>);
			});
			this.setState({cditems:items});
			});
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
		    	let fetch = Ajax.del('api/elh/doctor/'+data.id, null, {catch: 3600});
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
	
	onCreate(){
		if(this.props.onCreate){
			this.props.onCreate(arguments);
		}
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
		    	let fetch = Ajax.del('api/elh/doctor/'+data.id, null, {catch: 3600});
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
	render () {
		let bStyle={marginRight:'3px'};
		const scope = this;
		return (
			<div style={{ minHeight:'500px'}}>
				<Row type="flex" justify="end">
				<Col>
				<Button type="primary" icon="plus" onClick={scope.onCreate.bind(scope)}>增加</Button>
				</Col>
				</Row>
		        <Row>
		        <Col span={7}>
		        <Affix offsetTop={80}>
		        <Card style={{height:'1000px'}}>
				 <Tree showLine onSelect={scope.onSelect.bind(scope)} onCheck={scope.onCheck}>
			    	{scope.state.imitems}
			     </Tree>
		        </Card>
		        </Affix>
		        </Col>
		        <Col span={17} >
		        {this.state.cditems}
		        </Col>
		        </Row>
		     </div>
		);
	}
}
module.exports = List;
