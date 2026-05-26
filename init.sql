CREATE SCHEMA IF NOT EXISTS cliente_schema;

CREATE TABLE IF NOT EXISTS cliente_schema.cliente (
    codigo      SERIAL          PRIMARY KEY,
    nome        VARCHAR(40)     NOT NULL,
    cnpj        VARCHAR(14)     NOT NULL UNIQUE,
    rg          VARCHAR(17)     NOT NULL UNIQUE,
    nascimento  DATE,
    endereco    VARCHAR(40)     NOT NULL,
    complemento VARCHAR(20),
    bairro      VARCHAR(20)     NOT NULL,
    cep         INTEGER,
    cidade      VARCHAR(20)     NOT NULL,
    uf          VARCHAR(2)      NOT NULL,
    telefone    VARCHAR(13),
    celular     VARCHAR(15),
    observacao  VARCHAR(150)
);