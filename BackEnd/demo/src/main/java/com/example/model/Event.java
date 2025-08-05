package com.example.model;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import com.example.model.Organizer;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.*;
import lombok.*;

//@Entity
//@Data
//@NoArgsConstructor
//@AllArgsConstructor
//@Table(name="events")
//public class Event {
//	@Id
//	@GeneratedValue(strategy=GenerationType.IDENTITY)
//	private Long id;
//	private String eventName;
//	private String dateTime;
//	private int capacity;
//	private int budget;
//	@Column(length=1000)
//	private String description;
//	@ManyToOne
//	@JoinColumn(name = "organizer_id")
//	private Organizer organizer;
//	private String venue;
//	@ManyToOne
//	@JoinColumn(name = "user_id")
//	private User user;
//	@OneToMany(mappedBy = "event", fetch = FetchType.EAGER ,cascade = CascadeType.ALL)
//	private List<Vendor> vendors;
//	  @Enumerated(EnumType.STRING)
//	    @Column(nullable = false, columnDefinition = "VARCHAR(20) DEFAULT 'PENDING'")
//	    private EventStatus status = EventStatus.PENDING;
//}
@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name="events")
public class Event {
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Long id;

    private String eventName;
    private LocalDateTime dateTime;
    private int capacity;
    private int budget;

    @Column(length=1000)
    private String description;

    private String venue;

    @ManyToOne
    @JoinColumn(name = "organizer_id")
    private Organizer organizer;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
   
    @OneToMany(mappedBy = "event", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<Vendor> vendors = new ArrayList<>();
    
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, columnDefinition = "VARCHAR(20) DEFAULT 'PENDING'")
    private EventStatus status = EventStatus.PENDING;
	
}

