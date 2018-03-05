import _ from 'lodash';
import ajax from '../utils/ajax';
import config from '../utils/config';

const DICT_OPTIONS = {};
let DEPT_OPTIONS = {};
let DEPT_IDX = {};
const TREE_OPTIONS = {};
const FLAT_TREE_OPTIONS = {};
let storageCache = []; // 本地缓存
let columnCache = []; // 本地缓存

/**
 * 根据columnName查询对应的字典项
 * dictColumnNames - Array  columnName数组，一次可传入多个
 * 返回：所有请求columnName对应的字典项
 * {
 *    columnName1: [],
 *    columnName2: [],
 *    ....
 * }
 */
export async function getOptions(dictColumnNames) {
  // console.log(typeof dictColumnNames);
  if (typeof dictColumnNames !== 'object' || !(dictColumnNames instanceof Array)) { return {}; }

  const notInCache = [];
  columnCache = localStorage.getItem('columnCache');
  // const res = {};
  for (let i = 0; i < dictColumnNames.length; i += 1) {
    const columnName = dictColumnNames[i];
    if (!_.includes(columnCache, columnName)) {
      notInCache.push(columnName);
    }
  }

  storageCache = [...storageCache, ...notInCache];
  localStorage.setItem('columnCache', storageCache);
  // console.log('res:', res);

  if (notInCache.length > 0) {  // 如果有缓存中不存在的项，发起后台请求
    const { data } = await ajax.GET(`${config.apiRoot.dictionary}listByColName/`, notInCache);

    if (data && data.success) {
      // console.log('in logic......');
      // 将后台取回的数据放入前端缓存
      const items = data.result;
      for (let i = 0; i < items.length; i += 1) {
        const key = items[i].columnName;
        if (!DICT_OPTIONS[key]) {
          DICT_OPTIONS[key] = [];
        }
        DICT_OPTIONS[key].push(items[i]);
      }
    }
  }

  return DICT_OPTIONS;
}

/**
 * 将科室信息缓存到前端
 */
async function loadDepts(data) {
  // 取所有科室类型
  const deptTypes = await ajax.GET(`${config.apiRoot.dictionary}listByColName/`, ['DEPT_TYPE']);
  // 取所有科室信息
  const depts = await ajax.GET(`${config.apiRoot.dept}list/`, data);
  // console.log(deptTypes, depts);
  // 将科室类别作为第一层放入缓存
  if (deptTypes.data && deptTypes.data.success) {
    for (let i = 0; i < deptTypes.data.result.length; i += 1) {
      const item = deptTypes.data.result[i];
      DEPT_OPTIONS[item.columnKey] = {
        key: `DICT_${i}_${item.columnKey}`,
        value: item.columnKey,
        title: item.columnVal,
        deptType: item.columnKey,
        children: [],
      };
    }
  }
  // 将科室信息放入缓存
  if (depts.data && depts.data.success) {
    for (let i = 0; i < depts.data.result.length; i += 1) {
      const item = depts.data.result[i];
      if (item.deptType && DEPT_OPTIONS[item.deptType]) {
        DEPT_OPTIONS[item.deptType].children.push({
          key: item.id,
          value: item.id,
          title: item.deptName,
          deptId: item.deptId,
          isRegdept: item.isRegdept,
          spellCode: item.spellCode,
          wbCode: item.wbCode,
          customCode: item.customCode,
          deptType: item.deptType,
        });
        DEPT_IDX[item.id] = {
          deptType: item.deptType,
          idx: DEPT_OPTIONS[item.deptType].children.length - 1,
        };
        DEPT_IDX[item.deptId] = {
          deptType: item.deptType,
          idx: DEPT_OPTIONS[item.deptType].children.length - 1,
        };
      }
    }
  }
  // console.log('DEPT_OPTIONS:', DEPT_OPTIONS);
  // return DEPT_OPTIONS;
}

/**
 * 初始化科室信息
 */
export async function initDepts() {
  loadDepts();
  return { depts: DEPT_OPTIONS, deptsIdx: DEPT_IDX };
}

