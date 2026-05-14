package com.n2reinaldo.vendaEletronicos.config;

import com.n2reinaldo.vendaEletronicos.entity.Cliente;
import com.n2reinaldo.vendaEletronicos.entity.Produto;
import com.n2reinaldo.vendaEletronicos.entity.Usuario;
import com.n2reinaldo.vendaEletronicos.enums.CategoriaProdutos;
import com.n2reinaldo.vendaEletronicos.repository.ClienteRepository;
import com.n2reinaldo.vendaEletronicos.repository.ProdutoRepository;
import com.n2reinaldo.vendaEletronicos.repository.UsuarioRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;

import java.math.BigDecimal;
import java.util.Arrays;

@Configuration
public class TestConfig implements CommandLineRunner {

    private final ProdutoRepository produtoRepository;
    private final ClienteRepository clienteRepository;
    private final UsuarioRepository usuarioRepository;

    public TestConfig(
            ProdutoRepository produtoRepository,
            ClienteRepository clienteRepository,
            UsuarioRepository usuarioRepository
    ) {
        this.produtoRepository = produtoRepository;
        this.clienteRepository = clienteRepository;
        this.usuarioRepository = usuarioRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        if (produtoRepository.count() == 0) {
            Produto p1 = new Produto(null, "iPhone 15 Pro", new BigDecimal("7500.00"), "Apple", CategoriaProdutos.SMARTPHONE);
            Produto p2 = new Produto(null, "Galaxy S24 Ultra", new BigDecimal("8200.00"), "Samsung", CategoriaProdutos.SMARTPHONE);
            Produto p3 = new Produto(null, "MacBook Air M2", new BigDecimal("7800.00"), "Apple", CategoriaProdutos.NOTEBOOK);
            Produto p4 = new Produto(null, "Dell Inspiron 15", new BigDecimal("3500.00"), "Dell", CategoriaProdutos.NOTEBOOK);
            Produto p5 = new Produto(null, "iPad Air 5ª Geração", new BigDecimal("4200.00"), "Apple", CategoriaProdutos.TABLET);
            Produto p6 = new Produto(null, "Galaxy Tab S9", new BigDecimal("5100.00"), "Samsung", CategoriaProdutos.TABLET);
            Produto p7 = new Produto(null, "AirPods Pro 2", new BigDecimal("1800.00"), "Apple", CategoriaProdutos.ACESSORIO);
            Produto p8 = new Produto(null, "Galaxy Watch 6", new BigDecimal("1400.00"), "Samsung", CategoriaProdutos.SMARTWATCH);

            produtoRepository.saveAll(Arrays.asList(p1, p2, p3, p4, p5, p6, p7, p8));
        }

        if (clienteRepository.count() == 0) {
            Cliente c1 = new Cliente(null, "Reinaldo Jr", "11122233344", "reinaldo@fatesg.edu.br", "62999999999");
            Cliente c2 = new Cliente(null, "Maria Oliveira", "98765432100", "maria.oliveira@email.com", "62988887777");
            Cliente c3 = new Cliente(null, "Carlos Eduardo Souza", "12345678901", "cadu.souza@email.com", "11977776666");
            Cliente c4 = new Cliente(null, "Ana Clara Mendes", "55544433322", "ana.mendes@email.com", "62966665555");
            Cliente c5 = new Cliente(null, "Fernanda Lima", "88899900011", "fernanda.lima@email.com", "21955554444");
            Cliente c6 = new Cliente(null, "Pedro Santos", "33322211100", "pedro.santos@email.com", "62944443333");

            clienteRepository.saveAll(Arrays.asList(c1, c2, c3, c4, c5, c6));
        }

        if (!usuarioRepository.existsByEmail("admin@email.com")) {
            Usuario admin = new Usuario(
                    null,
                    "Administrador",
                    "admin@email.com",
                    "00000000000",
                    "123456"
            );

            usuarioRepository.save(admin);
        }
    }
}