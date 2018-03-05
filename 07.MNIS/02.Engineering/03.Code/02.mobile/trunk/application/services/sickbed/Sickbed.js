
// 根据住院号取化验医嘱相关信息
export async function testOrder(inpatientNo) {
  const data = testOrders[inpatientNo];
  return {
    success: true,
    result: data || [],
  };
  // TODO: 正式系统从后台取
  // return get(`${sickbed().testOrder}/${inpatientNo}`, data);
}

// 根据化验条码取化验医嘱相关信息
export async function testOrderByBarcode(barcode) {
  const inpatientNo = testOrderBarcodes[barcode];
  if (!inpatientNo) {
    return {
      success: false,
      msg: '条码不存在',
    };
  }
  const data = testOrders[inpatientNo];
  return {
    success: true,
    result: data || [],
  };
  // TODO: 正式系统从后台取
  // return get(`${sickbed().testOrderByBarcode}/${barcode}`, data);
}

// 根据住院号取输液医嘱
export async function infusionOrder(inpatientNo) {
  const data = infusionOrders[inpatientNo];
  return {
    success: true,
    result: data || [],
  };
  // TODO: 正式系统从后台取
  // return get(`${sickbed().infusionOrder}/${inpatientNo}`, data);
}

// 根据输液条码取输液医嘱
export async function infusionOrderByBarcode(barcode) {
  const inpatientNo = infusionOrderBarcodes[barcode];
  const data = infusionOrders[inpatientNo];
  if (!inpatientNo) {
    return {
      success: false,
      msg: '条码不存在',
    };
  }
  return {
    success: true,
    result: data || [],
  };
  // TODO: 正式系统从后台取
  // return get(`${sickbed().infusionOrderByBarcode}/${barcode}`, data);
}

// 根据住院号取口服药医嘱
export async function oralMedicineOrder(inpatientNo) {
  const data = oralMedicineOrders[inpatientNo];
  return {
    success: true,
    result: data || [],
  };
  // TODO: 正式系统从后台取
  // return get(`${sickbed().oralMedicineOrder}/${inpatientNo}`, data);
}

// 根据住院号取化验组套信息
export async function testOrderStack(inpatientNo) {
  const data = testOrderStacks[inpatientNo];
  return {
    success: true,
    result: data || [],
  };
  // TODO: 正式系统从后台取
  // return get(`${sickbed().testOrder}/${inpatientNo}`, data);
}

// 根据住院号取化验组套信息
export async function testOrderResult(inpatientNo) {
  const data = testOrderResults[inpatientNo];
  return {
    success: true,
    result: data || [],
  };
  // TODO: 正式系统从后台取
  // return get(`${sickbed().testOrder}/${inpatientNo}`, data);
}
// 根据住院号取体征信息
export async function physicalSignCaptureHis(inpatientNo) {
  const data = physicalSignCaptureHis[inpatientNo];
  const head = physicalSignCaptureHead;
  return {
    success: true,
    result: {
      data: data || [],
      head: head || [],
    },
  };
  // TODO: 正式系统从后台取
  // return get(`${sickbed().testOrder}/${inpatientNo}`, data);
}

// 根据住院号取检查信息
export async function pacsOrderReult(inpatientNo) {
  const data = pacsOrderResults[inpatientNo];
  return {
    success: true,
    result: data || [],
  };
  // TODO: 正式系统从后台取
  // return get(`${sickbed().testOrder}/${inpatientNo}`, data);
}


// 根据住院号取手术信息
export async function operation(inpatientNo) {
  const data = operations[inpatientNo];
  return {
    success: true,
    result: data || [],
  };
  // TODO: 正式系统从后台取
  // return get(`${sickbed().testOrder}/${inpatientNo}`, data);
}

export async function operationByApp(applicationID,user) {
  const data = operationsByapp[applicationID];
  return {
    success: true,
    result: data || [],
  };
  // TODO: 正式系统从后台取
  // return get(`${sickbed().testOrder}/${inpatientNo}`, data);
}

