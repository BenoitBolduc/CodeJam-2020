package com.flouflou.codejam.config;

import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;
import org.jooq.DSLContext;
import org.jooq.SQLDialect;
import org.jooq.impl.DSL;

import java.sql.Connection;
import java.sql.SQLException;

public class DataSource {
    private static HikariConfig config = new HikariConfig();
    private static HikariDataSource ds;

    static {
        config.setJdbcUrl(HerokuConfig.DATABASE_URL);
        config.setUsername(HerokuConfig.DATABASE_USER);
        config.setPassword(HerokuConfig.DATABASE_PASSWORD);
        config.addDataSourceProperty("cachePrepStmts", "true");
        config.addDataSourceProperty("prepStmtCacheSize", "250");
        config.addDataSourceProperty("prepStmtCacheSqlLimit", "2048");
        ds = new HikariDataSource(config);
    }

    private DataSource() {}

    public static Connection connection() throws SQLException {
        return ds.getConnection();
    }

    public static DSLContext context(Connection connection) {
        return DSL.using(connection, SQLDialect.POSTGRES);
    }
}
