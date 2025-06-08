package com.quickorder.model;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public record OrderRequest(String orderId, String userId, List<OrderItemDto> items, LocalDateTime timestamp) {
}


