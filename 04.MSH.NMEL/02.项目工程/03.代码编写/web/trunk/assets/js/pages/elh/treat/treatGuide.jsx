'use strict';

import { Component } from 'react';
import ReactDOM from 'react-dom';
import { Timeline, Modal,Icon ,Button} from 'antd';

class Guide extends Component {
	constructor (props) {
		super(props);
		this.state={
				treatment:{
					groups:[]
				}
		}
	}
	componentWillMount () {
		let fetch = Ajax.get('api/elh/treat/treatGuide/'+this.props.data.id, null, {catch: 3600});
		fetch.then(res => {
			let data = res.result,total=res.total,start=res.start;
			if(!data.groups)data.groups=[]
			if(res.success)this.setState({ treatment: data});
	    	return res;
		});
	}
	onPayOrder(order){
		console.info('onPayOrder',order);
		let fetch = Ajax.post('api/elh/treat/pay/callback/'+order.id, null, {catch: 3600});
		fetch.then(res => {console.info(res);
			let data = res.result,total=res.total,start=res.start;
	    	return res;
		});
	}
	/**
	 * 导诊步骤 - 订单支付
	 */
	renderOrder(step, idx){
		let bizObject = step.bizObject,styleTime={ marginLeft: '-50px',marginRight:"5px" },styleClock={ fontSize: '12px' };
		let updateTime=step.updateTime.split(" ")[1];
		if(!bizObject.charges)bizObject.charges=[];
		let dot=(<span><a style={styleTime}>{updateTime}</a><Icon type="plus-square" style={styleClock} /></span>);
		return (
			<Timeline.Item dot={dot}  color="blue">
				<p>{bizObject.description}</p>
		 		{bizObject.charges.map(function(charge,i){
		 			return (<p>{charge.name}</p>)
		 		})}
			</Timeline.Item>
		);  
	}
	/**
	 * 导诊步骤 - 取药
	 */
	renderDrugOrder(step, idx){
		let bizObject = step.bizObject,styleTime={ marginLeft: '-55px',marginRight:"5px" },styleClock={ fontSize: '12px' };
		let updateTime=step.updateTime.split(" ")[1];
		let dot=(<span><a style={styleTime}>{updateTime}</a><Icon type="plus-square" style={styleClock} /></span>);
		if(!bizObject.details)bizObject.details=[];
		return (
			<Timeline.Item dot={dot}  color="blue">
				<p>{bizObject.description}</p>
		 		{bizObject.details.map(function(detail,i){
		 			return (<p>{detail.name}</p>)
		 		})}
			</Timeline.Item>
		);   
	}
	/**
	 * 导诊步骤 - 检查
	 */
	renderMedicalCheck(step, idx){
		let bizObject = step.bizObject,styleTime={ marginLeft: '-50px',marginRight:"5px" },styleClock={ fontSize: '12px' };
		let updateTime=step.updateTime.split(" ")[1];
		let dot=(<span><a style={styleTime}>{updateTime}</a><Icon type="plus-square" style={styleClock} /></span>);
		return (
			<Timeline.Item dot={dot}  color="blue">
		 		{bizObject.description}
			</Timeline.Item>
		);   
	}
	/**
	 * 导诊步骤 - 看诊
	 */
	renderDiagnosis(step, idx){
		let bizObject = step.bizObject,styleTime={ marginLeft: '-50px',marginRight:"5px" },styleClock={ fontSize: '12px' };
		let updateTime=step.updateTime.split(" ")[1];
		let dot=(<span><a style={styleTime}>{updateTime}</a><Icon type="plus-square" style={styleClock} /></span>);
		return (
			<Timeline.Item dot={dot}  color="blue">
		 		{bizObject.description}
			</Timeline.Item>
		);   
	}
	/**
	 * 导诊步骤 - 治疗
	 */
	renderCure(step, idx){
		let bizObject = step.bizObject,styleTime={ marginLeft: '-50px',marginRight:"5px" },styleClock={ fontSize: '12px' };
		let updateTime=step.updateTime.split(" ")[1];
		let dot=(<span><a style={styleTime}>{updateTime}</a><Icon type="plus-square" style={styleClock} /></span>);
		return (
			<Timeline.Item dot={dot}  color="blue">
		 		{bizObject.description}
			</Timeline.Item>
		);   
	}
	/**
	 * 导诊步骤 - 挂号
	 */
	renderRegister (step, idx) {
		let bizObject = step.bizObject,styleTime={ marginLeft: '-50px',marginRight:"5px" },styleClock={ fontSize: '12px' };
		let updateTime=step.updateTime.split(" ")[1];
		let dot=(<span><a style={styleTime}>{updateTime}</a><Icon type="plus-square" style={styleClock} /></span>);
		return (
			<Timeline.Item dot={dot}  color="blue">
		 		{bizObject.description}
			</Timeline.Item>
		);  
	}
	renderSteps(step,index){
		if(step.bizType=='order'){
			return this.renderOrder(step,index);
		}
		if(step.bizType=='drugOrder'){
			return this.renderDrugOrder(step,index);
		}
		if(step.bizType=='medicalCheck'){
			return this.renderMedicalCheck(step,index);
		}
		if(step.bizType=='diagnosis'){
			return this.renderDiagnosis(step,index);
		}
		if(step.bizType=='cure'){
			return this.renderCure(step,index);
		}
		if(step.bizType=='register'){
			return this.renderRegister(step,index);
		}
	}
	render () {//<Button type="primary" onClick={scope.onPayOrder.bind(scope,step.bizObject)}>支付</Button>
		let scope =this,styleClock={ fontSize: '16px' },styleTime={ marginLeft: '-70px',marginRight:"5px" };
		return (
			 <Timeline style={{marginLeft: '60px' }}>
			 {
				 this.state.treatment.groups.map(function(group,index){ 
					 if(!group)return "";
					 let steps=[],updateTime=group.updateTime.split(" ")[0];;
					 let dot=(<span><a style={styleTime}>{updateTime}</a><Icon type="clock-circle-o" style={styleClock} /></span>);
					 steps.push(
						 <Timeline.Item dot={dot}  color="red">
						 	{group.name}
						 </Timeline.Item>
					 );
					 if(group.steps){
						 group.steps.map(function(step,index){
							 steps.push(scope.renderSteps(step));
						 })
					 }
					 return steps; 
				})
			 }
			 </Timeline>
		);
	}
}
module.exports = Guide
