import React, { Component } from 'react';
import { connect } from 'dva';
import { Row, Col, Icon } from 'antd';
import styles from './IconSelecter.css';

class IconSelecter extends Component {

  state={
  }

  icons1=['step-backward', 'step-forward', 'fast-backward', 'fast-forward', 'shrink', 'arrows-alt', 'down', 'up', 'left', 'right', 'caret-up', 'caret-down', 'caret-left', 'caret-right', 'up-circle', 'down-circle', 'left-circle', 'right-circle', 'up-circle-o', 'down-circle-o', 'right-circle-o', 'left-circle-o', 'double-right', 'double-left', 'verticle-left', 'verticle-right', 'forward', 'backward', 'rollback', 'enter', 'retweet', 'swap', 'swap-left', 'swap-right', 'arrow-up', 'arrow-down', 'arrow-left', 'arrow-right', 'play-circle', 'play-circle-o', 'up-square', 'down-square', 'left-square', 'right-square', 'up-square-o', 'down-square-o', 'left-square-o', 'right-square-o']

  icons2=['question', 'question-circle-o', 'question-circle', 'plus', 'plus-circle-o', 'plus-circle', 'pause', 'pause-circle-o', 'pause-circle', 'minus', 'minus-circle-o', 'minus-circle', 'plus-square', 'plus-square-o', 'minus-square', 'minus-square-o', 'info', 'info-circle-o', 'info-circle', 'exclamation', 'exclamation-circle-o', 'exclamation-circle', 'close', 'close-circle', 'close-circle-o', 'close-square', 'close-square-o', 'check', 'check-circle', 'check-circle-o', 'check-square', 'check-square-o', 'clock-circle-o', 'clock-circle']

  icons3=['lock', 'unlock', 'android', 'apple', 'apple-o', 'area-chart', 'pie-chart', 'bar-chart', 'dot-chart', 'bars', 'book', 'calendar', 'cloud', 'cloud-download', 'code', 'code-o', 'copy', 'credit-card', 'delete', 'desktop', 'download', 'edit', 'ellipsis', 'file', 'file-text', 'file-unknown', 'file-pdf', 'file-excel', 'file-jpg', 'file-ppt', 'file-add', 'folder', 'folder-open', 'folder-add', 'github', 'hdd', 'frown', 'frown-o', 'meh', 'meh-o', 'smile', 'smile-o', 'inbox', 'laptop', 'appstore-o', 'appstore', 'line-chart', 'link', 'logout', 'mail', 'menu-fold', 'menu-unfold', 'mobile', 'notification', 'paper-clip', 'picture', 'poweroff', 'reload', 'search', 'setting', 'share-alt', 'shopping-cart', 'tablet', 'tag', 'tag-o', 'tags', 'tags-o', 'to-top', 'upload', 'user', 'video-camera', 'windows', 'windows-o', 'ie', 'chrome', 'home', 'loading', 'loading-3-quarters', 'cloud-upload-o', 'cloud-download-o', 'cloud-upload', 'cloud-o', 'star-o', 'star', 'heart-o', 'heart', 'environment', 'environment-o', 'eye', 'eye-o', 'camera', 'camera-o', 'aliwangwang', 'aliwangwang-o', 'dingding', 'dingding-o', 'save', 'team', 'solution', 'phone', 'filter', 'exception', 'export', 'customer-service', 'qrcode', 'scan', 'like', 'like-o', 'dislike', 'dislike-o', 'message', 'pay-circle', 'pay-circle-o', 'calculator', 'pushpin', 'pushpin-o', 'bulb', 'select', 'switcher', 'rocket']

  selectIcon(icon) {
    if (typeof this.props.onSelected === 'function') { this.props.onSelected(icon); }
  }

  render() {
    return (
      <div className={styles.icons} >
        <div>
          <h2>方向性图标</h2>
          <Row>
            {
              this.icons1.map(
                (icon, idx) => {
                  return (
                    <Col span={4} key={`_icons1_${idx}`} onClick={() => { this.selectIcon(icon); }} className={styles.col + (this.props.selected === icon ? ` ${styles.selectedCol}` : '')} >
                      <Icon type={icon} />
                    </Col>
                  );
                },
              )
            }
          </Row>
          <h2>提示建议性图标</h2>
          <Row>
            {
              this.icons2.map(
                (icon, idx) => {
                  return (
                    <Col span={4} key={`_icons1_${idx}`} onClick={() => { this.selectIcon(icon); }} className={styles.col + (this.props.selected === icon ? ` ${styles.selectedCol}` : '')} >
                      <Icon type={icon} />
                    </Col>
                  );
                },
              )
            }
          </Row>
          <h2>网站通用图标</h2>
          <Row>
            {
              this.icons3.map(
                (icon, idx) => {
                  return (
                    <Col span={4} key={`_icons1_${idx}`} onClick={() => { this.selectIcon(icon); }} className={styles.col + (this.props.selected === icon ? ` ${styles.selectedCol}` : '')} >
                      <Icon type={icon} />
                    </Col>
                  );
                },
              )
            }
          </Row>
        </div>
      </div>
    );
  }
}

export default connect()(IconSelecter);

