import React, { Component } from 'react';
import { connect } from 'dva';
import ReactSwipe from 'react-swipe';
import classnames from 'classnames';

import Global from '../../Global';
import styles from './Ads.less';
import commonStyles from '../../utils/common.less';
import { colors } from '../../utils/common';

class Ads extends Component {
  constructor(props) {
    super(props);
    this.renderAds = this.renderAds.bind(this);
    this.renderPagination = this.renderPagination.bind(this);
  }

  state = {
    swipeIdx: 0,
  }

  // 渲染滚动广告
  renderAds() {
    const { base } = this.props;
    return Global.Config.ads.map((image, idx) => {
      return (
        <div
          key={`home_ad_${idx + 1}`}
          className={classnames(commonStyles[image], styles.img)}
          style={{
            height: base.screen.width * (1 - 0.618),
          }}
        />
      );
    });
  }

  renderPagination() {
    const { swipeIdx } = this.state;
    return Global.Config.ads.map((image, idx) => {
      return (
        <div
          key={`ad_dots_${idx + 1}`}
          className={classnames(styles.dot)}
          style={{
            marginLeft: idx === 0 ? 0 : 6,
            backgroundColor: idx === swipeIdx ? colors.IOS_GREEN : colors.FONT_LIGHT_GRAY1,
          }}
        />
      );
    });
  }

  render() {
    // const { base } = this.props;
    return (
      <div className={styles.container} >
        <ReactSwipe
          ref={(c) => { this.swipe = c; }}
          className={styles.swipeContainer}
          swipeOptions={{
            continuous: true,
            speed: 400,
            auto: 3000,
            callback: () => {
              this.setState({ swipeIdx: this.swipe.getPos() });
            },
          }}
        >
          {this.renderAds()}
        </ReactSwipe>
        <div className={styles.paginationContainer} >
          <div
            className={styles.dotsContainer}
            style={{ width: Global.Config.ads.length * 12 - 6 }}
          >
            {this.renderPagination()}
          </div>
        </div>
      </div>
    );
  }
}

// const styles = StyleSheet.create({
//   container: {
//     borderBottomWidth: 1 / Global.pixelRatio,
//     borderBottomColor: Global.colors.LINE,
//   },
//   wrapper: {
//   },
//   ad: {
//     flex: 1,
//   },
//   img: {
//     width: Global.getScreen().width,
//     height: Global.getScreen().width * (1 - 0.618),
//   },
// });

Ads.propTypes = {
};

export default connect(base => (base))(Ads);
