package com.cafeteria.rm.dto.request;

import jakarta.validation.constraints.*;
import lombok.Data;

import java.util.List;

@Data
public class PedidoRequest {
    @NotEmpty(message = "Pedido deve ter pelo menos um item")
    private List<ItemPedidoRequest> itens;

    private String observacao;
    private Integer numeroMesa;
}
