import React, { PropTypes } from 'react';
import { connect }          from 'dva';
import { routerRedux }      from 'dva/router';
import { Button }           from 'antd';

import config               from '../../config';
import styles               from './Login.css';

import WorkSpace            from '../../components/WorkSpace';
import Card                 from '../../components/Card';
import siCard               from '../../assets/guide/si-card-read.png';
class Login extends React.Component {

  static displayName = 'Login';
  static description = '操作用户登录';

  static propTypes = {
  };

  static defaultProps = {
  };

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
  componentWillReceiveProps(nextProps){ 		  
	  const{baseInfo,medicalCardInfo,miCardInfo} = nextProps.patient;
	  if(baseInfo.id){//登录完毕，跳转正常页面
		  this.next();
	  }else if(medicalCardInfo.cardNo || miCardInfo.cardNo){//存在卡信息，登录
		  this.props.dispatch({
			  type: "patient/login",
		  });
	  }
  }
  
  next() {
	  const { nav,dispatch} = this.props.location.state;
	  const { pathname,state } = dispatch;
	  this.props.dispatch(routerRedux.push({
		  pathname: pathname,
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
		          <font className = {styles.guideText} >请插入您的就诊卡或社保卡</font>
		        </div>
		        <Card shadow = {true} style = {{height: '30rem', width: '25rem', margin: '3rem auto'}} >
		          <img alt = "请插入您的就诊卡或社保卡" src = {siCard} className = {styles.guidePic} />
		        </Card>
		      </WorkSpace>
		    </div>
	      </WorkSpace>
    );
  }
}
  

export default connect(({patient})=>({patient}))(Login);