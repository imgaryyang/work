'use strict';

import { Component } from 'react';
import ReactDOM from 'react-dom';
import { Timeline,Row,Col,Icon } from 'antd';

class Editor extends Component {
  constructor (props) {
    super(props);
  }
 
  onSubmit(data){
	  console.info('editor onSubmit',Refetch.post,JSON.stringify(data));
		let scope = this;
		let fetch = Refetch.put('api/elh/doctor/'+data.id, data, {
			catch: 3600,dataType:'json'
		});
		fetch.then(res => {
			if(res.success){
				scope.close();
				scope.refreshList()
			}
			else Modal.alert('保存失败'); 
		});
  }
  close(){
	  if(this.props.onClose){
		  this.props.onClose(arguments);
	  }
  }
  refreshList(){
		if(this.props.refreshList){
			this.props.refreshList(arguments);
		}
	}
  componentDidMount () {
		this.state.searchParams.appId="123";
		let param  = JSON.stringify(this.state.searchParams);
		let fetch = Ajax.get('api/el/user/patients/', null, {catch: 3600});
		fetch.then(res => {
	    	return res;
		});
	}
  render () {
    return (
    		<div>
    		<div style={{ marginTop:'20px',backgroundColor: "#dee4e6",border:'dotted'}}>
    			<p><Icon type="heart" />内蒙古国际蒙医医院</p>
    		 </div>
    		 <div style={{ marginTop:'20px',border:'dashed'}}>
    		 <Row>
    	      <Col span={12} ><Icon type="meh-circle" />王一 </Col>
    	      <Col span={12}><Row>
    	      <Col span={12}><Row>
    	      <Col>内蒙古第二代社保卡</Col>
    	      <Col>1232140934893754308504</Col>
    	      </Row></Col>
    	      <Col span={12}><Icon type="home" /></Col>
    	    </Row></Col>
    	    </Row>
 		 </div>
    		 <div style={{ marginTop:'10px'}}>
    		 <Row>
    	      <Col span={6}>内分泌科 </Col>
    	      <Col span={18} style={{border:'solid'}}><Row>
    	      <Col>主诊医生：刘玉兰[教授，主任医生]</Col>
    	      <Col>诊断结果：</Col>
    	      <Col>院内地址：门诊楼三楼南侧</Col>
    	    </Row></Col>
    	    </Row>
 		 </div>
    		 <div style={{ marginTop:'40px'}}>
    			<Timeline>
    				<Timeline.Item>
    				<p>缴费成功 11：20</p>
    				<p>-血细胞分析</p>
    				<p>-尿常规</p>
    				<p>-肝功</p>
    				</Timeline.Item>
    				<Timeline.Item>
    				<p>检查 11：00</p>
    				<p>-血细胞分析（未出结果）</p>
    				<p>-尿常规（未出结果）</p>
    				<p>-肝功（未出结果）</p>
    				</Timeline.Item>
    				<Timeline.Item>
    				<p>看诊10:40</p>
    				<p>在刘玉兰[教授，主任医师]处看诊</p>
    				</Timeline.Item>
    				<Timeline.Item>
    				<p>挂号10:20</p>
    				<p>-内分泌科挂号</p>
    				</Timeline.Item>
    			</Timeline>
    		</div>
    </div>
    );
  }
}
module.exports = Editor;