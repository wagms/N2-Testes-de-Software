package com.n2reinaldo.vendaEletronicos.dto;

public record ClienteResponseDTO(
        Long id,
        String nomeCompleto,
        String cpf,
        String email,
        String telefone
) {
}