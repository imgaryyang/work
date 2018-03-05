'use strict';

import { Component } from 'react';
import ReactDOM from 'react-dom';
import NavCard from '../../../components/NavCard.jsx';
import List from './list.jsx';
import Editor from './editor.jsx';
import UploadPayFile from './upload.jsx';
module.exports = class GrantMain extends Component {
	
  constructor (props) {
    super(props); 
    this.state={
    	listVersion:1,
    	items:[]
    }
    this.state.items.push(this.getHomeCmp());
  }
  getHomeCmp(){
	  let personList = (<List key = 'list' name = '发放明细'  version={this.state.listVersion}
	  		  onUpload={this.uploadModel.bind(this)}
			  onView={this.editorModel.bind(this)}/>);
	  
	  return personList;
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
	  for(i=0;i<this.state.items.length;i++){
		  items.push(this.state.items[i]);
		  if(this.state.items[i].key ==card.key)break;
	  }
	 // this.state.items.splice(i,(items.length-i-1));
	  this.state.items = items;
	  this.setState(this.state.items );
  }
  uploadModel(){
	  this.state.items.push(<UploadPayFile onClose = {this.back.bind(this)} onView = {this.editorModel.bind(this)} refreshList={this.refreshList.bind(this)} key = 'uploadPay'name = '导入'/>);
	  this.setState(this.state.items);
  }
  editorModel(data){
	  this.state.items.push(<Editor data={data} onClose = {this.back.bind(this)} refreshList={this.refreshList.bind(this)} key = 'editPay' name='编辑'/>);
	  this.setState(this.state.items);
  }
  render () {
	return (
    	<NavCard onBack={this.back.bind(this)} onSelect={this.selectCard.bind(this)} >
    		{this.state.items}
    	</NavCard>
    ) 
  }
}
