'use strict';

import { Component } from 'react';
import ReactDOM from 'react-dom';
import NavCard from '../../../components/NavCard.jsx';
import List from './list.jsx';
import Create from './create.jsx';
import Editor from './editor.jsx';
class Main extends Component {
  
  constructor (props) {
    super(props);
    this.state={
      listVersion:1,
      listBatchinfoVersion:1,      
      items:[]
    }
    this.state.items.push(this.getHomeCmp());
  }
  getHomeCmp(){
    let list=(<List key = 'ListMain' name = '模板列表'  version={this.state.listVersion}
        refreshList={this.refreshList.bind(this)}
        onCreate={this.create.bind(this)}
        onView={this.editor.bind(this)}/>);
    return list;
  }
  back(){
    this.state.items.pop();
    //this.state.listVersion = this.state.StubBatchListVersion+1;
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
    //this.state.items.splice(i,(items.length-i-1));
    this.state.items = items;
    this.setState(this.state.items );
  }

  
  //模板新增
  create(){
    this.state.items.push(<Create onClose = {this.back.bind(this)} refreshList={this.refreshList.bind(this)}
      key = 'newTmpl'name = '模板新增'/>);
    this.setState(this.state.items);
  }
  //模板修改
  editor(data){
    this.state.items.push(<Editor data={data} onClose = {this.back.bind(this)} refreshList={this.refreshList.bind(this)} 
      key = 'editTmpl' name='模板修改' version={this.state.listBatchinfoVersion}/>);
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

module.exports = Main;