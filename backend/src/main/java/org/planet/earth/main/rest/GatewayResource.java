package org.planet.earth.main.rest;

import io.quarkus.panache.common.Page;
import io.quarkus.panache.common.Sort;
import io.quarkus.security.Authenticated;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.*;
import org.apache.commons.io.IOUtils;
import org.jboss.logging.Logger;
import org.planet.earth.main.model.Application;
import org.planet.earth.main.rest.utils.*;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.URLConnection;

/**
 * REST controller for managing {@link Application}.
 */

@Path("/gateway/")
@ApplicationScoped
public class GatewayResource {
    private static final String FALLBACK_RESOURCE = "data/frontend/index.html";

    @GET
    @Path("/")
    public Response getFrontendRoot() throws IOException {
        return getFrontendStaticFile("index.html");
    }

    @GET
    @Path("/{fileName:.+}")
    public Response getFrontendStaticFile(@PathParam("fileName") String fileName) throws IOException {
        String changesetFilePath = "data/frontend/" + fileName;
        File f = new File(changesetFilePath);
        final InputStream inputStream = f.exists()? new FileInputStream(f) :new FileInputStream(new File(FALLBACK_RESOURCE));
        final StreamingOutput streamingOutput = outputStream -> IOUtils.copy(inputStream, outputStream);
        return Response
                .ok(streamingOutput)
                .cacheControl(CacheControl.valueOf("max-age=900"))
                .type(URLConnection.guessContentTypeFromStream(inputStream))
                .build();
    }
}
