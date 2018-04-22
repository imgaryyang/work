import React, { PropTypes } from 'react';
import { connect }          from 'dva';
import { routerRedux }      from 'dva/router';
import { Icon }             from 'antd';

import styles               from './Empty.css';

import WorkSpace            from './WorkSpace';
import Card                 from './Card';
import BackTimer            from './BackTimer';

class Empty extends React.Component {

  static displayName = 'Empty';
  static description = '查询数据不存在';

  static propTypes = {

    /**
     * 提示信息
     */
    info: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.element,
    ]).isRequired,

  };

  static defaultProps = {
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
      <WorkSpace fullScreen = {true} >
        <div className = {styles.empty} >
          <Icon type = 'info-circle-o' style = {{fontSize: '10rem', color: '#BC1E1E'}} /><br/><br/>
          {this.props.info}
        </div>
      </WorkSpace>
    );
  }
}

export default connect()(Empty);
