package com.example.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "Photography")
@Data
public class Photography extends BaseEntity {
    private String name;
}

