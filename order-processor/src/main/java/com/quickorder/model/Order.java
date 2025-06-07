package com.quickorder.model;

import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Order {
    private UUID id;
    private String userId;
    private String product;
    private int quantity;
    private double price;
    private String status;
    private LocalDateTime createdAt;
}