package com.example.agape.prova.controller;



import com.example.agape.prova.model.Cliente;
import com.example.agape.prova.service.ClienteService;
import com.example.agape.prova.util.ClienteTestFactory;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import jakarta.persistence.EntityNotFoundException;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import java.util.List;
import java.util.Optional;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(ClienController.class)
@DisplayName("Testes do Controller Clien")
class ClienteControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private ClienteService clienteService;

    private ObjectMapper objectMapper;
    private Cliente cliente;

    @BeforeEach
    void setup() {
        objectMapper = new ObjectMapper();
        objectMapper.registerModule(new JavaTimeModule());
        cliente = ClienteTestFactory.clienteValido();
        cliente.setCodigo(1);
    }

    // ── GET /api/clientes ─────────────────────────────────────────────────────

    @Test
    @DisplayName("GET /api/clientes — deve retornar lista 200")
    void deveRetornarListaDeClientes() throws Exception {
        when(clienteService.listarTodos()).thenReturn(List.of(cliente));

        mockMvc.perform(get("/api/clientes"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].nome").value("João da Silva"))
                .andExpect(jsonPath("$[0].cidade").value("Aracaju"));
    }

    @Test
    @DisplayName("GET /api/clientes — deve retornar lista vazia 200")
    void deveRetornarListaVazia() throws Exception {
        when(clienteService.listarTodos()).thenReturn(List.of());

        mockMvc.perform(get("/api/clientes"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$").isEmpty());
    }

    // ── GET /api/clientes/{codigo} ────────────────────────────────────────────

    @Test
    @DisplayName("GET /api/clientes/{codigo} — deve retornar cliente 200")
    void deveRetornarClientePorCodigo() throws Exception {
        when(clienteService.buscarPorCodigo(1)).thenReturn(cliente);

        mockMvc.perform(get("/api/clientes/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.codigo").value(1))
                .andExpect(jsonPath("$.nome").value("João da Silva"))
                .andExpect(jsonPath("$.uf").value("SE"));
    }

    @Test
    @DisplayName("GET /api/clientes/{codigo} — deve retornar 404 para código inexistente")
    void deveRetornar404ParaCodigoInexistente() throws Exception {
        when(clienteService.buscarPorCodigo(99))
                .thenThrow(new EntityNotFoundException("Cliente não encontrado com código: 99"));

        mockMvc.perform(get("/api/clientes/99"))
                .andExpect(status().isNotFound());
    }

    // ── GET /api/clientes/buscar?nome= ────────────────────────────────────────

    @Test
    @DisplayName("GET /api/clientes/buscar?nome= — deve buscar por nome 200")
    void deveBuscarPorNome() throws Exception {
        when(clienteService.buscarPorNome("João")).thenReturn(List.of(cliente));

        mockMvc.perform(get("/api/clientes/buscar").param("nome", "João"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].nome").value("João da Silva"));
    }

    // ── GET /api/clientes/cnpj/{cnpj} ─────────────────────────────────────────

    @Test
    @DisplayName("GET /api/clientes/cnpj/{cnpj} — deve retornar cliente 200")
    void deveRetornarClientePorCnpj() throws Exception {
        when(clienteService.buscarPorCnpj("12345678000199"))
                .thenReturn(Optional.of(cliente));

        mockMvc.perform(get("/api/clientes/cnpj/12345678000199"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.cnpj").value("12345678000199"));
    }

    @Test
    @DisplayName("GET /api/clientes/cnpj/{cnpj} — deve retornar 404 para CNPJ inexistente")
    void deveRetornar404ParaCnpjInexistente() throws Exception {
        when(clienteService.buscarPorCnpj("00000000000000"))
                .thenReturn(Optional.empty());

        mockMvc.perform(get("/api/clientes/cnpj/00000000000000"))
                .andExpect(status().isNotFound());
    }

    // ── POST /api/clientes ────────────────────────────────────────────────────

    @Test
    @DisplayName("POST /api/clientes — deve criar cliente 201")
    void deveCriarCliente() throws Exception {
        when(clienteService.criar(any(Cliente.class))).thenReturn(cliente);

        mockMvc.perform(post("/api/clientes")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(cliente)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.nome").value("João da Silva"))
                .andExpect(jsonPath("$.codigo").value(1));
    }

    @Test
    @DisplayName("POST /api/clientes — deve retornar 400 para dados inválidos")
    void deveRetornar400ParaDadosInvalidos() throws Exception {
        Cliente invalido = new Cliente(); // sem campos obrigatórios

        mockMvc.perform(post("/api/clientes")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalido)))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("POST /api/clientes — deve retornar 400 para CNPJ duplicado")
    void deveRetornar400ParaCnpjDuplicado() throws Exception {
        when(clienteService.criar(any(Cliente.class)))
                .thenThrow(new IllegalArgumentException("Já existe um cliente com o CNPJ"));

        mockMvc.perform(post("/api/clientes")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(cliente)))
                .andExpect(status().isBadRequest());
    }

    // ── PUT /api/clientes/{codigo} ────────────────────────────────────────────

    @Test
    @DisplayName("PUT /api/clientes/{codigo} — deve atualizar cliente 200")
    void deveAtualizarCliente() throws Exception {
        Cliente atualizado = ClienteTestFactory.clienteAtualizado();
        atualizado.setCodigo(1);
        when(clienteService.atualizar(eq(1), any(Cliente.class))).thenReturn(atualizado);

        mockMvc.perform(put("/api/clientes/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(atualizado)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.nome").value("João da Silva Atualizado"));
    }

    @Test
    @DisplayName("PUT /api/clientes/{codigo} — deve retornar 404 para código inexistente")
    void deveRetornar404AoAtualizarCodigoInexistente() throws Exception {
        when(clienteService.atualizar(eq(99), any(Cliente.class)))
                .thenThrow(new EntityNotFoundException("Cliente não encontrado com código: 99"));

        mockMvc.perform(put("/api/clientes/99")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(cliente)))
                .andExpect(status().isNotFound());
    }

    // ── DELETE /api/clientes/{codigo} ─────────────────────────────────────────

    @Test
    @DisplayName("DELETE /api/clientes/{codigo} — deve deletar cliente 204")
    void deveDeletarCliente() throws Exception {
        doNothing().when(clienteService).deletar(1);

        mockMvc.perform(delete("/api/clientes/1"))
                .andExpect(status().isNoContent());

        verify(clienteService).deletar(1);
    }

    @Test
    @DisplayName("DELETE /api/clientes/{codigo} — deve retornar 404 para código inexistente")
    void deveRetornar404AoDeletarCodigoInexistente() throws Exception {
        doThrow(new EntityNotFoundException("Cliente não encontrado com código: 99"))
                .when(clienteService).deletar(99);

        mockMvc.perform(delete("/api/clientes/99"))
                .andExpect(status().isNotFound());
    }
}
