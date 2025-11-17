package com.rh.controle_posicoes.controller;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.rh.controle_posicoes.model.Posicao;
import com.rh.controle_posicoes.repository.PosicaoRepository;

@RestController
@RequestMapping("/api/posicoes")
@CrossOrigin(origins = "*") // Permite o React acessar
public class PosicaoController {

    @Autowired
    private PosicaoRepository repository;

    // 1. Listar tudo
    @GetMapping
    public List<Posicao> listar() {
        return repository.findAll();
    }

    // 1. Cadastrar
    @PostMapping
    public Posicao cadastrar(@RequestBody Posicao posicao) {
        return repository.save(posicao);
    }

    // 2. Editar
    @PutMapping("/{id}")
    public ResponseEntity<Posicao> editar(@PathVariable Long id, @RequestBody Posicao novosDados) {
        return repository.findById(id)
           .map(posicao -> {
               posicao.setNomeLotacao(novosDados.getNomeLotacao());
               posicao.setFuncaoExercida(novosDados.getFuncaoExercida());
               posicao.setOrcamento(novosDados.getOrcamento());
               Posicao atualizado = repository.save(posicao);
               return ResponseEntity.ok().body(atualizado);
           })
           .orElse(ResponseEntity.notFound().build());
    }

    // 3. Excluir
    @DeleteMapping("/{id}")
    public void excluir(@PathVariable Long id) {
        repository.deleteById(id);
    }

    // 4. Consultar (Filtro simples)
    @GetMapping("/busca")
    public ResponseEntity<List<Posicao>> buscar(@RequestParam(required = false) Long id,
                                                @RequestParam(required = false) String nome,
                                                @RequestParam(required = false) String funcao) {
        List<Posicao> resultado;
        
        if (id != null) {
            // Se passar ID, busca exato ou retorna lista vazia se não achar
            return repository.findById(id)
                    .map(posicao -> ResponseEntity.ok().body(List.of(posicao)))
                    .orElse(ResponseEntity.notFound().build());
        } else if (nome != null) {
            resultado = repository.findByNomeLotacaoContainingIgnoreCase(nome);
        } else if (funcao != null) {
            resultado = repository.findByFuncaoExercidaContainingIgnoreCase(funcao);
        } else {
            resultado = repository.findAll();
        }
        
        return ResponseEntity.ok().body(resultado);
    }
    
    // 5. Total Orçado (Agrupamento)
    @GetMapping("/totais")
    public Map<String, Map<String, BigDecimal>> totaisOrcados() {
        List<Posicao> todas = repository.findAll();
        // Agrupa por Nome Lotação e depois por Função, somando o orçamento
        return todas.stream()
            .collect(Collectors.groupingBy(Posicao::getNomeLotacao,
                Collectors.groupingBy(Posicao::getFuncaoExercida,
                    Collectors.reducing(BigDecimal.ZERO, Posicao::getOrcamento, BigDecimal::add))));
    }
}