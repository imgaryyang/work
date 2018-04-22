import React, { PropTypes } from 'react';
import baseUtil from '../../../utils/baseUtil.jsx';
import logUtil,{ log } from '../../../utils/logUtil.jsx';
import { Icon,Row, Col  } from 'antd';
import style from './Template.css';
import MenuGroup from './MenuGroup.jsx';


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
    const col = menus.length<=3 ? menus.length : 3;
    const width = 410*col+'px';
    const colspan = 24/col;
    return (
      <div className='m_t6_container' style={{width:width}}>
      {
    	  menus.map((m, index)=>{
    	    return (
			  <Col key = {index} span={colspan}>
			    <MenuGroup menu={m} onSelect={this.selectMenu}/>
		      </Col>
			)  
    	  })
      }
      </div>
    )
  }
}
  
module.exports = {
  code:'card',
  cmp:Template
};