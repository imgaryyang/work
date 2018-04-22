import React, { PropTypes }   from 'react';
import { Row, Col }           from 'antd';
import styles                 from './BackTimer.css';
import baseUtil from '../utils/baseUtil.jsx';
const _time = 5;

class BackTimer extends React.Component {

  
  constructor(props) {
    super(props);
    this.setClock   = this.setClock.bind(this);
    this.backToHome = this.backToHome.bind(this);
    this.state = {
  		  second: _time
    };
    this._clockTimer = null;
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
	  baseUtil.goHome();
  }
 
  render() {

    let { style, ...other } = this.props;

    if (!style)  style = {};

    return (
      <div className = 'btimer_container' style = {style} >
        {/*<div className = {styles.time} >{this.state.second}</div>
        <div className = {styles.text} >秒钟后自动返回主页</div>*/}
        <font className = 'btimer_time' >{this.state.second}</font>
        <font className = 'btimer_text' >&nbsp;秒钟后自动返回主页</font>
      </div>
    );
  }

}
module.exports = BackTimer;

