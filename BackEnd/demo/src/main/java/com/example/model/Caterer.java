package com.example.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "Caterer")
@Data
public class Caterer extends BaseEntity {
    private String name;
}

