import React, { Component } from 'react';

import StepCat from './StepCat';
import StepGeneric from './StepGeneric';

export default class StepQueue extends Component {
  render() {
    const { item, idx } = this.props;
    return (
      <StepCat key={`step_cat_${idx}`} item={item} idx={idx} >
        <StepGeneric item={item} idx={idx} />
      </StepCat>
    );
  }
}
