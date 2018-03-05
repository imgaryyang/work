'use strict';
import { Component } from 'react';
import ReactDOM from 'react-dom';
import { Modal,Input,Button,Table,Row,Col,Card  } from 'antd';

class Create extends Component {
	constructor (props) {
		super(props);
		this.state={drug:[],mclist:[],doctor:{},patient:{},imgUrl:""};
		}
	
	componentWillMount(){
		let fetch = Ajax.get('/api/elh/treat/treatment/'+this.props.data.id,null, {catch: 3600});
		fetch.then(res => {
			let data = res.result;
			this.setState({drug:data.drugOrder[0].details});
	    	return res;
			});
		
		let clfetch = Ajax.get('/api/elh/treat/medicalcheck/list/0/100',{treatment:this.props.data.id}, {catch: 3600});
		clfetch.then(res => {
			let mclist = res.result;
			this.setState({mclist:mclist});
	    	return res;
			});
		
		let doctorFetch = Ajax.get('/api/elh/doctor/'+this.props.data.doctorId,null, {catch: 3600});
		doctorFetch.then(res => {
			let doctor = res.result;
			this.setState({doctor:doctor});
	    	return res;
			});
		let patientFetch = Ajax.get('/api/elh/patient/'+this.props.data.patientId,null, {catch: 3600});
		patientFetch.then(res => {
			let patient = res.result;
//			this.setState({patient:patient[0][0]});
			this.setState({imgUrl:"/api/el/base/images/view/"+patient.photo});
	    	return res;
			});
		}
	
	onCheckDetail(row){
		if(this.props.onCheckDetail){
			this.props.onCheckDetail(row);
			}
		}
	
	getColumn (){
		const scope = this;
		return [{
			title: '项目',
			dataIndex: 'name',
			render(text,record,index){
				return <p>{record.name}</p>
			},
		}, {
			title: '数量',
			dataIndex: 'amount',
			render(text,record,index) {
				return <p>{record.amount}</p>;
			},
		},{
			title: '单位',
			dataIndex: 'unit',
			render(text,record,index){
				return <p>{record.unit}</p>
			},
		}
		];
	}
	
	render () {
		const gscope=this;
		return (
	<div>
	  <div style={{textAlign:"center"}}><h1>就诊记录</h1></div>
	  
	  <hr/>	   
	  
	  <Row type="flex" align='middle'>
	      <Col span={8}>
	      <div style={{textAlign:'center'}}><img src={this.state.imgUrl} width='130px' height="120px"/></div>
		  <p style={{textAlign:'center'}}>{this.props.data.patientName}</p>
		  </Col>
		  <Col span={6} push={2}>
	          <img style={{height:'60px',marginRight:'30px',width:'60px'}}src="../images/01-logo-mini.png"/>
	      </Col>
	      <Col span={6} pull={2}>
		   <p><font size='5'>{this.props.data.hospitalName}</font></p>   
	      </Col>
	   </Row>
	   
	   <hr/>
	   
	   <Row>
	   <Col span={8}>
	   <div className="gutter-box-title">
       	<p><font size='6'>{this.props.data.departmentName}</font></p> 
       </div></Col>
	   <Col span={16}>
	   <div className="gutter-box">
	   	<p style={{marginLeft:'30px'}}><font size='2'>主诊医生:{this.state.doctor.name}[{this.state.doctor.jobTitle}]</font></p>
	   	<p style={{marginLeft:'30px'}}><font size='2'>就诊时间:{this.props.data.createTime}</font></p>
	   	<p style={{marginLeft:'30px'}}><font size='2'>诊断结果:</font><font size='3' color='red'>{this.props.data.medcialResult}</font></p>
	   	</div></Col>
	   </Row>
	   
   <hr/>
   
   <h3>检查单</h3>
   
   <hr/>
   
   {
	   this.state.mclist.map(function(mcheck,index){
		  return <Row><Col span={8} push={4}>
	       <p style={{fontSize:'1.3em'}}>{mcheck.subject}</p>
	       </Col>
	       <Col span={8} push={8}>
		   <p style={{fontSize:'1.3em'}}><a onClick={gscope.onCheckDetail.bind(gscope,mcheck)}>查看结果>></a></p>
		   </Col></Row>
	   })
   }

   <hr/>
   
   <h3>开药</h3>
   
   <hr/>
   
	<Table columns={this.getColumn()} dataSource={this.state.drug} rowKey={record => record.id}	pagination={false}/>
   
	<hr/>
</div>
    );
  }
}
module.exports = Create
