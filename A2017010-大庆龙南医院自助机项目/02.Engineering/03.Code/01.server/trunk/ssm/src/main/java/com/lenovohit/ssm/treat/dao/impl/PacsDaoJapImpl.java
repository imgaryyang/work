package com.lenovohit.ssm.treat.dao.impl;

import static org.springframework.data.jpa.repository.query.QueryUtils.toOrders;

import java.io.Serializable;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import javax.persistence.EntityManager;
import javax.persistence.ParameterMode;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;
import javax.persistence.StoredProcedureQuery;
import javax.persistence.TypedQuery;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Path;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;

import org.apache.log4j.Logger;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.util.Assert;

import com.lenovohit.core.Constants;
import com.lenovohit.core.dao.Page;
import com.lenovohit.core.model.Model;
import com.lenovohit.ssm.treat.dao.PacsDao;

public class PacsDaoJapImpl<T extends Model, ID extends Serializable> implements PacsDao<T, ID> {

	static Logger logger = Logger.getLogger(PacsDaoJapImpl.class);

	private static final String ID_MUST_NOT_BE_NULL = "The given id must not be null!";

	@PersistenceContext(unitName="pacs")
	private EntityManager em;
	private Class<T> entityClass;

	public PacsDaoJapImpl(Class<T> entityClass) {
		this.entityClass = entityClass;
	}

	@Override
	public T get(ID id) {
		Assert.notNull(id, ID_MUST_NOT_BE_NULL);
		return em.find(this.entityClass, id);
	}

	@Override
	public long getCount(String jql, Object... values) {
		StringBuilder sb = new StringBuilder("select count(*) ");

		String lowerStr = jql.toLowerCase();
		if (lowerStr.trim().startsWith("select")) {
			String fromHql = jql.substring(jql.indexOf("from") + 4, jql.length());
			sb.append("from ").append(fromHql).append(" ");
		} else if (lowerStr.trim().startsWith("from")) {
			sb.append(jql.trim());
		}
		Query query = em.createQuery(parserJql(sb.toString()));
		setQueryParams(query, values);

		return (Long) query.getSingleResult();
	}

	@Override
	public T findOne(String jql, Object... values) {
		Query query = em.createQuery(parserJql(jql));
		setQueryParams(query, values);

		List<T> lst = query.getResultList();
		if (null != lst && lst.size() == 1) {
			return lst.get(0);
		}

		return null;
	}

	@Override
	public T findOneByProp(String prop, Object value) {

		CriteriaBuilder cb = em.getCriteriaBuilder();
		CriteriaQuery<T> cq = cb.createQuery(this.getDomainClass());
		Root<T> root = cq.from(this.getDomainClass());
		Path<String> path = root.get(prop);
		Predicate condition = cb.and(cb.equal(path, value));
		cq.where(condition);
		TypedQuery<T> typedQuery = em.createQuery(cq);
		List<T> lst = typedQuery.getResultList();
		if (null == lst || lst.size() < 1) {
			return null;
		} else if (null != lst && lst.size() == 1) {
			return lst.get(0);
		} else {
			logger.warn(this.getDomainClass() + "【" + prop + ":" + value + "】查询存在多个数据，请注意。");
			return lst.get(0);
		}

	}

	@Override
	public T findOneByProp(String[] props, Object... values) {
		CriteriaBuilder cb = em.getCriteriaBuilder();
		CriteriaQuery<T> cq = cb.createQuery(this.getDomainClass());
		Root<T> root = cq.from(this.getDomainClass());
		Path<String> path = null;
		Predicate condition = null;
		for (int i = 0; i < props.length; i++) {
			path = root.get(props[i]);
			condition = cb.and(cb.equal(path, values[i]));
			path = null;
		}
		cq.where(condition);
		TypedQuery<T> typedQuery = em.createQuery(cq);
		List<T> lst = typedQuery.getResultList();
		if (null == lst || lst.size() < 1) {
			return null;
		} else if (null != lst && lst.size() == 1) {
			return lst.get(0);
		} else {
			logger.warn(this.getDomainClass() + "【" + props + ":" + values + "】查询存在多个数据，请注意。");
			return lst.get(0);
		}
	}

