'use strict';

import { Component } from 'react';
import ReactDOM from 'react-dom';
import { Transfer,Button,Upload, Icon,Row,Col,Modal,Card,Tree } from 'antd';

const TreeNode = Tree.TreeNode;
class List extends Component {
	constructor (props) {
		super(props);
		const scope = this;
		this.state = {
				loading : false,
				mockData:[],
				targetKeys:[],
				goneKeys:[],
				departMent:[],
				doctor:[],
				imgId:"",
				imgUrl:"",
				imitems:[],
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
	    	//获取专家背景图
	    let imgfetch = Ajax.get("/api/elh/hospital/",null, {catch: 3600});
	    	imgfetch.then(res=>{
	    		let hospital = res.result;
	    			this.setState({imgUrl:"/api/el/base/images/view/"+hospital.expertBackground});
	    		});	    	
		}
	
	onSubmit(){
		this.state.targetKeys.map(function(key,index){
			let fetch = Ajax.put('/api/elh/department/special/set/'+key,{data:{}}, {catch: 3600},{dataType:'json'});
		});
	}
	
	onSelect(info) {
		const mockData = [];
		const targetKeys = [];
		const scope = this;
		let dc = {};
		dc.departmentId = info[0];
		let param = JSON.stringify(dc);
		let fetch = Ajax.get('/api/elh/doctor/list/0/10',{data:param}, {catch: 3600});
		fetch.then(res => {
			let doctor = res.result;
			this.setState({doctor:doctor});
			if(doctor!=null){
			doctor.map(function(d,index){
				const data = {
						key:`${d.id}`,
				  	    index:index,
				  	    title:`${d.name}`,
				  	    description:`内容的描述`,
				  	    };
				if(d.isExpert == '1'){
					targetKeys.push(data.key);
					}
				mockData.push(data);
				scope.setState();
				});
			}
			scope.setState({ mockData,targetKeys });
			});
		}
	
	handleChange(targetKeys, direction, moveKeys) {
		if(direction=="left"){
			moveKeys.map(function(key,index){
				let fetch = Ajax.put('/api/elh/doctor/expert/move/'+key,{data:{}}, {catch: 3600},{dataType:'json'});
				});
			this.setState({ targetKeys });
			}else{
				moveKeys.map(function(key,index){
					let fetch = Ajax.put('/api/elh/doctor/expert/set/'+key,{data:{}}, {catch: 3600},{dataType:'json'});
					});
				this.setState({ targetKeys });
				}

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
		//更新专家表中专家背景图ID
		let fetch = Ajax.put('/api/elh/hospital/',{'expertBackground':file.file.response.result.id}, {catch: 3600},{dataType:'json'});
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
	    		<div>
	    		<Card>
	    		<Row>
	    		<Col span={7} push={1}>
				<Card title="科室" style={{ width: 260 }}>
				 <Tree showLine onSelect={scope.onSelect.bind(scope)} onCheck={scope.onCheck}>
			    	{scope.state.imitems}
			     </Tree>
				  </Card>
				  </Col>
				  <Col span={14} push={1}>
				   <Transfer dataSource={scope.state.mockData} 
					targetKeys={scope.state.targetKeys} 
					onChange={scope.handleChange.bind(scope)} 
					titles = {['医师','专家']} 
					listStyle={{width:260,height:260}} showSearch 
					render={item=>item.title} />
				 </Col>
				   </Row>
				   </Card>
				   <br/>
				   <Card>
				   <div className="clearfix" style={{textAlign:"center"}}>
					<Upload {...props} 
			        data={scope.state.imgdata}
			        onChange={scope.onChange.bind(scope)}
			        beforeUpload={scope.beforeUpload.bind(scope)}
			        onRemove={scope.onRemove.bind(scope)}		
			        accept="image/*">
			          <Icon type="plus" />
			          <div className="ant-upload-text">上传背景图片</div>
			        </Upload>
			        <Modal visible={scope.state.priviewVisible} footer={null} onCancel={scope.handleCancel.bind(scope)}>
			        	<img style={{height:"150px",width:"450px",borderRadius:"6px"}} src={scope.state.imgUrl} />
			        </Modal>
			        <div style={{textAlign:"center"}}>
			    	<img style={{height:"150px",width:"450px",borderRadius:"6px"}} src={scope.state.imgUrl} />
			    	</div>
				</div>
				</Card>
				</div>
		);
	}
}

module.exports = List;



