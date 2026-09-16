# Configuração de doação e voluntariado

## Doações por Pix

O Pix já está configurado com a chave CNPJ `68.504.058/0001-06`, em nome de **Washington Luis Campos Rio Branco**, em São Luís. A pessoa escolhe R$ 20, R$ 50, R$ 100 ou outro valor; o site gera um QR Code e um Pix Copia e Cola com o valor selecionado.

Se a conta ou a chave mudar, atualize os quatro campos de Pix no arquivo `config.js`:

```js
pixKey: '68.504.058/0001-06',
pixReceiverName: 'WASHINGTON LUIS CAMPOS RIO BRANCO',
pixCity: 'SAO LUIS',
pixTransactionId: 'CAMPANHA4343',
```

O site não guarda dados pessoais ou bancários de quem doa. O gerador de QR Code está incluído dentro da própria pasta do site (`qrcode.min.js`), portanto não depende mais de um serviço externo para funcionar. A página também tem um botão para copiar somente a chave Pix, caso a pessoa queira informar o valor diretamente no aplicativo do banco.

## Canal oficial de doação do TSE (pendente)

A página `/apoie` foi redesenhada para deixar claro que, assim que a candidatura for
registrada, a doação passa a acontecer pelo canal oficial da Justiça Eleitoral
("Doe Aqui"), não por Pix direto no site. Esse bloco já está pronto no HTML de
`apoie.html`, mas fica **comentado e fora da página** até existir o link real —
procure pelo comentário `Canal oficial do TSE — pendente`.

Quando a candidatura estiver registrada e o TSE liberar o link do "Doe Aqui":

1. Preencha `tseDonationUrl` em `config.js` com a URL oficial.
2. Descomente o bloco `.tse-panel` em `apoie.html`.
3. Decida com a campanha se o painel de Pix continua como alternativa (ele foi
   mantido de propósito) ou se sai de cena.

## Voluntariado pelo canal de WhatsApp

1. No WhatsApp, abra o canal da campanha e toque no nome dele.
2. Escolha **Compartilhar** e depois **Copiar link**. O endereço normalmente começa com `https://whatsapp.com/channel/`.
3. Abra o arquivo `config.js` e cole o link entre as aspas:

```js
whatsappChannelUrl: 'https://whatsapp.com/channel/COLE_O_LINK_AQUI',
```

4. Salve o arquivo, publique novamente o site e teste o botão **Entrar no canal do WhatsApp**. Ele deve abrir a página pública do canal no WhatsApp.

## Importante antes de publicar

- Preencha CNPJ de campanha, responsáveis e avisos legais no rodapé.
- Valide com a equipe jurídica/contábil as regras eleitorais e a plataforma de arrecadação usada.
- Atualize os avisos de privacidade caso volte a coletar dados de voluntários pelo site.
