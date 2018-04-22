import {  DatePicker } from 'antd';
import moment from 'moment';
class DateCell extends React.Component {
  state = {
    value: this.props.value,
    focus: this.props.focus||false,
    editable: this.props.editable || false,
//    open:false,
  }
  cacheFocus=false;
  componentWillReceiveProps(nextProps) {
    if (nextProps.editable !== this.state.editable) {
      this.setState({ editable: nextProps.editable });
      if (nextProps.editable) {
        this.cacheValue = this.state.value;
      }
    }
    if(nextProps.focus !== this.state.focus){
    	this.cacheFocus = this.state.focus;
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
    return nextProps.editable !== this.state.editable ||
           nextState.value !== this.state.value||
           nextState.focus !== this.state.focus;
  }
  handleEnter(e){
	const onPressEnter = this.props.onPressEnter;
	if(typeof onPressEnter == 'function')onPressEnter(e);
  }
  handleChange(date,dateString) {
    const onChange = this.props.onChange;
    this.setState({focus:false});
    this.setState({ value:date },()=>{
    	if(typeof onChange == 'function')onChange(moment(date).format('YYYY-MM-DD'));
    });
  }
  focus(){ 
	if(this.state.focus){
//		this.setState({open:true});
//		console.info(this.refs['input']);
//		this.refs['input'].focus();
//		this.refs['input'].refs['input'].select();
    }
  }
  onOpenChange(status){
	  this.setState({focus:status})
  }
  render() {
    const { value, editable } = this.state;
    var date =value? moment(value): null;
    return (
      <div>
        {
          editable ?
            <div> 
              <DatePicker open={this.state.focus} onOpenChange={this.onOpenChange.bind(this)} ref='input'  value={date} /*isFocus={focus}*/ onPressEnter={e => this.handleEnter(e)} onChange={e => this.handleChange(e)}/>
            </div>
            :<div>{date?date.format('YYYY-MM-DD'):value} </div>
        }
      </div>
    );
  }
}
//InputCell.prototype.focus = function(){
//	var cell = this;
//	console.info(this.refs['input'].focus);
//}
export default DateCell;
