package com.app.model;

public class Usuario {
    private String username;
    private String email;
    private String nome;

    public Usuario() {
    }

    public Usuario(String username, String email, String nome) {
        this.username = username;
        this.email = email;
        this.nome = nome;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }
}