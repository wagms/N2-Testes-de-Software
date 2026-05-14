package com.n2reinaldo.vendaEletronicos.dto;

public record ClienteRequestDTO(
        String nomeCompleto,
        String cpf,
        String email,
        String telefone
) {
}