const infusionOrderBarcodes = {
  68988769: '1800150',
  68988799: '1800150',
  68985599: '1800544',
};
const infusionOrders = {
  1800150: [
    {
      barcode: '68988769',
      inpatientNo: '1800150',
      roomNo: '01',
      bedNo: '001',
      patientName: '王永莲',
      gender: '女',
      age: '73',
      planedExecTime: '2018-01-20 08:00:00',
      drugName: '复合辅酸梅针F',
      spec: '100iu',
      dosage: '300iu',
      freq: 'QD早8',
      usage: 'ivgtt',
      desc: '40-60滴/分',
    },
    {
      barcode: '68988799',
      inpatientNo: '1800150',
      roomNo: '01',
      bedNo: '001',
      patientName: '王永莲',
      gender: '女',
      age: '73',
      planedExecTime: '2018-01-19 20:00:00',
      drugName: '氨溴索针4ml',
      spec: '4ml:30mg',
      dosage: '8ml',
      freq: 'q12h1',
      usage: 'iv',
      desc: '',
    },
  ],
  1800544: [
    {
      barcode: '68985599',
      inpatientNo: '1800544',
      roomNo: '01',
      bedNo: '003',
      patientName: '赵玉贤',
      gender: '女',
      age: '78',
      planedExecTime: '2018-01-20 08:00:00',
      drugName: '鼠神经生长因子',
      spec: '20ug',
      dosage: '20ug',
      freq: 'QD早8',
      usage: 'im',
      desc: '',
    },
  ],
};

// 口服药测试数据
const oralMedicineOrders = {
  1800150: [
    {
      id: '0001',
      inpatientNo: '1800150',
      roomNo: '01',
      bedNo: '001',
      patientName: '王永莲',
      gender: '女',
      age: '73',
      planedExecTime: '2018-01-20 08:00:00',
      drugName: '布洛芬',
      spec: '100＊2mg',
      dosage: '4mg',
      freq: 'QD早8',
      usage: '口服',
      desc: '',
    },
    {
      id: '0002',
      inpatientNo: '1800150',
      roomNo: '01',
      bedNo: '001',
      patientName: '王永莲',
      gender: '女',
      age: '73',
      planedExecTime: '2018-01-19 20:00:00',
      drugName: '维生素B6',
      spec: '100＊1mg',
      dosage: '2ml',
      freq: 'q12h1',
      usage: '口服',
      desc: '',
    },
  ],
  1800544: [
    {
      id: '0003',
      inpatientNo: '1800544',
      roomNo: '01',
      bedNo: '003',
      patientName: '赵玉贤',
      gender: '女',
      age: '78',
      planedExecTime: '2018-01-20 08:00:00',
      drugName: '布洛芬',
      spec: '100＊2mg',
      dosage: '2mg',
      freq: 'QD早8',
      usage: '口服',
      desc: '',
    },
  ],
};
const testOrderBarcodes = {
  8904007890: '1703629',
  8904567890: '1703629',
  8906688890: '1800544',
};

// 化验执行测试数据
const testOrders = {
  1703629: [
    {
      barcode: '8904007890',
      inpatientNo: '1703629',
      roomNo: '01',
      bedNo: '002',
      patientName: '王兰英',
      gender: '女',
      age: '79',
      isEmergency: true,
      orderTime: '2018-01-17 11:40:00',
      printTime: '2018-01-17 11:52:00',
      samplingOper: '',
      samplingTime: '',
      tube: '绿盖管',
      state: '已导入',
      sample: '血液',
      items: [
        {
          testName: '生化常规',
          memo: '',
        },
      ],
    },
    {
      barcode: '8904567890',
      inpatientNo: '1703629',
      roomNo: '01',
      bedNo: '002',
      patientName: '王兰英',
      gender: '女',
      age: '79',
      isEmergency: true,
      orderTime: '2018-01-17 11:40:00',
      printTime: '2018-01-17 11:52:00',
      samplingOper: '',
      samplingTime: '',
      tube: '红盖管',
      state: '已导入',
      sample: '血浆',
      items: [
        {
          testName: '血清果酸氨测定（糖三联）',
          memo: '',
        },
        {
          testName: '空腹葡萄糖测定（糖三联）',
          memo: '',
        },
        {
          testName: '肝功2',
          memo: '',
        },
      ],
    },
  ],
  1800544: [
    {
      barcode: '8906688890',
      inpatientNo: '1800544',
      roomNo: '01',
      bedNo: '003',
      patientName: '赵玉贤',
      gender: '女',
      age: '78',
      isEmergency: true,
      orderTime: '2018-01-17 11:40:00',
      printTime: '2018-01-17 11:52:00',
      samplingOper: '',
      samplingTime: '',
      tube: '红盖管',
      state: '已导入',
      sample: '血浆',
      items: [
        {
          testName: '电解质1',
          memo: '',
        },
        {
          testName: '脂类1',
          memo: '',
        },
        {
          testName: '肾功1',
          memo: '',
        },
      ],
    },
  ],
};

