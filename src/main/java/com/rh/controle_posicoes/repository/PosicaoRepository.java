package com.rh.controle_posicoes.repository;

import com.rh.controle_posicoes.model.Posicao;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PosicaoRepository extends JpaRepository<Posicao, Long> {
    // Métodos de busca personalizados (item 4 do seu pedido)
    List<Posicao> findByNomeLotacaoContainingIgnoreCase(String nome);
    List<Posicao> findByFuncaoExercidaContainingIgnoreCase(String funcao);
}