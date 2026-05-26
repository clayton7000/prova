package com.example.agape.prova.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import net.sf.jasperreports.engine.*;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import javax.sql.DataSource;
import java.io.InputStream;
import java.sql.Connection;
import java.util.HashMap;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class RelatorioService {

    private final DataSource dataSource;

    public byte[] gerarRelatorioClientes(String filtroNome) {
        try (Connection conn = dataSource.getConnection()) {

            // Carrega o arquivo .jrxml e compila
            InputStream jrxmlStream = new ClassPathResource("reports/clientes.jrxml")
                    .getInputStream();
            JasperReport jasperReport = JasperCompileManager.compileReport(jrxmlStream);

            // Parâmetros do relatório
            Map<String, Object> parametros = new HashMap<>();
            parametros.put("FILTRO_NOME", filtroNome != null ? filtroNome : "");

            // Preenche o relatório com dados do banco
            JasperPrint jasperPrint = JasperFillManager.fillReport(
                    jasperReport, parametros, conn);

            // Exporta para PDF
            byte[] pdf = JasperExportManager.exportReportToPdf(jasperPrint);
            log.info("✅ Relatório de clientes gerado com sucesso");
            return pdf;

        } catch (Exception e) {
            log.error("❌ Erro ao gerar relatório: {}", e.getMessage());
            throw new RuntimeException("Erro ao gerar relatório de clientes", e);
        }
    }
}