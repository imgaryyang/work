
import moment from 'moment';

// 生成随机姓名
export function getRandomName() {
  const familyNames = [
    '赵', '钱', '孙', '李', '周', '吴', '郑', '王', '冯', '陈',
    '褚', '卫', '蒋', '沈', '韩', '杨', '朱', '秦', '尤', '许',
    '何', '吕', '施', '张', '孔', '曹', '严', '华', '金', '魏',
    '陶', '姜', '戚', '谢', '邹', '喻', '柏', '水', '窦', '章',
    '云', '苏', '潘', '葛', '奚', '范', '彭', '郎', '鲁', '韦',
    '昌', '马', '苗', '凤', '花', '方', '俞', '任', '袁', '柳',
    '酆', '鲍', '史', '唐', '费', '廉', '岑', '薛', '雷', '贺',
    '倪', '汤', '滕', '殷', '罗', '毕', '郝', '邬', '安', '常',
    '乐', '于', '时', '傅', '皮', '卞', '齐', '康', '伍', '余',
    '元', '卜', '顾', '孟', '平', '黄', '和', '穆', '萧', '尹',
  ];
  const givenNames = [
    '子璇', '淼', '国栋', '夫子', '瑞堂', '甜', '敏', '尚', '国贤', '贺祥', '晨涛',
    '昊轩', '易轩', '益辰', '益帆', '益冉', '瑾春', '瑾昆', '春齐', '杨', '文昊',
    '东东', '雄霖', '浩晨', '熙涵', '溶溶', '冰枫', '欣欣', '宜豪', '欣慧', '建政',
    '美欣', '淑慧', '文轩', '文杰', '欣源', '忠林', '榕润', '欣汝', '慧嘉', '新建',
    '建林', '亦菲', '林', '冰洁', '佳欣', '涵涵', '禹辰', '淳美', '泽惠', '伟洋',
    '涵越', '润丽', '翔', '淑华', '晶莹', '凌晶', '苒溪', '雨涵', '嘉怡', '佳毅',
    '子辰', '佳琪', '紫轩', '瑞辰', '昕蕊', '萌', '明远', '欣宜', '泽远', '欣怡',
    '佳怡', '佳惠', '晨茜', '晨璐', '运昊', '汝鑫', '淑君', '晶滢', '润莎', '榕汕',
    '佳钰', '佳玉', '晓庆', '一鸣', '语晨', '添池', '添昊', '雨泽', '雅晗', '雅涵',
    '清妍', '诗悦', '嘉乐', '晨涵', '天赫', '玥傲', '佳昊', '天昊', '萌萌', '若萌',
  ];

  const i = (parseInt(10 * Math.random(), 10) * 10) + parseInt(10 * Math.random(), 10);
  const familyName = familyNames[i];

  const j = (parseInt(10 * Math.random(), 10) * 10) + parseInt(10 * Math.random(), 10);
  const givenName = givenNames[j];

  const name = familyName + givenName;
  return name;
}

// 生成随机手机号
export function getRandomMoble() {
  const prefixArray = ['130', '131', '132', '133', '135', '137', '138', '170', '187', '189'];
  const k = parseInt(10 * Math.random(), 10);
  let prefix = prefixArray[k];

  for (let j = 0; j < 8; j += 1) {
    prefix += Math.floor(Math.random() * 10);
  }

  return prefix;

  /* const x = document.getElementsByName('mobile_tel');
  for (var i = 0; i < x.length; i++) {
    const o = x[i];
    o.value = prefix;
  } */
}

