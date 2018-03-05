'use strict';

import { Component } from 'react';
import ReactDOM from 'react-dom';
import NavCard from '../../../../components/NavCard.jsx';
import List from './list.jsx';
import Create from './create.jsx';
import Editor from './editor.jsx';
import Rolelist from './rolelist.jsx';

class ElsOptUserManageMain extends Component {
	
  constructor (props) {
    super(props);
    this.state={
    	listVersion:1,
    	items:[]
    }
    this.state.items.push(this.getHomeCmp());
  }
  
  getHomeCmp(){
	  let optUserList=(<List key = 'optUserMain' name = '操作人员管理'  version={this.state.listVersion}
			  onCreate={this.createElsOptUserManage.bind(this)}
			  onEditor={this.editorElsOptUserManage.bind(this)}
	  		  onRolelist={this.rolelistElsOptUserManage.bind(this)}/>);
   
	  return optUserList;
  }
  
  back(e){
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
	  this.state.items = items;
	  this.setState(this.state.items );
  }
  createElsOptUserManage(data){
	  this.state.items.push(<Create onClose = {this.back.bind(this)} refreshList={this.refreshList.bind(this)} key = 'newElsOptUserManage'name = '新增操作人员'/>);
	  this.setState(this.state.items);
  }
  editorElsOptUserManage(data){
	  this.state.items.push(<Editor data={data} onClose = {this.back.bind(this)} refreshList={this.refreshList.bind(this)} key = 'editElsOptUserManage' name='编辑'/>);
	  this.setState(this.state.items);
  }
  rolelistElsOptUserManage(data){
	  this.state.items.push(<Rolelist data={data} onClose = {this.back.bind(this)} refreshList={this.refreshList.bind(this)} key = 'rolelistElsOptUserManage' name='人员授权'/>);
	  this.setState(this.state.items);
  }
  putoutElsOptUserManage(data){
    <List data={data} onClose = {this.back.bind(this)} refreshList={this.refreshList.bind(this)} />;
  }
  putdemoElsOptUserManage(data){
    <List onClose = {this.back.bind(this)} refreshList={this.refreshList.bind(this)} />;
  }
  render() {
	return (
    	<NavCard onBack={this.back.bind(this)} onSelect={this.selectCard.bind(this)} >
    		{this.state.items}
    	</NavCard>
    ) 
  }
}

module.exports = ElsOptUserManageMain;
