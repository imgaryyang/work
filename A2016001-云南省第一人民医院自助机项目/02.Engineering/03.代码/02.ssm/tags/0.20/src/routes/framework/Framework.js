import React, { PropTypes } from 'react';
import { routerRedux } 		from 'dva/router';
import { connect } 			from 'dva';
import {Message} 			from '../../components';
import styles				from './Framework.css';
import Audio 				from './Audio';
class Framework extends React.Component {

	constructor (props) {
	    super(props);
	    this.goHomeTimer = this.goHomeTimer.bind(this);
	}
	
	state = {modalTime:6,modalDisplay:'none'};
	
	noLoginPaths=['/','/homepage','/login',
	              '/createCard01','/createCard02','/createCard03',
	              '/createProfile00','/createProfile01','/createProfile02','/createProfile03',];
	
	componentWillMount () {}
	
	componentWillReceiveProps(nextProps){
		 const {pathname,state} = nextProps.location;
		 const {baseInfo,miCardInfo} = nextProps.patient;
		 console.info("componentWillReceiveProps,",this.props.patient.baseInfo.id,baseInfo.id);
		 console.info("路径 : ",pathname,state);
		 //特殊页面不校验登录
		 for(var path of this.noLoginPaths){
			 if(path == pathname || path == ('/'+pathname))return;
		 } 
		
		 //如果已登录
		 if(baseInfo.id){console.info("已登录");
			 if(baseInfo.medium == 'miCard' && !miCardInfo.cardNo){
				 console.info("医保卡被拔出,退出登录");
				 this.props.dispatch({type:'patient/logout'});//医保卡被拔出,退出登录
			 }
			 return;
		 }
		 console.info('未登录 ： ' , this.props.patient.baseInfo);
		//未登录
		 if(this.props.patient.baseInfo.id){//如果之前是登录状态
			 this.setState({modalDisplay:''},()=>{setTimeout(this.goHomeTimer,1000)}); 
		 }else{
			 var dispatch = {pathname: pathname,state:state};
			 this.props.dispatch(routerRedux.push({
				 pathname: "login",
				 state :{
					 nav:{title:"身份认证"},
					 dispatch:dispatch
				 }
			 })); 
		 }
	}
	
	componentDidMount () {}
	
	componentDidUpdate () {}
	
	goHomeTimer(){
		let modalTime = this.state.modalTime;console.info('modalTime : ',modalTime);
		if(modalTime <= 0 ){
			this.setState({modalDisplay:'none'},()=>{
				this.props.dispatch(routerRedux.push('/homepage'));
			});
		}else{
			this.setState({modalTime:modalTime-1},()=>{setTimeout(this.goHomeTimer,1000)});
		}
	}
	
	render () {
		
		const {current} = this.props.frame;
		const {baseInfo,miCardInfo} = this.props.patient;
		const {modalTime,modalDisplay} = this.state;
		
		return (
			<div>
				{this.props.children}
				<Message />
				<div id="ssm_audio_dom">
				{
					Object.keys(Audio).map(function(key,index){
						return (
							<audio id={"audio_"+key} key={"audio_"+key} height="0" width="0">
								<source src={Audio[key]} type="audio/mp3" />
							</audio>
						)
					})
				}
				</div>
				<div className={styles.modal} style={{display:modalDisplay}}>
				  	<div style={{marginTop:(_screenHeight/2-10)}}>医保卡被拔出<br/>系统于{modalTime}秒后返回首页!</div>
				</div>
			</div>
		);	
	}
}  



/**
 * ({frame}) => ({frame})用于获取namespace为frame的model; 
 * connect 函数用于将获取到的model与组件Framework做关联
 */
export default  connect(({frame,patient}) => ({frame,patient}))(Framework);


//componentWillReceiveProps(nextProps){
////	const {baseInfo,miCardInfo} = nextProps.patient;
////	if(baseInfo.medium == 'miCard' && !miCardInfo.cardNo){
////		this.props.dispatch({type:'patient/logout'});//医保卡被拔出,退出登录
////	}
////	if(!baseInfo.id){//已退出登录
////		setTimeout(this.goHomeTimer,1000); 
////	}
//}