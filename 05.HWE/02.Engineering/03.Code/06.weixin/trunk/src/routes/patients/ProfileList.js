import React from 'react';
import { connect } from 'dva';
import { createForm } from 'rc-form';
import { List, Modal, Radio } from 'antd-mobile';

const { RadioItem } = Radio;
const { Item } = List;

class FormItem extends React.Component {
  componentWillMount() {
  }
  showModal() {
    this.props.dispatch({
      type: 'user/save',
      payload: {
        visible: true,
      },
    });
  }
  closeModal() {
    this.props.dispatch({
      type: 'user/save',
      payload: {
        visible: false,
      },
    });
  }
  selectItem(item) {
    this.props.dispatch({
      type: 'user/save',
      payload: {
        visible: false,
      },
    });
    this.props.dispatch({
      type: 'base/save',
      payload: {
        currProfile: item,
      },
    });
    const { callback } = this.props;
    if (typeof callback === 'function') {
      callback(item);
    }
  }
  render() {
    const { visible } = this.props.user;
    const { profiles, currProfile } = this.props.base;
    console.log('currProfile', currProfile);
    return (
      <List style={{ backgroundColor: 'white' }} className="picker-list">
        <Item arrow="horizontal" onClick={() => this.showModal()}>{ currProfile && currProfile.id ? `${currProfile.name} ${currProfile.no}` : '选择就诊人'}</Item>
        <Modal
          visible={visible}
          transparent
          animationType="fade"
          onClose={() => this.closeModal()}

        >
          {
            profiles.map((profile, index) => (
              <RadioItem key={index} checked={currProfile.id === profile.id} onClick={() => this.selectItem(profile)}>
                <List.Item.Brief>{profile.name} {profile.no}</List.Item.Brief>
              </RadioItem>

            ))
          }
        </Modal>
      </List>
    );
  }
}

FormItem.propTypes = {
};
const ProfileList = createForm()(FormItem);
export default connect(({ home, user, base }) => ({ home, user, base }))(ProfileList);
// {
//   profiles.map((profile, index) => (
//     <List.Item key={index} className={styles['placeholder']} onClick={() => this.selectItem(profile)}>
//       <span>{profile.name} {profile.no}</span>
//     </List.Item>
//   ))
// }
