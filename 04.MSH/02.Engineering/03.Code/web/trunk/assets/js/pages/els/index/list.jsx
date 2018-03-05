'use strict';

import { Component } from 'react';
import ReactDOM from 'react-dom';
import {Card, Collapse, Row, Col, Button, Modal, Select, Form } from 'antd';

const Panel = Collapse.Panel;
const FormItem = Form.Item;
const Option = Select.Option;

class BarCharts extends Component{
	constructor (props) {
		super(props);
		this.state = {
			myChart : null
		};
		
	}
	getDefaultProps() {
		return {
			id : '',
			title : {},
			legend : {},
			series:[],
			xAxis : [],
			yAxis : []
		}
	}

	componentDidMount() {
		if (null == this.state.myChart) {
			try {
				this.state.myChart = echarts.init(document.getElementById(this.props.id));
			} catch(err) {
				console.info(err.message );
			}
		}

		let option = {
            title : this.props.title,
            tooltip : {},
            legend : this.props.legend,
            xAxis : this.props.xAxis,
            yAxis : this.props.yAxis,
            series :this.props.series
		};
		this.state.myChart.setOption(option);
	}
	componentWillUpdate() {
		let option = {
            title : this.props.title,
            tooltip : {},
            legend : this.props.legend,
            xAxis : this.props.xAxis,
            yAxis : this.props.yAxis,
            series :this.props.series
		};

		this.state.myChart.setOption(option);
	}

	render() {
		return(
			<div id={this.props.id} style={this.props.style}></div>
		)
	}
}

const splitNum = 8;
class IndexList extends Component {

	constructor (props) {
		super(props);
		let optionYear = {
			title: {
				text: '年度',
				textBaseline: 'middle',
			},
			tooltip: {
				trigger: 'axis'
			},
			toolbox: {
				feature: {
					dataView: {show: true, readOnly: false},
					magicType: {show: true, type: ['line', 'bar']},
					restore: {show: true},
					saveAsImage: {show: true}
				}
			},
			xAxis: [{
				type: 'category',
				data:[]
			}],
			yAxis: [{
				type: 'value', name: '(元)', splitNumber: splitNum, minInterval: 1, max: splitNum,
			},{
				type: 'value', name: '(人)', splitNumber: splitNum, minInterval: 1, max: splitNum, splitLine: {show: false}
			}],
			legend: {
				data: ['金额','人数']
			},
			color: ['#c23531','#A4E49B'],
			series :[{
						name: '金额',
						type: 'bar',
						yAxisIndex: 0,
						data: [],
					 	itemStyle: {
					 		normal: {
					 			color:'#688FD3'
					 		}
					 	}
					},
					{
						name: '人数',
						type: 'bar',
						yAxisIndex: 1,
						data: [],
						itemStyle: {
					 		normal: {
					 			color:'#A4E49B'
					 		}
					 	}
					}],
		};

		let optionHfYear = {
			title:{text:'半年度'},
			xAxis:[{type:'category',data:[]}],
			yAxis:[{type: 'value', name: '(元)', splitNumber: splitNum, minInterval: 1, max: splitNum},
				   {type: 'value', name: '(人)', splitNumber: splitNum, minInterval: 1, max: splitNum, splitLine: {show: false}}],
			legend:{data:['金额','人数']},
			series:[{name:'金额',type:'bar',yAxisIndex:0,data:[]},
					{name:'人数',type:'bar',yAxisIndex:1,data:[]}]
		};

		let optionQuarter = {
			title:{text:'季度'},
			xAxis:[{type:'category',data:[]}],
			yAxis:[{type: 'value', name: '(元)', splitNumber: splitNum, minInterval: 1, max: splitNum},
				   {type: 'value', name: '(人)', splitNumber: splitNum, minInterval: 1, max: splitNum, splitLine: {show: false}}],
			legend:{data:['金额','人数']},
			series:[{name:'金额',type:'bar',yAxisIndex:0,data:[]},
					{name:'人数',type:'bar',yAxisIndex:1,data:[]}]
		};

		this.state = {
			optionYear : optionYear,
			optionHfYear : optionHfYear,
			optionQuarter : optionQuarter,
	        totAmt:'0.00',
	        totCnt:'0',
	        totPerCnt:'0',
	        orgName:'',
	        salesName:'',
	        telphone:'',
	        createdAt:'',
	        selectOpts: [],
	        selectDefaultOpts: '',
    	};
	}

