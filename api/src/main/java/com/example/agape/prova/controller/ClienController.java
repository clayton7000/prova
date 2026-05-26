package com.example.agape.prova.controller;


import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.agape.prova.model.Cliente;
import com.example.agape.prova.service.ClienteService;
import com.example.agape.prova.service.RelatorioService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/clientes")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class ClienController {

    private final ClienteService clienteService;
    private final RelatorioService relatorioService;

    // ── GET /api/clientes ─────────────────────────────────────────────────────
    @GetMapping
    public ResponseEntity<List<Cliente>> listarTodos() {
        return ResponseEntity.ok(clienteService.listarTodos());
    }

    // ── GET /api/clientes/{codigo} ────────────────────────────────────────────
    @GetMapping("/{codigo}")
    public ResponseEntity<Cliente> buscarPorCodigo(@PathVariable Integer codigo) {
        return ResponseEntity.ok(clienteService.buscarPorCodigo(codigo));
    }

    // ── GET /api/clientes/buscar?nome=João ────────────────────────────────────
    @GetMapping("/buscar")
    public ResponseEntity<List<Cliente>> buscarPorNome(@RequestParam String nome) {
        return ResponseEntity.ok(clienteService.buscarPorNome(nome));
    }

    // ── GET /api/clientes/cnpj/{cnpj} ─────────────────────────────────────────
    @GetMapping("/cnpj/{cnpj}")
    public ResponseEntity<Cliente> buscarPorCnpj(@PathVariable String cnpj) {
        return clienteService.buscarPorCnpj(cnpj)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // ── POST /api/clientes ────────────────────────────────────────────────────
    @PostMapping
    public ResponseEntity<Cliente> criar(@Valid @RequestBody Cliente cliente) {
        Cliente criado = clienteService.criar(cliente);
        return ResponseEntity.status(HttpStatus.CREATED).body(criado);
    }

    // ── PUT /api/clientes/{codigo} ────────────────────────────────────────────
    @PutMapping("/{codigo}")
    public ResponseEntity<Cliente> atualizar(
            @PathVariable Integer codigo,
            @Valid @RequestBody Cliente clien) {
        return ResponseEntity.ok(clienteService.atualizar(codigo, clien));
    }

    // ── DELETE /api/clientes/{codigo} ─────────────────────────────────────────
    @DeleteMapping("/{codigo}")
    public ResponseEntity<Void> deletar(@PathVariable Integer codigo) {
        clienteService.deletar(codigo);
        return ResponseEntity.noContent().build();
    }

    @Operation(
    summary = "Gerar relatório PDF de clientes",
    description = "Gera e faz download do relatório de clientes em PDF. " +
                  "Aceita filtro opcional por nome."
)
@ApiResponses({
    @ApiResponse(responseCode = "200", description = "PDF gerado com sucesso",
        content = @Content(mediaType = "application/pdf")),
    @ApiResponse(responseCode = "500", description = "Erro ao gerar relatório",
        content = @Content)
})
@GetMapping(value = "/relatorio", produces = MediaType.APPLICATION_PDF_VALUE)
public ResponseEntity<byte[]> gerarRelatorio(
        @Parameter(description = "Filtro opcional por nome do cliente", example = "João")
        @RequestParam(required = false) String nome) {

    byte[] pdf = relatorioService.gerarRelatorioClientes(nome);

    return ResponseEntity.ok()
            .header(HttpHeaders.CONTENT_DISPOSITION,
                    "attachment; filename=\"relatorio_clientes.pdf\"")
            .contentType(MediaType.APPLICATION_PDF)
            .contentLength(pdf.length)
            .body(pdf);
}
}
