package com.quickorder.message;

import com.quickorder.model.OrderRequest;
import com.quickorder.service.OrderService;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
public class OrderCreatedKafkaConsumer {

    private final OrderService orderService;

    public OrderCreatedKafkaConsumer(OrderService orderService) {
        this.orderService = orderService;
    }

    @KafkaListener(topics = "order-created", groupId = "order-processor-group")
    public void consumeOrderEvent(OrderRequest createdOrder) {
        orderService.createOrder(createdOrder);
    }
}
