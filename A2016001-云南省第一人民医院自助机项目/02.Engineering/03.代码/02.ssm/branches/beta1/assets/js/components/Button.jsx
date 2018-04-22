import React, { PropTypes }   from 'react';
import { Row, Col }           from 'antd';

import styles from './Button.css';

class Button extends React.Component {

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
    if (!style)style = {};

    const content = !this.props.disabled && this.props.waiting === true ? (
        <img src = './images/loading05.gif' className = 'button_loadingSpinner' />
    ) : this.props.text;

    let classNames = 'button_container';
    if (this.props.outline === true) classNames += ' button_outline' ;
    else classNames += ' button_normal'  ;
    if (this.props.disabled === true) classNames += ' button_disabled' ;

    if (className) classNames += ' ' + className;

    return (
      <div className = {classNames} style = {style} {...other} onClick = {this.onClick} >
        {content}
      </div>
    );
  }

}
module.exports = Button;
