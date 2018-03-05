import React, { Component } from 'react';
import { InputNumber } from 'antd';
class SelectCell extends Component {
  state = {
    value: this.props.value,
    focus: this.props.focus || false,
    editable: this.props.editable || false,
  }
  
  componentDidMount() {
	  var input =  this.refs.wrapper.childNodes[0].childNodes[0].childNodes[1].childNodes[0];
	  const onPressEnter = this.props.onPressEnter;
	  const onClick = this.props.onClick;
	    
	  input.onkeydown = function(event){
		  if(event.keyCode == 13){
			  if (typeof onPressEnter === 'function')onPressEnter(event,this);
		  }
	  }
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
    /*if (nextProps.selected !== this.state.selected) {
	    this.setState({ selected: nextProps.selected });
	}*/
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextProps.editable !== this.state.editable ||
           nextState.value !== this.state.value ||
           nextState.focus ;
  }

  componentDidUpdate(prevProps, prevState) {
	if(prevState.focus != this.state.focus){
		this.select();	
	}
	this.focus();
  }

  handleEnter(e) {
    const onPressEnter = this.props.onPressEnter;
    if (typeof onPressEnter === 'function'){
    	var r = onPressEnter(e,this);
    }else{
    }
  }
  
  handleChange(value) {console.info('handleChange ',arguments);
    var verfy = this.props.verfy;
    var checked = true;
    const onChange = this.props.onChange;
    if (typeof verfy === 'function'){
	  checked = verfy(value);
    } 
    console.info('checked ',checked);
    if(!checked)return;
    this.setState({ value }, () => {
      if (typeof onChange === 'function')onChange(value);
    });
  }

  focus() {
	 // var input =  this.refs.wrapper.childNodes[0].childNodes[0].childNodes[0].childNodes[0];
	 // console.info(input);
     // input.focus();
    if (this.props.focus) {
      var input =  this.refs.wrapper.childNodes[0].childNodes[0].childNodes[1].childNodes[0];
      input.focus();
    }
  }
  select(){ 
	  var input =  this.refs.wrapper.childNodes[0].childNodes[0].childNodes[1].childNodes[0];
	  input.select();
  }
  onBlur(){
	 this.setState({focus:false});
	 if(this.props.onBlur)this.props.onBlur();
  }
  handleClick(e){
	const onClick = this.props.onClick;
    if (typeof onClick === 'function'){
    	var r = onClick(e,this);
    }else{
    }
  }
  render() {
    const { value, editable } = this.state;
    const { addonAfter } = this.props;
    return (
      <div ref='wrapper'>
        {
          editable ?
            <div >
              <InputNumber
                ref="input"
                value={value}
                size="small"
                onPressEnter={e => this.handleEnter(e)}
                onChange={this.handleChange.bind(this)}
              	onClick ={e => this.handleClick(e)}
                addonAfter={addonAfter}
              	onBlur = {this.onBlur.bind(this)}
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
//  console.info(this.refs['input'].focus);
// }
export default SelectCell;
