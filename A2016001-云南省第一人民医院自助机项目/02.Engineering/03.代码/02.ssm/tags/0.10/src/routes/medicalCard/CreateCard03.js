import React, { PropTypes } from 'react';
import { connect }          from 'dva';
import { routerRedux }      from 'dva/router';

import config               from '../../config';
import styles               from './CreateCard03.css';

import WorkSpace            from '../../components/WorkSpace';
import Steps                from '../../components/Steps';
import Card                 from '../../components/Card';
import BackTimer            from '../../components/BackTimer';

import medCardIssue         from '../../assets/guide/med-card-issue.png';

class CreateCard03 extends React.Component {

  static displayName = 'CreateCard03';
  static description = '办理就诊卡-step3';

  static propTypes = {
  };

  static defaultProps = {
  };

  /**
  * 初始化状态
  */
  state = {
  };

  steps = ['读取身份证', '校验手机号', '发卡'];

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    //TODO: 播放语音：请在就诊卡发卡口领取您的就诊卡并妥善保管
  }

  render() {
    return (
      <WorkSpace style = {{paddingTop: '4rem'}} >
  		  <Steps steps = {this.steps} current = {3} />
        <div style = {{position: 'relative', width: '100%', height: (config.getWS().height - 11 * config.remSize) + 'px'}} >
          <WorkSpace width = '100%' height = '60rem' >
            <div className = {styles.guideTextContainer} >
              <font className = {styles.guideText} >请取卡</font><br/>
              <font style = {{fontSize: '3rem'}} >请在就诊卡发卡口领取您的就诊卡并妥善保管</font>
            </div>
            <BackTimer style = {{marginTop: '2rem'}} />
            <Card shadow = {true} style = {{height: '30rem', width: '25rem', margin: '3rem auto'}} >
              <img alt = "请在就诊卡发卡口领取您的就诊卡并妥善保管" src = {medCardIssue} className = {styles.guidePic} />
            </Card>
          </WorkSpace>
        </div>
      </WorkSpace>
    );
  }
}

export default connect()(CreateCard03);
