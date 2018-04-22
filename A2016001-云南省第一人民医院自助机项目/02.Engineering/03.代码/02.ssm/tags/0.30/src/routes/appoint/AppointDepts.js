import React, { PropTypes }    from 'react';
import { connect }             from 'dva';
import { routerRedux }         from 'dva/router';
import { Row, Col, Icon }      from 'antd';

import config                  from '../../config';
import styles                  from './AppointDepts.css';

import { WorkSpace, Card, Button } from '../../components';

class SelectDept extends React.Component {
	
	constructor(props) {
		super(props);
		this.onSelect = this.onSelect.bind(this);
	}
	state = {
		selectL1 : {children:[]},
		selectL2 : {children:[]},
		selectL3 : {children:[]},
	};
	componentDidMount() {//加载所有可预约科室
		var { baseInfo } = this.props.patient;
		if(!baseInfo.no)return;
		setTimeout(()=>{
			this.props.dispatch({
				type: 'appoint/loadDeptList'
			})
		},200);
	}
	componentWillReceiveProps(nextProps){//默认选择第一个
		var {departments} = nextProps.appoint ;
		if(departments.length > 0 && this.state.selectL1.code == null){
			this.setState({
				selectL1 : departments[0],
			});
		}
	}
  
	onSelect(dept, level) { 
		if(level == -1) return;
		if(level == 1)this.setState({selectL1: dept, selectL2: {children:[]}, selectL3: {children:[]}});
		if(level == 2)this.setState({selectL2: dept, selectL3: {children:[]}});
		if(level == 3)this.setState({selectL3: dept});
		if(dept.children && dept.children.length>0)return;
	    this.props.dispatch({
	    	type:'appoint/setState',
	    	payload : {department : dept}
	    });
	}


  render() {
    var scope = this;
	var {selectL1,selectL2,selectL3} = this.state;
	var { departments } = this.props.appoint ;
	
	var spans = selectL3.name?{span1:6,span2:9,span3:9} : {span1:8,span2:16,span3:0}
	
	var height = config.getWS().height - (1 * config.remSize);
	var selectedStyle = {backgroundColor: '#BC1E1E', color: '#ffffff'};
	
    return (
      <WorkSpace fullScreen = {true} style = {{padding: '1rem 1rem 0 1rem'}} >
        <Row>
          <Col span = {spans.span1} >
            <div className = {styles.deptsContainer} style = {{height:height}} >
            {
            	departments.map(function(dept,index){
                    return (
                    	<div className = {styles.dept} key = {dept.code} 
                    		onClick = {()=>{ scope.onSelect(dept,1) }}
                    		style = { dept.code == selectL1.code ? selectedStyle:null} >
                    		{dept.name} 
                    	</div>
                    );
            	})
            }
            </div>
          </Col>
          <Col span = {spans.span2} style = {{paddingLeft: '1rem'}} >
            <div className = {styles.deptsContainer} style = {{height:height}} >
            {
            	selectL1.children.map(function(dept,index){
                    return (
                    	<div className = {styles.dept} key = {dept.code}
                    		onClick = {()=>{ scope.onSelect(dept,2) }}
                    		style = { dept.code == selectL2.code ? selectedStyle:null} >
                    		{dept.name} 
                    	</div>
                    );
            	})
            }
            {
            	selectL1.children.length <= 0 ?(
            	  <div className = {styles.noDept} key = {'none2'} >暂无下级科室</div>
            	):null
            }
            </div>
          </Col>
          <Col span = {spans.span3} style = {{paddingLeft: '1rem'}} >
            <div className = {styles.deptsContainer} style = {{height:height}} >
	          {
	        	selectL2.children.map(function(dept,index){
                  return (
                  	<div className = {styles.deptLvl3} key = {dept.code} 
                  		onClick = {()=>{ scope.onSelect(dept,1) }}
                  		style = { dept.code == selectL3.code ? selectedStyle:null} >
                  		{dept.name} 
                  	</div>
                  );
	          	})
	          }
	          {
	        	selectL2.children.length <= 0 ?(
	          	  <div className = {styles.noDept} key = {'none3'} >暂无下级科室</div>
	          	):null
	          }
            </div>
          </Col>
        </Row>
      </WorkSpace>
    );
  }
}

export default connect(({appoint,patient}) => ({appoint,patient}))(SelectDept);



