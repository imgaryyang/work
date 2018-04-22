import React, { PropTypes } from 'react';
import baseUtil from '../../../utils/baseUtil.jsx';
import logUtil,{ log } from '../../../utils/logUtil.jsx';
import { Icon,Row, Col  } from 'antd';
import style from './Template.css';
import CellBlock from './CellBlock.jsx';
class Template extends React.Component {
  constructor(props) {
    super(props);
    this.selectMenu = this.selectMenu.bind(this);
  }
  selectMenu(menu){
	  if(this.props.onSelect )this.props.onSelect(menu);
  }
  render() {
	const scope = this;
    const { menu } = this.props;
    const menus = menu.children||[];
    
    return (
      <div className='m_t5_container'>
      {
    	  menus.map(function(m, index){
    	    return (
			  <Col span = {12} key = {index} onclick={()=>{ scope.selectMenu(m)}}>
			    <CellBlock menu={m}/>
		      </Col>
			)  
    	  })
      }
      </div>
    )
  }
}
  
module.exports = {
  code:'bigCell',
  cmp:Template
};