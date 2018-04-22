import React, { PropTypes } from 'react';
import { connect }          from 'dva';
import { Row, Col }         from 'antd';
import styles               from './ToolBar.css';
import config               from '../config';

class ToolBar extends React.Component {

  static displayName = 'ToolBar';
  static description = '顶端工具栏';

  static propTypes = {

    /**
    * 步骤数组
    * 必填
    */
    position: PropTypes.string,

  };

  static defaultProps = {
    position: 'top',
  };

  constructor(props) {
    super(props);
  }
 
  render() {

    let {style, position, dispatch, ...otherProps} = this.props;

    style = style ? style : {};

    if (position && position == 'bottom') {
      style['position'] = 'absolute';
      style['left'] = '0';
      style['bottom'] = '0';
    }

    style['paddingLeft'] = config.navBar.padding + 'rem';
    style['paddingRight'] = config.navBar.padding + 'rem';
    style['paddingBottom'] = config.navBar.padding + 'rem';

    return (
      <div className = {styles.container} style = {style} {...otherProps} >
        {this.props.children}
      </div>
    );
  }

}
  

export default connect()(ToolBar);


