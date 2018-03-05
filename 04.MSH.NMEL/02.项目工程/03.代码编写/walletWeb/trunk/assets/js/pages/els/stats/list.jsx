'use strict';

import { Component } from 'react';
import ReactDOM from 'react-dom';
import { Row, Col, DatePicker, Select } from 'antd';
const MonthPicker = DatePicker.MonthPicker;

class StatsCharts extends Component{
	constructor (props) {
		super(props);

		this.state = {
			myChart : null,
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
class StatsList extends Component {
	constructor (props) {
		super(props);

		let optionYear = {
			title:{
				text:'年度'
			},
			xAxis:[{
				type:'category',
				data:[]
			}],
			yAxis:[{
				type: 'value', name: '(元)', splitNumber: splitNum, minInterval: 1, max: splitNum,
			},{
				type: 'value', name: '(人)', splitNumber: splitNum, minInterval: 1, max: splitNum, splitLine: {show: false}
			}],
			legend:{
				data:['金额','人数']
			},
			color:['#c23531','#A4E49B'],
			series :[{
						name:'金额',
						type:'bar',
						yAxisIndex:0,
						data:[],
					 	label:{
					 		normal:{
					 			show:true,
					 			position:'insideTop'
					 		}
					 	},
					 	itemStyle:{
					 		normal:{
					 			color:'#688FD3'
					 		}
					 	}
					},
					{
						name:'人数',
						type:'bar',
						yAxisIndex:1,
						data:[],
						label:{
					 		normal:{
					 			show:true,
					 			position:'insideTop'
					 		}
					 	},
						itemStyle:{
					 		normal:{
					 			color:'#A4E49B'
					 		}
					 	}

					}]
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
		
		let year = new Date().getFullYear();
		let children = [];
		for (let i = year; i >= 1970; i--) {
			children.push(<Select.Option key={i}>{i+''}</Select.Option>);
		}

		this.state = {
			optionYear : optionYear,
			optionHfYear : optionHfYear,
			optionQuarter : optionQuarter,
	    	startValue : year + '',
	    	endValue : year + '',
			yearOption: children,
    	};
	}

	componentWillMount() {
		let startValue = this.state.startValue;
		let endValue = this.state.endValue;

 		this.getYear( startValue, endValue );
		this.getHalfYear( startValue, endValue );
		this.getQuarter( startValue, endValue );
	}

	getYear( startYear, endYear ) {
		let data = {orgid:'4028b8815562d296015562d879fc000b'};
		data['startYear'] = startYear;
		data['endYear'] = endYear;

		let url = 'api/els/paybatch/yearstatistics?data='+ JSON.stringify(data);
		let fetch = Ajax.get( url, null, {catch: 3600});

		let optionYear = this.state.optionYear;
		let maxAmt = 0.00;
		let maxCount = 0;
		fetch.then( res=> {
			optionYear.xAxis[0].data = [];
			optionYear.series[0].data = [];
			optionYear.series[1].data = [];
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

	getHalfYear( startYear, endYear ) {
		let data = {};
		data['orgId'] = '4028b8815562d296015562d879fc000b';
		data['startYear'] = startYear;
		data['endYear'] = endYear;

		let url = 'api/els/paybatch/hfyearstatistics?data='+ JSON.stringify(data);
		let fetch = Ajax.get( url, null, {catch: 3600});

		let optionHfYear = this.state.optionHfYear;

		let maxAmt = 0.00;
		let maxCount = 0;
		fetch.then( res=> {
			optionHfYear.xAxis[0].data = [];
			optionHfYear.series[0].data = [];
			optionHfYear.series[1].data = [];
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

			this.setState({
				optionHfYear : optionHfYear
			});

			return res;
		});
	}

	getQuarter( startYear, endYear ) {
		let year = (new Date()).getFullYear();

		let data = {};
		data['orgId'] = '4028b8815562d296015562d879fc000b';
		data['startYear'] = startYear;
		data['endYear'] = endYear;
		let url = 'api/els/paybatch/quarterstatistics?data='+ JSON.stringify(data);
		let fetch = Ajax.get( url, null, {catch: 3600});

		let optionQuarter = this.state.optionQuarter;

		let maxAmt = 0.00;
		let maxCount = 0;
		fetch.then( res=> {
			optionQuarter.xAxis[0].data = [];
			optionQuarter.series[0].data = [];
			optionQuarter.series[1].data = [];
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

			this.setState({
				optionQuarter : optionQuarter
			});

			return res;
		});
	}

	onChange(field, value) {

		console.info('onChange:', field, value);
		this.setState({
			[field] : value
		});
	}

	onStartChange(value) {

		let startValue = value;
		let endValue = this.state.endValue;

 		this.getYear( startValue, endValue );
		this.getHalfYear( startValue, endValue );
		this.getQuarter( startValue, endValue );

		this.onChange('startValue', value);
	}

	onEndChange(value) {

		let startValue = this.state.startValue;
		let endValue =  value;

		this.getYear( startValue, endValue ); 
		this.getHalfYear( startValue, endValue );
		this.getQuarter( startValue, endValue );

		this.onChange('endValue', value);
	}

	render () { 
		return (
			<div>
				<Row>
					<Col span={8} offset={1}>
						<Select id = 'startYear'
								defaultValue='2016'
								style={{ width: 120 }}
								onChange={this.onStartChange.bind(this)} >
							{this.state.yearOption}
						</Select>
						<text style={{ marginLeft: 10, marginRight: 10, fontSize: 14, fontFamily: 'Meiryo'}}>~</text>
						<Select id = 'endYear'
								defaultValue='2016'
								style={{ width: 120 }}
								onChange={this.onEndChange.bind(this)} >
								{this.state.yearOption}
						</Select>
					</Col>
				</Row>
				<Row>
					<Col span={12}>
						<StatsCharts id='year' style={{ margin:'20px', height:'400px'}} 
									title={this.state.optionYear.title}
									xAxis={this.state.optionYear.xAxis} 
									yAxis={this.state.optionYear.yAxis}
									legend={this.state.optionYear.legend}
									series={this.state.optionYear.series}
						></StatsCharts>
					</Col>
					<Col span={12}>
						<StatsCharts id='hfYear' style={{ margin:'20px', height:'400px'}} 
									title={this.state.optionHfYear.title}
									xAxis={this.state.optionHfYear.xAxis} 
									yAxis={this.state.optionHfYear.yAxis}
									legend={this.state.optionHfYear.legend}
									series={this.state.optionHfYear.series}
						></StatsCharts>						
					</Col>
				</Row>
				<Row width={1/2}>
					<Col span={12}>
						<StatsCharts id='quarter' style={{ margin:'20px', height:'400px'}} 
									title={this.state.optionQuarter.title}
									xAxis={this.state.optionQuarter.xAxis} 
									yAxis={this.state.optionQuarter.yAxis}
									legend={this.state.optionQuarter.legend}
									series={this.state.optionQuarter.series}
						></StatsCharts>
					</Col>
				</Row>
			</div>

    );
  }
}

module.exports = StatsList;
