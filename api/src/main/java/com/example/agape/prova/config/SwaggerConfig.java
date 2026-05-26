package com.example.agape.prova.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import java.util.List;

@Configuration
public class SwaggerConfig {

    @Bean
    public OpenAPI openAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("API de Clientes")
                        .description("API REST para gerenciamento de clientes. " +
                                "Permite criar, consultar, atualizar e remover clientes.")
                        .version("v1.0.0")
                        .contact(new Contact()
                                .name("Suporte")
                                .email("suporte@empresa.com.br")
                                .url("https://www.empresa.com.br"))
                        .license(new License()
                                .name("Apache 2.0")
                                .url("https://springdoc.org")))
                .servers(List.of(
                        new Server().url("http://localhost:8080").description("Ambiente Local"),
                        new Server().url("https://api.empresa.com.br").description("Ambiente Produção")
                ));
    }
}