import React, { PropTypes } from 'react';
import { 
  Row, Col, 
  Icon, Modal,
}                           from 'antd';

import styles               from './SearchDoctor.css';

import Card                 from '../../components/Card.jsx';
import Button               from '../../components/Button.jsx';
import Input                from '../../components/Input.jsx';
import CharacterKeyboard    from '../../components/keyboard/CharacterKeyboard.jsx';
import TimerPage from '../../TimerPage.jsx';
class SearchDoctor extends TimerPage {


  constructor (props) {
    super(props);
    this.choose         = this.bind(this.choose,this);
    this.selectAllDocs  = this.bind(this.selectAllDocs,this);
    this.onInput        = this.bind(this.onInput,this);
    this.onClear        = this.bind(this.onClear,this);
    this.onDel          = this.bind(this.onDel,this);
    this.state = {  pinyin:'' };
  }
  

  
  componentWillMount () {
  }
  choose (doctor) {
	  if(!doctor.code)return;
	  if(this.props.onChoose)this.props.onChoose(doctor);
  }

  selectAllDocs () {
	  if(this.props.onChoose)this.props.onChoose({});
  }

  /**
   * 监听键盘输入
   */
  onInput(key) {
    if (this.state.pinyin.length == 5) return;
    this.setState({
        pinyin: this.state.pinyin + key,
    });
  }
  
  /**
   * 监听键盘删除键
   */
  onDel() {
    this.setState({
      pinyin: this.state.pinyin.substr(0, this.state.pinyin .length - 1),
    });
  }

  /**
   * 监听键盘清空键
   */
  onClear() {
	this.setState({
		pinyin:""
	});
  }
  doSearch(){
	  
  }
  render () {
    const { doctors } = this.props;
    const { pinyin } = this.state;
    const filteredDoctors = [];
    for(var doctor of doctors){
    	if(doctor.pinyin.indexOf(pinyin)>=0){
    		if(filteredDoctors.length>=5){
    			  filteredDoctors.push({code:'',name:'剩余医生请按字母查询'});
    			  break;
    		}
    		filteredDoctors.push(doctor);
    	}
    }
  
			
    let wsHeight = document.body.clientHeight * 2 / 3,
    keyboardHeight = document.body.clientHeight * 1 / 3;

    return (
      <div >
        <div className = 'sdoc_wsContainer'  >
          <Row style = {{height:'8rem', padding: '1.5rem'}}>
            <Col span = {18} >
              <Input value={pinyin} placeholder = {(<font><Icon type = 'search' />&nbsp;&nbsp;请输入姓名拼音首字母</font>)} focus = {true} style = {{textAlign: 'center'}} />
            </Col>
            <Col span = {6} style = {{paddingLeft: '2rem'}} >
              <Button text = "全部医生" onClick = {this.selectAllDocs} />
            </Col>
          </Row>
          <div className = 'sdoc_searchResult' style = {{height: (wsHeight - 24 * 12) + 'px'}} >
            {
            filteredDoctors.map ((row, idx) => {
                  const {code,name,pinyin,type,typeName} = row;
                  var style =code?{}:{ color: '#DB5A5A', };
                  return (
                    <div key = {'_search_doc_result_' + idx} className = 'sdoc_item' style={style} onClick = {() => this.choose(row)} >
                      <font> {name}{typeName?' ('+typeName+' )':''}</font>
                    </div>
                  );
                }
              )
            }
          </div>
        </div>
        <div className = 'sdoc_keyboardContainer' style = {{height: (keyboardHeight - 1 * 12) + 'px'}} >
          <CharacterKeyboard onInput = {this.onInput} onClear = {this.onClear} onDel = {this.onDel} height = {keyboardHeight - 12} />
        </div>
      </div>
    );
  }

}
module.exports =   SearchDoctor;