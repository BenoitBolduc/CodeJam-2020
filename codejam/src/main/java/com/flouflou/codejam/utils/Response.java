package com.flouflou.codejam.utils;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import net.dongliu.gson.GsonJava8TypeAdapterFactory;

import java.util.Optional;

public class Response<S, E> {
    public final boolean success;
    public final Optional<S> data;
    public final Optional<E> error;

    private static final Gson gson = new GsonBuilder().registerTypeAdapterFactory(new GsonJava8TypeAdapterFactory()).create();

    private Response(boolean success, Optional<S> data, Optional<E> error) {
        this.success = success;
        this.data = data;
        this.error = error;
    }

    public static <S, E> String ok(S data) {
        return gson.toJson(new Response<S, E>(true, Optional.of(data), Optional.empty()));
    }

    public static <S, E> String error(E error) {
        return gson.toJson(new Response<S, E>(false, Optional.empty(), Optional.of(error)));
    }

    public static <S, E> String of(Either<S, E> either) {
        if (either.isLeft()) return ok(either.left());
        return error(either.right());
    }
}
