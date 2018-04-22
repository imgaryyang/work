import React, { PropTypes } from 'react';
import { connect }          from 'dva';
import { routerRedux }      from 'dva/router';

import styles               from './Signed.css';

import Info                 from '../../components/Info';

class Signed extends React.Component {

  static displayName = 'Signed';
  static description = '预约签到完成';

  static propTypes = {
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
      <Info info = {<font>签到成功<br/><font style = {{fontSize: '3rem'}} >请在诊室门口等待叫号</font></font>} />
    );
  }
}

export default connect()(Signed);
