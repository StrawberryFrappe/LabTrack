package com.bioren.service;

import com.google.firebase.auth.FirebaseAuth;
import com.bioren.dto.RegisterRequest;
import com.bioren.model.Usuario;
import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.*;
import com.google.firebase.auth.FirebaseAuthException;
import com.google.firebase.auth.FirebaseToken;
import com.google.firebase.cloud.FirestoreClient;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.concurrent.ExecutionException;
@Service
public class UsuarioService {
    private static final String COLLECTION_NAME = "usuarios";
    private final FirebaseAuthService authService;

    public UsuarioService(FirebaseAuthService authService) {
        this.authService = authService;
    }

    public Usuario registrarConToken(String authorizationHeader, RegisterRequest request) throws FirebaseAuthException {
        String idToken = authorizationHeader.replace("Bearer ", "").trim();
        FirebaseToken decodedToken = authService.verifyIdToken(idToken);

        Usuario usuario = new Usuario();
        usuario.setUid(decodedToken.getUid());
        usuario.setCorreo(decodedToken.getEmail());
        usuario.setName(request.getName());

        guardarUsuario(usuario);
        return usuario;
    }

    public Map<String, Object> loginConToken(String authorizationHeader) throws FirebaseAuthException {
        String idToken = authorizationHeader.replace("Bearer ", "").trim();
        System.out.println("Token recibido: " + idToken);

        FirebaseToken decodedToken = authService.verifyIdToken(idToken);
        System.out.println("Token verificado. UID: " + decodedToken.getUid() + ", Email: " + decodedToken.getEmail());

        String uid = decodedToken.getUid();
        String email = decodedToken.getEmail();

        Object roleClaim = decodedToken.getClaims().get("role");
        String role = roleClaim != null ? roleClaim.toString() : null;

        Map<String, Object> response = new HashMap<>();
        response.put("uid", uid);
        response.put("email", email);

        return response;
    }

    public Usuario obtenerUsuarioConToken(String authorizationHeader) throws FirebaseAuthException {
        String idToken = authorizationHeader.replace("Bearer ", "").trim();
        FirebaseToken decodedToken = authService.verifyIdToken(idToken);
        String uid = decodedToken.getUid();

        Firestore db = FirestoreClient.getFirestore();
        DocumentReference docRef = db.collection(COLLECTION_NAME).document(uid);

        try {
            DocumentSnapshot snapshot = docRef.get().get();
            if (snapshot.exists()) {
                return snapshot.toObject(Usuario.class);
            } else {
                return null;
            }
        } catch (InterruptedException | ExecutionException e) {
            e.printStackTrace();
            return null;
        }
    }

    public void guardarUsuario(Usuario usuario) {
        Firestore db = FirestoreClient.getFirestore();
        db.collection(COLLECTION_NAME)
                .document(usuario.getUid())
                .set(usuario);
    }

}
