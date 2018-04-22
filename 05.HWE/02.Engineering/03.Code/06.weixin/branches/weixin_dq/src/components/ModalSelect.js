import React, { PureComponent } from 'react';
import { Modal, Radio } from 'antd-mobile';
import PropTypes from 'prop-types';
import { clientHeight } from '../utils/common';

const { RadioItem } = Radio;

export default class ModalSelect extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      selectedItem: { value: props.defaultValue, label: null },
    };
  }

  render() {
    const { visible, onClose, data, onSelect } = this.props;
    const { selectedItem } = this.state;

    return (
      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onClose={() => onClose(selectedItem)}
        style={{ width: '80%' }}
      >
        <div style={{ maxHeight: (clientHeight * 0.8) }}>
          {
            data.map(item => (
              <RadioItem
                key={item.value}
                checked={selectedItem.value === item.value}
                onClick={() => {
                  this.setState(
                    { selectedItem: item },
                    () => onSelect(item),
                  );
                }}
              >
                <span style={{ fontSize: '14px' }}>{item.label}</span>
              </RadioItem>
            ))
          }
        </div>
      </Modal>
    );
  }
}

ModalSelect.propTypes = {
  visible: PropTypes.bool,
  data: PropTypes.arrayOf(PropTypes.shape({
    value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    label: PropTypes.string,
  })),
  defaultValue: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  onClose: PropTypes.func,
  onSelect: PropTypes.func,
};

ModalSelect.defaultProps = {
  visible: false,
  data: [
    { value: 0, label: '选项1' },
    { value: 1, label: '选项2' },
  ],
  defaultValue: 0,
  onClose: () => {},
  onSelect: () => {},
};
