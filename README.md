# Projeto N2 - Testes de Software 

Este projeto consiste em um sistema funcional de **Venda de Eletrônicos**, desenvolvido como parte da Atividade Prática Avaliativa da disciplina de Testes de Software (Prof. Reinaldo Jr).

##Integrantes do Grupo
* Wagner Gomes
* Rayssa Rodrigues
* Pedro Assumpção
* Kauã Honorato

---

##Proposta do Sistema
O sistema é focado no nicho de mercado de eletrônicos, permitindo a gestão de produtos e clientes. A aplicação segue o modelo cliente-servidor e prioriza a robustez técnica através da implementação de testes automatizados em diferentes níveis.

### Requisitos Funcionais Atendidos:
* **CRUD de Produtos:** Gestão de itens com atributos de nome, preço, marca e categoria.
* **CRUD de Clientes:** Gestão de informações cadastrais (Nome, CPF, E-mail e Telefone).
* **CRUD de Usuário e Login:** Sistema de autenticação funcional para acesso à plataforma.

---

##Tecnologias Utilizadas

| Categoria | Tecnologia |
| :--- | :--- |
| **Back-end** | Java 21, Spring Boot 4.0.6 |
| **Front-end** | HTML5, CSS3, JavaScript (Vanilla) |
| **Banco de Dados** | H2 (Em memória) |
| **Testes Automatizados** | JUnit, Selenium, REST-assured |

---

##Estrutura de Testes Automatizados
A automação é o componente central deste projeto. Foram implementados os seguintes níveis:

1. **Testes Unitários (JUnit):** Validação de lógicas de negócio internas, como formatação de dados e cálculos.
2. **Testes de API (REST-assured):** Garantia de funcionamento dos endpoints de criação de produtos e listagem de clientes.
3. **Testes de Integração E2E (Selenium):** Automação do fluxo de navegação do usuário, simulando o Login e o acesso ao Dashboard.

---

##Instruções de Execução

1. Clone o repositório:
```bash
git clone https://github.com/wagms/N2-Testes-de-Software
