import React, { PropTypes } from 'react';
import { connect }          from 'dva';
import { routerRedux }      from 'dva/router';

import config               from '../../config';
import styles               from './CreateCard01.css';

import WorkSpace            from '../../components/WorkSpace';
import Steps                from '../../components/Steps';
import Card                 from '../../components/Card';

import idcard               from '../../assets/guide/idcard-read.png';

class CreateCard01 extends React.Component {

  static displayName = 'CreateCard01';
  static description = '办理就诊卡-step1';

  static propTypes = {
  };

  static defaultProps = {
  };

  steps = ['读取身份证', '校验手机号', '发卡'];

  constructor(props) {
    super(props);

    this.next = this.next.bind(this);
  }

  componentDidMount() {
    //TODO: 播放语音：请将您的身份证放置到身份证读卡器
  }

  next() {
    this.props.dispatch(routerRedux.push({
      pathname: '/createCard02',
      state: {
        idNo: '421022190809111833', 
        name: '张三',
        nav: {
          title: '办理就诊卡',
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
              <font className = {styles.guideText} >请将您的身份证放置到身份证读卡器</font>
            </div>
            <Card shadow = {true} style = {{height: '30rem', width: '25rem', margin: '3rem auto'}} >
              <img alt = "请将您的身份证放置到身份证读卡器" src = {idcard} className = {styles.guidePic} onClick = {this.next} />
            </Card>
          </WorkSpace>
        </div>
      </WorkSpace>
    );
  }
}
  

export default connect()(CreateCard01);


