import React, { PropTypes }   from 'react';
import { Row, Col }           from 'antd';
import styles                 from './Input.css';

class Input extends React.Component {

  constructor(props) {
    super(props);
  }
 
  render() {
    let { focus, value, style,placeholder, ...other } = this.props;
    style = style ||{};
    if (!value) {
    	style = {...style,color : '#999999',fontSize : '2.5rem'};
    }
    var cls = 'input_container ' +(this.props.focus === true ? 'input_focusStyle' : '')
    return (
      <div className = {cls} style = {style} {...other} >
        {value ? value : placeholder}
      </div>
    );
  }

}
module.exports = Input;