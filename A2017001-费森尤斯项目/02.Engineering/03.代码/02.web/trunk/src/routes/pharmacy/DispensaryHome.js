import React, { Component } from 'react';
import { connect } from 'dva';
import { Card, Row, Col } from 'antd';

import ReactEchartsCore from 'echarts-for-react/lib/core';
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/bar';
import 'echarts/lib/component/legend';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/toolbox';

import icon from '../../assets/image/icons/dispensary-64.png';

class DispensaryHome extends Component {

  constructor() {
    super();
    this.getWarningOption = this.getWarningOption.bind(this);
  }

  getWarningOption() {
    const option = {
      tooltip : {
        trigger: 'axis'
      },
      legend: {
        data:['库存预警', '效期预警', '滞留预警']
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
          data : ['库存预警', '效期预警', '滞留预警'],
        }
      ],
      series : [
        {
          name:'预警',
          // stack: '收入',
          type:'bar',
          label: {
            normal: {
              show: true,
              position: 'right'
            }
          },
          areaStyle: {normal: {}},
          data:[10, 1, 5]
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
            <Card title="预警统计" className="home-chart-card" >
              <ReactEchartsCore
                echarts={echarts}
                option={this.getWarningOption()}
                notMerge={true}
                lazyUpdate={true}
                theme={"theme_name"}
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
)(DispensaryHome);
