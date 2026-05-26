package com.example.agape.prova.repository;

import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.ActiveProfiles;

import com.example.agape.prova.model.Cliente;
import com.example.agape.prova.util.ClienteTestFactory;

import java.util.List;
import java.util.Optional;
import static org.assertj.core.api.Assertions.*;

@DataJpaTest
@ActiveProfiles("test")
@DisplayName("Testes do Repository Clien")
class ClienteRepositoryTest {

    @Autowired
    private ClienteRepository clienRepository;

    private Cliente clienteSalvo;

    @BeforeEach
    void setup() {
        clienRepository.deleteAll();
        clienteSalvo = clienRepository.save(ClienteTestFactory.clienteValido());
    }

    @Test
    @DisplayName("Deve salvar cliente e gerar código automaticamente")
    void deveSalvarClienteEGerarCodigo() {
        assertThat(clienteSalvo.getCodigo()).isNotNull();
        assertThat(clienteSalvo.getCodigo()).isGreaterThan(0);
    }

    @Test
    @DisplayName("Deve encontrar cliente por ID")
    void deveEncontrarClientePorId() {
        Optional<Cliente> resultado = clienRepository.findById(clienteSalvo.getCodigo());
        assertThat(resultado).isPresent();
        assertThat(resultado.get().getNome()).isEqualTo("João da Silva");
    }

    @Test
    @DisplayName("Deve retornar vazio para ID inexistente")
    void deveRetornarVazioParaIdInexistente() {
        Optional<Cliente> resultado = clienRepository.findById(99999);
        assertThat(resultado).isEmpty();
    }

    @Test
    @DisplayName("Deve encontrar cliente por CNPJ")
    void deveEncontrarClientePorCnpj() {
        Optional<Cliente> resultado = clienRepository.findByCnpj("12345678000199");
        assertThat(resultado).isPresent();
        assertThat(resultado.get().getCnpj()).isEqualTo("12345678000199");
    }

    @Test
    @DisplayName("Deve encontrar cliente por RG")
    void deveEncontrarClientePorRg() {
        Optional<Cliente> resultado = clienRepository.findByRg("1234567-89");
        assertThat(resultado).isPresent();
    }

    @Test
    @DisplayName("Deve buscar clientes por nome parcial ignorando case")
    void deveBuscarClientesPorNomeParcialIgnorandoCase() {
        List<Cliente> resultado = clienRepository.findByNomeContainingIgnoreCase("joão");
        assertThat(resultado).hasSize(1);
        assertThat(resultado.get(0).getNome()).isEqualTo("João da Silva");
    }

    @Test
    @DisplayName("Deve retornar lista vazia para nome não encontrado")
    void deveRetornarListaVaziaParaNomeNaoEncontrado() {
        List<Cliente> resultado = clienRepository.findByNomeContainingIgnoreCase("Inexistente");
        assertThat(resultado).isEmpty();
    }

    @Test
    @DisplayName("Deve confirmar existência por CNPJ")
    void deveConfirmarExistenciaPorCnpj() {
        assertThat(clienRepository.existsByCnpj("12345678000199")).isTrue();
        assertThat(clienRepository.existsByCnpj("00000000000000")).isFalse();
    }

    @Test
    @DisplayName("Deve confirmar existência por RG")
    void deveConfirmarExistenciaPorRg() {
        assertThat(clienRepository.existsByRg("1234567-89")).isTrue();
        assertThat(clienRepository.existsByRg("0000000-00")).isFalse();
    }

    @Test
    @DisplayName("Deve listar todos os clientes")
    void deveListarTodosOsClientes() {
        clienRepository.save(ClienteTestFactory.clienteValidoSemCamposOpcionais());
        List<Cliente> lista = clienRepository.findAll();
        assertThat(lista).hasSize(2);
    }

    @Test
    @DisplayName("Deve deletar cliente por ID")
    void deveDeletarClientePorId() {
        clienRepository.deleteById(clienteSalvo.getCodigo());
        assertThat(clienRepository.findById(clienteSalvo.getCodigo())).isEmpty();
    }

    @Test
    @DisplayName("Deve atualizar dados do cliente")
    void deveAtualizarDadosDoCliente() {
        clienteSalvo.setNome("Nome Atualizado");
        Cliente atualizado = clienRepository.save(clienteSalvo);
        assertThat(atualizado.getNome()).isEqualTo("Nome Atualizado");
    }
}
