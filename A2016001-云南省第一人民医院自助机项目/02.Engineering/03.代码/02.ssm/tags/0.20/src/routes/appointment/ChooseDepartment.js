import React, { PropTypes }    from 'react';
import { connect }             from 'dva';
import { routerRedux }         from 'dva/router';
import { Row, Col, Icon }      from 'antd';

import config                  from '../../config';
import styles                  from './ChooseDepartment.css';

import { WorkSpace, Card, Button } from '../../components';

const _deptLevel = config.dept.level;

class SelectDept extends React.Component {
	
	static displayName = 'Appoint-SelectDept';
	static description = '选择可挂号科室';

	static propTypes = {
	};
	
	static defaultProps = {
	};
	
	state = {
		selectL1 : null,
		selectL2 : null,
		selectL3 : null
	};
  
	constructor(props) {
		super(props);
		this.onSelect = this.onSelect.bind(this);
		this.getDepartmentL2 = this.getDepartmentL2.bind(this);
		this.getDepartmentL3 = this.getDepartmentL3.bind(this);
	}

	componentWillMount() {//加载所有可预约科室
		this.props.dispatch({
			type: 'schedule/loadDepartments'
		});
	}
	
	componentWillReceiveProps(nextProps){//默认选择第一个
		var {departments} = nextProps.schedule ;
		if(departments.length>0 && this.state.selectL1 == null){
			var selectL1 = departments[0],selectL2=null;
			if(selectL1 && selectL1.children && selectL1.children.length>0){
				selectL2= selectL1.children[0];
			}
			this.setState({
				selectL1 : selectL1,
				selectL2 : selectL2
			});
		}
	}
	
	getDepartmentL2(arrayL1){//二级科室
		var {selectL1} = this.state;
		if(arrayL1==null || selectL1 == null ){
			return[];
		}
		for(var dept of arrayL1){
			if(dept.id == selectL1.id){
				return dept.children;
			}
		}
		return [];
	}
	
	getDepartmentL3(arrayL2){//三级科室
		var {selectL2} = this.state;
		if(arrayL2==null || selectL2 == null){
			return[];
		}
		for(var dept of arrayL2){
			if(dept.id == selectL2.id){
				return dept.children;
			} 
		}
		return [];
	}	
  
	onSelect(dept, level) {
		if(level == -1) return;
		if(level == 1)this.setState({selectL1: dept, selectL2:null, selectL3:null});
		if(level == 2)this.setState({selectL2: dept, selectL3:null});
		if(level == 3)this.setState({selectL3: dept});
		if(dept.children && dept.children.length>0)return;
    
	    function getFullName(department){//获取>分隔的上下级名称
	    	var parent = department.parent;
	    	if(parent) return getFullName(parent)+" > "+department.name;
	    	else return department.name
	    };
	    var fullname = getFullName(dept);
    
	    this.props.dispatch(routerRedux.push({
	        pathname:"chooseDoctor",
		    state: {
		      department: {...dept,children:null,parent:null},//TODO 有循环错误，将parent、children至空
		      nav: {title: fullname},
		    },
		}));
	}


  render() {
	var scope = this;
	var {selectL1,selectL2,selectL3} = this.state;
	
	var {departments} = this.props.schedule ;
	var departments_L2 = this.getDepartmentL2(departments);
	var departments_L3 = this.getDepartmentL3(departments_L2);//console.info(departments_L3);

	var hasL2 = (departments_L2!=null&&departments_L2.length>0)?true:false;
	var hasL3 = (departments_L3!=null&&departments_L3.length>0)?true:false;
	
	var span1 = hasL3 ? 6:8, span2 = hasL3?9:16,span3=9;
	var height = config.getWS().height - (1 * config.remSize);
	var containerStyle  = { height: height + 'px',};
	var {deptsContainer} = styles;
    

    return (
      <WorkSpace name = 'comp.ws' fullScreen = {true} style = {{padding: '1rem 1rem 0 1rem'}} >
        <Row>
          <Col span = {span1} >
            <div className = {deptsContainer} style = {containerStyle} >
            {
            	departments.map(function(dept,index){
            		let {id, name} = dept;
                    let deptStyle = (dept == selectL1) ? {backgroundColor: '#BC1E1E', color: '#ffffff'} : {};
                    return (
                    	<div className = {styles.deptLvl1} style = {deptStyle} key = {'dept_' + id} onClick = {() => scope.onSelect(dept, 1)} > {name} </div>
                    );
            	})
            }
            </div>
          </Col>
          <Col span = {span2} style = {{paddingLeft: '1rem'}} >
            <div className = {deptsContainer} style = {containerStyle} >
            {
            	hasL2?departments_L2.map(function(dept,index){
          		  let {id, name} = dept;
                  let deptStyle = (dept == selectL2) ? {backgroundColor: '#BC1E1E', color: '#ffffff'} : {};
                  var icon = hasL2?<div className = {styles.chevron} ><Icon type="right" /></div>:"";
                  return (
                  	<div className = {styles.dept} style = {deptStyle} key = {'dept_' + id} onClick = {() => scope.onSelect(dept, 2)} > {name}{icon} </div>
                  );
          	  }):(<div className = {styles.noDept} key = {'_lvl2dept_none'} onClick = {() => scope.onSelect({}, -1)} >暂无下级科室</div>)
            }
            </div>
          </Col>
          {
        	  hasL3? (
		          <Col span = {span3} style = {{paddingLeft: '1rem'}} >
		          <div className = {deptsContainer} style = {containerStyle} >
		            {
		            	hasL3 ? departments_L3.map(function(dept, index){
		            		  let {id, name} = dept;
		                      let deptStyle = (dept == selectL2) ? {color: '#ff3000'} : {};
		                      let icon = hasL3?<div className = {styles.chevron} ><Icon type="right" /></div>:"";
		                  return (
		                    <div className = {styles.dept} style = {deptStyle} key = {'dept_' + id} onClick = {() => scope.onSelect(dept, 3)} >{name}{icon}</div>
		                  );
		                }) : (<div className = {styles.noDept} key = {'_lvl2dept_none'} onClick = {() => scope.onSelect({}, -1)} >暂无下级科室</div>)
		            }
		            </div>
		          </Col>
          ) : null}
        </Row>
      </WorkSpace>
    );
  }
}

export default connect(({schedule}) => ({schedule}))(SelectDept);



