package com.lenovohit.hcp.test.db.model;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.Entity;

public class Table {
	public Table(String tableName, String name) {
		this.tableName = tableName;
		this.name = name;
	}

	private List<Column> columns = new ArrayList<Column>();

	public void addColumn(Column c) {
		this.columns.add(c);
	}

	private String tableName;

	public String getTableName() {
		return tableName;
	}

	public void setTableName(String tableName) {
		this.tableName = tableName;
	}

	private String name;

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String toModel() {
		StringBuilder sb = new StringBuilder();
		sb.append("@Entity\n");
		sb.append("@Table(name = \"" + this.tableName + "\")\n");
		sb.append("public class ").append(this.name).append(" extends HcpBaseModel {").append("\n");
		for (Column c : columns) {
			if (c.getColumnName().equals("ID") 
					|| c.getColumnName().equals("HOS_ID")
					|| c.getColumnName().equals("CREATE_TIME") 
					|| c.getColumnName().equals("CREATE_OPER")
					|| c.getColumnName().equals("UPDATE_TIME") 
					|| c.getColumnName().equals("UPDATE_OPER"))
				continue;
			sb.append("    ");
			sb.append(c.toModel()).append("\n");
		}
		sb.append("}");
		return sb.toString();
	}
}
