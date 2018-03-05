'use strict';

import { Component } from 'react';
import ReactDOM from 'react-dom';
import NavCard from '../../../components/NavCard.jsx';
import IndexList from './list.jsx';
import PayListUpLoad from '../pay/upload.jsx';
import StubListUpLoad from '../stub/import.jsx';

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
							upLoadPayList={this.uploadPayList.bind(this)}
							upLoadStubList={this.uploadStubList.bind(this)}
							/>)

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
		this.setState({
			items: this.state.items,
			listVersion: this.state.listVersion,
		});
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
		this.state.items.push(<PayListUpLoad onClose = {this.back.bind(this)} refreshList={this.refreshList.bind(this)} key = 'uploadPay' name = '导入代发明细'/>);
		this.setState(this.state.items);
  	}

  	uploadStubList(){
  		console.log('main-------uploadStubList');
		this.state.items.push(<StubListUpLoad onClose = {this.back.bind(this)} refreshList={this.refreshList.bind(this)} key = 'uploadStub' name = '导入工资明细'/>);
		this.setState(this.state.items);
  	}

	render () {
		console.log('main------render')
		return (
				<NavCard onBack={this.back.bind(this)} onSelect={this.selectCard.bind(this)} >
					{this.state.items}
				</NavCard>
		) 
	}
}

module.exports = IndexMain;
