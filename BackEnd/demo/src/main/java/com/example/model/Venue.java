package com.example.model;

import jakarta.persistence.Entity;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Entity
@Data
public class Venue extends BaseEntity{
    private String name;
}
