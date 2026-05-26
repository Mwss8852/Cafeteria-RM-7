package com.cafeteria.rm.dto.response;

import com.cafeteria.rm.enums.StatusPedidoEnum;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PedidoResponse {
    private Long id;
    private Long usuarioId;
    private String nomeUsuario;
    private List<ItemPedidoResponse> itens;
    private StatusPedidoEnum status;
    private BigDecimal valorTotal;
    private String observacao;
    private Integer numeroMesa;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
