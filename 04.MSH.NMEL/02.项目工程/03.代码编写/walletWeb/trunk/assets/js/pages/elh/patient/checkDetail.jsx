'use strict';

import { Component } from 'react';
import ReactDOM from 'react-dom';
import { Row,Col,Card,Table } from 'antd';

class Create extends Component {

	constructor (props) {
		super(props);
		this.state={cehckd:{}};
	}
	
	componentWillMount(){
		let fetch = Ajax.get('/api/elh/treat/medicalcheck/'+this.props.data.id,null, {catch: 3600});
		fetch.then(res => {
			let data = res.result;
			this.setState({checkd:data.details});

	    	return res;
		});
	}
	
	getColumn (){
		const scope = this;
		return [{
			title: <div style={{textAlign:'center'}}>项目名称</div>,
			dataIndex: 'subject',
			className:'check-column',
			render(text,record,index){
				return <p>{record.subject}</p>
			},
		}, {
			title: '结果',
			dataIndex: 'result',
			render(text,record,index) {
				return <p>{record.result}</p>;
			},
		},{
			title: '单位',
			dataIndex: 'unit',
			render(text,record,index){
				return <p>{record.unit}</p>
			},
		},{
			title: '参考值',
			dataIndex: 'reference',
			render(text,record,index){
				return <p>{record.reference}</p>
			}
		}
		];
	}
	
	render () {
return (
<div>
<div style={{textAlign:"center"}}><h1>检查单</h1></div>
<hr/>
<Row>
<Col span={12}>
 <div style={{marginLeft:'190px'}}>
	<p><font style={{fontSize:'15px',fontWeight:'bold'}}>姓名:</font>{this.props.data.name}</p>
	<p><font style={{fontSize:'15px',fontWeight:'bold'}}>申请项目:</font>{this.props.data.subject}</p>
 	<p><font style={{fontSize:'15px',fontWeight:'bold'}}>科室:</font>{this.props.data.department}</p>
 </div>
</Col>
<Col span={12}>
 <div style={{marginLeft:'130px'}}>
 	<p><font style={{fontSize:'15px',fontWeight:'bold'}}>申请医师:</font>{this.props.data.applyDoctor}</p>
 	<p><font style={{fontSize:'15px',fontWeight:'bold'}}>标本:</font>{this.props.data.specimen}</p>
    <p><font style={{fontSize:'15px',fontWeight:'bold'}}>备注:</font>{this.props.data.comment}</p>
 </div>	
</Col>
</Row>
<hr/>
	<Table 
 	columns={this.getColumn()} 
    dataSource={this.state.checkd}
    rowKey={record => record.id}
	pagination={false}/>

<hr/>
<Row>
<Col span={12}>
 <div style={{marginLeft:'180px'}}>
	<p><font style={{fontSize:'15px',fontWeight:'bold'}}>采样时间:</font>{this.props.data.checkTime}</p>
	<p><font style={{fontSize:'15px',fontWeight:'bold'}}>接收时间:</font>{this.props.data.submitTime}</p>
	<p><font style={{fontSize:'15px',fontWeight:'bold'}}>报告时间:</font>{this.props.data.reportTime}</p>
 </div>
</Col>
<Col span={12}>
 <div style={{marginLeft:'130px'}}>
 	<p><font style={{fontSize:'15px',fontWeight:'bold'}}>检验者:</font>{this.props.data.operator}</p>
 	<p><font style={{fontSize:'15px',fontWeight:'bold'}}>审核者:</font>{this.props.data.audit}</p>
    <p><font style={{fontSize:'15px',fontWeight:'bold'}}>检查仪器:</font>{this.props.data.machine}</p>
 </div>
</Col>
</Row>

<hr/>

</div>
    );
  }
}
module.exports = Create