	componentWillMount() {
		this.getOrgInfo();
		this.getBatch();
		this.getYear(); 
		this.getHalfYear();
		this.getQuarter();
	}

	getYear() {
		let url = 'api/els/paybatch/yearstatistics';
		let fetch = Ajax.get( url, null, {catch: 3600});

		let optionYear = this.state.optionYear;
		let maxAmt = 0.00;
		let maxCount = 0;
		fetch.then( res=> {
			if ( res == null ) return;
			res.result.map(function(item){

				maxAmt = parseFloat(item.allamount) > maxAmt ? parseFloat(item.allamount) : maxAmt;
				maxCount = parseInt(item.allcnt) > maxCount ? parseInt(item.allcnt) : maxCount;

				optionYear.yAxis[0].minInterval = parseInt(maxAmt / splitNum / 100 + 1) * 100 ;
				optionYear.yAxis[0].max = parseInt(maxAmt / splitNum / 100 + 1) * 100 * splitNum;
				optionYear.yAxis[1].minInterval = parseInt(maxCount / splitNum) + 1;

				optionYear.xAxis[0].data.push(item.year);
				optionYear.series[0].data.push(parseFloat(item.allamount).toFixed(2));
				optionYear.series[1].data.push(parseInt(item.allcnt));
				return item;
			})
			this.setState({
				optionYear : optionYear
			});
			return res;
		});
	}

	getHalfYear() {
		let year = (new Date()).getFullYear();

		let data = {};
		data['startYear'] = year - 2 + '';
		data['endYear'] = year + '';

		let url = 'api/els/paybatch/hfyearstatistics?data='+ JSON.stringify(data);

		console.info('-----------------getHalfYear:' , url);

		let fetch = Ajax.get( url, null, {catch: 3600});

		let optionHfYear = this.state.optionHfYear;
		let maxAmt = 0.00;
		let maxCount = 0;
		fetch.then( res=> {
			if ( res == null ) return;
			res.result.map(function(item){

				maxAmt = parseFloat(item.allamount) > maxAmt ? parseFloat(item.allamount) : maxAmt;
				maxCount = parseInt(item.allcnt) > maxCount ? parseInt(item.allcnt) : maxCount;

				optionHfYear.yAxis[0].minInterval = parseInt(maxAmt / splitNum / 100 + 1) * 100 ;
				optionHfYear.yAxis[0].max = parseInt(maxAmt / splitNum / 100 + 1) * 100 * splitNum;
				optionHfYear.yAxis[1].minInterval = parseInt(maxCount / splitNum) + 1;

				optionHfYear.xAxis[0].data.push(item.hfyear);
				optionHfYear.series[0].data.push(parseFloat(item.allamount).toFixed(2));
				optionHfYear.series[1].data.push(parseInt(item.allcnt));
				return item;
			})
console.log(optionHfYear);

			this.setState({
				optionHfYear : optionHfYear
			});

			return res;
		});
	}

	getQuarter() {
		let year = (new Date()).getFullYear();

		let data = {};
		data['startYear'] = year - 2 + '';
		data['endYear'] = year + '';
		let url = 'api/els/paybatch/quarterstatistics?data='+ JSON.stringify(data);

		console.info('-----------------getQuarter:' , url);

		let fetch = Ajax.get( url, null, {catch: 3600});

		let optionQuarter = this.state.optionQuarter;
		let maxAmt = 0.00;
		let maxCount = 0;
		fetch.then( res=> {
			if ( res == null ) return;
			res.result.map(function(item){

				maxAmt = parseFloat(item.allamount) > maxAmt ? parseFloat(item.allamount) : maxAmt;
				maxCount = parseInt(item.allcnt) > maxCount ? parseInt(item.allcnt) : maxCount;

				optionQuarter.yAxis[0].minInterval = parseInt(maxAmt / splitNum / 100 + 1) * 100 ;
				optionQuarter.yAxis[0].max = parseInt(maxAmt / splitNum / 100 + 1) * 100 * splitNum;
				optionQuarter.yAxis[1].minInterval = parseInt(maxCount / splitNum) + 1;
				
				optionQuarter.xAxis[0].data.push(item.quarter);
				optionQuarter.series[0].data.push(parseFloat(item.allamount).toFixed(2));
				optionQuarter.series[1].data.push(parseInt(item.allcnt));
				return item;
			})
console.log(optionQuarter);
			this.setState({
				optionQuarter : optionQuarter
			});

			return res;
		});
	}

