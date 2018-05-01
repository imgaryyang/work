import React, { Component } from 'react';
import { Toast, Flex } from 'antd-mobile';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import _ from 'lodash';
// import ReactSwipe from 'react-swipe';
import classnames from 'classnames';

import Global from '../../Global';
// import { colors } from '../../utils/common';

import styles from './AppFuncs.less';
import baseStyles from '../../utils/base.less';

class AppFuncs extends Component {
  constructor(props) {
    super(props);
    // console.log(this.props.base.screen);
    this.renderMenu = this.renderMenu.bind(this);
    this.onPressMenuItem = this.onPressMenuItem.bind(this);
    this.renderSlideMenu = this.renderSlideMenu.bind(this);
    // this.renderSlideMenu1 = this.renderSlideMenu1.bind(this);
    // this.renderItem = this.renderItem.bind(this);
    this.renderPagination = this.renderPagination.bind(this);
    // this.chooseHospitalForNext = this.chooseHospitalForNext.bind(this);
  }

  state = {
  }

  onPressMenuItem(route, title, passProps, children, state) {
    const { dispatch } = this.props;
    if (route === 'subFuncs') {
      dispatch({
        type: 'base/save',
        payload: {
          subFuncsTitle: title,
          subFuncs: children,
          ...passProps,
        },
      });
      dispatch(routerRedux.push(`/stack/${route}`));
    } else if (route && state === '1') {
      dispatch({
        type: 'base/save',
        payload: {
          title,
          ...passProps,
        },
      });
      dispatch(routerRedux.push(`/stack/${route}`));
    } else {
      Toast.info(`${title}即将开通，敬请期待`);
    }
  }

  services = Global.Config.services;
  mainServices = _.dropRight(this.services.hfc, this.services.hfc.length - 3);
  otherServices = _.slice(this.services.hfc, 3);
  chunkServices = _.chunk(this.otherServices, 4);

  // onPressMenuItem(component, title, passProps) {
  //   if (component) {
  //     if (_.indexOf(Global.Config.needChooseHospServices, component) === -1 || this.props.currHospital) {
  //       this.props.navigate({ component, params: { title, ...passProps, hospital: this.props.currHospital } });
  //     } else {
  //       this.props.navigate({
  //         component: 'HospitalList',
  //         params: {
  //           title: '选择医院',
  //           chooseHospitalForNext: this.chooseHospitalForNext,
  //           routeName: component,
  //           passProps,
  //           hideNavBarBottomLine: true,
  //         },
  //       });
  //     }
  //   } else {
  //     Toast.info(`${title}即将开通`);
  //   }
  // }

  // 需要先选择医院的业务，在选择医院后回调
  // chooseHospitalForNext(hospital, routeName, passProps) {
  //   this.props.setCurrHospital(hospital);
  //   this.props.navigate({ component: routeName, params: { hospital, ...passProps } });
  // }

  /**
   * 渲染所有菜单项
   */
  renderMenu(services) {
    const { screen } = this.props.base;
    return services.map(({
      id, name, imgIcon, route, passProps, children, state,
    }, idx) => {
      const content = (
        <div
          className={classnames(styles.primaryItem)}
          style={{
            height: (screen.width / 3) + 10,
            borderRightWidth: idx === 2 ? 0 : 1,
            paddingTop: ((screen.width / 3) + 10 - (screen.width / 10) - 35) / 2,
          }}
        >
          <div
            className={classnames(baseStyles[!route || state !== '1' ? `${imgIcon}Disabled` : imgIcon], baseStyles.icon, styles.primaryIconContainer)}
            style={{
              width: (screen.width / 10),
              height: (screen.width / 10),
            }}
          />
          <div className={classnames(styles.primaryText, !route || state !== '1' ? styles.primaryTextForbidden : null)}>{name}</div>
        </div>
      );
      return (
        <Flex.Item
          key={id}
          className={styles.primaryItemContainer}
          onClick={() => {
            // console.log(route, name, passProps);
            this.onPressMenuItem(route, name, passProps, children, state);
          }}
        >
          {content}
        </Flex.Item>
      );
    });
  }

