package com.example.agape.prova.service;


import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.agape.prova.model.Cliente;
import com.example.agape.prova.repository.ClienteRepository;

import java.util.List;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class ClienteService {

    private final ClienteRepository clienRepository;

    // ── Listar todos ──────────────────────────────────────────────────────────
    @Transactional(readOnly = true)
    public List<Cliente> listarTodos() {
        log.info("Listando todos os clientes");
        return clienRepository.findAll();
    }

    // ── Buscar por código ─────────────────────────────────────────────────────
    @Transactional(readOnly = true)
    public Cliente buscarPorCodigo(Integer codigo) {
        log.info("Buscando cliente com código: {}", codigo);
        return clienRepository.findById(codigo)
                .orElseThrow(() -> new EntityNotFoundException(
                        "Cliente não encontrado com código: " + codigo));
    }

    // ── Buscar por nome ───────────────────────────────────────────────────────
    @Transactional(readOnly = true)
    public List<Cliente> buscarPorNome(String nome) {
        log.info("Buscando clientes pelo nome: {}", nome);
        return clienRepository.findByNomeContainingIgnoreCase(nome);
    }

    // ── Buscar por CNPJ ───────────────────────────────────────────────────────
    @Transactional(readOnly = true)
    public Optional<Cliente> buscarPorCnpj(String cnpj) {
        log.info("Buscando cliente pelo CNPJ: {}", cnpj);
        return clienRepository.findByCnpj(cnpj);
    }

    // ── Criar ─────────────────────────────────────────────────────────────────
    @Transactional
    public Cliente criar(Cliente clien) {
        log.info("Criando novo cliente: {}", clien.getNome());

        if (clienRepository.existsByCnpj(clien.getCnpj())) {
            throw new IllegalArgumentException(
                    "Já existe um cliente cadastrado com o CNPJ: " + clien.getCnpj());
        }
        if (clienRepository.existsByRg(clien.getRg())) {
            throw new IllegalArgumentException(
                    "Já existe um cliente cadastrado com o RG: " + clien.getRg());
        }

        return clienRepository.save(clien);
    }

    // ── Atualizar ─────────────────────────────────────────────────────────────
    @Transactional
    public Cliente atualizar(Integer codigo, Cliente dadosAtualizados) {
        log.info("Atualizando cliente com código: {}", codigo);

        Cliente clienExistente = buscarPorCodigo(codigo);

        clienExistente.setNome(dadosAtualizados.getNome());
        clienExistente.setCnpj(dadosAtualizados.getCnpj());
        clienExistente.setRg(dadosAtualizados.getRg());
        clienExistente.setNascimento(dadosAtualizados.getNascimento());
        clienExistente.setEndereco(dadosAtualizados.getEndereco());
        clienExistente.setComplemento(dadosAtualizados.getComplemento());
        clienExistente.setBairro(dadosAtualizados.getBairro());
        clienExistente.setCep(dadosAtualizados.getCep());
        clienExistente.setCidade(dadosAtualizados.getCidade());
        clienExistente.setUf(dadosAtualizados.getUf());
        clienExistente.setTelefone(dadosAtualizados.getTelefone());
        clienExistente.setCelular(dadosAtualizados.getCelular());
        clienExistente.setObservacao(dadosAtualizados.getObservacao());

        return clienRepository.save(clienExistente);
    }

    // ── Deletar ───────────────────────────────────────────────────────────────
    @Transactional
    public void deletar(Integer codigo) {
        log.info("Deletando cliente com código: {}", codigo);
        Cliente clien = buscarPorCodigo(codigo);
        clienRepository.delete(clien);
    }
}