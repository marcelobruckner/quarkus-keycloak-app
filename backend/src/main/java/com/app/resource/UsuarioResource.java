package com.app.resource;

import com.app.model.Usuario;
import io.quarkus.security.identity.SecurityIdentity;
import jakarta.annotation.security.RolesAllowed;
import jakarta.inject.Inject;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import org.eclipse.microprofile.jwt.JsonWebToken;

@Path("/api")
@Produces(MediaType.APPLICATION_JSON)
public class UsuarioResource {

    @Inject
    SecurityIdentity securityIdentity;

    @Inject
    JsonWebToken jwt;

    @GET
    @Path("/public")
    public String publicEndpoint() {
        return "Este endpoint é público!";
    }

    @GET
    @Path("/user")
    @RolesAllowed("user")
    public Usuario getUserInfo() {
        String username = securityIdentity.getPrincipal().getName();
        String email = jwt.getClaim("email");
        String nome = jwt.getClaim("name");
        
        return new Usuario(username, email, nome);
    }

    @GET
    @Path("/admin")
    @RolesAllowed("admin")
    public String adminEndpoint() {
        return "Você é um administrador!";
    }
}