package com.flouflou.codejam.config;

public final class HerokuConfig {
    public static final String DATABASE_URL = System.getenv("JDBC_DATABASE_URL");
    public static final String DATABASE_USER = System.getenv("JDBC_DATABASE_USERNAME");
    public static final String DATABASE_PASSWORD = System.getenv("JDBC_DATABASE_PASSWORD");
    public static final int WEB_PORT = Integer.parseInt(System.getenv("PORT"));
}
