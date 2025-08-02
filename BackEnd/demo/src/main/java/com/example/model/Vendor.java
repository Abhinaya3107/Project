package com.example.model;

import java.time.LocalDate;

import org.hibernate.annotations.CreationTimestamp;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.*;

@Entity
@Table(name = "vendors")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class Vendor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long vid;

    @NotBlank(message = "First name is required")
    @Size(min = 2, max = 30, message = "First name must be between 2 and 30 characters")
    @Column(nullable = false, length = 30)
    private String firstName;

    @NotBlank(message = "Last name is required")
    @Size(min = 2, max = 30, message = "Last name must be between 2 and 30 characters")
    @Column(nullable = false, length = 30)
    private String lastName;

    @Email(message = "Invalid email format")
    @NotBlank(message = "Email is required")
    @Column(nullable = false, unique = true, length = 50)
    private String email;

    @NotBlank(message = "Mobile number is required")
    @Pattern(regexp = "^[6-9]\\d{9}$", message = "Mobile number must be exactly 10 digits")
    @Column(nullable = false, unique = true, length = 10)
    private String mobile;

    @NotBlank(message = "Category is required")
    @Size(max = 50, message = "Category must not exceed 50 characters")
    @Column(nullable = false, length = 50)
    private String category;
    
    private String address;
    
    private String businessName;

    @NotBlank(message = "Password is required")
    @Size(min = 6, message = "Password must be at least 6 characters")
    @Column(nullable = false, length = 100)
    private String password;
    
    @CreationTimestamp
    private LocalDate registeredAt;
    
    @ManyToOne
    @JoinColumn(name = "event_id")
    private Event event;
    
    @Lob
    @Column(name="Image_data")
    private byte[] profileImage; 
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
=======
    
    @NotBlank(message = "Status is required")
    @Pattern(regexp = "^(available|booked)$", message = "Status must be either 'available' or 'booked'")
    @Column(nullable = false, length = 10)
    private String status;
>>>>>>> org4

}
=======
=======
>>>>>>> c386f41bf25d56bcaf96b6601cd8e26d7554187d
    
    @NotBlank(message = "Status is required")
    @Pattern(regexp = "^(available|booked)$", message = "Status must be either 'available' or 'booked'")
    @Column(nullable = false, length = 10)
    private String status;
}
