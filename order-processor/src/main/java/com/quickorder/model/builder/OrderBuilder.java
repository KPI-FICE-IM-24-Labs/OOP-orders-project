package com.quickorder.model.builder;

import com.quickorder.model.Order;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

// Builder pattern implementation
public class OrderBuilder {

    private UUID id;
    private UUID orderId;
    private UUID userId;
    private String product;
    private long quantity;
    private BigDecimal price;
    private LocalDateTime createdAt;

    public OrderBuilder id(UUID id) {
        this.id = id;
        return this;
    }

    public OrderBuilder orderId(UUID orderId) {
        this.orderId = orderId;
        return this;
    }

    public OrderBuilder userId(UUID userId) {
        this.userId = userId;
        return this;
    }

    public OrderBuilder product(String product) {
        this.product = product;
        return this;
    }

    public OrderBuilder quantity(long quantity) {
        this.quantity = quantity;
        return this;
    }

    public OrderBuilder price(BigDecimal price) {
        this.price = price;
        return this;
    }

    public OrderBuilder createdAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
        return this;
    }

    public Order build() {
        Order order = new Order();
        order.setOrderId(orderId);
        order.setUserId(userId);
        order.setProduct(product);
        order.setQuantity(quantity);
        order.setPrice(price);
        order.setCreatedAt(createdAt);
        return order;
    }
}
