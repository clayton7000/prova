package com.example.agape.prova.controller;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.agape.prova.dto.LoginRequestDTO;
import com.example.agape.prova.dto.LoginResponseDTO;
import com.example.agape.prova.model.RegistroRequestDTO;
import com.example.agape.prova.service.AutenticacaoService;

@RestController
@RequestMapping("/auth")
public class AutenticacaoController {

    @Autowired
    private AutenticacaoService autenticacaoService;

    @PostMapping("/register")
    public ResponseEntity<LoginResponseDTO> registrar(@RequestBody @Valid RegistroRequestDTO dto) {
        String token = autenticacaoService.registrar(dto);
        return ResponseEntity.ok(new LoginResponseDTO(token));
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> login(@RequestBody @Valid LoginRequestDTO dto) {
        String token = autenticacaoService.login(dto);
        return ResponseEntity.ok(new LoginResponseDTO(token));
    }
}
