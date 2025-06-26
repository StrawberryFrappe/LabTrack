package com.bioren.controller;

import com.bioren.dto.RegisterRequest;
import com.bioren.model.Usuario;
import com.bioren.service.UsuarioService;
import com.google.firebase.auth.FirebaseAuthException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class UsuarioController {

    private final UsuarioService usuarioService;

    public UsuarioController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }


    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestHeader("Authorization") String authorizationHeader) {
        try {
            Map<String, Object> response = usuarioService.loginConToken(authorizationHeader);
            System.out.println("Respuesta login: " + response);
            return ResponseEntity.ok(response);
        } catch (FirebaseAuthException e) {
            System.out.println("Error login: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Token inválido o expirado.");
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(
            @RequestHeader("Authorization") String authorizationHeader,
            @RequestBody RegisterRequest request) {
        try {
            Usuario usuario = usuarioService.registrarConToken(authorizationHeader, request);
            return ResponseEntity.status(HttpStatus.CREATED).body(usuario);
        } catch (FirebaseAuthException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Token inválido o expirado.");
        }
    }

}
