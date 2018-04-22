package com.lenovohit.ssm.configuration;

import java.sql.SQLException;

import javax.sql.DataSource;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.condition.ConditionalOnClass;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.datasource.embedded.EmbeddedDatabaseType;

import com.alibaba.druid.pool.DruidDataSource;

@Configuration
@ConditionalOnClass({ DataSource.class, EmbeddedDatabaseType.class })
@EnableConfigurationProperties({HISDataSourceProperties.class,TMSDataSourceProperties.class,PACSDataSourceProperties.class})
public class SSMConfiguration {
	
	@Autowired
	private HISDataSourceProperties hisProperties;
	@Autowired
	private TMSDataSourceProperties tmsProperties;
	@Autowired
	private PACSDataSourceProperties pacsProperties;
	

	@Bean(name="hisDataSource")
	public DataSource hisDataSource() {
		
		DruidDataSource druidDataSource = new DruidDataSource();
		druidDataSource.setDriverClassName(this.hisProperties.getDriverClassName());
		druidDataSource.setUrl(this.hisProperties.getUrl());
		druidDataSource.setUsername(this.hisProperties.getUsername());
		druidDataSource.setPassword(this.hisProperties.getPassword());
		druidDataSource.setInitialSize(this.hisProperties.getInitialSize());
		druidDataSource.setMinIdle(this.hisProperties.getMinIdle());
		druidDataSource.setMaxActive(this.hisProperties.getMaxActive());
		druidDataSource.setMaxWait(this.hisProperties.getMaxWait());
		druidDataSource.setMaxWait(this.hisProperties.getMaxWait());
		druidDataSource.setTimeBetweenEvictionRunsMillis(this.hisProperties.getMaxWait());
		druidDataSource.setMinEvictableIdleTimeMillis(this.hisProperties.getMaxWait());
		druidDataSource.setValidationQuery(this.hisProperties.getValidationQuery());
		druidDataSource.setTestWhileIdle(this.hisProperties.isTestWhileIdle());
		druidDataSource.setTestOnBorrow(this.hisProperties.isTestOnBorrow());
		druidDataSource.setTestOnReturn(this.hisProperties.isTestOnReturn());

		druidDataSource.setPoolPreparedStatements(this.hisProperties.isPoolPreparedStatements());
		druidDataSource.setMaxPoolPreparedStatementPerConnectionSize(this.hisProperties.getMaxPoolPreparedStatementPerConnectionSize());
		
		try {
			druidDataSource.setFilters(this.hisProperties.getFilters());
		} catch (SQLException e) {
			e.printStackTrace();
		}
		return druidDataSource;
	}
	@Bean(name="tmsDataSource")
	public DataSource tmsDataSource() {
		DruidDataSource druidDataSource = new DruidDataSource();
		druidDataSource.setDriverClassName(this.tmsProperties.getDriverClassName());
		druidDataSource.setUrl(this.tmsProperties.getUrl());
		druidDataSource.setUsername(this.tmsProperties.getUsername());
		druidDataSource.setPassword(this.tmsProperties.getPassword());
		druidDataSource.setInitialSize(this.tmsProperties.getInitialSize());
		druidDataSource.setMinIdle(this.tmsProperties.getMinIdle());
		druidDataSource.setMaxActive(this.tmsProperties.getMaxActive());
		druidDataSource.setMaxWait(this.tmsProperties.getMaxWait());
		druidDataSource.setMaxWait(this.tmsProperties.getMaxWait());
		druidDataSource.setTimeBetweenEvictionRunsMillis(this.tmsProperties.getMaxWait());
		druidDataSource.setMinEvictableIdleTimeMillis(this.tmsProperties.getMaxWait());
		druidDataSource.setValidationQuery(this.tmsProperties.getValidationQuery());
		druidDataSource.setTestWhileIdle(this.tmsProperties.isTestWhileIdle());
		druidDataSource.setTestOnBorrow(this.tmsProperties.isTestOnBorrow());
		druidDataSource.setTestOnReturn(this.tmsProperties.isTestOnReturn());

		druidDataSource.setPoolPreparedStatements(this.tmsProperties.isPoolPreparedStatements());
		druidDataSource.setMaxPoolPreparedStatementPerConnectionSize(this.tmsProperties.getMaxPoolPreparedStatementPerConnectionSize());
		
		try {
			druidDataSource.setFilters(this.tmsProperties.getFilters());
		} catch (SQLException e) {
			e.printStackTrace();
		}
		return druidDataSource;
	}
	@Bean(name="pacsDataSource")
	public DataSource pacsDataSource() {
		DruidDataSource druidDataSource = new DruidDataSource();
		druidDataSource.setDriverClassName(this.pacsProperties.getDriverClassName());
		druidDataSource.setUrl(this.pacsProperties.getUrl());
		druidDataSource.setUsername(this.pacsProperties.getUsername());
		druidDataSource.setPassword(this.pacsProperties.getPassword());
		druidDataSource.setInitialSize(this.pacsProperties.getInitialSize());
		druidDataSource.setMinIdle(this.pacsProperties.getMinIdle());
		druidDataSource.setMaxActive(this.pacsProperties.getMaxActive());
		druidDataSource.setMaxWait(this.pacsProperties.getMaxWait());
		druidDataSource.setMaxWait(this.pacsProperties.getMaxWait());
		druidDataSource.setTimeBetweenEvictionRunsMillis(this.pacsProperties.getMaxWait());
		druidDataSource.setMinEvictableIdleTimeMillis(this.pacsProperties.getMaxWait());
		druidDataSource.setValidationQuery(this.pacsProperties.getValidationQuery());
		druidDataSource.setTestWhileIdle(this.pacsProperties.isTestWhileIdle());
		druidDataSource.setTestOnBorrow(this.pacsProperties.isTestOnBorrow());
		druidDataSource.setTestOnReturn(this.pacsProperties.isTestOnReturn());

		druidDataSource.setPoolPreparedStatements(this.pacsProperties.isPoolPreparedStatements());
		druidDataSource.setMaxPoolPreparedStatementPerConnectionSize(this.pacsProperties.getMaxPoolPreparedStatementPerConnectionSize());
		
		try {
			druidDataSource.setFilters(this.pacsProperties.getFilters());
		} catch (SQLException e) {
			e.printStackTrace();
		}
		return druidDataSource;
	}
}
