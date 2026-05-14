package com.n2reinaldo.vendaEletronicos.repository;


import com.n2reinaldo.vendaEletronicos.entity.Produto;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProdutoRepository extends JpaRepository<Produto, Long> {
}