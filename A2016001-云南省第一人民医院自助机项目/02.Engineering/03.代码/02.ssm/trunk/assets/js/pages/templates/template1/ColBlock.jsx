import React, { PropTypes } from 'react';
import baseUtil from '../../../utils/baseUtil.jsx';
import logUtil,{ log } from '../../../utils/logUtil.jsx';
import { Icon,Row, Col  } from 'antd';
import icons from '../Icons.jsx';

import styles from './ColBlock.css';

class Block extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    const { menu } = this.props;
    
    var blockStyle = {
		backgroundImage: 'url(' + icons[menu.icon]['src'] + ')',
		//backgroundColor: menu.color,
	};
    
    return (
      <div className='m_t1_cb_container' >
        <div className='m_t1_cb_icon' style={blockStyle}>
        </div>
        <div className='m_t1_cb_label'>{menu.alias}</div>
      </div>
    )
  }
}
	
module.exports = Block ;