package com.lenovohit.hcp.material.web.rest;

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
import com.lenovohit.hcp.material.model.MatStoreInfo;

@RestController
@RequestMapping("/hcp/material/matStoreInfo")
public class MatStoreInfoRestController extends HcpBaseRestController {
	
	@Autowired
	private GenericManager<MatStoreInfo, String> matStoreInfoManager;
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
		MatStoreInfo storeQuery = JSONUtils.deserialize(data, MatStoreInfo.class);
		StringBuilder jql = new StringBuilder( " select store from MatStoreInfo store "
				+ "left join store.materialInfo material "
				+ "left join store.companyInfo company "
				+ "left join store.companySupply companySupply "
				+ "where 1 = 1 ");
		List<Object> values = new ArrayList<Object>();
		
		//查询码（药品名称/拼音/五笔/药品编码）、药品分类、药品性质、药品规格、库房、有效期（默认<=）
		if(!StringUtils.isEmpty(storeQuery.getTradeName())){
			jql.append("and (store.tradeName like ? or material.commonSpell like ? or material.commonWb like ? or store.materialCode like ? or material.barcode = ? ) ");
			values.add("%"+storeQuery.getTradeName()+"%");
			values.add("%"+storeQuery.getTradeName()+"%");
			values.add("%"+storeQuery.getTradeName()+"%");
			values.add("%"+storeQuery.getTradeName()+"%");  
			values.add(storeQuery.getTradeName());  
		}
		if(!StringUtils.isEmpty(storeQuery.getMaterialType())){
			jql.append("and store.materialType = ? ");
			values.add(storeQuery.getMaterialType());
		}
//		if (storeQuery.getMatInfo() != null) {
//			if(!StringUtils.isEmpty(storeQuery.getMatInfo().getMaterialQuality())){
//				jql.append("and drug.drugQuality = ? ");
//				values.add(storeQuery.getMatInfo().getMaterialQuality());
//			}
//		}

