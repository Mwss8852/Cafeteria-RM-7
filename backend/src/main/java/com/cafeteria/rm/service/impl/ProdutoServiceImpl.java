package com.cafeteria.rm.service.impl;

import com.cafeteria.rm.dto.request.ProdutoRequest;
import com.cafeteria.rm.dto.response.ProdutoResponse;
import com.cafeteria.rm.entity.Produto;
import com.cafeteria.rm.enums.CategoriaEnum;
import com.cafeteria.rm.exception.ResourceNotFoundException;
import com.cafeteria.rm.repository.ProdutoRepository;
import com.cafeteria.rm.service.ProdutoService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProdutoServiceImpl implements ProdutoService {

    private final ProdutoRepository produtoRepository;

    @Override
    public List<ProdutoResponse> listarTodos() {
        return produtoRepository.findAll().stream()
            .map(this::toResponse)
            .collect(Collectors.toList());
    }

    @Override
    public List<ProdutoResponse> listarDisponiveis() {
        return produtoRepository.findByDisponivelTrue().stream()
            .map(this::toResponse)
            .collect(Collectors.toList());
    }

    @Override
    public List<ProdutoResponse> listarPorCategoria(CategoriaEnum categoria) {
        return produtoRepository.findByCategoriaAndDisponivelTrue(categoria).stream()
            .map(this::toResponse)
            .collect(Collectors.toList());
    }

    @Override
    public ProdutoResponse buscarPorId(Long id) {
        return produtoRepository.findById(id)
            .map(this::toResponse)
            .orElseThrow(() -> new ResourceNotFoundException("Produto não encontrado: " + id));
    }

    @Override
    public ProdutoResponse criar(ProdutoRequest request) {
        Produto produto = Produto.builder()
            .nome(request.getNome())
            .descricao(request.getDescricao())
            .preco(request.getPreco())
            .categoria(request.getCategoria())
            .imagemUrl(request.getImagemUrl())
            .disponivel(request.getDisponivel())
            .estoque(request.getEstoque())
            .tempoPreparo(request.getTempoPreparo())
            .build();
        return toResponse(produtoRepository.save(produto));
    }

    @Override
    public ProdutoResponse atualizar(Long id, ProdutoRequest request) {
        Produto produto = produtoRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Produto não encontrado: " + id));
        produto.setNome(request.getNome());
        produto.setDescricao(request.getDescricao());
        produto.setPreco(request.getPreco());
        produto.setCategoria(request.getCategoria());
        produto.setImagemUrl(request.getImagemUrl());
        produto.setDisponivel(request.getDisponivel());
        produto.setEstoque(request.getEstoque());
        produto.setTempoPreparo(request.getTempoPreparo());
        return toResponse(produtoRepository.save(produto));
    }

    @Override
    public void deletar(Long id) {
        if (!produtoRepository.existsById(id)) {
            throw new ResourceNotFoundException("Produto não encontrado: " + id);
        }
        produtoRepository.deleteById(id);
    }

    private ProdutoResponse toResponse(Produto produto) {
        return ProdutoResponse.builder()
            .id(produto.getId())
            .nome(produto.getNome())
            .descricao(produto.getDescricao())
            .preco(produto.getPreco())
            .categoria(produto.getCategoria())
            .imagemUrl(produto.getImagemUrl())
            .disponivel(produto.getDisponivel())
            .estoque(produto.getEstoque())
            .tempoPreparo(produto.getTempoPreparo())
            .createdAt(produto.getCreatedAt())
            .build();
    }
}
