package com.cafeteria.rm.dto.response;

import lombok.*;

import java.math.BigDecimal;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ItemPedidoResponse {
    private Long id;
    private Long produtoId;
    private String nomeProduto;
    private String imagemUrl;
    private Integer quantidade;
    private BigDecimal precoUnitario;
    private BigDecimal subtotal;
    private String observacao;
}
