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

O site não guarda dados pessoais ou bancários de quem doa. O QR Code depende de uma pequena biblioteca pública carregada ao abrir a página; se ela não carregar, a pessoa ainda pode usar o botão **Copiar Pix Copia e Cola**.

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
