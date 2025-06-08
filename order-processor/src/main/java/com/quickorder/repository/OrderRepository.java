package com.quickorder.repository;

import com.quickorder.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.*;

public interface OrderRepository extends JpaRepository<Order, UUID> {
}
