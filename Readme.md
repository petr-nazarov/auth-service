## Development

```
cp .env.example .env
```

```
sudo npm i typescript -g
npm i
tsc
```

you will need two terminals

```
tsc -w
```

and

```
npm run dev
```

## Auto formatter

```
npm install -D typescript
```

Get the prettier extension (Prettier — Code formatter via the extensions marketplace in VS Code)
Open up settings.json — you can do the via the command pallet (View > Command Pallet then type settings.json and hit enter)

```
    "editor.formatOnSave": true,
    "[html]": {
        "editor.defaultFormatter": "esbenp.prettier-vscode"
    },
    "[javascript]": {
        "editor.defaultFormatter": "esbenp.prettier-vscode"
    },
    "[json]": {
        "editor.defaultFormatter": "esbenp.prettier-vscode"
    },
    "[typescriptreact]": {
        "editor.defaultFormatter": "esbenp.prettier-vscode"
    },
    "[typescript]": {
        "editor.defaultFormatter": "esbenp.prettier-vscode"
    }
```

Get the ESlint extension (ESLint via the extensions marketplace in VS Code)

Go to VSCode settings, and turn on `Prettier:Require Config`

## Tests

test in development (Testing typescript)

```
npm run test
```

test in production (Testing js in dist)

```
npm run test-dist
```

Get test coverage

```
npm run test-coverage
```
