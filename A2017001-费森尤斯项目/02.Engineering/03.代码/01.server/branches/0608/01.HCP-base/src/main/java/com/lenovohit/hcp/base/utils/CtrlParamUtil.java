package com.lenovohit.hcp.base.utils;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;

import com.lenovohit.core.manager.GenericManager;
import com.lenovohit.hcp.base.model.HcpCtrlParam;
import com.lenovohit.core.utils.SpringUtils;
import com.lenovohit.core.utils.StringUtils;

public class CtrlParamUtil {
//    // 有效期预警值
//    public static final String CTRLID_DRUGVALIDDATE = "DRUG_VALID_DATE";
//    // 滞留期预警值
//    public static final String CTRLID_DETENTWARN = "DRUG_UPDATE_TIME";
    private static GenericManager<HcpCtrlParam, String> phaCtrlParamUtil;
    
    public static HcpCtrlParam getCtrlParm(String hosId, final String controlId )
    {
        if( null == phaCtrlParamUtil)phaCtrlParamUtil = (GenericManager<HcpCtrlParam, String>)SpringUtils.getBean("phaCtrlParamUtil");
        StringBuilder jql = new StringBuilder( " select ctrlparam from HcpCtrlParam ctrlparam where 1 = 1 ");
        List<Object> values = new ArrayList<Object>();

        if(!StringUtils.isNotEmpty(hosId) || !StringUtils.isNotEmpty(controlId)){
            return null;
        }
        
        jql.append(" and hosId = ? and controlId = ? ");
        values.add(hosId);
        values.add(controlId);
        
        List<HcpCtrlParam> models = phaCtrlParamUtil.find(jql.toString(), values.toArray());
        if (models.isEmpty())
        {
            return null;
        }
        else
        {
            return models.get(0);
        }
    }
}
