package com.example.agape.prova.model;

import jakarta.persistence.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import java.util.Collection;
import java.util.List;

@Entity
@Table(name = "usuario")
public class Usuario implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 8)
    private String identificacaoUsuario;

    @Column(nullable = false)
    private String senha;

    @PrePersist
    @PreUpdate
    private void formatarIdentificacao() {
        if (this.identificacaoUsuario != null) {
            this.identificacaoUsuario = String.format("%08d", Long.parseLong(this.identificacaoUsuario.replaceAll("\\D", "")));
        }
    }

    // Boilerplate (Constructors, Getters, Setters e UserDetails)
    public Usuario() {}

    public Usuario(String identificacaoUsuario, String senha) {
        this.identificacaoUsuario = identificacaoUsuario;
        this.senha = senha;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getIdentificacaoUsuario() { return identificacaoUsuario; }
    public void setIdentificacaoUsuario(String identificacaoUsuario) { this.identificacaoUsuario = identificacaoUsuario; }
    public String getSenha() { return senha; }
    public void setSenha(String senha) { this.senha = senha; }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() { return List.of(); }
    @Override
    public String getPassword() { return this.senha; }
    @Override
    public String getUsername() { return this.identificacaoUsuario; }
    @Override
    public boolean isAccountNonExpired() { return true; }
    @Override
    public boolean isAccountNonLocked() { return true; }
    @Override
    public boolean isCredentialsNonExpired() { return true; }
    @Override
    public boolean isEnabled() { return true; }
}