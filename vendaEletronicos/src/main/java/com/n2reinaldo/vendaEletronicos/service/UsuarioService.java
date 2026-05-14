package com.n2reinaldo.vendaEletronicos.service;

import com.n2reinaldo.vendaEletronicos.dto.LoginDTO;
import com.n2reinaldo.vendaEletronicos.dto.UsuarioRequestDTO;
import com.n2reinaldo.vendaEletronicos.dto.UsuarioResponseDTO;
import com.n2reinaldo.vendaEletronicos.entity.Usuario;
import com.n2reinaldo.vendaEletronicos.repository.UsuarioRepository;
import org.springframework.stereotype.Service;

@Service
public class UsuarioService {

    private final UsuarioRepository repository;

    public UsuarioService(UsuarioRepository repository) {
        this.repository = repository;
    }

    public UsuarioResponseDTO cadastrar(UsuarioRequestDTO dto) {
        String nome = dto.nome() == null ? "" : dto.nome().trim();
        String email = dto.email() == null ? "" : dto.email().trim().toLowerCase();
        String cpf = dto.cpf() == null ? "" : dto.cpf().replaceAll("\\D", "");
        String password = dto.password() == null ? "" : dto.password().trim();

        if (nome.isEmpty()) {
            throw new RuntimeException("Nome é obrigatório");
        }

        if (email.isEmpty() || !email.contains("@")) {
            throw new RuntimeException("E-mail inválido");
        }

        if (cpf.length() != 11) {
            throw new RuntimeException("CPF inválido");
        }

        if (password.isEmpty()) {
            throw new RuntimeException("Senha é obrigatória");
        }

        if (repository.existsByEmail(email)) {
            throw new RuntimeException("E-mail já cadastrado");
        }

        if (repository.existsByCpf(cpf)) {
            throw new RuntimeException("CPF já cadastrado");
        }

        Usuario usuario = new Usuario();
        usuario.setNome(nome);
        usuario.setEmail(email);
        usuario.setCpf(cpf);
        usuario.setPassword(password);

        Usuario usuarioSalvo = repository.save(usuario);

        return new UsuarioResponseDTO(
                usuarioSalvo.getId(),
                usuarioSalvo.getNome(),
                usuarioSalvo.getEmail(),
                usuarioSalvo.getCpf()
        );
    }

    public boolean autenticar(LoginDTO loginDTO) {
        String email = loginDTO.username() == null ? "" : loginDTO.username().trim().toLowerCase();
        String password = loginDTO.password() == null ? "" : loginDTO.password().trim();

        Usuario usuario = repository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        if (usuario.getPassword().equals(password)) {
            return true;
        }

        throw new RuntimeException("Senha incorreta");
    }
}