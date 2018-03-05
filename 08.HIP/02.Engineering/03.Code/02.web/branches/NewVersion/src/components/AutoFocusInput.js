import React, { Component } from 'react';
import { Input } from 'antd';

/**
 * @Author xlbd
 * @Desc NumberInput 只允许输入数字
 * Code Example
 */

class AutoFocusInput extends Component {
  componentDidMount() {
    console.log(this.focusInput);
    this.focusInput.focus();
    this.focusInput.refs.input.focus();
  }

  onPressEnter() {
    const { tabIndex } = this.focusInput.props;
    console.log(tabIndex);
    const inputValue = this.focusInput.refs.input.value;
    console.log(inputValue);
  }

  render() {
    return (
      <div>
        <Input
          defaultValue="Won't focus"
        />
          <Input
            ref={(node) => { this.focusInput = node; }}
            onPressEnter={this.onPressEnter.bind(this)}
            {...this.props}
          />
      </div>
    );
  }
}

export default AutoFocusInput;
