'use strict';

import React, {
  Component,
} from 'react';

import {
  View,
  ScrollView,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  InteractionManager,
  DatePickerIOS,
  DatePickerAndroid,
  TimePickerAndroid,
} from 'react-native';

import * as Global  from '../../Global';
import EasyDatePicker   from '../../lib/EasyDatePicker';
import UserAction	from '../../flux/UserAction';
import UserStore	from '../../flux/UserStore';
import FAIcon       from 'react-native-vector-icons/FontAwesome';

import NavBar 		from 'rn-easy-navbar';
import {B, I, U, S} from 'rn-easy-text';
import Card 		from 'rn-easy-card';
import Button 		from 'rn-easy-button';
import EasyIcon 	from 'rn-easy-icon';
import EasyPicker 	from 'rn-easy-picker';
import Portrait 	from 'rn-easy-portrait';
import Sep 			from 'rn-easy-separator';
import Switcher 	from 'rn-easy-switcher';

class ComponentTest extends Component {

  static displayName = 'ComponentTest';
  static description = '组件测试';

  state = {
    doRenderScene: false,
  };

  constructor (props) {
    super(props);
  }

  componentDidMount () {
    InteractionManager.runAfterInteractions(() => {
      this.setState({doRenderScene: true});
    });
  }

  render () {
    if(!this.state.doRenderScene)
      return this._renderPlaceholderView();

    let picker1DS = [
      {label: 'Java', value: '1'},
      {label: 'C++', value: '2'},
      {label: 'C#', value: '3'},
      {label: 'Javascript', value: '4'},
      {label: 'Html', value: '5'},
      {label: 'CSS', value: '6'},
      {label: 'Ruby', value: '7'},
      {label: 'Basic', value: '8'},
      {label: 'Go', value: '9'},
      {label: 'Objective C', value: '10'},
      {label: 'SQL', value: '11'},
      {label: 'Visual Basic', value: '12'},
      {label: 'VBScript', value: '13'},
    ];

    let picker2DS = [
      {label: 'Microsoft', value: '1'},
      {label: 'IBM', value: '2'},
      {label: 'Apple', value: '3'},
      {label: 'Google', value: '4'},
      {label: 'Facebook', value: '5'},
      {label: 'Cisco', value: '6'},
    ];

    return (
      <View style = {[Global._styles.CONTAINER]} >
        {this._getNavBar()}
        <ScrollView style = {styles.scrollView} >

          <View style = {{borderLeftWidth: 4, borderLeftColor: 'brown', paddingLeft: 10, marginBottom: 20, marginTop: 20}} ><Text>lib.EasyCard</Text></View>
          <Card fullWidth = {true} >
            <Text>content in EasyCard</Text>
          </Card>

          <View style = {{borderLeftWidth: 4, borderLeftColor: 'brown', paddingLeft: 10, marginBottom: 20, marginTop: 20}} ><Text>lib.EasyButton</Text></View>

          <Card radius = {8} style = {{margin: 20}} >
            <Button text = "保存" style = {{marginTop: 10}} onPress = {() => {
              console.log('do save.....');
              this.setState({btn2Disabled: !this.state.btn2Disabled});
            }} />

            <Button text = "测试吧" theme = {Button.THEME.ORANGE} disabled = {this.state.btn2Disabled} outline = {true} size = "small" style = {{marginTop: 10}} onPress = {() => {
              console.log('do test.....');
            }} />

            <View style={{flexDirection: 'row', marginTop: 10}} >
              <Button text = "测试吧1" theme = {Button.THEME.ORANGE} disabled = {this.state.btn2Disabled} onPress = {() => {
                console.log('do test111.....');
              }} />
              <Sep width = {10} />
              <Button text = "测试吧2" disabled = {this.state.btn2Disabled} onPress = {() => {
                console.log('do test222.....');
              }} />
            </View>

            <Button text = "测试吧" style = {{marginTop: 10, flexDirection: 'row'}} onPress = {() => {
              console.log('do test xxxx.....');
            }} >
              <FAIcon name = "flag" size = {20} color = "#ffffff" />
              <Text style = {{color: '#ffffff', marginLeft: 10}} >达盖尔的旗帜</Text>
            </Button>

            <Button text = "测试吧" style = {{marginTop: 10, width: 120, height: 80}} onPress = {() => {
              console.log('do test zzz.....');
            }} >
              <FAIcon name = "flag" size = {20} color = "#ffffff" />
              <Text style = {{color: '#ffffff'}} >达盖尔的旗帜</Text>
            </Button>
          </Card>

          <View style = {{borderLeftWidth: 4, borderLeftColor: 'brown', paddingLeft: 10, marginBottom: 20, marginTop: 20}} ><Text>lib.EasyIcon</Text></View>

          <Card style = {{margin: 10}} >
            <View style = {{flexDirection: 'row'}} >
              <EasyIcon name = 'ios-card' />
              <Sep width = {15} />
              <EasyIcon iconLib = "fa" name = 'gitlab' />
              <Sep width = {15} />
              <EasyIcon iconLib = "FontAwesome" name = 'gitlab' color = '#ffffff' bgColor = {Global._colors.IOS_RED} size = {18} width = {30} height = {30} radius = {5} />
              <Sep width = {15} />
              <EasyIcon iconLib = "mi" name = 'android' color = '#ffffff' bgColor = {Global._colors.IOS_RED} size = {20} width = {40} height = {40} radius = {20} />
              <Sep width = {15} />
              <EasyIcon iconLib = "fd" name = 'social-reddit' color = {Global._colors.IOS_RED} borderColor = {Global._colors.IOS_RED} borderWidth = {1 / Global._pixelRatio} size = {25} width = {40} height = {40} radius = {20} />
              <Sep width = {15} />
              <EasyIcon iconLib = "oi" name = 'bug' color = 'white' bgColor = "rgba(254, 0, 0, .5)" size = {25} width = {40} height = {40} radius = {7} />
            </View>
          </Card>

          <Card style = {{margin: 10}} >
            <View style = {{flexDirection: 'row'}} >
              <EasyIcon name = 'ios-bulb' size = {38} color = "white" width = {60} height = {60} bgColor = 'rgba(255,102,0,1)' />
              <Sep width = {25} />
              <EasyIcon name = 'ios-water' size = {35} color = "white" width = {60} height = {60} bgColor = 'rgba(0,122,255,1)' />
              <Sep width = {25} />
              <EasyIcon name = 'md-flame' size = {35} color = "white" width = {60} height = {60} bgColor = 'rgba(255,59,48,1)' />
              <Sep width = {25} />
            </View>
          </Card>

          <View style = {{borderLeftWidth: 4, borderLeftColor: 'brown', paddingLeft: 10, marginBottom: 20, marginTop: 20}} ><Text>lib.EasyPicker</Text></View>

          <Card style = {{margin: 10}} >
            <EasyPicker
              ref = {(c) => this.easyPicker1 = c}
              dataSource = {picker1DS}
              selected = {this.state.skill}
              onChange = {(selected) => {
                this.setState({
                  skill: selected ? selected.label : null
                });
              }}
            />
            <EasyPicker
              ref = {(c) => this.easyPicker2 = c}
              dataSource = {picker2DS}
              selected = {this.state.co}
              onChange = {(selected) => {
                this.setState({
                  co: selected ? selected.label : null
                })
              }}
            />


            <View style = {{flexDirection: 'row'}} >
              <Button text = {this.state.skill ? this.state.skill : "Pick Skill"} outline = {true}
                      onPress = {() => this.easyPicker1.toggle()} />
              <Sep width = {10} />
              <Button text = {this.state.co ? this.state.co : "Pick Co."} outline = {true}
                      onPress = {() => this.easyPicker2.toggle()} />
            </View>

          </Card>

          <View style = {{borderLeftWidth: 4, borderLeftColor: 'brown', paddingLeft: 10, marginBottom: 20, marginTop: 20}} ><Text>lib.EasyDatePicker</Text></View>

          <Card style = {{margin: 10}} >
            <EasyDatePicker ref = {(c) => this.easyDatePicker = c} />

            <View style = {{flexDirection: 'row'}} >
              <Button text = "Pick Date" outline = {true}
                      onPress = {() => {
                        this.easyDatePicker.pickDate({
                          date: new Date()
                        }, (date) => {
                          console.log(
                            '-----onPicked in ComponentTest : '
                            + date.toLocaleDateString()
                            + date.toLocaleTimeString()
                          )
                        });
                      }} />
              <Sep width = {10} />
              <Button text = "Pick Time" outline = {true}
                      onPress = {() => {
                        this.easyDatePicker.pickTime({
                          hour: 11,
                          minute: 11,
                          is24Hour: true,
                        }, (date) => {
                          console.log(
                            '-----onPicked in ComponentTest : '
                            + date.toLocaleDateString()
                            + date.toLocaleTimeString()
                          )
                        });
                      }} />
              <Sep width = {10} />
              <Button text = "Pick DateTime" outline = {true}
                      onPress = {() => {
                        this.easyDatePicker.pickDateTime({
                          date: new Date()
                        }, (date) => {
                          console.log(
                            '-----onPicked in ComponentTest : '
                            + date.toLocaleDateString()
                            + date.toLocaleTimeString()
                          )
                        });
                      }} />
            </View>
          </Card>


          <View style = {{borderLeftWidth: 4, borderLeftColor: 'brown', paddingLeft: 10, marginBottom: 20, marginTop: 20}} ><Text>lib.EasyText</Text></View>

          <Card radius = {8} style = {{margin: 10}} >
            <Text><B>粗体、斜体及下划线</B></Text>
            <Text>As long as the world shall last there will be <U>wrongs</U>, and if no man rebelled, <B>those wrongs would last forever</B>. （ <I>C. Darrow</I> ）</Text>
          </Card>

          <Card radius = {8} style = {{margin: 10, backgroundColor: Global._colors.FONT_LIGHT_GRAY1}} >
            <Text><B>阴影</B></Text>
            <Text style = {{fontSize: 17, color: 'white'}} ><S>波多野结衣</S></Text>
          </Card>

          <View style = {{borderLeftWidth: 4, borderLeftColor: 'brown', paddingLeft: 10, marginBottom: 20, marginTop: 20}} ><Text>lib.EasyPortrait</Text></View>

          <Card radius = {8} style = {{margin: 10, flexDirection: 'row'}} >
            <Portrait imageSource = {require('../../res/images/user/u0002.jpg')} bgColor = {Global._colors.IOS_GRAY_BG} width = {50} height = {50} radius = {7} />
            <Sep width = {20} />
            <Portrait imageSource = {require('../../res/images/user/u0003.jpg')} bgColor = {Global._colors.IOS_GRAY_BG} width = {50} height = {50} radius = {25} />
          </Card>

          <View style = {{borderLeftWidth: 4, borderLeftColor: 'brown', paddingLeft: 10, marginBottom: 20, marginTop: 20}} ><Text>lib.EasySwitcher</Text></View>

          <Card radius = {8} style = {{margin: 10}} >
            <Switcher />
            <Sep height = {10} />
            <Switcher width = {100} height = {50} />
          </Card>

          <Button text = "Push Test" theme = {Button.THEME.ORANGE} size = "small" outline = {true}
                  style = {{margin: 20}}
                  onPress = {() =>
                    this.props.navigator.push({component: Test, hideNavBar: false})
                  }
          />

          <Button text = "logout" theme = {Button.THEME.ORANGE} size = "small" outline = {true}
                  style = {{margin: 20, marginTop: 0}}
                  onPress = {() =>
                    UserAction.logout({userName: null, name: null})
                  }
          />


          <Button text = "Test Update User" theme = {Button.THEME.ORANGE} size = "small" outline = {true}
                  style = {{margin: 20, marginTop: 0}}
                  onPress = {() => {
                    let user = UserStore.getUser();
                    if(user) {
                      user.gender = user.gender == '1'? '2': '1';
                      UserAction.onUpdateUser(user);
                    }
                  }
                  }
          />

          <Sep height = {100} />

        </ScrollView>
      </View>
    );
  }

  _renderPlaceholderView () {
    return (
      <View style = {[Global._styles.CONTAINER, , {backgroundColor: '#ffffff'}]} >
        {this._getNavBar()}
      </View>
    );
  }

  _getNavBar () {
    return (
      <NavBar title = '组件测试'
              navigator = {this.props.navigator}
              route = {this.props.route}
              hideBackButton = {false}
              hideBottomLine = {false} />
    );
  }

}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    lineHeight: 14,
    paddingLeft: 15,
    marginTop: 20,
    marginBottom: 20
  },
});

export default ComponentTest;



