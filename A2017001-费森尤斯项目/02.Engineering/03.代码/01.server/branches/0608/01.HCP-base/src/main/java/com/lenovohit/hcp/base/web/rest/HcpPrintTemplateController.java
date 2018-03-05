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
import com.lenovohit.hcp.base.model.HcpPrintTemplate;

@RestController
@RequestMapping("/hcp/base/printTemplate")
public class HcpPrintTemplateController extends HcpBaseRestController {
	@Autowired
	private GenericManager<HcpPrintTemplate, String> hcpPrintTemplateManager;

	@RequestMapping(value = "/create", method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8/* TEXT_PLAIN_UTF_8 */)
	public Result forCreateMenu(@RequestBody String data) {
		HcpPrintTemplate model = JSONUtils.deserialize(data, HcpPrintTemplate.class);
		checkParams(model);
		model.setEffectiveFlag(true);
		// TODO 校验
		HcpPrintTemplate saved = this.hcpPrintTemplateManager.save(model);
		return ResultUtils.renderSuccessResult(saved);
	}

	@RequestMapping(value = "/update", method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result forUpdate(@RequestBody String data) {
		HcpPrintTemplate model = JSONUtils.deserialize(data, HcpPrintTemplate.class);
		if (model == null || StringUtils.isBlank(model.getId())) {
			return ResultUtils.renderFailureResult("不存在此对象");
		}
		this.hcpPrintTemplateManager.save(model);
		return ResultUtils.renderSuccessResult();
	}

	@RequestMapping(value = "/remove/{id}", method = RequestMethod.DELETE, produces = MediaTypes.JSON_UTF_8)
	public Result forDeleteMenu(@PathVariable("id") String id) {
		try {
			this.hcpPrintTemplateManager.delete(id);
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
			this.hcpPrintTemplateManager.executeSql(idSql.toString(), idvalues.toArray());
		} catch (Exception e) {
			e.printStackTrace();
			throw new BaseException("删除失败");
		}
		return ResultUtils.renderSuccessResult();
	}

	private void checkParams(HcpPrintTemplate template) {
		if (StringUtils.isBlank(template.getBizCode()))
			throw new RuntimeException("业务编码不能为空");
	}

	@RequestMapping(value = "/page/{start}/{limit}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forPage(@PathVariable("start") String start, @PathVariable("limit") String limit,
			@RequestParam(value = "data", defaultValue = "") String data) {
		HcpPrintTemplate query = JSONUtils.deserialize(data, HcpPrintTemplate.class);
		StringBuilder jql = new StringBuilder("from HcpPrintTemplate where 1=1 ");
		List<Object> values = new ArrayList<Object>();
		if (!StringUtils.isEmpty(query.getBizCode())) {
			jql.append("and bizCode = ? ");
			values.add(query.getBizCode());
		}
		if (!StringUtils.isEmpty(query.getBizName())) {
			jql.append("and bizName = ? ");
			values.add(query.getBizName());
		}
		jql.append("order by bizCode");
		Page page = new Page();
		page.setStart(start);
		page.setPageSize(limit);
		page.setQuery(jql.toString());
		page.setValues(values.toArray());
		hcpPrintTemplateManager.findPage(page);
		return ResultUtils.renderPageResult(page);
	}
}
