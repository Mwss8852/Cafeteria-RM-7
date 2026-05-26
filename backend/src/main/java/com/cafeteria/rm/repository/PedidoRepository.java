package com.cafeteria.rm.repository;

import com.cafeteria.rm.entity.Pedido;
import com.cafeteria.rm.enums.StatusPedidoEnum;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PedidoRepository extends JpaRepository<Pedido, Long> {
    List<Pedido> findByUsuarioId(Long usuarioId);
    List<Pedido> findByStatus(StatusPedidoEnum status);
    List<Pedido> findByUsuarioIdOrderByCreatedAtDesc(Long usuarioId);
}
