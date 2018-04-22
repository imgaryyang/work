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

  static displayName = 'SearchDoctor';
  static description = '搜索医生';

  static propTypes = {
  };

  static defaultProps = {
  };

  /**
  * 初始化状态
  */
  state = {
  };

  constructor (props) {
    super(props);

    //this.search       = this.search.bind(this);
    this.choose         = this.choose.bind(this);
    this.selectAllDocs  = this.selectAllDocs.bind(this);

    this.onInput        = this.onInput.bind(this);
    this.onClear        = this.onClear.bind(this);
    this.onDel          = this.onDel.bind(this);
  }

  /**
   * 初始化数据
   */
  componentWillMount () {
    /*this.props.dispatch({
      type: 'doctor/clearSearchResult',
      payload: {},
    });*/

    /*this.props.dispatch({
      type: 'doctor/search',
      payload: {
        cond: this.props.doctor.cond,
      },
    });*/
  }

  /**
   * 根据拼音首字母查询
   */
  /*search () {
    this.props.dispatch({
      type: 'doctor/search',
      payload: {
        cond: this.props.doctor.cond,
      },
    });
  }*/

  /**
   * 从结果中选择医生
   */
  choose (doctor) {
    if (this.props.location.state.onChoose) {
      this.props.dispatch({
        type: this.props.location.state.onChoose,
        payload: {
          selectedDoctor: doctor
        },
      });

      this.props.dispatch(routerRedux.goBack());
    }
  }

  selectAllDocs () {
    this.props.dispatch({
      type: 'doctor/search',
      payload: {
        cond: '',
      },
    });
    this.choose({});
  }

  /**
   * 监听键盘输入
   */
  onInput(key) {
    if (this.props.doctor.cond.length == 5) return;

    this.props.dispatch({
      type: 'doctor/search',
      payload: {
        cond: this.props.doctor.cond + key,
      },
    });

  }

  /**
   * 监听键盘删除键
   */
  onDel() {

    this.props.dispatch({
      type: 'doctor/search',
      payload: {
        cond: this.props.doctor.cond.substr(0, this.props.doctor.cond.length - 1),
      },
    });
    /*this.setState({
      cond: this.props.doctor.cond.substr(0, this.props.doctor.cond.length - 1),
    });*/
  }

  /**
   * 监听键盘清空键
   */
  onClear() {

    this.props.dispatch({
      type: 'doctor/search',
      payload: {
        cond: '',
      },
    });
    /*this.setState({
      cond: '',
    });*/
  }

  render () {
    const { doctors, searchResult } = this.props.doctor;

    let wsHeight = config.getWS().height * 2 / 3,
    keyboardHeight = config.getWS().height * 1 / 3;

    return (
      <WorkSpace fullScreen = {true} >
        <div className = {styles.wsContainer} style = {{height: wsHeight + 'px', padding: config.navBar.padding + 'rem'}} >
          <Row>
            <Col span = {18} >
              <Input value = {this.props.doctor.cond} placeholder = {(<font><Icon type = 'search' />&nbsp;&nbsp;请输入姓名拼音首字母</font>)} focus = {true} style = {{textAlign: 'center'}} />
            </Col>
            <Col span = {6} style = {{paddingLeft: '2rem'}} >
              <Button text = "全部医生" onClick = {this.selectAllDocs} />
            </Col>
          </Row>
          
          <div className = {styles.searchResult} style = {{height: (wsHeight - (2 + 6 + 2) * config.remSize) + 'px'}} >
            {
              searchResult.map (
                (row, idx) => {
                  const {DeptId, DeptName, DocotorId, DoctorName, Gender, JobTitleId, JobTitle} = row;
                  return (
                    <div key = {'_search_doc_result_' + idx} className = {styles.item} onClick = {() => this.choose(row)} >
                      {DoctorName}<font> ( {JobTitle} )</font>
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
  

export default connect(({doctor}) => ({doctor}))(SearchDoctor);



