package com.quickorder.service;

import com.quickorder.builder.OrderBuilder;
import com.quickorder.model.Order;
import com.quickorder.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final KafkaProducerService kafkaProducerService;

    @Autowired
    public OrderService(OrderRepository orderRepository, KafkaProducerService kafkaProducerService) {
        this.orderRepository = orderRepository;
        this.kafkaProducerService = kafkaProducerService;
    }

    // Command pattern — виконання команди "створити замовлення"
    public Order createOrder(Order orderRequest) {
        Order order = new OrderBuilder()
                .withId(UUID.randomUUID())
                .withUserId(orderRequest.getUserId())
                .withProduct(orderRequest.getProduct())
                .withQuantity(orderRequest.getQuantity())
                .withPrice(orderRequest.getPrice())
                .withStatus("PENDING")
                .withCreatedAt(LocalDateTime.now())
                .build();

        orderRepository.save(order);

        // Відправка події в Kafka
        kafkaProducerService.sendOrderCreatedEvent(order);

        return order;
    }

    public Order getOrderById(UUID id) {
        Optional<Order> optionalOrder = orderRepository.findById(id);
        return optionalOrder.orElse(null);
    }
}
