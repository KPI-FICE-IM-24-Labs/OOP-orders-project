package com.quickorder.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@AllArgsConstructor
public class Notification {
    private UUID id;
    private String userId;
    private String message;
    private String type;
    private LocalDateTime timestamp;

    public Notification() {
        this.id = UUID.randomUUID();
        this.timestamp = LocalDateTime.now();
    }
}
