package com.example.repository;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.dto.CreateEventDTO;
import com.example.dto.EventOrderDTO;
import com.example.dto.UpcomingEventDTO;

import com.example.enums.EventStatus;
import com.example.model.Event;
import com.example.model.Vendor;

public interface EventRepository extends JpaRepository<Event, Long> {

    List<Event> findByUser_Id(Long userId);

    List<Event> findByStatus(EventStatus status);

    // ✅ This one is correct: Custom JPQL constructor projection
    @Query("SELECT new com.example.dto.UpcomingEventDTO(e.id, e.eventName, e.venue, e.dateTime, e.status, e.budget) " +
           "FROM Event e WHERE e.dateTime > :dateTime AND e.status = :status")
    List<UpcomingEventDTO> findUpcomingEvents(@Param("dateTime") LocalDateTime dateTime,
                                              @Param("status") EventStatus status);
    
    // ✅ New query to get upcoming events with full event details including vendors
    @Query("SELECT e FROM Event e LEFT JOIN FETCH e.vendors WHERE e.dateTime > :dateTime AND e.status = :status")
    List<Event> findUpcomingEventsWithVendors(@Param("dateTime") LocalDateTime dateTime,
                                              @Param("status") EventStatus status);

	CreateEventDTO save(CreateEventDTO event);
	@Query("SELECT e FROM Event e JOIN e.vendors v WHERE v.id = :vid")
	List<Event> findByVendorId(@Param("vendorId") Long vendorId);
	
	@Query("""
			SELECT new com.example.dto.EventOrderDTO(
			    e.eventName,
			    e.dateTime,
			    e.capacity,
			    e.budget,
			    e.venue
			)
			FROM Event e
			JOIN e.vendors v
			WHERE v.vid = :vendorId
			""")
	    List<EventOrderDTO> findEventsByVendorId(@Param("vendorId") Long vendorId);
}
