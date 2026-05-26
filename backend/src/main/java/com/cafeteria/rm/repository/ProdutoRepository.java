package com.cafeteria.rm.repository;

import com.cafeteria.rm.entity.Produto;
import com.cafeteria.rm.enums.CategoriaEnum;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProdutoRepository extends JpaRepository<Produto, Long> {
    List<Produto> findByCategoria(CategoriaEnum categoria);
    List<Produto> findByDisponivelTrue();
    List<Produto> findByCategoriaAndDisponivelTrue(CategoriaEnum categoria);
    List<Produto> findByNomeContainingIgnoreCase(String nome);
}
