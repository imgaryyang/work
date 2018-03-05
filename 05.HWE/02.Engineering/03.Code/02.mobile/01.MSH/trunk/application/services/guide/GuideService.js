import moment from 'moment';

import { get } from '../../utils/Request';
import { guide } from '../RequestTypes';

/**
 * 取未完成的就诊信息列表
 * @returns {Promise<*>}
 */
export async function getUnfinished() {
  return get(`${guide().unfinished}`);
}

/**
 * 根据类型及 id 取导诊信息
 * @param type op - 门诊；ip - 住院
 * @param id 就诊号 / 住院号
 * @returns {Promise<*>}
 */
export async function getGuidance(step/* type, id*/) {
  const groups = [];

  let step6 = null;
  if (step === 6) {
    step6 = { ...s6 };
    step6.steps = [s601, s602];
    groups[groups.length] = step6;
  } else if (step > 6) {
    step6 = { ...s6 };
    const s601x = { ...s601 };
    s601x.bizObject.state = '1';
    s601x.updateTime = getTime('10:03');
    const s602x = { ...s602 };
    s602x.bizObject.state = '1';
    s602x.updateTime = getTime('10:17');
    step6.steps = [s601x, s602x];
    groups[groups.length] = step6;
  }

  let step5 = null;
  if (step === 5) {
    step5 = { ...s5 };
    step5.steps = [s501];
    groups[groups.length] = step5;
  } else if (step > 5) {
    step5 = { ...s5 };
    step5.steps = [s502];
    groups[groups.length] = step5;
  }

  let step4 = null;
  if (step === 4) {
    step4 = { ...s4 };
    step4.steps = [s401, s402, s403];
    groups[groups.length] = step4;
  } else if (step > 4) {
    step4 = { ...s4 };
    const s401x = { ...s401 };
    s401x.bizObject.state = '2';
    const s402x = { ...s402 };
    s402x.bizObject.state = '2';
    const s403x = { ...s403 };
    s403x.bizObject.state = '2';
    step4.steps = [s401x, s402x, s403x];
    groups[groups.length] = step4;
  }

  let step3 = null;
  if (step === 3) {
    step3 = { ...s3 };
    step3.steps = [s301];
    groups[groups.length] = step3;
  } else if (step > 3) {
    step3 = { ...s3 };
    step3.steps = [s302];
    groups[groups.length] = step3;
  }

  let step2 = null;
  if (step === 2) {
    step2 = { ...s2 };
    step2.steps = [s203, s201];
    groups[groups.length] = step2;
  } else if (step > 2) {
    step2 = { ...s2 };
    step2.steps = [s204, s202];
    groups[groups.length] = step2;
  }

  const step1 = s1;// step <= 1 ? s1 : s1;
  groups[groups.length] = step1;

  return {
    success: true,
    result: {
      groups,
    },
  };
  // return get(`${guide().guidance}/${type}/${id}`);
}

function getTime(time) {
  return moment().format('YYYY-MM-DD ') + time;
}

const s1 = {
  name: '预约挂号',
  bizType: 'register',
  steps: [
    {
      updateTime: getTime('08:00'),
      bizObject: { deptId: '', deptName: '消化内科', deptAddr: '1号门诊楼8层C区', doctorId: '', doctorName: '何权瀛', description: '您成功预约了消化内科的何权瀛医生。' },
    },
  ],
};

const s201 = {
  updateTime: '',
  bizObject: { type: 'signin', state: '0', description: '您还未签到，请先签到。' },
};
const s202 = {
  updateTime: getTime('08:13'),
  bizObject: { type: 'signin', state: '1', description: '成功签到。' },
};
const s203 = {
  updateTime: '',
  bizObject: { type: 'diagnosis', state: '0', deptId: '', deptName: '消化内科', deptAddr: '1号门诊楼8层C区', doctorId: '', doctorName: '何权瀛', description: '', diagnosis: '急性肠胃炎' },
};
const s204 = {
  updateTime: getTime('08:30'),
  bizObject: { type: 'diagnosis', state: '1', deptId: '', deptName: '消化内科', deptAddr: '1号门诊楼8层C区', doctorId: '', doctorName: '何权瀛', description: '', diagnosis: '急性肠胃炎' },
};
const s2 = {
  name: '看诊',
  bizType: 'diagnosis',
  steps: [],
};

const s301 = {
  updateTime: getTime('08:30'),
  bizObject: {
    id: '784u8sujw8291',
    state: '0',
    description: '',
    amount: 151,
    charges: [
      { name: '血检', receiveAmount: 80 },
      { name: '便常规', receiveAmount: 46 },
      { name: '尿常规', receiveAmount: 25 },
    ],
  },
};
const s302 = {
  updateTime: getTime('08:35'),
  bizObject: {
    id: '784u8sujw8291',
    state: '1',
    description: '',
    amount: 151,
    charges: [
      { name: '血检', receiveAmount: 80 },
      { name: '便常规', receiveAmount: 46 },
      { name: '尿常规', receiveAmount: 25 },
    ],
  },
};
const s3 = {
  name: '缴费',
  bizType: 'order',
  steps: [],
};

const s401 = {
  updateTime: '',
  bizObject: { name: '血检', state: '0' },
};
const s402 = {
  updateTime: '',
  bizObject: { name: '便常规', state: '1' },
};
const s403 = {
  updateTime: '',
  bizObject: { name: '尿常规', state: '2' },
};
const s4 = {
  name: '检查检验',
  bizType: 'check',
  steps: [],
};

const s501 = {
  updateTime: getTime('09:30'),
  bizObject: {
    id: '784u8sujw8292',
    state: '0',
    description: '',
    amount: 209.39,
    charges: [
      { name: '诺氟沙星胶囊', receiveAmount: 65.89 },
      { name: '健胃消食片', receiveAmount: 23.5 },
      { name: '苯丁哌胺', receiveAmount: 120 },
    ],
  },
};
const s502 = {
  updateTime: getTime('09:32'),
  bizObject: {
    id: '784u8sujw8292',
    state: '1',
    description: '',
    amount: 209.39,
    charges: [
      { name: '诺氟沙星胶囊', receiveAmount: 65.89 },
      { name: '健胃消食片', receiveAmount: 23.5 },
      { name: '苯丁哌胺', receiveAmount: 120 },
    ],
  },
};
const s5 = {
  name: '缴费',
  bizType: 'order',
  steps: [],
};

const s601 = {
  updateTime: '',
  bizObject: {
    description: '',
    deptName: '门诊西药房',
    deptAddr: '1号门诊楼西侧',
    state: '0',
    details: [
      { name: '诺氟沙星胶囊', unit: '盒', qty: 2 },
      { name: '苯丁哌胺', unit: '盒', qty: 1 },
    ],
  },
};
const s602 = {
  updateTime: '',
  bizObject: {
    description: '',
    deptName: '门诊中药房',
    deptAddr: '1号门诊楼东侧',
    state: '0',
    details: [
      { name: '健胃消食片', unit: '盒', qty: 4 },
    ],
  },
};
const s6 = {
  name: '取药',
  bizType: 'drug',
  steps: [],
};
