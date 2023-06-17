# Match-3 Game

## About

This is a match-3 style game developed with Pixi.js as the main library. In it, you need to combine three or more pieces of the same type to eliminate them and score points. The game ends when you score a total of 160 points, or reach the 60 second time limit.

## Main features

- Developed with Pixi.js: The Pixi.js library is used as the basis for creating the game, offering fast and efficient rendering.
- Configuration with npm: The project was started with npm, allowing easy management of dependencies and installation of additional packages.
- Webpack with development server: Webpack was configured to provide a "fast refresh" server to facilitate development. This allows you to view changes in real time, without having to restart the server with each code modification.
- Support for ES6 features: The project uses ES6 features such as Classes, Arrow Functions and Module Import/Export to write more modern and cleaner code.
- It was configured in this project pipeline with Github Actions for its continuous delivery.
- Demo available: You can try a demo of the game at the following URL: [https://victor-limaa.github.io/match-3-game/](https://victor-limaa.github.io/match-3-game/)

## Running locally

To run the project locally, follow the steps below:

1. Clone the repository using the command:

```bash
git clone https://github.com/victor-limaa/match-3-game.git
```

2. Navigate to the project directory:

```bash
cd match-3-game
```

3. Install dependencies using npm or yarn:

```bash
npm install
```

or

```bash
yarn install
```

4. Start the development server:

```bash
npm start
```

or

```bash
yarn start
```

5. Open your browser and go to:

```
http://localhost:3000
```

## Generating a build

If you want to generate a build for export, follow the steps below:

1. Make sure you have the dependencies installed using npm or yarn:

```bash
npm install
```

or

```bash
yarn install
```

2. Run the command to generate the JavaScript bundle in the "dist" folder:

```bash
npm run build
```

or

```bash
yarn run build
```

3. The bundle will be available in the "dist" folder and can be deployed on a web server.
