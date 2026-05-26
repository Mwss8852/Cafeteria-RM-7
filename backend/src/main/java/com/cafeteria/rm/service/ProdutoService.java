package com.cafeteria.rm.service;

import com.cafeteria.rm.dto.request.ProdutoRequest;
import com.cafeteria.rm.dto.response.ProdutoResponse;
import com.cafeteria.rm.enums.CategoriaEnum;

import java.util.List;

public interface ProdutoService {
    List<ProdutoResponse> listarTodos();
    List<ProdutoResponse> listarDisponiveis();
    List<ProdutoResponse> listarPorCategoria(CategoriaEnum categoria);
    ProdutoResponse buscarPorId(Long id);
    ProdutoResponse criar(ProdutoRequest request);
    ProdutoResponse atualizar(Long id, ProdutoRequest request);
    void deletar(Long id);
}
