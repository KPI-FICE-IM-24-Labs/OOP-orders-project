package com.quickorder.service;

import com.quickorder.model.OrderRequest;
import com.quickorder.model.builder.OrderBuilder;
import com.quickorder.repository.OrderRepository;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class OrderService {

    private final OrderRepository orderRepository;

    public OrderService(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    public String createOrder(OrderRequest orderRequest) {
        var orders = orderRequest.items().stream().map(item -> {
            return new OrderBuilder()
                    .orderId(UUID.fromString(orderRequest.orderId()))
                    .userId(UUID.fromString(orderRequest.userId()))
                    .product(item.productId())
                    .quantity(item.quantity())
                    .price(item.unitPrice())
                    .createdAt(orderRequest.timestamp())
                    .build();
        }).toList();

        orderRepository.saveAll(orders);

        return orderRequest.orderId();
    }
}
