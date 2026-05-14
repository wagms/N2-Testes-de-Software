package com.n2reinaldo.vendaEletronicos.dto;

import com.n2reinaldo.vendaEletronicos.enums.CategoriaProdutos;

import java.math.BigDecimal;

public record ProdutoResponseDTO(
        Long id,
        String nome,
        BigDecimal preco,
        String marca,
        CategoriaProdutos categoria
) {
}