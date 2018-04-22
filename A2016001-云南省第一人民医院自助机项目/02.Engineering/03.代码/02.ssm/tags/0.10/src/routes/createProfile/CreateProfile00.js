import React, { PropTypes } from 'react';
import { connect }          from 'dva';
import { routerRedux }      from 'dva/router';
import { Button }           from 'antd';

import config               from '../../config';
import styles               from './CreateProfile00.css';

import WorkSpace            from '../../components/WorkSpace';
import Card                 from '../../components/Card';

class CreateProfile00 extends React.Component {

  static displayName = 'CreateProfile00';
  static description = '自助建档';

  static propTypes = {
  };

  static defaultProps = {
  };

  constructor(props) {
    super(props);

    this.next = this.next.bind(this);
  }

  componentDidMount() {
    //TODO: 播放语音：请选择操作类型
  }

  next(cardType, cardName) {
    this.props.dispatch(routerRedux.push({
      pathname: '/createProfile01',
      state: {
        cardType: cardType, 
        cardName: cardName,
        nav: {
          title: '自助建档',
        },
      },
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
      <WorkSpace width = {width + 'px'} height = {cardHeight + 'px'} >
        <div className = {styles.workspace} style = {{width: width + 'px', height: cardHeight + 'px'}} >
          <Card shadow = {true} className = {styles.cardStyle} style = {cardStyle} onClick = {() => this.next('siCard', '社保卡')} >
            <div></div>
            <font>社保卡初次就诊</font>
          </Card>
          <div style = {{display: 'table-cell', width: '4rem'}} >&nbsp;</div>
          <Card shadow = {true} className = {styles.cardStyle} style = {cardStyle} onClick = {() => this.next('healthCard', '居民健康卡')} >
            <div></div>
            <font>居民健康卡初次就诊</font>
          </Card>
        </div>
      </WorkSpace>
    );
  }
}
  

export default connect()(CreateProfile00);