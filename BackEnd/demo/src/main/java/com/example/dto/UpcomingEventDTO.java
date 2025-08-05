package com.example.dto;

public class UpcomingEventDTO {
    private Long id;
    private String username;
    private String eventName;
    private String dateTime;
    private String venue;
    private double budget;

    public UpcomingEventDTO(Long id, String username, String eventName, String dateTime, String venue, double budget) {
        this.id = id;
        this.username = username;
        this.eventName = eventName;
        this.dateTime = dateTime;
        this.venue = venue;
        this.budget = budget;
    }

    // Getters and setters
    public Long getId() { return id; }
    public String getUsername() { return username; }
    public String getEventName() { return eventName; }
    public String getDateTime() { return dateTime; }
    public String getVenue() { return venue; }
    public double getBudget() { return budget; }

    public void setId(Long id) { this.id = id; }
    public void setUsername(String username) { this.username = username; }
    public void setEventName(String eventName) { this.eventName = eventName; }
    public void setDateTime(String dateTime) { this.dateTime = dateTime; }
    public void setVenue(String venue) { this.venue = venue; }
    public void setBudget(double budget) { this.budget = budget; }
}
