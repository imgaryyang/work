package com.lenovohit.hcp.base.web.rest;

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
import com.lenovohit.core.web.utils.Result;
import com.lenovohit.core.web.utils.ResultUtils;
import com.lenovohit.hcp.base.model.HcpUser;
import com.lenovohit.hcp.base.model.MiHisCompare;

@RestController
@RequestMapping("/hcp/base/miHisCompare")
public class MiHisCompareController extends HcpBaseRestController {
	@Autowired
	private GenericManager<MiHisCompare, String> miHisCompareManager;

	@RequestMapping(value = "/create", method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8/* TEXT_PLAIN_UTF_8 */)
	public Result forCreateMenu(@RequestBody String data) {
		MiHisCompare model = JSONUtils.deserialize(data, MiHisCompare.class);
		checkParams(model);
		//model.setEffectiveFlag(true);
		// TODO 校验
		MiHisCompare saved = this.miHisCompareManager.save(model);
		return ResultUtils.renderSuccessResult(saved);
	}

	@RequestMapping(value = "/update", method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result forUpdate(@RequestBody String data) {
		MiHisCompare model = JSONUtils.deserialize(data, MiHisCompare.class);
		if (model == null || StringUtils.isBlank(model.getId())) {
			return ResultUtils.renderFailureResult("不存在此对象");
		}
		this.miHisCompareManager.save(model);
		return ResultUtils.renderSuccessResult();
	}

	@RequestMapping(value = "/remove/{id}", method = RequestMethod.DELETE, produces = MediaTypes.JSON_UTF_8)
	public Result forDeleteMenu(@PathVariable("id") String id) {
		try {
			this.miHisCompareManager.delete(id);
		} catch (Exception e) {
			throw new BaseException("删除失败");
		}
		return ResultUtils.renderSuccessResult();
	}

	@RequestMapping(value = "/removeAll", method = RequestMethod.DELETE, produces = MediaTypes.JSON_UTF_8)
	public Result forDeleteAll(@RequestBody String data) {
		@SuppressWarnings("rawtypes")
		List ids = JSONUtils.deserialize(data, List.class);
		StringBuilder idSql = new StringBuilder();
		List<String> idvalues = new ArrayList<String>();
		try {
			idSql.append("DELETE FROM HCP_PRINT_TEMPLATE WHERE ID IN (");
			for (int i = 0; i < ids.size(); i++) {
				idSql.append("?");
				idvalues.add(ids.get(i).toString());
				if (i != ids.size() - 1)
					idSql.append(",");
			}
			idSql.append(")");
			System.out.println(idSql.toString());
			this.miHisCompareManager.executeSql(idSql.toString(), idvalues.toArray());
		} catch (Exception e) {
			e.printStackTrace();
			throw new BaseException("删除失败");
		}
		return ResultUtils.renderSuccessResult();
	}

	private void checkParams(MiHisCompare template) {
		//if (StringUtils.isBlank(template.getBizCode()))
			throw new RuntimeException("业务编码不能为空");
	}

	@RequestMapping(value = "/page/{start}/{limit}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forPage(@PathVariable("start") String start, @PathVariable("limit") String limit,
			@RequestParam(value = "data", defaultValue = "") String data) {
		MiHisCompare query = JSONUtils.deserialize(data, MiHisCompare.class);
		StringBuilder jql = new StringBuilder("from MiHisCompare where 1=1 ");
		List<Object> values = new ArrayList<Object>();
		HcpUser user = this.getCurrentUser();
//		jql.append(" and hosId = ? ");
//		values.add(user.getHosId());
		
		if (!StringUtils.isEmpty(query.getItemCode())) {
			jql.append(" and (itemCode like ? or miCode like ? ) ");
			values.add("%"+query.getItemCode()+"%");
			values.add("%"+query.getItemCode()+"%");
		}
		if (!StringUtils.isEmpty(query.getItemName())) {
			jql.append(" and ( itemName like ? or miName like ? ) ");
			values.add("%"+query.getItemName()+"%");
			values.add("%"+query.getItemName()+"%");
		}
		if (!StringUtils.isEmpty(query.getMiClass())) {
			jql.append(" and miClass like ?  ");
			values.add("%"+query.getMiClass()+"%");
		}
		//jql.append("order by bizCode");
		Page page = new Page();
		page.setStart(start);
		page.setPageSize(limit);
		page.setQuery(jql.toString());
		page.setValues(values.toArray());
		miHisCompareManager.findPage(page);
		return ResultUtils.renderPageResult(page);
	}
}
