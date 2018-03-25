import React, { Component } from 'react';
import { Toast, Flex } from 'antd-mobile';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import _ from 'lodash';
import ReactSwipe from 'react-swipe';
import classnames from 'classnames';

import Global from '../../Global';
import styles from './AppFuncs.less';
import commonStyles from '../../utils/common.less';
import { colors } from '../../utils/common';

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

  onPressMenuItem(route, title, passProps) {
    if (route) {
      const { dispatch } = this.props;
      dispatch({
        type: 'base/save',
        payload: {
          title,
          ...passProps,
        },
      });
      dispatch(routerRedux.push(`/stack/${route}`));
    } else {
      Toast.info(`${title}即将开通`);
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
  renderMenu() {
    const { screen } = this.props.base;
    return this.mainServices.map(({
      id, name, imgIcon, route, passProps,
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
            className={classnames(commonStyles[imgIcon], commonStyles.icon, styles.primaryIconContainer)}
            style={{
              width: (screen.width / 10),
              height: (screen.width / 10),
            }}
          />
          <div className={classnames(styles.primaryText)}>{name}</div>
        </div>
      );
      return (
        <Flex.Item
          key={id}
          className={styles.primaryItemContainer}
          onClick={() => {
            // console.log(route, name, passProps);
            this.onPressMenuItem(route, name, passProps);
          }}
        >
          {content}
        </Flex.Item>
      );
    });
  }

  renderSlideMenu() {
    const { screen } = this.props.base;
    return this.chunkServices.map((menus, idx) => {
      const content = menus.map(({
        id, name, imgIcon, route, /* borderColor, */passProps,
      }) => {
        return (
          <div
            key={id}
            className={classnames(styles.item)}
            style={{
              height: (screen.width / 4) + 10,
              // borderRightWidth: idx === 2 ? 0 : 1,
              paddingTop: ((screen.width / 4) + 10 - (screen.width / 15) - 25) / 2,
            }}
            onClick={() => {
              this.onPressMenuItem(route, name, passProps);
            }}
          >
            <div
              className={classnames(commonStyles[imgIcon], commonStyles.icon, styles.iconContainer)}
              style={{
                width: (screen.width / 15),
                height: (screen.width / 15),
              }}
            />
            <div className={classnames(styles.text)}>{name}</div>
          </div>
        );
      });
      let blankItems = null;
      if (menus.length < 4) {
        const blankArr = [];
        for (let i = 0; i < 4 - menus.length; i++) {
          blankArr[blankArr.length] = i;
        }
        blankItems = blankArr.map((item, blankIdx) => {
          return (
            <Flex.Item key={`blank_item_${blankIdx + 1}`} />
          );
        });
      }
      return (
        <Flex align="start" className={styles.slideMenuContainer} key={`slide_${idx + 1}`} >
          {content}
          {blankItems}
        </Flex>
      );
    });
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
  //         className={classnames(commonStyles[imgIcon], commonStyles.icon, styles.iconContainer)}
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
    const { slideMenuIdx } = this.props.base;
    return this.chunkServices.map((item, idx) => {
      return (
        <div
          key={`ad_dots_${idx + 1}`}
          className={classnames(styles.dot)}
          style={{
            marginLeft: idx === 0 ? 0 : 6,
            backgroundColor: idx === slideMenuIdx ? colors.IOS_GREEN : colors.FONT_LIGHT_GRAY1,
            width: idx === slideMenuIdx ? 8 : 4,
          }}
        />
      );
    });
  }

  render() {
    const { dispatch, base } = this.props;
    const { slideMenuIdx } = base;

    return (
      <div>
        <Flex className={styles.primaryIconsContainer} >{this.renderMenu()}</Flex>
        <div className={styles.slideContainer} >
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
        </div>
      </div>
    );
  }
}

// const styles = StyleSheet.create({
//   container: {
//     borderTopWidth: 1 / Global.pixelRatio,
//     borderTopColor: Global.colors.LINE,
//     borderBottomWidth: 1 / Global.pixelRatio,
//     borderBottomColor: Global.colors.LINE,
//     overflow: 'hidden',
//     backgroundColor: 'white',
//   },
//   menu: {
//     flex: 1,
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//   },
//
//   primaryItemContainer: {
//     width: AppFuncs.primaryItemWidth,
//   },
//   primaryItem: {
//     width: AppFuncs.primaryItemWidth,
//     height: AppFuncs.primaryItemWidth + 10,
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderRightWidth: 1 / Global.pixelRatio,
//     borderRightColor: Global.colors.LINE,
//     borderBottomWidth: 1 / Global.pixelRatio,
//     borderBottomColor: Global.colors.LINE,
//     marginBottom: 1,
//   },
//   primaryIconContainer: {
//     width: AppFuncs.primaryIconWidth,
//     height: AppFuncs.primaryIconWidth,
//     borderRadius: AppFuncs.primaryIconWidth / 2,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   primaryIcon: {
//     width: AppFuncs.primaryIconWidth / 2,
//     height: AppFuncs.primaryIconWidth / 2,
//     backgroundColor: 'transparent',
//     tintColor: Global.colors.FONT_GRAY,
//   },
//   primaryText: {
//     width: AppFuncs.itemWidth - 10,
//     fontSize: 14,
//     textAlign: 'center',
//     overflow: 'hidden',
//     marginTop: 5,
//     color: '#000000',
//     fontWeight: '600',
//   },
//
//   itemContainer: {
//     width: AppFuncs.itemWidth,
//   },
//   item: {
//     width: AppFuncs.itemWidth,
//     height: AppFuncs.itemWidth + 10,
//     justifyContent: 'center',
//     alignItems: 'center',
//     // backgroundColor: 'red',
//   },
//   iconContainer: {
//     width: AppFuncs.iconWidth,
//     height: AppFuncs.iconWidth,
//     // borderWidth: 1 / Global.pixelRatio,
//     borderRadius: AppFuncs.iconWidth / 2,
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingBottom: 20,
//     // backgroundColor: 'green',
//   },
//   icon: {
//     width: AppFuncs.iconWidth / 2,
//     height: AppFuncs.iconWidth / 2,
//     backgroundColor: 'transparent',
//     tintColor: Global.colors.FONT_GRAY,
//   },
//   text: {
//     width: AppFuncs.itemWidth - 10,
//     fontSize: 14,
//     textAlign: 'center',
//     overflow: 'hidden',
//     marginTop: 0,
//     top: -8,
//     color: '#000000',
//     fontWeight: '600',
//   },
//
//   wrapper: {
//     marginTop: 2,
//   },
//   slideMenuContainer: {
//     flexDirection: 'row',
//   },
// });

AppFuncs.propTypes = {
};

export default connect(base => (base))(AppFuncs);
