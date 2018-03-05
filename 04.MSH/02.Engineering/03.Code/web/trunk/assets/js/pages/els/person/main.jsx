'use strict';

import { Component } from 'react';
import ReactDOM from 'react-dom';
import NavCard from '../../../components/NavCard.jsx';
import ElsPersonManageList from './list.jsx';
import Create from './create.jsx';
import Editor from './editor.jsx';
import PutIn from './putin.jsx';
import Preview from './preview.jsx';

module.exports = class ElsPersonManageMain extends Component {
	
  constructor (props) {
    super(props);
    this.state={
    	listVersion:1,
    	items:[]
    }
    this.state.items.push(this.getHomeCmp());
  }
  getHomeCmp(){
	  let personList=(<ElsPersonManageList key = 'personMain' name = '人员管理'  version={this.state.listVersion}
			  onCreate={this.createElsPersonManage.bind(this)}
			  onView={this.editorElsPersonManage.bind(this)} 
        onPutOut={this.putoutElsPersonManage.bind(this)}
      //  onPutOut= window.location.href="http://localhost:8080/els/permng/export?data={"orgId":"12345678"}";
        onPutIn={this.putinElsPersonManage.bind(this)}
        onPutDemo={this.putdemoElsPersonManage.bind(this)}/>);
   
	  return personList;
  }
  back(){
	  this.state.items.pop();
	  this.state.listVersion = this.state.listVersion+1;
	  this.setState({items:this.state.items});
  }
  refreshList(){
	  this.state.items=[];
	  this.state.listVersion++;
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
  createElsPersonManage(){
	  this.state.items.push(<Create onClose = {this.back.bind(this)} refreshList={this.refreshList.bind(this)} key = 'newElsPersonManage'name = '新增人员'/>);
	  this.setState(this.state.items);
  }
  editorElsPersonManage(data){
	  this.state.items.push(<Editor data={data} onClose = {this.back.bind(this)} refreshList={this.refreshList.bind(this)} key = 'editElsPersonManage' name='编辑'/>);
	  this.setState(this.state.items);
  }
  putoutElsPersonManage(data){
    <ElsPersonManageList data={data} onClose = {this.back.bind(this)} refreshList={this.refreshList.bind(this)} />;
   // this.setState(this.state.items);
  }
  putinElsPersonManage(data){
    this.state.items.push(<PutIn data={data} onClose = {this.back.bind(this)}  onPreview={this.previewElsPersonManage.bind(this)} refreshList={this.refreshList.bind(this)} key = 'inElsPersonManage' name='人员文件导入'/>);
    this.setState(this.state.items);
  }
  putdemoElsPersonManage(data){
    <ElsPersonManageList  onClose = {this.back.bind(this)} refreshList={this.refreshList.bind(this)} />;
  //  this.setState(this.state.items);
  }
  previewElsPersonManage(data){
    this.state.items.push(<Preview  data={data} onClose = {this.back.bind(this)} refreshList={this.refreshList.bind(this)} key = 'viewElsPersonManage' name = '导入预览' />);
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