  renderSlideMenu() {
    // const { screen } = this.props.base;
    // return this.chunkServices.map((menus, idx) => {
    //   const content = menus.map(({
    //     id, name, imgIcon, route, /* borderColor, */passProps, children,
    //   }) => {
    //     return (
    //       <div
    //         key={id}
    //         className={classnames(styles.item)}
    //         style={{
    //           height: (screen.width / 4) + 10,
    //           // borderRightWidth: idx === 2 ? 0 : 1,
    //           paddingTop: ((screen.width / 4) + 10 - (screen.width / 15) - 25) / 2,
    //         }}
    //         onClick={() => {
    //           this.onPressMenuItem(route, name, passProps, children);
    //         }}
    //       >
    //         <div
    //           className={classnames(baseStyles[imgIcon], baseStyles.icon, styles.iconContainer)}
    //           style={{
    //             width: (screen.width / 15),
    //             height: (screen.width / 15),
    //           }}
    //         />
    //         <div className={classnames(baseStyles.ellipsisText, styles.text)}>{name}</div>
    //       </div>
    //     );
    //   });
    //   let blankItems = null;
    //   if (menus.length < 4) {
    //     const blankArr = [];
    //     for (let i = 0; i < 4 - menus.length; i++) {
    //       blankArr[blankArr.length] = i;
    //     }
    //     blankItems = blankArr.map((item, blankIdx) => {
    //       return (
    //         <Flex.Item key={`blank_item_${blankIdx + 1}`} />
    //       );
    //     });
    //   }
    //   return (
    //     <Flex align="start" className={styles.slideMenuContainer} key={`slide_${idx + 1}`} >
    //       {content}
    //       {blankItems}
    //     </Flex>
    //   );
    // });
  }

  // renderItem({ id, name, imgIcon, route, /* borderColor, */passProps }, idx) {
  //   const { screen } = this.props.base;
  //   return (
  //     <div
  //       key={`${id}_${idx + 1}`}
  //       className={classnames(styles.item)}
  //       style={{
  //         height: (screen.width / 4) + 10,
  //         // borderRightWidth: idx === 2 ? 0 : 1,
  //         paddingTop: ((screen.width / 4) + 10 - (screen.width / 15) - 25) / 2,
  //       }}
  //       onClick={() => {
  //         this.onPressMenuItem(route, name, passProps);
  //       }}
  //     >
  //       <div
  //         className={classnames(baseStyles[imgIcon], baseStyles.icon, styles.iconContainer)}
  //         style={{
  //           width: (screen.width / 15),
  //           height: (screen.width / 15),
  //         }}
  //       />
  //       <div className={classnames(styles.text)}>{name}</div>
  //     </div>
  //   );
  // }

  // renderSlideMenu1() {
  //   // const { screen } = this.props.base;
  //   return this.chunkServices.map((menus, idx) => {
  //     return (
  //       <Grid
  //         className={styles.slideMenuContainer}
  //         key={`slide_grid_${idx + 1}`}
  //         data={menus}
  //         renderItem={this.renderItem}
  //         hasLine={false}
  //         columnNum={4}
  //         isCarousel
  //       />
  //     );
  //   });
  // }

  renderPagination() {
    // const { slideMenuIdx } = this.props.base;
    // return this.chunkServices.map((item, idx) => {
    //   return (
    //     <div
    //       key={`ad_dots_${idx + 1}`}
    //       className={classnames(styles.dot)}
    //       style={{
    //         marginLeft: idx === 0 ? 0 : 6,
    //         backgroundColor: idx === slideMenuIdx ? colors.IOS_GREEN : colors.FONT_LIGHT_GRAY1,
    //         width: idx === slideMenuIdx ? 8 : 4,
    //       }}
    //     />
    //   );
    // });
  }

  render() {
    // const { dispatch, base } = this.props;
    // const { slideMenuIdx } = base;

    return (
      <div>
        <Flex className={styles.primaryIconsContainer}>{this.renderMenu(this.mainServices)}</Flex>
        <Flex className={styles.primaryIconsContainer} style={{ borderTopWidth: 0 }}>{this.renderMenu(this.otherServices)}</Flex>
        {/* <div className={styles.slideContainer} >
          <ReactSwipe
            ref={(c) => { this.swipe = c; }}
            className={styles.swipeContainer}
            swipeOptions={{
              continuous: false,
              startSlide: slideMenuIdx,
              // speed: 400,
              // auto: 3000,
              callback: () => {
                // this.setState({ swipeIdx: this.swipe.getPos() });
                dispatch({
                  type: 'base/save',
                  payload: { slideMenuIdx: this.swipe.getPos() },
                });
              },
            }}
          >
            {this.renderSlideMenu()}
          </ReactSwipe>
          <div className={styles.paginationContainer} >
            <div
              className={styles.dotsContainer}
              style={{ width: this.chunkServices.length * 10 - 6 + 4 }}
            >
              {this.renderPagination()}
            </div>
          </div>
        </div>*/}
      </div>
    );
  }
}

AppFuncs.propTypes = {
};

export default connect(base => (base))(AppFuncs);
