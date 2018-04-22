import ajax from '../utils/ajax';
const _API_ROOT = "/api/ssm/treat/foregift";
/**
 * 生成住院预缴订单
 */
export async function createForegiftOrder ( order ) {
  return ajax.POST(_API_ROOT + '/order/foregift', order);
}
