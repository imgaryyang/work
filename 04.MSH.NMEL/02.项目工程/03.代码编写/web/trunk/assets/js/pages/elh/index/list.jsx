'use strict';

import { Component } from 'react';
import ReactDOM from 'react-dom';
import {Card, Collapse, Row, Col, Button } from 'antd';

const Panel = Collapse.Panel;

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

module.exports = class IndexList extends Component {
	constructor (props) {
		super(props);
console.info('-------------------------');
		let optionYear = {
			title:{
				text:'年度'
			},
			xAxis:[{type:'category',data:[]}],
			yAxis:[{type:'value',nameLocation:'start',name:'金额',nameGap:25}],
			legend:{data:['金额']},
			color:['#c23531'],
			series :[{
						name:'金额',type:'bar',yAxisIndex:0,data:[],
					 	label:{normal:{show:true,position:'insideTop'}},
					 	itemStyle:{normal:{color:'#688FD3'}}
					}]
		};

		let optionHfYear = {
			title:{text:'半年度'},
			xAxis:[{type:'category',data:[]}],
			yAxis:[{type:'value',nameLocation:'start',name:'金额',nameGap:25},
				   {type:'value',nameLocation:'start',name:'人数',nameGap:25}],
			legend:{data:['金额','人数']},
			series:[{name:'金额',type:'bar',yAxisIndex:0,data:[]},
					{name:'人数',type:'bar',yAxisIndex:1,data:[]}]
		};

		let optionQuarter = {
			title:{text:'季度'},
			xAxis:[{type:'category',data:[]}],
			yAxis:[{type:'value',nameLocation:'start',name:'金额',nameGap:25},
				   {type:'value',nameLocation:'start',name:'人数',nameGap:25}],
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
	        imgUrl:'',
	        allAmount:'',
	        cash:'',
	        reimburse:'',
	        perCount:'',
	        regstCount:''
    	};
	}

	componentWillMount() {
		console.info('---------==============----------------');
		this.getOrgInfo();
		this.getBatch();
		this.getYear(); 
		this.getHalfYear();
		this.getQuarter();
	}

	getYear() {
		let data = '4028b8815562d296015562d879fc000b';
		let startDate = '2016-01';
		let endDate = '2016-09';
		let url = 'api/elh/statistics/month/amount?hospId='+ data+'&startDate=' + startDate + '&endDate=' + endDate ;
		let fetch = Ajax.get( url, null, {catch: 3600});

		let optionYear = this.state.optionYear;
		fetch.then( res=> {
			if ( res == null ) return;
			res.result.map(function(item){
				optionYear.xAxis[0].data.push(item.date);
				optionYear.series[0].data.push(parseFloat(item.allAmount).toFixed(2));
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
		data['orgId'] = '4028b8815562d296015562d879fc000b';
		data['startYear'] = year - 2 + '';
		data['endYear'] = year + '';

		let url = 'api/els/paybatch/hfyearstatistics?data='+ JSON.stringify(data);

		console.info('-----------------getHalfYear:' , url);

		let fetch = Ajax.get( url, null, {catch: 3600});

		let optionHfYear = this.state.optionHfYear;

		fetch.then( res=> {
			if ( res == null ) return;
			res.result.map(function(item){
				optionHfYear.xAxis[0].data.push(item.hfyear);
				optionHfYear.series[0].data.push(parseFloat(item.allamount).toFixed(2));
				optionHfYear.series[1].data.push(parseInt(item.allcnt));
				return item;
			})

			this.setState({
				optionHfYear : optionHfYear
			});

			return res;
		});
	}

	getQuarter() {
		let year = (new Date()).getFullYear();

		let data = {};
		data['orgId'] = '4028b8815562d296015562d879fc000b';
		data['startYear'] = year - 2 + '';
		data['endYear'] = year + '';
		let url = 'api/els/paybatch/quarterstatistics?data='+ JSON.stringify(data);

		console.info('-----------------getQuarter:' , url);

		let fetch = Ajax.get( url, null, {catch: 3600});

		let optionQuarter = this.state.optionQuarter;

		fetch.then( res=> {
			if ( res == null ) return;
			res.result.map(function(item){
				optionQuarter.xAxis[0].data.push(item.quarter);
				optionQuarter.series[0].data.push(parseFloat(item.allamount).toFixed(2));
				optionQuarter.series[1].data.push(parseInt(item.allcnt));
				return item;
			})

			this.setState({
				optionQuarter : optionQuarter
			});

			return res;
		});
	}

	getOrgInfo(){
		let orgid = '8a8c7d9b55298217015529a9844e0000';
		let url = 'api/elh/hospital/org/'+ orgid;
		let fetch = Ajax.get( url, null, {catch: 3600});

		fetch.then( res=> {
			if ( res == null ) return;
			this.setState({ 
				orgName:res.result.name,
		        salesName:res.result.elhOrg.salesman,
		        telphone:res.result.elhOrg.lmContactWay,
		        createdAt:res.result.elhOrg.createdAt,
		        imgUrl:"/api/el/base/images/view/"+res.result.elhOrg.logo,
		    });
			return res;
		});
	}

	getBatch() {
		let data = {orgid:'8a8c7d9b55298217015529a9844e0000'};
		let url = 'api/elh/statistics/multiple?hospId='+ data;
		let fetch = Ajax.get( url, null, {catch: 3600});

		fetch.then( res=> {
			if ( res == null ) return;
			this.setState({ 
				allAmount:res.result.allAmount,
		        cash:res.result.cash,
		        reimburse:res.result.reimburse,
		        perCount:res.result.perCount,
		        regstCount:res.result.regstCount
		    });
			return res;
		});
	}

	upLoadPayList() {
		console.info('---------------upLoadPayList--------------');
		if(this.props.upLoadPayList){
			this.props.upLoadPayList(arguments);
		}
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
			 marginTop:'20px',
			marginRight:'20px',
			marginLeft:'10px'
		};
		var payStyle1 = {
				color:'#000000',
				border:'1px solid #FFDEAD',
				height:'130px',
			};
		var test = {
			textAlign:'center',
			// border:'1px solid #000000'
		};
		var spanStyle={
			color:'#FF0000',
			// border:'1px solid #000000',
			margin:'3px',
			fontSize:'17',
			fontWeight:'bold'
		};
		var spanStyle1={
				color:'#FF0000',
				// border:'1px solid #000000',
				margin:'3px',
				fontSize:'27',
				fontWeight:'bold'
			};
		console.info('---------------render--------------');

		return (
			<div>
				<div style={payStyle}>
					<div style={{width: '25%', float: 'left',textAlign:'center'}}>
						<img style={{height:"60px",width:"60px",marginTop:'20px'}} src={this.state.imgUrl} />
						<p style={{ textAlign:'center',}}>{this.state.orgName}</p>
					</div>
					<div style={{width: '75%', float: 'left',}}>
						<p style={{ textAlign:'center', marginTop:'20px'}}>本系统从{this.state.createdAt} 为您开始服务,截止目前:</p>
						<p style={{ marginLeft:'15px', marginTop:'10px'}}>
							<div style={{width: '50%', float: 'left',}}>
								<div style={{ marginLeft:'15px',marginTop:'15px'}}>
									注册总用户数：<span style={spanStyle1}>{this.state.regstCount}</span>
								</div>
							</div>
							<div style={{width: '25%', float: 'left',}}>
								<div>
									结算金额<span style={spanStyle}>{this.state.allAmount}</span>元
								</div>
								<div>
									报销<span style={spanStyle}>{this.state.reimburse}</span>元
								</div>
								<div>
									自费<span style={spanStyle}>{this.state.cash}</span>元
								</div>
							</div>
							<div style={{width: '25%', float: 'left',marginTop:'15px'}}>结算总人次<span style={spanStyle1}>{this.state.perCount}</span></div>
						</p>
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
				<p>业务跟踪（自动刷新/3s）</p>
				<div style={payStyle1}>
					<p>业务跟踪标题1:业务跟踪内容1</p>
					<p>业务跟踪标题1:业务跟踪内容2</p>
					<p>业务跟踪标题1:业务跟踪内容3</p>
					<p>业务跟踪标题1:业务跟踪内容4</p>
				</div>
			</div>

    );
  }
}
