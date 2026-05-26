package com.cafeteria.rm.dto.request;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class ItemPedidoRequest {
    @NotNull(message = "Produto obrigatório")
    private Long produtoId;

    @NotNull(message = "Quantidade obrigatória")
    @Min(value = 1, message = "Quantidade deve ser pelo menos 1")
    private Integer quantidade;

    private String observacao;
}