// 化验结果查询测试数据
const testOrderStacks = {
  1703629: [
    {
      inpatientNo: '1703629',
      orderNO: '100',
      testName: '生化常规',
      memo: '急',
      barcode: '8904007890',
      isEmergency: true,
      orderTime: '2018-01-17 11:40:00',
      printTime: '2018-01-17 11:52:00',
      reportTime: '2018-01-18 11:52:00',
      state: '已导入',
      sample: '血液',
    },
    {
      inpatientNo: '1703629',
      orderNO: '101',
      testName: '血液常规',
      memo: '明早8点',
      barcode: '8904007890',
      isEmergency: false,
      orderTime: '2018-01-17 11:40:00',
      printTime: '2018-01-17 11:52:00',
      reportTime: '',
      state: '已报告',
      sample: '血液',
    },
    {
      inpatientNo: '1703629',
      orderNO: '102',
      testName: '尿液常规',
      memo: '明早8点',
      barcode: '8904007890',
      isEmergency: false,
      orderTime: '2018-01-17 11:40:00',
      printTime: '2018-01-17 11:52:00',
      reportTime: '',
      state: '已导入',
      sample: '尿液',
    },
  ],
  1800150: [
    {
      inpatientNo: '1800150',
      orderNO: '110',
      testName: '生化常规',
      memo: '急',
      barcode: '8904007890',
      isEmergency: true,
      orderTime: '2018-01-17 11:40:00',
      printTime: '2018-01-17 11:52:00',
      reportTime: '2018-01-18 11:52:00',
      state: '已采集',
      sample: '血液',
    },
    {
      inpatientNo: '1800150',
      orderNO: '111',
      testName: '血液常规',
      memo: '明早8点',
      barcode: '8904007890',
      isEmergency: false,
      orderTime: '2018-01-17 11:40:00',
      printTime: '2018-01-17 11:52:00',
      reportTime: '',
      state: '已报告',
      sample: '血液',
    },
    {
      inpatientNo: '1800150',
      orderNO: '112',
      testName: '尿液常规',
      memo: '明早8点',
      barcode: '8904007890',
      isEmergency: false,
      orderTime: '2018-01-17 11:40:00',
      printTime: '2018-01-17 11:52:00',
      reportTime: '',
      state: '已送检',
      sample: '尿液',
    },
  ],
};
const testOrderResults = {
  101: [
    {
      orderNO: '101',
      name: '*白细胞',
      result: '4.12',
      flag: '0',
      range: '4.00——10.00',
      unit: '10^9/L',
    },
    {
      orderNO: '100',
      name: '中性细胞绝对值',
      result: '1.80',
      flag: '2',
      range: '2.00——7.50',
      unit: '10^9/L',
    },
    {
      orderNO: '100',
      name: '淋巴细胞绝对值',
      result: '4.20',
      flag: '1',
      range: '0.80——4.00',
      unit: '10^9/L',
    },
    {
      orderNO: '100',
      name: '单核细胞绝对值',
      result: '0.32',
      flag: '0',
      range: '0.12——0.80 ',
      unit: '10^9/L',
    },
    {
      orderNO: '100',
      name: '嗜酸细胞绝对值',
      result: '0.11',
      flag: '0',
      range: '0.20——0.50',
      unit: '10^9/L',
    },
    {
      orderNO: '100',
      name: '嗜碱细胞绝对值',
      result: '0.06',
      flag: '0',
      range: '0.00——0.10',
      unit: '10^9/L',
    },
    {
      orderNO: '100',
      name: '中性细胞百分比',
      result: '43.60',
      flag: '2',
      range: '50.00——75.00',
      unit: '%',
    },
    {
      orderNO: '100',
      name: '淋巴细胞百分比',
      result: '44.4',
      flag: '1',
      range: '20.00——44.00',
      unit: '%',
    },
    {
      orderNO: '100',
      name: '单核细胞百分比',
      result: '7.80',
      flag: '0',
      range: '3.00——8.00',
      unit: '%',
    },
    {
      orderNO: '100',
      name: '嗜酸细胞百分比',
      result: '2.70',
      flag: '0',
      range: '0.50——5.00 ',
      unit: '%',
    },
    {
      orderNO: '100',
      name: '嗜碱细胞百分比',
      result: '1.50',
      flag: '1',
      range: '0.00——1.00',
      unit: '%',
    },
    {
      orderNO: '100',
      name: '*红细胞',
      result: '5.07',
      flag: '1',
      range: '3.50——5.00',
      unit: '10^9/L',
    },
    {
      orderNO: '100',
      name: '*血红蛋白',
      result: '153',
      flag: '1',
      range: '110——150',
      unit: 'g/L',
    },
    {
      orderNO: '100',
      name: '*红细胞压积',
      result: '0.45',
      flag: '1',
      range: '0.370——0.430',
      unit: '',
    },
    {
      orderNO: '100',
      name: '平均红细胞体积',
      result: '88.8',
      flag: '0',
      range: '88.2——95.0',
      unit: 'fL',
    },
    {
      orderNO: '100',
      name: '平均血红蛋白含量',
      result: '30.2',
      flag: '0',
      range: '27.0——31.0 ',
      unit: 'pg',
    },
    {
      orderNO: '100',
      name: '平均血红蛋白浓度',
      result: '340',
      flag: '0',
      range: '320——360',
      unit: 'g/L',
    },
    {
      orderNO: '100',
      name: '红细胞分布宽度标准差',
      result: '44.6',
      flag: '0',
      range: '37.00——54.00',
      unit: 'fL',
    },
    {
      orderNO: '100',
      name: '红细胞分布宽度变异系数',
      result: '13.90',
      flag: '0',
      range: '12.00——15.00',
      unit: '%',
    },
    {
      orderNO: '100',
      name: '*血小板',
      result: '205',
      flag: '0',
      range: '100——300',
      unit: '10^9/L',
    },
    {
      orderNO: '100',
      name: '平均血小板体积',
      result: '12.80',
      flag: '1',
      range: '9.40——12.50',
      unit: 'fL',
    },
    {
      orderNO: '100',
      name: '血小板压积',
      result: '0.26',
      flag: '0',
      range: '0.114——0.282 ',
      unit: '',
    },
    {
      orderNO: '100',
      name: '血小板分布宽度',
      result: '19.2',
      flag: '1',
      range: '15.50——18.10',
      unit: '%',
    },
    {
      orderNO: '100',
      name: '大血小板比率',
      result: '46.1',
      flag: '1',
      range: '11——43',
      unit: '%',
    },
  ],
  111: [
    {
      orderNO: '111',
      name: '*白细胞',
      result: '4.12',
      flag: '0',
      range: '4.00——10.00',
      unit: '10^9/L',
    },
    {
      orderNO: '111',
      name: '中性细胞绝对值',
      result: '1.80',
      flag: '2',
      range: '2.00——7.50',
      unit: '10^9/L',
    },
    {
      orderNO: '111',
      name: '淋巴细胞绝对值',
      result: '4.20',
      flag: '1',
      range: '0.80——4.00',
      unit: '10^9/L',
    },
    {
      orderNO: '111',
      name: '单核细胞绝对值',
      result: '0.32',
      flag: '0',
      range: '0.12——0.80 ',
      unit: '10^9/L',
    },
    {
      orderNO: '111',
      name: '嗜酸细胞绝对值',
      result: '0.11',
      flag: '0',
      range: '0.20——0.50',
      unit: '10^9/L',
    },
    {
      orderNO: '111',
      name: '嗜碱细胞绝对值',
      result: '0.06',
      flag: '0',
      range: '0.00——0.10',
      unit: '10^9/L',
    },
    {
      orderNO: '111',
      name: '中性细胞百分比',
      result: '43.60',
      flag: '2',
      range: '50.00——75.00',
      unit: '%',
    },
    {
      orderNO: '111',
      name: '淋巴细胞百分比',
      result: '44.4',
      flag: '1',
      range: '20.00——44.00',
      unit: '%',
    },
    {
      orderNO: '111',
      name: '单核细胞百分比',
      result: '7.80',
      flag: '0',
      range: '3.00——8.00',
      unit: '%',
    },
    {
      orderNO: '111',
      name: '嗜酸细胞百分比',
      result: '2.70',
      flag: '0',
      range: '0.50——5.00 ',
      unit: '%',
    },
    {
      orderNO: '111',
      name: '嗜碱细胞百分比',
      result: '1.50',
      flag: '1',
      range: '0.00——1.00',
      unit: '%',
    },
    {
      orderNO: '111',
      name: '*红细胞',
      result: '5.07',
      flag: '1',
      range: '3.50——5.00',
      unit: '10^9/L',
    },
    {
      orderNO: '111',
      name: '*血红蛋白',
      result: '153',
      flag: '1',
      range: '110——150',
      unit: 'g/L',
    },
    {
      orderNO: '111',
      name: '*红细胞压积',
      result: '0.45',
      flag: '1',
      range: '0.370——0.430',
      unit: '',
    },
    {
      orderNO: '111',
      name: '平均红细胞体积',
      result: '88.8',
      flag: '0',
      range: '88.2——95.0',
      unit: 'fL',
    },
    {
      orderNO: '111',
      name: '平均血红蛋白含量',
      result: '30.2',
      flag: '0',
      range: '27.0——31.0 ',
      unit: 'pg',
    },
    {
      orderNO: '111',
      name: '平均血红蛋白浓度',
      result: '340',
      flag: '0',
      range: '320——360',
      unit: 'g/L',
    },
    {
      orderNO: '111',
      name: '红细胞分布宽度标准差',
      result: '44.6',
      flag: '0',
      range: '37.00——54.00',
      unit: 'fL',
    },
    {
      orderNO: '111',
      name: '红细胞分布宽度变异系数',
      result: '13.90',
      flag: '0',
      range: '12.00——15.00',
      unit: '%',
    },
    {
      orderNO: '111',
      name: '*血小板',
      result: '205',
      flag: '0',
      range: '100——300',
      unit: '10^9/L',
    },
    {
      orderNO: '111',
      name: '平均血小板体积',
      result: '12.80',
      flag: '1',
      range: '9.40——12.50',
      unit: 'fL',
    },
    {
      orderNO: '111',
      name: '血小板压积',
      result: '0.26',
      flag: '0',
      range: '0.114——0.282 ',
      unit: '',
    },
    {
      orderNO: '111',
      name: '血小板分布宽度',
      result: '19.2',
      flag: '1',
      range: '15.50——18.10',
      unit: '%',
    },
    {
      orderNO: '111',
      name: '大血小板比率',
      result: '46.1',
      flag: '1',
      range: '11——43',
      unit: '%',
    },
  ],
};
// 体征查询测试数据
// 体温、脉搏、心率、呼吸、血压（高压、低压）、大便、尿量、输液量、疼痛登记、体重
const physicalSignCaptureHead =
    [{ code: 'createTime', input: '生成时间' },
      { code: 'temperature', input: '体温(℃)' },
      { code: 'heartRate', input: '心率(次/分)' },
      { code: 'pulse', input: '脉搏(次)' },
      { code: 'breathe', input: '呼吸(次/分)' },
      { code: 'bloodPressureH', input: '血压(高)(mmHg)' },
      { code: 'bloodPressureL', input: '血压(低)(mmHg)' },
      { code: 'stool', input: '大便(次)' },
      { code: 'painScore', input: '疼痛登记()' },
      { code: 'infusion', input: '输液量(ml)' },
      { code: 'urineVolume', input: '尿量(ml)' },
      { code: 'weight', input: '体重(kg)' }];