/**
 * 重新载入科室信息
 */
export async function reloadDepts(data) {
  DEPT_OPTIONS = {};
  DEPT_IDX = {};
  loadDepts(data);
  return { depts: DEPT_OPTIONS, deptsIdx: DEPT_IDX };
}

/**
 * 将指定的科室信息缓存到前端
 */
export async function addDeptsToCache(deptIds) {
  // console.log(typeof dictColumnNames);
  if (typeof deptIds !== 'object' || !(deptIds instanceof Array)) { return DEPT_OPTIONS; }
  // 取所有科室信息
  const depts = await ajax.GET(`${config.apiRoot.dept}findByIds/`, deptIds);
  // 将科室信息放入缓存
  if (depts.data && depts.data.success) {
    for (let i = 0; i < depts.data.result.length; i += 1) {
      const item = depts.data.result[i];
      if (item.deptType && DEPT_OPTIONS[item.deptType]) {
        DEPT_OPTIONS[item.deptType].children.push({
          key: item.id,
          value: item.deptId,
          title: item.deptName,
          id: item.id,
          isRegdept: item.isRegdept,
          spellCode: item.spellCode,
          wbCode: item.wbCode,
          customCode: item.customCode,
          deptType: item.deptType,
        });
      }
    }
  }
  // console.log('DEPT_OPTIONS:', DEPT_OPTIONS);
  return DEPT_OPTIONS;
}

/**
 * 根据dictType查询对应的多级字典
 * dictTypes - Array dictType数组，一次可传入多个
 * 返回：所有请求dictType对应的第一级
 * {
 *    dictType1: [],
 *    dictType2: [],
 *    ....
 * }
 */
export async function initTrees(dictTypes) {
  if (typeof dictTypes !== 'object' || !(dictTypes instanceof Array)) { return {}; }
  //if (typeof dictTypes !== 'object' ) { return {}; }

  const notInCache = [];
  // const res = {};
  for (let i = 0; i < dictTypes.length; i += 1) {
    const dictType = dictTypes[i];
    console.info(dictType)
    if (!TREE_OPTIONS[dictType]) { // 不存在的从数据库查询
      notInCache.push(dictType);
    }
  }
  // console.log('notInCache:', notInCache);
  // console.log('res:', res);

  if (notInCache.length > 0) {  // 如果有缓存中不存在的项，发起后台请求
    const { data } = await ajax.GET(`${config.apiRoot.tree}listFirstLevel/`, notInCache);
    console.info(data)
    if (data && data.success) {
      // console.log('in logic......');
      // 将后台取回的数据放入前端缓存
      const items = data.result;
      for (let i = 0; i < items.length; i += 1) {
        const key = items[i].dictType;
        if (!TREE_OPTIONS[key]) {
          TREE_OPTIONS[key] = [];
        }
        TREE_OPTIONS[key].push({
          id: items[i].id,
          key: items[i].id,
          value: items[i].key,
          label: items[i].value,
          isLeaf: items[i].leaf,
          loading: false,
        });
      }

      // 继续组合返回数据
      /* for (let i = 0; i < notInCache.length; i += 1) {
        const dictType = notInCache[i];
        if (TREE_OPTIONS[dictType]) { // 从缓存取
          res[dictType] = TREE_OPTIONS[dictType];
        }
      } */
      // console.log('res:', res);
    }

    // 将非行政区划类的数据按 dictype 缓存到前端（不分级次）
    _.pull(notInCache, 'DIVISIONS');
    if (notInCache.length > 0) {
      const rst = await ajax.GET(`${config.apiRoot.tree}listByDictType/`, notInCache);

      if (rst.data && rst.data.success) {
        // console.log('in logic......');
        // 将后台取回的数据放入前端缓存
        const items = rst.data.result;
        for (let i = 0; i < items.length; i += 1) {
          const key = items[i].dictType;
          if (!FLAT_TREE_OPTIONS[key]) {
            FLAT_TREE_OPTIONS[key] = [];
          }
          FLAT_TREE_OPTIONS[key].push({
            id: items[i].id,
            key: items[i].id,
            value: items[i].key,
            label: items[i].value,
            isLeaf: items[i].leaf,
            loading: false,
          });
        }
      }
    }
  }
  return { TREE_OPTIONS, FLAT_TREE_OPTIONS };
}

