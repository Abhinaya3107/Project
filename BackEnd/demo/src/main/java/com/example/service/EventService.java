
//import java.util.stream.Collectors;
//
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.stereotype.Service;
//
//import com.example.dto.EventSummaryDTO;
//import com.example.dto.EventSummaryDTOofapprove;
//import com.example.model.Event;
//import com.example.model.EventStatus;
//import com.example.repository.EventRepository;
//
//import jakarta.persistence.EntityNotFoundException;
//
//@Service
//public class EventService {
//
//    @Autowired
//    private EventRepository eventRepository;
//
//    public Event save(Event event) {
//        return eventRepository.save(event);
//    }
//
//    public Optional<Event> findById(Long eventId) {
//        return eventRepository.findById(eventId);
//    }
//
//    public boolean existsById(Long id) {
//        return eventRepository.existsById(id);
//    }
//
//    public void deleteById(Long id) {
//        eventRepository.deleteById(id);
//    }
//
//    public List<Event> getAllEvents() {
//        return eventRepository.findAll();
//    }
//
//    public List<Event> findByUserId(Long userId) {
//        return eventRepository.findByUser_Id(userId);
//    }
//
//    public long countEvents() {
//        return eventRepository.count();
//    }
//
//    public List<EventSummaryDTO> getEventSummaries() {
//        List<Event> events = eventRepository.findAll();
//
//        return events.stream().map(event -> {
//            String username = event.getUser() != null
//                    ? event.getUser().getFirstName() + " " + event.getUser().getLastName()
//                    : "Unknown";
//
//            return new EventSummaryDTO(
//                    event.getId(),
//                    username,
//                    event.getEventName(),
//                    event.getDateTime(),
//                    event.getVenue(),
//                    event.getBudget()
//            );
//        }).collect(Collectors.toList());
//    }
//     
//     
//    
//
//}




//import java.time.LocalDateTime;
//import java.time.ZoneId;
//import java.time.format.DateTimeFormatter;
//import java.util.List;
//import java.util.Optional;
//import java.util.stream.Collectors;
//
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.stereotype.Service;
//
//import com.example.dto.EventSummaryDTO;
//import com.example.dto.UpcomingEventDTO;
//import com.example.model.Event;
//import com.example.model.EventStatus;
//import com.example.repository.EventRepository; 
//@Service
//public class EventService {
//@Autowired
//private EventRepository eventRepository;
//
//// Add this method inside your EventService class
//public List<UpcomingEventDTO> getUpcomingEvents() {
//    DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");
//
//    // Fetch events with status UPCOMING from your repository
//    Optional<Event> events = eventRepository.findByStatus(EventStatus.APPROVED);
//
//    return events.stream().map(event -> {
//        String username = event.getUser() != null
//                ? event.getUser().getFirstName() + " " + event.getUser().getLastName()
//                : "Unknown";
//
//        String formattedDateTime = "";
//        if (event.getDateTime() != null) {
//            LocalDateTime localDateTime = event.getDateTime().toInstant()
//                    .atZone(ZoneId.systemDefault())
//                    .toLocalDateTime();
//            formattedDateTime = localDateTime.format(formatter);
//        }
//
//        return new UpcomingEventDTO(
//                event.getId(),
//                username,
//                event.getEventName(),
//                formattedDateTime,
//                event.getVenue(),
//                event.getBudget()
//        );
//    }).collect(Collectors.toList());
//}
//
//public void save(Event event) {
//	// TODO Auto-generated method stub
//	
//}
//
//public List<EventSummaryDTO> getEventSummaries() {
//	// TODO Auto-generated method stub
//	return null;
//}
//
//public Optional<Event> findById(Long id) {
//	// TODO Auto-generated method stub
//	return null;
//}
//}






package com.example.service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.dto.EventSummaryDTO;
import com.example.dto.UpcomingEventDTO;
import com.example.model.Event;
import com.example.model.EventStatus;
import com.example.repository.EventRepository;

@Service
public class EventService {

    @Autowired
    private EventRepository eventRepository;

    // Save or update event
    public Event save(Event event) {
        return eventRepository.save(event);
    }

    // Find event by ID
    public Optional<Event> findById(Long eventId) {
        return eventRepository.findById(eventId);
    }

    // Check existence by ID
    public boolean existsById(Long id) {
        return eventRepository.existsById(id);
    }

    // Delete by ID
    public void deleteById(Long id) {
        eventRepository.deleteById(id);
    }

    // Get all events
    public List<Event> getAllEvents() {
        return eventRepository.findAll();
    }

    // Get events by user ID
    public List<Event> findByUserId(Long userId) {
        return eventRepository.findByUser_Id(userId);
    }

    // Count total events
    public long countEvents() {
        return eventRepository.count();
    }

    // Get list of event summaries
    public List<EventSummaryDTO> getEventSummaries() {
        List<Event> events = eventRepository.findAll();

        return events.stream().map(event -> {
            String username = event.getUser() != null
                    ? event.getUser().getFirstName() + " " + event.getUser().getLastName()
                    : "Unknown";

            return new EventSummaryDTO(
                    event.getId(),
                    username,
                    event.getEventName(),
                    event.getDateTime(),
                    event.getVenue(),
                    event.getBudget()
            );
        }).collect(Collectors.toList());
    }


    // Get list of upcoming approved events
    public List<UpcomingEventDTO> getUpcomingApprovedEvents() {
        return eventRepository.findUpcomingEvents(LocalDateTime.now(), EventStatus.APPROVED);
    }

    public List<UpcomingEventDTO> getUpcomingEvents() {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");

        List<Event> events = eventRepository.findByStatus(EventStatus.APPROVED);

        return events.stream().map(event -> {
            String username = event.getUser() != null
                    ? event.getUser().getFirstName() + " " + event.getUser().getLastName()
                    : "Unknown";

            String formattedDateTime = "";
            if (event.getDateTime() != null) {
                formattedDateTime = event.getDateTime().format(formatter);
            }

            return new UpcomingEventDTO(
            		event.getId(),
            	    event.getEventName(),
            	    event.getVenue(),
            	    event.getDateTime(),
            	    event.getStatus().name(),  // Assuming it's an enum, or use getStatus()
            	    event.getBudget(),
            	    event.getCapacity()
            );
        }).collect(Collectors.toList());
    }

}

