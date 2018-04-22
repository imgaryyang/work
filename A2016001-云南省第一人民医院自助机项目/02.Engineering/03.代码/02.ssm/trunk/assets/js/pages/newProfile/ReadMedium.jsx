"use strict";

import { Component, PropTypes } from 'react';
import ReadMiCard from './ReadMiCard.jsx';
import ReadIdCard from './ReadIdCard.jsx';
class Page extends Component {
	constructor (props) {
		super(props);
		this.afterRead = this.afterRead.bind(this);
	}
	afterRead(info){
		const { medium  } = this.props;
		if(this.props.afterRead)this.props.afterRead({...info,medium});
	}
	render() { 
		const { medium  } = this.props;
		if(medium == 'mi' ){
			return (<ReadMiCard afterMiCardRead = {this.afterRead}/>);
		}else {
			return (<ReadIdCard afterIdCardRead = {this.afterRead} />)	;
		}
	}
}
module.exports = Page;