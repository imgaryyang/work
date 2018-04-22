import React, { PropTypes } from 'react';
import { connect }          from 'dva';
import { routerRedux }      from 'dva/router';

import styles               from './Info.css';

import InfoComp             from '../../components/Info';

class Info extends React.Component {

  static displayName = 'Info';
  static description = '公用消息界面';

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

  componentWillUnmount () {
    this.props.dispatch({
      type: 'message/setState',
      payload: {
        info: null,
        autoBack: true,
      }
    });
  }

  render() {
    const { info, autoBack } = this.props.message;
    /*console.log('Info render():', this.props.message);
    console.log(autoBack);*/
    if (info) 
      return (
        <InfoComp info = {info} autoBack = {autoBack} />
      );
    else
      return (
        <div/>
      );
    
  }
}

export default connect(({message}) => ({message}))(Info);
