package com.cafeteria.rm.dto.request;

import com.cafeteria.rm.enums.RoleEnum;
import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class RegisterRequest {
    @NotBlank(message = "Nome obrigatório")
    private String nome;

    @NotBlank(message = "Email obrigatório")
    @Email(message = "Email inválido")
    private String email;

    @NotBlank(message = "Senha obrigatória")
    @Size(min = 6, message = "Senha deve ter no mínimo 6 caracteres")
    private String senha;

    @NotBlank(message = "Telefone obrigatório")
    private String telefone;

    private RoleEnum role = RoleEnum.CLIENTE;
}
