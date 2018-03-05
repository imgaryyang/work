package com.lenovohit.hcp.pharmacy.web.rest;

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
import com.lenovohit.hcp.pharmacy.model.PhaStoreInfo;

@RestController
@RequestMapping("/hcp/pharmacy/phaStoreInfo")
public class PhaStoreInfoRestController extends HcpBaseRestController {
	
	@Autowired
	private GenericManager<PhaStoreInfo, String> phaStoreInfoManager;
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
		HcpUser user = this.getCurrentUser();
		PhaStoreInfo storeQuery = JSONUtils.deserialize(data, PhaStoreInfo.class);
		StringBuilder jql = new StringBuilder( " select store from PhaStoreInfo store "
				+ "left join store.drugInfo drug "
				+ "left join store.companyInfo company "
				+ "left join store.companySupply companySupply "
				+ "where 1 = 1 ");
		List<Object> values = new ArrayList<Object>();
		
		jql.append(" and store.hosId = ? ");
		values.add(user.getHosId());
		//查询码（药品名称/拼音/五笔/药品编码）、药品分类、药品性质、药品规格、库房、有效期（默认<=）
		if(!StringUtils.isEmpty(storeQuery.getTradeName())){
			jql.append("and (store.tradeName like ? or drug.commonSpell like ? or drug.commonName like ? or drug.tradeName like ? or drug.tradeSpell like ? or drug.commonWb like ? or store.drugCode like ? or drug.barcode = ? ) ");
			values.add("%"+storeQuery.getTradeName()+"%");
			values.add("%"+storeQuery.getTradeName()+"%");
			values.add("%"+storeQuery.getTradeName()+"%");
			values.add("%"+storeQuery.getTradeName()+"%");
			values.add("%"+storeQuery.getTradeName()+"%");
			values.add("%"+storeQuery.getTradeName()+"%");
			values.add("%"+storeQuery.getTradeName()+"%");
			values.add("%"+storeQuery.getTradeName()+"%");
		}
		if(!StringUtils.isEmpty(storeQuery.getDrugType())){
			jql.append("and store.drugType = ? ");
			values.add(storeQuery.getDrugType());
		}
		if (storeQuery.getDrugInfo() != null) {
			if(!StringUtils.isEmpty(storeQuery.getDrugInfo().getDrugQuality())){
				jql.append("and drug.drugQuality = ? ");
				values.add(storeQuery.getDrugInfo().getDrugQuality());
			}
		}

		if(!StringUtils.isEmpty(storeQuery.getSpecs())){
			jql.append("and store.specs = ? ");
			values.add(storeQuery.getSpecs());
		}
		if(!StringUtils.isEmpty(storeQuery.getDeptId())){
			jql.append("and store.deptId = ? ");
			values.add(storeQuery.getDeptId());
		}
		if(!StringUtils.isEmpty(storeQuery.getValidDate())){
			jql.append("and store.validDate <= ? ");
			values.add(storeQuery.getValidDate());
		}
		
		jql.append("order by store.tradeName, store.validDate asc, store.updateTime desc");
		
		Page page = new Page();
		page.setStart(start);
		page.setPageSize(limit);
		page.setQuery(jql.toString());
		page.setValues(values.toArray());
		phaStoreInfoManager.findPage(page);
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
        PhaStoreInfo storeQuery = JSONUtils.deserialize(data, PhaStoreInfo.class);
        StringBuilder jql = new StringBuilder( " select store from PhaStoreInfo store left join store.drugInfo drug left join store.companyInfo company where 1 = 1 ");
        List<Object> values = new ArrayList<Object>();
        
        // 当前医院
        jql.append(" and store.hosId = '" + this.getCurrentUser().getHosId() + "' ");
        // 当前科室
        jql.append(" and store.deptId = '" + this.getCurrentUser().getLoginDepartment().getId() + "' ");
        
        HcpCtrlParam hcpCtrlParam = CtrlParamUtil.getCtrlParm(this.getCurrentUser().getHosId(), "DRUG_VALID_DATE");
        if (hcpCtrlParam != null)
        {
            jql.append(" and datediff(DAY,getdate(),valid_date) <= " + hcpCtrlParam.getControlParam() + " ");
        }
        
