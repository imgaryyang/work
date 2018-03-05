"use strict";

import { Component } from 'react';
import classnames from 'classnames';
import { Breadcrumb } from 'antd';
//class Breadcrumb extends Component {
//	 constructor (props) {
//	    super(props);
//	    this.state = {
//	    	icon : props.icon||"",
//	    	style: props.style||"",
//	    	text : props.text||"导航"
//	    };
//	 }
//	 onClick(){
//		 if(this.props.onClick)this.props.onClick.apply(this.props,arguments);
//	 }
//	 render () {
//		 return (<a onClick={this.onClick.bind(this)}>{this.state.text}<Icon icon="angle-right base-crumb-chevron" /></a>);
//	 }
//}
class BreadcrumbNavigation extends Component {
	constructor (props) {
		super(props);
		this.state = {
			items: this.props.items||[]
		};
    }
	push (crumb) {
		this.state.items.push(crumb);
		this.setState(this.state.items);
	}
	pop(){
		this.state.items.pop();
		this.setState(this.state.items);
	}
	clickBack(){
		//this.pop();
		if(this.props.onBack)this.props.onBack.apply(this.props,arguments);
	}
	clickCrumb(crumb,crumbCmp){
		if(this.props.selectCrumb)this.props.selectCrumb.apply(this.props,arguments);
	}
	renderNavigationList () {
		var items = this.props.children||[];
		let list = items.map(function (r, i) {
			//return (<Breadcrumb.Item  onClick={this.clickCrumb.bind(this,r)} text={r.props.text||r.props.name}/>);
			return (<Breadcrumb.Item  onClick={this.clickCrumb.bind(this,r)}>{r.props.text||r.props.name}</Breadcrumb.Item>);
		}, this);
		return list;
	}
	render () {
		return (
			<div className="crumb-wrapper">
				<Breadcrumb  separator=">">
				{
					this.renderNavigationList ()
				}
				</Breadcrumb>
			</div>
		);
	}
}

module.exports = BreadcrumbNavigation;
