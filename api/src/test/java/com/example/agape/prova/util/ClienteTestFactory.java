package com.example.agape.prova.util;

import java.time.LocalDate;

import com.example.agape.prova.model.Cliente;

public class ClienteTestFactory {

    public static Cliente clienteValido() {
        return Cliente.builder()
                .nome("João da Silva")
                .cnpj("12345678000199")
                .rg("1234567-89")
                .nascimento(LocalDate.of(1990, 5, 15))
                .endereco("Rua das Flores, 100")
                .complemento("Apto 202")
                .bairro("Centro")
                .cep(49000000)
                .cidade("Aracaju")
                .uf("SE")
                .telefone("(79)3211-0000")
                .celular("(79)99999-0000")
                .observacao("Cliente preferencial")
                .build();
    }

    public static Cliente clienteValidoSemCamposOpcionais() {
        return Cliente.builder()
                .nome("Maria Oliveira")
                .cnpj("98765432000188")
                .rg("9876543-21")
                .endereco("Av. Principal, 200")
                .bairro("Jardim")
                .cidade("Aracaju")
                .uf("SE")
                .build();
    }

    public static Cliente clienteAtualizado() {
        return Cliente.builder()
                .nome("João da Silva Atualizado")
                .cnpj("12345678000199")
                .rg("1234567-89")
                .nascimento(LocalDate.of(1990, 5, 15))
                .endereco("Rua Nova, 999")
                .complemento("Sala 01")
                .bairro("Novo Bairro")
                .cep(49010000)
                .cidade("Aracaju")
                .uf("SE")
                .telefone("(79)3000-0001")
                .celular("(79)98888-0001")
                .observacao("Dados atualizados")
                .build();
    }
}
