package com.cafeteria.rm.dto.request;

import com.cafeteria.rm.enums.CategoriaEnum;
import jakarta.validation.constraints.*;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class ProdutoRequest {
    @NotBlank(message = "Nome obrigatório")
    private String nome;

    private String descricao;

    @NotNull(message = "Preço obrigatório")
    @DecimalMin(value = "0.01", message = "Preço deve ser maior que zero")
    private BigDecimal preco;

    @NotNull(message = "Categoria obrigatória")
    private CategoriaEnum categoria;

    private String imagemUrl;

    private Boolean disponivel = true;

    @Min(value = 0, message = "Estoque não pode ser negativo")
    private Integer estoque = 0;

    private Integer tempoPreparo;
}
