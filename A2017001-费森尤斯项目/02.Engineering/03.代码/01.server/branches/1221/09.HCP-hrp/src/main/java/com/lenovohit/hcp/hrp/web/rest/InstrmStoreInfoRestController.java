package com.lenovohit.hcp.hrp.web.rest;

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

import com.alibaba.fastjson.TypeReference;
import com.lenovohit.core.dao.Page;
import com.lenovohit.core.manager.GenericManager;
import com.lenovohit.core.utils.JSONUtils;
import com.lenovohit.core.utils.StringUtils;
import com.lenovohit.core.web.MediaTypes;
import com.lenovohit.core.web.utils.Result;
import com.lenovohit.core.web.utils.ResultUtils;
import com.lenovohit.hcp.base.model.HcpCtrlParam;
import com.lenovohit.hcp.base.model.HcpUser;
import com.lenovohit.hcp.base.utils.CtrlParamUtil;
import com.lenovohit.hcp.base.web.rest.HcpBaseRestController;
import com.lenovohit.hcp.hrp.model.InstrmStoreInfo;

@RestController
@RequestMapping("/hcp/hrp/instrmStoreInfo")
public class InstrmStoreInfoRestController extends HcpBaseRestController {
	
	@Autowired
	private GenericManager<InstrmStoreInfo, String> instrmStoreInfoManager;
	/**
	 * 分页查询
	 * @param start
	 * @param limit
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/page/{start}/{limit}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forPage(@PathVariable("start") String start, @PathVariable("limit") String limit,
			@RequestParam(value = "data", defaultValue = "") String data){
		System.out.println(data);
		InstrmStoreInfo storeQuery = JSONUtils.deserialize(data, InstrmStoreInfo.class);
		StringBuilder jql = new StringBuilder( " select store from InstrmStoreInfo store "
				+ "left join store.instrmInfo instrm "
				+ "left join store.companyInfo company "
				//+ "left join store.companySupply companySupply "
				+ "where 1 = 1 ");
		List<Object> values = new ArrayList<Object>();
		
		//查询码（药品名称/拼音/五笔/药品编码）、药品分类、药品性质、药品规格、库房、有效期（默认<=）
		if(!StringUtils.isEmpty(storeQuery.getTradeName())){
			jql.append("and (store.tradeName like ? or instrm.commonSpell like ? or instrm.commonWb like ? or store.instrmCode like ?) ");
			values.add("%"+storeQuery.getTradeName()+"%");
			values.add("%"+storeQuery.getTradeName()+"%");
			values.add("%"+storeQuery.getTradeName()+"%");
			values.add("%"+storeQuery.getTradeName()+"%");
		}
		
		HcpUser user = this.getCurrentUser();
		jql.append(" and store.hosId = ? ");
		values.add(user.getHosId());
		jql.append(" and instrm.hosId = ? ");
		values.add(user.getHosId());
		
		//jql.append(" and companySupply.hosId = ? ");
		//values.add(user.getHosId());
		
		if(!StringUtils.isEmpty(storeQuery.getInstrmType())){
			jql.append("and store.instrmType = ? ");
			values.add(storeQuery.getInstrmType());
		}

		if(!StringUtils.isEmpty(storeQuery.getInstrmSpecs())){
			jql.append("and store.specs = ? ");
			values.add(storeQuery.getInstrmSpecs());
		}
		if(!StringUtils.isEmpty(storeQuery.getDeptId())){
			jql.append("and store.deptId = ? ");
			values.add(storeQuery.getDeptId());
		}
		if(!StringUtils.isEmpty(storeQuery.getValidDate())){
			jql.append("and store.validDate <= ? ");
			values.add(storeQuery.getValidDate());
		}
		
		jql.append("order by store.updateTime desc");
		
		Page page = new Page();
		page.setStart(start);
		page.setPageSize(limit);
		page.setQuery(jql.toString());
		page.setValues(values.toArray());
		instrmStoreInfoManager.findPage(page);
		return ResultUtils.renderPageResult(page);
	} 
	
	/**
     * 效期预警分页查询
     * @param start
     * @param limit
     * @param data
     * @return
     */
    @RequestMapping(value = "/validWarnPage/{start}/{limit}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
    public Result forValidWarnPage(@PathVariable("start") String start, @PathVariable("limit") String limit,
            @RequestParam(value = "data", defaultValue = "") String data){
    	System.out.println(data);
        InstrmStoreInfo storeQuery = JSONUtils.deserialize(data, InstrmStoreInfo.class);
        StringBuilder jql = new StringBuilder( " select store from InstrmStoreInfo store left join store.instrmInfo instrm left join store.companyInfo company where 1 = 1 ");
        List<Object> values = new ArrayList<Object>();
        
        // 当前医院
        jql.append(" and store.hosId = '" + this.getCurrentUser().getHosId() + "' ");
        // 当前科室
        jql.append(" and store.deptId = '" + this.getCurrentUser().getLoginDepartment().getId() + "' ");
        
        HcpCtrlParam hcpCtrlParam = CtrlParamUtil.getCtrlParm(this.getCurrentUser().getHosId(), "INSTRM_VALID_DATE");
        if (hcpCtrlParam != null)
        {
            jql.append(" and datediff(DAY,valid_date,getdate()) <= " + hcpCtrlParam.getControlParam() + " ");
        }
        
        //查询码（药品名称/拼音/五笔/药品编码）、药品分类、药品性质、药品规格、库房、有效期（默认<=）
        if(!StringUtils.isEmpty(storeQuery.getTradeName())){
            jql.append("and (store.tradeName like ? or instrm.commonSpell like ? or instrm.commonWb like ? or store.instrmCode like ?) ");
            values.add("%"+storeQuery.getTradeName()+"%");
            values.add("%"+storeQuery.getTradeName()+"%");
            values.add("%"+storeQuery.getTradeName()+"%");
            values.add("%"+storeQuery.getTradeName()+"%");
        }
        if(!StringUtils.isEmpty(storeQuery.getInstrmType())){
            jql.append("and store.instrmType = ? ");
            values.add(storeQuery.getInstrmType());
        }

        if(!StringUtils.isEmpty(storeQuery.getInstrmSpecs())){
            jql.append("and store.specs = ? ");
            values.add(storeQuery.getInstrmSpecs());
        }
        if(!StringUtils.isEmpty(storeQuery.getDeptId())){
            jql.append("and store.deptId = ? ");
            values.add(storeQuery.getDeptId());
        }
        if(!StringUtils.isEmpty(storeQuery.getValidDate())){
            jql.append("and store.validDate <= ? ");
            values.add(storeQuery.getValidDate());
        }
        
        Page page = new Page();
        page.setStart(start);
        page.setPageSize(limit);
        page.setQuery(jql.toString());
        page.setValues(values.toArray());
        instrmStoreInfoManager.findPage(page);
        return ResultUtils.renderPageResult(page);
    }
	
	/**
	 * 查询列表
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/list", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forList(@RequestParam(value = "data", defaultValue = "") String data) {
		System.out.println(data);
		InstrmStoreInfo query =  JSONUtils.deserialize(data, InstrmStoreInfo.class);
		StringBuilder jql = new StringBuilder( " select a from InstrmStoreInfo a left join a.instrmInfo b where 1=1 ");
		List<Object> values = new ArrayList<Object>();
		System.out.println(query);
//		if(StringUtils.isNotEmpty(query.getInstrmId())){
//			jql.append(" and instrmId = ?");
//			values.add(query.getInstrmId());
//		}
		if(StringUtils.isNotBlank(query.getInstrmInfo())&&StringUtils.isNotBlank(query.getInstrmInfo().getId())){
			jql.append(" and b.id = ? ");
			values.add(query.getInstrmInfo().getId());
		}
		if(StringUtils.isNotEmpty(query.getInstrmCode())){
			jql.append(" and a.instrmCode = ? ");
			values.add(query.getInstrmCode());
		}
		if(StringUtils.isNotEmpty(query.getDeptId())){
			jql.append(" and a.deptId = ? ");
			values.add(query.getDeptId());
		}
		if(StringUtils.isNotEmpty(query.getBatchNo())){
			jql.append(" and a.batchNo = ? ");
			values.add(query.getBatchNo());
		}
		if(StringUtils.isNotEmpty(query.getApprovalNo())){
			jql.append(" and a.approvalNo = ? ");
			values.add(query.getApprovalNo());
		}
		if(StringUtils.isNotEmpty(query.getHosId())){
			jql.append(" and a.hosId = ? ");
			values.add(query.getHosId());
		}
		List<InstrmStoreInfo> models = instrmStoreInfoManager.find(jql.toString(), values.toArray());
		return ResultUtils.renderSuccessResult(models);
	}
	
	/**
	 * 更新
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/update", method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result forUpdate(@RequestBody String data) {
		InstrmStoreInfo model =  JSONUtils.deserialize(data, InstrmStoreInfo.class);
		if(model==null || StringUtils.isBlank(model.getId())){
			return ResultUtils.renderFailureResult("不存在此对象");
		}
		Date now =  new Date();
		HcpUser user = this.getCurrentUser();
		model.setUpdateOper(user.getName());
		model.setUpdateTime(now);
//		InstrmInstrmInfo info = this.instrmInstrmInfoManager.get(model.getInstrmInfo().getId());
//		model.setInstrmInfo(info);
		this.instrmStoreInfoManager.save(model);
		return ResultUtils.renderSuccessResult();
	}
	
	// 只允许更新部分字段
	@RequestMapping(value = "/saveEdit", method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result forSaveEdit(@RequestBody String data) {
		try {
			List<InstrmStoreInfo> inputList =  (List<InstrmStoreInfo>) JSONUtils.parseObject(data,new TypeReference< List<InstrmStoreInfo>>(){});
			if (inputList==null){
				throw new RuntimeException("不存在inputList对象");
			}
			List<InstrmStoreInfo> storeInfoList = new ArrayList<>();
	
			for( InstrmStoreInfo input : inputList ) {
				if(input==null || StringUtils.isBlank(input.getId())){
					throw new RuntimeException("不存在input对象");
				}
				
				// 先查再更新，只更新部分字段，不影响其他字段
				InstrmStoreInfo storeInfo = (InstrmStoreInfo) instrmStoreInfoManager.get(input.getId());
				if (storeInfo == null) {
					throw new RuntimeException("未找到【"+input.getTradeName()+"】库存明细记录");
				}
				//storeInfo.setValidDate(input.getValidDate());
				storeInfo.setStop(input.isStop());	
				storeInfo.setLocation(input.getLocation());	
				storeInfoList.add(storeInfo);
			}

			instrmStoreInfoManager.batchSave(storeInfoList);
		} catch(Exception e) {
			e.printStackTrace();
			System.out.println(e.getMessage());
			return ResultUtils.renderFailureResult(e.getMessage());
		}
		return ResultUtils.renderSuccessResult("保存成功");
	}
}
