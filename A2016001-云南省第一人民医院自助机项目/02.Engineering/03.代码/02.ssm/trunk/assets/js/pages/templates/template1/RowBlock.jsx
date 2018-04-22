import React, { PropTypes } from 'react';
import baseUtil from '../../../utils/baseUtil.jsx';
import logUtil,{ log } from '../../../utils/logUtil.jsx';
import { Icon,Row, Col  } from 'antd';
import icons from '../Icons.jsx';
import styles2 from './RowBlock2.css';
import styles3 from './RowBlock3.css';

class Block extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    const { menu ,col } = this.props;
    const style_reg =  ( col==3 )?'m_t1_rb3_':'m_t1_rb2_';
    
    var blockStyle = {
		backgroundImage: 'url(' + icons[menu.icon]['src'] + ')',
		//backgroundColor: menu.color,
	};
    return (
      <div className={style_reg+'container'} >
        <div className={style_reg+'wrapper'} >
          <div className={style_reg+'icon'} style={blockStyle}></div>
          <div className={style_reg+'label'} >{menu.alias}</div>
        </div>
      </div>
    )
  }
}
	
module.exports = Block ;