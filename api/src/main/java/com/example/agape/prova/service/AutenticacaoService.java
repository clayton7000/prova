package com.example.agape.prova.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.agape.prova.dto.LoginRequestDTO;
import com.example.agape.prova.model.RegistroRequestDTO;
import com.example.agape.prova.model.Usuario;
import com.example.agape.prova.repository.UsuarioRepository;
import com.example.agape.prova.security.TokenService;

@Service
public class AutenticacaoService {

    @Autowired
    private UsuarioRepository repository;

    @Autowired
    private TokenService tokenService;

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    private String padLeftZeros(String input) {
        if (input == null) return null;
        return String.format("%08d", Long.parseLong(input.replaceAll("\\D", "")));
    }

    public String registrar(RegistroRequestDTO dto) {
        String identificacaoFormatada = padLeftZeros(dto.identificacaoUsuario());
        
        if (repository.findByIdentificacaoUsuario(identificacaoFormatada).isPresent()) {
            throw new IllegalArgumentException("Usuário com esta identificação já está cadastrado.");
        }

        String senhaCriptografada = passwordEncoder.encode(dto.senha());
        Usuario novoUsuario = new Usuario(identificacaoFormatada, senhaCriptografada);
        repository.save(novoUsuario);
        
        return tokenService.gerarToken(novoUsuario);
    }

    public String login(LoginRequestDTO dto) {
        String identificacaoFormatada = padLeftZeros(dto.identificacaoUsuario());
        Usuario usuario = repository.findByIdentificacaoUsuario(identificacaoFormatada)
                .orElseThrow(() -> new UsernameNotFoundException("Usuário ou senha inválidos"));

        if (!passwordEncoder.matches(dto.senha(), usuario.getSenha())) {
            throw new BadCredentialsException("Usuário ou senha inválidos");
        }

        return tokenService.gerarToken(usuario);
    }
}