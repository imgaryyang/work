import React, { PureComponent } from 'react';
import { ActivityIndicator } from 'antd-mobile';

export default class ActivityIndicatorView extends PureComponent {
  render() {
    return (
      <div style={styles.container}>
        <ActivityIndicator size="large" />
      </div>
    );
  }
}

const styles = {
  container: {
    position: 'absolute',
    width: '100%',
    height: document.documentElement.clientHeight * 0.6,
    display: 'flex',
    justifyContent: 'center',
  },
};
