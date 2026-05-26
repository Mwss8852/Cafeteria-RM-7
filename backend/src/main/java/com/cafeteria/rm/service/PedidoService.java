package com.cafeteria.rm.service;

import com.cafeteria.rm.dto.request.PedidoRequest;
import com.cafeteria.rm.dto.response.PedidoResponse;
import com.cafeteria.rm.enums.StatusPedidoEnum;

import java.util.List;

public interface PedidoService {
    PedidoResponse criar(PedidoRequest request, Long usuarioId);
    PedidoResponse buscarPorId(Long id);
    List<PedidoResponse> listarPorUsuario(Long usuarioId);
    List<PedidoResponse> listarTodos();
    List<PedidoResponse> listarPorStatus(StatusPedidoEnum status);
    PedidoResponse atualizarStatus(Long id, StatusPedidoEnum status);
    void cancelar(Long id);
}
