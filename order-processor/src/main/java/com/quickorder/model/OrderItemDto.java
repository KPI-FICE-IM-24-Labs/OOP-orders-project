package com.quickorder.model;

import java.math.BigDecimal;

public record OrderItemDto(String productId, Long quantity, BigDecimal unitPrice) {
}
