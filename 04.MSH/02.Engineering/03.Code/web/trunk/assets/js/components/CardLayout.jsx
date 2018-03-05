"use strict";

import { Component } from 'react';
import classnames from 'classnames';

class CardLayout extends Component {
  constructor (props) {
    super(props);
    this.state={};
  }
  push (crumb) {
	  this.state.items.push(crumb);
	  this.setState(this.state.items);
  }
  pop(){
	 this.state.items.pop();
	 this.setState(this.state.items);
  }
  renderItems () {
	var items = this.props.items||[];
    let list = items.map(function (item, i) {
    	if(i==items.length-1)return (<div>{item.component}</div>);
    	return (<div style={{ display: 'none'}}>{item.component}</div>);
    }, this);
    
    return list;
  }
  
  render () {
	  if(!(this.props.children instanceof Array)){
		  return (<div><div>{this.props.children}</div></div>);
	  }
	  let length = this.props.children.length
	  return (
		<div>
			{
				this.props.children.map(function (card,nindex) {
						if(length != (nindex+1) )
							return (<div style={{ display: 'none'}}>{card}</div>)
						else 
							return (<div>{card}</div>);
				})
			}
		</div>
	  );
  }
}

module.exports = CardLayout;


//renderNavigationList () {
//	var items = this.state.crumbs||[];
//    let list = items.map(function (r, i) {
//    	 return (<Grid width={ 1/12 }>{r.name}</Grid>);
//    }, this);
//    console.info(list);
//    return list;
//  }
//
//  render () {
//    return (
//    	<div style={{ border: '1px', lineHeight: '30px' }}>
//    	    {this.renderNavigationList()}
//    	</div>
//    );
//  }

//renderNavigationList () {
//	var items = this.state.crumbs||[];
//    let list = items.map(function (r, i) {
//    	 return (<div className={this.getClasses(r)} style={{ display: 'inline-block'}}> {r.name} </div>);
//    }, this);
//    console.info(list);
//    return list;
//  }
//
//  render () {
//    return (
//    	<div className="pure-g">
//    	    {this.renderNavigationList()}
//    	</div>
//    );