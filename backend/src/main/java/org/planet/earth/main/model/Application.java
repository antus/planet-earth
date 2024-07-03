package org.planet.earth.main.model;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;

@Entity
@Table(name = "application")
@Cacheable
public class Application extends PanacheEntity {

    @NotNull
    @Column(length = 255, unique = true, nullable = false)
    public String name;

    @Column(length = 10000)
    public String description;

    @Column(length = 10000000)
    public String thumbnail;

    @Column(length = 10000000)
    public String configuration;

}