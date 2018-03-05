'use strict';

import { Component } from 'react';
import ReactDOM from 'react-dom';
import NavCard from '../../../components/NavCard.jsx';
import List from './list.jsx';
import Create from './create.jsx';
import Editor from './editor.jsx';
import Register from './register.jsx';
import Treatment from './treatment.jsx';
import TreatGuide from './treatGuide.jsx';

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
	  let personList=(<List key = 'list' name = '业务跟踪'  version={this.state.listVersion}
			onCreate={this.createModel.bind(this)}
			onView={this.viewTreatments.bind(this)}
	  		onInfo={this.infoModel.bind(this)}
	  		onRegister={this.onRegister.bind(this)}/>);
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
  createModel(){
	  this.state.items.push(<Create onClose = {this.back.bind(this)} refreshList={this.refreshList.bind(this)} key = 'newDoctor'name = '新增'/>);
	  this.setState(this.state.items);
  }
  infoModel(){
//	  this.state.items.push(<Info onClose = {this.back.bind(this)} refreshList={this.refreshList.bind(this)} key = 'info' name = '导诊'/>);
//	  this.setState(this.state.items);
  }
  onRegister(){
	  this.state.items.push(<Register onClose = {this.back.bind(this)} refreshList={this.refreshList.bind(this)} key = 'test' name = '挂号'/>); 
	  this.setState(this.state.items);
  }
  viewTreatments(patient){
	  this.state.items.push(<Treatment patient={patient} onGuide={this.onGuide.bind(this)} onClose = {this.back.bind(this)} refreshList={this.refreshList.bind(this)} key = 'treatments' name = '就诊记录列表'/>);
	  this.setState(this.state.items);
  }
  onGuide(data){
	  this.state.items.push(<TreatGuide data={data} onClose = {this.back.bind(this)} onGuide={this.refreshList.bind(this)} key = 'treatments' name = '就诊记录列表'/>);
	  this.setState(this.state.items);
  }
  editorModel(data){
	  this.state.items.push(<Editor data={data} onClose = {this.back.bind(this)} refreshList={this.refreshList.bind(this)} key = 'editDoctor' name='导诊'/>);
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
