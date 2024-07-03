package org.planet.earth.main.rest.utils;

import io.quarkus.panache.common.Page;
import jakarta.validation.constraints.Positive;
import jakarta.ws.rs.DefaultValue;
import jakarta.ws.rs.QueryParam;

public class PageRequest {
    @QueryParam("page")
    @DefaultValue("0")
    @Positive
    public int index;

    @QueryParam("size")
    @DefaultValue("50")
    @Positive
    public int size;

    public Page toPage() {
        return Page.of(index, size);
    }

}
