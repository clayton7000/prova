package com.example.agape.prova.service;

import jakarta.persistence.EntityNotFoundException;
import org.junit.jupiter.api.*;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;

import com.example.agape.prova.model.Cliente;
import com.example.agape.prova.repository.ClienteRepository;
import com.example.agape.prova.util.ClienteTestFactory;

import java.util.List;
import java.util.Optional;
import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("Testes do Service Clien")
class ClienteServiceTest {

    @Mock
    private ClienteRepository clienRepository;

    @InjectMocks
    private ClienteService clienService;

    private Cliente cliente;

    @BeforeEach
    void setup() {
        cliente = ClienteTestFactory.clienteValido();
        cliente.setCodigo(1);
    }

    // ── listarTodos ───────────────────────────────────────────────────────────

    @Test
    @DisplayName("Deve retornar lista de clientes")
    void deveRetornarListaDeClientes() {
        when(clienRepository.findAll()).thenReturn(List.of(cliente));
        List<Cliente> resultado = clienService.listarTodos();
        assertThat(resultado).hasSize(1);
        verify(clienRepository, times(1)).findAll();
    }

    @Test
    @DisplayName("Deve retornar lista vazia quando não há clientes")
    void deveRetornarListaVaziaQuandoNaoHaClientes() {
        when(clienRepository.findAll()).thenReturn(List.of());
        List<Cliente> resultado = clienService.listarTodos();
        assertThat(resultado).isEmpty();
    }

    // ── buscarPorCodigo ───────────────────────────────────────────────────────

    @Test
    @DisplayName("Deve retornar cliente ao buscar por código válido")
    void deveRetornarClienteAoBuscarPorCodigoValido() {
        when(clienRepository.findById(1)).thenReturn(Optional.of(cliente));
        Cliente resultado = clienService.buscarPorCodigo(1);
        assertThat(resultado.getNome()).isEqualTo("João da Silva");
    }

    @Test
    @DisplayName("Deve lançar exceção ao buscar código inexistente")
    void deveLancarExcecaoAoBuscarCodigoInexistente() {
        when(clienRepository.findById(99)).thenReturn(Optional.empty());
        assertThatThrownBy(() -> clienService.buscarPorCodigo(99))
                .isInstanceOf(EntityNotFoundException.class)
                .hasMessageContaining("99");
    }

    // ── buscarPorNome ─────────────────────────────────────────────────────────

    @Test
    @DisplayName("Deve retornar clientes por nome")
    void deveRetornarClientesPorNome() {
        when(clienRepository.findByNomeContainingIgnoreCase("João"))
                .thenReturn(List.of(cliente));
        List<Cliente> resultado = clienService.buscarPorNome("João");
        assertThat(resultado).hasSize(1);
    }

    // ── buscarPorCnpj ─────────────────────────────────────────────────────────

    @Test
    @DisplayName("Deve retornar cliente por CNPJ existente")
    void deveRetornarClientePorCnpjExistente() {
        when(clienRepository.findByCnpj("12345678000199"))
                .thenReturn(Optional.of(cliente));
        Optional<Cliente> resultado = clienService.buscarPorCnpj("12345678000199");
        assertThat(resultado).isPresent();
    }

    @Test
    @DisplayName("Deve retornar vazio para CNPJ inexistente")
    void deveRetornarVazioParaCnpjInexistente() {
        when(clienRepository.findByCnpj("00000000000000"))
                .thenReturn(Optional.empty());
        Optional<Cliente> resultado = clienService.buscarPorCnpj("00000000000000");
        assertThat(resultado).isEmpty();
    }

    // ── criar ─────────────────────────────────────────────────────────────────

    @Test
    @DisplayName("Deve criar cliente com dados válidos")
    void deveCriarClienteComDadosValidos() {
        when(clienRepository.existsByCnpj(anyString())).thenReturn(false);
        when(clienRepository.existsByRg(anyString())).thenReturn(false);
        when(clienRepository.save(any(Cliente.class))).thenReturn(cliente);

        Cliente criado = clienService.criar(cliente);

        assertThat(criado).isNotNull();
        assertThat(criado.getNome()).isEqualTo("João da Silva");
        verify(clienRepository).save(cliente);
    }

    @Test
    @DisplayName("Deve lançar exceção ao criar cliente com CNPJ duplicado")
    void deveLancarExcecaoAoCriarClienteComCnpjDuplicado() {
        when(clienRepository.existsByCnpj(cliente.getCnpj())).thenReturn(true);
        assertThatThrownBy(() -> clienService.criar(cliente))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("CNPJ");
        verify(clienRepository, never()).save(any());
    }

    @Test
    @DisplayName("Deve lançar exceção ao criar cliente com RG duplicado")
    void deveLancarExcecaoAoCriarClienteComRgDuplicado() {
        when(clienRepository.existsByCnpj(anyString())).thenReturn(false);
        when(clienRepository.existsByRg(cliente.getRg())).thenReturn(true);
        assertThatThrownBy(() -> clienService.criar(cliente))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("RG");
        verify(clienRepository, never()).save(any());
    }

    // ── atualizar ─────────────────────────────────────────────────────────────

    @Test
    @DisplayName("Deve atualizar cliente existente")
    void deveAtualizarClienteExistente() {
        Cliente dadosNovos = ClienteTestFactory.clienteAtualizado();

        when(clienRepository.findById(1)).thenReturn(Optional.of(cliente));
        when(clienRepository.save(any(Cliente.class))).thenAnswer(i -> i.getArgument(0));

        Cliente atualizado = clienService.atualizar(1, dadosNovos);

        assertThat(atualizado.getNome()).isEqualTo("João da Silva Atualizado");
        assertThat(atualizado.getEndereco()).isEqualTo("Rua Nova, 999");
        verify(clienRepository).save(any(Cliente.class));
    }

    @Test
    @DisplayName("Deve lançar exceção ao atualizar cliente inexistente")
    void deveLancarExcecaoAoAtualizarClienteInexistente() {
        when(clienRepository.findById(99)).thenReturn(Optional.empty());
        assertThatThrownBy(() -> clienService.atualizar(99, cliente))
                .isInstanceOf(EntityNotFoundException.class);
        verify(clienRepository, never()).save(any());
    }

    // ── deletar ───────────────────────────────────────────────────────────────

    @Test
    @DisplayName("Deve deletar cliente existente")
    void deveDeletarClienteExistente() {
        when(clienRepository.findById(1)).thenReturn(Optional.of(cliente));
        doNothing().when(clienRepository).delete(cliente);

        clienService.deletar(1);

        verify(clienRepository).delete(cliente);
    }

    @Test
    @DisplayName("Deve lançar exceção ao deletar cliente inexistente")
    void deveLancarExcecaoAoDeletarClienteInexistente() {
        when(clienRepository.findById(99)).thenReturn(Optional.empty());
        assertThatThrownBy(() -> clienService.deletar(99))
                .isInstanceOf(EntityNotFoundException.class);
        verify(clienRepository, never()).delete(any());
    }
}