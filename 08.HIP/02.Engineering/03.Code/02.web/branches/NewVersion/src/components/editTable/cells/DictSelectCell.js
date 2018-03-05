import React, { Component } from 'react';
// import { InputNumber } from 'antd';
import DictSelect from '../../DictSelect';

class DictSelectCell extends Component {
  state = {
    value: this.props.value,
    focus: this.props.focus || false,
    editable: this.props.editable || false,
  }
  componentDidMount() {
	  const input = this.refs.wrapper.childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[1].childNodes[0].childNodes[0];
	  const onPressEnter = this.props.onPressEnter;
	  const onClick = this.props.onClick;

	  input.onkeydown = function (event) {
		  if (event.keyCode == 13) {
			  if (typeof onPressEnter === 'function')onPressEnter(event, this);
		  }
	  };


    //	  input.onclick = function(event){
    //		  if (typeof onClick === 'function')onClick(event,this);
    //	  }
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
      if (typeof onChange === 'function')onChange(value);
    });
  }

  focus() {
    if (this.props.focus) {
      const input = this.refs.wrapper.childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[1].childNodes[0].childNodes[0];
      input.focus();
    }
  }
  select() {
	 const input = this.refs.wrapper.childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[1].childNodes[0].childNodes[0];
	  input.select();
  }
  onBlur() {
	 this.setState({ focus: false });
	 if (this.props.onBlur) this.props.onBlur();
  }
  handleClick(e) {
    const onClick = this.props.onClick;
    if (typeof onClick === 'function') {
    	const r = onClick(e, this);
    } else {
    }
  }
  render() {
    const { value, editable } = this.state;
    let { addonAfter, editorConfig } = this.props;
    editorConfig = editorConfig || {};
    return (
      <div ref="wrapper">
        {
          editable ?
            <div >
              <DictSelect
                ref="input"
                value={value}
                size="small"
                onPressEnter={e => this.handleEnter(e)}
                onChange={this.handleChange.bind(this)}
                onClick={e => this.handleClick(e)}
                addonAfter={addonAfter}
                onBlur={this.onBlur.bind(this)}
                style={{ paddingLeft: '1px', paddingRight: '1px' }}
                {...editorConfig}
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
export default DictSelectCell;
