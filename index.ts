import { createInterface } from "node:readline/promises";
import { stdin, stdout } from "node:process";


import { Cliente } from "./entities/Cliente.js";
import { Produto } from "./entities/Produto.js";
import type { SituacaoPedido } from "./entities/SituacaoPedido.js";


import { PedidoRepository } from "./repositories/PedidoRepository.js";
import { ProdutoRepository } from "./repositories/ProdutoRepository.js";


import { PedidoService } from "./services/PedidoService.js";


const rl = createInterface({
    input: stdin,
    output: stdout
});


const produtoRepository = new ProdutoRepository();
const pedidoRepository = new PedidoRepository();


const service = new PedidoService(
    produtoRepository,
    pedidoRepository
);


function dinheiro(valor: number): string {
    return `R$ ${valor.toFixed(2).replace(".", ",")}`;
}


async function numero(mensagem: string): Promise<number> {
    return Number(
        await rl.question(mensagem)
    );
}


async function menu(): Promise<void> {
    while (true) {
        console.log("\n===== SISTEMA DE PEDIDOS =====");
        console.log("1 - Cadastrar produto");
        console.log("2 - Listar produtos");
        console.log("3 - Criar pedido");
        console.log("4 - Adicionar produto");
        console.log("5 - Remover produto");
        console.log("6 - Alterar quantidade");
        console.log("7 - Finalizar pedido");
        console.log("8 - Cancelar pedido");
        console.log("9 - Consultar pedido");
        console.log("10 - Listar por situação");
        console.log("11 - Resumo de vendas");
        console.log("0 - Sair");


        const opcao = await numero("Escolha: ");


        if (opcao === 0) {
            break;
        }


        switch (opcao) {


            case 1: {
                const id = await numero("Código: ");
                const nome = await rl.question("Nome: ");
                const preco = await numero("Preço: ");


                const produto = new Produto(
                    id,
                    nome,
                    preco
                );


                if (service.cadastrarProduto(produto)) {
                    console.log("Produto cadastrado!");
                } else {
                    console.log("Esse código já existe.");
                }


                break;
            }


            case 2: {
                const produtos = service.listarProdutos();


                console.log("\n===== PRODUTOS =====");


                for (const produto of produtos) {
                    console.log(
                        `${produto.id} - ${produto.nome} - ${dinheiro(produto.preco)}`
                    );
                }


                if (produtos.length === 0) {
                    console.log("Nenhum produto cadastrado.");
                }


                break;
            }


            case 3: {
                const nome = await rl.question(
                    "Nome do cliente: "
                );


                const pedido = service.criarPedido(
                    new Cliente(nome)
                );


                console.log(
                    `Pedido criado! Número: ${pedido.numero}`
                );


                break;
            }


            case 4: {
                const pedido = await numero(
                    "Número do pedido: "
                );


                const produto = await numero(
                    "Código do produto: "
                );


                const quantidade = await numero(
                    "Quantidade: "
                );


                if (
                    service.adicionarProduto(
                        pedido,
                        produto,
                        quantidade
                    )
                ) {
                    console.log("Produto adicionado!");
                } else {
                    console.log("Não foi possível adicionar.");
                }


                break;
            }


            case 5: {
                const pedido = await numero(
                    "Número do pedido: "
                );


                const produto = await numero(
                    "Código do produto: "
                );


                if (
                    service.removerProduto(
                        pedido,
                        produto
                    )
                ) {
                    console.log("Produto removido!");
                } else {
                    console.log("Não foi possível remover.");
                }


                break;
            }


            case 6: {
                const pedido = await numero(
                    "Número do pedido: "
                );


                const produto = await numero(
                    "Código do produto: "
                );


                const quantidade = await numero(
                    "Nova quantidade: "
                );


                if (
                    service.alterarQuantidade(
                        pedido,
                        produto,
                        quantidade
                    )
                ) {
                    console.log("Quantidade alterada!");
                } else {
                    console.log("Não foi possível alterar.");
                }


                break;
            }


            case 7: {
                const pedido = await numero(
                    "Número do pedido: "
                );


                if (service.finalizarPedido(pedido)) {
                    console.log("Pedido finalizado!");
                } else {
                    console.log("Não foi possível finalizar.");
                }


                break;
            }


            case 8: {
                const pedido = await numero(
                    "Número do pedido: "
                );


                if (service.cancelarPedido(pedido)) {
                    console.log("Pedido cancelado!");
                } else {
                    console.log("Não foi possível cancelar.");
                }


                break;
            }


            case 9: {
                const numeroPedido = await numero(
                    "Número do pedido: "
                );


                const pedido = service.buscarPedido(
                    numeroPedido
                );


                if (!pedido) {
                    console.log("Pedido não encontrado.");
                    break;
                }


                console.log("\n===== PEDIDO =====");
                console.log(`Número: ${pedido.numero}`);
                console.log(`Cliente: ${pedido.cliente.nome}`);
                console.log(`Situação: ${pedido.situacao}`);


                console.log("Itens:");


                for (const item of pedido.itens) {
                    console.log(
                        `${item.quantidade}x ${item.produto.nome} - ` +
                        `${dinheiro(item.calcularSubtotal())}`
                    );
                }


                console.log(
                    `Total: ${dinheiro(pedido.calcularTotal())}`
                );


                break;
            }


            case 10: {
                console.log("\n1 - Aberto");
                console.log("2 - Finalizado");
                console.log("3 - Cancelado");


                const escolha = await numero(
                    "Situação: "
                );


                let situacao: SituacaoPedido;


                if (escolha === 1) {
                    situacao = "Aberto";
                } else if (escolha === 2) {
                    situacao = "Finalizado";
                } else if (escolha === 3) {
                    situacao = "Cancelado";
                } else {
                    console.log("Opção inválida.");
                    break;
                }


                const pedidos =
                    service.listarPorSituacao(situacao);


                for (const pedido of pedidos) {
                    console.log(
                        `Pedido ${pedido.numero} - ` +
                        `${pedido.cliente.nome} - ` +
                        `${dinheiro(pedido.calcularTotal())}`
                    );
                }


                if (pedidos.length === 0) {
                    console.log("Nenhum pedido encontrado.");
                }


                break;
            }


            case 11: {
                const resumo = service.resumoVendas();


                console.log("\n===== RESUMO =====");
                console.log(
                    `Pedidos vendidos: ${resumo.quantidade}`
                );
                console.log(
                    `Total vendido: ${dinheiro(resumo.total)}`
                );
                console.log(
                    `Ticket médio: ${dinheiro(resumo.media)}`
                );


                break;
            }


            default:
                console.log("Opção inválida.");
        }
    }


    rl.close();
}


menu();
