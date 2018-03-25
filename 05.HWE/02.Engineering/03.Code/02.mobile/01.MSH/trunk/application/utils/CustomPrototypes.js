/**
 * 客户化的prototype
 */
import React, { Component } from 'react';
import {
  TouchableOpacity,
  View,
  Text,
  ActivityIndicator,
} from 'react-native';

import EasyIcon from 'rn-easy-icon';
import EasyCard from 'rn-easy-card';
import Toast from 'react-native-root-toast';

import Global from '../Global';
import { handleRequestException } from './Request';

class CustomPrototypes extends Object {
  static description = 'global variables & functions';
}

CustomPrototypes.init = () => {
  /**
   * 处理request异常
   */
  Object.defineProperty(Component.prototype, 'handleRequestException', {
    value(e) {
      return handleRequestException(e);
    },
    enumerable: false,
  });

  /**
   * 显示载入遮罩
   */
  Object.defineProperty(Component.prototype, 'showLoading', {
    value(e) {
      return handleRequestException(e);
    },
    enumerable: false,
  });

  /**
   * 显示无限加载视图
   */
  Object.defineProperty(Component.prototype, 'renderFooter', {
    value({
      msg, callback, style, data, ctrlState, showTopLine,
    }) {
      const topLine = showTopLine === false ? null : (<View
        style={{
          width: Global.getScreen().width, height: 1 / Global.pixelRatio, backgroundColor: Global.colors.LINE, marginBottom: 20,
        }}
      />);
      // console.log('>>>> topLine:', showTopLine, topLine);
      if (ctrlState.infiniteLoading) {
        return (
          <View style={[{ alignItems: 'center', justifyContent: 'flex-start', height: 90 }, style]}>
            {topLine}
            <ActivityIndicator />
            <Text style={{ color: 'rgba(187,187,187,1)', textAlign: 'center', lineHeight: 40 }}>{msg || '正在载入更多信息...'}</Text>
          </View>
        );
      } else if (data.length !== 0 && ctrlState.requestErr) {
        return (
          <View style={[{ alignItems: 'center', justifyContent: 'flex-start', height: 90 }, style]}>
            {topLine}
            <TouchableOpacity
              style={{ alignItems: 'center', justifyContent: 'center' }}
              onPress={() => {
                if (typeof callback === 'function') {
                  callback();
                }
              }}
            >
              <EasyIcon name="ios-refresh-outline" color="rgba(187,187,187,1)" size={35} width={35} height={35} />
              <Text style={{ color: 'rgba(187,187,187,1)', textAlign: 'center' }}>
                {`${ctrlState.requestErrMsg ? (ctrlState.requestErrMsg.msg || '处理请求出错') : '处理请求出错'}，点击刷新按钮重新查询`}
              </Text>
            </TouchableOpacity>
          </View>
        );
      } else if (data.length !== 0 && ctrlState.noMoreData) {
        return (
          <View style={[{ alignItems: 'center', justifyContent: 'flex-start', height: 70 }, style]}>
            {topLine}
            <Text
              style={{
                color: Global.colors.FONT_LIGHT_GRAY1,
                fontSize: 13,
                flex: 1,
              }}
            >
              所有数据加载完成
            </Text>
          </View>
        );
      } else {
        return null;
      }
    },
    enumerable: false,
  });

  /**
   * 显示list空数据提示信息
   */
  Object.defineProperty(Component.prototype, 'renderEmptyView', {
    /**
     * 显示list空数据提示信息
     * @param  {[string]}  options.msg            [提示信息]
     * @param  {[string]}  options.reloadMsg      [重新加载提示信息]
     * @param  {[function]} options.reloadCallback [重新加载回调函数]
     * @param  {[elements]} options.buttons        [额外显示的按钮]
     * @param  {[object]}  options.style          [容器扩展样式]
     * @return {[elements]}                        [提示信息视图]
     */
    value({
      msg, reloadMsg, reloadCallback, buttons, style, ctrlState, data, showActivityIndicator,
    }) {
      if (ctrlState.refreshing) {
        return (
          <View
            style={[Global.styles.CENTER, Global.os === 'android' ?
              { height: 100, paddingTop: 70 } :
              showActivityIndicator === true ? { height: 80 } : { height: 40 }]}
          >
            { showActivityIndicator === true ? <ActivityIndicator style={{ marginBottom: 15 }} /> : null }
            <Text>正在加载数据，请稍候...</Text>
          </View>
        );
      }
      // console.log(data);
      // 满足显示空数据提示信息条件
      if (data && data.length !== 0) return null;

      let msgText = ctrlState.requestErr ? (ctrlState.requestErrMsg ? (ctrlState.requestErrMsg.msg || '处理请求出错') : '处理请求出错') : (msg || '暂无相关数据');
      if (typeof reloadCallback === 'function') {
        msgText += `，${reloadMsg || '点击刷新按钮重新查询'}`;
      }

      let content = null;
      if (typeof reloadCallback === 'function') {
        content = (
          <TouchableOpacity
            style={{ alignItems: 'center', justifyContent: 'center', padding: 15 }}
            onPress={() => {
              reloadCallback();
            }}
          >
            <EasyIcon name="ios-refresh-outline" color="rgba(187,187,187,1)" size={35} width={40} height={40} />
            <Text style={{ color: 'rgba(187,187,187,1)', textAlign: 'center' }}>{msgText}</Text>
          </TouchableOpacity>
        );
      } else {
        content = (
          <View style={{ alignItems: 'center', justifyContent: 'center', padding: 15 }}>
            <Text style={{ color: 'rgba(187,187,187,1)', textAlign: 'center' }}>{msgText}</Text>
          </View>
        );
      }

      return (
        <EasyCard
          radius={0}
          fullWidth
          style={[{
            // marginTop: 15,
          }, style]}
        >
          {content}
          {buttons}
        </EasyCard>
      );
    },
    enumerable: false,
  });

  /**
   * 取地理位置信息
   */
  Object.defineProperty(Component.prototype, 'getCurrentLocation', {
    value(callback, compCallBack) {
      try {
        // console.log('in getCurrentLocation......');
        // 获取当前位置
        navigator.geolocation.getCurrentPosition(
          (position) => {
            // console.log(position);
            const p = {
              longitude: position.coords.longitude,
              latitude: position.coords.latitude,
            };
            if (typeof callback === 'function') callback(p, position);
            if (typeof compCallBack === 'function') compCallBack(p, position);
          },
          (error) => {
            console.log('error in getCurrentLocation():', error);
            Toast.show('无法获取您的当前位置');
            const p = {
              longitude: null,
              latitude: null,
            };
            if (typeof callback === 'function') callback(p, null);
            if (typeof compCallBack === 'function') compCallBack(p, null);
          },
          // { enableHighAccuracy: true, timeout: 10000, maximumAge: 3000 },
        );
      } catch (e) {
        console.log('catch exception in getCurrentLocation():', e);
        Toast.show('无法获取您的当前位置');
        const p = {
          longitude: null,
          latitude: null,
        };
        if (typeof callback === 'function') callback(p, null);
        if (typeof compCallBack === 'function') compCallBack(p, null);
      }
    },
    enumerable: false,
  });
};

export default CustomPrototypes;
