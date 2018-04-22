import React, { Component, PropTypes } 	from 'react';
import { Menu, Icon,Breadcrumb,Button} 	from 'antd';
import { connect } 											from 'dva';
import { Link } 												from 'dva/router';
import config 													from '../config';

import styles 													from './WorkSpace.css';


class WorkSpace extends React.Component {

  static propTypes = {
  	width: PropTypes.string,
  	height: PropTypes.string,
  	fullScreen: PropTypes.bool,
  };

  static defaultProps = {
  	width: config.getWS().width + 'px',
  	height: config.getWS().height + 'px',
  	fullScreen: false,
  };

	constructor(props) {
	    super(props);
	}
	
	componentWillMount() {}
	
	componentDidMount() {}
	
	componentDidUpdate() {}
	
	render() {

		let {width, height, fullScreen, style, dispatch, ...otherProps} = this.props;

		let wsStyle = style ? style : {};
		if(!fullScreen) {
			if (width) wsStyle.width = width;
			if (height) wsStyle.height = height;
		}
		
		return (
			<div className = {styles.container} style = {wsStyle} {...otherProps} >
				{this.props.children}
			</div>
		);	
	}
}  

export default connect()(WorkSpace);


