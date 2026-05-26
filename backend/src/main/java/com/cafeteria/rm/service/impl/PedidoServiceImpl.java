package com.cafeteria.rm.service.impl;

import com.cafeteria.rm.dto.request.PedidoRequest;
import com.cafeteria.rm.dto.request.ItemPedidoRequest;
import com.cafeteria.rm.dto.response.ItemPedidoResponse;
import com.cafeteria.rm.dto.response.PedidoResponse;
import com.cafeteria.rm.entity.ItemPedido;
import com.cafeteria.rm.entity.Pedido;
import com.cafeteria.rm.entity.Produto;
import com.cafeteria.rm.entity.Usuario;
import com.cafeteria.rm.enums.StatusPedidoEnum;
import com.cafeteria.rm.exception.ResourceNotFoundException;
import com.cafeteria.rm.repository.PedidoRepository;
import com.cafeteria.rm.repository.ProdutoRepository;
import com.cafeteria.rm.repository.UsuarioRepository;
import com.cafeteria.rm.service.PedidoService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PedidoServiceImpl implements PedidoService {

    private final PedidoRepository pedidoRepository;
    private final ProdutoRepository produtoRepository;
    private final UsuarioRepository usuarioRepository;

    @Override
    @Transactional
    public PedidoResponse criar(PedidoRequest request, Long usuarioId) {
        Usuario usuario = usuarioRepository.findById(usuarioId)
            .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado"));

        Pedido pedido = Pedido.builder()
            .usuario(usuario)
            .status(StatusPedidoEnum.PENDENTE)
            .observacao(request.getObservacao())
            .numeroMesa(request.getNumeroMesa())
            .valorTotal(BigDecimal.ZERO)
            .build();

        List<ItemPedido> itens = new ArrayList<>();
        BigDecimal total = BigDecimal.ZERO;

        for (ItemPedidoRequest itemReq : request.getItens()) {
            Produto produto = produtoRepository.findById(itemReq.getProdutoId())
                .orElseThrow(() -> new ResourceNotFoundException("Produto não encontrado: " + itemReq.getProdutoId()));

            if (!produto.getDisponivel()) {
                throw new RuntimeException("Produto indisponível: " + produto.getNome());
            }

            BigDecimal subtotal = produto.getPreco().multiply(BigDecimal.valueOf(itemReq.getQuantidade()));
            total = total.add(subtotal);

            ItemPedido item = ItemPedido.builder()
                .pedido(pedido)
                .produto(produto)
                .quantidade(itemReq.getQuantidade())
                .precoUnitario(produto.getPreco())
                .subtotal(subtotal)
                .observacao(itemReq.getObservacao())
                .build();
            itens.add(item);
        }

        pedido.setItens(itens);
        pedido.setValorTotal(total);
        return toResponse(pedidoRepository.save(pedido));
    }

    @Override
    public PedidoResponse buscarPorId(Long id) {
        return pedidoRepository.findById(id)
            .map(this::toResponse)
            .orElseThrow(() -> new ResourceNotFoundException("Pedido não encontrado: " + id));
    }

    @Override
    public List<PedidoResponse> listarPorUsuario(Long usuarioId) {
        return pedidoRepository.findByUsuarioIdOrderByCreatedAtDesc(usuarioId).stream()
            .map(this::toResponse)
            .collect(Collectors.toList());
    }

    @Override
    public List<PedidoResponse> listarTodos() {
        return pedidoRepository.findAll().stream()
            .map(this::toResponse)
            .collect(Collectors.toList());
    }

    @Override
    public List<PedidoResponse> listarPorStatus(StatusPedidoEnum status) {
        return pedidoRepository.findByStatus(status).stream()
            .map(this::toResponse)
            .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public PedidoResponse atualizarStatus(Long id, StatusPedidoEnum status) {
        Pedido pedido = pedidoRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Pedido não encontrado: " + id));
        pedido.setStatus(status);
        return toResponse(pedidoRepository.save(pedido));
    }

    @Override
    @Transactional
    public void cancelar(Long id) {
        Pedido pedido = pedidoRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Pedido não encontrado: " + id));
        if (pedido.getStatus() == StatusPedidoEnum.ENTREGUE) {
            throw new RuntimeException("Não é possível cancelar um pedido já entregue");
        }
        pedido.setStatus(StatusPedidoEnum.CANCELADO);
        pedidoRepository.save(pedido);
    }

    private PedidoResponse toResponse(Pedido pedido) {
        List<ItemPedidoResponse> itensResponse = pedido.getItens() == null ? List.of() :
            pedido.getItens().stream().map(item -> ItemPedidoResponse.builder()
                .id(item.getId())
                .produtoId(item.getProduto().getId())
                .nomeProduto(item.getProduto().getNome())
                .imagemUrl(item.getProduto().getImagemUrl())
                .quantidade(item.getQuantidade())
                .precoUnitario(item.getPrecoUnitario())
                .subtotal(item.getSubtotal())
                .observacao(item.getObservacao())
                .build()
            ).collect(Collectors.toList());

        return PedidoResponse.builder()
            .id(pedido.getId())
            .usuarioId(pedido.getUsuario().getId())
            .nomeUsuario(pedido.getUsuario().getNome())
            .itens(itensResponse)
            .status(pedido.getStatus())
            .valorTotal(pedido.getValorTotal())
            .observacao(pedido.getObservacao())
            .numeroMesa(pedido.getNumeroMesa())
            .createdAt(pedido.getCreatedAt())
            .updatedAt(pedido.getUpdatedAt())
            .build();
    }
}
