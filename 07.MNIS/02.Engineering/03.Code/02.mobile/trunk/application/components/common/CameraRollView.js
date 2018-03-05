/* eslint-disable radix */
/**
 * 从camerRoll中获取本地照片数据，存储在listView中，listView 可以无限加载 选择照片回到上个界面，并选择存储
 */

import React, {
  Component,
} from 'react';

import {
  Alert,
  CameraRoll,
  Image,
  InteractionManager,
  ListView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import PropTypes from 'prop-types';
import Button from 'rn-easy-button';
import Separator from 'rn-easy-separator';
import EasyIcon from 'rn-easy-icon';

import Global from '../../Global';
import Toast from "react-native-root-toast";

class CameraRollView extends Component {
  static displayName = 'CameraRollView';
  static description = '相册图片选择器';

  static propTypes = {
    /**
     * The group where the photos will be fetched from. Possible
     * values are 'Album', 'All', 'Event', 'Faces', 'Library', 'PhotoStream'
     * and SavedPhotos.
     */
    groupTypes: PropTypes.oneOf(['Album', 'All', 'Event', 'Faces', 'Library', 'PhotoStream', 'SavedPhotos']),

    /**
     * Number of images that will be fetched in one page.
     */
    // batchSize: PropTypes.number,

    /**
     * A function that takes a single image as a parameter and renders it.
     */
    // renderImage: PropTypes.func,

    // * imagesPerRow: Number of images to be shown in each row.

    imagesPerRow: PropTypes.number,

    /**
     * The asset type, one of 'Photos', 'Videos' or 'All'
     */
    assetType: PropTypes.oneOf(['Photos', 'Videos', 'All']),

    /**
     * 选择后回调函数
     * callback for selected phones
     * 必填
     */
    selected: PropTypes.func,

    /**
     * 选择方式
     * single - 单选，multi - 多选
     * default single
     */
    // type: PropTypes.string,

    /**
     * maximum number of the selected photos
     * available only when type = multi
     */
    // maxCount: PropTypes.number,

    batchSize: PropTypes.number,

  };

  static defaultProps = {
    // 获取照片的参数
    assetType: 'Photos', // 类型 'Photos','Videos', 'All',
    batchSize: 12,
    groupTypes: 'All', // 获取照片的分组类型，只在ISO中生效 'Album','All','Event','Faces','Library','PhotoStream', 'SavedPhotos',
    imagesPerRow: 4, // 每行显示多个照片
    // maxCount: 5,
    // type: 'single',
    selected: null,
  };

  static renderPlaceholderView() {
    return (
      <View style={[Global.styles.CONTAINER, { backgroundColor: 'white' }]} />
    );
  }

  static groupByEveryN(array, n) {
    const result = [];
    let temp = [];

    for (let i = 0; i < array.length; ++i) {
      if (i > 0 && i % n === 0) {
        result.push(temp);
        temp = [];
      }
      temp.push(array[i]);
    }

    if (temp.length > 0) {
      while (temp.length !== n) {
        temp.push(null);
      }
      result.push(temp);
    }
    return result;
  }

  static rowHasChanged(r1/* : Array<Image> */, r2/* : Array<Image> */) {
    if (r1.length !== r2.length) {
      return true;
    }

    for (let i = 0; i < r1.length; i++) {
      if (r1[i] !== r2[i]) {
        return true;
      }
    }

    return false;
  }

  static contains(array, val)
  {
    for (var i = 0; i < array.length; i++)
    {
      if (array[i] == val)
      {
        return true;
      }
    }
    return false;
  };


  constructor(props) {
    super(props);
    this.componentDidMount = this.componentDidMount.bind(this);
    this.componentWillReceiveProps = this.componentWillReceiveProps.bind(this);
    this.confirm = this.confirm.bind(this);
    this.onSelect = this.onSelect.bind(this);
    this.logError = this.logError.bind(this);
    this.fetch = this.fetch.bind(this);
    this.renderFooterSpinner = this.renderFooterSpinner.bind(this);
    this.renderRow = this.renderRow.bind(this);
    this.appendAssets = this.appendAssets.bind(this);
    this.renderImage = this.renderImage.bind(this);
    this.onEndReached = this.onEndReached.bind(this);
    this.refresh = this.refresh.bind(this);
  }

  state = {
    dataSource: new ListView.DataSource({ rowHasChanged: CameraRollView.rowHasChanged }),
    assets: [],
    // groupTypes: this.props.groupTypes,
    lastCursor: null, // 获取相册后的最后的游标，用于赋值给下次getPhotos的after
    // assetType: this.props.assetType,
    more: true, // 是否还有数据 true 有 false 没有
    doRenderScene: false,
    // userInfo: this.props.userInfo,
    selectedPhotos: [],
  };

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.setState({ doRenderScene: true });
      this.fetch();
      // this.listPhotos();
    });
  }

  componentWillReceiveProps(/* nextProps */) {
    // if (this.props.groupTypes !== nextProps.groupTypes) {
    //     this.fetch(true);
    // }
  }

  // 无限加载，获取下次数据。
  onEndReached() {
    if (this.state.more) {
      this.fetch();
    }
  }

  onSelect(photo, rowID, index) {
    // index : 2 双击 选择照片取消 1：选择照片
    if (this.state.selectedPhotos.length === 0 && index === 1) {
      this.state.selectedPhotos.push(photo.node.image);
    } else if (CameraRollView.contains(this.state.selectedPhotos, photo.node.image) && index === 2) {
      // 去除
      this.state.selectedPhotos = [];
    } else {
      Alert.alert(
        '提示',
        '照片选择数量超过允许值!',
        [
          {
            text: '确定',
            onPress: () => {
              this.setState({ selectedPhotos: [] });
            },
          },
        ],
      );
    }
    const kk = parseInt(rowID) * this.props.imagesPerRow;
    // 修改listView 的dataSource 使listView 中的rowData 发生变化 ，重新渲染该照片所在的row
    for (let jj = 0; jj < this.props.imagesPerRow; jj++) {
      const photoItems1 = this.state.assets.slice(kk + jj, kk + jj + 1);
      const photoItem1 = photoItems1[0];
      if (photoItem1.node.image === photo.node.image) {
        this.state.assets.splice(
          kk + jj, 1,
          {
            node:
              {
                timestamp: photo.node.timestamp,
                group_name: photo.node.group_name,
                type: photo.node.type,
                selected: true,
                image: photo.node.image,
              },
          },
        );
      }
    }
    this.setState({
      selectedPhotos: this.state.selectedPhotos,
      dataSource: this.state.dataSource.cloneWithRows(CameraRollView.groupByEveryN(this.state.assets, this.props.imagesPerRow)),
    });
  }

  fetch() {
    const fetchParams = {
      first: this.props.batchSize,
      groupTypes: this.props.groupTypes,
      assetType: this.props.assetType,
    };
    // console.log("----------");
    // console.log(fetchParams);
    if (Global.os === 'android') {
      // not supported in android
      delete fetchParams.groupTypes;
    }
    // 还有剩余照片，则赋值获取剩余部分
    if (this.state.lastCursor) {
      fetchParams.after = this.state.lastCursor;
    }
    CameraRoll.getPhotos(fetchParams)
      .then(data => this.appendAssets(data), e => this.logError(e));
  }

  logError(e) {
    this.toast('出错');
    this.toast(e);
  }

  appendAssets(data) {
    const assets = data.edges;
    const newState = {};
    // 获取的data中，如果后面还有照片则
    if (!data.page_info.has_next_page) {
      newState.more = false;
    }
    if (assets.length > 0) {
      newState.lastCursor = data.page_info.end_cursor;
      newState.assets = this.state.assets.concat(assets);
      newState.dataSource = this.state.dataSource.cloneWithRows(CameraRollView.groupByEveryN(newState.assets, this.props.imagesPerRow));
    }
    this.setState(newState);
  }

  confirm() {
    console.info(this.state.selectedPhotos.length)
    if (this.state.selectedPhotos.length === 0) { this.toast('您尚未选择照片'); } else {
      const photos = this.state.selectedPhotos[0];
      // 回调列表更新数据
      const { callback } = this.props.navigation.state.params;
      if (typeof callback === 'function') callback(photos);
      // 返回列表页
      this.props.navigation.goBack();
      /*if (typeof this.props.selected === 'function') {
        this.props.selected(photos);
        this.props.navigator.pop();
      }*/
    }
  }

  refresh() {
    this.setState({
      assets: [],
      // groupTypes: this.props.groupTypes,
      lastCursor: null, // 获取相册后的最后的游标，用于赋值给下次getPhotos的after
      // assetType: this.props.assetType,
      more: true, // 是否还有数据 true 有 false 没有
      doRenderScene: false,
      // userInfo: this.props.userInfo,
      selectedPhotos: [],
    });
  }

  goPop() {
    this.props.navigation.goBack();
  }

  // 无限加载时为footer显示 loading图标
  renderFooterSpinner() {
    if (this.state.more) {
      return (<View style={[Global.styles.CENTER, { width: Global.getScreen().width, height: 80 }]}><Text>waitting ！！！</Text></View>);
    }
    return (<View style={[Global.styles.CENTER, { width: Global.getScreen().width, height: 80 }]}><Text>没有照片了！</Text></View>);
  }

  // rowData is an array of images
  renderRow(rowData, sectionID, rowID) {
    console.info(rowData);
    // console.log("--------------------------------------------------");
    // console.log(rowID);
    // console.log("---------------------------------------------------");

    const images = rowData.map((image) => {
      if (image === null) {
        return null;
      }
      return this.renderImage(image, rowID);
    });

    return (
      <View style={styles.row}>
        {images}
      </View>
    );
  }

  renderImage(asset, rowID) {
    console.info(this.state.selectedPhotos);
    console.info(asset);
    // const imageSize = Global.getScreen().width / 4;
    if (CameraRollView.contains(this.state.selectedPhotos, asset.node.image)) {
      return (
        <TouchableOpacity key={`ap_${asset.node.timestamp}`} style={[Global.styles.CENTER, styles.imageHolder]} onPress={() => this.onSelect(asset, rowID, 2)} >
          <Image
            key={asset.node.timestamp}
            source={asset.node.image}
            style={styles.image}
          />
          <EasyIcon iconLib="fa" name="check-circle" size={20}  style={[styles.icon]} />
        </TouchableOpacity>
      );
    } else {
      return (
        <TouchableOpacity key={`ap_${asset.node.timestamp}`} style={[Global.styles.CENTER, styles.imageHolder]} onPress={() => this.onSelect(asset, rowID, 1)} >
          <Image
            key={asset.node.timestamp}
            source={asset.node.image}
            style={styles.image}
          />

        </TouchableOpacity>);
    }
  }

  render() {
    if (!this.state.doRenderScene) { return CameraRollView.renderPlaceholderView(); }

    const buttonState = this.state.selectedPhotos.length !== 1;
    return (
      <View style={[Global.styles.CONTAINER]} >
        <ListView
          renderRow={this.renderRow}
          renderFooter={this.renderFooterSpinner}
          onEndReached={this.onEndReached}
          style={styles.container}
          enableEmptySections
          dataSource={this.state.dataSource}
          pageSize={20}
        />
        <View style={{
            flexDirection: 'row', marginTop: 0, marginLeft: 10, marginRight: 10,
          }}
        >
          <Button text="取消" onPress={this.goPop} clear />
          <Separator width={(Global.getScreen().width / 3) * 2} />
          <Button text="确定" onPress={() => { this.confirm(); }} clear disabled={buttonState} />
        </View>
      </View>

    );
  }
}



const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    flex: 1,
  },
  url: {
    fontSize: 9,
    marginBottom: 14,
  },
  image: {
    width: ((Global.getScreen().width - 2) / 4) - 2,
    height: ((Global.getScreen().width - 2) / 4) - 2,
  },
  info: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  imageHolder: {
    width: (Global.getScreen().width - 2) / 4,
    height: (Global.getScreen().width - 2) / 4,
    margin: 1,
  },
  icon: {
    backgroundColor: 'transparent',
    position: 'absolute',
    bottom: 3,
    right: 3,
  },
});

CameraRollView.navigationOptions = (navigation) => ({
  title:  '选择图片',
});

export default CameraRollView;
