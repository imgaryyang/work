'use strict';

import { Component } from 'react';
import ReactDOM from 'react-dom';
import { Form, Modal,Input,Select, Button,Cascader , Checkbox,Table  } from 'antd';
const confirm = Modal.confirm;
const FormItem = Form.Item;
const createForm = Form.create;

class registSourceForm extends Component{
	constructor (props) {
		super(props);
		this.state={
			hospitals:[],
			departments:[]
		}
	}
	componentWillMount () {
		let fetch = Ajax.get('api/elh/hospital/listAll', null, {catch: 3600});
		fetch.then(res => {
			let data = res.result,total=res.total,start=res.start;
			if(res.success)this.setState({ hospitals: data});
	    	return res;
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
	SelectHos(hospitalId){
		if(this.hospitalId != hospitalId ){
			this.hospitalId=hospitalId;
			let fetch = Ajax.get('api/elh/department/listByHos/'+hospitalId, null, {catch: 3600});
			fetch.then(res => {
				let data = res.result,total=res.total,start=res.start;
				if(res.success)this.setState({ departments: data});
		    	return res;
			});
		}
	}
	render () {console.info(this.state);
		const { getFieldProps } = this.props.form,scope=this;
		return (
			<Form inline className="table-top-form">
				<FormItem label="医院">
					<Select style={{width:'200px'}} onSelect={this.SelectHos.bind(this)} placeholder="医院" {...getFieldProps('hospital')} >
					{
						this.state.hospitals.map(function(hospital,index){
							return <Select.Option value={hospital.id}>{hospital.name}</Select.Option>
						})
					}
		        	</Select> 
		        </FormItem>
		        <FormItem label="科室" >
			        <Select style={{width:'200px'}} placeholder="科室" {...getFieldProps('department')} >
					{
						scope.state.departments.map(function(department,index){
							return <Select.Option value={department.id}>{department.name}</Select.Option>
						})
					}
		        	</Select> 
		    	</FormItem>
		        <FormItem >
		        	<Button type="primary" onClick={this.onSubmit.bind(this)} htmlType="submit">查询</Button>&nbsp;&nbsp;&nbsp;
		        </FormItem>
		    </Form>
		);
	}
}
const SourceForm = createForm()(registSourceForm);

class RegistForm extends Component{
	constructor (props) {
		super(props);
		this.state={
			visible: false,
			patients:[],
			cards:[]
		}
	}
	componentWillMount () {
		let fetch = Ajax.get('api/elh/userPatient/list/0/100', null, {catch: 3600});
		fetch.then(res => {
			let data = res.result,total=res.total,start=res.start;
			if(res.success)this.setState({ patients: data});
	    	return res;
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
	    	  let patient=null;
	    	  for(var m in this.state.patients){
	    		  let p = this.state.patients[m];
	    		  if(values.patient == p.id )patient=p;
	    	  }
	    	  values.patient = patient;
	    	  let card=null;
	    	  for(var n in this.state.cards){
	    		  let c = this.state.cards[n];
	    		  if(values.card == c.id )card=c;
	    	  }
	    	  values.card = card;
	    	  console.info(values);
	    	  this.props.onSearch(values);
	      }
	    });
	}
	selectPatient(userPatientId){
		let patientId = userPatientId;
		for(var m in this.state.patients){
  		  let p = this.state.patients[m];
  		  if(userPatientId == p.id )patientId=p.patientId;
  	  	}
		
		if(this.patientId != patientId ){
			this.patientId=patientId;
			let param  = JSON.stringify({patientId:this.patientId});
			let fetch = Ajax.get('api/elh/medicalCard/list/0/100', {data:param}, {catch: 3600});
			fetch.then(res => {
				let data = res.result,total=res.total,start=res.start;
				if(res.success)this.setState({ cards: data?data:[]});
		    	return res;
			});
		}
	}
	render () {
		const { getFieldProps } = this.props.form,scope=this;
		return (
			<Form inline className="table-top-form">
				<FormItem label="就诊人">
					<Select style={{width:'200px'}} onSelect={this.selectPatient.bind(this)} placeholder="就诊人" {...getFieldProps('patient')} >
					{
						this.state.patients.map(function(patient,index){
							return <Select.Option value={patient.id}>{patient.name}</Select.Option>
						})
					}
		        	</Select> 
		        </FormItem>
		        <FormItem label="卡" >
			        <Select style={{width:'200px'}} placeholder="卡" {...getFieldProps('card')} >
					{
						scope.state.cards.map(function(card,index){
							return <Select.Option value={card.id}>{card.cardNo}</Select.Option>
						})
					}
		        	</Select> 
		    	</FormItem>
		    	 <FormItem >
		        	<Button type="primary" onClick={this.onSubmit.bind(this)} htmlType="submit">挂号</Button>&nbsp;&nbsp;&nbsp;
		        </FormItem>
		    </Form>
		);
	}
}
const RegForm = createForm()(RegistForm);

class SourceList extends Component {
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
			modalVisible:false,
	        loading : false
		};
		this.version= props.version;
	}
	componentWillMount () {
		//this.goToPage(1);
	}
	componentDidUpdate(){
		if(this.version != this.props.version){
			 this.version = this.props.version;
			 this.refresh();
		}
	}
	getColumn (){
		const scope = this;
		return [{title: '时间',dataIndex: 'date'},
		        {title: '午别',dataIndex: 'noon',},
		        {title: '费用',dataIndex: 'amt'},
		        {title: '可挂数量',dataIndex: 'total',},
		        {title: '剩余数量',dataIndex: 'last',},
		        {
			title: '操作',
			dataIndex: 'opt',
			render(text,record,index) {
				return <Button type="primary" onClick={scope.registWindow.bind(scope,record)}>挂号</Button>;
			},
		}];
	}
	registWindow(row){
		this.sourceRecord=row;
		this.setState({modalVisible:true});
	}
	regist(params){
		let values = params;
		let data = this.sourceRecord;
		data.patientName=values.patient.name;
		data.patient=values.patient.patientId;
		data.patientHlht=values.patient.idHlht;
		data.cardNo=values.card.cardNo;
		data.cardType=values.card.typeId;
		data.cardTypeName=values.card.typeName;
		data.optAccount='';
		console.info('this.refs.regForm',data); 
		let fetch = Ajax.post('api/elh/treat/reg/appoint', data, {catch: 3600});
		fetch.then(res => {
			let data = res.result,total=res.total,start=res.start;
			if(res.success){
				console.info(res);
				//this.setState({modalVisible:false,});
			}else{
				 Modal.error({title: '挂号失败'});
			}
	    	return res;
		});
	}
	onSearch(data){
		this.state.searchParams = data;
		this.refresh();
	}
	refresh(){
		this.goToPage(this.state.pagination.current);
	}
	goToPage(pageNo){
		this.setState({loading:true});
		let data = this.state.searchParams;
		data.regType='0';
		let param  = JSON.stringify(data);
		let fetch = Ajax.get('api/elh/treat/registSources/', {data:param}, {catch: 3600});
		fetch.then(res => {
			let data = res.result,total=res.total,start=res.start;
			this.setState({data:data,loading:false});
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
	handleOk(){ 
		this.setState({modalVisible:false,});
	}
	handleCancel(){
		this.setState({modalVisible:false,});
	}
	render () {
		let bStyle={marginRight:'3px'};
		return (
			<div style={{ minHeight:'500px'}}>
				<SourceForm onSearch={this.onSearch.bind(this)}/>
		        <Table 
		        	columns={this.getColumn()} 
			        rowKey={record => record.id}
			        dataSource={this.state.data}
			        loading={this.state.loading}
		        	dataSource={this.state.data}/>
				<Modal title="预约挂号" visible={this.state.modalVisible} onOk={this.handleOk.bind(this)} onCancel={this.handleCancel.bind(this)}>
					<RegForm ref='regForm' onSearch={this.regist.bind(this)}/>
			    </Modal>
			</div>
		);
	}
}
module.exports = SourceList;
//
