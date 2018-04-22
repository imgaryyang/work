import React, { PropTypes } from 'react';
import { connect }          from 'dva';
import { routerRedux }      from 'dva/router';
import { message }          from 'antd';

import styles               from './Info.css';

import WorkSpace            from './WorkSpace';
import Card                 from './Card';
import BackTimer            from './BackTimer';

import done                 from '../assets/base/done.png';

class Info extends React.Component {

  static displayName = 'Info';
  static description = '公用信息提示页';

  static propTypes = {
    /**
     * 提示信息
     */
    info: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.element,
    ]).isRequired,

    /**
     * 是否加入自动返回首页功能
     */
    autoBack: PropTypes.bool,

    /**
     * 是否显示完成图片
     */
    showDoneImg: PropTypes.bool,
  };

  static defaultProps = {
    autoBack: true,
    showDoneImg: true,
  };

  /**
  * 初始化状态
  */
  state = {
  };

  constructor(props) {
    super(props);
  }

  componentDidMount() {
  }

  render() {
    
    return (
      <WorkSpace width = '80%' height = '50rem' >
        <div className = {styles.msg} >{this.props.info}</div>
        {this.props.autoBack ? <BackTimer style = {{marginTop: '4rem'}} /> : null}
        {this.props.autoBack ? <img src = {done} className = {styles.doneImg} /> : null}
      </WorkSpace>
    );
  }
}

export default connect()(Info);
