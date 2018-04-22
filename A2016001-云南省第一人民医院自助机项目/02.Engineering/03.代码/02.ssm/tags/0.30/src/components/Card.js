import React, { PropTypes }   from 'react';
import { connect }            from 'dva';
import { Row, Col }           from 'antd';

import styles                 from './Card.css';

class Card extends React.Component {

  static displayName = 'Card';
  static description = '卡片容器';

  static propTypes = {

    /**
    * 标题
    */
    title: PropTypes.string,

    /**
    * 阴影
    */
    shadow: PropTypes.bool,

    /**
     * 倒角
     * false / size ('x rem' or 'x px')
     */
    radius: PropTypes.oneOfType([
      PropTypes.bool,
      PropTypes.string,
    ]),

  };

  static defaultProps = {
    title: '',
    shadow: false,
    radius: '.5rem',
  };

  constructor(props) {
    super(props);
  }
 
  render() {
    let { fullWidth, style, shadow, radius, dispatch, ...other } = this.props;

    if (!style)
      style = {};

    if (shadow == true) style['boxShadow'] = '0 0 .5rem rgba(0, 0, 0, .3)';

    if (radius) style['borderRadius'] = radius;

    let title = this.props.title ? (
      <div className = {styles.title} >{this.props.title}</div>
    ) : null;

    return (
      <div className = {styles.container} style = {style} {...other} >
        {title}
        {this.props.children}
      </div>
    );
  }

}

export default connect()(Card);


