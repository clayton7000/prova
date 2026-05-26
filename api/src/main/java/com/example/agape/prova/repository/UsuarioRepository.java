package com.example.agape.prova.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.agape.prova.model.Usuario;

import java.util.Optional;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    Optional<Usuario> findByIdentificacaoUsuario(String identificacaoUsuario);
}
