package com.flouflou.codejam;

import static com.flouflou.codejam.jooq.Tables.*;
import static com.flouflou.codejam.utils.Response.*;
import static spark.Spark.*;

import com.flouflou.codejam.config.DataSource;
import com.flouflou.codejam.config.HerokuConfig;
import com.flouflou.codejam.middleware.Cors;
import com.flouflou.codejam.models.Joke;

import java.util.ArrayList;
import java.util.Random;

public class App {
    public static void main(String[] args) {
        // Set listen port
        port(HerokuConfig.WEB_PORT);

        // Set headers
        before((req, res) -> res.type("application/json;charset=UTF-8"));
        Cors.initialize();

        var random = new Random();

        get("/compliment", (req, res) -> {
            try (var conn = DataSource.connection()) {
                var ctx = DataSource.context(conn);
                var compliments = ctx.selectFrom(COMPLIMENT).fetch().getValues(COMPLIMENT.VALUE);
                var i = random.nextInt(compliments.size());

                return ok(compliments.get(i));
            }
        });
        get("/joke", (req, res) -> {
            try (var conn = DataSource.connection()) {
                var ctx = DataSource.context(conn);
                var jokes = ctx.selectFrom(JOKE).fetch();
                var newjoke = new ArrayList<>();
                for (var joke: jokes){
                    newjoke.add(new Joke(joke.getQuestion(), joke.getAnswer()));

                }
                var i = random.nextInt(newjoke.size());

                return ok(newjoke.get(i));
            }
        });
        get("/activity", (req, res) -> {
            try (var conn = DataSource.connection()) {
                var ctx = DataSource.context(conn);
                var activities = ctx.selectFrom(ACTIVITY).fetch().getValues(ACTIVITY.VALUE);
                var i = random.nextInt(activities.size());

                return ok(activities.get(i));
            }
        });
    }
}
