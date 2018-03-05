import React, { Component } from 'react';
import { connect } from 'dva';
import { Card, Row, Col } from 'antd';

import ReactEchartsCore from 'echarts-for-react/lib/core';
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/bar';
import 'echarts/lib/component/legend';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/toolbox';

import icon from '../../assets/image/icons/charge-64.png';

class ChargeHome extends Component {

  constructor() {
    super();
    this.getChargeOption = this.getChargeOption.bind(this);
  }

  getChargeOption() {
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
          data:[1200, 134, 9876]
        },
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
            <Card title="今日收费统计" className="home-chart-card" >
              <ReactEchartsCore
                echarts={echarts}
                option={this.getChargeOption()}
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
)(ChargeHome);
