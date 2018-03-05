import React, { Component } from 'react';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import { notification } from 'antd';
import _ from 'lodash';

import styles from './Homepage.less';

import baseIcon from '../../assets/image/icons/base-64.png';
import cardIcon from '../../assets/image/icons/card-64.png';
import chargeIcon from '../../assets/image/icons/charge-64.png';
import dispensaryIcon from '../../assets/image/icons/dispensary-64.png';
import exitIcon from '../../assets/image/icons/exit.png';
import financeIcon from '../../assets/image/icons/finance-64.png';
import hrpIcon from '../../assets/image/icons/hrp-64.png';
import materialIcon from '../../assets/image/icons/material-64.png';
import odwsIcon from '../../assets/image/icons/odws-64.png';
import onwsIcon from '../../assets/image/icons/onws-64.png';
import operationIcon from '../../assets/image/icons/operation-64.png';
import pharmacyIcon from '../../assets/image/icons/pharmacy-64.png';
import registerIcon from '../../assets/image/icons/register-64.png';
import idwsIcon from '../../assets/image/icons/idws-64.png';
import inwsIcon from '../../assets/image/icons/inws-64.png';
import aimsIcon from '../../assets/image/icons/aims-64.png';

class Homepage extends Component {

  constructor(props) {
    super(props);
    this.exit = this.exit.bind(this);
    this.chooseModule = this.chooseModule.bind(this);
  }

  state = {};

  componentWillMount() {
    if (this.props.base.menuTree.length === 0) {
      this.props.dispatch({
        type: 'base/loadMenus',
      });
    }
  }

  componentWillReceiveProps(nextPtops) {
    // console.log('nextPtops.base.menuTree:', nextPtops.base.menuTree);
    // 如果当前登录人只有一个可登录系统，则默认登录，不显示选择系统界面
    if (nextPtops.base.menuTree.length === 1) {
      this.props.dispatch(routerRedux.push(nextPtops.base.menuTree[0].pathname));
    }
  }

  chooseModule(module) {
    // console.log('module:', module);
    // 模块无子菜单时提示模块暂未开通，并直接返回
    if (module.children.length === 0) {
      notification.error({
        message: '提示',
        description: '此模块暂未开通！',
        duration: 1,
      });
      return;
    }
    this.props.dispatch(routerRedux.push(module.pathname));
  }

  icons = {
    base: baseIcon,
    card: cardIcon,
    charge: chargeIcon,
    dispensary: dispensaryIcon,
    exit: exitIcon,
    finance: financeIcon,
    hrp: hrpIcon,
    material: materialIcon,
    odws: odwsIcon,
    onws: onwsIcon,
    operation: operationIcon,
    pharmacy: pharmacyIcon,
    register: registerIcon,
    idws: idwsIcon,
    inws: inwsIcon,
    aims: aimsIcon,
  };

  exit() {
    this.props.dispatch({
      type: 'base/logout',
    });
  }

  render() {
    /* global document*/
    const docHeight = document.documentElement.clientHeight;
    const scope = this;
    const { menuTree } = this.props.base;
    // console.log('menuTree:', menuTree);
    // 菜单容器最小高度
    let minHeight = (_.ceil((menuTree.length + 1) / 4) * 250) + 50;
    minHeight = minHeight < docHeight ? docHeight : minHeight;
    const wrapperWidth = menuTree.length < 4 ? ((menuTree.length + 1) * 250) - 48 : 952;

    return (
      <div className={styles.container} style={{ minHeight: `${minHeight}px` }} >
        <div className={styles.grid_wrapper} style={{ width: `${wrapperWidth}px` }} >
          <ul className={styles.grid} >
            {
              menuTree.map((module, idx) => {
                // 模块无子菜单时，icon及title均显示灰色
                const grayImg = module.children.length === 0 ? styles.grayImg : '';
                const grayText = module.children.length === 0 ? styles.grayText : '';

                const noMarginRight = (idx + 1) % 4 === 0 ?
                  styles.noMarginRight : styles.marginRight;
                return (
                  <li key={module.id} onClick={() => this.chooseModule(module)} className={`${styles.blank} ${noMarginRight}`} >
                    <img src={this.icons[module.icon]} className={`${styles.icon} ${grayImg}`} alt="" />
                    <span className={`${styles.tip} ${grayText}`}>{module.name}</span>
                  </li>
                );
              })
            }
            <li key="exit_button" onClick={this.exit} className={styles.noMarginRight} >
              <img src={this.icons.exit} className={styles.icon} alt="" />
              <span className={`${styles.tip} ${styles.grayText}`} >退出</span>
            </li>
          </ul>
        </div>
      </div>
    );
  }
}
export default connect(({ base }) => ({ base }))(Homepage);