// 生成随机身份证号
export function getRandomIdCard() {
  const coefficientArray = ['7', '9', '10', '5', '8', '4', '2', '1', '6', '3', '7', '9', '10', '5', '8', '4', '2'];// 加权因子
  const lastNumberArray = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2'];// 校验码
  // const address = '530181'; // 住址
  // const birthday = '19810101'; // 生日

  // 取随机地址
  const addrs = [
    { addr: '532727', idAddress: '云南省思茅地区江城哈尼族彝族自治县' },
    { addr: '532503', idAddress: '云南省红河蒙自市' },
    { addr: '532126', idAddress: '云南省昭通永善县' },
    { addr: '533124', idAddress: '云南省德宏傣族州陇川县' },
    { addr: '532925', idAddress: '云南省大理弥渡县' },
    { addr: '533124', idAddress: '云南省德宏傣族州陇川县' },
    { addr: '533222', idAddress: '云南省丽江永胜县' },
    { addr: '532503', idAddress: '云南省红河蒙自市' },
    { addr: '532726', idAddress: '云南省思茅地区镇沅彝族哈尼族拉祜族自治县' },
    { addr: '530122', idAddress: '云南省昆明市晋宁县' },
    { addr: '530723', idAddress: '云南省丽江市华坪县' },
    { addr: '530522', idAddress: '云南省保山市腾冲县' },
    { addr: '532331', idAddress: '云南省楚雄禄丰县' },
    { addr: '530181', idAddress: '云南省昆明市安宁市' },
    { addr: '532327', idAddress: '云南省楚雄永仁县' },
    { addr: '532601', idAddress: '云南省文山市' },
    { addr: '530624', idAddress: '云南省昭通市大关县' },
    { addr: '533524', idAddress: '云南省临沧永德县' },
    { addr: '532531', idAddress: '云南省红河绿春县' },
    { addr: '530102', idAddress: '云南省昆明市五华区' },
    { addr: '532924', idAddress: '云南省大理宾川县' },
    { addr: '532801', idAddress: '云南省西双版纳景洪市' },
    { addr: '532530', idAddress: '云南省红河金平苗族瑶族傣族自治县' },
    { addr: '530622', idAddress: '云南省昭通市巧家县' },
    { addr: '530623', idAddress: '云南省昭通市盐津县' },
    { addr: '532127', idAddress: '云南省昭通绥江县' },
    { addr: '532326', idAddress: '云南省楚雄大姚县' },
    { addr: '530825', idAddress: '云南省普洱市镇沅彝族哈尼族拉祜族自治县' },
  ];
  const randomAddrIdx = parseInt(addrs.length * Math.random(), 10);
  const address = addrs[randomAddrIdx].addr;
  const idAddress = addrs[randomAddrIdx].idAddress;

  // 取随机生日
  const years = [];
  for (let i = 1990; i < 2005; i += 1) {
    years.push(`${i}`);
  }
  const randomYearIdx = parseInt((2005 - 1990 - 1) * Math.random(), 10);
  const randomDayIdx = parseInt(360 * Math.random(), 10);
  const birthday = moment(`${years[randomYearIdx]}-01-01`).dayOfYear(randomDayIdx);

  const s =
    Math.floor(Math.random() * 10).toString() +
    Math.floor(Math.random() * 10).toString() +
    Math.floor(Math.random() * 10).toString();
  const array = (address + birthday.format('YYYYMMDD') + s).split('');
  let total = 0;

  for (const i in array) {
    if ({}.hasOwnProperty.call(array, i)) {
      total += parseInt(array[i], 10) * parseInt(coefficientArray[i], 10);
    }
  }

  const lastNumber = lastNumberArray[parseInt(total % 11, 10)];
  const idNo = address + birthday.format('YYYYMMDD') + s + lastNumber;

  return {
    idNo,
    birthday: birthday.format('YYYYMMDD'),
    age: moment().diff(birthday, 'years'),
    idAddress,
  };

  /* const x = document.getElementsByName('id_no');
  for (var i = 0; i < x.length; i++) {
    const o = x[i];
    o.value = id_no_String;
  } */
}

export function getRandomNum(len) {
  let num = '';
  for (let i = 0; i < len; i += 1) {
    num += parseInt(10 * (Math.random()), 10);
  }
  return num;
}

