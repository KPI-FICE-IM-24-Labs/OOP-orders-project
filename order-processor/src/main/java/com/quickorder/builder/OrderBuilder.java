package com.quickorder.builder;

import com.quickorder.model.Order;

import java.time.LocalDateTime;
import java.util.UUID;

public class OrderBuilder {

    private UUID id;
    private String userId;
    private String product;
    private int quantity;
    private double price;
    private String status;
    private LocalDateTime createdAt;

    public OrderBuilder withId(UUID id) {
        this.id = id;
        return this;
    }

    public OrderBuilder withUserId(String userId) {
        this.userId = userId;
        return this;
    }

    public OrderBuilder withProduct(String product) {
        this.product = product;
        return this;
    }

    public OrderBuilder withQuantity(int quantity) {
        this.quantity = quantity;
        return this;
    }

    public OrderBuilder withPrice(double price) {
        this.price = price;
        return this;
    }

    public OrderBuilder withStatus(String status) {
        this.status = status;
        return this;
    }

    public OrderBuilder withCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
        return this;
    }

    public Order build() {
        Order order = new Order();
        order.setId(id);
        order.setUserId(userId);
        order.setProduct(product);
        order.setQuantity(quantity);
        order.setPrice(price);
        order.setStatus(status);
        order.setCreatedAt(createdAt);
        return order;
    }
}
