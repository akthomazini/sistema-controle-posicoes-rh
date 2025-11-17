package com.rh.controle_posicoes.model;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;

@Data // Cria getters e setters automaticamente (Lombok)
@Entity
public class Posicao {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idLotacao;

    private String nomeLotacao;
    private String funcaoExercida;
    private BigDecimal orcamento;
}
