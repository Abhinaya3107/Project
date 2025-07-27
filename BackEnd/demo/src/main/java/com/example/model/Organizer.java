package com.example.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.*;

@Entity
@Table(name = "organizer") // Optional: ensure consistent table naming
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString(callSuper = true)
public class Organizer extends BaseEntity {

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
    private String mobile; // ❗ Changed from `int` to `String` for validation

    @Column(length = 10, nullable = false)
    private String password;

    @Column(length = 30, nullable = false)
    private String address;

    @Column(length = 30, nullable = false)
    private String organizationName;
}