const physicalSignCaptureHis = {
  1800150: [
    [{ code: 'createTime', input: '08-11 08:10' },
      { code: 'temperature', input: '37.5' },
      { code: 'heartRate', input: '120' },
      { code: 'pulse', input: '60' },
      // { code: 'breathe', input: '40' },
      { code: 'bloodPressureH', input: '120' },
      { code: 'bloodPressureL', input: '80' },
      { code: 'stool', input: '一' },
      { code: 'painScore', input: '6' },
      { code: 'infusion', input: '1200' },
      { code: 'urineVolume', input: '200' },
      { code: 'weight', input: '50' }],

    [{ code: 'createTime', input: '08-11 08:10' },
      { code: 'temperature', input: '37.5' },
      { code: 'heartRate', input: '120' },
      { code: 'pulse', input: '60' },
      { code: 'breathe', input: '40' },
      { code: 'bloodPressureH', input: '120' },
      // { code: 'bloodPressureL', input: '80' },
      { code: 'stool', input: '一' },
      { code: 'painScore', input: '6' },
      { code: 'infusion', input: '1200' },
      { code: 'urineVolume', input: '200' },
      { code: 'weight', input: '50' }],

    [{ code: 'createTime', input: '08-11 08:10' },
      { code: 'temperature', input: '37.5' },
      { code: 'heartRate', input: '120' },
      { code: 'pulse', input: '60' },
      { code: 'breathe', input: '40' },
      { code: 'bloodPressureH', input: '120' },
      { code: 'bloodPressureL', input: '80' },
      { code: 'stool', input: '一' },
      { code: 'painScore', input: '6' },
      { code: 'infusion', input: '1200' },
      { code: 'urineVolume', input: '200' },
      { code: 'weight', input: '50' }],
  ],
  1800544: [
    [{ code: 'createTime', input: '08-11 08:10' },
      { code: 'temperature', input: '37.5' },
      { code: 'heartRate', input: '120' },
      // { code: 'pulse', input: '60' },
      { code: 'breathe', input: '40' },
      { code: 'bloodPressureH', input: '120' },
      { code: 'bloodPressureL', input: '80' },
      { code: 'stool', input: '一' },
      { code: 'painScore', input: '6' },
      { code: 'infusion', input: '1200' },
      { code: 'urineVolume', input: '200' },
      { code: 'weight', input: '50' }],
  ],
};

