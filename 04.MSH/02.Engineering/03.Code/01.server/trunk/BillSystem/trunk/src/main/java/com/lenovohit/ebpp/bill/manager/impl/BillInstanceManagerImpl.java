package com.lenovohit.ebpp.bill.manager.impl;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;

import javax.persistence.EntityManager;
import javax.persistence.ParameterMode;
import javax.persistence.PersistenceContext;
import javax.persistence.StoredProcedureQuery;
import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;

import com.lenovohit.core.dao.GenericDao;
import com.lenovohit.core.dao.Page;
import com.lenovohit.core.exception.BaseException;
import com.lenovohit.core.manager.impl.GenericManagerImpl;
import com.lenovohit.core.utils.DateUtils;
import com.lenovohit.core.utils.Reflections;
import com.lenovohit.core.utils.StringUtils;
import com.lenovohit.ebpp.bill.Dict.Dict;
import com.lenovohit.ebpp.bill.manager.BillInstanceManager;
import com.lenovohit.ebpp.bill.model.BillInstance;
import com.lenovohit.ebpp.bill.model.PayInfo;

@Transactional
public class BillInstanceManagerImpl extends GenericManagerImpl<BillInstance, String> implements BillInstanceManager{

	public BillInstanceManagerImpl(GenericDao<BillInstance, String> dao) {
		super(dao);
	}
	
	public static final String BILL_SEQ_NAME = "billseqno";
	public static final int BILL_SEQ_LENGTH = 8;
	public static final String BILL_SEQ_PRE = "BILL";

	@Autowired
	private GenericDao<PayInfo, String> payInfoDao;
	
	/**
	 * 
	 * @param seqName 序列号名称
	 * @param seqRule 序列号规则
	 * @param size 序列号长度
	 * @return
	 */
	public String getSeqNo(String seqName, String seqRule, int size){
		String[] arr = getSeqNo(seqName, seqRule, 1, size);
		return arr[0];
	}
	
	/**
	 * 
	 * @param seqName 序列号名称
	 * @param seqRule 序列号规则
	 * @param range 序列号范围 一次取一个放1，最小从1开始
	 * @param size 序列号长度
	 * @return
	 */
	public String[] getSeqNo(String seqName, String seqRule, int range, int size){
		String[] arr = new String[range];
		StoredProcedureQuery spq = em.createStoredProcedureQuery("getSeqNo");
		spq.registerStoredProcedureParameter("seqName", String.class, ParameterMode.IN);
		spq.registerStoredProcedureParameter("seqRule", String.class, ParameterMode.IN);
		spq.registerStoredProcedureParameter("seqRange", Integer.class, ParameterMode.IN);
		spq.registerStoredProcedureParameter("seqNo", Integer.class, ParameterMode.OUT);
		spq.setParameter("seqName", seqName);
		spq.setParameter("seqRule", seqRule);
		spq.setParameter("seqRange", range);
		spq.execute();
		
		String seqNo = spq.getOutputParameterValue("seqNo").toString();
		if(StringUtils.isEmpty(seqNo)) {
			throw new BaseException("获取"+seqName+"序列号错误，规则为"+seqRule+"，长度为"+size);
		}
		
		int seq = Integer.parseInt(seqNo);
		String seqStr = "";
		for(int i=0; i<range; i++) {
			seqStr = (seq + i) + "";
			if(seqStr.length()<size){
				seqStr = StringUtils.repeat("0", size-seqStr.length()) + seqStr;
			} else if(seqStr.length()>size){
				throw new BaseException("获取"+seqName+"序列号错误，序列号"+seqStr+"超出指定长度"+size);
			}
			arr[i] = BILL_SEQ_PRE + seqRule + seqStr;
		}
		return arr;
	}
	
