package com.lenovohit.hcp.hibernate.dialect;

import java.sql.Types;

import org.hibernate.HibernateException;
import org.hibernate.type.StandardBasicTypes;

public class SQLServer2012Dialect extends org.hibernate.dialect.SQLServer2012Dialect {

	/**
	 * Initializes a new instance of the {@link SQLServerDialect} class.
	 */
	/*public SQLServer2012Dialect() {
		super();
		registerColumnType(Types.CHAR, "nchar(1)");
		registerColumnType(Types.CHAR, "nchar($l)");
		registerColumnType(Types.LONGVARCHAR, "nvarchar(max)");
		registerColumnType(Types.VARCHAR, 4000, "nvarchar($l)");
		registerColumnType(Types.VARCHAR, "nvarchar(max)");
		registerColumnType(Types.CLOB, "nvarchar(max)");

		registerColumnType(Types.NCHAR, "nchar(1)");
		registerColumnType(Types.LONGNVARCHAR, "nvarchar(max)");
		registerColumnType(Types.NVARCHAR, 4000, "nvarchar($l)");
		registerColumnType(Types.NVARCHAR, "nvarchar(max)");
		registerColumnType(Types.NCLOB, "nvarchar(max)");

		registerHibernateType(Types.NCHAR, StandardBasicTypes.CHARACTER.getName());
		registerHibernateType(Types.LONGNVARCHAR, StandardBasicTypes.TEXT.getName());
		registerHibernateType(Types.NVARCHAR, StandardBasicTypes.STRING.getName());
		registerHibernateType(Types.NCLOB, StandardBasicTypes.CLOB.getName());
		registerHibernateType(Types.NCHAR, org.hibernate.type.StringType.INSTANCE.getName());
		registerHibernateType(Types.NVARCHAR, org.hibernate.type.StringType.INSTANCE.getName());
	}*/

	public SQLServer2012Dialect() {
        super();
		registerColumnType(Types.NCHAR, "nchar(1)");
		registerColumnType(Types.NCHAR, "nchar($l)");
		registerColumnType(Types.NVARCHAR, 4000, "nvarchar($l)");
		registerColumnType(Types.NVARCHAR, "nvarchar(max)");

		registerHibernateType(Types.NCHAR, org.hibernate.type.StringType.INSTANCE.getName());
		registerHibernateType(Types.NVARCHAR, org.hibernate.type.StringType.INSTANCE.getName());
    }

	public String getTypeName(int code, int length, int precision, int scale) throws HibernateException {
		if (code != 2005) {
			return super.getTypeName(code, length, precision, scale);
		} else {
			return "ntext";
		}
	}
}
