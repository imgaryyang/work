import React, { Component } from 'react';
import { connect } from 'dva';
import { Card, Row, Col } from 'antd';

import ReactEchartsCore from 'echarts-for-react/lib/core';
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/line';
import 'echarts/lib/component/legend';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/toolbox';

import icon from '../../assets/image/icons/card-64.png';

class CardHome extends Component {

  constructor() {
    super();
    this.getPatientOption = this.getPatientOption.bind(this);
  }

  getPatientOption() {
    const option = {
      tooltip : {
        trigger: 'axis'
      },
      /*legend: {
        data:['', '', '', '']
      },*/
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
          name:'新增患者',
          type:'line',
          label: {
            normal: {
              show: true,
              position: 'top'
            }
          },
          areaStyle: {normal: {}},
          data:[9, 29, 300, 280, 220, 300, 129, 0, 0, 0, 0, 0]
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
        {/*<Row>
          <Col span={12} style={{ paddingRight: '10px' }} >
            <Card title="新增患者统计" className="home-chart-card" >
              <ReactEchartsCore
                echarts={echarts}
                option={this.getPatientOption()}
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
)(CardHome);
