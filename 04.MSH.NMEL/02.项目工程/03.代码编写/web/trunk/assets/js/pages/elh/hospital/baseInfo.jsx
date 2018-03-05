'use strict';

import { Component } from 'react';
import ReactDOM from 'react-dom';
import { Upload, Icon, Modal,Button,Row, Col,Table} from 'antd';
const confirm = Modal.confirm;
class UserList extends Component{
	constructor (props) {
		super(props);
		const scope = this;
		this.state = {
			pagination : {
				current:0,                                        //当前页数	Number	无
				total:0,                                          //数据总数	Number	0
				pageSize:5,                                       //每页条数	Number	
				onChange:scope.pageChange.bind(scope),            //页码改变的回调，参数是改变后的页码	Function	noop
				showSizeChanger:true,                             //是否可以改变 pageSize	Boolfalse
				pageSizeOptions	: ['5', '10', '20', '50'],       //指定每页可以显示多少条	Array	
				onShowSizeChange:scope.pageSizeChange.bind(scope),//pageSize 变化的回调	Function	noop
				showQuickJumper:true                              //是否可以快速跳转至某页Bool	false
			},
	        loading : false
		};
		this.version= props.version;
	}
	componentWillMount () {
		this.goToPage(1);
	}
	componentDidUpdate(){
		if(this.version != this.props.version){
			 this.version = this.props.version;
			 this.refresh();
		}
	}
	getColumn (){
		const scope = this;
		
		return [{
			title: '姓名',
			dataIndex: 'name',
			render(text,record,index) {
				return <a onClick={scope.onView.bind(scope,record)}>{text}</a>;
			},
		}, {
			title: '用户名',
			dataIndex: 'username',
		},{
			title: '手机号',
			dataIndex: 'mobile',
		},{
			title: '邮箱地址',
			dataIndex: 'email',
		},{
			title: '创建时间',
			dataIndex: 'createAt',
		},{
			title: '状态',
			dataIndex: 'state',
			render(text,record,index) {//1 - 正常2 - 冻结
				return (text == '1')?"正常":"冻结";
			},
		},{
			title: '操作',
			dataIndex: 'opt',
			render(text,record,index) {
				var opts=[],style={marginLeft:'3px'};
				
				if(record.state == '1')opts.push(<a  style={style} onClick={scope.onDelete.bind(scope,record)}>冻结</a>);
				else opts.push(<a  style={style} onClick={scope.onDelete.bind(scope,record)}>解冻</a>);
				
				opts.push(<a  style={style} onClick={scope.onDelete.bind(scope,record)}>删除</a>);
				return <div>{opts}</div>;
			},
		}];
	}
	onCreate(){
		if(this.props.onCreate){
			this.props.onCreate(arguments);
		}
	}
	onView(row){
		if(this.props.onView){
			this.props.onView(row);
		}
	}
	onDelete(data){
		var scope = this;
		confirm({
		    title: '您是否确认要删除这项内容',
		    onOk() {
		    	let fetch = Ajax.del('api/bdrp/org/optuser/remove/'+data.id, null, {catch: 3600});
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
	refresh(){
		this.goToPage(this.state.pagination.current);
	}
	goToPage(pageNo){
		this.setState({loading:true});
		let start = (pageNo-1)*this.state.pagination.pageSize;
		let param  = JSON.stringify({orgId:this.props.hospital.id});
		let fetch = Ajax.get('api/bdrp/org/optuser/list/'+start+'/'+this.state.pagination.pageSize, {data:param}, {catch: 3600});
		fetch.then(res => {
			let data = res.result,total=res.total,start=res.start;
			let pagination = this.state.pagination;
			pagination.current=pageNo,pagination.total = total;
			this.setState({ pagination: pagination,data:data,loading:false});
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
	render () {//<Button style={{float:'right'}}>新增</Button>
		let bStyle={marginRight:'3px'};
		return (
			<div style={{ minHeight:'500px'}}>
				<div>
					
					<p style={{fontSize:'17px',marginBottom:'3px'}}>用户：</p>
				</div>
		        <Table 
		        	columns={this.getColumn()} 
			        rowKey={record => record.id}
			        dataSource={this.state.data}
			        pagination={this.state.pagination}
			        loading={this.state.loading}
		        	dataSource={this.state.data}/>
	    	</div>
		);
	}
}
class ImageUploadList extends Component{
	constructor (props) {
		super(props);
		this.state={
			priviewVisible: false,
			priviewImage: ''			
		}
	}
	handleCancel() {
		this.setState({priviewVisible: false,});
	}
	componentWillMount () {
		
	}
	render() {
//		const props = { 
//				action: '/upload.do',
//				listType: 'picture-card',
//				defaultFileList: this.state.pictures,
//				onPreview: (file) => {
//					this.setState({
//						priviewImage: file.url,
//						priviewVisible: true,
//					});
//				},
//		};
//		console.info(props);
		let param  = JSON.stringify({});
	    return (
	    		<div className="clearfix">
		    		<Upload action='/api/el/base/images/upload'
		    			data={{fkId:this.props.hospital.id,fkType:"01"}}
		    			listType = 'picture-card' 
		    			defaultFileList = {this.props.pictures}  
		    			>
			    		<Icon type="plus" />
			    		<div className="ant-upload-text">上传照片</div>
		    		</Upload>
	    		</div>
	    );
  }
}

class BaseInfo extends Component{
	constructor (props) {
		super(props);
		this.state={
				pictures:this.getPictureCmp(),
				hospital:{
					idHlht: "",name: "",stars: "",sceneryNum: 5,likes: 1999,homeUrl: "",contactWays:[],transportations:[],
				    favs: 0,address: "",longitude: 0,latitude: 0,transport: "",description: "",
				    goodComment: 0,badComment: 0,featureBackground: "",expertBackground:"",id: ""
				}
		}
		if(this.props.bindCard){
			this.props.bindCard(this);
		}
	}
	getPictureCmp(pictures,hos){
		if(!pictures)return <div></div>;
		return <ImageUploadList pictures={pictures} hospital={hos}/>
	}
	componentWillMount () {
		this.loadHosInfo();
	}
	refresh(){
		this.loadHosInfo();
	}
	loadHosInfo(){
		let fetch = Ajax.get("api/elh/hospital/", null, {catch: 3600});// 获取医院基本信息
		fetch.then(res => { 
			if(res.success){
				if(res.result&&(!res.result.contactWays))res.result.contactWays=[];
				this.state.hospital = res.result;
				this.setState(this.state.hospital);
			}else{
			}
	    	return res;
		}).then(res =>{
			this.getPictures(this.state.hospital)
		});
	}
	getPictures(hos){
		let param  = JSON.stringify({fkId:hos.id,fkType:'01'});
		let fetch = Ajax.get("api/el/base/images/list/0/5/", {data:param}, {catch: 3600});// 获取医院基本信息
		fetch.then(res => { 
			if(res.success){
				let pics = res.result,pictures=[];
				if(pics && pics.length > 0){
					pictures = pics.map(function(p,index){
						return {
						    uid:p.id,
						    name: p.fileName,
						    status: 'done',
						    url: 'api/el/base/images/view/'+p.id,
						    thumbUrl: 'api/el/base/images/view/'+p.id,
						  }
					});
				}				
				let pCmp = this.getPictureCmp(pictures,hos);
				this.setState({pictures:pCmp});
			}
	    	return res;
		});
	}
	componentDidUpdate(){
	}
	upLine(){
		this.upOrOff("api/elh/hospital/mng/upLine/"+this.state.hospital.id,"1","上线");
	}
	offLine(){
		this.upOrOff("api/elh/hospital/mng/offLine/"+this.state.hospital.id,"0","下线");
	}
	upOrOff(url,state,text){
		var scope = this;
		confirm({
		    title: '您确认要将医院'+text+'吗？',
		    onOk() {
		    	let fetch = Ajax.put(url, null, {catch: 3600});
				fetch.then(res => { 
					if(res.success){
						Modal.success({title: text+'成功'});
						scope.refresh();
					}else{
						let msg = res.msg?res.msg:"";
						Modal.error({title: text+'失败,'+msg}); 
					}
			    	return res;
				});
		    },
		    onCancel() {},
		});
	}
	getStyles(){
		let h= this.state.hospital,fontSize=17;
		let titleLength = h.name.length*fontSize+50+'px';
		return{
			block :{borderBottom:'1px solid #dee4e6',dispaly:'inline-block',margin:'0 auto',width:'900px'},
			blockContent:{margin:'0 50px'},
			title:{borderBottom:'1px solid #dee4e6',dispaly:'inline-block',margin:'0 auto',width:'900px'},
			titleBtns :{display:'inline-block',float:'right'},
			titleFont:{margin:'0 auto',width:titleLength,fontSize:fontSize+'px' }
		}
	}
	onEdit(){//model
		//this.state.hospital
		if(this.props.onEdit){
			this.props.onEdit(this.state.hospital);
		}
	}
	getCWayType(type){
		let types =  {"1":"手机号","2":"电话","3":"传真","4":"400电话","5":"微信","6":"微博","7":"QQ","8":"EMAIL"};
		return types[type]||"";
	}
	getTWayType(type){
		let tTypes = {"1":"公交","2":"地铁"};
		return tTypes[type]||"";
	}
	render () { 
		let s=this.getStyles(),h= this.state.hospital,getCWayType=this.getCWayType,getTWayType=this.getTWayType;
		let elhOrg = h.elhOrg,online=false;
		if(elhOrg&&(elhOrg.state=='1'))online=true;
		return (
				<div style={{lineHeight:'50px'}}>
					<div style={s.title}>
						<span style={s.titleBtns}>
							{
								online ?
									(<Button type="primary" onClick={this.offLine.bind(this)}>下线</Button>):
									(<Button type="primary" onClick={this.upLine.bind(this)}>上线</Button>)
									
							}
						</span>
						<div style={s.titleFont} >
							<img src="../../../images/logo-30.png"/>
							<span>{h.name}</span> 
						</div> 
					</div>
					<div style={s.block}>
						<p style={{fontSize:'17px',marginBottom:'3px'}}>基础信息：</p>
						<div style={s.blockContent}>
							<p style={{marginBottom:'3px'}}>地址：{h.address}</p>
							<Row>
								<Col span={12}>
									<p>联系方式：</p>
									{
										h.contactWays.map(function(contactWay,index){
											return <p style={{margin:'0 17px'}}>{getCWayType(contactWay.type)}:{contactWay.content}</p>
										})
									}
								</Col>
								<Col span={12}>
									<p>交通方式：</p>
									{
										h.transportations.map(function(transportation,index){
											return <p style={{margin:'0 17px'}}>{getTWayType(transportation.type)}:{transportation.content}</p>
										})
									}
								</Col>
							</Row>
							<p>简介： </p>
							<p style={{lineHeight:'20px',margin:'0 17px'}}>{h.description}</p>
							<div>
								<Button onClick={this.onEdit.bind(this)} style={{float:'right',marginRight:'-50px'}}>修改</Button>&nbsp;
							</div>
						</div>
					</div>
					<div style={s.block}>
						<p style={{fontSize:'17px',marginBottom:'3px'}}>图片：</p>
						<div style={s.blockContent}>
						{this.state.pictures}
						</div>
					</div>
					<div style={s.block}>
						<UserList hospital={h}/>
					</div>
				</div>
		);
	}
}
module.exports = BaseInfo;
