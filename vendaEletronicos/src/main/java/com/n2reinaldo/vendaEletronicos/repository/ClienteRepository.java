package com.n2reinaldo.vendaEletronicos.repository;

import com.n2reinaldo.vendaEletronicos.entity.Cliente;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ClienteRepository extends JpaRepository<Cliente, Long> {
}
