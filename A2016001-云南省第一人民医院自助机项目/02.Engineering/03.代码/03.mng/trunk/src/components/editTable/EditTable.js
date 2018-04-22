import React, { Component, PropTypes } from 'react';
import { connect } from 'dva';
import { Table } from 'antd';
import styles from './EditTable.css';
import InputCell from './cells/InputCell';
import DateCell from './cells/DateCell';
import CommonTable from '../CommonTable';
class EditTable extends Component {
  constructor(props){
	super(props);
	this.handleEnter = this.handleEnter.bind(this);
	this.handleCellChange = this.handleCellChange.bind(this);
	this.getUpdatedData  = this.getUpdatedData.bind(this);
  }
  
  componentWillMount(){
	  this.cacheData = this.props.data;
  }
  componentWillReceiveProps(next){
	  var nextData = next.data||[];
	  var data = this.props.data||[];
	  if( nextData != data || nextData.length != data.length ){
		  this.cacheData = nextData;
	  }
  }
  componentWillUnmount(){
	  this.cellList=[];
  }
  state = {
	focus: null,
  }
  cacheData = [];
  cellList =[];
  createRender(column,cIndex){
	  var handleEnter = this.handleEnter;
	  var handleCellChange = this.handleCellChange;
	  var cellList= this.cellList;
	  var { focus } = this.state;
	  var oldRender= column.render;
	  var editorType = column.editor; 
	  var r = function(value, record,rIndex){
		  value = oldRender ? oldRender(value, record,rIndex) : value;
		  var key = rIndex+'_'+cIndex;
		  
		  var editable = (typeof column.editable == 'function')?column.editable(value, record):column.editable;
		  if(!editable)return value;
		  
		  var editor = null;
		  if('date' == editorType){
			  editor = <DateCell ref={key} onChange={v => handleCellChange(v,rIndex,column) } focus={focus==key} value = {value } onPressEnter={ e =>handleEnter(e,key,rIndex,cIndex)} editable={true} />
		  }else{
			  editor = <InputCell ref={key} onChange={v => handleCellChange(v,rIndex,column) } focus={focus==key} value = {value } onPressEnter={ e =>handleEnter(e,key,rIndex,cIndex)} editable={true} />
		  }
		  cellList.push(key);
		  //[key] = editor;
		  return editor
	  }
	  return r;
  }
  handleEnter(e,key,rIndex,cIndex){
	  var nextKey = this.findNextEditorKey(key);
	  this.setState({focus:nextKey});
  }
  handleCellChange(value,row,col) {
	  var r = this.cacheData[row];
	  if(r){
		  r[col.dataIndex] = value;
	  }
	  if(this.props.onChange)this.props.onChange(value,row,col.dataIndex);
  }
  getUpdatedData(){
	  return this.cacheData;
  }
  findNextEditorKey(key){
    var list = this.cellList;
    for(var i =0;i<list.length;i++){
      var k = list[i];
      if(k == key){
    	  if(list[i+1])return list[i+1];
    	  else return key;
	  }
	}
	return key;
  }
  render() {
	let { columns, data,...others } = this.props;
	
	for(var i=0;i < columns.length;i++){
		var column = columns[i];
		column.render = this.createRender(column,i);
	}
    return (
      <CommonTable data={data} ref='CommonTable' columns={columns} {...others} />
    );
  }
}

export default EditTable;

