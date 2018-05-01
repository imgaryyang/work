import React from 'react';
import { Modal } from 'antd-mobile';
import classnames from 'classnames';

import Icon from './components/FAIcon';
import baseStyles from './utils/base.less';
import styles from './DownloadApp.less';

export default class DownloadApp extends React.PureComponent {
  /**
   * 获取当前操作系统
   * @returns {string}
   */
  static getOS() {
    const u = navigator.userAgent;
    const isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; // android终端
    const isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); // ios终端
    return isiOS ? 'ios' : (isAndroid ? 'android' : 'other');
  }

  /**
   * 判断是否在微信中
   * @returns {boolean}
   */
  static isWeixn() {
    const ua = navigator.userAgent.toLowerCase();
    // console.log('ua', ua);
    return ua.indexOf('micromessenger') !== -1;
  }

  constructor(props) {
    super(props);
    this.downloadAndroid = this.downloadAndroid.bind(this);
    this.downloadIOS = this.downloadIOS.bind(this);
  }

  state = {
    visible: false,
  }

  /**
   * 下载Android版
   */
  downloadAndroid() {
    // console.log(DownloadApp.isWeixn());
    if (DownloadApp.isWeixn()) {
      this.setState({ visible: true });
    } else {
      window.location.href = '/api/files/MSH.DQLN.apk';
    }
  }

  /**
   * 下载iOS版
   */
  downloadIOS() {
    const os = DownloadApp.getOS();
    if (os === 'ios') {
      window.location.href = 'itms-apps://itunes.apple.com/cn/app/LNHospital/id1287778662?mt=8';
    } else {
      alert('非iPhone手机无法下载iOS应用');
    }
  }

  render() {
    return (
      <div className={styles.container}>
        <div style={{ height: 40 }} />
        <div className={classnames(baseStyles.phone, styles.phoneBg)} />
        <div className={styles.btn} onClick={this.downloadAndroid}>
          <div className={classnames(baseStyles.android, styles.storeImg)} />
          <div className={styles.text}>安卓版下载</div>
        </div>
        <div className={styles.btn} onClick={this.downloadIOS}>
          <div className={classnames(baseStyles.iPhone, styles.storeImg)} />
          <div className={styles.iPhoneText}><div>苹果手机用户请移步</div><div>App Store 下载应用</div></div>
        </div>
        <div style={{ height: 60 }} />
        <Modal
          visible={this.state.visible}
          maskClosable
          transparent
          wrapClassName={styles.modal}
        >
          <div onClick={() => this.setState({ visible: false })} className={styles.closeBtn}><Icon type="close" className={styles.closeIcon} /></div>
          <div className={classnames(baseStyles.arrowToMenu, styles.arrow)} />
          <div className={styles.tips}>请点击按钮在选择菜单中选择用浏览器打开...</div>
          <div className={classnames(baseStyles.oibandroid, styles.oib)}>安卓手机</div>
          <div className={classnames(baseStyles.oibios, styles.oib)}>苹果手机</div>
        </Modal>
      </div>
    );
  }
}
