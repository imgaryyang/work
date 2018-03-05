import { DatePicker } from 'antd';
import moment from 'moment';

class DateCell extends React.Component {
  state = {
    value: this.props.value,
    focus: this.props.focus || false,
    editable: this.props.editable || false,
    open: false,
  }
  cacheFocus=false;
  componentWillReceiveProps(nextProps) {
    if (nextProps.editable !== this.state.editable) {
      this.setState({ editable: nextProps.editable });
      if (nextProps.editable) {
        this.cacheValue = this.state.value;
      }
    }
    if (nextProps.focus !== this.state.focus) {
      this.cacheFocus = this.state.focus;
      this.setState({ focus: nextProps.focus });
    }
  }

  componentDidMount() {
	  const input = this.refs.wrapper.childNodes[0].childNodes[0].childNodes[0].childNodes[0];
	 // console.info('componentDidMount ',input);
	  const onPressEnter = this.props.onPressEnter;
	  const onClick = this.props.onClick;

	  input.onkeydown = function (event) {
		  if (event.keyCode == 13) {
			  if (typeof onPressEnter === 'function')onPressEnter(event, this);
		  }
	  };
	  input.onclick = function (event) {
		  if (typeof onClick === 'function')onClick(event, this);
	  };
    this.focus();
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
    if (typeof onPressEnter === 'function')onPressEnter(e);
  }
  handleChange(date, dateString) {
    const onChange = this.props.onChange;
    // this.setState({open:false });
    this.setState({ value: date }, () => {
      if (typeof onChange === 'function')onChange(moment(date).format('YYYY-MM-DD'));
    });
  }
  focus() {
    if (this.props.focus) {
      const input = this.refs.wrapper.childNodes[0].childNodes[0].childNodes[0].childNodes[0];
      input.focus();
    }
  }
  select() {
  	const input = this.refs.wrapper.childNodes[0].childNodes[0].childNodes[0].childNodes[0];
  	input.select();
  }
  onOpenChange(status) { // console.info('onOpenChange ',status);
    // this.setState({ open: status });
  }
  render() {
    const { value, editable } = this.state;
    const date = value ? moment(value) : null;
    // open={this.state.open}  onOpenChange={this.onOpenChange.bind(this)}
    return (
      <div ref="wrapper">
        {
          editable ?
            <div>
              <DatePicker
                ref="input"
                value={date}/* isFocus={focus} */
                onPressEnter={e => this.handleEnter(e)}
                onChange={e => this.handleChange(e)}
                style={{ paddingLeft: '1px', paddingRight: '1px' }}
              />
            </div>
            : <div>{date ? date.format('YYYY-MM-DD') : value} </div>
        }
      </div>
    );
  }
}
// InputCell.prototype.focus = function(){
//  var cell = this;
//  console.info(this.refs['input'].focus);
// }
export default DateCell;
