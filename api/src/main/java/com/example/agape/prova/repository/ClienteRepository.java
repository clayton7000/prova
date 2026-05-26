package com.example.agape.prova.repository;

import com.example.agape.prova.model.Cliente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface ClienteRepository extends JpaRepository<Cliente, Integer> {

    Optional<Cliente> findByCnpj(String cnpj);

    Optional<Cliente> findByRg(String rg);

    List<Cliente> findByNomeContainingIgnoreCase(String nome);

    List<Cliente> findByCidade(String cidade);

    List<Cliente> findByUf(String uf);

    boolean existsByCnpj(String cnpj);

    boolean existsByRg(String rg);
}