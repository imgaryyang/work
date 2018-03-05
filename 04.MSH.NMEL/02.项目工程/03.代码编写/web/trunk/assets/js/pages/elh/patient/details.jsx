'use strict';

import { Component } from 'react';
import ReactDOM from 'react-dom';
import { Modal,Button,Input,Table,Row,Col,Card  } from 'antd';

class DoctorEditor extends Component {
	constructor (props) {
		super(props);
		this.state={
				total:0,
				treatmentrd:[],
				medcheck:[],
				doctor:{},
				jobTitle:"",
				index:0,
				medicalCard:[],
				imgUrl:"/api/el/base/images/view/"+this.props.data[1].portrait,
				};
		const scope=this;
		this.version= props.version;
		}
	
	componentWillMount(){
		let fetch = Ajax.get('/api/elh/treat/treatment/list/0/5',{patient:this.props.data[1].id}, {catch: 3600});
		fetch.then(res => {
			let treatmentrd = res.result,total=res.total,start=res.start;
			this.setState({ total: total,treatmentrd:treatmentrd});
	    	return res;
		});
		let medfetch = Ajax.get('/api/elh/treat/medicalcheck/list/0/5',{patientId:this.props.data[1].id}, {catch: 3600});
		medfetch.then(res => {
			let medcheck = res.result;
			this.setState({medcheck:medcheck});
	    	return res;
		});
		
		let cardfetch = Ajax.get('/api/elh/medicalCard/my/user/'+ this.props.data[1].id,null, {catch: 3600});
		cardfetch.then(res => {
			let medicalCard =[];
				medicalCard[0] = res.result;
			this.setState({medicalCard:medicalCard});
	    	return res;
		});
		}
	
	getDocTitle(doctorId){
		let doctorFetch = Ajax.get('/api/elh/doctor/'+doctorId,null, {catch: 3600});
		doctorFetch.then(res => {
			let doctor = res.result;
			this.setState({jobTitle:doctor.jobTitle});
			return res;
			});	
	}
	
	onTreatment(row){
		if(this.props.onTreatment){
			this.props.onTreatment(row);
			}
		}
	
	onCheckDetail(row){
		if(this.props.onCheckDetail){
			this.props.onCheckDetail(row);
			}
		}
	
	onMoreTreat(id){
		if(this.props.onMoreTreat){
			this.props.onMoreTreat(id);
			}
		}
	
	onMoreCheck(){
		if(this.props.onMoreCheck){
			this.props.onMoreCheck();
			}
		}
	
	render () {
		const gscope=this;
		return (
				<div>
				<Row><Col span={5}>
				<Card  style={{height:200 }}>
				<div className="custom-image">
				<img src={this.state.imgUrl}  width='90%' height="150px"/>
				</div>
				<div className="custom-card">
				<p><h3>{this.props.data[1].name}{this.props.data[1].gender}</h3></p>
				</div>
				</Card></Col>
				
				<Col span={18} push={1}>				
				<Card style={{height:200,lineHeight:2 }}>
				<Row><Col span="5"><p style={{fontWeight:'bold'}}>昵称</p></Col>
				<Col span="5">{this.props.data[1].nickname}</Col></Row>

				<Row><Col span="5"><p style={{fontWeight:'bold'}}>身份证号</p></Col>
				<Col span="5">{this.props.data[1].idCardNo}</Col></Row>
				
				<Row><Col span="5"><p style={{fontWeight:'bold'}}>手机号</p></Col>
				<Col span="5">{this.props.data[1].mobile}</Col></Row>

				<Row><Col span="5"><p style={{fontWeight:'bold'}}>电子邮箱</p></Col>
				<Col span="5">{this.props.data[1].email}</Col></Row>

				<Row><Col span="5"><p style={{fontWeight:'bold'}}>微信</p></Col>
				<Col span="5">{this.props.data[1].wechat}</Col></Row>

				<Row><Col span="5"><p style={{fontWeight:'bold'}}>微博</p></Col>
				<Col span="5">{this.props.data[1].weibo}</Col></Row>
				</Card></Col></Row>
				<hr/>
				<div style={{background:"#bbffaa",borderRadius:'3px'}}>
				<Row type='flex' align='middle'>
				<Col span={3} push={7}><p style={{fontSize:'1.1em',fontWeight:'bold'}}>社保卡:</p></Col>
				<Col span={4} push={5}><p style={{fontSize:'1.3em'}}>{this.props.data[1].siId}</p></Col>
				</Row>
				</div>
	
				{
					this.state.medicalCard.map(function(card,index){
						 return <div style={{background:"#bbffaa",borderRadius:'3px'}}>
						    <Row type='flex' align='middle'>
						    <Col span={3} push={7}><p style={{fontSize:'1.1em',fontWeight:'bold'}}>就诊卡:</p></Col>
							<Col span={4} push={5}><p style={{fontSize:'1.3em'}}>{card.cardNo}</p></Col>
							<Col span={4} push={5}><App/></Col>
							</Row></div>;
					})
				}
				<hr/>
				<Row>
				<Col span="8"><Card title="就诊记录" bordered={true} extra={<a onClick={gscope.onMoreTreat.bind(gscope,gscope.props.data[1].id)}>更多>></a>} className='list-card'>
				{
					this.state.treatmentrd.map(function(treatment,index){
						if(index<6){
							return <p><a onClick={gscope.onTreatment.bind(gscope,treatment)}>[{treatment.createTime}]{treatment.departmentName}-{treatment.doctorName}</a></p>;
						}	
					})
				}</Card></Col>
  
				<Col span="8"><Card title="报告单" bordered={true} extra={<a onClick={gscope.onMoreCheck.bind(gscope)}>更多>></a>} className='list-card'>
				{
					this.state.medcheck.map(function(check,index){
						if(index < 6){
							return <p><a onClick={gscope.onCheckDetail.bind(gscope,check)}>[{check.checkTime}] {check.department}-{check.subject}</a></p>;
						}
					})
				}</Card></Col>
  
				<Col span="8"><Card title="结算信息" bordered={true} className='list-card'>
					Card content</Card></Col></Row></div>
					);
		}
	}

const App = React.createClass({
	  getInitialState() {
	    return { visible: false };
	  },
	  showModal() {
	    this.setState({
	      visible: true,
	    });
	  },
	  handleOk() {
	    this.setState({
	      visible: false,
	    });
	  },
	  handleCancel(e) {
	    this.setState({
	      visible: false,
	    });
	  },
	  render() {
	    return (
	      <div>
	      <Button type="primary" onClick={this.showModal}>变更</Button>
	        <Modal title="变更就诊卡" visible={this.state.visible}
	          onOk={this.handleOk} onCancel={this.handleCancel}>
	          <Input placeholder="输入新的就诊卡号" />
	        </Modal>
	      </div>
	    );
	  },
	});	
module.exports = DoctorEditor;