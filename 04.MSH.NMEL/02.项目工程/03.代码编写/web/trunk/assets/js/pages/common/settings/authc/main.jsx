'use strict';

import { Component } from 'react';
import ReactDOM from 'react-dom';
import NavCard from '../../../../components/NavCard.jsx';
import AuthcList from './list.jsx';

class AuthcMain extends Component {
	
	constructor (props) {
		super(props);
		this.state={
			listVersion:1,
			items:[]
		};
		this.state.items.push(this.getHomeCmp());
	}
	getHomeCmp(){

		let authc  = (<AuthcList key = 'authcList' name = '角色' version = {this.state.listVersion} />)

		return authc;
	}

	back(){
		this.state.items.pop();
		this.state.listVersion = this.state.listVersion+1;
		this.setState({items:this.state.items});
	}

	refreshList(){
		this.state.items=[];
		this.state.items.listVersion++;
		this.state.items[0] = this.getHomeCmp();
		this.setState({items:this.state.items,listVersion:this.state.listVersion});
	}

	selectCard(card){ 
		var items=[],i=0;
		for( i=0;i<this.state.items.length;i++ ){
			items.push(this.state.items[i]);
			if( this.state.items[i].key == card.key )break;
		}
		this.state.items = items;
		this.setState( this.state.items );
	}

	render () {
		return (
				<NavCard onBack={this.back.bind(this)} onSelect={this.selectCard.bind(this)} >
					{this.state.items}
				</NavCard>
		) 
	}
}

module.exports = AuthcMain;
