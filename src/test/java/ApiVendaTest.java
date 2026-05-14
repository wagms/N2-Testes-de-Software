import io.restassured.RestAssured;
import io.restassured.response.Response;
import org.junit.jupiter.api.*;
import static io.restassured.RestAssured.*;
import static org.hamcrest.Matchers.*;

@DisplayName("Testes de API - Sistema de Venda de Eletrônicos")
public class ApiVendaTest {

    @BeforeAll
    public static void setup() {
        RestAssured.baseURI = "http://localhost:8080/api";
        System.out.println("\n> Configuração de API concluída para: " + RestAssured.baseURI);
    }

    @Test
    @DisplayName("Teste 1: POST - Criar novo produto")
    public void testCriarProduto() {
        String corpoJson = "{\"nome\": \"Mouse Gamer\", \"preco\": 150.00, \"marca\": \"Razer\", \"categoria\": \"ACESSORIO\"}";

        System.out.println("\n--- Enviando POST /produtos ---");
        given()
            .contentType("application/json")
            .body(corpoJson)
            .log().all()
        .when()
            .post("/produtos")
        .then()
            .log().all()
            .statusCode(201)
            .body("nome", equalTo("Mouse Gamer"));
        
        System.out.println("✓ Produto criado com sucesso!");
    }

    @Test
    @DisplayName("Teste 2: GET - Listar todos os clientes")
    public void testListarClientes() {
        System.out.println("\n--- Enviando GET /clientes ---");
        Response resposta = given()
            .log().all()
        .when()
            .get("/clientes")
        .then()
            .log().all()
            .statusCode(200)
            .extract().response();

        int qtd = resposta.jsonPath().getList("$").size();
        System.out.println("✓ Quantidade de clientes encontrados: " + qtd);
    }
}