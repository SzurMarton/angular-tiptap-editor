# TiptapEditor

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 20.0.0.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the library, run:

```bash
ng build tiptap-editor
```

This command will compile your project, and the build artifacts will be placed in the `dist/` directory.

### Publishing the Library

Once the project is built, you can publish your library by following these steps:

1. Navigate to the `dist` directory:

   ```bash
   cd dist/tiptap-editor
   ```

2. Run the `npm publish` command to publish your library to the npm registry:
   ```bash
   npm publish
   ```

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.

## Installation

```bash
npm install tiptap-editor
```

## Intégration des styles globaux pour les menus contextuels

Pour que les menus contextuels (bubble-menu) Tiptap (texte et image) aient le bon style, ajoutez le CSS global fourni par la librairie dans votre projet Angular.

### Méthode recommandée : import dans le style global

Ajoutez dans votre fichier `src/styles.scss` (ou `src/styles.css`) :

```scss
@import "~tiptap-editor/styles/index.css";
```

### Ou via angular.json

Ajoutez dans la section `styles` de votre `angular.json` :

```json
"styles": [
  "node_modules/tiptap-editor/styles/index.css",
  "src/styles.scss"
]
```

> **Note :** Ce CSS est nécessaire si vous utilisez l'option `appendTo: document.body` (recommandée) pour les menus contextuels Tiptap, car ceux-ci sont déplacés dans le `<body>` et n'héritent pas des styles encapsulés Angular.

## Utilisation

// ... (exemples d'utilisation du composant)
