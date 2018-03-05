'use strict';

import { Component } from 'react';
import ReactDOM from 'react-dom';
import { Transfer,Button,Upload, Icon,Row,Col,Modal,Card } from 'antd';

class List extends Component {
	constructor (props) {
		super(props);
		const scope = this;
		this.state = {
	        loading : false,
	        mockData: [],
	        targetKeys: [],
	        goneKeys:[],
	        imgUrl:"",
	        imgId:"",
	        imgdata:{	   
	        	fkId:"",
	    		fkType:"",
	    		memo:"12",
	    		resolution:"13213",
	    		sortNum:"1"},
	    		};
		this.version= props.version;
	}
	
	componentWillMount(){
		let fetch = Ajax.get("/api/elh/hospital/",null, {catch: 3600});
		fetch.then(res=>{
			let hospital = res.result;
			this.setState({imgUrl:"/api/el/base/images/view/"+hospital.featureBackground});
			console.log(this.state.imgUrl);
		});
	}
	
	componentDidMount() {
		this.getMock();
	}
	
	getMock() {
		const scope = this;
		const targetKeys = [];
		const mockData = [];
//		let fetch = Ajax.get('/api/elh/department/listByHos/'+hospId,null, {catch: 3600});
		let fetch = Ajax.get('/api/elh/department/list/0/10',{data:{}}, {catch: 3600});
		fetch.then(res => {
			let resdata = res.result;
			scope.setState({departMent:resdata});
			resdata.map(function(department,index){
				const data = {
						key: `${department.id}`,
						index:index,
						title: `${department.name}`,
						description: `内容的描述`,
						};
				if (department.isSpecial) {
					targetKeys.push(data.key);
					}
				mockData.push(data);
				scope.setState();
				});
			scope.setState({ mockData, targetKeys}); 
		});
		}
	
	handleChange(targetKeys, direction, moveKeys) {
		if(direction=="left"){
			moveKeys.map(function(key,index){
				let fetch = Ajax.put('/api/elh/department/special/move/'+key,{data:{}}, {catch: 3600},{dataType:'json'});
				});
				this.setState({ targetKeys });
			}else{
				moveKeys.map(function(key,index){
					let fetch = Ajax.put('/api/elh/department/special/set/'+key,{data:{}}, {catch: 3600},{dataType:'json'});
					});
					this.setState({ targetKeys });
			}
			}
	
	onSubmit(){
		this.state.targetKeys.map(function(key,index){
			let fetch = Ajax.put('/api/elh/department/special/set/'+key,{data:{}}, {catch: 3600},{dataType:'json'});
		});
	}
	
	getInitialState() {
		return {
			priviewVisible: false,
			priviewImage: '',
			};
		}
	
	handleCancel() {
		this.setState({priviewVisible: false,});
		}
	
	onChange(file){
		this.setState({imgUrl:"/api/el/base/images/view/"+file.file.response.result.id})
		this.setState({imgId:file.file.response.result.id});
		let fetch = Ajax.put('/api/elh/hospital/',{'featureBackground':file.file.response.result.id}, {catch: 3600},{dataType:'json'});
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
	    		fkType:"",
	    		memo:"12",
	    		resolution:"13213",
	    		sortNum:"1"};
		this.setState({imgdata:imgdata});
		  const isImg = (file.type == 'image/jpeg' || file.type == 'image/png');
		  if (!isImg) {
			  Modal.error({title: '只能上传图片(/*.jpg/*.png)文件！'});
		  }
		  return isImg;
		  }
	
	render () {
		const scope = this;
	    const props = {
	    		action: '/api/el/base/images/upload',
	    		listType: 'picture-card',
	    		onPreview: (file) => {
	    			this.setState({
	    				priviewImage: file.url,
	    				priviewVisible: true,});
	    			},
	    		};
	    return (
	    		<Row>
	    		
	    		<Col>
	    		<Card>
	    		  <div style={{textAlign:"center"}}>
	    			<Transfer 
	    			dataSource={scope.state.mockData} 
	    			targetKeys={scope.state.targetKeys} 
	    			onChange={scope.handleChange.bind(scope)} 
	    			titles = {['现有科室','特色科室']}
	    			listStyle={{width: 260,height: 260,}} 
	    			showSearch
	    			render={item => item.title} />
	    		  </div>
	    			</Card>
	    		</Col>
	    		<Col>
	    		<br/>
	    		<Card>
	    		<div style={{textAlign:"center"}} className="clearfix">
	    		<Upload {...props} 
	    		data={scope.state.imgdata}
	    		beforeUpload={scope.beforeUpload.bind(scope)}
	    		onChange={scope.onChange.bind(scope)}
		        onRemove={scope.onRemove.bind(scope)}
	    		accept="image/*">
	    		<Icon type="plus" />
	    			<div className="ant-upload-text">上传背景图片</div>
	    		</Upload>
	    		<Modal visible={scope.state.priviewVisible} footer={null} onCancel={scope.handleCancel.bind(scope)}>
	    		<img style={{height:"150px",width:"450px",borderRadius:"6px"}} src={scope.state.imgUrl} />
	    		</Modal>
	    		</div>
	    		<div style={{textAlign:"center"}}>
	    		<img style={{height:"150px",width:"450px",borderRadius:"6px"}} src={scope.state.imgUrl} />
	    		</div>
	    	    </Card>
	    		</Col>
    		</Row>
		);
	}
}

module.exports = List;