// 检查结果查询测试数据
const pacsOrderResults = { // 1800150
  1800150: [
    {
      inpatientNo: '1703629',
      orderNO: '211',
      name: 'B超',
      part: '前列腺',
      type: '超声',
      memo: '明早8点',
      barcode: '8904007890',
      isEmergency: false,
      orderTime: '2018-01-17 11:40:00',
      checkTime: '2018-01-18 11:52:00',
      state: '已报告',
      see: '腹部两侧局部回声不均',
      result: '站立位左、右侧腹股沟区分别深38mm、18mm的无回声区，与腹腔相通，下级未达阴囊，平卧位可回纳。左侧睾丸大小约31x14x23mm,右侧睾丸大小约35x23x25mm，左侧睾丸上级回声分布不均。',
    },
    {
      inpatientNo: '1800150',
      orderNO: '210',
      name: '胸部正侧面DR平扫',
      part: '胸部',
      type: '放射',
      memo: '',
      barcode: '', // 申请单号
      isEmergency: true,
      orderTime: '2018-01-17 11:40:00',
      checkTime: '2018-01-18 11:52:00',
      state: '已做检',
      see: '',
      result: '',
    },
  ],
};

// 手术测试数据
const operations = {
  1800150: [
    {
      inpatientID: 1800150, // 住院ID
      applicationID: 901, // 手术申请单ID
      planOperationName: '(双侧)甲状腺叶切除术', // 拟行手术名称,
      planOperationTime: '2018-01-28', // 拟行手术时间
      appliDocName: '孙建伟',	 // 申请医师姓名
      appliTime: '2018-01-27 10:10', // 申请时间
      speExplain: '无', // 特殊要求
      isEmergency: false,
      arrangeTime: '', // 手术室安排时间
      operationName: '', // 实施手术
      operationTime: '', // 手术时间
      mainDocName: '孙建伟', // 主刀医生姓名
      guidDocName: '',	// 台上指导姓名
      firAssName: '杨净宇', // 第一助手姓名
      secfAssName: '',	// 第二助手姓名
      anesthetist1Name: '', // 	麻醉医师1姓名
      anesthetist2Name:	'', // 麻醉医师2姓名
      insNur1Name: '', //	器械护士1姓名
      insNur2Name: '', //	器械护士2姓名
      cirNur1Name: '', // 巡回护士1姓名
      cirNur2Name: '', //	巡回护士2姓名
      ischeck: true, // 审批权限
      checkDocName: '', // 审批医师姓名
      checkTime: '', //	审批时间
      status: '0', //  0 新申请  1 上级医师审批 2手术室已接收安排 3已完成
      remark: '',
      room: '',
    },
    {
      inpatientID: 1800150, // 住院ID
      applicationID: 902, // 手术申请单ID
      planOperationName: '(双侧)甲状腺叶切除术', // 拟行手术名称,
      planOperationTime: '2018-01-28', // 拟行手术时间
      appliDocName: '孙建伟',	 // 申请医师姓名
      appliTime: '2018-01-27 10:10', // 申请时间
      speExplain: '无', // 特殊要求
      isEmergency: true,
      arrangeTime: '2018-01-28 14:00', // 手术室安排时间
      operationName: '', // 实施手术
      operationTime: '', // 手术时间
      mainDocName: '孙建伟', // 主刀医生姓名
      guidDocName: '',	// 台上指导姓名
      firAssName: '杨净宇', // 第一助手姓名
      secfAssName: '',	// 第二助手姓名
      anesthetist1Name: '', // 	麻醉医师1姓名
      anesthetist2Name:	'', // 麻醉医师2姓名
      insNur1Name: '', //	器械护士1姓名
      insNur2Name: '', //	器械护士2姓名
      cirNur1Name: '', // 	巡回护士1姓名
      cirNur2Name: '', //	巡回护士2姓名
      ischeck: true, // 审批权限
      checkDocName: '杨昆贤', //	审批医师姓名
      checkTime: '2018-01-27 13:00', //	审批时间
      status: '2', //  0 新申请  1 上级医师审批 2手术室已接收安排 3已完成
      remark: '',
      room: '第一手术台',
    },
    {
      inpatientID: 1800150, // 住院ID
      applicationID: 903, // 手术申请单ID
      planOperationName: '(双侧)甲状腺叶切除术', // 拟行手术名称,
      planOperationTime: '2018-01-28', // 拟行手术时间
      appliDocName: '孙建伟',	 // 申请医师姓名
      appliTime: '2018-01-27 10:10', // 申请时间
      speExplain: '无', // 特殊要求
      isEmergency: false,
      arrangeTime: '2018-01-28 14:00', // 手术室安排时间
      operationName: '（右侧）甲状腺叶切除术', // 实施手术
      operationTime: '2018-01-28 14:00', // 手术时间
      mainDocName: '孙建伟', // 主刀医生姓名
      guidDocName: '',	// 台上指导姓名
      firAssName: '杨净宇', // 第一助手姓名
      secfAssName: '',	// 第二助手姓名
      anesthetist1Name: '王坤', // 	麻醉医师1姓名
      anesthetist2Name:	'', // 麻醉医师2姓名
      insNur1Name: '小辉', //	器械护士1姓名
      insNur2Name: '大黄', //	器械护士2姓名
      cirNur1Name: '阿尔加多', // 	巡回护士1姓名
      cirNur2Name: '太平洋', //	巡回护士2姓名
      ischeck: true, // 审批权限
      checkDocName: '杨昆贤', //	审批医师姓名
      checkTime: '2018-01-27 13:00', //	审批时间
      status: '3', //  0 新申请  1 上级医师审批 2手术室已接收安排 3已完成
      remark: '',
      room: '第一手术台',
    },
  ],
};
// 手术审核测试数据
const operationsByapp = {
  901:
        {
          inpatientID: 1800150, // 住院ID
          applicationID: 901, // 手术申请单ID
          planOperationName: '(双侧)甲状腺叶切除术', // 拟行手术名称,
          planOperationTime: '2018-01-28', // 拟行手术时间
          appliDocName: '孙建伟',	 // 申请医师姓名
          appliTime: '2018-01-27 10:10', // 申请时间
          speExplain: '无', // 特殊要求
          isEmergency: false,
          arrangeTime: '', // 手术室安排时间
          operationName: '', // 实施手术
          operationTime: '', // 手术时间
          mainDocName: '孙建伟', // 主刀医生姓名
          guidDocName: '',	// 台上指导姓名
          firAssName: '杨净宇', // 第一助手姓名
          secfAssName: '',	// 第二助手姓名
          anesthetist1Name: '', // 	麻醉医师1姓名
          anesthetist2Name:	'', // 麻醉医师2姓名
          insNur1Name: '', //	器械护士1姓名
          insNur2Name: '', //	器械护士2姓名
          cirNur1Name: '', // 巡回护士1姓名
          cirNur2Name: '', //	巡回护士2姓名
          ischeck: true, // 审批权限
          checkDocName: 'D0001', // 审批医师姓名
          checkTime: '2018-02-01 17:32', //	审批时间
          status: '1', //  0 新申请  1 上级医师审批 2手术室已接收安排 3已完成
          remark: '',
          room: '',
        },
};
