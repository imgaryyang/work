import React, { Component } from 'react';
import { connect } from 'dva';
import { Card, Row, Col } from 'antd';

import ReactEchartsCore from 'echarts-for-react/lib/core';
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/bar';
import 'echarts/lib/component/legend';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/toolbox';

// import CompanySearchInput from '../../components/searchInput/CompanySearchInput';

import icon from '../../assets/image/icons/base-64.png';

class BaseHome extends Component {

  constructor() {
    super();
    this.getOptOption = this.getOptOption.bind(this);
    this.getFinanceOption = this.getFinanceOption.bind(this);
  }

  getOptOption() {
    const option = {
      tooltip : {
        trigger: 'axis'
      },
      legend: {
        data:['运营医院数量', '员工总数量']
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
          boundaryGap : [0, 1],
        }
      ],
      yAxis : [
        {
          type : 'category',
          data: ['员工总数量', '运营医院数量'],
        }
      ],
      series : [
        {
          name:'总数量',
          type:'bar',
          label: {
            normal: {
              show: true,
              position: 'right'
            }
          },
          areaStyle: {normal: {}},
          data:[36, 4]
        },
      ]
    };
    return option;
  }

  getFinanceOption() {
    const option = {
      tooltip : {
        trigger: 'axis'
      },
      legend: {
        data:['挂号收入', '药品收入', '治疗收入', '其它收入']
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
          name:'挂号收入',
          stack: '收入',
          type:'bar',
          /*label: {
            normal: {
              show: true,
              position: 'inside'
            }
          },*/
          areaStyle: {normal: {}},
          data:[500, 505, 400, 600, 690, 750, 1200, 0, 0, 0, 0, 0]
        },
        {
          name:'药品收入',
          stack: '收入',
          type:'bar',
          /*label: {
            normal: {
              show: true,
              position: 'inside'
            }
          },*/
          areaStyle: {normal: {}},
          data:[1240, 1500, 1666, 2300, 3000, 4500, 6800, 0, 0, 0, 0, 0]
        },
        {
          name:'治疗收入',
          stack: '收入',
          type:'bar',
          /*label: {
            normal: {
              show: true,
              position: 'inside'
            }
          },*/
          areaStyle: {normal: {}},
          data:[6700, 7800, 8590, 12000, 13000, 16900, 24000, 0, 0, 0, 0, 0]
        },
        {
          name:'其它收入',
          stack: '收入',
          type:'bar',
          /*label: {
            normal: {
              show: true,
              position: 'inside'
            }
          },*/
          areaStyle: {normal: {}},
          data:[200, 333, 450, 670, 1300, 2400, 2200, 0, 0, 0, 0, 0]
        },
      ]
    };
    return option;
  }
  render() {
    const { wsHeight } = this.props.base;
    return (
      <div style={{ height: `${wsHeight}px` }} className="home-div" >
        {/* <CompanySearchInput onSelect={item => console.log(item)} />*/}
        <div style={{ backgroundImage: `url(${icon})` }} >
          <span>请选择需要的操作</span>
        </div>
        {/* <Row>
          <Col span={12} style={{ paddingRight: '10px' }} >
            <Card title="基础运营信息" className="home-chart-card" >
              <ReactEchartsCore
                echarts={echarts}
                option={this.getOptOption()}
                notMerge={true}
                lazyUpdate={true}
                theme={"theme_name"}
                // onChartReady={this.onChartReadyCallback}
                // onEvents={EventsDict}
              />
            </Card>
          </Col>
          <Col span={12} style={{ paddingLeft: '10px' }} >
            <Card title="财务信息" className="home-chart-card" >
              <ReactEchartsCore
                echarts={echarts}
                option={this.getFinanceOption()}
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
)(BaseHome);
