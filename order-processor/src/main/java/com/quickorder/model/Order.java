package com.quickorder.model;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class Order {
    private UUID id;
    private String userId;
    private String product;
    private int quantity;
    private double price;
    private String status;
    private LocalDateTime createdAt;
}