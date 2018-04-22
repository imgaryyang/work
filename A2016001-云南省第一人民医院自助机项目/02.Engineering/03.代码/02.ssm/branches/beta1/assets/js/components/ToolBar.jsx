import React, { PropTypes } from 'react';
import { Row, Col }         from 'antd';

class ToolBar extends React.Component {

  constructor(props) {
    super(props);
  }
 
  render() {
    let {style, position, dispatch, ...otherProps} = this.props;
    position = position || 'top';
    style = style ? style : {};
    if (position && position == 'bottom') {
      style['position'] = 'absolute';
      style['left'] = '0';
      style['bottom'] = '0';
    }
    style['paddingLeft'] ='1.5rem';
    style['paddingRight'] = '1.5rem';
    style['paddingBottom'] = '1.5rem';

    return (
      <div  style = {style} {...otherProps} >
        {this.props.children}
      </div>
    );
  }

}
  
module.exports = ToolBar;