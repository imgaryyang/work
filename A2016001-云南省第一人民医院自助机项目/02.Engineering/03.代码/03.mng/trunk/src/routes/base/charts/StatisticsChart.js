import React, { Component } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Card, Row, Col, DatePicker } from 'antd';
const {MonthPicker, RangePicker } = DatePicker;

import ReactEchartsCore from 'echarts-for-react/lib/core';
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/bar';
import 'echarts/lib/component/legend';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/toolbox';
import 'echarts/lib/chart/pie';

class StatisticsChart extends Component {

	  constructor(props) {
	    super(props);
	    this.onSelectDate = this.onSelectDate.bind(this);
	    this.getIssuCardOption = this.getIssuCardOption.bind(this);
	    this.getDepositAcountOption = this.getDepositAcountOption.bind(this);
	    this.getTroubleOption = this.getTroubleOption.bind(this);
	    this.getPayFeeOption = this.getPayFeeOption.bind(this);
	  }
	  componentWillMount() {
		  this.props.dispatch({
		      type: 'chartManage/loadCardCount',
		  });
		  this.props.dispatch({
		      type: 'chartManage/loadDepositAcount',
		      payload: '1',
		  });
		  this.props.dispatch({
		      type: 'chartManage/loadPayFeeAcount',
		  });
	  }
	  onSelectDate(value, date){
		  this.props.dispatch({
		      type: 'chartManage/loadDepositAcount',
		      payload: date,
		  });
	  }
	  getIssuCardOption(issuCardCount) {
	    const option = {
	      tooltip : {
	        trigger: 'axis'
	      },
	      legend: {
	        data:['办卡', '补卡' ]
	      },
	      toolbox: {
	        feature: {
	          saveAsImage: {},
	          dataView: {},
	        }
	      },
	      grid: {
	        left: '3%',
	        right: '4%',
	        bottom: '3%',
	        containLabel: true
	      },
	      xAxis : [
	        {
	          type : 'category', 
	          data : ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
	        }
	      ],
	      yAxis : [
	        {
	          type : 'value',
	        }
	      ],
	      series : [
	        {
	          name:'办卡',
	          stack: '发卡量',
	          type:'bar',
	          areaStyle: {normal: {}},
	          data:issuCardCount.issue,
	        },
	        {
	          name:'补卡',
	          stack: '发卡量',
	          type:'bar',
	          areaStyle: {normal: {}},
	          data:issuCardCount.reissue,
	        },
	      ]
	    };
	    return option;
	  }

	  getDepositAcountOption(depositAcount) {
		  const option = {
				    title : {
				        text: '预存信息',
				        x:'center'
				    },
				    tooltip : {
				        trigger: 'item',
				        formatter: "{a} <br/>{b} : {c} ({d}%)"
				    },
				    toolbox: {
				        feature: {
				          saveAsImage: {},
				          dataView: {}
				        }
				      },
				    legend: {
				        orient: 'vertical',
				        left: 'left',
				        data: ['现金','微信','支付宝','银行卡']
				    },
				    series : [
				        {
				            name: '笔数统计',
				            type: 'pie',
				            radius : '55%',
				            center: ['50%', '60%'],
				            data:[
				                {value:depositAcount.cash, name:'现金'},
				                {value:depositAcount.weChat, name:'微信'},
				                {value:depositAcount.alipay, name:'支付宝'},
				                {value:depositAcount.bankCard, name:'银行卡'},
				            ],
				            itemStyle: {
				                emphasis: {
				                    shadowBlur: 10,
				                    shadowOffsetX: 0,
				                    shadowColor: 'rgba(0, 0, 0, 0.5)'
				                }
				            }
				        }
				    ]
				};
		  	return option;
	  }
	  getTroubleOption(troubleCount){
		  const option = {
				  
		  };
		  return option;
	  }
	  getPayFeeOption(payFeeAcount){
		  const option = {
				  tooltip : {
				        trigger: 'axis'
				      },
				      legend: {
				        data:['医保', '自费' ]
				      },
				      toolbox: {
				        feature: {
				          saveAsImage: {},
				          dataView: {},
				        }
				      },
				      grid: {
				        left: '3%',
				        right: '4%',
				        bottom: '3%',
				        containLabel: true
				      },
				      xAxis : [
				        {
				          type : 'category', 
				          data : ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
				        }
				      ],
				      yAxis : [
				        {
				          type : 'value',
				        }
				      ],
				      series : [
				        {
				          name:'医保',
				          stack: '医保报销',
				          type:'bar',
				          areaStyle: {normal: {}},
				          data:payFeeAcount.miamt,
				        },
				        {
				          name:'自费',
				          stack: '自费金额',
				          type:'bar',
				          areaStyle: {normal: {}},
				          data:payFeeAcount.selfamt,
				        },
				      ]  
		  };
		  return option;
	  }
	  render() {
		const { issuCardCount, depositAcount, troubleCount, payFeeAcount } = this.props.chartManage;
		const date = new Date();
		const month = date.getMonth()+1;
		const year = date.getFullYear();
		const dateString = year+'-'+month;
	    return (
	      <div>
	        {<Row>
	          <Col span={12} style={{ paddingLeft: '10px' }} >
	            <Card title="办卡汇总" className="home-chart-card" >
	              <ReactEchartsCore
	                echarts={echarts}
	                option={this.getIssuCardOption(issuCardCount)}
	                notMerge={true}
	                lazyUpdate={true}
	                theme={"theme_name"}
	              />
	            </Card>
	          </Col>
	          <Col span={12} style={{ paddingLeft: '10px' }} >
	            <Card title="预存笔数统计" className="home-chart-card" >
	            	<MonthPicker onChange={this.onSelectDate} defaultValue={moment(dateString,'YYYY-MM')}/>	
	            	<ReactEchartsCore
		                echarts={echarts}
		                option={this.getDepositAcountOption(depositAcount)}
		                theme={"theme_name"}
		              />
	            </Card>
	          </Col>
	        </Row>}
	        {<Row>
	          <Col span={12} style={{ paddingLeft: '10px' }} >
	            <Card title="故障率统计" className="home-chart-card" >
	              <ReactEchartsCore
	                echarts={echarts}
	                option={this.getTroubleOption(troubleCount)}
	                notMerge={true}
	                lazyUpdate={true}
	                theme={"theme_name"}
	              />
	            </Card>
	          </Col>
	          <Col span={12} style={{ paddingLeft: '10px' }} >
	            <Card title="缴费统计" className="home-chart-card" >
	              <ReactEchartsCore
	                echarts={echarts}
	              	notMerge={true}
	                lazyUpdate={true}
	                option={this.getPayFeeOption(payFeeAcount)}
	                theme={"theme_name"}
	              />
	            </Card>
	          </Col>
	        </Row>}
	      </div>
	    );
	  }
	}
export default connect(({chartManage})=>({chartManage}))(StatisticsChart);