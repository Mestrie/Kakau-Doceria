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

// Coleta todos os dados selecionados, organiza em um objeto e salva no navegador
function adicionarPedido() {
    const boloTamanho = document.getElementById("bolo_tamanho").value;
    const kit = document.getElementById("kit_festa").value;
    
    // Coleta de itens extras de decoração
    let extrasDecoracao = [];
    if (document.getElementById("add_flores").checked) extrasDecoracao.push("Flores (R$ 45,00)");
    if (document.getElementById("add_bombons").checked) extrasDecoracao.push("Bombons (R$ 10,00)");
    if (document.getElementById("add_brigadeiros").checked) extrasDecoracao.push("Brigadeiros (R$ 10,00)");

    // Estruturação do pedido
    const rascunhoPedido = {
        bolo: boloTamanho ? {
            tamanho: boloTamanho,
            massa: document.getElementById("bolo_massa").value,
            recheio: document.getElementById("bolo_recheio").value,
            geleia: document.getElementById("add_geleia").checked,
            estiloDecoracao: document.getElementById("decoracao_estilo").value,
            extras: extrasDecoracao
        } : null,
        kit: kit ? kit : null
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
    
    if (!dados || (!dados.bolo && !dados.kit)) {
        alert("Por favor, selecione pelo menos um item.");
        return;
    }

    let mensagem = `*Novo Pedido - Kakau Doceria*%0A%0A`;

    // Formatação dos dados do bolo festivo
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
        
        if (dados.bolo.extras.length > 0) {
            mensagem += `- *Extras:* ${dados.bolo.extras.join(", ")}%0A`;
        }
        mensagem += `%0A`;
    }

    // Formatação dos dados do kit festa
    if (dados.kit) {
        mensagem += `*🎁 KIT SELECIONADO:*%0A`;
        mensagem += `- ${dados.kit}%0A%0A`;
    }

    // Informações de política de vendas
    mensagem += `_Estou ciente da antecedência mínima de 48h e do sinal de 50% para reserva._`;

    // Redirecionamento para o aplicativo de mensagens
    window.open(`https://wa.me/${telefone}?text=${mensagem}`, "_blank");
}