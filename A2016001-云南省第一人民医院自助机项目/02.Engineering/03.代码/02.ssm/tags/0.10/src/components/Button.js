import React, { PropTypes }   from 'react';
import { connect }            from 'dva';
import { Row, Col }           from 'antd';

import styles                 from './Button.css';

import loading                from '../assets/loading05.gif';

class Button extends React.Component {

  static displayName = 'Button';
  static description = '通用按钮';

  static propTypes = {

    /**
    * 按钮文字
    */
    text: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.element,
    ]),

    /**
     * 禁用
     */
    disabled: PropTypes.bool,

    /**
     * 等待状态
     */
    waiting: PropTypes.bool,

    /**
     * 点击回调
     */
    onClick: PropTypes.func,

    /**
     * 是否显示为线框
     */
    outline: PropTypes.bool,

  };

  static defaultProps = {
    disabled: false,
    waiting: false,
    outline: false,
  };

  constructor(props) {
    super(props);
    this.onClick = this.onClick.bind(this);
  }

  onClick() {
    if (typeof this.props.onClick == 'function' && !this.props.disabled && !this.props.waiting)
      this.props.onClick();
  }
 
  render() {
    let { text, style, dispatch, disabled, waiting, onClick, outline, className, ...other } = this.props;

    if (!style)
      style = {};

    const content = !this.props.disabled && this.props.waiting === true ? (
        <img src = {loading} className = {styles.loadingSpinner} />
    ) : this.props.text;

    let classNames = styles.container;
    if (this.props.outline === true) classNames += ' ' + styles.outline;
    else classNames += ' ' + styles.normal;
    if (this.props.disabled === true) classNames += ' ' + styles.disabled;

    if (className) classNames += ' ' + className;

    return (
      <div className = {classNames} style = {style} {...other} onClick = {this.onClick} >
        {content}
      </div>
    );
  }

}

export default connect()(Button);


