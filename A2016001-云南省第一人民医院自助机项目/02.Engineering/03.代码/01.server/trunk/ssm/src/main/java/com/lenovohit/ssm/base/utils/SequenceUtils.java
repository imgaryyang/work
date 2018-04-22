package com.lenovohit.ssm.base.utils;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.lenovohit.core.exception.BaseException;
import com.lenovohit.core.manager.GenericManager;
import com.lenovohit.core.utils.SpringUtils;
import com.lenovohit.ssm.base.model.Sequence;
public class SequenceUtils {
    private static SequenceUtils _instance = new SequenceUtils();
    private static final int KEY_POOL_SIZE = 10;      	//Sequence值缓存大小
    private Map<String, Sequence> seqKeyMap; 			//Sequence载体容器

    private GenericManager<Sequence, String> sequenceManager;

    @SuppressWarnings("unchecked")
	private void init() {
    	seqKeyMap = new HashMap<String, Sequence>();
    	sequenceManager = (GenericManager<Sequence, String>)SpringUtils.getBean("sequenceManager");
    	List<Sequence> sl = this.sequenceManager.findAll();
    	for(Sequence sequence : sl){
    		sequence.setNextValue(sequence.getSeqValue());
    		seqKeyMap.put(sequence.getSeqKey(), sequence);
    	}
    }

    /**
     * 禁止外部实例化
     */
    private SequenceUtils() {
    }

    /**
     * 获取SequenceUtils的单例对象
     * @return SequenceUtils的单例对象
     */
    public static SequenceUtils getInstance() {
        return _instance;
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
    
    /**
     * Oracle 使用
     * 获取下一个 Sequence键值
     * @param seqKey Sequence名称
     * @return 下一个Sequence键值
     */
    public synchronized long getNextValue(String seqKey) {
        Sequence sequence = null;
        String _sequence = null;
        if(null == seqKeyMap || null == sequenceManager) {
        	init();
        }
        if (seqKeyMap.containsKey(seqKey)) {
            sequence = seqKeyMap.get(seqKey);
        } else {
        	throw new BaseException("未找到对应Sequence!");
        }
        
        String sql = "SELECT " + sequence.getSeqCode() +".NEXTVAL FROM DUAL";
		List<?> list = (List<?>) this.sequenceManager.findBySql(sql);
		if (list != null && list.size() > 0) {
			_sequence = list.get(0) + "";
		}
		
		return Long.valueOf(_sequence);
    }
    
    
}