	@Override
	public BillInstance create(BillInstance tbi) throws BaseException {
		if (StringUtils.isEmpty(tbi.getOriBizNo())) {
			throw new BaseException("账单业务号不可为空！");
		}
		String rule = DateUtils.date2String(new Date(), "yyyyMMdd");
		String curr1 = DateUtils.date2String(new Date(), "yyyy-MM-dd");
		String curr2 = DateUtils.date2String(new Date(), "yyyy-MM-dd HH:mm:ss");

		BillInstance biVld = this.findOneByProp("oriBizNo", tbi.getOriBizNo());
		if (null != biVld) {
//			throw new BaseException("该账单已存在,账单单ID为：【" + biVld.getId() + "】，业务单号为：【" + tbi.getOriBizNo() + "】！");
			throw new BaseException("该账单已存在,账单流水号为：【" + biVld.getNo() + "】，业务单号为：【" + tbi.getOriBizNo() + "】！");
		}
		tbi.setFlag(BillInstance.FLAG_ENABLED);
		tbi.setStatus(BillInstance.STATUS_NEW);
		tbi.setNo(getSeqNo(BILL_SEQ_NAME, rule, BILL_SEQ_LENGTH));
		tbi.setCreatedDate(curr1);
		tbi.setCreatedOn(curr2);
		tbi.setUpdatedOn(curr2);
		tbi.setSyncType(Dict.SYNC_TYPE_INIT);
		tbi.setSyncFlag(Dict.SYNC_FLAG_PENDING);
		tbi.setTransDate(getTransDate(tbi.getTransTime()));
		tbi = this.save(tbi);

		return tbi;
	}
	
	private String getTransDate(String transTime) {
		if(transTime!=null && transTime.length()>=10){
			return transTime.substring(0, 10);
		}
		return transTime;
	}

	@Override
	public List<BillInstance> create(List<BillInstance> tbis) throws BaseException {
		// TODO Auto-generated method stub
		this.batchSave(tbis);
		return tbis;
	}

	@Override
	public BillInstance update(BillInstance tbi) throws BaseException {
		BillInstance bi = null;
		
		try {
			bi = this.findOneByProp("oriBizNo", tbi.getOriBizNo());
			if (null == bi){
				throw new BaseException("未查到对应账单信息！");
			}
			bi.setOldOriBizNo(tbi.getOldOriBizNo());
			bi.setBizChannel(tbi.getBizChannel());
			bi.setType(tbi.getType());
//			bi.setCreatedOn(tbi.getCreatedOn());
			bi.setMemo(tbi.getMemo());
			bi.setPayeeAcctNo(tbi.getPayeeAcctNo());
			bi.setPayeeCode(tbi.getPayeeCode());
			bi.setPayeeName(tbi.getPayeeName());
			bi.setPayerAcctNo(tbi.getPayerAcctNo());
			bi.setPayerCode(tbi.getPayerCode());
			bi.setPayerName(tbi.getPayerName());
			bi.setCcy(tbi.getCcy());
			bi.setAmt(tbi.getAmt());
			bi.setUpdatedOn(DateUtils.date2String(new Date(), "yyyy-MM-dd HH:mm:ss"));
		} catch (Exception e) {
			e.printStackTrace();
			throw new BaseException(e);
		}
		return this.save(bi);
	}

	@Override
	public List<BillInstance> update(List<BillInstance> tbis) throws BaseException {
		// TODO Auto-generated method stub
		return this.batchSave(tbis);
	}

	@Override
	public BillInstance updateStatus(BillInstance tbi) throws BaseException {
		BillInstance bi = this.findOneByProp("no", tbi.getNo());
		bi.setStatus(tbi.getStatus());
		bi.setUpdatedOn(DateUtils.date2String(new Date(), "yyyy-MM-dd HH:mm:ss"));
		this.save(bi);
		return bi;
	}

	@Override
	public int updateStatus(List<BillInstance> tbis) throws BaseException {
//		String sql = "update IH_EBPP_BILLINSTANCE set FLAG = ? where id = ";

		return 0;
	}

	@Override
	public BillInstance abandon(BillInstance tbi) throws BaseException {
		BillInstance bi = this.findOneByProp("no", tbi.getNo());
		bi.setFlag(BillInstance.FLAG_DISABLED);
		bi.setUpdatedOn(DateUtils.date2String(new Date(), "yyyy-MM-dd HH:mm:ss"));
		this.save(bi);
		return bi;
	}

	@Override
	public int abandon(List<BillInstance> tbis) throws BaseException {
		// TODO Auto-generated method stub
		return 0;
	}

