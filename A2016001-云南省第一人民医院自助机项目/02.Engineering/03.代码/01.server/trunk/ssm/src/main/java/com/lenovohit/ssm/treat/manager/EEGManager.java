package com.lenovohit.ssm.treat.manager;

import java.io.Serializable;
import java.util.List;

import com.lenovohit.core.dao.Page;

/**
 * @author Exorics
 *
 */
public interface EEGManager <T, ID extends Serializable>  {
	
	/**
	 * 通过主键获得实体
	 * @param id 主键标识，必须非空
	 * @return 对象
	 */
	public T get(ID id);
	
	/**
	 * 通过查询语句和查询条件获得数量
	 * @param jql 查询语句，必须非空，不同的实现类支持不同的语句，比如jpa实现类使用hql
	 * @param values 参数值，可为空
	 * @return 总记录条数
	 */
	public long getCount(String jql, Object... values);
	
	/**
	 * 通过查询语句和查询条件获得一个实体，如果查询出多个，只返回首个实体
	 * @param jql 查询语句，必须非空
	 * @param values 参数值，可为空
	 * @return 查询结果
	 */
	public T findOne(String jql, Object... values);
	
	/**
	 * 通过属性进行查询
	 * @param prop  属性
	 * @param value 参数值
	 * @return 查询结果
	 */
	public T findOneByProp(String prop, Object value);
	
	/**
	 * 通过多个属性进行查询
	 * @param props 属性名集合
	 * @param values 属性值集合
	 * @return 实体
	 */
	@Deprecated
	public T findOneByProp(String[] props, Object... values);
	
	/**
	 * 通过多个属性进行查询
	 * @param props 属性名集合
	 * @param values 属性值集合
	 * @return 实体
	 */
	public T findOneByProps(String[] props, Object... values);
	
	/**
	 * 获得所有实体
	 * @return 查询结果
	 */
	public List<T> findAll();
	
	/**
	 * 通过查询语句和查询条件获得多个实体
	 * @param jql 查询语句，必须非空
	 * @param values 参数值，可为空，不存在参数时null
	 * @return 构造器参数类型的list集合
	 */
	public List<T> find(String jql, Object... values);
	
	/**
	 * 通过属性和属性值获得多个实体
	 * @param jql 查询条件
	 * @param values 参数值
	 * @return 构造器参数类型的list集合
	 */
	public List<?> findByJql(String jql, Object... values);
	
	/**
	 * 通过属性和属性值获得多个实体
	 * @param prop 属性名
	 * @param value 参数值
	 * @return 构造器参数类型的list集合
	 */
	public List<T> findByProp(String prop, Object value);
	

	/**
	 * 通过属性和属性值获得多个实体
	 * @param props 属性名数组
	 * @param value 参数值，位置与属性名对应
	 * @return 构造器参数类型的list集合
	 */
	public List<T> findByProps(String[] props, Object... value);
	
	/**
	 * 获取分页数据集合
	 * @param start 起始条数
	 * @param pageSize 每页总条数
	 * @param jql 查询语句
	 * @param values 查询值
	 * @return 查询结果集合
	 */
	public List<?> findPageList(int start,int pageSize,String jql, Object... values);
	
	/**
	 * 分页查询
	 * @param p 分页查询设置
	 */
	public void findPage(Page p);
	
	/**
	 * 保存或更新对象
	 * @param t 待处理对象
	 * @return 处理后对象
	 */
	public T save(T t);
	
	/**
	 * 保存或更新实体,主键不存在则判定为生成，存在主键则进行更新
	 * 注：如果实体的主键为空底层保存后会修改参数实体的主键属性，复合主键需要自己设置主键
	 * @param ts 不能为空，id有无值均可，复合主键不允许空
	 * @param perCommit 每隔提交一次事务
	 * @return  保存后结果或null
	 */
	public List<T> batchSave(List<T> ts,int perCommit);
	
	
	/**
	 * 保存或更新实体,主键不存在则判定为生成，存在主键则进行更新，默认500条提交一次事务，
	 * 若需要自定义条数请使用batchSave(List&lt;T&gt; ts,int perCommit)
	 * 注：如果实体的主键为空底层保存后会修改参数实体的主键属性，复合主键需要自己设置主键
	 * @param ts 不能为空，id有无值均可，复合主键不允许空
	 * @return 保存后结果或null
	 */
	public List<T> batchSave(List<T> ts);
	
	/**
	 * 根据ID删除查询对象
	 * @param id ID
	 * @return 根据ID查询到的对象
	 */
	public T delete(ID id);
	
	/**
	 * 根据对象删除对象
	 * @param t 待删除对象
	 * @return 待删除对象
	 */
	public T delete(T t);
	
	/**
	 * 批量删除
	 * @param entities 待删除集合
	 * @param num 事务调教条数
	 * @return 待删除结合 
	 */
	public Iterable<? extends T> deleteInBatch(Iterable<? extends T> entities, long  num);
	
	/**
	 * 查询数据集合
	 * @param sql 查询语句
	 * @param values 查询条件值
	 * @return 结果集合
	 */
	public List<?> findBySql(String sql, Object... values);
	
	/**
	 * 执行原生SQL
	 * @param sql 待执行语句
	 * @param values 输入值
	 * @return 执行结果0代表失败，非0为成功
	 */
	public int executeSql(String sql, Object... values);
	/**
	 * 执行存储过程
	 * @param procedureName 存储过程名称
	 * @param values 查询参数
	 * @return 执行结果
	 */
	public String executeProcedure(String procedureName, Object... values);
	
	/**
	 *  执行存储过程
	 * @param procedureName
	 * @param values
	 * @return
	 */
	List<?> excuteProcedureQuery(String procedureName, Object ...values);
}
