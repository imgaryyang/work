import React, { Component, PropTypes } from 'react';
import NavContainer from '../../components/NavContainer.jsx';
import baseUtil from '../../utils/baseUtil.jsx';
class Error404 extends React.Component {
  constructor(props) {
	super(props);
	this.onBack = this.onBack.bind(this);
	this.onHome = this.onHome.bind(this);
  }
  onBack(){
	  baseUtil.goHome('404Back');
  }
  onHome(){
	  baseUtil.goHome('404Back');
  }
  render() {
	  return (
		<NavContainer title='未实现' onBack={this.onBack} onHome={this.onHome} >
	    <div style={{textAlign: 'center'}}>
	      <h1 >功能还未实现，敬请期待！ </h1>
	    </div>
	    </NavContainer >
	  );
  }
}
module.exports = Error404;