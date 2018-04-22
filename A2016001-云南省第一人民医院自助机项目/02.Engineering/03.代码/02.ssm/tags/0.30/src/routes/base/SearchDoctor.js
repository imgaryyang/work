import React, { PropTypes } from 'react';
import { connect }          from 'dva';
import { routerRedux }      from 'dva/router';
import { 
  Row, Col, 
  Icon, Modal,
}                           from 'antd';

import config               from '../../config';
import styles               from './SearchDoctor.css';

import WorkSpace            from '../../components/WorkSpace';
import Card                 from '../../components/Card';
import Button               from '../../components/Button';
import Input                from '../../components/Input';
import ToolBar              from '../../components/ToolBar';
import Week                 from '../../components/Week';
import CharacterKeyboard    from '../../components/keyboard/CharacterKeyboard';

class SearchDoctor extends React.Component {


  constructor (props) {
    super(props);
    this.choose         = this.choose.bind(this);
    this.selectAllDocs  = this.selectAllDocs.bind(this);
    this.onInput        = this.onInput.bind(this);
    this.onClear        = this.onClear.bind(this);
    this.onDel          = this.onDel.bind(this);
  }
  
  state = {  pinyin:'' };
  
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
    
    let wsHeight = config.getWS().height * 2 / 3,
    keyboardHeight = config.getWS().height * 1 / 3;

    return (
      <WorkSpace fullScreen = {true} >
        <div className = {styles.wsContainer}  >
          <Row style = {{height:'8rem', padding: config.navBar.padding + 'rem'}}>
            <Col span = {18} >
              <Input value={pinyin} placeholder = {(<font><Icon type = 'search' />&nbsp;&nbsp;请输入姓名拼音首字母</font>)} focus = {true} style = {{textAlign: 'center'}} />
            </Col>
            <Col span = {6} style = {{paddingLeft: '2rem'}} >
              <Button text = "全部医生" onClick = {this.selectAllDocs} />
            </Col>
          </Row>
          <div className = {styles.searchResult} style = {{height: (wsHeight - 24 * config.remSize) + 'px'}} >
            {
            filteredDoctors.map (
                (row, idx) => {
                  const {code,name,pinyin,type,typeName} = row;
                  return (
                    <div key = {'_search_doc_result_' + idx} className = {styles.item} onClick = {() => this.choose(row)} >
                      <font> {name}( {typeName} )</font>
                    </div>
                  );
                }
              )
            }
          </div>
        </div>
        <div className = {styles.keyboardContainer} style = {{height: (keyboardHeight - 1 * config.remSize) + 'px'}} >
          <CharacterKeyboard onInput = {this.onInput} onClear = {this.onClear} onDel = {this.onDel} height = {keyboardHeight - config.remSize} />
        </div>
      </WorkSpace>
    );
  }

}
  

export default connect()(SearchDoctor);



