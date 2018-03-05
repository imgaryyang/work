import React, { Component } from 'react';
import { Input } from 'antd';

class InputCell extends Component {
  state = {
    value: this.props.value,
    focus: this.props.focus || false,
    editable: this.props.editable || false,
  }

  componentDidMount() {
    this.focus();
  }

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
    /* if (nextProps.selected !== this.state.selected) {
      this.setState({ selected: nextProps.selected });
  } */
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextProps.editable !== this.state.editable ||
           nextState.value !== this.state.value ||
           nextState.focus;
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.focus != this.state.focus) {
      this.select();
    }
    this.focus();
  }

  handleEnter(e) {
    const onPressEnter = this.props.onPressEnter;
    if (typeof onPressEnter === 'function') {
      const r = onPressEnter(e, this);
    } else {
    }
  }

  handleChange(e) {
    let verfy = this.props.verfy;
    if (!verfy) {
      verfy = (this.props.editorConfig || {}).verfy;
    }
    let checked = true;
    const value = e.target.value;
    const onChange = this.props.onChange;
    if (typeof verfy === 'function') {
      checked = verfy(value);
    }
    if (!checked) return;
    this.setState({ value }, () => {
      if (typeof onChange === 'function')onChange(value);
    });
  }

  focus() {
    if (this.props.focus) {
      this.refs.input.focus();
    }
  }
  select() {
    this.refs.input.refs.input.select();
  }
  onBlur() {
    this.setState({ focus: false });
    if (this.props.onBlur) this.props.onBlur();
  }
  handleClick(e) {
    e.stopPropagation();
    const onClick = this.props.onClick;
    if (typeof onClick === 'function') {
      const r = onClick(e, this);
    } else {
    }
  }
  render() {
    const { value, editable } = this.state;
    const { addonAfter } = this.props;
    return (
      <div>
        {
          editable ?
            <div >
              <Input
                ref="input"
                value={value}
                size="small"
                onPressEnter={e => this.handleEnter(e)}
                onChange={e => this.handleChange(e)}
                onClick={e => this.handleClick(e)}
                addonAfter={addonAfter}
                onBlur={this.onBlur.bind(this)}
                style={{ paddingLeft: '1px', paddingRight: '1px' }}
              />
            </div> :
            <div>
              {value.toString() || ''}
            </div>
        }
      </div>
    );
  }
}
// InputCell.prototype.focus = function(){
//  var cell = this;
//
// }
export default InputCell;
