package com.n2reinaldo.vendaEletronicos.dto;

public record UsuarioRequestDTO(
        String nome,
        String email,
        String cpf,
        String password
) {
}