        //查询码（药品名称/拼音/五笔/药品编码）、药品分类、药品性质、药品规格、库房、有效期（默认<=）
        if(!StringUtils.isEmpty(storeQuery.getTradeName())){
            jql.append("and (store.tradeName like ? or drug.commonSpell like ? or drug.tradeSpell like ? or drug.commonName like ? or drug.tradeName like ? or drug.commonWb like ? or store.drugCode like ? or drug.barcode = ? ) ");
            values.add("%"+storeQuery.getTradeName()+"%");
            values.add("%"+storeQuery.getTradeName()+"%");
            values.add("%"+storeQuery.getTradeName()+"%");
            values.add("%"+storeQuery.getTradeName()+"%");
            values.add("%"+storeQuery.getTradeName()+"%");
            values.add("%"+storeQuery.getTradeName()+"%");
            values.add("%"+storeQuery.getTradeName()+"%");
            values.add(storeQuery.getTradeName());
        }
        if(!StringUtils.isEmpty(storeQuery.getDrugType())){
            jql.append("and store.drugType = ? ");
            values.add(storeQuery.getDrugType());
        }
        if (storeQuery.getDrugInfo() != null) {
            if(!StringUtils.isEmpty(storeQuery.getDrugInfo().getDrugQuality())){
                jql.append("and drug.drugQuality = ? ");
                values.add(storeQuery.getDrugInfo().getDrugQuality());
            }
        }

        if(!StringUtils.isEmpty(storeQuery.getSpecs())){
            jql.append("and store.specs = ? ");
            values.add(storeQuery.getSpecs());
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
        phaStoreInfoManager.findPage(page);
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
		PhaStoreInfo query =  JSONUtils.deserialize(data, PhaStoreInfo.class);
		StringBuilder jql = new StringBuilder( " select a from PhaStoreInfo a left join a.drugInfo b where 1=1 ");
		List<Object> values = new ArrayList<Object>();
		System.out.println(query);
//		if(StringUtils.isNotEmpty(query.getDrugId())){
//			jql.append(" and drugId = ?");
//			values.add(query.getDrugId());
//		}
		if(StringUtils.isNotBlank(query.getDrugInfo())&&StringUtils.isNotBlank(query.getDrugInfo().getId())){
			jql.append(" and b.id = ? ");
			values.add(query.getDrugInfo().getId());
		}
		if(StringUtils.isNotEmpty(query.getDrugCode())){
			jql.append(" and a.drugCode = ? ");
			values.add(query.getDrugCode());
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
		List<PhaStoreInfo> models = phaStoreInfoManager.find(jql.toString(), values.toArray());
		return ResultUtils.renderSuccessResult(models);
	}
	
	/**
	 * 更新
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/update", method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result forUpdate(@RequestBody String data) {
		PhaStoreInfo model =  JSONUtils.deserialize(data, PhaStoreInfo.class);
		if(model==null || StringUtils.isBlank(model.getId())){
			return ResultUtils.renderFailureResult("不存在此对象");
		}
		Date now =  new Date();
		HcpUser user = this.getCurrentUser();
		model.setUpdateOper(user.getName());
		model.setUpdateTime(now);
//		PhaDrugInfo info = this.phaDrugInfoManager.get(model.getDrugInfo().getId());
//		model.setDrugInfo(info);
		this.phaStoreInfoManager.save(model);
		return ResultUtils.renderSuccessResult();
	}
	
	// 只允许更新部分字段
	@RequestMapping(value = "/saveEdit", method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result forSaveEdit(@RequestBody String data) {
		try {
			List<PhaStoreInfo> inputList =  (List<PhaStoreInfo>) JSONUtils.parseObject(data,new TypeReference< List<PhaStoreInfo>>(){});
			if (inputList==null){
				throw new RuntimeException("不存在inputList对象");
			}
			List<PhaStoreInfo> storeInfoList = new ArrayList<>();
	
			for( PhaStoreInfo input : inputList ) {
				if(input==null || StringUtils.isBlank(input.getId())){
					throw new RuntimeException("不存在input对象");
				}
				
				// 先查再更新，只更新部分字段，不影响其他字段
				PhaStoreInfo storeInfo = (PhaStoreInfo) phaStoreInfoManager.get(input.getId());
				if (storeInfo == null) {
					throw new RuntimeException("未找到【"+input.getTradeName()+"】库存明细记录");
				}
				storeInfo.setValidDate(input.getValidDate());
				storeInfo.setStop(input.isStop());	
				storeInfo.setStayAlert(input.getStayAlert());			//滞留预警
				storeInfoList.add(storeInfo);
			}

			phaStoreInfoManager.batchSave(storeInfoList);
		} catch(Exception e) {
			e.printStackTrace();
			System.out.println(e.getMessage());
			return ResultUtils.renderFailureResult(e.getMessage());
		}
		return ResultUtils.renderSuccessResult("保存成功");
	}
}
