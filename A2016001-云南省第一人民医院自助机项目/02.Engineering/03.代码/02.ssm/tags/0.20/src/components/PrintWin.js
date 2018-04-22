import React, { PropTypes }   from 'react';
import { connect }            from 'dva';
import { Row, Col, 
  Modal, Icon }               from 'antd';

import config                 from '../config';
import styles                 from './PrintWin.css';
import Button                 from './Button';

import printer                from '../assets/base/printer.png';

class PrintWin extends React.Component {

  static displayName = 'PrintWin';
  static description = '通用打印提示窗口';

  static propTypes = {

    /**
     * 显示属性
     */
    visible: PropTypes.bool,

  };

  static defaultProps = {
    visible: false,
  };

  modalWinTop  = config.navBar.height + config.navBar.padding * 2 + 5;

  constructor (props) {
    super(props);
    this.onClick = this.onClick.bind(this);
  }

  onClick (callback) {
    if (typeof callback == 'function')
      callback();
  }
 
  render() {
    let { style, visible, dispatch, ...other } = this.props;

    if (!style)
      style = {};
    style['top'] = this.modalWinTop + 'rem';

    return (
      <Modal visible = {visible} closable = {false} footer = {null} width = {config.getWS().width * 0.6836 + 'px'} style = {style} >
        <div className = {styles.container} >
          <div className = {styles.infoContainer} >
            <div className = {styles.info} >
              <img src = {printer} style = {{width: 6 * config.remSize + 'px', height: 6 * config.remSize * 229 / 240 + 'px'}} /><br/>
              正在打印……请耐心等待！
            </div>
          </div>
        </div>
      </Modal>
    );
  }

}

export default connect()(PrintWin);


