'use strict';

import { Component } from 'react';
import ReactDOM from 'react-dom';
import NavCard from '../../../components/NavCard.jsx';
import BaseInfo from './baseInfo.jsx';
import BaseEditor from './baseEditor.jsx';

//医院微型主页
module.exports = class HosHome extends Component {
	
  constructor (props) {
    super(props); 
    this.state={
    	listVersion:1,
    	items:[]
    }
    this.state.items.push(this.getHomeCmp());
  }
  getHomeCmp(){
	  let baseInfo=(<BaseInfo key = 'baseInfo' ref='baseInfo' name = '医院基础信息' 
		  	version={this.state.listVersion} bindCard={this.bindCard.bind(this,'baseInfo')}
	  		onEdit={this.editorModel.bind(this)} />);
	  return baseInfo;
  }
  back(){
	  this.state.items.pop();
	  this.setState({items:this.state.items});
  }
  editorModel(data){
	  this.state.items.push(<BaseEditor data={data} onClose = {this.back.bind(this)} refreshInfo={this.refreshInfo.bind(this)} key = 'editDoctor' name='编辑'/>);
	  this.setState(this.state.items);
  }
  bindCard(key,card){
	  this[key]=card;
  }
  refreshInfo(){
	  let baseInfo = this['baseInfo'];
	  if(baseInfo && baseInfo.refresh){
		  baseInfo.refresh();
	  }
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
	  this.state.items = items;
	  this.setState(this.state.items );
  }
  render () {
	return (
    	<NavCard onBack={this.back.bind(this)} onSelect={this.selectCard.bind(this)} >
    		{this.state.items}
    	</NavCard>
    ) 
  }
}