	@Override
	public Page query(Map<?, ?> params) throws BaseException {

		Page p = new Page();
		String jql = "from BillInstance where 1=1 ";

		if (null != params.get("pageSize")) {
			p.setPageSize(params.get("pageSize").toString());
		}

		if (null != params.get("start")) {
			p.setStart(params.get("start").toString());
		}

		List<Object> values = new ArrayList<Object>();

		List<String> fieldNames = Reflections.getFieldNames(BillInstance.class);
		for (Object key : params.keySet()) {
			if (fieldNames.indexOf(key.toString())<0){
				continue;
			}
			if ("start"!=key.toString()&&"pageSize"!=key.toString()) {
				if (params.get(key) instanceof String && StringUtils.isNotEmpty(params.get(key).toString())) {
					jql += "and " + key + " like ? ";
					values.add("%" + params.get(key).toString() + "%");
				} else if ((params.get(key) instanceof Integer || params.get(key) instanceof Float
						|| params.get(key) instanceof Double) && StringUtils.isNotEmpty(params.get(key).toString())) {
					jql += "and " + key + " = ? ";
					values.add(params.get(key));
				}
			}
		}

		if (!values.isEmpty()) {
			p.setValues(values.toArray());
		}

		p.setQuery(jql);
		this.findPage(p);
		return p;
	}

	@Override
	public void loadPayInfo(List<PayInfo> pis ) throws BaseException {
		String curr1 = DateUtils.date2String(new Date(), "yyyy-MM-dd");
		String curr2 = DateUtils.date2String(new Date(), "yyyy-MM-dd HH:mm:ss");
		//得到PayInfo公共信息
		PayInfo pubpi = pis.get(0);
		
		// 检查账单业务单号是否存在
		BillInstance bi = this.findOneByProp("oriBizNo", pubpi.getOriBizNo());
		if ( null == bi ){
			throw new BaseException("未找到对应账单信息！");
		}
		//2016.05.26增加支付前检测账单是否已支付 by djl
		if( !BillInstance.STATUS_NEW.equals(bi.getStatus())){
			throw new BaseException("不是待缴费账单！");
		}
		PayInfo pi = null;
		
		// 检查支付流水是否存在
		if(StringUtils.isEmpty(pubpi.getPayNo())) {
			throw new BaseException("支付流水号为空！");
		}
		//第0条被公共付款信息占用
		for(int i =1;i<pis.size();i++){
				pi = pis.get(i);
				
				if( StringUtils.isEmpty(pi.getWay())){
					throw new BaseException("支付方式为空！");
				}
				
				pi.setNo(pubpi.getNo());
				pi.setOriBizNo(pubpi.getOriBizNo());
				pi.setPayNo(pubpi.getPayNo());
				pi.setPayChannel(pubpi.getPayChannel());
				pi.setPayedTime(pubpi.getPayedTime());
				pi.setStatus(pubpi.getStatus());
				pi.setCreatedDate(curr1);
				pi.setCreatedOn(curr2);
				pi.setUpdatedOn(curr2);
				pi.setSyncType(Dict.SYNC_TYPE_INIT);
				pi.setSyncFlag(Dict.SYNC_FLAG_PENDING);
				pi.setTranDate(getTransDate(pi.getPayedTime()));
				
				String jql = "from PayInfo where 1 = 1";
				jql += " AND payNo = ? AND way = ? ";
				
				List<PayInfo> values = this.payInfoDao.find(jql, pi.getPayNo(), pi.getWay());
				
				if( values!=null && values.size() > 0 ){
					throw new BaseException("支付信息重复，支付流水号+支付方式不唯一！");
				}
				
				//2016.05.26 取消支付成功通知的支付状态检查 by djl
	//			if( !BillInstance.STATUS_PAYING.equals(bi.getStatus())){
	//				throw new BaseException("账单不是待支付状态！");
	//			}
				
				// 插入支付信 和账单支付信息关系表
				this.payInfoDao.save(pi);
//				em.flush();
	
//				String sql = "insert into IH_EBPP_BILLPAYINFO (B_ID, P_ID) values (? , ?)";
//				this.executeSql(sql, bi.getId(), pi.getId());
			}
			// 更新账单状态
			bi.setStatus(BillInstance.STATUS_PAYED_SUCCESS);
			bi.setUpdatedOn(curr2);
			this.update(bi);
	}
	
	@PersistenceContext
	private EntityManager em;

	@Override
	public void batchLoadPayInfo(List<PayInfo> tpds) throws BaseException {
		// TODO Auto-generated method stub
	}

}
