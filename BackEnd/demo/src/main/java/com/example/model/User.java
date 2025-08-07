package com.example.model;

import java.time.LocalDateTime;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Entity
@Getter
@Setter
@EqualsAndHashCode
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "users")
public class User extends BaseEntity{
    @Column(name = "first_name", length = 20)
	private String firstName;
	@Column(name = "last_name", length = 30)
	private String lastName;
	@Column(length = 30, unique = true)
	private String email;
	@Column(nullable = false, unique = true, length = 10)
	@NotBlank(message = "Mobile number is required")
	@Pattern(regexp = "^[6-9]\\d{9}$", message = "Invalid mobile number")
	@Size(min = 10, max = 10, message = "Mobile number must be 10 digits")
	private String mobile;  
	@Column(length = 10,nullable = false)
	private String password;
	
	@JsonIgnore
	@ManyToOne
	 @JoinColumn(name = "oId")
	 private Organizer organizer;
	
}