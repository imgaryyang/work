import React, { Component } from 'react';

import InputCell from './cells/InputCell';
import DateCell from './cells/DateCell';
import NumberCell from './cells/NumberCell';
import DictSelectCell from './cells/DictSelectCell';
import CustomSelectCell from './cells/CustomSelectCell';
import CommonTable from '../CommonTable';

class EditTable extends Component {
  constructor(props) {
    super(props);
    this.handleEnter = this.handleEnter.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleCellChange = this.handleCellChange.bind(this);
    this.getUpdatedData = this.getUpdatedData.bind(this);
  }

  state = {
    focus: null,
  }

  componentWillMount() {
    this.cacheData = this.props.data;
  }

  componentWillReceiveProps(next) {
    const nextData = next.data || [];
    const data = this.props.data || [];
    if (nextData !== data || nextData.length !== data.length) {
      this.cacheData = nextData;
    }
  }

  componentWillUnmount() {
    this.cellList = [];
  }

  getUpdatedData() {
    return this.cacheData;
  }

  createRender(column, cIndex) {
    const handleEnter = this.handleEnter;
    const handleClick = this.handleClick;
    const handleCellChange = this.handleCellChange;
    const cellList = this.cellList;
    const { focus } = this.state;
    const oldRender = column.render;
    const editorType = column.editor;
    const editorConfig = column.editorConfig;
    const r = function (value, record, rIndex) {
      value = oldRender ? oldRender(value, record, rIndex) : value;
      const key = `${rIndex}_${cIndex}`;
      const optionKey = record.itemCode;
      const editable = (typeof column.editable === 'function') ? column.editable(value, record) : column.editable;
      if (!editable) return value;

      const addonAfter = (column.addonAfter && typeof column.addonAfter === 'function') ? column.addonAfter(value, record, rIndex) : null;

      let editor = null;
      if (editorType === 'date') {
        editor = (
          <DateCell
            ref={key}
          	onClick = {(e,cmp) => handleClick(e, cmp,key, rIndex, cIndex)}
            onChange={v => handleCellChange(v, rIndex, column)}
            focus={focus === key}
            value={value}
            onPressEnter={( e,cmp ) => handleEnter(e,cmp, key, rIndex, cIndex)}
            editable
            editorConfig = {editorConfig}
          />
        );
      } else if (editorType === 'number'){
    	editor = (
          <NumberCell
            ref={key}
          	onClick = {(e,cmp) => handleClick(e, cmp,key, rIndex, cIndex)}
            onChange={v => handleCellChange(v, rIndex, column)}
            focus={focus === key}
            value={value}
            onPressEnter={( e,cmp ) => handleEnter(e,cmp, key, rIndex, cIndex)}
            editable
            editorConfig = {editorConfig}
          />
        );
      } else if (editorType === 'dictSelect'){
    	  editor = (
            <DictSelectCell
              ref={key}
            	onClick = {(e,cmp) => handleClick(e, cmp,key, rIndex, cIndex)}
              onChange={v => handleCellChange(v, rIndex, column)}
              focus={focus === key}
              value={value}
              onPressEnter={( e,cmp ) => handleEnter(e,cmp, key, rIndex, cIndex)}
              editable
              editorConfig = {editorConfig}
            />
          );
      } else if (editorType === 'CustomSelect') {
        editor = (
          <CustomSelectCell
            ref={key}
            onClick={(e, cmp) => handleClick(e, cmp, key, rIndex, cIndex)}
            onChange={v => handleCellChange(v, rIndex, column)}
            focus={focus === key}
            optionKey={optionKey}
            value={value}
            onPressEnter={(e, cmp) => handleEnter(e, cmp, key, rIndex, cIndex)}
            editable
            editorConfig={editorConfig}
          />
          );
      } else {
        editor = (
          <InputCell
            ref={key}
          	onClick = {(e,cmp) => handleClick(e, cmp,key, rIndex, cIndex)}
            onChange={v => handleCellChange(v, rIndex, column)}
            focus={focus === key}
            value={value}
            onPressEnter={(e,cmp) => handleEnter(e, cmp,key, rIndex, cIndex)}
            editable
            addonAfter={addonAfter}
          	editorConfig = {editorConfig}
          />
        );
      }
      cellList.push(key);
      // [key] = editor;
      return editor;
    };
    return r;
  }

  handleEnter(e,cmp, key) {
    const nextKey = this.findNextEditorKey(key);
    this.setState({ focus: nextKey });
  }
  handleClick(e,cmp, key) {
	  console.info('handleClick ',key);
    this.setState({ focus: key });
  }
  handleCellChange(value, row, col) {
    const r = this.cacheData[row];
    if (r) {
      r[col.dataIndex] = value;
    }
    if (this.props.onChange) this.props.onChange(value, row, col.dataIndex);
  }

  cacheData = [];
  cellList =[];

  findNextEditorKey(key) {
    const list = this.cellList;
    for (let i = 0; i < list.length; i++) {
      const k = list[i];
      if (k === key) {
        if (list[i + 1]) return list[i + 1];
        else return key;
      }
    }
    return key;
  }

  render() {
    const { columns, data, ...others } = this.props;

    for (let i = 0; i < columns.length; i++) {
      const column = columns[i];
      column.render = this.createRender(column, i);
    }
    return (
      <CommonTable
        data={data}
        ref="CommonTable"
        columns={columns}
        {...others}
      />
    );
  }
}

export default EditTable;

