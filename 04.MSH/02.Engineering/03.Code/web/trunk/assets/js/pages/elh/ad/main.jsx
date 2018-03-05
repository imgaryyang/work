'use strict';

import { Component } from 'react';
import ReactDOM from 'react-dom';
import NavCard from '../../../components/NavCard.jsx';
module.exports = class DoctorMain extends Component {
	
  constructor (props) {
    super(props); 
    this.state={
    	listVersion:1,
    	items:[]
    }
    this.state.items.push(this.getHomeCmp());
  }
  getHomeCmp(){
  }
  back(){
	  this.state.items.pop();
	  this.setState({items:this.state.items});
  }
  refreshList(){
	  this.refs['list'].refresh();
//	  this.state.items=[];
//	  this.state.listVersion++;
//	  this.state.items[0] = this.getHomeCmp();
//	  this.setState({items:this.state.items,listVersion:this.state.listVersion});
  }
  selectCard(card){ 
	  var items=[],i=0;
	  for(i=0;i<this.state.items.length;i++){
		  items.push(this.state.items[i]);
		  if(this.state.items[i].key ==card.key)break;
	  }
	 // this.state.items.splice(i,(items.length-i-1));
	  this.state.items = items;
	  this.setState(this.state.items );
  }
  createModel(){
  }
  editorModel(data){
  }
  render () {
	return (
    	<NavCard onBack={this.back.bind(this)} onSelect={this.selectCard.bind(this)} >
    		{this.state.items}
    	</NavCard>
    ) 
  }
}
