// Tabela de preços de adicionais conforme o tamanho do bolo
const precosGeleia = {
    "EP": 6.00,
    "PP": 10.00,
    "P": 13.00,
    "M": 16.00,
    "G": 20.00
};

// Atualiza a exibição do valor adicional de geleia com base no tamanho selecionado
function atualizarPrecoGeleia() {
    const tamanhoSelect = document.getElementById("bolo_tamanho").value;
    const spanValor = document.getElementById("valor_geleia");
    
    if (!tamanhoSelect) {
        spanValor.innerText = "";
        return;
    }

    const sigla = tamanhoSelect.split(" ")[0];
    const preco = precosGeleia[sigla];
    
    if (preco) {
        spanValor.innerText = `(+ R$ ${preco.toFixed(2)})`;
    }
}

// Informações detalhadas dos kits para exibição e mensagem
const informacoesKits = {
    "É SÓ UM BOLINHO - R$ 200,00": "Bolo 2 amores (1,5kg), 15 Docinhos, Meio cento de salgados fritos.",
    "KAKAU DOCERIA - R$ 290,00": "Bolo 2 amores (1,5kg), 30 Docinhos, 1 Cento de salgados fritos, 15 Empadinhas.",
    "HAPPY BIRTHDAY - R$ 335,00": "Bolo EP (1kg), 15 Docinhos, Meio Cento de salgados fritos, 15 Empadinhas.",
    "CORAÇÃO DE MÃE - R$ 410,00": "Bolo P (2kg), 30 Docinhos, 1 Cento de salgados fritos.",
    "VAI TER FESTINHA SIM - R$ 470,00": "Bolo PP (1,5kg), 30 Docinhos, 1 Cento de salgados fritos, 15 Empadinhas."
};

// Mostra o que vem no kit no HTML para o cliente
function mostrarDetalhesKit() {
    const kitSelecionado = document.getElementById("kit_festa").value;
    const painel = document.getElementById("detalhes_kit");
    const lista = document.getElementById("lista_itens_kit");

    if (kitSelecionado && informacoesKits[kitSelecionado]) {
        painel.classList.remove("d-none");
        lista.innerText = informacoesKits[kitSelecionado];
    } else {
        painel.classList.add("d-none");
    }
}
// Coleta todos os dados selecionados, organiza em um objeto e salva no navegador
function adicionarPedido() {
    const boloTamanho = document.getElementById("bolo_tamanho").value;
    const kit = document.getElementById("kit_festa").value;
    
    // Coleta de itens extras de decoração do bolo
    let extrasDecoracao = [];
    if (document.getElementById("add_flores").checked) extrasDecoracao.push("Flores (R$ 45,00)");
    if (document.getElementById("add_bombons").checked) extrasDecoracao.push("Bombons (R$ 10,00)");
    if (document.getElementById("add_brigadeiros").checked) extrasDecoracao.push("Brigadeiros (R$ 10,00)");

    // Estruturação do pedido (Englobando TODAS as seções do cardápio)
    const rascunhoPedido = {
        bolo: boloTamanho ? {
            tamanho: boloTamanho,
            massa: document.getElementById("bolo_massa").value,
            recheio: document.getElementById("bolo_recheio").value,
            geleia: document.getElementById("add_geleia").checked,
            estiloDecoracao: document.getElementById("decoracao_estilo").value,
            extras: extrasDecoracao
        } : null,
        
        kit: kit ? kit : null,
        
        salgados: {
            pizzas: document.getElementById("qtd_pizzas").value,
            empadinhas: document.getElementById("qtd_empadinhas").value,
            fritos: document.getElementById("qtd_fritos").value,
            camarao: document.getElementById("qtd_camarao").value
        },

        brigadeiros: {
            quantidade: document.getElementById("qtd_brigadeiros").value,
            sabores: document.getElementById("sabores_brigadeiro").value
        },

        cafezinho: {
            bolo: document.getElementById("cafe_bolo").value,
            bebida: document.getElementById("cafe_bebida").value
        }
    };

    // Persistência dos dados no LocalStorage
    localStorage.setItem("kakau_pedido", JSON.stringify(rascunhoPedido));

    // Disparo da função de comunicação
    enviarWhatsApp();
}

