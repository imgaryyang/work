import React, { PropTypes } from 'react';
import baseUtil from '../../../utils/baseUtil.jsx';
import logUtil,{ log } from '../../../utils/logUtil.jsx';
import { Icon,Row, Col  } from 'antd';
import icons from '../Icons.jsx';

import styles from './MenuBlock.css';

class Block extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    var menu = this.props.menu||{};
	/**
	if(menu.code == 'checkRecords'
		|| menu.code == 'bloodcheck' || menu.code == 'pay'  )  {
		menu.color = '#BFBFBF'
	}
	*/	
	var blockStyle = {
		backgroundImage: 'url(' + icons[menu.icon]['src'] + ')',
		backgroundSize: '11.5rem auto',
		backgroundColor: menu.color,
		height:  '11.5rem',
		margin:'10px',
	};
	return (
		<div className = 'm_t0_cb_block' style = {blockStyle} >
			<div className ='m_t0_cb_label' style = {{paddingTop:  '8rem'}} >
			{menu.alias}
			</div>
		</div>
    );
  }
}
	
module.exports = Block ;



