package org.planet.earth.main.rest;

import io.quarkus.test.junit.QuarkusTest;
import io.quarkus.test.keycloak.client.KeycloakTestClient;
import io.restassured.http.ContentType;
import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Order;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.*;

@QuarkusTest
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
class ApplicationsEndpointTest {

    KeycloakTestClient keycloakClient = new KeycloakTestClient();

    private static final String path = "/api/applications";

    @Test
    @Order(1)
    void list() {
        given().accept(ContentType.JSON)
                .when().get(path)
                .then().statusCode(200)
                .and().body("id", contains(1, 2))
                .and().body("name", contains("map1", "map2"));
    }


    @Test
    @Order(2)
    void listInAscending() {
        given().accept(ContentType.JSON)
                .queryParam("sort", "name,asc")
                .when().get(path)
                .then().statusCode(200)
                .and().body("id", contains(1, 2))
                .and().body("name", contains("map1", "map2"));
    }

    @Test
    @Order(3)
    void listInDescending() {
        given().accept(ContentType.JSON)
                .queryParam("sort", "name,desc")
                .when().get(path)
                .then().statusCode(200)
                .and().body("id", contains(2, 1))
                .and().body("name", contains("map2", "map1"));
    }

    @Test
    @Order(4)
    void listDoubleSort() {
        given().accept(ContentType.JSON)
                .queryParam("sort", "name,desc")
                .queryParam("sort", "id")
                .when().get(path)
                .then().statusCode(200)
                .and().body("id", contains(2, 1))
                .and().body("name", contains("map2", "map1"));
    }

    @Test
    @Order(5)
    void listWithPageAndSize() {
        given().accept(ContentType.JSON)
                .queryParam("page", 0)
                .queryParam("size", 1)
                .when().get(path)
                .then().statusCode(200)
                .and().body("id", contains(1))
                .and().body("name", contains("map1"));
    }

    @Test
    @Order(6)
    void listWithPage1AndSize() {
        given().accept(ContentType.JSON)
                .queryParam("page", 1)
                .queryParam("size", 1)
                .when().get(path)
                .then().statusCode(200)
                .and().body("id", contains(2))
                .and().body("name", contains("map2"));
    }

    @Test
    @Order(7)
    void listWithSingleTextFilter() {
        given().accept(ContentType.JSON)
                .queryParam("text", "map1")
                .when().get(path)
                .then().statusCode(200)
                .and().body("id", contains(1))
                .and().body("name", contains("map1"));
    }

    @Test
    @Order(8)
    void listWithDoubleTextFilter() {
        given().accept(ContentType.JSON)
                .queryParam("text", "ap1 ap2")
                .when().get(path)
                .then().statusCode(200)
                .and().body("id", contains(1,2))
                .and().body("name", contains("map1", "map2"));
    }


    @Test
    @Order(9)
    void create() {
        given().auth().oauth2(getAccessToken("alice")).accept(ContentType.JSON)
                .when().body("{\"name\" : \"Massimo\", \"configuration\": \"antus\"}")
                .contentType("application/json")
                .post(path)
                .then().statusCode(201)
                .and().body("id", is(equalTo(3)))
                .and().body("name", is(equalTo("Massimo")));
    }

    @Test
    @Order(10)
    void createWithIdNotNull() {
        given().auth().oauth2(getAccessToken("alice")).accept(ContentType.JSON)
                .when().body("{\"id\" : 1, \"name\" : \"Massimo Antonini\"}")
                .contentType("application/json")
                .post(path)
                .then().statusCode(422);
    }

    @Test
    @Order(11)
    void read() {
        given().accept(ContentType.JSON)
                .when().get(path + "/1")
                .then().statusCode(200)
                .and().body("id", is(equalTo(1)))
                .and().body("name", is(equalTo("map1")));
    }

    @Test
    @Order(12)
    void readNotFound() {
        given().accept(ContentType.JSON)
                .when().get(path + "/100")
                .then().statusCode(404);
    }

    @Test
    @Order(13)
    void update() {
        given().auth().oauth2(getAccessToken("alice"))
                .when().body("{\"name\" : \"pippo\"}")
                .contentType("application/json")
                .put(path + "/2")
                .then()
                .statusCode(204);
    }

    @Test
    @Order(14)
    void updateNotFound() {
        given().auth().oauth2(getAccessToken("alice"))
                .when().body("{\"name\" : \"map3\"}")
                .contentType("application/json")
                .put(path + "/100")
                .then()
                .statusCode(404);
    }

    @Test
    @Order(15)
    void delete() {
        given().auth().oauth2(getAccessToken("alice"))
                .when().delete(path + "/1")
                .then().statusCode(204);
    }

    @Test
    @Order(16)
    void deleteNotFound() {
        given().auth().oauth2(getAccessToken("alice"))
                .when().delete(path + "/1")
                .then().statusCode(404);
    }

    protected String getAccessToken(String userName) {
        return keycloakClient.getAccessToken(userName);
    }
}