		if(!StringUtils.isEmpty(storeQuery.getMaterialSpecs())){
			jql.append("and store.materialSpecs = ? ");
			values.add(storeQuery.getMaterialSpecs());
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
		matStoreInfoManager.findPage(page);
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
        MatStoreInfo storeQuery = JSONUtils.deserialize(data, MatStoreInfo.class);
        StringBuilder jql = new StringBuilder( " select store from MatStoreInfo store left join store.materialInfo material left join store.companyInfo company where 1 = 1 ");
        List<Object> values = new ArrayList<Object>();
        
        // 当前医院
        jql.append(" and store.hosId = '" + this.getCurrentUser().getHosId() + "' ");
        // 当前科室
        jql.append(" and store.deptId = '" + this.getCurrentUser().getLoginDepartment().getId() + "' ");
        
        HcpCtrlParam hcpCtrlParam = CtrlParamUtil.getCtrlParm(this.getCurrentUser().getHosId(), "MATERIAL_VALID_DATE");
        if (hcpCtrlParam != null)
        {
            jql.append(" and datediff(DAY,getdate(),valid_date) <= " + hcpCtrlParam.getControlParam() + " ");
        }
        
        //查询码（药品名称/拼音/五笔/药品编码）、药品分类、药品性质、药品规格、库房、有效期（默认<=）
        if(!StringUtils.isEmpty(storeQuery.getTradeName())){
            jql.append("and (store.tradeName like ? or material.commonSpell like ? or material.commonWb like ? or store.materialCode like ? or material.barcode = ? ) ");
            values.add("%"+storeQuery.getTradeName()+"%");
            values.add("%"+storeQuery.getTradeName()+"%");
            values.add("%"+storeQuery.getTradeName()+"%");
            values.add("%"+storeQuery.getTradeName()+"%");
            values.add(storeQuery.getTradeName());
        }
        if(!StringUtils.isEmpty(storeQuery.getMaterialType())){
            jql.append("and store.materialType = ? ");
            values.add(storeQuery.getMaterialType());
        }
//        if (storeQuery.getMatInfo() != null) {
//            if(!StringUtils.isEmpty(storeQuery.getMatInfo().getMaterialQuality())){
//                jql.append("and drug.drugQuality = ? ");
//                values.add(storeQuery.getMatInfo().getMaterialQuality());
//            }
//        }

        if(!StringUtils.isEmpty(storeQuery.getMaterialSpecs())){
            jql.append("and store.materialSpecs = ? ");
            values.add(storeQuery.getMaterialSpecs());
        }
        if(!StringUtils.isEmpty(storeQuery.getDeptId())){
            jql.append("and store.deptId = ? ");
            values.add(storeQuery.getDeptId());
        }
        if(!StringUtils.isEmpty(storeQuery.getValidDate())){
            jql.append("and store.validDate <= ? ");
            values.add(storeQuery.getValidDate());
        }
        jql.append(" order by datediff(DAY,getdate(),valid_date) asc ");
        Page page = new Page();
        page.setStart(start);
        page.setPageSize(limit);
        page.setQuery(jql.toString());
        page.setValues(values.toArray());
        matStoreInfoManager.findPage(page);
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
		MatStoreInfo query =  JSONUtils.deserialize(data, MatStoreInfo.class);
		StringBuilder jql = new StringBuilder( " select a from MatStoreInfo a left join a.materialInfo b where 1=1 ");
		List<Object> values = new ArrayList<Object>();
		System.out.println(query);
//		if(StringUtils.isNotEmpty(query.getMaterialId())){
//			jql.append(" and drugId = ?");
//			values.add(query.getMaterialId());
//		}
		if(StringUtils.isNotBlank(query.getMaterialInfo())&&StringUtils.isNotBlank(query.getMaterialInfo().getId())){
			jql.append(" and b.id = ? ");
			values.add(query.getMaterialInfo().getId());
		}
		if(StringUtils.isNotEmpty(query.getMaterialCode())){
			jql.append(" and a.materialCode = ? ");
			values.add(query.getMaterialCode());
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
		List<MatStoreInfo> models = matStoreInfoManager.find(jql.toString(), values.toArray());
		return ResultUtils.renderSuccessResult(models);
	}
	
	/**
	 * 更新
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/update", method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result forUpdate(@RequestBody String data) {
		MatStoreInfo model =  JSONUtils.deserialize(data, MatStoreInfo.class);
		if(model==null || StringUtils.isBlank(model.getId())){
			return ResultUtils.renderFailureResult("不存在此对象");
		}
		Date now =  new Date();
		HcpUser user = this.getCurrentUser();
		model.setUpdateOper(user.getName());
		model.setUpdateTime(now);
//		PhaDrugInfo info = this.phaDrugInfoManager.get(model.getMatInfo().getId());
//		model.setMaterialInfo(info);
		this.matStoreInfoManager.save(model);
		return ResultUtils.renderSuccessResult();
	}
	
	// 只允许更新部分字段
	@RequestMapping(value = "/saveEdit", method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result forSaveEdit(@RequestBody String data) {
		try {
			List<MatStoreInfo> inputList =  (List<MatStoreInfo>) JSONUtils.parseObject(data,new TypeReference< List<MatStoreInfo>>(){});
			if (inputList==null){
				throw new RuntimeException("不存在inputList对象");
			}
			List<MatStoreInfo> storeInfoList = new ArrayList<>();
	
			for( MatStoreInfo input : inputList ) {
				if(input==null || StringUtils.isBlank(input.getId())){
					throw new RuntimeException("不存在input对象");
				}
				
				// 先查再更新，只更新部分字段，不影响其他字段
				MatStoreInfo storeInfo = (MatStoreInfo) matStoreInfoManager.get(input.getId());
				if (storeInfo == null) {
					throw new RuntimeException("未找到【"+input.getTradeName()+"】库存明细记录");
				}
				storeInfo.setValidDate(input.getValidDate());
				storeInfo.setStop(input.isStop());	
				storeInfoList.add(storeInfo);
			}

			matStoreInfoManager.batchSave(storeInfoList);
		} catch(Exception e) {
			e.printStackTrace();
			System.out.println(e.getMessage());
			return ResultUtils.renderFailureResult(e.getMessage());
		}
		return ResultUtils.renderSuccessResult("保存成功");
	}
}
