# Match-3 Game

## Descrição

Este é um jogo do estilo match-3 desenvolvido com Pixi.js como biblioteca principal. Nele, você precisa combinar três ou mais peças do mesmo tipo para eliminá-las e marcar pontos.

## Características principais

- Desenvolvido com Pixi.js: A biblioteca Pixi.js é utilizada como base para a criação do jogo, oferecendo uma renderização rápida e eficiente.
- Configuração com npm: O projeto foi iniciado com npm, permitindo a fácil gestão das dependências e a instalação de pacotes adicionais.
- Webpack com servidor de desenvolvimento: O Webpack foi configurado para fornecer um servidor com "fast refresh" para facilitar o desenvolvimento. Isso permite visualizar as alterações em tempo real, sem precisar reiniciar o servidor a cada modificação no código.
- Suporte para recursos do ES6: O projeto utiliza recursos do ES6, como Classes, Arrow Functions e Importação/Exportação de Módulos, para escrever um código mais moderno e limpo.
- Foi configurado neste projeto pipeline com Github Actions para a entrega continua do mesmo.
- Demo disponível: Você pode experimentar uma demo do jogo no seguinte URL: [https://victor-limaa.github.io/match-3-game/](https://victor-limaa.github.io/match-3-game/)

## Executando localmente

Para executar o projeto localmente, siga as etapas abaixo:

1. Clone o repositório usando o comando:

```bash
git clone https://github.com/victor-limaa/match-3-game.git
```

2. Navegue até o diretório do projeto:

```bash
cd match-3-game
```

3. Instale as dependências usando npm ou yarn:

```bash
npm install
```

ou

```bash
yarn install
```

4. Inicie o servidor de desenvolvimento:

```bash
npm start
```

ou

```bash
yarn start
```

5. Abra o navegador e acesse:

```
http://localhost:3000
```

## Gerando um build

Se você deseja gerar um build para exportação, siga as etapas abaixo:

1. Certifique-se de ter as dependências instaladas usando npm ou yarn:

```bash
npm install
```

ou

```bash
yarn install
```

2. Execute o comando para gerar o bundle do JavaScript na pasta "dist":

```bash
npm run build
```

ou

```bash
yarn run build
```

3. O bundle estará disponível na pasta "dist" e poderá ser implantado em um servidor web.
