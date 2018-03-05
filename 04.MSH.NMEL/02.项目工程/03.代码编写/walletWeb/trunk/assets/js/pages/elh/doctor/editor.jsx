'use strict';

import { Component } from 'react';
import ReactDOM from 'react-dom';
import {Modal,Form,Select,Radio,Cascader,Row,Button,Input, DatePicker,Col,Upload,Icon  } from 'antd';

const confirm = Modal.confirm;
const FormItem = Form.Item;
const createForm = Form.create;
const RadioGroup = Radio.Group;

class CreateForm extends Component{
	constructor (props) {
		super(props);
		this.state={
				imgUrl:"",
				imgId:"",
				imgdata:{
					fkId:"",
					fkType:"",
					memo:"12",
					resolution:"13213",
					sortNum:"1"},
				dptItmData:{},
				dpt:[],
				dptItm:[],
				dptData:[],
				depart:{},
				};
		}
	
	componentWillMount(){
		const scope = this;
		console.log(JSON.stringify(this.props.data));
		//获取头像
		this.setState({imgUrl:"/api/el/base/images/view/"+this.props.data.portrait})
		//根据科室ID获取科室信息
		let departFc = Ajax.get('api/elh/department/'+this.props.data.departmentId, null, {catch: 3600});
		departFc.then(res=>{
			let resdata = res.result;
			this.setState({"depart":resdata});
			console.log("resdata:"+JSON.stringify(resdata));
		});
		//获取科室列表
		let fetch = Ajax.get('/api/elh/department/list/0/10',{data:{}}, {catch: 3600});
		const arrtype=[];
		fetch.then(res => {
			let resdata = res.result;
			const dps = res.result;
			let items={};
			let chitems=[];
				resdata.map(function(depart,index){
					let cmps = [];
					if(arrtype.indexOf(depart.type) === -1){
						arrtype.push(depart.type);
						 cmps =  dps.map(function(dp,idx){
							if(dp.type === depart.type){
								let dptjson = {};
								dptjson[dp.id] = dp.name;
								return dptjson;
							}
						});
						 for(var i = 0 ;i<cmps.length;i++){
							 if(cmps[i] == "" || typeof(cmps[i]) == "undefined"){
								 cmps.splice(i,1);
								 i= i-1;
								 }
							 }
							var newid = depart.type;
							 items[newid] = cmps;
					}
	    		});
				scope.setState({dptData:arrtype,dptItmData:items,dpt:items[arrtype[0]]});
				let itm = [];
				itm.push(items[arrtype[0]][0]);
				scope.setState({dptItm:itm})
		});
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
		var doctor={};
		var birdate = new Date(data.birthDay);
		var birth = birdate.toJSON();
		var entrydate = new Date(data.entryDate);
		var entry = entrydate.toJSON();
		doctor.name = data.name;
		doctor.gender = data.gender;
		doctor.jobTitle = data.jobTitle;
		doctor.speciality = data.speciality;
//		doctor.departmentId = data.department;
		doctor.portrait = this.state.imgId;
//		let clincstr = "";
//		let clindes = "";
//		if(data.clinic!=""){
//		data.clinic.map(function(cl,index){
//			switch(cl){
//			case "11":
//				clincstr += "1;am;";
//				clindes +="周一上午,";
//				break;
//			case "12":
//				clincstr += "1;pm;";
//				clindes +="周一下午,";
//				break;
//			case "21":
//				clincstr += "2;am;";
//				clindes +="周二上午,";
//				break;
//			case "22":
//				clincstr += "2;pm;";
//				clindes +="周二下午,";
//				break;
//			case "31":
//				clincstr += "3;am;";
//				clindes +="周三上午,";
//				break;
//			case "32":
//				clincstr += "3;pm;";
//				clindes +="周三下午,";
//				break;
//			case "41":
//				clincstr += "4;am;";
//				clindes +="周四上午,";
//				break;
//			case "42":
//				clincstr += "4;pm;";
//				clindes +="周四下午,";
//				break;
//			case "51":
//				clincstr += "5;am;";
//				clindes +="周五上午,";
//				break;
//			case "52":
//				clincstr += "5;pm;";
//				clindes +="周五下午,";
//				break;
//			case "61":
//				clincstr += "6;am;";
//				clindes +="周六上午,";
//				break;
//			case "62":
//				clincstr += "6;pm;";
//				clindes +="周六下午,";
//				break;
//			case "71":
//				clincstr += "7;am;";
//				clindes +="周日上午,";
//				break;
//			case "72":
//				clincstr += "7;pm;";
//				clindes +="周日下午,";
//				break;
//			}
//		});}
//		doctor.clinic= clincstr + data.regfee;
//		doctor.clinicDesc= clindes + "挂号费:"+ data.regfee;
		doctor.birthDay= birth.slice(0,10);
		doctor.entryDate = entry.slice(0,10);
		let fetch = Ajax.put('api/elh/doctor/'+this.props.data.id, doctor, {catch: 3600,dataType:'json'});
		fetch.then(res => {
			if(res.success){
				Modal.success({title:'修改成功!'});
				scope.close();
				}
			else Modal.error({title: '修改失败'});
		});
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
	
	handleDptChange(value) {
		this.setState({
			dptItm: this.state.dptItmData[value],
			});
		}
	
	onChange(file){
		this.setState({imgUrl:"/api/el/base/images/view/"+file.file.response.result.id})
			this.setState({imgId:file.file.response.result.id});
			//更新专家表中专家背景图ID
			let fetch = Ajax.put('/api/elh/app/hospt/specialBd/'+hospId+"/"+file.file.response.result.id,{data:{}}, {catch: 3600},{dataType:'json'});
		}
	
	onRemove(){
		let fetch = Ajax.del('/api/el/base/images/'+this.state.imgId,null, {catch: 3600});
		fetch.then(res=>{
			if(res.success){
				Modal.success({title:'删除成功!'});
				this.setState({imgUrl:""});
				}else{
					Modal.error({title:'删除失败！'});
				}
			});
		}
	
	beforeUpload(file){
		let imgdata={
				fkId:file.uid,
		    	fkType:file.type,
		    	memo:"12",
		    	resolution:"13213",
		    	sortNum:"1"};
		const isImg = (file.type == 'image/jpeg' || file.type == 'image/png');
		if (!isImg) {
			Modal.error({title: '只能上传图片(/*.jpg/*.png)文件！'});
			}
		return isImg;
		}
	
	render () {
		const dptOptions = this.state.dptData.map(dp => <Option key={dp}>{dp}</Option>);
		const dptItmOptions = this.state.dptItm.map(itm => {
			for(var key in itm){
				return <Option key={key}>{itm[key]}</Option>;
			}
		});
	    const { getFieldProps } = this.props.form;
		const scope = this;
	    const props = {
	    		action: '/api/el/base/images/upload',
	  	      	listType: 'picture-card',
	  	      	onPreview: (file) => {
	  	      		this.setState({
	  	            priviewImage: file.url,
	  	            priviewVisible: true,
	  	            });},
	  	          };
		return (
			<Form horizontal>
				<Input  type = "hidden" {...getFieldProps('hospitalId',{initialValue:this.props.param.hospitalId})} />
		    	<FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 8 }} label="头像" >
		        <div style={{textAlign:"center"}}>
		    		<img style={{height:"100px",width:"100px",borderRadius:"3px"}} src={scope.state.imgUrl} />
		    	</div>   
				<div className="clearfix" style={{textAlign:"center"}}>
					<Upload {...props} 
			        data={scope.state.imgdata}
			        onChange={scope.onChange.bind(scope)}
			        beforeUpload={scope.beforeUpload.bind(scope)}
			        onRemove={scope.onRemove.bind(scope)}		
			        accept="image/*">
			          <Icon type="plus" />
			          <div className="ant-upload-text">更换头像</div>
			        </Upload>
			       </div>
	        	</FormItem>
				<FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 8 }} label="科室选择" >
			     <div>
			        <Select placeholder="科室类型"  style={{ width: 100 }}
			        onChange={scope.handleDptChange.bind(scope)}  defaultValue={scope.state.depart.type}>
			          {dptOptions}
			        </Select>
			        <Select placeholder="科室" style={{ width: 120 }} {...getFieldProps('department')}>
			          {dptItmOptions}
			        </Select>
			      </div>	
	        	</FormItem>
	        	<FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 6 }} label="姓名" >
        		<Input  {...getFieldProps('name', { initialValue: scope.props.data.name })} />
        		</FormItem>
	        	<FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 6 }} label="职称" >
	        		<Input   {...getFieldProps('jobTitle', { initialValue: scope.props.data.jobTitle })}/>
	        	</FormItem>
	        	<FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 8 }} label="性别" >
	            <RadioGroup {...getFieldProps('gender',{ initialValue: scope.props.data.gender })}>
	            	<Radio value="1">男</Radio>
	            	<Radio value="0">女</Radio>
	            </RadioGroup>
	        	</FormItem>
	        	<FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 8 }} label="出生日期" >
	        		<DatePicker  format="yyyy-MM-dd" {...getFieldProps('birthDay', { initialValue: scope.props.data.birthday })}/>
	        	</FormItem>
	        	<FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 8 }} label="从医日期" >
	        		<DatePicker format="yyyy-MM-dd" {...getFieldProps('entryDate', { initialValue: scope.props.data.entryDate })}/>
	        	</FormItem>
		    	<FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 8 }} label="出诊时间" >
			     <div>
			     <Select multiple style={{ width: 300 }} placeholder="星期" {...getFieldProps('clinic',{initialValue:["11","31"]})}>
			     	<Option value="11">星期一上午</Option>
			     	<Option value="12">星期一下午</Option>
			     	<Option value="21">星期二上午</Option>
			     	<Option value="22">星期二下午</Option>
			     	<Option value="31">星期三上午</Option>
			     	<Option value="32">星期三下午</Option>
			     	<Option value="41">星期四上午</Option>
			     	<Option value="42">星期四下午</Option>
			     	<Option value="51">星期五上午</Option>
			     	<Option value="52">星期五下午</Option>
			     	<Option value="61">星期六上午</Option>
			     	<Option value="62">星期六下午</Option>
			     	<Option value="71">星期日上午</Option>
			     	<Option value="72">星期日下午</Option>
			     </Select>
			      </div>	
	        	</FormItem>
	        	<FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 6 }} label="挂号费" >
        			<Input placeholder="挂号费" {...getFieldProps('regfee')} />
        		</FormItem>
        		<FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 8 }} label="特长" >
        		<Input type="textarea" rows={4} {...getFieldProps('speciality',{ initialValue: scope.props.data.speciality })}/>
        		</FormItem>
		        <FormItem wrapperCol={{ span: 12, offset: 7 }} >
		        	<Button type="primary" onClick={this.onSubmit.bind(this)} htmlType="submit">保存</Button>&nbsp;&nbsp;&nbsp;
		        	<Button type="ghost" onClick={this.onReset.bind(this)}>重置</Button>
		        </FormItem>
			</Form>
		);
	}
}
const Create = createForm()(CreateForm);

module.exports = Create
