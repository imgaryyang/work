import React, { PropTypes }   from 'react';
import { connect }            from 'dva';
import { Row, Col }           from 'antd';
import { routerRedux }        from 'dva/router';

import config                 from '../config';
import styles                 from './BackTimer.css';

const _time = config.timer.autoBackToHome;

class BackTimer extends React.Component {

  static displayName = 'BackTimer';
  static description = '定时返回首页';

  static propTypes = {
  };

  static defaultProps = {
  };

  /**
  * 初始化状态
  */
  state = {
    second: _time
  };

  _clockTimer = null;

  constructor(props) {
    super(props);
    this.setClock   = this.setClock.bind(this);
    this.backToHome = this.backToHome.bind(this);
  }

  componentDidMount() {
    this.setClock();
  }

  componentWillUnmount () {
    clearTimeout(this._clockTimer);
  }

  setClock () {
    
    if(this.state.second == 0) {
      this.backToHome();
      return;
    }

    let second = this.state.second - 1;
    this._clockTimer = setTimeout(
      () => {
        this.setState({
          second: second,
        });
        this.setClock();
      },
      1000
    );
  }

  backToHome() {
    this.props.dispatch(routerRedux.push({
      pathname: '/',
      state: {
      },
    }));
  }
 
  render() {

    let { style, ...other } = this.props;

    if (!style)
      style = {};

    return (
      <div className = {styles.container} style = {style} >
        {/*<div className = {styles.time} >{this.state.second}</div>
        <div className = {styles.text} >秒钟后自动返回主页</div>*/}
        <font className = {styles.time} >{this.state.second}</font>
        <font className = {styles.text} >&nbsp;秒钟后自动返回主页</font>
      </div>
    );
  }

}

export default connect()(BackTimer);


