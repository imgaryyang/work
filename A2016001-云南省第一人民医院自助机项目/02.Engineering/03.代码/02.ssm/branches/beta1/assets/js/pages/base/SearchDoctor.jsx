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

class SearchDoctor extends React.Component {


  constructor (props) {
    super(props);
    this.choose         = this.choose.bind(this);
    this.selectAllDocs  = this.selectAllDocs.bind(this);
    this.onInput        = this.onInput.bind(this);
    this.onClear        = this.onClear.bind(this);
    this.onDel          = this.onDel.bind(this);
    this.state = {  pinyin:'' };
  }
  

  
  componentWillMount () {
  }
  choose (doctor) {
	  if(this.props.onChoose)this.props.onChoose(doctor);
  }

  selectAllDocs () {
    this.choose({});
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
    		filteredDoctors.push(doctor);
    		if(filteredDoctors.length>=4)break;
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
                  return (
                    <div key = {'_search_doc_result_' + idx} className = 'sdoc_item' onClick = {() => this.choose(row)} >
                      <font> {name}( {typeName} )</font>
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