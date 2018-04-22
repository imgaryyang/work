package com.lenovohit.ssm.payment.web.rest;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.lenovohit.core.dao.Page;
import com.lenovohit.core.exception.BaseException;
import com.lenovohit.core.manager.GenericManager;
import com.lenovohit.core.utils.JSONUtils;
import com.lenovohit.core.utils.StringUtils;
import com.lenovohit.core.web.MediaTypes;
import com.lenovohit.core.web.rest.BaseRestController;
import com.lenovohit.core.web.utils.Result;
import com.lenovohit.core.web.utils.ResultUtils;
import com.lenovohit.ssm.client.model.ClientMenu;

/**
 * 结算单管理
 * 
 * 
 */
@RestController
@RequestMapping("/ssm/pay/settle")
public class SettleRestController extends BaseRestController {
	
	

	@Autowired
	private GenericManager<ClientMenu, String> clientMenuManager;

	@RequestMapping(value = "/page/{start}/{limit}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forPage(@PathVariable("start") String start, @PathVariable("limit") String limit){
		Page page = new Page();
		page.setStart(start);
		page.setPageSize(limit);
		page.setQuery("from ClientMenu where 1=1 order by sort");
		clientMenuManager.findPage(page);
		return ResultUtils.renderPageResult(page);
	}
	@RequestMapping(value = "/list", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forList(@RequestParam(value = "data", defaultValue = "") String data) {
		List<ClientMenu> menus = clientMenuManager.findAll();
		return ResultUtils.renderSuccessResult(menus);
	}
	@RequestMapping(value = "/mylist", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forMyList(@RequestParam(value = "data", defaultValue = "") String data) {
		List<ClientMenu> menus = clientMenuManager.findAll();
		return ResultUtils.renderSuccessResult(menus);
	}
	@RequestMapping(value="/create",method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8/*TEXT_PLAIN_UTF_8*/)
	public Result forCreateMenu(@RequestBody String data){
		ClientMenu menu =  JSONUtils.deserialize(data, ClientMenu.class);
		//TODO 校验
		ClientMenu saved = this.clientMenuManager.save(menu);
		return ResultUtils.renderSuccessResult(saved);
	}
	@RequestMapping(value = "/update", method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result forUpdate(@RequestBody String data) {
		ClientMenu model =  JSONUtils.deserialize(data, ClientMenu.class);
		if(model==null || StringUtils.isBlank(model.getId())){
			return ResultUtils.renderFailureResult();
		}
		this.clientMenuManager.save(model);

		return ResultUtils.renderSuccessResult();
	}
	@RequestMapping(value = "/remove/{id}",method = RequestMethod.DELETE, produces = MediaTypes.JSON_UTF_8)
	public Result forDeleteMenu(@PathVariable("id") String id){
		try {
			this.clientMenuManager.delete(id);
		} catch (Exception e) {
			throw new BaseException("删除失败");
		}
		return ResultUtils.renderSuccessResult();
	}
	@RequestMapping(value = "/removeAll",method = RequestMethod.DELETE, produces = MediaTypes.JSON_UTF_8)
	public Result forDeleteAll(@RequestBody String data){
		@SuppressWarnings("rawtypes")
		List ids =  JSONUtils.deserialize(data, List.class);
		StringBuilder idSql = new StringBuilder();
		List<String> idvalues = new ArrayList<String>();
		try {
			idSql.append("DELETE FROM SSM_MENU_CLIENT  WHERE ID IN (");
			for(int i=0;i<ids.size();i++){
				idSql.append("?");
				idvalues.add(ids.get(i).toString());
				if(i != ids.size()-1)idSql.append(",");
			}
			idSql.append(")");
			System.out.println(idSql.toString());
			this.clientMenuManager.executeSql(idSql.toString(), idvalues.toArray());
		} catch (Exception e) {
			e.printStackTrace();
			throw new BaseException("删除失败");
		}
		return ResultUtils.renderSuccessResult();
	}
	
	public String ObjectIsNull(Object obj) {
		if (obj == null)
			return "";
		return obj.toString();
	}

}
