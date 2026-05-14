import io.github.bonigarcia.wdm.WebDriverManager;
import org.junit.jupiter.api.*;
import org.openqa.selenium.*;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.time.Duration;

@DisplayName("Testes E2E - Interface Web Selenium")
public class SeleniumVendaTest {

    private WebDriver driver;
    private WebDriverWait wait;

    @BeforeEach
    public void setup() {
        WebDriverManager.chromedriver().setup();

        ChromeOptions options = new ChromeOptions();
        options.addArguments("--start-maximized");

        driver = new ChromeDriver(options);
        wait = new WebDriverWait(driver, Duration.ofSeconds(10));

        System.out.println("\n> Navegador iniciado.");
    }

    @AfterEach
    public void tearDown() throws InterruptedException {
        System.out.println("> Teste finalizado. Fechando navegador em 3 segundos...");

        Thread.sleep(3000);

        if (driver != null) {
            driver.quit();
        }

        System.out.println("> Navegador fechado.");
    }

    private void pausar(double segundos) throws InterruptedException {
        Thread.sleep((long) (segundos * 1000));
    }

    private void destacarElemento(WebElement elemento) {
        JavascriptExecutor js = (JavascriptExecutor) driver;

        js.executeScript(
                "arguments[0].style.border='2px solid #007bff';" +
                "arguments[0].style.boxShadow='0 0 8px #007bff';",
                elemento
        );
    }

    @Test
    @DisplayName("Teste E2E: Fluxo de Login e Dashboard")
    public void testFluxoLogin() throws InterruptedException {
        System.out.println("--- Iniciando teste de Login ---");

        driver.get("http://localhost:8080");

        pausar(1);

        System.out.println("URL atual: " + driver.getCurrentUrl());
        System.out.println("Título da página: " + driver.getTitle());

        WebElement inputEmail = wait.until(
                ExpectedConditions.visibilityOfElementLocated(By.id("input-username"))
        );

        WebElement inputSenha = wait.until(
                ExpectedConditions.visibilityOfElementLocated(By.id("input-password"))
        );

        WebElement btnLogin = wait.until(
                ExpectedConditions.elementToBeClickable(By.id("btn-login"))
        );

        System.out.println("Preenchendo email automaticamente...");
        destacarElemento(inputEmail);
        inputEmail.clear();
        inputEmail.sendKeys("admin@email.com");

        pausar(0.5);

        System.out.println("Preenchendo senha automaticamente...");
        destacarElemento(inputSenha);
        inputSenha.clear();
        inputSenha.sendKeys("123456");

        pausar(0.5);

        System.out.println("Clicando no botão de login...");
        destacarElemento(btnLogin);
        pausar(0.5);
        btnLogin.click();

        WebElement dashboard = wait.until(
                ExpectedConditions.visibilityOfElementLocated(By.id("tela-dashboard"))
        );

        System.out.println("Dashboard carregado com sucesso.");

        WebElement totalProdutosElemento = wait.until(
                ExpectedConditions.visibilityOfElementLocated(By.id("total-produtos"))
        );

        String totalProdutos = totalProdutosElemento.getText();

        System.out.println("✓ Login realizado com sucesso.");
        System.out.println("Total de produtos no dashboard: " + totalProdutos);

        Assertions.assertTrue(dashboard.isDisplayed());
    }
}