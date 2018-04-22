import { Table, Input, Popconfirm } from 'antd';
class InputCell extends React.Component {
  state = {
    value: this.props.value,
    focus: this.props.focus||false,
    editable: this.props.editable || false,
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.editable !== this.state.editable) {
      this.setState({ editable: nextProps.editable });
      if (nextProps.editable) {
        this.cacheValue = this.state.value;
      }
    }
    if(nextProps.focus !== this.state.focus){
    	 this.setState({ focus: nextProps.focus });
    }
  }
  componentDidMount(){
	this.focus();
  }
  componentDidUpdate(){
	this.focus();
  }
  shouldComponentUpdate(nextProps, nextState) {
	  console.info();
    return nextProps.editable !== this.state.editable ||
           nextState.value !== this.state.value||
           nextState.focus;
  }
  handleEnter(e){
	const onPressEnter = this.props.onPressEnter;
	if(typeof onPressEnter == 'function')onPressEnter(e);
  }
  handleChange(e) {
    const value = e.target.value;
    const onChange = this.props.onChange;
    this.setState({ value },()=>{
    	if(typeof onChange == 'function')onChange(value);
    });
  }
  focus(){
	if(this.props.focus){
		this.refs['input'].focus();
		this.refs['input'].refs['input'].select();
    }
  }
  render() {
    const { value, editable } = this.state;
    return (
      <div>
        {
          editable ?
            <div>
              <Input ref='input'  value={value} size='small' /*isFocus={focus}*/ onPressEnter={e => this.handleEnter(e)} onChange={e => this.handleChange(e)}/>
            </div>
            :<div>{value.toString() || ''} </div>
        }
      </div>
    );
  }
}
//InputCell.prototype.focus = function(){
//	var cell = this;
//	console.info(this.refs['input'].focus);
//}
export default InputCell;
