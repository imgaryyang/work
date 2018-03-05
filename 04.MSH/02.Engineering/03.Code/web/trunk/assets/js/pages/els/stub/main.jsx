'use strict';

import { Component } from 'react';
import ReactDOM from 'react-dom';
import NavCard from '../../../components/NavCard.jsx';
import StubBatchList from './batchList.jsx';
import Create from './create.jsx';
import Editor from './batchinfoList.jsx';
import Import from './import.jsx';
import Export from './export.jsx';
import InfoCreate from './stubinfoCreate.jsx';
import InfoEditor from './stubinfoEditor.jsx';
class StubBatchMain extends Component {
  
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
    let list=(<StubBatchList key = 'StubBatchMain' name = '工资批次'  version={this.state.listVersion}
        refreshList={this.refreshList.bind(this)}
        onCreate={this.createStubBatch.bind(this)}
        onView={this.editorStubBatch.bind(this)}
        onImport={this.importStubBatch.bind(this)}
        onExport={this.exportStubBatch.bind(this)}/>);
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

  //批次明细新增
  createStubBatchinfo(data){
    this.state.items.push(<InfoCreate data={data} onClose = {this.back.bind(this)} 
      key = 'newStubBatchinfo'name = '明细新增'/>);
    this.setState(this.state.items);
  }
  //批次明细修改
  editorStubBatchinfo(data){
    this.state.items.push(<InfoEditor data={data} onClose = {this.back.bind(this)} 
      key = 'editStubBatchinfo' name='明细编辑'/>);
    this.setState(this.state.items);
  }
  //批次导入
  importStubBatch(){
    this.state.items.push(<Import onClose = {this.back.bind(this)} refreshList={this.refreshList.bind(this)} 
    onView = {this.editorStubBatch.bind(this)}  key = 'importStubBatch'name = '批次导入'/>);
    this.setState(this.state.items);
  }
  //批次导出
  exportStubBatch(){
    this.state.items.push(<Export  key = 'Export' onClose = {this.back.bind(this)} refreshList={this.refreshList.bind(this)} 
      key = 'exportStubBatch'name = '批次导出'/>);
    this.setState(this.state.items);
  }
  //批次新增
  createStubBatch(){
    this.state.items.push(<Create onClose = {this.back.bind(this)} refreshList={this.refreshList.bind(this)} 
      onSubmit = {this.editorStubBatch.bind(this)}
      key = 'newStubBatch'name = '批次新增'/>);
    this.setState(this.state.items);
  }
  //批次查看
  editorStubBatch(data){
    this.state.items.push(<Editor data={data} onClose = {this.back.bind(this)} refreshList={this.refreshList.bind(this)} 
      key = 'editStubBatch' name='工资批次明细' version={this.state.listBatchinfoVersion}
      onCreate={this.createStubBatchinfo.bind(this)}
      onView={this.editorStubBatchinfo.bind(this)}/>);
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

module.exports = StubBatchMain;