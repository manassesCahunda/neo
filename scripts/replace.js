const fs = require('fs');
const path = require('path');

// Caminho para o diretório raiz do projeto
const projectRoot = path.resolve(__dirname, '..');  

// Caminho para o arquivo original dentro de node_modules
const originalFilePath = path.join(
  projectRoot,
  'node_modules',
  '.pnpm',
  'mail-listener5@2.1.2',
  'node_modules',
  'mail-listener5',
  'index.js'
);

// Caminho para o arquivo customizado (agora dentro da pasta "notas")
const customFilePath = path.join(projectRoot, 'notas', 'index.js');  // Atualizado para apontar para "/notas/index.js"

// Verifica se o arquivo customizado existe
if (!fs.existsSync(customFilePath)) {
  console.error('Arquivo customizado não encontrado:', customFilePath);
  process.exit(1);
}

// Substitui o arquivo original pelo customizado
fs.copyFile(customFilePath, originalFilePath, (err) => {
  if (err) {
    console.error('Erro ao substituir o arquivo:', err);
    process.exit(1);
  }

  console.log('Arquivo substituído com sucesso!');
});