	@Override
	public List<T> findAll() {
		return getQuery(null, (Sort) null).getResultList();
	}

	public List<T> find(String jql, Object... values) {

		Query query = em.createQuery(parserJql(jql));
		setQueryParams(query, values);

		return query.getResultList();
	}

	@Override
	public List<?> findByJql(String jql, Object... values) {
		Query query = em.createQuery(parserJql(jql));
		setQueryParams(query, values);

		return query.getResultList();
	}

	public List<?> findBySql(String sql, Object... values) {
		Query query = em.createNativeQuery(parserJql(sql));
		setQueryParams(query, values);

		return query.getResultList();
	}

	public int executeSql(String sql, Object... values) {
		Query query = em.createNativeQuery(parserJql(sql));
		setQueryParams(query, values);

		return query.executeUpdate();
	}

	@Override
	public T save(T t) {
		if (t._newObejct()) {
			em.persist(t);
			return t;
		} else {
			return em.merge(t);
		}
	}

	@Override
	public List<T> batchSave(List<T> ts, int perCommit) {
		T t = null;
		for (int i = 0; i < ts.size(); i++) {
			t = ts.get(i);
			if (t._newObejct()) {
				em.persist(t);
			} else {
				t = em.merge(t);
			}
			ts.set(i, t);
			t = null;
			if (i != 0  && i % perCommit == 0) {
				em.flush();
				em.clear();
			}
		}
		return ts;
	}

	@Override
	public List<T> batchSave(List<T> ts) {
		logger.info(Constants.TRANSACTIONAL_PER_COMMIT);
		return batchSave(ts, Integer.valueOf(Constants.TRANSACTIONAL_PER_COMMIT));
	}

	@Override
	public T delete(ID id) {
		Assert.notNull(id, ID_MUST_NOT_BE_NULL);

		T entity = this.get(id);

		if (entity == null) {
			throw new EmptyResultDataAccessException(
					String.format("No %s entity with id %s exists!", this.entityClass, id), 1);
		}

		delete(entity);
		return entity;
	}

	@Override
	public T delete(T t) {
		Assert.notNull(t, "The entity must not be null!");
		em.remove(em.contains(t) ? t : em.merge(t));
		return t;
	}

	@Override
	public Iterable<? extends T> deleteInBatch(Iterable<? extends T> entities, long num) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public List<?> findPageList(int start, int pageSize, String jql, Object... values) {
		Query query = em.createQuery(parserJql(jql));
		setQueryParams(query, values);
		query.setFirstResult(start);
		query.setMaxResults(pageSize);
		return query.getResultList();
	}

	@Override
	public void findPage(Page p) {
		long total = this.getCount(p.getQuery(), p.getValues());
		if (total > 0) {
			p.setTotal(total);
			p.setResult(this.findPageList(p.getStart(), p.getPageSize(), p.getQuery(), p.getValues()));
		}
	}

	private void setQueryParams(Query query, Object... values) {
		if (null != values && values.length > 0) {
			for (int i = 0; i < values.length; i++) {
				query.setParameter(i, values[i]);

			}
		}
	}

	/**
	 * Creates a {@link TypedQuery} for the given {@link Specification} and
	 * {@link Sort}.
	 * 
	 * @param spec can be {@literal null}.
	 * @param sort can be {@literal null}.
	 * @return TypedQuery
	 */
	protected TypedQuery<T> getQuery(Specification<T> spec, Sort sort) {

		CriteriaBuilder builder = em.getCriteriaBuilder();
		CriteriaQuery<T> query = builder.createQuery(getDomainClass());

		Root<T> root = applySpecificationToCriteria(spec, query);
		query.select(root);

		if (sort != null) {
			query.orderBy(toOrders(sort, root, builder));
		}

		return em.createQuery(query);
	}

