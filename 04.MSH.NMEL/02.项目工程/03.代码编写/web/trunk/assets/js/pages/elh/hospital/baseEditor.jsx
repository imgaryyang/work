
'use strict';

import { Component } from 'react';
import ReactDOM from 'react-dom';
import { Modal,Form,InputGroup,Select,Button,Input, DatePicker,Row, Col,Icon } from 'antd';
const confirm = Modal.confirm;
const FormItem = Form.Item;
const createForm = Form.create;

class EditorForm extends Component{
	constructor (props) {
		super(props);
		let cw = props.data.contactWays,tw = props.data.transportations;
		if(!cw || cw.length <=0 )cw=[{fkType:"",content:"",tmp:true}];
		if(!tw || tw.length <=0 )tw=[{fkType:"",content:"",tmp:true}];
		this.state={
			contactWays:cw,
			transportations:tw
		}
	}
	onReset(e){
		e.preventDefault();
	    this.props.form.resetFields();
	}
	onSubmit(e){
		let scope = this;
		e.preventDefault();
	    this.props.form.validateFields((errors, values) => {
	      if (!!errors) {
	    	  Modal.error({title: '表单校验失败'});
	        return;
	      }
	      scope.save(values);
	    });
	}
	save(data){
		var scope = this;
		//联系方式
		if(data.hosLevel && data.hosLevel.length>1)data.hosLevel=data.hosLevel[1];
		let contactWays=[]
		this.state.contactWays.map(function(contactWay,index){
			 if((contactWay.del !== true )&&(contactWay.tmp !== true )){
				 contactWays.push(contactWay);
			 }
		})
		data.contactWays=contactWays;
		
		let transportations=[]
		this.state.transportations.map(function(transportation,index){
			 if((transportation.del !== true )&&(transportation.tmp !== true )){
				 transportations.push(transportation);
			 }
		})
		data.transportations=transportations;
		
		let fetch = Ajax.put('api/elh/hospital/', data, {
			catch: 3600,dataType:'json' 
		});
		fetch.then(res => {
			if(res.success){
				scope.close();
				scope.refreshInfo()
			}
			else Modal.error({title: '保存失败'});
		});
	}
	close(){
		if(this.props.onClose){
			this.props.onClose(arguments);
		}
	}
	refreshInfo(){
		if(this.props.refreshInfo){
			this.props.refreshInfo(arguments);
		}
	}
	saveTWay(index){
		let fkId = this.props.data.id,fkType = "hospital";
		let type = this.props.form.getFieldValue('transportation.'+index+'.type');
		let content = this.props.form.getFieldValue('transportation.'+index+'.content');
		this.state.transportations[index]= {fkId:fkId,fkType:fkType,type:type,content:content,tmp:false};
		this.setState({transportations:this.state.transportations});
	}
	pushTWay(){
		this.state.transportations.push({type:"1",content:"",tmp:true}); 
		this.setState({transportations:this.state.transportations}); 
	}
	delTWay(index){
		this.state.transportations[index].del = true;
		let showed = 0;
		this.state.transportations.map(function(transportation,index){
			 if(!(transportation.del === true ))showed++; 
		})
		if(showed==0)this.state.transportations.push({type:"1",content:"",tmp:true}); 
		this.setState({transportations:this.state.transportations});
	}
	moveTWay(index){
		var scope = this,cwId = this.state.transportations[index].id;
		if(cwId){
			confirm({
			    title: '您确认要删除该交通方式吗？',
			    onOk() {
			    	let fetch = Ajax.del("api/elh/hospital/transportation/"+cwId, null, {catch: 3600});
					fetch.then(res => { 
						if(res.success){
							Modal.success({title: text+'成功'});
							scope.delCWay(index);
						}else{
							let msg = res.msg?res.msg:"";
							Modal.error({title: text+'失败,'+msg}); 
						}
				    	return res;
					});
			    },
			    onCancel() {},
			});
		}else{
			scope.delCWay(index);
		}
	}
	saveCWay(index){
		let fkId = this.props.data.id,fkType = "hospital";
		let type = this.props.form.getFieldValue('contactWay.'+index+'.type');
		let content = this.props.form.getFieldValue('contactWay.'+index+'.content');
		this.state.contactWays[index]= {fkId:fkId,fkType:fkType,type:type,content:content,tmp:false};
		console.info(this.state.contactWays[index]);
		this.setState({contactWays:this.state.contactWays});
	}
	pushCWay(){
		this.state.contactWays.push({type:"1",content:"",tmp:true}); 
		this.setState({contactWays:this.state.contactWays}); 
	}
	delCWay(index){
		this.state.contactWays[index].del = true;
		let showed = 0;
		this.state.contactWays.map(function(contactWay,index){
			 if(!(contactWay.del === true ))showed++; 
		})
		if(showed==0)this.state.contactWays.push({type:"1",content:"",tmp:true}); 
		this.setState({contactWays:this.state.contactWays});
	}
	moveCWay(index){
		var scope = this,cwId = this.state.contactWays[index].id;
		if(cwId){
			confirm({
			    title: '您确认要删除该联系方式吗？',
			    onOk() {
			    	let fetch = Ajax.del("api/elh/hospital/contactWay/"+cwId, null, {catch: 3600});
					fetch.then(res => { 
						if(res.success){
							Modal.success({title: '删除成功'});
							scope.delCWay(index);
						}else{
							let msg = res.msg?res.msg:"";
							Modal.error({title: '删除失败,'+msg}); 
						}
				    	return res;
					});
			    },
			    onCancel() {},
			});
		}else{
			scope.delCWay(index);
		}
	}
	render () {
		let types = [ {key:"1",value:"手机号"},{key:"2",value:"电话"},{key:"3",value:"传真"},{key:"4",value:"400电话"},{key:"5",value:"微信"},
		              {key:"6",value:"微博"},{key:"7",value:"QQ"},{key:"8",value:"EMAIL"}];
		let tTypes = [ {key:"1",value:"公交"},{key:"2",value:"地铁"} ];
		const { getFieldProps } = this.props.form,scope = this;
		const contactSize=this.state.contactWays.length;
		const tSize=this.state.transportations.length;
		return (
			<Form horizontal style={{display:'block'}}>
				<Input  type = "hidden" {...getFieldProps('id',{initialValue:this.props.data.id})} />
		    	<FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 10 }} label="地址" >
	        		<Input placeholder="地址" {...getFieldProps('address',{initialValue:this.props.data.address})} />
	        	</FormItem>
	        	{
	        		this.state.contactWays.map(function(contactWay,index){
	        			let selectBefore = (
	        					<Select style={{width:'100px'}} {...getFieldProps('contactWay.'+index+'.type',{initialValue:(contactWay.type?contactWay.type:'1')})}>
								{
									types.map(function(type,index){
										return <Select.Option value={type.key}>{type.value}</Select.Option>
									})
								}
								</Select>
	        			);
						return (
							<div style={{display:(contactWay.del === true)?"none":""}}>
								<FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 12 }} label="联系方式" >
									<Col span="20"><Input addonBefore={selectBefore} onBlur={scope.saveCWay.bind(scope,index)} {...getFieldProps('contactWay.'+index+'.content',{initialValue:contactWay.content})} /></Col>
									<Col span="4">
									{
										(contactWay.tmp === true )?(""):(
											<div>
											<Icon className="templOperationMinus" onClick={scope.moveCWay.bind(scope,index)} style={{margin:'0 4px',color:'white'}} type="cross"/>	
											{
												((contactSize-1) == index)?<Icon className="templOperationPlus" onClick={scope.pushCWay.bind(scope,index)} style={{margin:'0 4px',color:'white'}} type="plus"/>:""
											}
											</div>
										)
									}
									</Col>
								</FormItem>
			        		</div> 
						)
					})
	        	}
	        	{
	        		this.state.transportations.map(function(transportation,index){
	        			let selectBefore = (
	        					<Select style={{width:'100px'}} {...getFieldProps('transportation.'+index+'.type',{initialValue:(transportation.type?transportation.type:'1')})}>
								{
									tTypes.map(function(type,index){
										return <Select.Option value={type.key}>{type.value}</Select.Option>
									})
								}
								</Select>
	        			);
						return (
							<div style={{display:(transportation.del === true)?"none":""}}>
								<FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 12 }} label="交通方式" >
									<Col span="20"><Input addonBefore={selectBefore} onBlur={scope.saveTWay.bind(scope,index)} {...getFieldProps('transportation.'+index+'.content',{initialValue:transportation.content})} /></Col>
									<Col span="4">
									{
										(transportation.tmp === true )?(""):(
											<div>
											<Icon className="templOperationMinus" onClick={scope.moveTWay.bind(scope,index)} style={{margin:'0 4px',color:'white'}} type="cross"/>	
											{
												((tSize-1) == index)?<Icon className="templOperationPlus" onClick={scope.pushTWay.bind(scope,index)} style={{margin:'0 4px',color:'white'}} type="plus"/>:""
											}
											</div>
										)
									}
									</Col>
								</FormItem>
			        		</div> 
						)
					})
	        	}	
	        	<FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 10 }} label="简介" >
	        		<Input type='textarea' rows={6} placeholder="简介" {...getFieldProps('description',{initialValue:this.props.data.description})} />
	        	</FormItem>
	        	
		        <FormItem wrapperCol={{ span: 12, offset: 7 }} >
		        	<Button type="primary" onClick={this.onSubmit.bind(this)} htmlType="submit">保存</Button>&nbsp;&nbsp;&nbsp;
		        	<Button type="ghost" onClick={this.onReset.bind(this)}>重置</Button>
		        </FormItem>
			</Form>
		);
	}
}
const Editor = createForm()(EditorForm);
module.exports = Editor;