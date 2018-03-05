import React, { Component } from 'react';
import { Select } from 'antd';

const Option = Select.Option;

class CustomSelectCell extends Component {
  state = {
    value: this.props.value,
    focus: this.props.focus || false,
    editable: this.props.editable || false,
  }
/*  componentDidMount() {
    const input = this.refs.wrapper.childNodes[3].childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[0];
    const onPressEnter = this.props.onPressEnter;
    const onClick = this.props.onClick;

    input.onkeydown = function onkeydown(event) {
      if (event.keyCode === 13) {
        if (typeof onPressEnter === 'function') onPressEnter(event, this);
      }
    };
    this.focus();
  }*/

  componentWillReceiveProps(nextProps) {
    if (nextProps.editable !== this.state.editable) {
      this.setState({ editable: nextProps.editable });
      if (nextProps.editable) {
        this.cacheValue = this.state.value;
      }
    }
    if (nextProps.focus !== this.state.focus) {
      this.setState({ focus: nextProps.focus });
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextProps.editable !== this.state.editable ||
      nextState.value !== this.state.value ||
      nextState.focus;
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.focus !== this.state.focus) {
      this.select();
    }
    this.focus();
  }

  onBlur() {
    this.setState({ focus: false });
    if (this.props.onBlur) this.props.onBlur();
  }

  select() {
    const input = this.refs.wrapper.childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[0];
    input.select();
  }

  focus() {
    if (this.props.focus) {
      const input = this.refs.wrapper.childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[0];
      input.focus();
    }
  }

  handleChange(value) {
    let verfy = this.props.verfy;
    if (!verfy) {
      verfy = (this.props.editorConfig || {}).verfy;
    }
    let checked = true;
    const onChange = this.props.onChange;
    if (typeof verfy === 'function') {
      checked = verfy(value);
    }
    if (!checked) return;
    this.setState({ value }, () => {
      if (typeof onChange === 'function') onChange(value);
    });
  }

  handleEnter(e) {
    const onPressEnter = this.props.onPressEnter;
    if (typeof onPressEnter === 'function') {
      onPressEnter(e, this);
    }
  }

  handleClick(e) {
    const onClick = this.props.onClick;
    if (typeof onClick === 'function') {
      onClick(e, this);
    }
  }
  render() {
    const { value, editable } = this.state;
    const { addonAfter } = this.props;
    let { editorConfig, optionKey } = this.props;
    editorConfig = editorConfig || {};
    return (
      <div ref="wrapper"> {
        editable ?
          <div>
            <Select
              ref="input"
              size="small"
              allowClear
              onPressEnter={e => this.handleEnter(e)}
              onChange={this.handleChange.bind(this)}
              onClick={e => this.handleClick(e)}
              addonAfter={addonAfter}
              onBlur={this.onBlur.bind(this)}
              style={{ paddingLeft: '1px', paddingRight: '1px' }}
              {...editorConfig}
            >{editorConfig.option[optionKey]}</Select> </div> : <div> { value.toString() || '' } <
        /div>
      } <
      /div>
    );
  }
}
export default CustomSelectCell;