	/**
	 * Applies the given {@link Specification} to the given
	 * {@link CriteriaQuery}.
	 * 
	 * @param spec can be {@literal null}.
	 * @param query must not be {@literal null}.
	 * @return root
	 */
	private <S> Root<T> applySpecificationToCriteria(Specification<T> spec, CriteriaQuery<S> query) {

		Assert.notNull(query);
		Root<T> root = query.from(getDomainClass());

		if (spec == null) {
			return root;
		}

		CriteriaBuilder builder = em.getCriteriaBuilder();
		Predicate predicate = spec.toPredicate(root, query, builder);

		if (predicate != null) {
			query.where(predicate);
		}

		return root;
	}

	protected Class<T> getDomainClass() {
		return entityClass;
	}

	protected String parserJql(String jql) {
		// TODO add cache support
		int i = 0;
		StringBuffer sb = new StringBuffer();
		Pattern p = Pattern.compile("\\?");

		Matcher m = p.matcher(jql);

		boolean flag = m.find();
		while (flag) {
			m.appendReplacement(sb, "?" + i);
			i++;
			flag = m.find();
		}

		m.appendTail(sb);
		return sb.toString();

	}

	@Override
	public T findOneByProps(String[] props, Object... values) {
		CriteriaBuilder cb = em.getCriteriaBuilder();
		CriteriaQuery<T> cq = cb.createQuery(this.getDomainClass());
		Root<T> root = cq.from(this.getDomainClass());
		Path<String> path = null;
		Predicate condition = null;
		for (int i = 0; i < props.length; i++) {
			path = root.get(props[i]);
			condition = cb.and(cb.equal(path, values[i]));
			path = null;
		}
		cq.where(condition);
		TypedQuery<T> typedQuery = em.createQuery(cq);
		List<T> lst = typedQuery.getResultList();
		if (null == lst || lst.size() < 1) {
			return null;
		} else if (null != lst && lst.size() == 1) {
			return lst.get(0);
		} else {
			logger.warn(this.getDomainClass() + "【" + props.toString() + ":" + values.toString() + "】查询存在多个数据，请注意。");
			return lst.get(0);
		}
	}

	@Override
	public List<T> findByProp(String prop, Object value) {
		CriteriaBuilder cb = em.getCriteriaBuilder();
		CriteriaQuery<T> cq = cb.createQuery(this.getDomainClass());
		Root<T> root = cq.from(this.getDomainClass());
		Path<String> path = root.get(prop);
		Predicate condition = cb.and(cb.equal(path, value));
		cq.where(condition);
		TypedQuery<T> typedQuery = em.createQuery(cq);
		return typedQuery.getResultList();
	}

	@Override
	public List<T> findByProps(String[] props, Object... values) {
		CriteriaBuilder cb = em.getCriteriaBuilder();
		CriteriaQuery<T> cq = cb.createQuery(this.getDomainClass());
		Root<T> root = cq.from(this.getDomainClass());
		Path<String> path = null;
		Predicate condition = null;
		for (int i = 0; i < props.length; i++) {
			path = root.get(props[i]);
			condition = cb.and(cb.equal(path, values[i]));
			path = null;
		}
		cq.where(condition);
		TypedQuery<T> typedQuery = em.createQuery(cq);
		return typedQuery.getResultList();
	}
	
	@Override
	public String executeProcedure(String procedureName, Object... values) {
		Query query = em.createNativeQuery(procedureName);
		if (null != values && values.length > 0) {
			for (int i = 0; i < values.length; i++) {
				query.setParameter(i, values[i]);
			}
		}
		return query.getSingleResult().toString();
	}

	@Override
	public List<?> excuteProcedureQuery(String procedureName , Object ...values) {
		StoredProcedureQuery  query = em.createStoredProcedureQuery(procedureName);
		int length=0;
		if (null != values && values.length > 0) {
			for (int i = 0; i < values.length; i++) {
				query.registerStoredProcedureParameter(i, values[i].getClass(), ParameterMode.IN);
				query.setParameter(i, values[i]);
			}
			length = values.length;
		}
		query.registerStoredProcedureParameter(length, String.class, ParameterMode.OUT);
		logger.info(query.getOutputParameterValue(length));
		return query.getResultList();
	}
}