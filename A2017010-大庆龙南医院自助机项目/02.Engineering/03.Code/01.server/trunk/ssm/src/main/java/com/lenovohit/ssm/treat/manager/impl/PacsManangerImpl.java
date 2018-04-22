package com.lenovohit.ssm.treat.manager.impl;

import java.io.Serializable;
import java.util.List;

import com.lenovohit.core.dao.Page;
import com.lenovohit.core.model.Model;
import com.lenovohit.ssm.treat.dao.PacsDao;
import com.lenovohit.ssm.treat.manager.PacsManager;

/**
 * 
 * @author Exorics
 */
public class PacsManangerImpl<T extends Model, ID extends Serializable> implements PacsManager<T, ID> {

	PacsDao<T, ID> dao;

	public PacsManangerImpl(final PacsDao<T, ID> dao) {
		super();
		this.dao = dao;
	}

	public List<T> find(String jql, Object... values) {
		return this.dao.find(jql, values);
	}

	public List<?> findBySql(String sql, Object... values) {
		return this.dao.findBySql(sql, values);
	}

	public int executeSql(String sql, Object... values) {
		return this.dao.executeSql(sql, values);
	}

	@Override
	public T get(ID id) {
		return this.dao.get(id);
	}

	@Override
	public long getCount(String jql, Object... values) {
		return this.dao.getCount(jql, values);
	}

	@Override
	public T findOne(String jql, Object... values) {
		return this.dao.findOne(jql, values);
	}

	@Override
	public T findOneByProp(String prop, Object value) {
		return this.dao.findOneByProp(prop, value);
	}

	@Override
	@SuppressWarnings("deprecation")
	public T findOneByProp(String[] props, Object... values) {
		return this.dao.findOneByProp(props, values);
	}

	@Override
	public T findOneByProps(String[] props, Object... values) {
		return this.dao.findOneByProps(props, values);
	}

	@Override
	public List<T> findAll() {
		return this.dao.findAll();
	}

	@Override
	public List<?> findByJql(String jql, Object... values) {
		return this.dao.findByJql(jql, values);
	}

	@Override
	public List<T> findByProp(String prop, Object value) {
		return this.dao.findByProp(prop, value);
	}

	@Override
	public List<T> findByProps(String[] props, Object... value) {
		return this.findByProps(props, value);
	}

	@Override
	public List<?> findPageList(int start, int pageSize, String jql, Object... values) {
		return this.dao.findPageList(start, pageSize, jql, values);
	}

	@Override
	public void findPage(Page p) {
		this.dao.findPage(p);
	}

	@Override
	public T save(T t) {
		return this.dao.save(t);
	}

	@Override
	public List<T> batchSave(List<T> ts, int perCommit) {
		return this.dao.batchSave(ts, perCommit);
	}

	@Override
	public List<T> batchSave(List<T> ts) {
		return this.dao.batchSave(ts);
	}

	@Override
	public T delete(ID id) {
		return this.dao.delete(id);
	}

	@Override

	public T delete(T t) {
		return this.dao.delete(t);
	}

	@Override
	@SuppressWarnings("deprecation")
	public Iterable<? extends T> deleteInBatch(Iterable<? extends T> entities, long num) {
		return this.dao.deleteInBatch(entities, num);
	}


	@Override
	public String executeProcedure(String procedureName, Object ...values) {
		return this.dao.executeProcedure(procedureName, values);
	}
	
	@Override
	public List<?> excuteProcedureQuery(String procedureName,Object ...values) {
		return this.dao.excuteProcedureQuery(procedureName, values);
	}
}
