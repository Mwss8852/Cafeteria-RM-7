package com.cafeteria.rm.dto.response;

import com.cafeteria.rm.enums.CategoriaEnum;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ProdutoResponse {
    private Long id;
    private String nome;
    private String descricao;
    private BigDecimal preco;
    private CategoriaEnum categoria;
    private String imagemUrl;
    private Boolean disponivel;
    private Integer estoque;
    private Integer tempoPreparo;
    private LocalDateTime createdAt;
}
