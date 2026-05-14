package com.n2reinaldo.vendaEletronicos.controller;

import com.n2reinaldo.vendaEletronicos.dto.LoginDTO;
import com.n2reinaldo.vendaEletronicos.dto.UsuarioRequestDTO;
import com.n2reinaldo.vendaEletronicos.dto.UsuarioResponseDTO;
import com.n2reinaldo.vendaEletronicos.service.UsuarioService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final UsuarioService service;

    public AuthController(UsuarioService service) {
        this.service = service;
    }

    @PostMapping("/cadastrar")
    public ResponseEntity<?> cadastrar(@RequestBody UsuarioRequestDTO dto) {
        try {
            UsuarioResponseDTO response = service.cadastrar(dto);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (RuntimeException e) {
            Map<String, String> erro = new HashMap<>();
            erro.put("mensagem", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(erro);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> login(@RequestBody LoginDTO dto) {
        try {
            service.autenticar(dto);

            Map<String, String> response = new HashMap<>();
            response.put("mensagem", "Login realizado com sucesso!");

            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, String> erro = new HashMap<>();
            erro.put("mensagem", e.getMessage());

            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(erro);
        }
    }
}