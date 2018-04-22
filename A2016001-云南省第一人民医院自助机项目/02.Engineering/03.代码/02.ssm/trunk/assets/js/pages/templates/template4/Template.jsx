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
    
    return (
      <div className='m_t4_container' >
      {
    	  menus.map((m, index)=>{
    	    return (
			  <Row key = {index}>
			    <MenuGroup menu={m} onSelect={this.selectMenu}/>
		      </Row>
			)  
    	  })
      }
      </div>
    )
  }
}
  
module.exports = {
  code:'group',
  cmp:Template
};