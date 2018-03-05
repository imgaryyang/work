import React, { Component } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
} from 'react-native';
import Sep from 'rn-easy-separator';
import moment from 'moment';
import Portrait from 'rn-easy-portrait';

import Global from '../../Global';
import Form from '../../modules/form/EasyForm';
import FormConfig from '../../modules/form/config/LineInputsConfig';
import { base } from '../../services/RequestTypes';

class NewsContent extends Component {
    static displayName = 'NewsContent';
    static description = '详情信息';

    state = {
      value: (
        this.props.navigation.state.params.data ?
          Object.assign({}, this.props.navigation.state.params.data) : null
      ),
      showLabel: true,
      labelPosition: 'left',
    }

    componentDidMount() {
      this.props.navigation.setParams({
        title: this.state.value.caption,
      });
    }
    form = null;
    render() {
      if (typeof this.state.value.image === 'undefined' || this.state.value.image === '' || this.state.value.image === null) {
        return (
          <View style={[Global.styles.CONTAINER]}>
            <ScrollView style={styles.scrollView} >
              <Form
                ref={(c) => { this.form = c; }}
                config={FormConfig}
                showLabel={this.state.showLabel}
                labelPosition={this.state.labelPosition}
                labelWidth={100}
                value={this.state.value}
              >
                <View radius={8} style={{ margin: 10 }} >
                  <Text style={styles.titleText}>{this.state.value.caption}</Text>
                  <Sep height={3} />
                  <Text style={styles.addText}>{moment(this.state.value.createdAt).format('YYYY-MM-DD HH:MM')}</Text>
                  <Sep height={23 / 2} />
                  <Text style={styles.text}>{this.state.value.digest}</Text>
                  <Sep height={10} />
                  <Text style={styles.text}>{this.state.value.body}</Text>
                </View>

              </Form>
            </ScrollView>
          </View>
        );
      } else {
        const uriBefore = base().img + this.state.value.image;
        const uriAfter = new Date().getTime();
        const uriImage = `${uriBefore}?timestamp=${uriAfter}`;
        const portrait = (
          <Portrait
            width={Global.screen.width - 20}
            height={(Global.screen.width - 20) * (177 / 340)}
            imageSource={{ uri: uriImage }}
          />
        );
        return (
          <View style={[Global.styles.CONTAINER]}>
            <ScrollView style={styles.scrollView} >
              <Form
                ref={(c) => { this.form = c; }}
                config={FormConfig}
                showLabel={this.state.showLabel}
                labelPosition={this.state.labelPosition}
                labelWidth={100}
                value={this.state.value}
              >
                <View radius={8} style={{ margin: 10 }} >
                  <Text style={styles.titleText}>{this.state.value.caption}</Text>
                  <Text style={styles.addText}>{moment(this.state.value.createdAt).format('YYYY-MM-DD HH:MM')}</Text>
                  <Sep height={23 / 2} />
                  <Text style={styles.text}>{this.state.value.digest}</Text>
                  <Sep height={10} />
                  <View>
                    {portrait}
                  </View>
                  <Sep height={10} />
                  <Text style={styles.text}>{this.state.value.body}</Text>
                </View>

              </Form>
            </ScrollView>
          </View>
        );
      }
    }
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },

  fieldSet: {
    borderLeftWidth: 4,
    borderLeftColor: 'brown',
    paddingLeft: 10,
    paddingTop: 15,
    paddingBottom: 15,
    backgroundColor: Global.colors.IOS_GRAY_BG,
  },

  titleText: {
    fontSize: 19,
    color: Global.colors.FONT,
    // fontWeight: 'bold',
    // textAlign: 'center',
  },

  addText: {
    fontSize: 12,
    color: Global.colors.FONT_LIGHT_GRAY1,
  },
  text: {
    fontSize: 15,
    color: Global.colors.FONT_GRAY,
  },
});
NewsContent.navigationOptions = ({ navigation }) => ({
  headerTitle: navigation.state.params ? navigation.state.params.title : '详细信息',
});

export default NewsContent;
