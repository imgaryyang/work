import React, { PropTypes } from 'react';
import baseUtil from '../../../utils/baseUtil.jsx';
import logUtil,{ log } from '../../../utils/logUtil.jsx';
import { Icon,Row, Col  } from 'antd';
import MenuBlock from './MenuBlock.jsx';

class Template extends React.Component {
  constructor(props) {
    super(props);
    this.selectMenu = this.selectMenu.bind(this);
  }
  selectMenu(menu){
	  if(this.props.onSelect )this.props.onSelect(menu);
  }
  render() {
    const { menu } = this.props;
    const menus = menu.children||[];
    const colSpan = 6;
    
    return (
      <div>
      {
    	  menus.map((m, index)=>{
    	    return (
			  <Col span = {colSpan} key = {index} onClick={()=>{this.selectMenu(m)}}>
			    <MenuBlock menu={m} />
		      </Col>
			)  
    	  })
      }
      </div>
    )
  }
}
  
module.exports = {
  code:'def',
  cmp:Template
};