import React, { PropTypes } from 'react';
import baseUtil from '../../../utils/baseUtil.jsx';
import logUtil,{ log } from '../../../utils/logUtil.jsx';
import { Icon,Row, Col  } from 'antd';
import icons from '../Icons.jsx';
import styles from './CellBlock.css';

class Block extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    const { menu } = this.props;
    const name = menu.alias || menu.name;
    
    var blockStyle = {
		backgroundImage: 'url(' + icons[menu.icon]['src'] + ')',
	};
    return (
      <div className='m_t4_cb_container' >
        <div className='m_t4_cb_icon'  style={blockStyle}/>
        <div className='m_t4_cb_label'>{menu.alias}</div>
      </div>
    )
  }
}
	
module.exports = Block ;