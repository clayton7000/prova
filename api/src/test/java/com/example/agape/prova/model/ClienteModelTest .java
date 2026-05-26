package com.example.agape.prova.model;




import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import org.junit.jupiter.api.*;

import com.example.agape.prova.util.ClienteTestFactory;

import java.util.Set;
import static org.assertj.core.api.Assertions.*;

@DisplayName("Testes do Model Cliente")
class ClienteModelTest {

    private static Validator validator;

    @BeforeAll
    static void configurarValidator() {
        ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
        validator = factory.getValidator();
    }

    @Test
    @DisplayName("Deve criar cliente válido sem violações")
    void deveCriarClienteValidoSemViolacoes() {
        Cliente cliente = ClienteTestFactory.clienteValido();
        Set<ConstraintViolation<Cliente>> violacoes = validator.validate(cliente);
        assertThat(violacoes).isEmpty();
    }

    @Test
    @DisplayName("Deve aceitar cliente sem campos opcionais")
    void deveAceitarClienteSemCamposOpcionais() {
        Cliente cliente = ClienteTestFactory.clienteValidoSemCamposOpcionais();
        Set<ConstraintViolation<Cliente>> violacoes = validator.validate(cliente);
        assertThat(violacoes).isEmpty();
    }

    @Test
    @DisplayName("Deve falhar quando nome é nulo")
    void deveFalharQuandoNomeNulo() {
        Cliente cliente = ClienteTestFactory.clienteValido();
        cliente.setNome(null);
        Set<ConstraintViolation<Cliente>> violacoes = validator.validate(cliente);
        assertThat(violacoes)
                .anyMatch(v -> v.getPropertyPath().toString().equals("nome"));
    }

    @Test
    @DisplayName("Deve falhar quando nome é vazio")
    void deveFalharQuandoNomeVazio() {
        Cliente cliente = ClienteTestFactory.clienteValido();
        cliente.setNome("   ");
        Set<ConstraintViolation<Cliente>> violacoes = validator.validate(cliente);
        assertThat(violacoes)
                .anyMatch(v -> v.getPropertyPath().toString().equals("nome"));
    }

    @Test
    @DisplayName("Deve falhar quando nome excede 40 caracteres")
    void deveFalharQuandoNomeExcede40Caracteres() {
        Cliente cliente = ClienteTestFactory.clienteValido();
        cliente.setNome("A".repeat(41));
        Set<ConstraintViolation<Cliente>> violacoes = validator.validate(cliente);
        assertThat(violacoes)
                .anyMatch(v -> v.getPropertyPath().toString().equals("nome"));
    }

    @Test
    @DisplayName("Deve falhar quando CNPJ é nulo")
    void deveFalharQuandoCnpjNulo() {
        Cliente cliente = ClienteTestFactory.clienteValido();
        cliente.setCnpj(null);
        Set<ConstraintViolation<Cliente>> violacoes = validator.validate(cliente);
        assertThat(violacoes)
                .anyMatch(v -> v.getPropertyPath().toString().equals("cnpj"));
    }

    @Test
    @DisplayName("Deve falhar quando UF tem mais de 2 caracteres")
    void deveFalharQuandoUfMaisDe2Caracteres() {
        Cliente cliente = ClienteTestFactory.clienteValido();
        cliente.setUf("SER");
        Set<ConstraintViolation<Cliente>> violacoes = validator.validate(cliente);
        assertThat(violacoes)
                .anyMatch(v -> v.getPropertyPath().toString().equals("uf"));
    }

    @Test
    @DisplayName("Deve falhar quando múltiplos campos obrigatórios estão nulos")
    void deveFalharQuandoMultiplosCamposNulos() {
        Cliente cliente = new Cliente();
        Set<ConstraintViolation<Cliente>> violacoes = validator.validate(cliente);
        assertThat(violacoes.size()).isGreaterThanOrEqualTo(6);
    }

    @Test
    @DisplayName("Builder deve gerar objeto com valores corretos")
    void builderDeveGerarObjetoComValoresCorretos() {
        Cliente cliente = ClienteTestFactory.clienteValido();
        assertThat(cliente.getNome()).isEqualTo("João da Silva");
        assertThat(cliente.getCidade()).isEqualTo("Aracaju");
        assertThat(cliente.getUf()).isEqualTo("SE");
    }

    @Test
    @DisplayName("Dois clientes com mesmos dados devem ter toString equivalente")
    void doisClientesComMesDadosDevemTerToStringEquivalente() {
        Cliente c1 = ClienteTestFactory.clienteValido();
        Cliente c2 = ClienteTestFactory.clienteValido();
        assertThat(c1.toString()).isEqualTo(c2.toString());
    }
}