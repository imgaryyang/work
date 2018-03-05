package com.infohold.ebpp.bill.manager;

import java.util.List;
import java.util.Map;

import com.infohold.core.dao.Page;
import com.infohold.core.exception.BaseException;
import com.infohold.core.manager.GenericManager;
import com.infohold.ebpp.bill.model.BillInstance;
import com.infohold.ebpp.bill.model.PayInfo;

public interface BillInstanceManager extends GenericManager<BillInstance, String>{
	
	public BillInstance create(BillInstance tbi) throws BaseException;
	
	public List<BillInstance> create(List<BillInstance> tbis) throws BaseException;
	
	public BillInstance update(BillInstance tbi) throws BaseException;
	
	public List<BillInstance> update(List<BillInstance> tbis) throws BaseException;
	
	public BillInstance updateStatus(BillInstance tbi) throws BaseException;
	
	public int updateStatus(List<BillInstance> tbis) throws BaseException;
	
	public BillInstance abandon(BillInstance tbi) throws BaseException;

	public int abandon(List<BillInstance> tbis) throws BaseException;
	
	public Page query(Map<?,?> params) throws BaseException;
	
	public void loadPayInfo(List<PayInfo> tpd ) throws BaseException;
	
	public void batchLoadPayInfo(List<PayInfo> tpds) throws BaseException;
	
	public String getSeqNo(String seqName, String seqRule, int size);
	
	public String[] getSeqNo(String seqName, String seqRule, int range, int size);
}
