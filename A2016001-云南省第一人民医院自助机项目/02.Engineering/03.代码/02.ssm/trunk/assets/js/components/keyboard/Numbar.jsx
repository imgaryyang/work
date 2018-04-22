import React, { PropTypes }   from 'react';
import { Row, Col }           from 'antd';
import styles                 from './NumKeyboard.css';

class NumKeyboard extends React.Component {

  constructor(props) {
    super(props);

    this.renderKeys = this.renderKeys.bind(this);
    this.onInput    = this.onInput.bind(this);
    this.onDel      = this.onDel.bind(this);
    this.onClear    = this.onClear.bind(this);
    this.onKeyPress = this.onKeyPress.bind(this);
  }

  onInput(value) {
    if (typeof this.props.onInput == 'function')
      this.props.onInput(value);
  }

  onDel() {
    if (typeof this.props.onDel == 'function')
      this.props.onDel();
  }

  onClear() {
    if (typeof this.props.onClear == 'function')
      this.props.onClear();
  }

  /**
   * 按键触发回调
   */
  onKeyPress(key) {
    if (typeof this.props.onKeyDown == 'function')
        this.props.onKeyDown(key);
  }
 
  render() {
    return (
      <div className = 'NumKeyboard_container' >
        <Row className = 'NumKeyboard_keyRow' >
          {this.renderKeys()}
        </Row>
      </div>
    );
  }

  renderKeys() {
	const { hasDot } = this.props;
	var dot =  hasDot?'.':'清空'
	const  keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', dot, '删除'];
    return keys.map((key, idx) => {
    	let keyStyle = {
	      lineHeight: (this.props.height - 36) / 4 + 'px',
	    }
        if (key == '清空' || key == '删除')keyStyle['fontSize'] = '4rem';
        return (
          <Col span = {2} key = {idx} className = 'NumKeyboard_keyCol' >
            <div className = 'NumKeyboard_key' style = {keyStyle} onClick = {() => this.onKeyPress(key)} >
              {key}
            </div>
          </Col>
        );
      }
    );
  }

}
module.exports = NumKeyboard;

