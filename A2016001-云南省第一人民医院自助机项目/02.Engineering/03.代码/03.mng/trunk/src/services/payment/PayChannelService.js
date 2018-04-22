import ajax from '../../utils/ajax';
const _API_ROOT = "/api/ssm/payment/payChannel";

export async function loadChannelPage(start,limit,query) {
	return ajax.GET(_API_ROOT+'/page/'+start+'/'+limit,query||{});
}
export async function saveChannel(data) {
	  if(data.id)return ajax.POST(_API_ROOT+'/update',data);
	  else return ajax.POST(_API_ROOT+'/create',data);
}
export async function deleteChannel(id) {
	  return ajax.DELETE(_API_ROOT+'/remove/'+id);
}
export async function deleteAllChannels(ids) {
	  return ajax.DELETE(_API_ROOT+'/removeAll/',ids);
}
export async function getOptions() {
	return ajax.GET(_API_ROOT+'/list/');
}
