import React, { Component } from 'react';
import { connect } from 'dva';
import ReactSwipe from 'react-swipe';
import classnames from 'classnames';

// import Global from '../../Global';
import styles from './Ads.less';
import { colors } from '../../utils/common';
import { image } from '../../services/baseService';

class Ads extends Component {
  constructor(props) {
    super(props);
    this.renderAds = this.renderAds.bind(this);
    this.renderPagination = this.renderPagination.bind(this);
    this.props.dispatch({
      type: 'base/loadAds',
    });
  }

  state = {
    swipeIdx: 0,
  }

  // 渲染滚动广告
  renderAds() {
    const { base } = this.props;
    return base.ads.map((ad, idx) => {
      return (
        <div
          key={`home_ad_${idx + 1}`}
          className={classnames(styles.img)}
          style={{
            // width: base.screen.width,
            height: base.screen.width * (1 - 0.618),
            backgroundImage: `url(${image(ad.image)})`,
          }}
        />
      );
    });
  }

  renderPagination() {
    const { swipeIdx } = this.state;
    const { base } = this.props;
    return base.ads.map((ad, idx) => {
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
    const { base } = this.props;
    return (
      <div className={styles.container} >
        {
          base.ads.length > 0 ? (
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
          ) : null
        }
        <div className={styles.paginationContainer} >
          <div
            className={styles.dotsContainer}
            style={{ width: this.props.base.ads.length * 12 - 6 }}
          >
            {this.renderPagination()}
          </div>
        </div>
      </div>
    );
  }
}

Ads.propTypes = {
};

export default connect(base => (base))(Ads);
