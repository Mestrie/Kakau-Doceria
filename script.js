function adicionarPedido() {
  const pedido = {
    produto: "Bolo de Chocolate",
    quantidade: document.getElementById("quantidade").value,
    cobertura: document.getElementById("cobertura").value,
    tamanho: document.getElementById("tamanho").value
  };

  localStorage.setItem("pedido", JSON.stringify(pedido));

  enviarWhatsApp();
}

function enviarWhatsApp() {
  const pedido = JSON.parse(localStorage.getItem("pedido"));

  let mensagem = `Olá! Gostaria de fazer um pedido:%0A%0A`;
  mensagem += `Produto: ${pedido.produto}%0A`;
  mensagem += `Quantidade: ${pedido.quantidade}%0A`;
  mensagem += `Tamanho: ${pedido.tamanho}%0A`;
  mensagem += `Cobertura: ${pedido.cobertura}%0A`;
  mensagem += `%0A Data a combinar.`;

  const telefone = "55098992302313"; // trocar
  const url = `https://wa.me/${telefone}?text=${mensagem}`;

  window.open(url, "_blank");
}
