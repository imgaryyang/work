import React, { PropTypes }    from 'react';
import { Row, Col, Icon }      from 'antd';
import styles                  from './AppointDepts.css';

import baseUtil from '../../utils/baseUtil.jsx';
import NavContainer from '../../components/NavContainer.jsx';

class SelectDept extends React.Component {
	
	constructor(props) {
		super(props);
		this.onSelect = this.onSelect.bind(this);
		this.afterSelect = this.afterSelect.bind(this);
		
		this.onBack = this.onBack.bind(this);
		this.onHome = this.onHome.bind(this);
		this.state = {
		  departments:[],
		  selectL1 : {children:[]},
		  selectL2 : {children:[]},
		  selectL3 : {children:[]},
		}
	}
	onBack(){
		baseUtil.goHome('appointDeptBack'); 
	}
	onHome(){
		baseUtil.goHome('appointDeptHome'); 
	}
	componentDidMount() {// 加载所有可预约科室
		let fetch = Ajax.get("/api/ssm/treat/appointment/department/list",{},{catch: 3600});
		fetch.then(res => {
			if(res && res.success){
				var departments = res.result||[];
				var selectL1 = departments[0]?departments[0]:  {children:[]};
				this.setState({departments,selectL1});
			}else if( res && res.msg ){
				baseUtil.error(res.msg);
	    	}else{
	    		baseUtil.error("查询档案失败");
	    	}
		}).catch((ex) =>{
			baseUtil.error("查询档案失败");
		});
	}
	onSelect(dept, level) { 
		if(level == -1) return;
		if(level == 1)this.setState({selectL1: dept, selectL2: {children:[]}, selectL3: {children:[]}});
		if(level == 2)this.setState({selectL2: dept, selectL3: {children:[]}});
		if(level == 3)this.setState({selectL3: dept});
		if(dept.children && dept.children.length>0)return;
		this.afterSelect(dept);
	}
	
	afterSelect(dept){
		if(this.props.afterSelect)this.props.afterSelect(dept);
	}

  render() {
    var scope = this;
	var {selectL1,selectL2,selectL3,departments} = this.state;
	
	var spans = selectL3.name?{span1:6,span2:9,span3:9} : {span1:8,span2:16,span3:0}
	
	var height = document.body.clientHeight- 12;
	var selectedStyle = {backgroundColor: '#BC1E1E', color: '#ffffff'};
	
    return (
      <NavContainer  title='预约科室' onBack={this.onBack} onHome={this.onHome} >
        <Row>
          <Col span = {spans.span1} >
            <div className = 'app_dept_deptsContainer' style = {{height:height}} >
            {
            	departments.map(function(dept,index){
                    return (
                    	<div className = 'app_dept_dept' key = {dept.code+index} 
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
            <div className = 'app_dept_deptsContainer' style = {{height:height}} >
            {
            	selectL1.children.map(function(dept,index){
                    return (
                    	<div className = 'app_dept_dept' key = {dept.code}
                    		onClick = {()=>{ scope.onSelect(dept,2) }}
                    		style = { dept.code == selectL2.code ? selectedStyle:null} >
                    		{dept.name} 
                    	</div>
                    );
            	})
            }
            {
            	selectL1.children.length <= 0 ?(
            	  <div className = 'app_dept_noDept' key = {'none2'} >暂无下级科室</div>
            	):null
            }
            </div>
          </Col>
          <Col span = {spans.span3} style = {{paddingLeft: '1rem'}} >
            <div className = 'app_dept_deptsContainer' style = {{height:height}} >
	          {
	        	selectL2.children.map(function(dept,index){
                  return (
                  	<div className = 'app_dept_deptLvl3' key = {dept.code} 
                  		onClick = {()=>{ scope.onSelect(dept,1) }}
                  		style = { dept.code == selectL3.code ? selectedStyle:null} >
                  		{dept.name} 
                  	</div>
                  );
	          	})
	          }
	          {
	        	selectL2.children.length <= 0 ?(
	          	  <div className = 'app_dept_noDept' key = {'none3'} >暂无下级科室</div>
	          	):null
	          }
            </div>
          </Col>
        </Row>
      </NavContainer>
    );
  }
}
module.exports = SelectDept;