'use strict';

import { Component } from 'react';
import ReactDOM from 'react-dom';
import NavCard from '../../../components/NavCard.jsx';
import IndexList from './list.jsx';
//import PayListUpLoad from '../../els/pay/upload.jsx';

class IndexMain extends Component {
	
	constructor (props) {
		super(props);
		this.state={
			listVersion:1,
			items:[]
		};
		console.info("进入IndexMain！！！！！！！！！！！ ");
		this.state.items.push(this.getHomeCmp());
	}
	getHomeCmp(){

		let indexList  = (<IndexList key = 'elsIndex' name = '首页' version = {this.state.listVersion}
							upLoadPayList={this.uploadPayList.bind(this)} />)

		return indexList;
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

  	uploadPayList(){
//	  this.state.items.push(<PayListUpLoad onClose = {this.back.bind(this)} refreshList={this.refreshList.bind(this)} key = 'uploadPay' name = '导入'/>);
//	  this.setState(this.state.items);
  	}

	render () {
		return (
				<NavCard onBack={this.back.bind(this)} onSelect={this.selectCard.bind(this)} >
					{this.state.items}
				</NavCard>
		) 
	}
}

module.exports = IndexMain;
