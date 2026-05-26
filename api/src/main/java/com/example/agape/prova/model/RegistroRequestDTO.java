package com.example.agape.prova.model;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record RegistroRequestDTO(
    @NotBlank(message = "A identificação é obrigatória")
    @Pattern(regexp = "^\\d{1,8}$", message = "A identificação deve conter apenas números (máximo 8 dígitos)")
    String identificacaoUsuario,

    @NotBlank(message = "A senha é obrigatória")
    @Size(min = 8, max = 16, message = "A senha deve ter entre 8 e 16 caracteres")
    @Pattern(regexp = "^(?=.*[A-Z])(?=.*\\d)(?=.*[@#$%^&+=!*]).*$", 
             message = "A senha deve conter ao menos uma letra maiúscula, um número e um caractere especial")
    String senha
) {}