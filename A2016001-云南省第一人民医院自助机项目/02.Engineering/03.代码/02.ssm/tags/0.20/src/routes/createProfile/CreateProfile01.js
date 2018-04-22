import React, { PropTypes } from 'react';
import { connect }          from 'dva';
import { routerRedux }      from 'dva/router';
import { Button }           from 'antd';

import config               from '../../config';
import styles               from './CreateProfile01.css';

import WorkSpace            from '../../components/WorkSpace';
import Steps                from '../../components/Steps';
import Card                 from '../../components/Card';

import siCard               from '../../assets/guide/si-card-read.png';

class CreateProfile01 extends React.Component {

  static displayName = 'CreateProfile01';
  static description = '自助建档-step1';

  static propTypes = {
  };

  static defaultProps = {
  };

  steps = ['读取' + this.props.location.state.cardName, '校验手机号', '完成建档'];

  constructor(props) {
    super(props);

    this.next = this.next.bind(this);
  }

//  componentDidMount() {
//    //TODO: 播放语音：请将您的{this.props.location.state.cardName}放置到{this.props.location.state.cardName}读卡器
//  }
  componentWillReceiveProps(nextProps){ 		  
	  const{baseInfo,miCardInfo} = nextProps.patient;
	  if(miCardInfo.cardNo){//刷卡完毕，进入下一页
		  this.next();
	  }
  }
  componentDidMount() {
	  this.props.dispatch({
	        type: 'patient/listenMiCard',
	        payload: {
	        	cardType : this.props.location.state.cardType,
	        },
	  });
  }
  next() {
	  const {cardType,cardName} = this.props.location.state;
	  const {idNo,name} = this.props.patient.miCardInfo;
    this.props.dispatch(routerRedux.push({
      pathname: '/createProfile02',
      state: {
        cardType: cardType,
        cardName: cardName,
        //idNo: idNo,//'530102199403221709', 
        //name: name,//'温雨婷',
        idNo : "530102199403221709",
        name : "温雨婷",
        nav: {
          title: '自助建档',
        },
      },
    }));
  }

  render() {
    return (
      <WorkSpace style = {{paddingTop: '4rem'}} >
  		  <Steps steps = {this.steps} current = {1} />
        <div style = {{position: 'relative', width: '100%', height: (config.getWS().height - 11 * config.remSize) + 'px'}} >
          <WorkSpace width = '100%' height = '50rem' >
            <div className = {styles.guideTextContainer} >
              <font className = {styles.guideText} >请将您的{this.props.location.state.cardName}放置到{this.props.location.state.cardName}读卡器</font>
            </div>
            <Card shadow = {true} style = {{height: '30rem', width: '25rem', margin: '3rem auto'}} >
              <img alt = "" src = {siCard} className = {styles.guidePic} onClick = {this.next} />
            </Card>
          </WorkSpace>
        </div>
      </WorkSpace>
    );
  }
}
  

export default connect(({patient})=>({patient}))(CreateProfile01);



