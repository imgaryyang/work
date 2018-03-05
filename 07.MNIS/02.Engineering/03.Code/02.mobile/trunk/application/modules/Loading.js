/**
 * IOS、Android均可使用的Loading
 */

import React, { Component } from 'react';

import { ActivityIndicator } from 'react-native';
import PropTypes from 'prop-types';
import Modal from 'react-native-modal';

class Loading extends Component {
  static displayName = 'Loading';
  static description = '载入遮罩';

  render() {
    // console.log(this.props.visible);
    const spinnerObj = <ActivityIndicator />;
    return (
      <Modal animationInTiming={100} animationOutTiming={100} isVisible={this.props.visible} >
        {spinnerObj}
      </Modal>
    );
  }
}

Loading.propTypes = {
  visible: PropTypes.bool,
};

Loading.defaultProps = {
  visible: false,
};

export default Loading;
