import React, { Component } from 'react';
import {
  TouchableOpacity,
  Text,
  View,
  ActivityIndicator,
} from 'react-native';
import PropTypes from 'prop-types';
import EasyCard from 'rn-easy-card';
import EasyIcon from 'rn-easy-icon';

export default class NoDataView extends Component {
  render() {
    const {
      msg, reloadMsg, onReload, reloading,
    } = this.props;

    let msgText = msg;
    if (typeof onReload === 'function') {
      msgText += `，${reloadMsg}`;
    }

    return (
      <EasyCard radius={6} style={{ margin: 8, marginTop: 20 }}>
        {
          reloading ? (
            <View
              style={{ alignItems: 'center', justifyContent: 'center', padding: 15 }}
              onPress={() => {
                if (typeof onReload === 'function') {
                  onReload();
                }
              }}
            >
              <ActivityIndicator style={{ width: 40, height: 40 }} />
              <Text style={{ color: 'rgba(187,187,187,1)', textAlign: 'center' }}>{msgText}</Text>
            </View>
          ) : (
            <TouchableOpacity
              style={{ alignItems: 'center', justifyContent: 'center', padding: 15 }}
              onPress={() => {
                if (typeof onReload === 'function') {
                  onReload();
                }
              }}
            >
              <EasyIcon name="ios-refresh-outline" color="rgba(187,187,187,1)" size={35} width={40} height={40} />
              <Text style={{ color: 'rgba(187,187,187,1)', textAlign: 'center' }}>{msgText}</Text>
            </TouchableOpacity>
          )
        }

      </EasyCard>
    );
  }
}

NoDataView.propTypes = {
  msg: PropTypes.string,
  reloadMsg: PropTypes.string,
  reloading: PropTypes.bool,
  onReload: PropTypes.func,
};

NoDataView.defaultProps = {
  msg: '暂无数据',
  reloadMsg: '点击刷新按钮重新查询',
  reloading: false,
  onReload: () => {},
};
