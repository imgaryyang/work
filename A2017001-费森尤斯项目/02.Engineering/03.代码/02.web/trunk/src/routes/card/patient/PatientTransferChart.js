import React, { Component } from 'react';
import { connect } from 'dva';
import { Card } from 'antd';
import moment from 'moment';

import ReactEchartsCore from 'echarts-for-react/lib/core';
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/bar';
import 'echarts/lib/component/legend';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/toolbox';

// import icon from '../../assets/image/icons/register-64.png';

class PatientTransferChart extends Component {

  constructor() {
    super();
    this.getAppointmentOption = this.getAppointmentOption.bind(this);
  }
  getAppointmentOption( e ){
    const option = {
      tooltip: {
        trigger: 'axis',
      },
      legend: {
        data: ['患者转入', '患者转出'],
      },
      toolbox: {
        feature: {
          saveAsImage: {},
        },
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true,
      },
      xAxis: [
        {
          type: 'category',
           data: e[0],
          // data : ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
        },
      ],
      yAxis: [
        {
          type: 'value',
        },
      ],
      series: [
        {
          name: '患者转入',
          type: 'bar',
          label: {
            normal: {
              show: true,
              position: 'top',
            }
          },
          areaStyle: { normal: {} },
          data: e[1],
        },
        {
          name: '患者转出',
          type: 'bar',
          label: {
            normal: {
              show: true,
              position: 'top',
            },
          },
          areaStyle: { normal: {} },
          data: e[2],
        },
      ],
    };
    return option;
  }

  render() {
    const { wsHeight } = this.props.base;
    const { patientTransChartData } = this.props.patienttransfer;
    return (
      <div style={{ height: `${wsHeight}px` }} >
              <ReactEchartsCore
                echarts={echarts}
                option={this.getAppointmentOption(patientTransChartData)}
                notMerge={true}
                lazyUpdate={true}
                theme={"theme_name"}
                // onChartReady={this.onChartReadyCallback}
                // onEvents={EventsDict}
              />
      </div>
    );
  }
}
export default connect(
  ({ patienttransfer, base }) => ({ patienttransfer, base }),
)(PatientTransferChart);
