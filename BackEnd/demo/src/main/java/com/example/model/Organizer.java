package com.example.model;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;

import lombok.*;

@Entity
@Table(name = "organizer")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Organizer{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @CreationTimestamp
    @Column(name = "creation_date", updatable = false)
    private LocalDate creationDate;

    @UpdateTimestamp
    @Column(name = "updated_on")
    private LocalDateTime updatedOn;

    @NotBlank(message = "First name is required")
    @Size(min = 2, max = 50, message = "First name must be between 2 to 50 characters")
    @Column(name = "first_name", nullable = false)
    private String firstName;

    @NotBlank(message = "Last name is required")
    @Size(min = 2, max = 50, message = "Last name must be between 2 to 50 characters")
    @Column(name = "last_name", nullable = false)
    private String lastName;

    @NotBlank(message = "Email is required")
    @Email(message = "Enter a valid email address")
    @Column(nullable = false, unique = true)
    private String email;

    @NotBlank(message = "Mobile number is required")
    @Pattern(regexp = "^[6-9]\\d{9}$", message = "Mobile number must be a valid 10-digit Indian number")
    @Column(name = "mobile", nullable = false, unique = true)
    private String mobileNumber;

    @NotBlank(message = "Address is required")
    @Size(min = 5, message = "Address must be at least 5 characters")
    @Column(nullable = false)
    private String address;

    @NotBlank(message = "Organization name is required")
    @Size(min = 2, message = "Organization name must be at least 2 characters")
    @Column(name = "organization_name", nullable = false)
    private String organizationName;
    
    @NotBlank(message = "Category is required")
    @Column(name = "category", nullable = false)
    private String category;
    
    @NotBlank(message = "Password is required")
    @Size(min = 6, max = 12, message = "Password must be between 6 to 8 characters")
    @Column(nullable = false)
    private String password;
    
 
    
    @Lob
    @Column(name="Image_data")
    private byte[] profileImage;
    
    @OneToMany(mappedBy = "organizer",fetch =FetchType.EAGER,cascade=CascadeType.ALL)
    @JsonManagedReference
    private List<User> users=new ArrayList<>();
    
}
