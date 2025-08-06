package com.example.repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.dto.UpcomingEventDTO;
import com.example.model.Event;
import com.example.model.EventStatus;

public interface EventRepository extends JpaRepository<Event, Long> {

    List<Event> findByUser_Id(Long userId);

    List<Event> findByStatus(EventStatus status);

    // ✅ This one is correct: Custom JPQL constructor projection
    @Query("SELECT new com.example.dto.UpcomingEventDTO(e.id, e.eventName, e.venue, e.dateTime, e.status, e.budget) " +
           "FROM Event e WHERE e.dateTime > :dateTime AND e.status = :status")
    List<UpcomingEventDTO> findUpcomingEvents(@Param("dateTime") LocalDateTime dateTime,
                                              @Param("status") EventStatus status);
}
