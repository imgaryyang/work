import React, { PropTypes }   from 'react';
import { connect }            from 'dva';
import { Row, Col }           from 'antd';

import styles                 from './Input.css';

class Input extends React.Component {

  static displayName = 'Input';
  static description = '通用输入框';

  static propTypes = {

    /**
     * 输入域值
     */
    value: PropTypes.string,

    /**
     * 是否选中状态
     */
    focus: PropTypes.bool,

    /**
     * 占位符
     */
    placeholder: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.element,
    ]),
  };

  static defaultProps = {
    value: '',
    focus: false,
  };

  constructor(props) {
    super(props);
  }
 
  render() {
    let { focus, value, placeholder, style, dispatch, ...other } = this.props;

    if (!style)
      style = {};

    if (!this.props.value) {
      style.color = '#999999';
      style.fontSize = '2.5rem';
      /*style.textAlign = 'normal';*/
    }
    
    return (
      <div className = {styles.container + ' ' + (this.props.focus === true ? styles.focusStyle : '')} style = {style} {...other} >
        {this.props.value ? this.props.value : placeholder}
      </div>
    );
  }

}

export default connect()(Input);


