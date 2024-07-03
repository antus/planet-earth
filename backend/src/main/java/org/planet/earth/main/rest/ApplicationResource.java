package org.planet.earth.main.rest;

import io.quarkus.panache.common.Page;
import io.quarkus.panache.common.Sort;
import io.quarkus.security.Authenticated;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.UriInfo;
import org.jboss.logging.Logger;
import org.planet.earth.main.model.Application;
import org.planet.earth.main.rest.utils.*;

/**
 * REST controller for managing {@link Application}.
 */

@Path("/api/applications")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
@ApplicationScoped
public class ApplicationResource {

    private final Logger log = Logger.getLogger(ApplicationResource.class.getName());
    private static final String ENTITY_ID = "Entity with id ";
    private static final String NOT_EXISTS = " does not exist.";

    /**
     * {@code POST  /applications} : Create a new application.
     *
     * @param application the application to create.
     * @return the {@link Response} with status {@code 201 (Created)} and with body the new application, or with status {@code 422 (Unprocessable Entity)} if the application has already an ID.
     */
    @POST
    @Transactional
    @Consumes("application/json")
    @Produces("application/json")
    @Authenticated
    public Response create(Application application) {
        log.debugf("REST request to save Application : {}", application);
        if (application.id != null) {
            throw new WebApplicationException("Id was invalidly set on request.", 422);
        }
        application.persist();
        return Response.ok(application).status(201).build();
    }


    /**
     * {@code GET  /applications/:id} : get the "id" application.
     *
     * @param id the id of the application to retrieve.
     * @return the {@link Response} with status {@code 200 (OK)} and with body the application,
     * or with status {@code 404 (Not Found)}.
     */
    @GET
    @Path("/{id}")
    @Produces("application/json")
    public Response read(@PathParam("id") Long id) {
        log.debugf("REST request to get Application : {}", id);
        Application app = Application.findById(id);
        if (app == null) {
            throw new WebApplicationException(ENTITY_ID + id + NOT_EXISTS, 404);
        }
        return Response.ok(app).build();
    }

    /**
     * {@code PUT  /applications/:id} : Updates an existing application.
     *
     * @param application the application to update.
     * @return the {@link Response} with status {@code 200 (OK)} and with body the updated application,
     * or with status {@code 404 (Not Found)} if the application is not found,
     * or with status {@code 400 (Bad Request)} if the application is not valid,
     * or with status {@code 500 (Internal Server Error)} if the application couldn't be updated.
     */
    @PUT
    @Path("/{id}")
    @Transactional
    @Consumes("application/json")
    @Produces("application/json")
    @Authenticated
    public Response update(@PathParam("id") Long id, Application application) {
        log.debugf("REST request to update Application : {}", application);
        Application entity = Application.findById(id);
        if (entity == null) {
            throw new WebApplicationException(ENTITY_ID + id + NOT_EXISTS, 404);
        }
        entity.name = application.name;
        entity.description = application.description;
        entity.thumbnail = application.thumbnail;
        entity.configuration = application.configuration;
        return Response.status(204).build();
    }

    /**
     * {@code DELETE  /applications/:id} : delete the "id" application.
     *
     * @param id the id of the application to delete.
     * @return the {@link Response} with status {@code 204 (NO_CONTENT)},
     * or with status {@code 404 (Not Found)} if the application is not found.
     */
    @DELETE
    @Path("/{id}")
    @Transactional
    @Produces("application/json")
    @Authenticated
    public Response delete(@PathParam("id") Long id) {
        log.debugf("REST request to delete Application : {}", id);
        Application entity = Application.findById(id);
        if (entity == null) {
            throw new WebApplicationException(ENTITY_ID + id + NOT_EXISTS, 404);
        }
        entity.delete();
        return Response.status(204).build();
    }

    /**
     * {@code GET  /applications} : get all the applications.
     *
     * @param pageRequest the pagination information.
     * @param sortRequest the pagination information.
     * @param text the text used for searching.
     * @return the {@link Response} with status {@code 200 (OK)} and the list of applications in body.
     */
    @GET
    @Produces("application/json")
    public Response list(
            @BeanParam PageRequest pageRequest,
            @BeanParam SortRequest sortRequest,
            @QueryParam("text") String text,
            @Context UriInfo uriInfo
            ) {
        log.info("REST request to get a page of Application");
        Page page = pageRequest.toPage();
        Sort sort = sortRequest.toSort();
        Paged<Application> result;
        if (text!=null) {
            String clause = SearchUtil.getAttributeClause("name", text);
            result = new Paged<>(Application.find("from Application where " + clause, sort).page(page));
        } else
            result = new Paged<>(Application.findAll(sort).page(page));
        Response.ResponseBuilder response = Response.ok().entity(result.content);
        response = PaginationUtil.withPaginationInfo(response, uriInfo, result);
        return response.build();
    }
}
