import React, { PropTypes }   from 'react';
import { Row,Col, Modal, Icon } from 'antd';
import pw_                 from './PrintWin.css';
import Button                 from './Button.jsx';

class PrintWin extends React.Component {


  constructor (props) {
    super(props);
    this.onClick = this.onClick.bind(this);
  }

  onClick (callback) {
    if (typeof callback == 'function')
      callback();
  }
 
  render() {
	let width = document.body.clientWidth*0.6836 ;
    let { style, visible,msg, ...other } = this.props;
    msg = msg||'正在打印……请耐心等待！'
    if (!style)style = {};
    style['top'] = '18rem';
    return (
      <Modal visible = {visible||false} closable = {false} footer = {null} width = {width + 'px'} style = {style} >
        <div className = 'pw_container' >
          <div className = 'pw_infoContainer' >
            <div className = 'pw_info' >
              <img src = './images/base/printer.png' style = {{width: '6px', height: '55px'}} /><br/>
              {msg}
            </div>
          </div>
        </div>
      </Modal>
    );
  }

}
module.exports = PrintWin;
