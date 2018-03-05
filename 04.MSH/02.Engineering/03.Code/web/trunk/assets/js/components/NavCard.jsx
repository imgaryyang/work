"use strict";

import { Component } from 'react';
import classnames from 'classnames';
import Breadcrumb from './Breadcrumb.jsx';
import CardLayout from './CardLayout.jsx';
class NavCard extends Component {
	constructor (props) {
		super(props);
	}
//	componentWillReceiveProps(){
//		console.info('componentWillReceiveProps');
//		this.setState(this.parseState());
//		//this.setState(this.state.crumbs);
//	}
	parseState(){
		var crumbs = [],cards=[];
		this.props.items.forEach(function (item, index) {
			crumbs.push({key:item.key,name:item.name,component:item.component});
			cards.push({key:item.key,name:item.name,component:item.component});
		});
		return {
			crumbs:crumbs,
			cards:cards,
		}
	}
	selectCrumb(){
		//this.push({key:'demo',name:'测试',component:<Demo/>});
		if(this.props.onSelect)this.props.onSelect.apply(this.props,arguments);
	}
	crumbBack(){
		if(this.props.onBack)this.props.onBack.apply(this.props,arguments);
	}
	renderCrumbs () {
		var items = this.state.items || [];
		let list = items.map(function (item, i) {
			return {key:item.key,text:item.name};
		}, this);
		return list;
	}
	
	render () {
		return (
				<div>
					<Breadcrumb selectCrumb={this.selectCrumb.bind(this)}
						onBack={this.crumbBack.bind(this)}>	
						{this.props.children}
					</Breadcrumb>
					<CardLayout>
						{this.props.children}
					</CardLayout>
				</div>
		);
	}
}

module.exports = NavCard;


/*active(index){
	
}
activeByKey(key){
	
}
push (item) {console.info('push ',item);
	this.pushCard(item);
	this.pushCrumb(item);
}
pushCard (item) {
	this.state.cards.push(item);
	this.setState(this.state.cards);
}
pushCrumb (item) {
	this.state.crumbs.push(item);
	this.setState(this.state.crumbs);
}
pop(){
	this.popCrumb();
	this.popCard();
}
popCrumb(){
	this.state.crumbs.pop();
	this.setState(this.state.crumbs);
}
popCard(){
	this.state.cards.pop();
	this.setState(this.state.cards);
}*/


//
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