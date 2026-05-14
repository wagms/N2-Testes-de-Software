package com.n2reinaldo.vendaEletronicos.dto;

public record UsuarioResponseDTO(
        Long id,
        String nome,
        String email,
        String cpf
) {
}