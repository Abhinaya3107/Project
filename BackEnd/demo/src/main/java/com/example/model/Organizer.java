package com.example.model;

import java.time.LocalDate;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;

import lombok.*;

@Entity
@Table(name = "organizer")
@Data
@NoArgsConstructor
@AllArgsConstructor 
@Builder
public class Organizer extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "First name is required")
    private String firstName;

    @NotBlank(message = "Last name is required")
    private String lastName;

    @NotBlank(message = "Email is required")
    @Email
    @Column(unique = true, nullable = false)
    private String email;

    @NotBlank(message = "Mobile number is required")
    private String mobileNumber;

    @NotBlank(message = "Address is required")
    private String address;

    @NotBlank(message = "Organization name is required")
    private String organizationName;

    @NotBlank(message = "Password is required")
    private String password;

    @Lob
    @Column(name = "profile_image")
    private byte[] profileImage; // For image storage
    


}

