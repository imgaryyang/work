import React, { PropTypes } from 'react';
import MenuBlock from './Card.less';

class Card extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let { fullWidth, style, shadow, radius, dispatch, ...other } = this.props;
    radius = radius || '.5rem';
    shadow = shadow || false;
    style = style || {};

    if (shadow == true) style['boxShadow'] = '0 0 .5rem rgba(0, 0, 0, .3)';

    if (radius) style['borderRadius'] = radius;

    const title = this.props.title ? (
      <div className="card_title" >{this.props.title}</div>
    ) : null;

    return (
      <div className="card_container" style={style} {...other} >
        {title}
        {this.props.children}
      </div>
    );
  }
}
module.exports = Card;
