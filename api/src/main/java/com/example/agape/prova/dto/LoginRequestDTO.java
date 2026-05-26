package com.example.agape.prova.dto;

import jakarta.validation.constraints.NotBlank;

public record LoginRequestDTO(
    @NotBlank(message = "A identificação é obrigatória") 
    String identificacaoUsuario, 
    
    @NotBlank(message = "A senha é obrigatória") 
    String senha
) {}
