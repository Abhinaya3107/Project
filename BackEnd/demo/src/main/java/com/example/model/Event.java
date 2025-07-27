package com.example.model;

import java.time.LocalDateTime;
import com.example.model.Organizer;
import jakarta.persistence.*;
import lombok.*;

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
	private double budget;
	@Column(length=1000)
	private String description;
	@ManyToOne
	@JoinColumn(name = "organizer_id")
	private Organizer organizer;
	private String venue;
}
