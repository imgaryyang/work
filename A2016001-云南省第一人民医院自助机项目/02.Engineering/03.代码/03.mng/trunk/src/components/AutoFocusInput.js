import React, { Component } from 'react';
import { Input } from 'antd';

/**
 * @Author xlbd
 * @Desc NumberInput 只允许输入数字
 * Code Example
 */

// class NumberInputDemo extends Component {
//   constructor(props) {
//     super(props);
//     this.state = { value: '' };
//   }
//   onChange = (value) => {
//     this.setState({ value });
//   }
//   render() {
//     return (
//       <NumberInput style={{ width: 120 }} value={this.state.value} onChange={this.onChange} />
//     );
//   }
// }

class AutoFocusInput extends Component {

  componentDidMount() {
    console.log(this.textInput);
    this.textInput.focus();
  }

  onPressEnter() {
    const { tabIndex } = this.textInput.props;
    console.log(tabIndex);
  }

  render() {
    return (
      <div>
        <Input
          defaultValue="Won't focus"
        />
        <Input
          ref={(node) => { this.textInput = node; }}
          onPressEnter={this.onPressEnter.bind(this)}
          {...this.props}
        />
      </div>
    );
  }
}

export default AutoFocusInput;
