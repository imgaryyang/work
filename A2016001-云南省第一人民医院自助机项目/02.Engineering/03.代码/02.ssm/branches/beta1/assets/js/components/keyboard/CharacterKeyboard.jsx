import React, { PropTypes }   from 'react';
import { Row, Col }           from 'antd';

import styles                 from './CharacterKeyboard.css';

class CharacterKeyboard extends React.Component {

  
  constructor(props) {
    super(props);

    this.renderKeys = this.renderKeys.bind(this);
    this.onInput    = this.onInput.bind(this);
    this.onDel      = this.onDel.bind(this);
    this.onClear    = this.onClear.bind(this);
    this.onKeyPress = this.onKeyPress.bind(this);
    
    this.keys = ['', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', '', '', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', '', '', 'U', 'V', 'W', 'X', 'Y', 'Z', '清空', '删除', ''];
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
    if (key == '清空') {
      this.onClear();
    } else if (key == '删除') {
      this.onDel();
    } else {
      this.onInput(key);
    }
  }
 
  render() {

	var  width = this.props.width ||(document.body.clientWidth- 6 * 12);
	var  height = this.props.height ||(document.body.clientHeight / 3);
    const keyWidth = width / 10,
    keyHeight = (height - 2 * 12) / 3;
    return (
      <div className = 'ckeyboard_container' style = {{width: width + 'px', height:  height + 'px'}} >
        <Row className = 'ckeyboard_keyRow' style = {{width: (width + 2 * keyWidth) + 'px', left: (-(keyWidth)) + 'px'}} >
          {this.renderKeys(keyWidth, keyHeight)}
        </Row>
      </div>
    );
  }

  renderKeys(keyWidth, keyHeight) {

    return this.keys.map(
      (key, idx) => {

        let span = 2,
        colStyle = {
          width: keyWidth + 'px',
          height: keyHeight + 'px',
        },
        keyStyle = {
          lineHeight: keyHeight + 'px',
          width: (keyWidth - 12) + 'px',
          height: (keyHeight - 12) + 'px',
        };

        if (key == '清空' || key == '删除') {
          colStyle.width = 2 * keyWidth + 'px';
          
          keyStyle['fontSize'] = '3.5rem';
          keyStyle.width = (2 * keyWidth - 12) + 'px';
          keyStyle.height = (keyHeight - 12) + 'px';

          span = 4;
        }

        return (
          <Col span = {span} key = {'KB_KEY_' + idx} className = 'ckeyboard_keyCol' style = {colStyle} >
            <div className = 'ckeyboard_key' style = {keyStyle} onClick = {() => this.onKeyPress(key)} >
              {key ? key : ' '}
            </div>
          </Col>
        );
      }
    );
  }

}
module.exports = CharacterKeyboard;
