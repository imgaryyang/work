import React,{ Component } from 'react';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';

import config               from '../../config';
import styles               from './Step4.css';

import WorkSpace            from '../../components/WorkSpace';
import Steps                from '../../components/Steps';
import Card                 from '../../components/Card';
import BackTimer            from '../../components/BackTimer';

import medCardIssue         from '../../assets/guide/med-card-issue.gif';

class Step1 extends Component {
  constructor (props) {
    super(props);
  }
  componentDidMount () {
	  this.props.dispatch({//保证无残存订单信息
	      type: 'deposit/clearOrders',
	  });
	  this.props.dispatch({//支付完毕后清空支付信息残留信息
		  type:'payment/reset'
	  });
	  this.props.dispatch({//保证无残存用户信息
	      type: 'patient/logout',
	  });
  }
  componentWillReceiveProps(nextProps){
  }
  render () {
    const { current } = this.props.frame;
		
    return (
      <div style={{height:'100%'}}>
	      <WorkSpace width = '100%' height = '60rem' >
		      <div className = {styles.guideTextContainer} >
		        <font className = {styles.guideText} >绑定成功</font><br/>
		        <font style = {{fontSize: '3rem'}} >成功绑定医保卡,您已经可以使用就诊卡进行医保结算</font>
		      </div>
		      <BackTimer style = {{marginTop: '2rem'}} />
		      <div  style = {{height: '30rem', width: '25rem', margin: '3rem auto'}} >
		        <img alt = "成功绑定医保卡,您已经可以使用就诊卡进行医保结算" src = {medCardIssue} className = {styles.guidePic} />
		      </div>
	      </WorkSpace>
      </div>
    );	
  }
}  

export default  connect(({frame,patient}) => ({frame,patient}))(Step1);