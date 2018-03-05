import React, { Component, PropTypes } from 'react';
import { connect } from 'dva';
import { Input } from 'antd';

class EditableCell extends Component {
  state = {
    value: this.props.value,
  }
//  componentWillReceiveProps(nextProps) {
//    if (nextProps.editable !== this.state.editable) {
//      this.setState({ editable: nextProps.editable });
//      if (nextProps.editable) {
//        this.cacheValue = this.state.value;
//      }
//    }
//    if (nextProps.status && nextProps.status !== this.props.status) {
//      if (nextProps.status === 'edit') {
//        this.props.onChange(this.state.value);
//      } else if (nextProps.status === 'cancel') {
//        this.setState({ value: this.cacheValue });
//        this.props.onChange(this.cacheValue);
//      }
//    }
//  }
  shouldComponentUpdate(nextProps, nextState) {
	  console.info("shouldComponentUpdate", nextState.value, this.state.value)
    return nextState.value !== this.state.value;
  }
  handleChange(e) {console.info('handle change ',e );
    const value = e.target.value;
    this.setState({ value },()=>{
    	if(this.props.onChange)this.props.onChange(value,e);
    });
  }
  render() {
	  
    const { value } = this.state;
    console.info("EditableCell", value);
    return (
      <div>
      	<Input value={value} onChange={e => this.handleChange(e)}/>
      </div>
    );
  }
}

export default connect()(EditableCell);