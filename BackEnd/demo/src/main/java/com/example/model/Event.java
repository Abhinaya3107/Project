package com.example.model;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import com.example.enums.EventStatus;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@EqualsAndHashCode
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "events")
public class Event {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String eventName;
    private LocalDateTime dateTime;
    private int capacity;
    private int budget;

    @Column(length = 1000)
    private String description;

    private String venue;

    @ManyToOne
    @JoinColumn(name = "organizer_id")
    @JsonIgnore
    private Organizer organizer;

    @ManyToOne
    @JoinColumn(name = "user_id")
    @JsonIgnore
    private User user;
    

   
    @ManyToMany(fetch=FetchType.EAGER)
    @JoinTable(
        name = "event_vendors",
        joinColumns = @JoinColumn(name = "event_id"),
        inverseJoinColumns = @JoinColumn(name = "vendor_id")
    )
    @JsonManagedReference
    private List<Vendor> vendors = new ArrayList<>();
 
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, columnDefinition = "VARCHAR(20) DEFAULT 'PENDING'")
    private EventStatus status = EventStatus.PENDING;
}
