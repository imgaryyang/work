package com.lenovohit.hwe.base.utils;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.util.StringUtils;

import com.lenovohit.core.exception.BaseException;
import com.lenovohit.core.manager.GenericManager;
import com.lenovohit.core.utils.SpringUtils;
import com.lenovohit.hwe.base.dao.RedisSequenceDao;
import com.lenovohit.hwe.base.model.Sequence;
public class SeqCalculatorUtils {
    private static Map<String, Sequence> seqKeyMap = new HashMap<String, Sequence>(); 			//Sequence载体容器

    @SuppressWarnings("unchecked")
	private static void init() {
    	GenericManager<Sequence, String> sequenceManager = (GenericManager<Sequence, String>)SpringUtils.getBean("sequenceManager");
    	List<Sequence> sl = sequenceManager.findAll();
    	for(Sequence sequence : sl){
    		sequence.setNextValue(sequence.getSeqValue());
    		seqKeyMap.put(sequence.getSeqKey(), sequence);
    	}
    }

//
//    /**
//     * Mysql 使用
//     * 获取下一个 Sequence键值
//     * @param seqKey Sequence名称
//     * @return 下一个Sequence键值
//     */
//    public synchronized long getNextValue(String seqKey) {
//        Sequence sequence = null;
//        Long _seqValue = null;
//        if(null == seqKeyMap || null == sequenceManager) {
//        	init();
//        }
//        if (seqKeyMap.containsKey(seqKey)) {
//            sequence = seqKeyMap.get(seqKey);
//        } else {
//            sequence = new Sequence(seqKey, KEY_POOL_SIZE);
//            this.sequenceManager.save(sequence);
//            seqKeyMap.put(seqKey, sequence);
//        }
//        _seqValue = sequence.getNextSeqValue();
//        
//        if(_seqValue > sequence.getSeqValue()){
//        	sequence.setSeqValue(sequence.getSeqValue() + KEY_POOL_SIZE);
//        	this.sequenceManager.save(sequence);
//        }
//        
//        return _seqValue;
//    }
//    
//    /**
//     * Oracle 使用
//     * 获取下一个 Sequence键值
//     * @param seqKey Sequence名称
//     * @return 下一个Sequence键值
//     */
//    public synchronized long getNextValue(String seqKey) {
//        Sequence sequence = null;
//        String _sequence = null;
//        if(null == seqKeyMap || null == sequenceManager) {
//        	init();
//        }
//        if (seqKeyMap.containsKey(seqKey)) {
//            sequence = seqKeyMap.get(seqKey);
//        } else {
//        	throw new BaseException("未找到对应Sequence!");
//        }
//        
//        String sql = "SELECT " + sequence.getSeqCode() +".NEXTVAL FROM DUAL";
//		List<?> list = (List<?>) this.sequenceManager.findBySql(sql);
//		if (list != null && list.size() > 0) {
//			_sequence = list.get(0) + "";
//		}
//		
//		return Long.valueOf(_sequence);
//    }
    
	  /**
	  * Redis 使用
	  * 获取下一个 Sequence键值
	  * @param seqKey Sequence名称
	  * @return 下一个Sequence键值
	  */
    public synchronized static long getNextValue(Sequence sequence) {
		 if(sequence == null){
			 throw new BaseException("sequence 为空!");
		 }
		 if (null == seqKeyMap || seqKeyMap.size() == 0) {
			init();
		 }
		 RedisSequenceDao redisSequenceDao = (RedisSequenceDao)SpringUtils.getBean("redisSequenceDaoImpl");
		 Sequence _sequence = redisSequenceDao.get(sequence.getSeqCode());
		 if(_sequence == null){
			 redisSequenceDao.add(sequence);
			 _sequence = sequence;
		 }
		 _sequence.setSeqValue(_sequence.getSeqValue() + _sequence.getStep());
		 seqKeyMap.put(sequence.getSeqCode(), _sequence);
		 redisSequenceDao.update(_sequence);
		 
		 return _sequence.getSeqValue();
	 }
    
	/**
	 * "prefix" + "dateformat" + Seq + postfix
	 */
    public synchronized static String calculateCode(String seqKey) {
		Sequence sequence = null;
		if (null == seqKeyMap || seqKeyMap.size() == 0) {
			init();
		}
		if (seqKeyMap.containsKey(seqKey)) {
			sequence = seqKeyMap.get(seqKey);
		} else {
			throw new BaseException("未找到对应【"+ seqKey + "】的Sequence!");
		} 
		
		StringBuffer sb = new StringBuffer("");
		if(!StringUtils.isEmpty(sequence.getPrefix())){
			sb.append(sequence.getPrefix());
		}
		
		if(!StringUtils.isEmpty(sequence.getDateformat())){
			SimpleDateFormat format = new SimpleDateFormat(sequence.getDateformat());
			sb.append(format.format(new Date()));
		}
		
		long seqValue = getNextValue(sequence);
		StringBuffer _seqValue = new StringBuffer(String.valueOf(seqValue)); 
		for(int i = 0; i < (sequence.getSeqLength() - String.valueOf(seqValue).length()); i++){
			if(Sequence.FILL_POSITION_RIGHT.equals(sequence.getFillPosition())){
				_seqValue.append(sequence.getFiller());
			} else {
				_seqValue.insert(0, sequence.getFiller());
			}
		}
		sb.append(_seqValue);
		
		if(!StringUtils.isEmpty(sequence.getPostfix())){
			sb.append(sequence.getPostfix());
		}
		
		return sb.toString();
	}
    
    public static void main(String[] args) {
    	SeqCalculatorUtils.calculateCode("BILL_NO_PAY_SEQ");
    }
    
}