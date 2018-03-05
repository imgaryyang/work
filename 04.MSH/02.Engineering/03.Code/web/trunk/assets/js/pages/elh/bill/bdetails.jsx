'use strict';

import { Component } from 'react';
import ReactDOM from 'react-dom';
import { Row,Col,Card  } from 'antd';

class Editor extends Component {
	
  constructor (props) {
    super(props);
  }
 
  render () {
    return (
			<div style={{ background: '#ECECEC', padding: '30px' }}>
			<Row><Col span="5">
			<Card  style={{ width: 180,height:250 }}>
			<div className="custom-image">
			<img src={this.props.data[1].photo}  width='130px' height="150px"/>
			</div>
			<div className="custom-bcard">
			<p><h3>{this.props.data[1].name}</h3></p>
			</div>
			</Card></Col>
			
			<Col span="9">				
			<Card style={{ width:800,height:250,lineHeight:2 }}>
			<Row><Col span="5"><p style={{fontWeight:'bold'}}>订单号</p></Col>
			<Col span="5">{this.props.data[0].orderNo}</Col></Row>

			<Row><Col span="5"><p style={{fontWeight:'bold'}}>就诊医院</p></Col>
			<Col span="5">{this.props.data[0].hospitalId}</Col></Row>
			
			<Row><Col span="5"><p style={{fontWeight:'bold'}}>金额（元）</p></Col>
			<Col span="5">{this.props.data[0].amount.toFixed(2)}</Col></Row>

			<Row><Col span="5"><p style={{fontWeight:'bold'}}>状态</p></Col>
			<Col span="5">{this.props.data[0].status == "0"?"未支付":"已支付"}</Col></Row>

			<Row><Col span="5"><p style={{fontWeight:'bold'}}>创建时间</p></Col>
			<Col span="5">{this.props.data[0].payTime}</Col></Row>

			<Row><Col span="5"><p style={{fontWeight:'bold'}}>支付时间</p></Col>
			<Col span="5">{this.props.data[0].payTime}</Col></Row>
			
			<Row><Col span="5"><p style={{fontWeight:'bold'}}>更新时间</p></Col>
			<Col span="5">{this.props.data[0].updateTime}</Col></Row>
			
			<Row><Col span="5"><p style={{fontWeight:'bold'}}>所属就医记录</p></Col>
			<Col span="5">{this.props.data[0].treatmentId}</Col></Row>
			
			<Row><Col span="5"><p style={{fontWeight:'bold'}}>描述</p></Col>
			<Col span="5">{this.props.data[0].description}</Col></Row>
			</Card></Col></Row>
			
			</div>
    );
  }
}
module.exports = Editor;
