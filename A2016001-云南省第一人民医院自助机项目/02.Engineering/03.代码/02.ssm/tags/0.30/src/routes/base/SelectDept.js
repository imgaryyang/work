import React, { PropTypes } from 'react';
import { connect }          from 'dva';
import { routerRedux }      from 'dva/router';
import { Row, Col, Icon }   from 'antd';

import config               from '../../config';
import styles               from './SelectDept.css';

import WorkSpace            from '../../components/WorkSpace';
import Card                 from '../../components/Card';
import Button               from '../../components/Button';

const _deptLevel = config.dept.level;

class SelectDept extends React.Component {

  static displayName = 'Appoint-SelectDept';
  static description = '预约医生';

  static propTypes = {
  };

  static defaultProps = {
  };

  constructor(props) {
    super(props);
    this.onSelect = this.onSelect.bind(this);
    this.goTo = this.goTo.bind(this);
  }

  componentWillMount() {
    this.props.dispatch({
      type: 'dept/load',
      payload: {},
    });
  }

  onSelect(dept, lvl) {
    if (lvl == -1) return;
    let selected1 = lvl == 1 ? dept : this.props.dept['selected1'],
      selected2 = lvl == 2 ? dept : this.props.dept['selected2'],
      selected3 = lvl == 3 ? dept : this.props.dept['selected3'];

      selected2 = lvl == 1 ? (selected1['children'] && selected1['children'].length > 0 ? selected1['children'][0] : {}) : selected2;
      selected3 = lvl == 1 || lvl == 2 ? {} : selected3;

    this.props.dispatch({
      type: 'dept/selectDept',
      payload: {
        selected1: selected1,
        selected2: selected2,
        selected3: selected3,
      },
    });

    if (lvl == _deptLevel) this.goTo(selected1, selected2, selected3, dept);
    else if (!dept['children'] || dept['children'] == 0) this.goTo(selected1, selected2, selected3, dept);

  }

  goTo(selected1, selected2, selected3, dept) {

    const type = this.props.params.type;

    this.props.dispatch(routerRedux.push({
      pathname: type == 'appointment' ? '/chooseDoctor' : '',
      state: {
        selected1: selected1,
        selected2: selected2,
        selected3: selected3,
        dept: dept,
        nav: {
          title: selected1['DeptName'] + ' > ' + selected2['DeptName'] + (_deptLevel == 3 && selected3['DeptName'] ? ' > ' + selected3['DeptName'] : '' ),
        },
      },
    }));
  }

  render() {

    let span1 = _deptLevel == 2 ? 8 : 6, 
      span2 = _deptLevel == 2 ? 16 : 9, 
      span3 = 9,
      height = config.getWS().height - (1 * config.remSize);

    let deptsContainerStyle1 = {
      height: height + 'px',
    },
    deptsContainerStyle2 = {
      height: height + 'px',
    },
    deptsContainerStyle3 = {
      height: height + 'px',
    };

    const {depts, selected1, selected2, selected3} = this.props.dept;

    return (
      <WorkSpace name = 'comp.ws' fullScreen = {true} style = {{padding: '1rem 1rem 0 1rem'}} >
        <Row>
          <Col span = {span1} >
            <div className = {styles.deptsContainer} style = {deptsContainerStyle1} >
            {
              depts.map(
                (row, idx) => {
                  let {DeptId, DeptName} = row;
                  let deptStyle = row == selected1 ? {backgroundColor: '#BC1E1E', color: '#ffffff'} : {};
                  return (
                    <div className = {styles.deptLvl1} style = {deptStyle} key = {'_lvl1dept_' + idx} onClick = {() => this.onSelect(row, 1)} > {DeptName} </div>
                  );
                }
              )
            }
            </div>
          </Col>
          <Col span = {span2} style = {{paddingLeft: '1rem'}} >
            <div className = {styles.deptsContainer} style = {deptsContainerStyle2} >
            {
              selected1['children'] && selected1['children'].length > 0 ? selected1['children'].map(
                (row, idx) => {
                  let {DeptId, DeptName} = row;
                  let deptStyle = row == selected2 ? {/*backgroundColor: 'rgba(255, 255, 255, .2)'*/ color: '#ff3000'} : {};
                  return (
                    <div className = {styles.dept} style = {deptStyle} key = {'_lvl2dept_' + idx} onClick = {() => this.onSelect(row, 2)} >{DeptName}
                    {
                      _deptLevel == 2 ? (<div className = {styles.chevron} ><Icon type="right" /></div>) : null
                    }
                    </div>
                  );
                }
              ) : (<div className = {styles.noDept} key = {'_lvl2dept_none'} onClick = {() => this.onSelect({}, -1)} >暂无下级科室</div>)
            }
            </div>
          </Col>
          {_deptLevel == 3 ? (
          <Col span = {span3} style = {{paddingLeft: '1rem'}} >
            <div className = {styles.deptsContainer} style = {deptsContainerStyle3} >
            {
              selected2['children'] && selected2['children'].length > 0 ? selected2['children'].map(
                (row, idx) => {
                  let {DeptId, DeptName} = row;
                  let deptStyle = row == selected3 ? {/*backgroundColor: 'rgba(255, 255, 255, .2)'*/ color: '#ff3000'} : {};
                  return (
                    <div className = {styles.dept} style = {deptStyle} key = {'_lvl3dept_' + idx} onClick = {() => this.onSelect(row, 3)} >{DeptName}
                    {
                      _deptLevel == 3 ? (<div className = {styles.chevron} ><Icon type="right" /></div>) : null
                    }
                    </div>
                  );
                }
              ) : (<div className = {styles.noDept} key = {'_lvl2dept_none'} onClick = {() => this.onSelect({}, -1)} >暂无下级科室</div>)
            }
            </div>
          </Col>
          ) : null}
        </Row>
      </WorkSpace>
    );
  }
}

export default connect(({dept}) => ({dept}))(SelectDept);



