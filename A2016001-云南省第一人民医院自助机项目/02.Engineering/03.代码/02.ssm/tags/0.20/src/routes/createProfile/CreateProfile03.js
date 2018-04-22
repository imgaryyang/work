import React, { PropTypes } from 'react';
import { connect }          from 'dva';
import { routerRedux }      from 'dva/router';

import config               from '../../config';
import styles               from './CreateProfile03.css';

import WorkSpace            from '../../components/WorkSpace';
import Info                 from '../../components/Info';
import Steps                from '../../components/Steps';

class CreateProfile03 extends React.Component {

  static displayName = 'CreateProfile03';
  static description = '自助建档-step3';

  static propTypes = {
  };

  static defaultProps = {
  };

  /**
  * 初始化状态
  */
  state = {
  };

  steps = ['读取' + this.props.location.state.cardName, '校验手机号', '完成建档'];

  constructor(props) {
    super(props);
  }

  componentDidMount() {
	  //TODO 向His发送建档请求
  }

  render() {
    let cardStyle = {
      width: '70rem', 
      height: '15rem', 
      margin: '10rem auto', 
    };
    let msgStyle = {
      width: '70rem',
      height: '15rem',
      display: 'table-cell',
      textAlign: 'center',
      verticalAlign: 'middle',
      fontSize: '4rem',
      padding: '1rem 2rem',
    };
    return (
      <WorkSpace style = {{paddingTop: '4rem'}} >
  		  <Steps steps = {this.steps} current = {3} />
        <div style = {{position: 'relative', width: '100%', height: (config.getWS().height - 11 * config.remSize) + 'px'}} >
          <Info info = '已成功建档，请返回首页选择其他操作' />
        </div>
      </WorkSpace>
    );
  }
}

export default connect()(CreateProfile03);
