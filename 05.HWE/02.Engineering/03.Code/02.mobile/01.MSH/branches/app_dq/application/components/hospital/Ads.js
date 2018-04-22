import React, { Component } from 'react';
import { StyleSheet, TouchableOpacity, Image, View } from 'react-native';
import Swiper from 'react-native-swiper';

import Global from '../../Global';
import { ads } from '../../services/base/BaseService';

export default class Ads extends Component {
  constructor(props) {
    super(props);
    this.fetchData = this.fetchData.bind(this);
    this.fetchData();
  }

  state = {
    ads: Global.Config.ads,
  };

  async fetchData() {
    try {
      const responseData = await ads();
      if (responseData.success) {
        this.setState({
          ads: responseData.result,
        });
      } else {
        this.setState({
          ads: [],
        });
        this.handleRequestException({ msg: '获取轮播图片出错！' });
      }
    } catch (e) {
      this.setState({
        ads: [],
      });
      this.handleRequestException(e);
    }
  }

  // 渲染滚动广告
  renderAds() {
    // console.log(this.state.ads);
    return this.state.ads.map(({ image }, idx) => {
      return (
        <TouchableOpacity style={styles.ad} key={`home_ad_${idx + 1}`} >
          <Image
            source={{ uri: `${Global.getImageHost()}${image}?timestamp=${new Date().getTime()}` }}
            resizeMode="cover"
            style={styles.img}
          />
        </TouchableOpacity>
      );
    });
  }

  render() {
    return (
      <View style={styles.container} >
        {
          this.state.ads.length > 0 ? (
            <Swiper
              style={styles.wrapper}
              paginationStyle={{ bottom: 5 }}
              autoplay
              loop
              width={Global.getScreen().width}
              height={Global.getScreen().width * (1 - 0.618)}
            >
              {this.renderAds()}
            </Swiper>
          ) : null
        }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: Global.getScreen().width,
    height: Global.getScreen().width * (1 - 0.618),
    borderBottomWidth: 1 / Global.pixelRatio,
    borderBottomColor: Global.colors.LINE,
  },
  wrapper: {
  },
  ad: {
    flex: 1,
  },
  img: {
    width: Global.getScreen().width,
    height: Global.getScreen().width * (1 - 0.618),
  },
});
