import React, { PropTypes } from 'react';
import baseUtil from '../../../utils/baseUtil.jsx';
import logUtil,{ log } from '../../../utils/logUtil.jsx';
import { Icon,Row, Col  } from 'antd';
import ColBlock from './ColBlock.jsx';
import RowBlock from './RowBlock.jsx';

class Template extends React.Component {
  constructor(props) {
    super(props);
    this.selectMenu = this.selectMenu.bind(this);
    this.getTopMeus = this.getTopMenus.bind(this);
    this.getBottomMeus = this.getBottomMenus.bind(this);
  }
  selectMenu(menu){
	  if(this.props.onSelect )this.props.onSelect(menu);
  }
  getTopMenus(menus){
    const array=[];
    for(var i=0;i<menus.length;i++){
    	if(i == 4) break;
    	array.push(menus[i]);
    }
    return array;
  }
  getBottomMenus(menus){
    const array=[];
    for(var i=4;i<menus.length;i++){
    	array.push(menus[i]);
    }
    return array;
  }
  render() {
    const { menu } = this.props;
    const menus = menu.children||[];
    
    const colSpan = 6;
    const rowSpan = menus.length%2==0 ? 12 : 8;
    const RowCol = menus.length%2==0 ? 2 : 3;
    const topMenus = this.getTopMenus(menus);
    const bottomMenus = this.getBottomMenus(menus);
    
    return (
      <div>
      {
    	  topMenus.map((m, index)=>{
    	    return (
			  <Col span = {colSpan} key = {index} onClick={()=>{this.selectMenu(m)}}>
			    <ColBlock menu={m} />
		      </Col>
			)  
    	  })
      }
      {
    	  bottomMenus.map((m, index)=>{
    	    return (
			  <Col span = {rowSpan} key = {index} onClick={()=>{this.selectMenu(m)}}>
			    <RowBlock menu={m} col={RowCol}/>
		      </Col>
			)  
    	  })
      }
      </div>
    )
  }
}
  
module.exports = {
  code:'common',
  cmp:Template
};