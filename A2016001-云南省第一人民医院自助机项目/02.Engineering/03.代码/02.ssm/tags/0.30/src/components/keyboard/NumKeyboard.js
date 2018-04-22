import React, { PropTypes }   from 'react';
import { connect }            from 'dva';
import { Row, Col }           from 'antd';

import config                 from '../../config';
import styles                 from './NumKeyboard.css';

class NumKeyboard extends React.Component {

  static displayName = 'NumKeyboard';
  static description = '数字小键盘';

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
    width: 40 * config.remSize,
    height: 40 * config.remSize,
  };

  keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '清空', '删除'];

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
    if (typeof this.props.onKeyDown == 'function')
        this.props.onKeyDown(key);
  }
 
  render() {

    return (
      <div className = {styles.container} >
        <Row className = {styles.keyRow} >
          {this.renderKeys()}
        </Row>
      </div>
    );
  }

  renderKeys() {
    let keyHeight = (this.props.height - 3 * config.remSize) / 4;
    return this.keys.map(
      (key, idx) => {
        
        let keyStyle = {
          lineHeight: keyHeight + 'px',
        }
        if (key == '清空' || key == '删除')
          keyStyle['fontSize'] = '4rem';

        return (
          <Col span = {8} key = {'KB_KEY_' + idx} className = {styles.keyCol} >
            <div className = {styles.key} style = {keyStyle} onClick = {() => this.onKeyPress(key)} >
              {key}
            </div>
          </Col>
        );
      }
    );
  }

}

export default connect()(NumKeyboard);


