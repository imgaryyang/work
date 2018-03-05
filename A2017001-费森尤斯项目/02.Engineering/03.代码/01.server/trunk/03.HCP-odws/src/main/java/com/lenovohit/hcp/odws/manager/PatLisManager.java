package com.lenovohit.hcp.odws.manager;

import java.io.OutputStream;
import java.util.List;
import java.util.Map;

import com.lenovohit.hcp.base.model.HcpUser;
import com.lenovohit.hcp.onws.moddel.PhaPatLis;

/**    
 *         
 * 类描述： 保管执行单   
 *@author GW
 *@date 2017年6月17日          
 *     
 */
public interface PatLisManager {

	public PhaPatLis savePatLis(PhaPatLis record, HcpUser user);
	
	public void saveResultList(List<Map<String, Object>> mapList);
	
	public Map<String,Object> findLisResult(String exambarcode);

	public void writeExcel(List<Object> tmpList, OutputStream out);
	
}
