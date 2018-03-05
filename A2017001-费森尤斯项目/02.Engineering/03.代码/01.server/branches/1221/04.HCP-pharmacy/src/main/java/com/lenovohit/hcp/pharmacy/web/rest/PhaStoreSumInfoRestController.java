package com.lenovohit.hcp.pharmacy.web.rest;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.alibaba.fastjson.JSONObject;
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
import com.lenovohit.hcp.pharmacy.model.PhaStoreSumInfo;

@RestController
@RequestMapping("/hcp/pharmacy/phaStoreSumInfo")
public class PhaStoreSumInfoRestController extends HcpBaseRestController {
	
	@Autowired
	private GenericManager<PhaStoreSumInfo, String> phaStoreSumInfoManager;
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
		PhaStoreSumInfo storeQuery = JSONUtils.deserialize(data, PhaStoreSumInfo.class);
		JSONObject json = JSONObject.parseObject(data);
		String chanel = json.getString("chanel");
		StringBuilder jql = new StringBuilder( " select store from PhaStoreSumInfo store left join store.drugInfo drug left join store.companyInfo company where 1 = 1 ");
		List<Object> values = new ArrayList<Object>();
		HcpUser user = this.getCurrentUser();
		
		if(chanel ==null || "person".equals(chanel)){
			jql.append(" and store.hosId = ? ");
			values.add(user.getHosId());
		} else if (StringUtils.isNotBlank(storeQuery.getHosId())){
			jql.append(" and store.hosId = ? ");
			values.add(storeQuery.getHosId());
		}
		//查询码（药品名称/拼音/五笔/药品编码）、药品分类、药品性质、药品规格、库房、有效期（默认<=）
		if(!StringUtils.isEmpty(storeQuery.getTradeName())){
			jql.append("and (store.tradeName like ? or drug.commonName like ? or drug.tradeName like ? or drug.commonSpell like ? or drug.tradeSpell like ? or drug.commonWb like ? or drug.tradeWb like ? or store.drugCode like ? or drug.barcode = ? ) ");
			values.add("%"+storeQuery.getTradeName()+"%");
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
		
		jql.append("order by store.hosId,store.deptId,store.updateTime desc");
		
		Page page = new Page();
		page.setStart(start);
		page.setPageSize(limit);
		page.setQuery(jql.toString());
		page.setValues(values.toArray());
		phaStoreSumInfoManager.findPage(page);
		return ResultUtils.renderPageResult(page);
	}
	
	
	 /**
     * 库存预警分页查询
     * @param start
     * @param limit
     * @param data
     * @return
     */
    @RequestMapping(value = "/pageInventWarn/{start}/{limit}/{isWarn}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
    public Result forInventWarnPage(@PathVariable("start") String start, @PathVariable("limit") String limit,@PathVariable("isWarn") boolean isWarn,
            @RequestParam(value = "data", defaultValue = "") String data){
        PhaStoreSumInfo storeQuery = JSONUtils.deserialize(data, PhaStoreSumInfo.class);
        StringBuilder jql = new StringBuilder( " select store from PhaStoreSumInfo store left join store.drugInfo drug left join store.companyInfo company where 1 = 1 ");
        List<Object> values = new ArrayList<Object>();
        
        // 当前医院
        jql.append(" and store.hosId = '" + this.getCurrentUser().getHosId() + "' ");
        // 当前科室
        jql.append(" and store.deptId = '" + this.getCurrentUser().getLoginDepartment().getId() + "' ");
        // 临界值
        jql.append(" and (store.alertNum - store.storeSum) >= 0");
        
        //查询码（药品名称/拼音/五笔/药品编码）、药品分类、药品性质、药品规格、库房、有效期（默认<=）
        if(!StringUtils.isEmpty(storeQuery.getTradeName())){
            jql.append("and (store.tradeName like ? or drug.commonName like ? or drug.tradeName like ? or drug.commonSpell like ? or drug.commonWb like ? or store.drugCode like ? or drug.barcode = ? ) ");
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
        
        Page page = new Page();
        page.setStart(start);
        page.setPageSize(limit);
        page.setQuery(jql.toString());
        page.setValues(values.toArray());
        phaStoreSumInfoManager.findPage(page);
        return ResultUtils.renderPageResult(page);
    }
    
    /**
    * 滞留预警分页查询
    * @param start
    * @param limit
    * @param data
    * @return
    */
   @RequestMapping(value = "/pageDetentWarn/{start}/{limit}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
   public Result forDetentWarnPage(@PathVariable("start") String start, @PathVariable("limit") String limit,
           @RequestParam(value = "data", defaultValue = "") String data){
       PhaStoreInfo storeQuery = JSONUtils.deserialize(data, PhaStoreInfo.class);
       StringBuilder jql = new StringBuilder( " select store from PhaStoreInfo store left join store.drugInfo drug left join store.companyInfo company where 1 = 1 ");
       List<Object> values = new ArrayList<Object>();
       
       // 当前医院
       jql.append(" and store.hosId = '" + this.getCurrentUser().getHosId() + "' ");
       // 当前科室
       jql.append(" and store.deptId = '" + this.getCurrentUser().getLoginDepartment().getId() + "' ");
       
       HcpCtrlParam hcpCtrlParam = CtrlParamUtil.getCtrlParm(this.getCurrentUser().getHosId(), "DRUG_UPDATE_TIME");
       //一级预警
       HcpCtrlParam levelLow = CtrlParamUtil.getCtrlParm(this.getCurrentUser().getHosId(), "ALERT_LEVEL_LOW");
       //二级预警
       HcpCtrlParam levelMedium = CtrlParamUtil.getCtrlParm(this.getCurrentUser().getHosId(), "ALERT_LEVEL_MEDIUM");
       //三级预警
       HcpCtrlParam levelHigh = CtrlParamUtil.getCtrlParm(this.getCurrentUser().getHosId(), "ALERT_LEVEL_HIGH");
       if (hcpCtrlParam != null)
       {
           jql.append(" and  (( (store.stayAlert IS NULL) AND DATEDIFF(	DAY,store.updateTime,getdate()) >= " + hcpCtrlParam.getControlParam() + " ) OR ( (store.stayAlert IS NOT NULL) AND store.stayAlert < DATEDIFF(DAY,store.updateTime,getdate()))) ");
       }
       
       //查询码（药品名称/拼音/五笔/药品编码）、药品分类、药品性质、药品规格、库房、有效期（默认<=）
       if(!StringUtils.isEmpty(storeQuery.getTradeName())){
           jql.append("and (store.tradeName like ? or drug.commonSpell like ? or drug.commonName like ? or drug.tradeName like ? or drug.commonWb like ? or store.drugCode like ? or drug.barcode = ? ) ");
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
       jql.append(" order by DATEDIFF(DAY,getdate(),store.updateTime) desc ");
       Map<String,Object> map = new HashMap<String,Object>();
       if(levelLow!=null && StringUtils.isNumeric(levelLow.getControlParam())){
    	   map.put("levelLow", levelLow.getControlParam());
       }
       if(levelMedium!=null && StringUtils.isNumeric(levelMedium.getControlParam())){
    	   map.put("levelMedium", levelMedium.getControlParam());
       }
       if(levelHigh!=null && StringUtils.isNumeric(levelHigh.getControlParam())){
    	   map.put("levelHigh", levelHigh.getControlParam());
       }
       Map<String,Object> dataMap = new HashMap<String,Object>();
       Page page = new Page();
       page.setStart(start);
       page.setPageSize(limit);
       page.setQuery(jql.toString());
       page.setValues(values.toArray());
       phaStoreInfoManager.findPage(page);
       if(page!=null && page.getResult()!=null){
    	   dataMap.put("alertLevel", map);
    	   dataMap.put("data", page.getResult());
    	   page.setResult(dataMap);
       }
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
		PhaStoreSumInfo query =  JSONUtils.deserialize(data, PhaStoreSumInfo.class);
		StringBuilder jql = new StringBuilder( " select store from PhaStoreSumInfo store left join store.drugInfo drug  where 1 = 1 ");
		List<Object> values = new ArrayList<Object>();
		System.out.println(query);
		//查询码（药品名称/拼音/五笔/药品编码）、药品分类、药品性质、药品规格、库房、有效期（默认<=）
		if(!StringUtils.isEmpty(query.getTradeName())){
			jql.append("and (store.tradeName like ? or drug.commonSpell like ? or drug.commonWb like ? or store.drugCode like ?  or drug.barcode = ? ) ");
			values.add("%"+query.getTradeName()+"%");
			values.add("%"+query.getTradeName()+"%");
			values.add("%"+query.getTradeName()+"%");
			values.add("%"+query.getTradeName()+"%");
			values.add(query.getTradeName());
		}
		if(StringUtils.isNotBlank(query.getDrugInfo())&& StringUtils.isNotBlank(query.getDrugInfo().getId())){
			jql.append(" and drug.id = ?");
			values.add(query.getDrugInfo().getId());
		}
		if(StringUtils.isNotEmpty(query.getDrugCode())){
			jql.append(" and store.drugCode = ?");
			values.add(query.getDrugCode());
		}
		if(StringUtils.isNotEmpty(query.getDeptId())){
			jql.append(" and store.deptId = ?");
			values.add(query.getDeptId());
		}
		if(StringUtils.isNotEmpty(query.getHosId())){
			jql.append(" and store.hosId = ?");
			values.add(query.getHosId());
		}
		
		List<PhaStoreSumInfo> models = phaStoreSumInfoManager.find(jql.toString(), values.toArray());
		return ResultUtils.renderSuccessResult(models);
	}
	
	/**
	 * 查询列表--本院库存
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/loadHosSum", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forloadHosSum(@RequestParam(value = "data", defaultValue = "") String data) {
		System.out.println(data);
		PhaStoreSumInfo query =  JSONUtils.deserialize(data, PhaStoreSumInfo.class);
		StringBuilder jql = new StringBuilder( " select sum(storeSum),drugCode,hosId from PhaStoreSumInfo group by hosId,drugCode having hosId=? and drugCode = ? ");
		List<Object> values = new ArrayList<Object>();
		System.out.println(query);
		
		values.add(query.getHosId());
		values.add(query.getDrugCode());
		
		
		List<PhaStoreSumInfo> models = phaStoreSumInfoManager.find(jql.toString(), values.toArray());
		return ResultUtils.renderSuccessResult(models);
	}
	
	
	/**
	 * 更新
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/update", method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result forUpdate(@RequestBody String data) {
		PhaStoreSumInfo model =  JSONUtils.deserialize(data, PhaStoreSumInfo.class);
		if(model==null || StringUtils.isBlank(model.getId())){
			return ResultUtils.renderFailureResult("不存在此对象");
		}
		Date now =  new Date();
		HcpUser user = this.getCurrentUser();
		model.setUpdateOper(user.getName());
		model.setUpdateTime(now);
//		PhaDrugInfo info = this.phaDrugInfoManager.get(model.getDrugInfo().getId());
//		model.setDrugInfo(info);
		this.phaStoreSumInfoManager.save(model);
		return ResultUtils.renderSuccessResult();
	}
	
	// 只允许更新部分字段
	@RequestMapping(value = "/saveEdit", method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result forSaveEdit(@RequestBody String data) {
		try {
			List<PhaStoreSumInfo> inputList =  (List<PhaStoreSumInfo>) JSONUtils.parseObject(data,new TypeReference< List<PhaStoreSumInfo>>(){});
			if (inputList==null){
				throw new RuntimeException("不存在inputList对象");
			}
			List<PhaStoreSumInfo> storeSumInfoList = new ArrayList<>();
	
			for( PhaStoreSumInfo input : inputList ) {
				if(input==null || StringUtils.isBlank(input.getId())){
					throw new RuntimeException("不存在input对象");
				}
				
				// 先查再更新，只更新部分字段，不影响其他字段
				PhaStoreSumInfo storeSumInfo = (PhaStoreSumInfo) phaStoreSumInfoManager.get(input.getId());
				if (storeSumInfo == null) {
					throw new RuntimeException("未找到【"+input.getTradeName()+"】库存明细记录");
				}
//				PhaDrugInfo drugInfo = (PhaDrugInfo) phaDrugInfoManager.get(inputInfo.getDrugId());
				
				// 警戒库存量、药品位置、停用标志
				BigDecimal inputNum = input.getAlertNum();
				if (inputNum == null) inputNum = new BigDecimal(0);
				BigDecimal packQty = new BigDecimal(input.getDrugInfo().getPackQty());
				BigDecimal alertNum = inputNum.multiply(packQty);
				
				storeSumInfo.setAlertNum(alertNum);
				storeSumInfo.setLocation(input.getLocation());
				storeSumInfo.setStop(input.isStop());
				storeSumInfoList.add(storeSumInfo);
			}

			phaStoreSumInfoManager.batchSave(storeSumInfoList);
		} catch(Exception e) {
			e.printStackTrace();
			System.out.println(e.getMessage());
			return ResultUtils.renderFailureResult(e.getMessage());
		}
		return ResultUtils.renderSuccessResult("保存成功");
	}
}
