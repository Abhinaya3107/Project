package com.example.model;


import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import jakarta.persistence.Column;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.MappedSuperclass;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@MappedSuperclass
					
@Getter
@Setter
@ToString
public class BaseEntity {
	@Id // mandatory , PK
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	// for auditing purpose - can maintain creation n updation date|time|timestamp
    
	
	@Column(name = "creation_date", updatable = false)
	@CreationTimestamp
	private LocalDateTime creationDate;

	@Column(name = "updated_on")
	@UpdateTimestamp
	private LocalDateTime updatedOn;

}