// Recupera o pedido salvo e formata a mensagem para envio via API do WhatsApp
function enviarWhatsApp() {
    const dados = JSON.parse(localStorage.getItem("kakau_pedido"));
    const telefone = "55098992302313";
    
    // Verificações de categorias selecionadas
    const temSalgado = dados?.salgados && (dados.salgados.pizzas || dados.salgados.empadinhas || dados.salgados.fritos || dados.salgados.camarao);
    const temBrigadeiro = dados?.brigadeiros && dados.brigadeiros.quantidade;
    const temCafezinho = dados?.cafezinho && (dados.cafezinho.bolo || dados.cafezinho.bebida);

    // Validação: Verifica se pelo menos um item de qualquer categoria foi escolhido
    if (!dados || (!dados.bolo && !dados.kit && !temSalgado && !temBrigadeiro && !temCafezinho)) {
        alert("Por favor, selecione pelo menos um item para enviar o pedido.");
        return;
    }

    let mensagem = `*Novo Pedido - Kakau Doceria*%0A%0A`;

    // 1. BLOCO: BOLO FESTIVO
    if (dados.bolo) {
        const sigla = dados.bolo.tamanho.split(" ")[0];
        mensagem += `*🍰 BOLO FESTIVO:*%0A`;
        mensagem += `- Tamanho: ${dados.bolo.tamanho}%0A`;
        mensagem += `- Massa: ${dados.bolo.massa}%0A`;
        mensagem += `- Recheio: ${dados.bolo.recheio}%0A`;
        mensagem += `- Estilo: ${dados.bolo.estiloDecoracao}%0A`;
        
        if (dados.bolo.geleia) {
            mensagem += `- *Adicional:* Geleia de Morango (+R$ ${precosGeleia[sigla].toFixed(2)})%0A`;
        }
        
        if (dados.bolo.extras && dados.bolo.extras.length > 0) {
            mensagem += `- *Extras:* ${dados.bolo.extras.join(", ")}%0A`;
        }
        mensagem += `%0A`;
    }

    // 2. BLOCO: KITS FESTA
    if (dados.kit) {
        mensagem += `*🎁 KIT SELECIONADO:*%0A`;
        mensagem += `- ${dados.kit}%0A`;
        mensagem += `_Itens: ${informacoesKits[dados.kit]}_%0A%0A`;
    }

    // 3. BLOCO: SALGADOS E PETISCOS
    if (temSalgado) {
        mensagem += `*🍕 SALGADOS E PETISCOS:*%0A`;
        if (dados.salgados.pizzas) mensagem += `- Mini Pizzas: ${dados.salgados.pizzas}%0A`;
        if (dados.salgados.empadinhas) mensagem += `- Empadinhas: ${dados.salgados.empadinhas}%0A`;
        if (dados.salgados.fritos) mensagem += `- Salgadinhos Fritos: ${dados.salgados.fritos}%0A`;
        if (dados.salgados.camarao) mensagem += `- Camarão Empanado: ${dados.salgados.camarao}%0A`;
        mensagem += `%0A`;
    }

    // 4. BLOCO: BRIGADEIROS
    if (temBrigadeiro) {
        mensagem += `*🍬 BRIGADEIROS (20g):*%0A`;
        mensagem += `- Qtd: ${dados.brigadeiros.quantidade}%0A`;
        if (dados.brigadeiros.presente) {
            mensagem += `- *Opção:* Embalagem para presente 🎁%0A`;
        }
        if (dados.brigadeiros.sabores) {
            mensagem += `- Sabores: ${dados.brigadeiros.sabores}%0A`;
        }
        mensagem += `%0A`;
    }

    // 5. BLOCO: CAFEZINHO DA TARDE (Novo)
    if (temCafezinho) {
        mensagem += `*☕ LINHA CAFEZINHO:*%0A`;
        if (dados.cafezinho.bolo) {
            mensagem += `- Bolo Caseiro: ${dados.cafezinho.bolo}%0A`;
        }
        if (dados.cafezinho.bebida) {
            mensagem += `- Bebida: ${dados.cafezinho.bebida}%0A`;
            mensagem += `_Obs: Estou ciente da devolução da garrafa térmica em 24h sem danos._%0A`;
        }
        mensagem += `%0A`;
    }

    // RODAPÉ FINAL
    mensagem += `_Estou ciente da antecedência mínima de 48h para pedido e cancelamento e do pagamento de 50% antes e após a entrega._`;

    // Disparo para o WhatsApp
    window.open(`https://wa.me/${telefone}?text=${mensagem}`, "_blank");
}