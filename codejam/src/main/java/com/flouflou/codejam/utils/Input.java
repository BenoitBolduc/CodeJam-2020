package com.flouflou.codejam.utils;

import com.google.gson.Gson;

import static com.flouflou.codejam.utils.Response.error;

public class Input {
    public static <T> Either<T, String> parse(String json, Class<T> classOfT) {
        try {
            var input = (new Gson()).fromJson(json, classOfT);
            return Either.left(input);
        } catch (Exception ignored) {
            return Either.right(error("Malformed input"));
        }
    }
}
