import React, { PureComponent } from 'react';
import {
  Modal,
} from 'antd-mobile';
import moment from 'moment';
import classnames from 'classnames';
import { colors } from '../../utils/common';
import Icon from '../../components/FAIcon';
import less from './AppointRecord.less';

export function getStatusName(status) {
  switch (status) {
    case '0':
      return '预留';
    case '1':
      return '已预约';
    case '2':
      return '已签到';
    case '3':
      return '已呼叫';
    case '4':
      return '已刷卡';
    case '5':
      return '已完成';
    case '9':
      return '已取消';
    case 'Z':
      return '已过期';
    default:
      return status;
  }
}

export default class AppointRecord extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      selected: false,
    };
  }

  toggleDetail = () => {
    this.setState({ selected: !this.state.selected });
  };


  render() {
    const { data, noCard, onSubmit } = this.props;
    const { selected } = this.state;
    const {
      clinicDate,
      clinicTypeName,
      docName,
      docJobTitle,
      depName,
      address,
      num,
      totalFee,
      status,
      proNo,
      proName,
      idNo,
      mobile,
    } = data;
    const clinicTime = (data.clinicTime || '').slice(11, 16);
    const statusName = getStatusName(status);
    const weekday = `周${'日一二三四五六'.charAt(moment(clinicDate, 'YYYY-MM-DD').day())}`;

    return (
      <div className={less.container}>
        <div className={less.header}>
          <div className={less.thumb} />
          <div className={less.main}>{docName}</div>
          <div className={less.extra}>{docJobTitle}</div>
          {
            status === '1' ?
              <div className={less.status}>
                <div
                  className={less.button}
                  onClick={() => Modal.alert(
                    null,
                    <div className={less.alert}>您是否要取消预约？</div>,
                    [
                      { text: '取消', style: { fontSize: '15px' } },
                      {
                        text: '确定',
                        style: { color: colors.ORANGE, fontSize: '15px' },
                        onPress: () => {
                          if (typeof onSubmit === 'function') onSubmit(data);
                        }
                      }
                    ],
                  )}
                >
                  <div className={less.text}>取消预约</div>
                </div>
              </div> :
              <div className={less.status}>
                <div className={less.view}>
                  <div className={less.text}>{statusName}</div>
                </div>
              </div>
          }
          <div onClick={this.toggleDetail}>
            <Icon type={selected ? 'chevron-up' : 'chevron-down'} className={less.icon} color={colors.IOS_ARROW} />
          </div>
        </div>
        <div className={less.row}>
          <div className={less.label}>科室</div>
          <div className={less.content}>{depName}</div>
        </div>
        <div className={less.row}>
          <div className={less.label}>时间</div>
          <div className={classnames(less.content, less.fontOrange)}>{clinicDate}  {weekday}  {clinicTime}</div>
        </div>
        <div className={less.row}>
          <div className={less.label}>类型</div>
          <div className={less.content}>{clinicTypeName}</div>
        </div>
        {
          selected ?
            (
              <div>
                <div className={less.row}>
                  <div className={less.label}>位置</div>
                  <div className={less.content}>{address}</div>
                </div>
                <div className={less.row}>
                  <div className={less.label}>序号</div>
                  <div className={less.content}>{num}</div>
                </div>
                <div className={less.row}>
                  <div className={less.label}>费用</div>
                  <div className={less.content}>{totalFee}</div>
                </div>
                <div className={less.row}>
                  <div className={less.label}>姓名</div>
                  <div className={less.content}>{proName}</div>
                </div>
                <div className={less.row}>
                  <div className={less.label}>手机号</div>
                  <div className={less.content}>{mobile}</div>
                </div>
                <div className={less.row}>
                  <div className={less.label}>身份证号</div>
                  <div className={less.content}>{idNo}</div>
                </div>
                {
                  noCard ?
                    null :
                    <div className={less.row}>
                      <div className={less.label}>卡号</div>
                      <div className={less.content}>{proNo}</div>
                    </div>
                }
              </div>
            ) :
            null
        }
      </div>
    );
  }
}
