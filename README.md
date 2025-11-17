# Sistema de Controle de Posições de RH

Este projeto é uma aplicação Full Stack para gerenciamento de posições e orçamento de Recursos Humanos. Desenvolvido como trabalho acadêmico na disciplina de Desenvolvimento WEB - UEPG.

## 🚀 Tecnologias Utilizadas

- **Frontend:** ReactJS, Axios, CSS3.
- **Backend:** Java 17, Spring Boot 3, Spring Data JPA.
- **Banco de Dados:** PostgreSQL (pgAdmin 4).

## ⚙️ Como Executar o Projeto

### Pré-requisitos
- Java JDK 17+
- Node.js e NPM
- Git
- PostgreSQL rodando na porta 5432 (Banco de dados: `rh_db`)

### Passos
1. Clone o repositório:
   ```bash
   git clone [https://github.com/akthomazini/sistema-controle-posicoes-rh.git](https://github.com/akthomazini/sistema-controle-posicoes-rh.git)
2. Backend:

Configure o application.properties com sua senha do banco.
Execute a classe BackendApplication.java (ou ControlePosicoesApplication.java).
O servidor iniciará em http://localhost:8080.

3. Frontend:
Entre na pasta do frontend: cd rh-frontend
Instale as dependências: npm install
Inicie o projeto: npm start
Acesse no navegador: http://localhost:3000

📚 Documentação da API (Endpoints)
A API REST roda no endereço base que você definiu (ex: http://localhost:8080/controle_posicoes/api/posicoes).

1. Listar Todas as Posições
Método: GET

URL: /

Resposta (JSON):

JSON

[
  {
    "idLotacao": 1,
    "nomeLotacao": "TI",
    "funcaoExercida": "Desenvolvedor",
    "orcamento": 5000.00
  }
]
2. Buscar Posição (Filtro)
Método: GET

URL: /busca?nome=TI

3. Cadastrar Nova Posição
Método: POST

URL: /

Corpo da Requisição (Body):

JSON

{
  "nomeLotacao": "RH",
  "funcaoExercida": "Analista",
  "orcamento": 3500.50
}
4. Editar Posição
Método: PUT

URL: /{id}

5. Excluir Posição
Método: DELETE

URL: /{id}

6. Totais Orçados
Método: GET

URL: /totais