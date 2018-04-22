import React, { PropTypes } from 'react';
import { connect }          from 'dva';
import { routerRedux }      from 'dva/router';
import { Button }           from 'antd';

import config               from '../../config';
import styles               from './Login.css';

import WorkSpace            from '../../components/WorkSpace';
import Card                 from '../../components/Card';
import medCard               from '../../assets/guide/med-card-read.gif';

import medicalCardUtil  from '../../utils/medicalCardUtil';
import miCardUtil  from '../../utils/miCardUtil';

class Login extends React.Component {

  constructor(props) {
    super(props);
    this.next  = this.next.bind(this);
  }

  componentDidMount() {
	  if(this.props.location.action == 'POP'){
		  //回退的，去首页
		  this.props.dispatch(routerRedux.push("homepage"));
	  }else{
		  this.props.dispatch({
		        type: 'patient/listenLoginCard',
		   });  
	  }
  }
  componentWillUnMount() {
	  //关闭外设
	  const { baseInfo,medicalCardInfo,miCardInfo} = this.props.patient;
	  if(!medicalCardInfo.cardNo){
		  console.info('无就诊卡，关闭就诊卡读卡器');
		  //medicalCardUtil.safeClose();
	  }
	  if(!miCardInfo.cardNo){
		  console.info('无社保卡，关闭就诊卡读卡器');
		  miCardUtil.safeClose(); 
	  }
  }
  componentWillReceiveProps(nextProps){ 		  
	  const{baseInfo,medicalCardInfo,miCardInfo} = nextProps.patient;
	  if(baseInfo.no){//登录完毕，跳转正常页面
	    this.next(baseInfo);
	  }else if(medicalCardInfo.cardNo || miCardInfo.cardNo){//存在卡信息，登录
//		  this.props.dispatch({
//			  type: "patient/login",
//		  });
	  }
  }
  
  next(baseInfo) {
	  if(!this.props.location.state){
		  this.props.dispatch(routerRedux.push("/homepage"));
		  return;
	  }
	  const { nav,dispatch} = this.props.location.state;
	  const { pathname,state } = dispatch;
	  const { cardType } = baseInfo;
	  if(cardType && cardType == "operator"){
		 // this.props.dispatch({type: 'frame/loadOperatorMenus'});
		  if(pathname && pathname.indexOf('/opt/') ==-1){
			  this.props.dispatch(routerRedux.push("/homepage"));
			  return;
		  }
	  }
	  this.props.dispatch(routerRedux.push({
		  pathname: pathname || "/homepage",
		  state : state
	  }));
  }

  render() {
    let width = config.getWS().width - 9 * config.remSize,
    cardHeight = config.getWS().height * 4 / 7;

    let cardStyle = {
      width: (width / 2) + 'px', 
      height: cardHeight + 'px', 
    };
    return (
		 <WorkSpace style = {{paddingTop: '4rem'}} >
		    <div style = {{position: 'relative', width: '100%', height: (config.getWS().height - 11 * config.remSize) + 'px'}} >
		      <WorkSpace width = '100%' height = '50rem' >
		        <div className = {styles.guideTextContainer} >
		          <font className = {styles.guideText} >请插入您的就诊卡</font>
		        </div>
		        <div style = {{height: '30rem', width: '30rem', margin: '3rem auto'}} >
	      			<img alt = "" src = {medCard} className = {styles.guidePic} />
	      		</div>
		      </WorkSpace>
		    </div>
	      </WorkSpace>
    );
  }
}
  

export default connect(({patient})=>({patient}))(Login);