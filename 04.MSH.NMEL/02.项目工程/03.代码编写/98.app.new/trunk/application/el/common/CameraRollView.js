'use strict';
/*
* 从camerRoll中获取本地照片数据，存储在listView中，listView 可以无限加载 选择照片回到上个界面，并选择存储 
//TODO 图片的裁剪界面
*/

import React, {Component,} from 'react';

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
import * as Global from '../../Global';

import NavBar from 'rn-easy-navbar';
import Button from 'rn-easy-button';
import Separator from 'rn-easy-separator';
// import EasyIcon     	from 'rn-easy-icon';

const SAVE_URL = '/el/base/news/upload';

class CameraRollView  extends Component{

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
    type: PropTypes.string,

    /**
     * maximum number of the selected photos
     * available only when type = multi
     */
    maxCount: PropTypes.number,

  };

  static defaultProps = {
    //获取照片的参数
    assetType: 'Photos', // 类型 'Photos','Videos', 'All',
    batchSize: 12,
    groupTypes: 'All',// 获取照片的分组类型，只在ISO中生效 'Album','All','Event','Faces','Library','PhotoStream', 'SavedPhotos',
    imagesPerRow: 4,//每行显示多个照片
    maxCount: 5,
    type: 'single',
  };

  state = {
    dataSource: new ListView.DataSource({rowHasChanged: this._rowHasChanged}),
    assets: [],
    groupTypes: this.props.groupTypes,
    lastCursor: null,//获取相册后的最后的游标，用于赋值给下次getPhotos的after
    assetType: this.props.assetType,
    more: true, //是否还有数据 true 有 false 没有
    doRenderScene: false,
    userInfo: this.props.userInfo,
    selectedPhotos: [],
  };

  constructor (props) {
    super(props);
    this.componentDidMount = this.componentDidMount.bind(this);
    this._rowHasChanged = this._rowHasChanged.bind(this);
    this.componentWillReceiveProps = this.componentWillReceiveProps.bind(this);
    this.confirm = this.confirm.bind(this);
    this.onSelect = this.onSelect.bind(this);
    this.logError = this.logError.bind(this);
    this.fetch = this.fetch.bind(this);
    this._renderFooterSpinner = this._renderFooterSpinner.bind(this);
    this._renderRow = this._renderRow.bind(this);
    this._appendAssets = this._appendAssets.bind(this);
    this.renderImage = this.renderImage.bind(this);
    this._onEndReached = this._onEndReached.bind(this);
    this.refresh = this.refresh.bind(this);
    this.groupByEveryN = this.groupByEveryN.bind(this);

  }

  componentDidMount () {
    InteractionManager.runAfterInteractions(() => {
      this.setState({doRenderScene: true});
      this.fetch();
      // this.listPhotos();

    });
  }
  groupByEveryN (array, n) {
    var result = [];
    var temp = [];

    for (var i = 0; i < array.length; ++i) {
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


  _rowHasChanged (r1: Array<Image>, r2: Array<Image>) {
    // console.log("_rowHasChanged");
    // console.log(r1);
    if (r1.length !== r2.length) {
      return true;
    }

    for (var i = 0; i < r1.length; i++) {
      if (r1[i] !== r2[i]) {
        return true;
      }
    }

    return false;
  }


  componentWillReceiveProps(nextProps) {
    // if (this.props.groupTypes !== nextProps.groupTypes) {
    //     this.fetch(true);
    // }
  }

  fetch(clear) {
    var fetchParams = {
      first: this.props.batchSize,
      groupTypes: this.props.groupTypes,
      assetType: this.props.assetType,
    };
    // console.log("----------");
    // console.log(fetchParams);
    if (Global._os === 'android') {
      // not supported in android
      delete fetchParams.groupTypes;
    }
    //还有剩余照片，则赋值获取剩余部分
    if (this.state.lastCursor) {
      fetchParams.after = this.state.lastCursor;
    }
    CameraRoll.getPhotos(fetchParams)
      .then((data) => this._appendAssets(data), (e) => this.logError(e));
  }

  logError(e){
    this.toast('出错');
    this.toast(e);

  }

  // 	//无限加载时为footer显示 loading图标
  _renderFooterSpinner  () {
    if (this.state.more) {
      return (<View style={[Global._styles.CENTER,{width:Global.getScreen().width,height:80,}]}><Text>waitting ！！！</Text></View>);
    }
    return (<View style={[Global._styles.CENTER,{width:Global.getScreen().width,height:80,}]}><Text>没有照片了！</Text></View>);
  }

  // rowData is an array of images
  _renderRow(rowData, sectionID, rowID)  {
    // console.log("--------------------------------------------------");
    // console.log(rowID);
    // console.log("---------------------------------------------------");

    var images = rowData.map((image) => {
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

  _appendAssets(data) {
    var assets = data.edges;
    var newState={};
    //获取的data中，如果后面还有照片则 
    if (!data.page_info.has_next_page) {
      newState.more = false;
    }
    if (assets.length > 0) {
      newState.lastCursor = data.page_info.end_cursor;
      newState.assets = this.state.assets.concat(assets);
      newState.dataSource = this.state.dataSource.cloneWithRows(
        this.groupByEveryN(newState.assets, this.props.imagesPerRow)
      );
    }
    this.setState(newState);
  }
  //无限加载，获取下次数据。
  _onEndReached () {

    if (this.state.more) {
      this.fetch();
    }
  }
  onSelect (photo,rowID,index) {
    //index : 2 双击 选择照片取消 1：选择照片
    if( this.state.selectedPhotos.length == 0 && index === 1 ){
      this.state.selectedPhotos.push(photo.node.image);
    }else if( this.state.selectedPhotos.contains(photo.node.image) && index === 2){
      //去除
      this.state.selectedPhotos = [];

    }else{
      Alert.alert(
        '提示',
        '照片选择数量超过允许值!',
        [
          {
            text: '确定', onPress: () => {
            this.setState({selectedPhotos: [],});
          }
          }
        ]
      );
    }
    var kk =  parseInt( rowID )* this.props.imagesPerRow ;
    //修改listView 的dataSource 使listView 中的rowData 发生变化 ，重新渲染该照片所在的row 
    for( var jj = 0 ; jj < this.props.imagesPerRow ; jj++){
      var photoItems1 = this.state.assets.slice( kk + jj, kk + jj + 1 );
      var photoItem1 = photoItems1[0];
      if(photoItem1.node.image==photo.node.image){
        this.state.assets.splice(kk + jj, 1,
          { node:
            { timestamp: photo.node.timestamp,
              group_name: photo.node.group_name,
              type: photo.node.type,
              selected: true,
              image: photo.node.image,
            } }
        );
      }

    }
    this.setState({
      selectedPhotos: this.state.selectedPhotos,
      dataSource: this.state.dataSource.cloneWithRows(
        this.groupByEveryN(this.state.assets, this.props.imagesPerRow)
      ),
    });
  }
  confirm () {
    if(this.state.selectedPhotos.length == 0)
      this.toast('您尚未选择照片')
    else {
      var photos = this.state.selectedPhotos[0];
      if(typeof this.props.selected == 'function') {
        this.props.selected(photos);
        this.props.navigator.pop();
      }
    }
  }
  refresh(){
    this.setState({
      assets: [],
      groupTypes: this.props.groupTypes,
      lastCursor: null,//获取相册后的最后的游标，用于赋值给下次getPhotos的after
      assetType: this.props.assetType,
      more: true, //是否还有数据 true 有 false 没有
      doRenderScene: false,
      userInfo: this.props.userInfo,
      selectedPhotos: [],
    });
  }
  renderImage (asset, rowID) {
    var imageSize = Global.getScreen().width/4;
    if(this.state.selectedPhotos.contains(asset.node.image)){
      return (
        <TouchableOpacity key={'ap_' + asset.node.timestamp} style={[Global._styles.CENTER, styles.imageHolder]} onPress={() => this.onSelect(asset,rowID,2)} >
          <Image key={asset.node.timestamp}
                 source={asset.node.image}
                 style={styles.image} />
          <EasyIcon iconLib='fa' name='check-circle' size={20} color={Global._colors.IOS_GRAY_FONT} style={[styles.icon]} />
        </TouchableOpacity>
      );
    }else {
      return (
        <TouchableOpacity key={'ap_' + asset.node.timestamp} style={[Global._styles.CENTER, styles.imageHolder]} onPress={() => this.onSelect(asset,rowID,1)} >
          <Image key={asset.node.timestamp}
                 source={asset.node.image}
                 style={styles.image} />

        </TouchableOpacity>);
    }
  }
  goPop (){
    this.props.navigator.pop();
  }
  render() {
    if(!this.state.doRenderScene)
      return this._renderPlaceholderView();

    var buttonState = (this.state.selectedPhotos.length == 1) ? false : true ;
    return (
      <View style = {[Global._styles.CONTAINER]} >
        {this._getNavBar()}
        <ListView
          renderRow={this._renderRow}
          renderFooter={this._renderFooterSpinner}
          onEndReached={this._onEndReached}
          style={styles.container}
          enableEmptySections = {true}
          dataSource={this.state.dataSource}
          pageSize={20 }/>
        <View style = {{flexDirection: 'row', marginTop: 0,marginLeft: 10,marginRight: 10}} >
          <Button text = "取消" onPress = {this.goPop} clear={true}  />
          <Separator width = {Global.getScreen().width/3*2} />
          <Button text = "确定" onPress = {()=>{this.confirm()}} clear={true} disabled={buttonState} />
        </View>
      </View>

    );
  }
  _renderPlaceholderView () {
    return (
      <View style={[Global._styles.CONTAINER, {backgroundColor: 'white'}]} >
        {this._getNavBar()}
      </View>
    );
  }
  _getNavBar(){
    return(
      <NavBar
        navigator={this.props.navigator}
        route={this.props.route}
        hideBackButton = {false}
        title={"相册"}
        backText={"选择头像"} />
    );
  }
}

var styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    flex: 1,
  },
  url: {
    fontSize: 9,
    marginBottom: 14,
  },
  image: {
    width: (Global.getScreen().width-2)/4 - 2,
    height: (Global.getScreen().width-2)/4 - 2,
  },
  info: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  imageHolder: {
    width: (Global.getScreen().width-2)/4,
    height: (Global.getScreen().width-2)/4,
    margin: 1,
  },
  icon: {
    backgroundColor: 'transparent',
    position: 'absolute',
    bottom: 3,
    right: 3,
  },
});

export default CameraRollView ;