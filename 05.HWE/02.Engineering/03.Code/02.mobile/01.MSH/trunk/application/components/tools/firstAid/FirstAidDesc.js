import React, {
  Component,
} from 'react';

import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  InteractionManager,
  TouchableOpacity,
  ActivityIndicator, Alert,
} from 'react-native';

import Card from 'rn-easy-card';
import Sep from 'rn-easy-separator';
import Global from '../../../Global';
import { listFirstAidByType } from '../../../services/tools/FirstAidService';
import { filterHtmlForWiki } from '../../../utils/Filters';


class FirstAidDesc extends Component {
    static displayName = 'FirstAidDesc';
    static description = '急救详情';

    static renderPlaceholderView() {
      return (
        <View style={[Global.styles.INDICATOR_CONTAINER]} >
          <ActivityIndicator />
        </View>
      );
    }


    state = {
      doRenderScene: false,
      data: {},
    };


    componentDidMount() {
      InteractionManager.runAfterInteractions(() => {
        this.setState({ doRenderScene: true });
      });
      this.props.navigation.setParams({
        title: '急救介绍',
      });
    }


    render() {
      if (!this.state.doRenderScene) {
        return FirstAidDesc.renderPlaceholderView();
      }
      const value = this.props.navigation.state.params.item;
      return (
        <View style={Global.styles.CONTAINER_BG} >
          <ScrollView style={styles.scrollView} >
            <Card fullWidth style={{ borderTopWidth: 0 }} >
              <Text style={{ fontSize: 16, color: 'black', fontWeight: '600' }} >{filterHtmlForWiki(value.fakName)}</Text>
              <Text style={{ fontSize: 13, color: Global.colors.FONT_GRAY, marginTop: 5 }} >{filterHtmlForWiki(value.fakDetails)}</Text>

            </Card>


          </ScrollView>
        </View>
      );
    }
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },

  title: {
    marginTop: 10,
    fontSize: 18,
  },
  Detail: {
    fontSize: 15,

  },

  content: {
    width: Global.getScreen().width,
    paddingLeft: 13,
    marginTop: 10,
  },
  list: {
    backgroundColor: '#ffffff',
  },
  A: {
    borderBottomWidth: 1 / Global.pixelRatio,
    borderBottomColor: Global.colors.LINE,
    paddingLeft: 15,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  B: {
    flex: 1,
    color: '#000000',
    fontSize: 14,
    fontWeight: '600',

  },
  C: {
    width: 90,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  D: {
    flex: 1,
    color: Global.colors.IOS_BLUE,
    fontSize: 12,
    // backgroundColor: 'red',
    textAlign: 'right',
  },
});

FirstAidDesc.navigationOptions = {
  title: '急救列表',
};

export default FirstAidDesc;

