import React,{ Component } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';

import WorkSpace from '../../components/WorkSpace';
import Steps from '../../components/Steps';
import Card  from '../../components/Card';
import Step1 from './Step1';
import Step2 from './Step2';
import Step3 from './Step3';
import Step4 from './Step4';
import config from '../../config';

class ProfileMain extends Component {
  constructor (props) {
    super(props);
    this.preStep = this.preStep.bind(this);
    this.nextStep = this.nextStep.bind(this);
    this.goStep = this.goStep.bind(this);
  }
  steps = ['读取社保卡', '校验手机号', '办理就诊卡','完成绑定'];
  state = { current : 1 }
  
  componentWillMount () {//初始化，接管nav的返回按钮
	  const { dispatch,frame } = this.props;
	  const { nav } = frame;
	  const newNav = { ...nav,onBack:this.preStep,title:'自助建档'};
	  dispatch({
		  type:'frame/setState',
		  payload:{nav:newNav},
	  });
	  this.props.dispatch({//保证无残存用户信息
	      type: 'patient/logout',
	  });
  }
  preStep(){ 
	  var { current } = this.state;
	  if( current == 4){
		  this.props.dispatch(routerRedux.push('/homepage'));
	  }
	  if( current == 1 ){
		  this.props.dispatch( routerRedux.goBack());
		  return;
	  }
	  this.setState({current : current-1 });
  }
  goStep(n){
	 if(n<=0)return;
	 this.setState({current : n });
  }
  nextStep(){ 
	  var {current } = this.state;
	  if( current == this.steps.length ){
		  this.props.dispatch( routerRedux.push('/homepage'));
		  return;
	  }console.info('nextStep ',current+1);
	  this.setState({current : current+1 }); 
  }
  render () {
    const { current } = this.state;
    const height = config.getWS().height - 11 * config.remSize+ 'px';
    return (
      <WorkSpace style = {{paddingTop: '4rem'}} >
      	<Steps steps = {this.steps} current = {current} />
      	{
      		current==1 ?(
      		  <div style = {{position: 'relative', width: '100%',height: height }} >
      		    <Step1 onNext={this.nextStep} goStep = {this.goStep}/>
      		  </div>
      		):null
      	}
      	{
      		current==2 ?(
    		  <div style = {{position: 'relative', width: '100%',height: height }} >
    		    <Step2 onNext={this.nextStep} goStep = {this.goStep}/>
    		  </div>
    		):null
      	}
      	{
      		current==3 ?(
    		  <div style = {{position: 'relative', width: '100%',height: height }} >
    		    <Step3 onNext={this.nextStep} goStep = {this.goStep}/>
    		  </div>
    		):null
      	}
      	{
      		current==4 ?(
    		  <div style = {{position: 'relative', width: '100%',height: height }} >
    		    <Step4 onNext={this.nextStep} goStep = {this.goStep}/>
    		  </div>
    		):null
      	}
      </WorkSpace>
    );	
  }
}  

export default  connect(({frame,patient}) => ({frame,patient}))(ProfileMain);
