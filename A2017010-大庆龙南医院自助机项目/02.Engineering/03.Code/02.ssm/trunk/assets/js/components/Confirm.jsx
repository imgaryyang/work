import React, { PropTypes }   from 'react';
import { Row, Col,  Modal, Icon }    from 'antd';
             

import styles from './Confirm.css';
import Button from './Button.jsx';

class Confirm extends React.Component {

  constructor (props) {
    super(props);
    this.onClick = this.onClick.bind(this);
  }
  onClick (callback) {
    if (typeof callback == 'function'){
    	callback();
    }
  }
 
  render() {
    let { info, visible, buttons,width, ...other } = this.props;
    var style = {top :'18rem'};
    width = width ||(document.body.clientWidth*0.683);
    return (
      <Modal visible = {visible} closable = {false} footer = {null} width={width+'px'} style = {style} >
        <div className = 'confirm_container' >
          <div className = 'confirm_infoContainer' >
            {
              typeof info == 'string' ? (
                <div className = 'confirm_info' >
                  <Icon type = 'exclamation-circle-o' style = {{fontSize: '6rem', color: '#BC1E1E'}} /><br/>
                  {info}
                </div>) : (
                  <div className = 'confirm_info' >{info}</div>
                )
            }
          </div>
          <Row className = 'confirm_btnContainer' >
            {
              buttons.map(
                (btn, idx) => {
                  const { text, onClick, outline, style } = btn;
                  let span = Math.floor(24 / buttons.length);
                  if (idx == buttons.length - 1) span = 24 - (span * (buttons.length - 1));
                  return (
                    <Col span = {span} key = {'_btn_of_confirm_' + idx} className = 'confirm_btnCol' >
                      <Button text = {text} outline = {outline === true ? true : false} onClick = {() => this.onClick(onClick)} style = {style} />
                    </Col>
                  )
                }
              )
            }
          </Row>
        </div>
      </Modal>
    );
  }

}
module.exports = Confirm;