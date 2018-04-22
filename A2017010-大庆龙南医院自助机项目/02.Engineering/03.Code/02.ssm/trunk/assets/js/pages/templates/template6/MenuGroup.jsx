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
      <div className='m_t6_mg_container' >
	      <Row >
	      	<Col><div className='m_t6_mg_card'>{name}</div></Col>
	      </Row>
	      <Row className='m_t6_mg_label'>
	      	<Col> {name}</Col>
	      </Row>
	      {
	      	  menus.map((m, index)=>{
	      		var style = ( index==0 )?{
	      			backgroundColor: 'rgba(70,154,216,1)'
	      		}:{
	      			backgroundColor: 'rgba(7,68,129,1)'
	      		};
	      	    return (
	      		  <Row key = {index} onClick={()=>{this.selectMenu(m)}}>
	      		    <Col><CellBlock menu={m} style={style}/></Col>
	      	      </Row>
	      		)  
	      	  }) 
	      }
      </div>
    )
  }
}
	
module.exports = Group ;