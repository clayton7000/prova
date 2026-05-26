package com.example.agape.prova.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.example.agape.prova.repository.UsuarioRepository;

import java.io.IOException;

@Component
public class SecurityFilter extends OncePerRequestFilter {

    @Autowired
    private TokenService tokenService;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Override
protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
        throws ServletException, IOException {
    try {
        String token = recuperarToken(request);
        
        if (token != null) {
            String identificacao = tokenService.extrairIdentificacao(token);
            
            // Busca o usuário no banco usando a identificação vinda do JWT
            var usuarioOpt = usuarioRepository.findByIdentificacaoUsuario(identificacao);
            
            if (usuarioOpt.isPresent() && tokenService.isTokenValido(token, usuarioOpt.get().getUsername())) {
                var usuario = usuarioOpt.get();
                var authentication = new UsernamePasswordAuthenticationToken(usuario, null, usuario.getAuthorities());
                SecurityContextHolder.getContext().setAuthentication(authentication);
            }
        }
    } catch (Exception e) {
        // Exibe o erro real no console do STS/IntelliJ/Eclipse para sabermos o que falhou
        System.out.println("Erro na validação do filtro JWT: " + e.getMessage());
        e.printStackTrace();
    }

    filterChain.doFilter(request, response);
}

    private String recuperarToken(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) return null;
        return authHeader.replace("Bearer ", "");
    }
}
