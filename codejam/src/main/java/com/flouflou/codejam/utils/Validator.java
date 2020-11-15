package com.flouflou.codejam.utils;

import java.util.Map;
import java.util.Optional;
import java.util.function.Function;

public class Validator {
    public static <I, E> Function<I, Optional<E>> of(Map<Function<I, Boolean>, E> rules) {
        return input -> rules.entrySet().stream()
            .map(entry -> (Function<I, Optional<E>>) x -> {
                if (entry.getKey().apply(x)) {
                    return Optional.of(entry.getValue());
                }

                return Optional.empty();
            })
            .map(f -> f.apply(input))
            .flatMap(Optional::stream)
            .findFirst();
    }
}
