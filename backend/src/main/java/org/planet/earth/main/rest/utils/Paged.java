package org.planet.earth.main.rest.utils;

import io.quarkus.hibernate.orm.panache.PanacheQuery;

import java.util.Collections;
import java.util.List;

public class Paged<T> {

    public final long index;
    public final long size;

    public final long totalCount;
    public final long pageCount;

    public final List<T> content;

    public Paged(PanacheQuery<T> query) {
        this(query.page().index, query.page().size, query.count(), query.pageCount(), query.list());
    }

    public Paged(long index, long size, long totalCount, long pageCount, List<T> content) {
        this.index = index;
        this.size = size;
        this.totalCount = totalCount;
        this.pageCount = pageCount;
        this.content = Collections.unmodifiableList(content);
    }
}