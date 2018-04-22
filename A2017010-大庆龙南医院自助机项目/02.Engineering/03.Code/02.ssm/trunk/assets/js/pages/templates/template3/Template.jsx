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
    
    const col = menus.lenth<=4 ? menus.lenth : 4;
    const width = 320*col+'px';
    const colspan = 24/col;
    return (
      <div className='m_t3_container' style={{width:width}}>
      {
    	  menus.map(function(m, index){
    	    return (
			  <Col span = {colspan} key = {index} onClick={()=>{ scope.selectMenu(m)}}>
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
  code:'spread',
  cmp:Template
};