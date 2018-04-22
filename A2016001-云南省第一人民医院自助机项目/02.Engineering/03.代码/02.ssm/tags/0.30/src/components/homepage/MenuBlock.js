import React, { PropTypes } from 'react';
import { connect } from 'dva';

import { Icon } from 'antd';
import styles from './MenuBlock.css';
import config from '../../config';
import icons from './Icons';
import baseUtil from '../../utils/baseUtil';
function MenuBlock (props) {

	let { menu, onSelect } = props;

	menu = menu || {};

	function handleClick (e) {
		if(menu.url == 'disabled' && menu.pathname.indexOf('/opt/') ==-1){
			baseUtil.warning('本功能暂不开放');
			return;
		}
		if(onSelect)onSelect(e, menu);
	}

	let blockStyle = {
		backgroundImage: 'url(' + icons[menu.icon]['src'] + ')',
		backgroundSize: config.home.menu.height + 'rem' + ' auto',
		backgroundColor: menu.color,
		height: config.home.menu.height + 'rem',
	};
	if(menu.url =='disabled' && menu.pathname.indexOf('/opt/') ==-1){
		blockStyle.backgroundColor = 'rgba(78,78,78,0.5)'
	}
	return (
		<div className = {styles.block} onClick = {handleClick} style = {blockStyle} >
			<div className = {styles.label} style = {{paddingTop: (config.home.menu.height - 3.5) + 'rem'}} >{menu.alias}</div>
		</div>
	);
};

export default connect() (MenuBlock);

//id	id	
//名称	name
//别名	alias
//编码	code
//url	url
//坐标	coordinate
//长度	colspan
//高度	rowspan
//配色	color
//图标	icon //TODO 如果不存在使用默认



