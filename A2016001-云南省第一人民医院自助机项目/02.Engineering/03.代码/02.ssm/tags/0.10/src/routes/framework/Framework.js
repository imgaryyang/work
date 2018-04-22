import React, { PropTypes } from 'react';
import { routerRedux } 			from 'dva/router';
import { connect } 					from 'dva';

import Message 							from '../../components/Message';

class Framework extends React.Component {

	constructor (props) {
	    super(props);
	}
	
	componentWillMount () {}
	
	componentDidMount () {}
	
	componentDidUpdate () {}
	
	render () {
		
		const {current} = this.props.frame;
		
		return (
			<div>
				{this.props.children}
				<Message />
			</div>
		);	
	}
}  



/**
 * ({frame}) => ({frame})用于获取namespace为frame的model; 
 * connect 函数用于将获取到的model与组件Framework做关联
 */
export default  connect(({frame}) => ({frame}))(Framework);

/*import { withRouter } from 'react-router'
export default  connect(({frame}) => ({frame}))(withRouter(Framework));*/