/**
 * 根据dictType，当前多选树节点查询对应的子项
 * dictTypes - Array dictType数组，一次可传入多个
 * selectedOptions - Object 当前被选节点
 * 返回：所有请求dictType对应的已请求数据
 * {
 *    dictType1: [],
 *    dictType2: [],
 *    ....
 * }
 */
export async function loadTreeItemChildren(dictType, selectedOptions) {
  // console.log('selectedOptions in UtilsService.loadTreeItemChildren():', selectedOptions);
  if (selectedOptions.children) {
    return TREE_OPTIONS;
  }

  const targetOption = selectedOptions ? selectedOptions[selectedOptions.length - 1] : {};
  targetOption.loading = true;

  const { data } = await ajax.GET(`${config.apiRoot.tree}list`, { parentId: targetOption.id });
  // console.log('data in UtilsService.loadTreeItemChildren():', data);
  console.info(data);
  if (data && data.success) {
    targetOption.children = [];
    for (let i = 0; i < data.result.length; i += 1) {
      const item = {
        id: data.result[i].id,
        value: data.result[i].key,
        label: data.result[i].value,
        isLeaf: data.result[i].leaf,
      };
      targetOption.children.push(item);
    }
  }
  targetOption.loading = false;
  // console.log('targetOption in UtilsService.loadTreeItemChildren():', targetOption);
  return TREE_OPTIONS;
}

/**
 * 获取药品及收费项列表
 */
export async function loadItemInfo(data) {
  return ajax.POST(`${config.apiRoot.base}commonItem/list`, data);
}

/**
 * 获取诊断列表
 */
export async function loadDiagnosis(data) {
  return ajax.POST(`${config.apiRoot.base}diagnosis/list`, data);
}

/**
 * 获取频次列表
 */
export async function loadFreqs(data) {
  return ajax.POST(`${config.apiRoot.base}freq/list`, data);
}

/**
 * 获取挂号信息
 */
export async function loadRegInfo(data) {
  return ajax.POST(`${config.apiRoot.base}regInfo/list`, data);
}
/**
 * 获取药品信息
 */
export async function loadDrugInfo(data) {
  return ajax.POST(`${config.apiRoot.base}drugInfo/list`, data);
}

/**
 * 获取物资厂商列表
 */
export async function loadMaterialCompany(data) {
  return ajax.POST(`${config.apiRoot.base}materialCompany/list`, data);
}

/**
 * 获取物资证书列表
 */
export async function loadMaterialCertificate(data) {
  return ajax.POST(`${config.apiRoot.base}materialCertificate/list`, data);
}

/**
 * 获取物资列表
 */
export async function loadMaterials(data) {
  return ajax.POST(`${config.apiRoot.base}materials/list`, data);
}

/**
 * 根据patientId获取患者信息
 */
export async function loadPatientInfoByPatientId(patientId) {
  return ajax.GET(`${config.apiRoot.patient}patientId/${patientId}`);
}

/**
 * 根据身份证号获取患者信息
 */
export async function loadPatientInfoByIdNo(idNo) {
  return ajax.GET(`${config.apiRoot.patient}idNo/${idNo}`);
}


/**
 * 获取公用厂商列表
 */
export async function loadCompanies(data) {
  return ajax.GET(`${config.apiRoot.base}companies/list`, data);
}

/**
 * 获取数据源
 */
export async function getDataSource(tableNames) {
  if (typeof tableNames !== 'object' || !(tableNames instanceof Array)) { return {}; }
  const dataSource = {};
  tableNames.map(async (item) => {
    const { data } = await ajax.GET(`${config.apiRoot.base}searchInput/${item}`);
    if (data && data.success) {
      const result = { [item]: data.result };
      Object.assign(dataSource, result);
    }
  });
  return dataSource;
}
