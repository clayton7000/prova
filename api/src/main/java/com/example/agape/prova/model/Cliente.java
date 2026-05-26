package com.example.agape.prova.model;

import java.time.LocalDate;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
@Table(name = "cliente", schema = "cliente_schema")
public class Cliente {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "codigo", updatable = false, nullable = false)
    @Schema(
        description = "Código único do cliente, gerado automaticamente",
        example = "1",
        accessMode = Schema.AccessMode.READ_ONLY
    )
    private Integer codigo;

    @NotBlank(message = "Nome é obrigatório")
    @Size(max = 40)
    @Column(name = "nome", nullable = false, length = 40)
    @Schema(description = "Nome completo do cliente", example = "João da Silva", requiredMode = Schema.RequiredMode.REQUIRED)
    private String nome;

    @NotBlank(message = "CNPJ é obrigatório")
    @Size(max = 14)
    @Column(name = "cnpj", nullable = false, length = 14)
    @Schema(description = "CNPJ do cliente (somente números)", example = "12345678000199", requiredMode = Schema.RequiredMode.REQUIRED)
    private String cnpj;

    @NotBlank(message = "RG é obrigatório")
    @Size(max = 17)
    @Column(name = "rg", nullable = false, length = 17)
    @Schema(description = "RG do cliente", example = "1234567-89", requiredMode = Schema.RequiredMode.REQUIRED)
    private String rg;

    @Column(name = "nascimento")
    @Schema(description = "Data de nascimento do cliente", example = "1990-05-15", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    private LocalDate nascimento;

    @NotBlank(message = "Endereço é obrigatório")
    @Size(max = 40)
    @Column(name = "endereco", nullable = false, length = 40)
    @Schema(description = "Endereço do cliente", example = "Rua das Flores, 100", requiredMode = Schema.RequiredMode.REQUIRED)
    private String endereco;

    @Size(max = 20)
    @Column(name = "complemento", length = 20)
    @Schema(description = "Complemento do endereço", example = "Apto 202", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    private String complemento;

    @NotBlank(message = "Bairro é obrigatório")
    @Size(max = 20)
    @Column(name = "bairro", nullable = false, length = 20)
    @Schema(description = "Bairro do cliente", example = "Centro", requiredMode = Schema.RequiredMode.REQUIRED)
    private String bairro;

    @Column(name = "cep")
    @Schema(description = "CEP do endereço (somente números)", example = "49000000", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    private Integer cep;

    @NotBlank(message = "Cidade é obrigatória")
    @Size(max = 20)
    @Column(name = "cidade", nullable = false, length = 20)
    @Schema(description = "Cidade do cliente", example = "Aracaju", requiredMode = Schema.RequiredMode.REQUIRED)
    private String cidade;

    @NotBlank(message = "UF é obrigatório")
    @Size(min = 2, max = 2)
    @Column(name = "uf", nullable = false, length = 2)
    @Schema(description = "UF (estado) do cliente — 2 caracteres", example = "SE", requiredMode = Schema.RequiredMode.REQUIRED)
    private String uf;

    @Size(max = 13)
    @Column(name = "telefone", length = 13)
    @Schema(description = "Telefone fixo com DDD", example = "(79)3211-0000", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    private String telefone;

    @Size(max = 15)
    @Column(name = "celular", length = 15)
    @Schema(description = "Celular com DDD", example = "(79)99999-0000", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    private String celular;

    @Size(max = 150)
    @Column(name = "observacao", length = 150)
    @Schema(description = "Observações adicionais sobre o cliente", example = "Cliente preferencial", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    private String observacao;
}