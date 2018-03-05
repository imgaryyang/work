import React, { Component } from 'react';
import { connect } from 'dva';
import { Card, Row, Col } from 'antd';

import ReactEchartsCore from 'echarts-for-react/lib/core';
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/bar';
import 'echarts/lib/chart/pie';
import 'echarts/lib/chart/line';
import 'echarts/lib/component/legend';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/toolbox';

import icon from '../../assets/image/icons/odws-64.png';

class OdwsHome extends Component {

  constructor() {
    super();
    this.getSeeOption = this.getSeeOption.bind(this);
    this.getFeeOption = this.getFeeOption.bind(this);
    this.getDeptSeeOption = this.getDeptSeeOption.bind(this);
  }

  getSeeOption() {
    const option = {
      /*title: {
          text: '本科室接诊量'
      },*/
      tooltip : {
        trigger: 'axis'
      },
      legend: {
        orient: 'vertical',
        left: 'left',
        data:['待诊','已诊']
      },
      toolbox: {
        feature: {
          saveAsImage: {}
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      series : [
        {
          name: '接诊量',
          type: 'pie',
          radius : '55%',
          center: ['50%', '60%'],
          label: {
            normal: {
              show: true,
              position: 'outside'
            }
          },
          areaStyle: {normal: {}},
          data:[
            {name: '待诊', value: 12},
            {name: '已诊', value: 26},
          ],
        },
      ]
    };
    return option;
  }

  getFeeOption() {
    const option = {
      tooltip : {
        trigger: 'axis'
      },
      legend: {
        data:['西药处方', '中草药处方', '治疗处方']
      },
      toolbox: {
        feature: {
          saveAsImage: {}
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
          type : 'value',
          // data : [],
        }
      ],
      yAxis : [
        {
          type : 'category',
          data : ['西药处方', '中草药处方', '治疗处方'],
        }
      ],
      series : [
        {
          name:'收费',
          // stack: '收入',
          type:'bar',
          label: {
            normal: {
              show: true,
              position: 'right'
            }
          },
          areaStyle: {normal: {}},
          data:[680, 210, 3500]
        },
      ]
    };
    return option;
  }

  getDeptSeeOption() {
    const option = {
      /*title: {
          text: '本科室接诊量'
      },*/
      tooltip : {
        trigger: 'axis'
      },
      legend: {
        data:['自费','医保','农合']
      },
      toolbox: {
        feature: {
          saveAsImage: {}
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
          boundaryGap : false,
          data : ['周一','周二','周三','周四','周五','周六','周日']
        }
      ],
      yAxis : [
        {
          type : 'value'
        }
      ],
      series : [
        {
          name:'自费',
          type:'line',
          stack: '总量',
          areaStyle: {normal: {}},
          data:[120, 132, 101, 134, 90, 230, 210]
        },
        {
          name:'医保',
          type:'line',
          stack: '总量',
          areaStyle: {normal: {}},
          data:[220, 182, 191, 234, 290, 330, 310]
        },
        {
          name:'农合',
          type:'line',
          stack: '总量',
          areaStyle: {normal: {}},
          data:[150, 232, 201, 154, 190, 330, 410]
        }
      ]
    };
    return option;
  }

  render() {
    const { wsHeight } = this.props.base;
    return (
      <div style={{ height: `${wsHeight}px` }} className="home-div" >
        <div style={{ backgroundImage: `url(${icon})` }} >
          <span>请选择需要的操作</span>
        </div>
        {/* <Row>
          <Col span={12} style={{ paddingRight: '10px' }} >
            <Card title="接诊统计" className="home-chart-card" >
              <ReactEchartsCore
                echarts={echarts}
                option={this.getSeeOption()}
                notMerge={true}
                lazyUpdate={true}
                theme={"theme_name"}
                // onChartReady={this.onChartReadyCallback}
                // onEvents={EventsDict}
              />
            </Card>
          </Col>
          <Col span={12} style={{ paddingRight: '10px' }} >
            <Card title="接诊金额统计" className="home-chart-card" >
              <ReactEchartsCore
                echarts={echarts}
                option={this.getFeeOption()}
                notMerge={true}
                lazyUpdate={true}
                theme={"theme_name"}
                // onChartReady={this.onChartReadyCallback}
                // onEvents={EventsDict}
              />
            </Card>
          </Col>
        </Row>
        <Row style={{ marginTop: '10px' }} >
          <Col span={12} style={{ paddingRight: '10px' }} >
            <Card title="本科室接诊量" className="home-chart-card" >
              <ReactEchartsCore
                echarts={echarts}
                option={this.getDeptSeeOption()}
                notMerge={true}
                lazyUpdate={true}
                theme={"theme_name"}
                // onChartReady={this.onChartReadyCallback}
                // onEvents={EventsDict}
              />
            </Card>
          </Col>
        </Row>*/}
      </div>
    );
  }
}
export default connect(
  ({ base }) => ({ base }),
)(OdwsHome);
