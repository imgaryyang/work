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
    this.print = this.print.bind(this);
  }
  componentDidMount () {
	  this.print();
  }
  componentWillReceiveProps(nextProps){
  }
  print(){
	  const { baseInfo } = this.props.patient; 
	  const { machine } = this.props.frame;
	  const { consume } = this.props.deposit;
	  this.props.dispatch({//打印办卡凭条
	      type: 'patient/printDoCardFees',
	      payload:{baseInfo,machine,consume},
	  });
  }
  render () {
    const { current } = this.props.frame;
		
    return (
      <div style={{height:'100%'}}>
	      <WorkSpace width = '100%' height = '60rem' >
		      <div className = {styles.guideTextContainer} >
		        <font className = {styles.guideText} >请取卡</font><br/>
		        <font style = {{fontSize: '3rem'}} >请在就诊卡发卡口领取您的就诊卡并妥善保管</font>
		      </div>
		      <BackTimer style = {{marginTop: '2rem'}} />
		      <div style = {{height: '30rem', width: '25rem', margin: '3rem auto'}} >
		        <img alt = "请在就诊卡发卡口领取您的就诊卡并妥善保管" src = {medCardIssue} className = {styles.guidePic} />
		      </div>
	      </WorkSpace>
      </div>
    );	
  }
}  

export default  connect(({frame,patient,deposit}) => ({frame,patient,deposit}))(Step1);