	getOrgInfo(){
		let url = 'api/els/elsorg';
		let fetch = Ajax.get( url, null, {catch: 3600});

		fetch.then( res=> {
			if ( res == null ) return;
			this.setState({ 
				orgName:res.result.name,
		        salesName:res.result.salesman,
		        telphone:res.result.lmContactWay,
		        createdAt:res.result.createdAt
		    });
			return res;
		});
	}

	getBatch() {
		let url = 'api/els/paybatch/querystatistics';
		let fetch = Ajax.get( url, null, {catch: 3600});

		fetch.then( res=> {
			if ( res == null ) return;
			this.setState({ 
				totAmt:res.result.allamount,
		        totCnt:res.result.allbatchnum,
		        totPerCnt:res.result.allpernum 
		    });
			return res;
		});
	}

	upLoadPayList() {
		if(this.props.upLoadPayList) {
			this.props.upLoadPayList( );
		}
	}

	upLoadStubList() {
		if(this.props.upLoadStubList) {
			this.props.upLoadStubList( );
		}
	}

	upLoadPayTemp() {
		window.location.href = "api/els/paypreview/download";
	}

	handleCancel() {
		this.setState({
			upLoadStubTemp: false,
		})
	}

	handleOk() {

		this.props.form.validateFields((errors, values) => {
			if ( !!errors ) {
				console.log(errors);
				return;
			}
			console.log(values);
			window.location.href = "api/els/stubtemplate/export/" + values.templateId;

			this.setState({
				upLoadStubTemp: false,
			})
		});

	}

	upLoadStubTemp() {
		
		this.setState({
			upLoadStubTemp: true,
		});
		try {
			let fetch = Ajax.get('api/els/stubtemplate/list/0/100', null, {catch: 3600});
			fetch.then(res => {
				let selectOpts = this.state.selectOpts;

				if ( res.result ) {
					res.result.map((item, index) => {
						if( index == 0 ) {
							selectOpts.push(<Option value={item.id}> {item.template} </Option>);
						}
						selectOpts.push(<Option value = {item.id}> {item.template} </Option>);
					});

					this.setState({
						selectOpts: selectOpts,
						selectDefaultOpts: res.result[0].id,
					});
				}
				
			});
		} catch(e) {
			console.log(e.message);
		}
	}

	upLoadPerTemp() {
		window.location.href="api/els/permng/exporttemplate";
	}

