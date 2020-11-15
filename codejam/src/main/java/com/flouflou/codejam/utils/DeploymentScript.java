package com.flouflou.codejam.utils;

import com.flouflou.codejam.config.DataSource;

import java.net.URL;
import java.nio.file.Files;
import java.nio.file.Path;

public class DeploymentScript {
    public static void main(String[] args) throws Exception {
        URL url = DeploymentScript.class.getClassLoader().getResource("database.sql");
        String sql = Files.readString(Path.of(url.getPath()));
        var conn = DataSource.connection();
        DataSource.context(conn).execute(sql);
        conn.close();
    }
}
