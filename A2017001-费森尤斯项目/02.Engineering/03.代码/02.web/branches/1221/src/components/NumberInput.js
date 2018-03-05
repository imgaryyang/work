import React, { PropTypes, Component } from 'react';
import { Input } from 'antd';
import _ from 'lodash';

/**
 * @Author xlbd
 * @Desc NumberInput 数字／金额
 */

class NumberInput extends Component {

  static propTypes = {

    /**
     * numberType 数字类型，支持 integer/currency/currency4
     */
    numberType: PropTypes.string,

  };

  componentDidMount() {
    this.numberInput.focus();
  }

  onChange = (e) => {
    const { numberType } = this.props;
    const value = e.target.value;
    if (isNaN(value)) {
      return;
    }
    let reg = '';
    switch (numberType) {
      case 'integer':
        reg = /^-?([1-9][0-9]*)?$/;
        break;
      case 'currency':
        reg = /^-?\d+\.{0,1}\d{0,2}$/;  // 匹配两位小数
        break;
      case 'currency4':
        reg = /^-?\d+\.{0,1}\d{0,4}$/;  // 匹配四位小数
        break;
      default:
    }
    if (reg.test(value) || value === '') {
      this.props.onChange(value);
    }
  }

  render() {
    const others = _.omit(this.props, 'numberType');
    return (
      <Input
        {...others}
        onChange={this.onChange}
        ref={(node) => { this.numberInput = node; }}
      />
    );
  }
}

export default NumberInput;
