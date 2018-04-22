import React, { PropTypes } from 'react';
import baseUtil from '../../../utils/baseUtil.jsx';
import logUtil,{ log } from '../../../utils/logUtil.jsx';
import { Icon,Row, Col  } from 'antd';
import icons from '../Icons.jsx';
import styles from './CellBlock.css';

class Block extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    const { menu } = this.props;
    const style = this.props.style||{};
    const name = menu.alias || menu.name;
    
    return (
      <div className='m_t6_cb_container' style={style} >
      	{menu.alias}
      </div>
    )
  }
}
	
module.exports = Block ;