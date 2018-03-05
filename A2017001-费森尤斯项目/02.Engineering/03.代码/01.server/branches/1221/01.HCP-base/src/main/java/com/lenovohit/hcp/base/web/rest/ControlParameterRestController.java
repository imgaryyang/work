package com.lenovohit.hcp.base.web.rest;

import java.util.ArrayList;
import java.util.Date;
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
import com.lenovohit.hcp.base.model.Dictionary;
import com.lenovohit.hcp.base.model.HcpCtrlParam;
import com.lenovohit.hcp.base.model.HcpUser;

@RestController
@RequestMapping("/hcp/base/ctrl")
public class ControlParameterRestController extends HcpBaseRestController {

	@Autowired
	private GenericManager<HcpCtrlParam, String> phaCtrlParamUtil;
	@Autowired
	private GenericManager<Dictionary, String> dictionaryManager;

	@RequestMapping(value = "/page/{start}/{limit}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forPage(@PathVariable("start") String start, @PathVariable("limit") String limit,
			@RequestParam(value = "data", defaultValue = "") String data) {
		HcpCtrlParam query = JSONUtils.deserialize(data, HcpCtrlParam.class);
		StringBuilder jql = new StringBuilder("from HcpCtrlParam where 1=1 ");
		List<Object> values = new ArrayList<Object>();
		HcpUser user = this.getCurrentUser();
		jql.append(" and hosId = ? ");
		values.add(user.getHosId());
		
		if (!StringUtils.isEmpty(query.getControlClass())) {
			jql.append("and controlClass like ? ");
			values.add("%" + query.getControlClass() + "%");
		}
		if (!StringUtils.isEmpty(query.getControlId())) {
			jql.append("and controlId like ? ");
			values.add("%" + query.getControlId() + "%");
		}
		if (!StringUtils.isEmpty(query.getControlNote())) {
			jql.append("and controlNote like ? ");
			values.add("%" + query.getControlNote() + "%");
		}
		// if(!StringUtils.isEmpty(query.getParentId())){
		// jql.append("and parentId like ? ");
		// values.add("%"+query.getParentId()+"%");
		// }
		// if(!StringUtils.isEmpty(query.getHosArea())){
		// jql.append("and hosArea like ? ");
		// values.add("%"+query.getHosArea()+"%");
		// }
		// if(!StringUtils.isEmpty(query.getHosGrade())){
		// jql.append("and hosGrade like ? ");
		// values.add("%"+query.getHosGrade()+"%");
		// }
		// if(!StringUtils.isEmpty(query.getHosType())){
		// jql.append("and hosType like ? ");
		// values.add("%"+query.getHosType()+"%");
		// }
		//
		Page page = new Page();
		page.setStart(start);
		page.setPageSize(limit);
		page.setQuery(jql.toString());
		page.setValues(values.toArray());
		phaCtrlParamUtil.findPage(page);
		return ResultUtils.renderPageResult(page);
	}

	@RequestMapping(value = "/info/{id}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forInfo(@PathVariable("id") String id) {
		HcpCtrlParam controlParameter = phaCtrlParamUtil.get(id);
		return ResultUtils.renderPageResult(controlParameter);
	}

	@RequestMapping(value = "/list", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forList(@RequestParam(value = "data", defaultValue = "") String data) {
		List<HcpCtrlParam> menus = phaCtrlParamUtil.findAll();
		return ResultUtils.renderSuccessResult(menus);
	}

	@RequestMapping(value = "/create", method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8/* TEXT_PLAIN_UTF_8 */)
	public Result forCreateMenu(@RequestBody String data) {
		HcpCtrlParam model = JSONUtils.deserialize(data, HcpCtrlParam.class);
		Date now = new Date();
		HcpUser user = this.getCurrentUser();
		model.setCreateOper(user.getName());
		model.setCreateTime(now);
		model.setUpdateOper(user.getName());
		model.setUpdateTime(now);
		//TODO 校验
		List<HcpCtrlParam> ctrlParams = phaCtrlParamUtil.find(" from HcpCtrlParam  where controlId = ?",model.getControlId());
		if(ctrlParams.size()!=0){
			return  ResultUtils.renderFailureResult("控制ID已存在，请重新输入");
		}
		else{
			HcpCtrlParam saved = this.phaCtrlParamUtil.save(model);
			return ResultUtils.renderSuccessResult(saved);
		}
	}

	@RequestMapping(value = "/update", method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result forUpdate(@RequestBody String data) {
		HcpCtrlParam model = JSONUtils.deserialize(data, HcpCtrlParam.class);
		if (model == null || StringUtils.isBlank(model.getId())) {
			return ResultUtils.renderFailureResult();
		}
		Date now = new Date();
		HcpUser user = this.getCurrentUser();
		model.setUpdateOper(user.getName());
		model.setUpdateTime(now);
		this.phaCtrlParamUtil.save(model);

		return ResultUtils.renderSuccessResult();
	}

	@RequestMapping(value = "/remove/{id}", method = RequestMethod.DELETE, produces = MediaTypes.JSON_UTF_8)
	public Result forDeleteMenu(@PathVariable("id") String id) {
		try {
			this.phaCtrlParamUtil.delete(id);
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
			idSql.append("DELETE FROM B_CONTROLPARAMETER  WHERE ID IN (");
			for (int i = 0; i < ids.size(); i++) {
				idSql.append("?");
				idvalues.add(ids.get(i).toString());
				if (i != ids.size() - 1)
					idSql.append(",");
			}
			idSql.append(")");
			System.out.println(idSql.toString());
			this.phaCtrlParamUtil.executeSql(idSql.toString(), idvalues.toArray());
		} catch (Exception e) {
			e.printStackTrace();
			throw new BaseException("删除失败");
		}
		return ResultUtils.renderSuccessResult();
	}

	@RequestMapping(value = "/type/list", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forTypeList(@RequestParam(value = "data", defaultValue = "") String data) {
		// String columnName;
		// columnName = "PARENT_ID";
		System.console();
		List<HcpCtrlParam> models = phaCtrlParamUtil.find(
				" select distinct '控制分类' as columnDis, cp.controlClass as columnKey, cp.controlClass as columnValue from HcpCtrlParam cp where 1 = 1 ");
		return ResultUtils.renderSuccessResult(models);
	}

	public String ObjectIsNull(Object obj) {
		if (obj == null)
			return "";
		return obj.toString();
	}

}
