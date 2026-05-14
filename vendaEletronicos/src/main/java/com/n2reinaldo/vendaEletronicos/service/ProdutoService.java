package com.n2reinaldo.vendaEletronicos.service;

import com.n2reinaldo.vendaEletronicos.dto.ProdutoRequestDTO;
import com.n2reinaldo.vendaEletronicos.dto.ProdutoResponseDTO;
import com.n2reinaldo.vendaEletronicos.entity.Produto;
import com.n2reinaldo.vendaEletronicos.repository.ProdutoRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProdutoService {

    private final ProdutoRepository repository;

    public ProdutoService(ProdutoRepository repository) {
        this.repository = repository;
    }

    public ProdutoResponseDTO salvar(ProdutoRequestDTO dto) {
        Produto produto = new Produto();
        produto.setNome(dto.nome());
        produto.setPreco(dto.preco());
        produto.setMarca(dto.marca());
        produto.setCategoria(dto.categoria());

        Produto produtoSalvo = repository.save(produto);
        return converterParaDTO(produtoSalvo);
    }

    public List<ProdutoResponseDTO> listarTodos() {
        return repository.findAll().stream()
                .map(this::converterParaDTO)
                .collect(Collectors.toList());
    }

    public ProdutoResponseDTO buscarPorId(Long id) {
        Produto produto = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Produto não encontrado"));
        return converterParaDTO(produto);
    }

    public void deletar(Long id) {
        buscarPorId(id);
        repository.deleteById(id);
    }

    private ProdutoResponseDTO converterParaDTO(Produto produto) {
        return new ProdutoResponseDTO(
                produto.getId(),
                produto.getNome(),
                produto.getPreco(),
                produto.getMarca(),
                produto.getCategoria()
        );
    }
}