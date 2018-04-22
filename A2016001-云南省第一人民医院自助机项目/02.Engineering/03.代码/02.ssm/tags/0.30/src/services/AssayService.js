import ajax from '../utils/ajax';
const _API_ROOT = "/api/ssm/treat/assay";


/**
 * 查询检查记录
 */
export async function loadAssayRecords (assay) {
	return ajax.GET(_API_ROOT + '/list',assay);
}


/**
 * 查询检查信息
 */
export async function loadAssayImage (assay) {
	return ajax.GET(_API_ROOT + '/image/'+assay.barcode);
	
}

/**
 * 打印回传
 */
export async function printAssay (assay) {
	return ajax.PUT(_API_ROOT + '/printed',assay);
}

/**
 * 查询血液检查记录
 */
export async function loadTmsRecords (xxjdOrder) {
	return ajax.GET(_API_ROOT + '/tms/list',xxjdOrder);
}
/**
 * 查询血液检查明细
 */
export async function loadTmsDetails (xxjdOrder) {
	return ajax.GET(_API_ROOT + '/tms/details/'+xxjdOrder.id.orderno + "/" + xxjdOrder.id.itemCode);
}
/**
 * 血液检查回传
 */
export async function printTms (xxjdOrder) {
	return ajax.PUT(_API_ROOT + '/tms/print/'+xxjdOrder.id.orderno + "/" + xxjdOrder.id.itemCode );
}