	render () { 
		var infoStyle = {
			color:'#000000',
			border:'1px solid #FFDEAD',
			height:'130px',
			// marginTop:'20px',
			marginLeft:'20px'
		};
		var payStyle = {
			color:'#000000',
			border:'1px solid #FFDEAD',
			height:'130px',
			// marginTop:'20px',
			marginRight:'20px',
			marginLeft:'10px'
		};
		var test = {
			textAlign:'center',
			// border:'1px solid #000000'
		};
		var spanStyle={
			color:'#FF0000',
			// border:'1px solid #000000',
			margin:'3px',
			fontSize:'27',
			fontWeight:'bold'
		};
		const { getFieldProps } = this.props.form;
		return (
			<div>
				<div style={{ marginBottom:'20px'}}>
					<div style={{width: '25%', float: 'left',}}>
						<div style={infoStyle}>
							<p style={{ margin:'15px'}}> {this.state.orgName}</p>
							<p style={{ margin:'15px'}}>专员：<span style={{color:'#2B4DD5'}}><u>{this.state.salesName}</u></span></p>
							<p style={{ margin:'15px'}}>电话：<span style={{color:'#2B4DD5'}}><u>{this.state.telphone}</u></span></p>
						</div>
					</div>
					<div style={{width: '75%', float: 'left',}}>
						<div style={payStyle}>
							<p style={{ textAlign:'center', marginTop:'20px'}}>本系统从{this.state.createdAt} 为您开始服务,截止目前:</p>
							<p style={{ marginLeft:'15px', marginTop:'20px'}}>
								<div style={{width: '50%', float: 'left',}}>
									<div style={{ marginLeft:'15px'}}>
										代发总数：<span style={spanStyle}>{this.state.totAmt}</span>元
									</div>
								</div>
								<div style={{width: '25%', float: 'left',}}><span style={spanStyle}>{this.state.totCnt}</span>批次</div>
								<div style={{width: '25%', float: 'left',}}><span style={spanStyle}>{this.state.totPerCnt}</span>人次</div>
							</p>
						</div>
					</div>
				</div>
				<div>
					<div style={{textAlign:'center', width: '17%', float: 'left', marginTop:'20px'}}>
						<Button status="primary" onClick={this.upLoadPayList.bind(this)}>导入代发明细文件</Button>
					</div>
					<div style={{textAlign:'center', width: '17%', float: 'left', marginTop:'20px'}}>
						<Button status="primary" onClick={this.upLoadStubList.bind(this)}>导入工资明细文件</Button>
					</div>
					<div style={{textAlign:'center', width: '17%', float: 'left', marginTop:'20px'}}>
						<Button status="primary" onClick={this.upLoadPerTemp.bind(this)}>导入人员文件</Button>
					</div>
					<div style={{textAlign:'center', width: '17%', float: 'left', marginTop:'20px'}}>
						<Button status="primary" onClick={this.upLoadPayTemp.bind(this)}>下载代发导入文件模板</Button>
					</div>
					<div style={{textAlign:'center', width: '17%', float: 'left', marginTop:'20px'}}>
						<Button status="primary" onClick={this.upLoadStubTemp.bind(this)}>下载工资导入文件模板</Button>
						<Modal title="下载工资导入文件模板" visible={this.state.upLoadStubTemp}
							   wrapClassName="vertical-center-modal"
							   onCancel={this.handleCancel.bind(this)} onOk={this.handleOk.bind(this)}>
							<Row type='flex' justify='center' align='center'>
								<Form inline>
									<FormItem label="模板"  style={{ marginTop: 10 }} required>
										<Select style={{ width: 130 }}  {...getFieldProps('templateId',{initialValue: this.state.selectDefaultOpts})}>
											{this.state.selectOpts}
										</Select>
									</FormItem>
								</Form>
							</Row>
						</Modal>
					</div>
				</div>
				<div>
					<div style={{width: '50%', float: 'left',}}>
						<Card title='公告' extra={<a href="#">More</a>} style={{ width: 300, margin:'20px'}}>
							<Collapse>
								<Panel header='公告标题1' key = '1'>
									<p>公告内容1</p>
								</Panel>	
							</Collapse>
						</Card>
					</div>
					<div style={{width: '50%', float: 'left',}}>
						<Card title='消息' extra={<a href="#">More</a>} style={{ width: 300, margin:'20px' }}>
							<Collapse>
								<Panel header='消息标题1' key = '1'>
									<p>消息内容1</p>
								</Panel>	
							</Collapse>
						</Card>
					</div>
				</div>
				<div style={{ width: '50%', float: 'left',}}>
					<BarCharts id='year' style={{ margin:'20px', height:'400px'}} 
								title={this.state.optionYear.title}
								xAxis={this.state.optionYear.xAxis} 
								yAxis={this.state.optionYear.yAxis}
								legend={this.state.optionYear.legend}
								series={this.state.optionYear.series}
					></BarCharts>
				</div>
				<div style={{ width: '50%', float: 'left',}}>
					<BarCharts id='hfYear' style={{ margin:'20px', height:'400px'}} 
								title={this.state.optionHfYear.title}
								xAxis={this.state.optionHfYear.xAxis} 
								yAxis={this.state.optionHfYear.yAxis}
								legend={this.state.optionHfYear.legend}
								series={this.state.optionHfYear.series}
					></BarCharts>
				</div>
				<div style={{ width: '50%', float: 'left',}}>
					<BarCharts id='quarter' style={{ margin:'20px', height:'400px'}} 
								title={this.state.optionQuarter.title}
								xAxis={this.state.optionQuarter.xAxis} 
								yAxis={this.state.optionQuarter.yAxis}
								legend={this.state.optionQuarter.legend}
								series={this.state.optionQuarter.series}
					></BarCharts>
				</div>
			</div>

    );
  }
}

IndexList = Form.create()(IndexList);

module.exports = IndexList;
