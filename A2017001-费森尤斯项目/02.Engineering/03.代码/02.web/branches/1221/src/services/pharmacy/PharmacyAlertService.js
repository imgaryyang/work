import ajax from '../../utils/ajax';
import { apiRoot } from '../../utils/config';

/**
 * 查询库存预警信息
 */
export async function loadInventoryAlert(start, limit, query) {
  return ajax.GET(`${apiRoot.pharmacyAlert.inventoryAlert}page/${start}/${limit}`, query || {});
}

/**
 * 查询效期预警信息
 */
export async function loadExpiryAlert(start, limit, query) {
  return ajax.GET(`${apiRoot.pharmacyAlert.expiryAlert}page/${start}/${limit}`, query || {});
}

/**
 * 查询滞留预警信息
 */
export async function loadRetentionAlert(start, limit, query) {
  return ajax.GET(`${apiRoot.pharmacyAlert.retentionAlert}page/${start}/${limit}`, query || {});
}
