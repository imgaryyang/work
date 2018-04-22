import React, { PropTypes } from 'react';
import { routerRedux } 		from 'dva/router';
import { connect } 			from 'dva';
import {Message} 			from '../../components';
//import styles				from './Framework.css';
class CashierDesk extends React.Component {

	constructor (props) { 
	    super(props);
	}
	
	state = {};
	
	componentWillMount () {
		const {order,settlement} = this.props.location.state;
		this.props.dispatch({
			type: 'payment/setState',
			payload:{order:order,settlement:settlement}
		});
	}
	
	componentWillReceiveProps(nextProps){}
	
	componentDidMount () {}
	
	componentDidUpdate () {}
	
	
	render () {
		return (
			<div>
				{this.props.children}
			</div>
		);	
	}
}  



/**
 * ({frame}) => ({frame})用于获取namespace为frame的model; 
 * connect 函数用于将获取到的model与组件Framework做关联
 */
export default  connect()(CashierDesk);
