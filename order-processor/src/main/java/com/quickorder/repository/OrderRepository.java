package com.quickorder.repository;

import com.quickorder.model.Order;
import org.springframework.stereotype.Repository;

import java.util.*;

@Repository
public class OrderRepository {
    private final Map<UUID, Order> store = new HashMap<>();

    public Order save(Order order) {
        store.put(order.getId(), order);
        return order;
    }

    public Optional<Order> findById(UUID id) {
        return Optional.ofNullable(store.get(id));
    }

    public List<Order> findAll() {
        return new ArrayList<>(store.values());
    }
}
