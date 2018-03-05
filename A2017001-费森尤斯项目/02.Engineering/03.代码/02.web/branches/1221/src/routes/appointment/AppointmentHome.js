import React, { Component } from 'react';
import { connect } from 'dva';
import { Card, Row, Col } from 'antd';

import ReactEchartsCore from 'echarts-for-react/lib/core';
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/bar';
import 'echarts/lib/component/legend';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/toolbox';

import icon from '../../assets/image/icons/register-64.png';

class AppiontmentHome extends Component {

  constructor() {
    super();
    this.getAppointmentOption = this.getAppointmentOption.bind(this);
  }

  getAppointmentOption() {
    const option = {
      tooltip : {
        trigger: 'axis'
      },
      legend: {
        data:['挂号数量', '挂号收入']
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
          name:'挂号数量',
          type:'bar',
          label: {
            normal: {
              show: true,
              position: 'top'
            }
          },
          areaStyle: {normal: {}},
          data:[9, 29, 120, 110, 98, 118, 100, 0, 0, 0, 0, 0]
        },
        {
          name:'挂号收入',
          type:'bar',
          label: {
            normal: {
              show: true,
              position: 'top'
            }
          },
          areaStyle: {normal: {}},
          data:[31.5, 101.5, 420, 385, 343, 413, 350, 0, 0, 0, 0, 0]
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
            <Card title="预约挂号统计" className="home-chart-card" >
              <ReactEchartsCore
                echarts={echarts}
                option={this.getAppointmentOption()}
                notMerge={true}
                lazyUpdate={true}
                theme={"theme_name"}
                // onChartReady={this.onChartReadyCallback}
                // onEvents={EventsDict}
              />
            </Card>
          </Col>
        </Row> */}
      </div>
    );
  }
}
export default connect(
  ({ base }) => ({ base }),
)(AppiontmentHome);
