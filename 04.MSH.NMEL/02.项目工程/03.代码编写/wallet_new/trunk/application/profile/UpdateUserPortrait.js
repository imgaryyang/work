"use strict";

import React, {
    Component,
    PropTypes,
} from 'react';

import {
    View,
    Text,
    Image,
    TouchableOpacity,
    StyleSheet,
    TextInput,
    InteractionManager,
} from "react-native";

import NavBar       from '../store/common/TopNavBar';
import * as Global  from '../Global';
import ImagePicker from 'react-native-image-picker';
import Button   from 'rn-easy-button';
import MimeType   from './common/MimeType';
const SAVE_URL 			= '/el/base/images/upload';
const IMAGES_URL    	= 'el/base/images/view/';
const SAVE_PORTRAIT_URL = '/el/user/setPortrait';
import UserStore        from '../flux/UserStore';
import UserAction       from '../flux/UserAction';
export default class UpdateUserPortrait extends Component {
    constructor(props) {
        super(props);
        this.state = {
            avatarSource:null,
            doRenderScene: false,
            userInfo1: this.props.userInfo,
            buttonState: false,
        };
        this._file = null;
        this._pid= null;
    }
    componentDidMount () {
      InteractionManager.runAfterInteractions(() => {
        this.setState({doRenderScene: true});
      });
    }
    _getNavBar () {
        let rightButtons = (
              <View style={styles.container} >
                <TouchableOpacity style={styles.item} onPress={()=>this._selectPhotoTapped()} >
                  <Image style={styles.img} resizeMode="cover" source={require('./images/user_portrait_select.png')} />
                </TouchableOpacity>
              </View>);
        return (
            <NavBar title = "选择头像"
                    navigator = {this.props.navigator}
                    route = {this.props.route}
                    hideBackButton = {false}
                    hideBottomLine = {false} 
                    rightButtons={rightButtons}
                    />
        );
    }
    _selectPhotoTapped(){
       const options = {
          title:'',
          cancelButtonTitle: '  取消',
          takePhotoButtonTitle: '  拍照',
          chooseFromLibraryButtonTitle: '  从相册选择',
          customButtons: {},
          cameraType:'front',
          mediaType: 'photo',
          durationLimit: 10,
          quality: 1.0,
          aspectX: 1,
          aspectY: 1, 
          maxWidth: 200,
          maxHeight: 200,
          angle: 0, 
          allowsEditing: false,
          noData: false, 
          storageOptions: {
            skipBackup: true,
            path: 'images'
          }

        };
        ImagePicker.showImagePicker(options, (response) => {
          if (response.didCancel) {
            console.log('User cancelled photo picker');
          }
          else if (response.error) {
            console.log('ImagePicker Error: ', response.error);
          }
          else if (response.customButton) {
            console.log('User tapped custom button: ', response.customButton);
          } else {
            this._file = Object.assign({},response);
            // Or:
            // if (Platform.OS === 'android') {
            //   source = {uri: response.uri, isStatic: true};
            // } else {
            //   source = {uri: response.uri.replace('file://', ''), isStatic: true};
            // }
            if(Global._os === 'ios'){
               this._file.uri = response.uri.replace('file://', '');
               this._file.fileName=this._file.uri.substring(this._file.uri.lastIndexOf('/') + 1);
               this._file.type=MimeType[this._file.fileName.substring(this._file.fileName.lastIndexOf('.') + 1)];
            }
            const source = {uri: this._file.uri, isStatic: true};
            this.setState({
              avatarSource: source,
              buttonState:true,
            });
      }
    });

    }
    async _savePhoto(){
      try {
        this.showLoading();
        let fileConfig 	= {
          uri: this._file.uri, 
          type: this._file.type, 
          name: this._file.fileName,
          };
        var form = new FormData();
        form.append("FormData", true);
        form.append("fkId", '1');
        form.append("fkType", '2');
        form.append("memo", '1234');
        form.append("resolution", '');
        form.append("sortNum", '0');
        form.append('file', fileConfig);
        var responseData = await this.request(Global._host + SAVE_URL, {
          headers: {
            "Content-Type": "multipart/form-data"
          },
          body: form,
        });
        this.hideLoading();
        if (responseData.success == false) {
          
        } else {
          this._pid = responseData.result.id;
          this.toast('保存头像成功！');
          //将头像id 存入 user表中
          await this.updatePortrait();
          UserAction.onUpdateUser(this.state.userInfo1);
          this.props.navigator.pop();
        }
      } catch(e) {
          this.hideLoading();
          this.handleRequestException(e);
      }

    }
    async updatePortrait (){
      try {
        this.showLoading();
        let responseData = await this.request(Global._host + SAVE_PORTRAIT_URL, {
          body: JSON.stringify({portrait:  this._pid}),
        });

        this.hideLoading();
        if (responseData.success == false) {
          
        } else {
          this.setState({userInfo1:responseData.result,});
        }
        //将头像id 存入 user表中
        this.toast('修改用户信息成功！');
      } catch(e) {
          this.hideLoading();
          this.handleRequestException(e);
      }
    }
    render() {
        var portraitImage = (this.state.avatarSource == null && this.state.userInfo1.portrait == null) ? 
							require('./images/user_portrait.png') : 
							(this.state.avatarSource != null ?this.state.avatarSource : {uri: Global._host + IMAGES_URL + this.state.userInfo1.portrait} );
        return (
             <View style={Global._styles.CONTAINER}>
               {this._getNavBar()}
               <View style={styles.imageView} >
                  <TouchableOpacity onPress={()=>this._selectPhotoTapped()}> 
                    <Image style={styles.image} resizeMode="cover" source={portraitImage} />
                  </TouchableOpacity>
               </View>
               <View>
                 {this.state.buttonState?<Button style={styles.button} onPress = {()=>{this._savePhoto()}} text='使用该头像'/> :
                     <Button style={styles.button} onPress = {()=>{this._selectPhotoTapped()}} text='选择照片'/>
                 }
               </View>
             </View>
        );
    };
}
UpdateUserPortrait.propTypes = {
    userInfo: PropTypes.object.isRequired,
};
const styles = StyleSheet.create({
  container: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'stretch',
		justifyContent: 'flex-end',
	},
	item: {
		paddingLeft: 10,
		paddingRight: 10,
		justifyContent: 'center',
	},
  img: {
    width:20,
    height:20,
	},
  button:{
    marginTop:40,
    marginHorizontal: 8,
    backgroundColor:Global.Color.RED,
      height: 48,
  },
  imageView:{
    marginTop:60,
    alignItems: 'center',
		justifyContent: 'center',
    padding:0,
  },
  image:{
    width:100,
    height:100,
    resizeMode: 'contain',
     borderRadius: 50,
  },
  buttonView:{
    marginTop:40,
  }
});