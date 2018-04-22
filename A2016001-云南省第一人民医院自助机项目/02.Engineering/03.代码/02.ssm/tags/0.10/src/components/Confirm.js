import React, { PropTypes }   from 'react';
import { connect }            from 'dva';
import { Row, Col, 
  Modal, Icon }               from 'antd';

import config                 from '../config';
import styles                 from './Confirm.css';
import Button                 from './Button';

class Confirm extends React.Component {

  static displayName = 'Confirm';
  static description = '通用确认/提示窗口';

  static propTypes = {

    /**
     * 提示信息
     */
    info: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.element,
    ]).isRequired,

    /**
     * 显示属性
     */
    visible: PropTypes.bool,

    /**
     * 按钮
     * {text: '', outline: true | false, onClick: func, style: object}
     */
    buttons: PropTypes.array,

  };

  static defaultProps = {
    visible: false,
    buttons: [],
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
    let { style, info, visible, buttons, dispatch, ...other } = this.props;

    if (!style)
      style = {};
    style['top'] = this.modalWinTop + 'rem';

    return (
      <Modal visible = {visible} closable = {false} footer = {null} width = {config.getWS().width * 0.6836 + 'px'} style = {style} >
        <div className = {styles.container} >
          <div className = {styles.infoContainer} >
            {
              typeof info == 'string' ? (
                <div className = {styles.info} >
                  <Icon type = 'exclamation-circle-o' style = {{fontSize: '6rem', color: '#BC1E1E'}} /><br/>
                  {info}
                </div>) : ({info})
            }
          </div>
          <Row className = {styles.btnContainer} >
            {
              buttons.map(
                (btn, idx) => {
                  const { text, onClick, outline, style } = btn;
                  let span = Math.floor(24 / buttons.length);
                  if (idx == buttons.length - 1) span = 24 - (span * (buttons.length - 1));
                  return (
                    <Col span = {span} key = {'_btn_of_confirm_' + idx} className = {styles.btnCol} >
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

export default connect()(Confirm);


