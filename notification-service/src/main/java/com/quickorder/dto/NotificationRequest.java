package com.quickorder.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class NotificationRequest {
    private String userId;
    private String message;
    private String type; // Наприклад: "EMAIL" або "SMS"
}
