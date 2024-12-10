# NestJS Boilerplate

![Static Badge](https://img.shields.io/badge/Node.js-20.13.1-green?logo=nodedotjs&logoColor=%235FA04E)
![Static Badge](https://img.shields.io/badge/npm-10.5.2-%23CB3837?logo=npm&logoColor=%23CB3837)

Este repositório fornece um boilerplate para aplicações construídas com [NestJS](https://nestjs.com/), estruturado de acordo com os princípios da Clean Architecture e SOLID. Além disso, utiliza [Conventional Commits](https://www.conventionalcommits.org/pt-br/v1.0.0/) para padronização de commits e segue a convenção de nomenclatura CamelCase.

## Estrutura de Pastas

A estrutura de pastas do projeto é organizada da seguinte forma:

```
.husky/                       # Configurações do Husky para hooks do Git (pré-commit, pré-push, etc.)
.vscode/                      # Configurações específicas para o Visual Studio Code
dist/                         # Arquivos compilados gerados após a build
logs/                         # Diretório para logs gerados pela aplicação
scripts/                      # Scripts auxiliares para automações do projeto
src/                          # Código-fonte principal da aplicação
  ├── infra/                  # Camada de infraestrutura
  │   ├── config/             # Configurações globais (variáveis, constantes de ambiente, etc.)
  │   ├── database/           # Configurações e migrações do banco de dados
  │   │   ├── migrations/     # Arquivos de migração do TypeORM
  │   │   ├── typeorm/        # Configuração do TypeORM (Data Source, etc.)
  │   ├── filters/            # Filtros para captura e tratamento de exceções globais
  │   ├── logger/             # Implementação de log customizado (baseado no Winston ou outro logger)
  │   ├── middlewares/        # Middlewares para manipulação de requisições/respostas
  ├── modules/                # Módulos principais organizados por domínio
  │   ├── user/               # Módulo responsável pelo gerenciamento de usuários
  │   │   ├── application/    # Camada de aplicação do módulo
  │   │   │   ├── http/       # Controladores HTTP
  │   │   │   ├── mappers/    # Mapeadores (entidades <-> DTOs)
  │   │   │   ├── ports/      # Interfaces que conectam camadas (ex.: casos de uso e repositórios)
  │   │   │   └── use-case/   # Casde uso específicos do módulo
  │   │   ├── domain/         # Camada de domínio
  │   │   │   ├── dto/        # Data Transfer Objects (DTOs) do domínio
  │   │   │   ├── entities/   # Entidades do domínio
  │   │   │   ├── providers/  # Provedores de serviços específicos do domínioos
  │   │   │   └── repository/ # Interfaces de repositórios do domínio
  ├── shared/                 # Recursos compartilhados entre os módulos
  │   ├── constants/          # Constantes globais da aplicação
  │   ├── dtos/               # DTOs reutilizáveis em diversos módulos
  │   ├── errors/             # Classes de erros e exceções customizadas
  │   ├── repositories/       # Interfaces ou implementações de repositórios globais
  │   ├── utils/              # Funções e helpers genéricos
  │   ├── value-objects/      # Objetos de valor (ex.: CPF, CNPJ, E-mail)
  ├── app.module.ts           # Módulo raiz da aplicação
  ├── main.ts                 # Arquivo de entrada principal da aplicação
.gitignore                    # Arquivos e diretórios que devem ser ignorados pelo Git
.editorconfig                 # Regras para padronização de estilo de código no editor
.env                          # Arquivo para variáveis de ambiente
.eslintrc.js                  # Configuração do ESLint para análise de código estático
.npmrc                        # Configuração para gerenciar o npm
.prettierrc                   # Configuração do Prettier para formatação de código
docker-compose.yml            # Configuração do Docker Compose para containers da aplicação
Dockerfile                    # Arquivo para criação da imagem Docker da aplicação
README.md                     # Documentação principal do projeto
tsconfig.json                 # Configuração do TypeScript
tsconfig.build.json           # Configuração específica do TypeScript para build
package.json                  # Arquivo com configurações e dependências do projeto
```

## Clean Architecture

A Clean Architecture promove a separação de responsabilidades em camadas, permitindo que cada uma seja independente e facilmente testável. No contexto deste projeto, as camadas são:

- **Domain**: Contém as regras de negócio e entidades fundamentais, sem dependências externas.
- **Application**: Implementa os casos de uso, orquestrando as operações do domínio.
- **Infrastructure**: Inclui detalhes técnicos, como implementações de repositórios, configurações e serviços externos.

Essa organização facilita a manutenção e evolução do sistema, além de permitir testes mais eficazes.

## Princípios SOLID

O projeto adere aos princípios SOLID para garantir um código mais modular e de fácil manutenção:

- **S**ingle Responsibility Principle: Cada classe ou módulo tem uma única responsabilidade.
- **O**pen/Closed Principle: Entidades de software devem estar abertas para extensão, mas fechadas para modificação.
- **L**iskov Substitution Principle: Objetos de uma classe devem poder ser substituídos por instâncias de suas subclasses sem afetar o funcionamento do programa.
- **I**nterface Segregation Principle: Muitas interfaces específicas são melhores do que uma interface geral.
- **D**ependency Inversion Principle: Dependa de abstrações, não de implementações concretas.

## Commits Convencionais

Utilizamos o padrão [Conventional Commits](https://www.conventionalcommits.org/pt-br/v1.0.0/) para manter a consistência nas mensagens de commit. As mensagens seguem o formato:

```
<tipo>(escopo opcional): <descrição>
```

Tipos comuns incluem:

- **feat**: Adição de nova funcionalidade
- **fix**: Correção de bug
- **docs**: Alterações na documentação
- **style**: Mudanças que não afetam a lógica do código (espaços em branco, formatação, etc.)
- **refactor**: Mudanças que melhoram o código sem corrigir bugs ou adicionar funcionalidades
- **test**: Adição ou correção de testes
- **chore**: Atualizações de tarefas de build ou ferramentas auxiliares

Para facilitar a criação de commits convencionais, o projeto utiliza o [Commitizen](https://github.com/commitizen/cz-cli). Para iniciar o assistente de commit, execute:

```bash
git commit
```

## Convenção de Nomenclatura

O projeto adota a convenção de nomenclatura CamelCase para nomear variáveis, funções e classes, visando consistência e legibilidade do código.

## Variáveis de Ambiente

As variáveis de ambiente necessárias para a aplicação estão definidas no arquivo `.env`. Certifique-se de configurar as seguintes variáveis:

```
PORT=3000
NODE_ENV=development

# App
APP_NAME=boilerplate
APP_VERSION=1.0.0
APP_HOST=localhost

# Database
DB_NAME=boilerplate
DB_USER=boiler
DB_PASS=boiler123
DB_HOST=127.0.0.1
DB_PORT=5432
```

## Executando a Aplicação

Para iniciar a aplicação em modo de desenvolvimento, utilize:

```bash
npm run start:dev
```

Para iniciar a aplicação em modo de produção:

```bash
npm run build
npm run start:prod
```

## Configuração do Banco de Dados com Docker Compose

Para subir o banco de dados PostgreSQL utilizando Docker Compose, siga os passos:

1. Crie um arquivo `docker-compose.yml` na raiz do projeto com o seguinte conteúdo:

   ```yaml
   version: '3.8'

   services:
     db:
       image: postgres:latest
       container_name: postgres-container
       environment:
         - POSTGRES_DB=boilerplate
         - POSTGRES_USER=boiler
         - POSTGRES_PASSWORD=boiler123
       volumes:
         - postgres-data:/var/lib/postgresql/data
       ports:
         - '5432:5432'
       networks:
         - app-network

   volumes:
     postgres-data:

   networks:
     app-network:
       driver: bridge
   ```

2. Certifique-se de que as variáveis de ambiente no arquivo `.env` correspondem às configurações desejadas para o banco de dados.

3. No terminal, execute o comando para iniciar o serviço:

   ```bash
   docker-compose up -d
   ```

Este comando iniciará o container do PostgreSQL conforme as configurações especificadas.

## Executando Migrações

Para criar uma nova migração, utilize:

```bash
npm run migration:create <name>
```

Para aplicar as migrações pendentes ao banco de dados:

```bash
npm run migration:run
```

Para reverter a última migração aplicada:

```bash
npm run migration:revert
```
