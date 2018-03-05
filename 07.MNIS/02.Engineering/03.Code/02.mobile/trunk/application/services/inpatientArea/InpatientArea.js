import { get } from '../../utils/Request';
import { base } from '../RequestTypes';

export async function loadInpatientAreas(/* query*/) {
  return {
    success: true,
    result: [
      { id: 'IA0001', name: '急诊病区' },
      { id: 'IA0002', name: '内科二病区' },
      { id: 'IA0003', name: '高干特殊服务病区' },
    ],
  };
  // TODO: 正式环境从后台取
  // return get(`${base().loadInpatientAreas}`, query);
}

export async function loadPatients(/* query*/) {
  return {
    success: true,
    result: {
      IA0001: [
        { id: 'P000000000001', name: '王永莲', gender: '女', age: '73', deptId: '0001', deptName: '急诊病区', inpatientNo: '1800150', roomNo: '01', bedNo: '001', settleType: '城镇医保', nursingLvl: '一级护理', diagnosisNo: 'R09879', diagnosisName: '急性肠胃炎', inpatientDate: '2018-01-02 13:49:21', totalFee: 3540, prepay: 5000, balance: 1460, clinicalPathway: '1' },
        { id: 'P000000000002', name: '赵玉贤', gender: '女', age: '78', deptId: '0001', deptName: '急诊病区', inpatientNo: '1800544', roomNo: '01', bedNo: '003', settleType: '管局医保', nursingLvl: '二级护理', diagnosisNo: 'R09800', diagnosisName: '手臂位烫伤', inpatientDate: '2018-01-07 14:28:07', totalFee: 6800, prepay: 10000, balance: 3200, clinicalPathway: '1' },
        { id: 'P000000000003', name: '王兰英', gender: '女', age: '79', deptId: '0001', deptName: '急诊病区', inpatientNo: '1703629', roomNo: '01', bedNo: '002', settleType: '自费', nursingLvl: '三级护理', diagnosisNo: 'R09879', diagnosisName: '急性肠胃炎', inpatientDate: '2018-01-08 11:07:45', totalFee: 2200, prepay: 3000, balance: 800, clinicalPathway: '0' },
      ],
      IA0002: [
        { id: 'P0000000000011', name: '王永莲1', gender: '女', age: '73', deptId: '0002', deptName: '内科二病区', inpatientNo: '1800150', roomNo: '01', bedNo: '001', settleType: '城镇医保', nursingLvl: '一级护理', diagnosisNo: 'R09879', diagnosisName: '急性肠胃炎', inpatientDate: '2018-01-02 13:49:21', totalFee: 3540, prepay: 5000, balance: 1460, clinicalPathway: '1' },
        { id: 'P0000000000022', name: '赵玉贤2', gender: '女', age: '78', deptId: '0002', deptName: '内科二病区', inpatientNo: '1800544', roomNo: '01', bedNo: '003', settleType: '管局医保', nursingLvl: '二级护理', diagnosisNo: 'R09800', diagnosisName: '手臂位烫伤', inpatientDate: '2018-01-07 14:28:07', totalFee: 6800, prepay: 10000, balance: 3200, clinicalPathway: '1' },
        { id: 'P0000000000033', name: '王兰英3', gender: '女', age: '79', deptId: '0002', deptName: '内科二病区', inpatientNo: '1703629', roomNo: '01', bedNo: '002', settleType: '自费', nursingLvl: '三级护理', diagnosisNo: 'R09879', diagnosisName: '急性肠胃炎', inpatientDate: '2018-01-08 11:07:45', totalFee: 2200, prepay: 3000, balance: 800, clinicalPathway: '0' },
      ],
      IA0003: [
        { id: 'P000000000001a', name: '王永莲a', gender: '女', age: '73', deptId: '0003', deptName: '高干特殊服务病区', inpatientNo: '1800150', roomNo: '01', bedNo: '001', settleType: '城镇医保', nursingLvl: '一级护理', diagnosisNo: 'R09879', diagnosisName: '急性肠胃炎', inpatientDate: '2018-01-02 13:49:21', totalFee: 3540, prepay: 5000, balance: 1460, clinicalPathway: '1' },
        { id: 'P000000000002b', name: '赵玉贤b', gender: '女', age: '78', deptId: '0003', deptName: '高干特殊服务病区', inpatientNo: '1800544', roomNo: '01', bedNo: '003', settleType: '管局医保', nursingLvl: '二级护理', diagnosisNo: 'R09800', diagnosisName: '手臂位烫伤', inpatientDate: '2018-01-07 14:28:07', totalFee: 6800, prepay: 10000, balance: 3200, clinicalPathway: '1' },
        { id: 'P000000000003c', name: '王兰英c', gender: '女', age: '79', deptId: '0003', deptName: '高干特殊服务病区', inpatientNo: '1703629', roomNo: '01', bedNo: '002', settleType: '自费', nursingLvl: '三级护理', diagnosisNo: 'R09879', diagnosisName: '急性肠胃炎', inpatientDate: '2018-01-08 11:07:45', totalFee: 2200, prepay: 3000, balance: 800, clinicalPathway: '0' },
      ],
    },
  };
  // TODO: 正式环境从后台取
  // return get(`${base().loadPatients}`, query);
}
