import org.junit.jupiter.api.*;
import static org.junit.jupiter.api.Assertions.*;

@DisplayName("Testes Unitários - Helpers de Teste")
public class UtilTest {

    @Test
    @DisplayName("Validar limpeza de CPF")
    public void testLimpezaCPF() {
        String cpfSujo = "123.456.789-00";
        String cpfLimpo = cpfSujo.replaceAll("\\D", "");
        
        System.out.println("CPF Original: " + cpfSujo + " | Limpo: " + cpfLimpo);
        assertEquals("12345678900", cpfLimpo);
    }

    @Test
    @DisplayName("Validar cálculo de imposto simulado")
    public void testSimularCalculo() {
        double preco = 100.0;
        double precoComImposto = preco * 1.1; // 10%
        
        System.out.println("Preço: " + preco + " | Com imposto: " + precoComImposto);
        assertEquals(110.0, precoComImposto);
    }
}