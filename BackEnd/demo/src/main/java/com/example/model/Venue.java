package com.example.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "venue")
@Data
public class Venue extends BaseEntity {
    private String name;
}

