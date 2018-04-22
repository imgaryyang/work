import React, { PropTypes } from 'react';
import baseUtil from '../../../utils/baseUtil.jsx';
import logUtil,{ log } from '../../../utils/logUtil.jsx';
import { Icon,Row, Col  } from 'antd';
import icons from '../Icons.jsx';
import styles from './MenuGroup.css';
import CellBlock from './CellBlock.jsx';
class Group extends React.Component {
  constructor(props) {
    super(props);
    this.selectMenu = this.selectMenu.bind(this);
  }
  selectMenu(m){
	  if(this.props.onSelect)this.props.onSelect(m);
  }
  render() {
    const { menu } = this.props;
    const name = menu.alias || menu.name;
    const menus = menu.children||[];
    if(menus.length <= 0 ) menus.push(menu);
    
    return (
      <div className='m_t4_mg_container' >
	      <ul className='m_t4_mg_title'>
		  	<li className='m_t4_mg_line'></li>
		  	<li className='m_t4_mg_textwrapper'><span className='m_t4_mg_text'>{name}</span></li>
		  </ul>
		  <Row>
		  {
			  menus.map((m, index)=>{
	    	    return (
				  <div className='m_t4_col' key = {index} onClick={()=>{this.selectMenu(m)}}>
				    <CellBlock menu={m} />
			      </div>
				)  
	    	  }) 
		  }
		  </Row>
      </div>
    )
  }
}
	
module.exports = Group ;