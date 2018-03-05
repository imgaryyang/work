import React, { PureComponent } from 'react';
import { Text } from 'react-native';
import geolib from 'geolib';
import PropTypes from 'prop-types';

const lengthUnit = {
  m: 1,
  km: 1000,
  米: 1,
  公里: 1000,
};

export default class Distance extends PureComponent {
  render() {
    // console.log(this.props);
    const {
      start, end, unit, precision,
    } = this.props;
    if (start.longitude === null || start.latitude === null || end.longitude === null || end.latitude === null) return null;
    let distance = geolib.getDistance(start, end);
    let u = null;
    let dividend = -1;
    if (unit !== null) {
      dividend = lengthUnit[`${unit}`];
      u = unit;
    }
    // 传入的单位不合法 或 没传单位 时按照默认规则处理
    if (dividend === -1) {
      // 小于1km显示为 xxx m
      if (distance < 1000) {
        u = '米';
      } else {
        u = '公里';
        distance = (distance / 1000).toFixed(precision);
      }
    } else {
      distance = (distance / dividend).toFixed(precision);
    }
    return (
      <Text>{`${distance}${u}`}</Text>
    );
  }
}

Distance.propTypes = {
  /**
   * 长度单位
   */
  unit: PropTypes.string,
  /**
   * 起点
   * {
   *  longitude: 经度
   *  latitude: 纬度
   * }
   */
  start: PropTypes.object,
  /**
   * 终点
   * {
   *  longitude: 经度
   *  latitude: 纬度
   * }
   */
  end: PropTypes.object,
  /**
   * 精度，默认保留到小数点后1位
   */
  precision: PropTypes.number,
};

Distance.defaultProps = {
  unit: null,
  start: {
    longitude: null,
    latitude: null,
  },
  end: {
    longitude: null,
    latitude: null,
  },
  precision: 1,
};
