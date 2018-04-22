import React, { PropTypes }   from 'react';
import { connect }            from 'dva';
import { Row, Col }           from 'antd';

import config                 from '../../config';
import styles                 from './CharacterKeyboard.css';

class CharacterKeyboard extends React.Component {

  static displayName = 'CharacterKeyboard';
  static description = '字符键盘';

  static propTypes = {

    /**
    * 键盘宽度 - px
    */
    width: PropTypes.number,

    /**
    * 键盘高度 - px
    */
    height: PropTypes.number,

    /**
     * 按键输入回调
     */
    onInput: PropTypes.func,

    /**
     * 按键删除键回调
     */
    onDel: PropTypes.func,

    /**
     * 按键清空键回调
     */
    onClear: PropTypes.func,

  };

  static defaultProps = {
    width: config.getWS().width,
    height: config.getWS().height / 3,
  };

  keys = ['', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', '', '', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', '', '', 'U', 'V', 'W', 'X', 'Y', 'Z', '清空', '删除', ''];

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
    if (key == '清空') {
      this.onClear();
    } else if (key == '删除') {
      this.onDel();
    } else {
      this.onInput(key);
    }
  }
 
  render() {

    const keyWidth = this.props.width / 10,
    keyHeight = (this.props.height - 2 * config.remSize) / 3;

    return (
      <div className = {styles.container} style = {{width: this.props.width + 'px', height: this.props.height + 'px'}} >
        <Row className = {styles.keyRow} style = {{width: (this.props.width + 2 * keyWidth) + 'px', left: (-(keyWidth)) + 'px'}} >
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
          width: (keyWidth - config.remSize) + 'px',
          height: (keyHeight - config.remSize) + 'px',
        };

        if (key == '清空' || key == '删除') {
          colStyle.width = 2 * keyWidth + 'px';
          
          keyStyle['fontSize'] = '3.5rem';
          keyStyle.width = (2 * keyWidth - config.remSize) + 'px';
          keyStyle.height = (keyHeight - config.remSize) + 'px';

          span = 4;
        }

        return (
          <Col span = {span} key = {'KB_KEY_' + idx} className = {styles.keyCol} style = {colStyle} >
            <div className = {styles.key} style = {keyStyle} onClick = {() => this.onKeyPress(key)} >
              {key ? key : ' '}
            </div>
          </Col>
        );
      }
    );
  }

}

export default connect()(CharacterKeyboard);


