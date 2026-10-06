import { Cliente } from "../entities/Cliente.js";
import { ItemPedido } from "../entities/ItemPedido.js";
import { Pedido } from "../entities/Pedido.js";
import { Produto } from "../entities/Produto.js";
import type { SituacaoPedido } from "../entities/SituacaoPedido.js";


import { PedidoRepository } from "../repositories/PedidoRepository.js";
import { ProdutoRepository } from "../repositories/ProdutoRepository.js";


export interface ResumoVendas {
    quantidade: number;
    total: number;
    media: number;
}


export class PedidoService {
    constructor(
        private produtoRepository: ProdutoRepository,
        private pedidoRepository: PedidoRepository
    ) {}


    public cadastrarProduto(produto: Produto): boolean {
        return this.produtoRepository.salvar(produto);
    }


    public listarProdutos(): Produto[] {
        return this.produtoRepository.listarTodos();
    }


    public buscarProduto(id: number): Produto | undefined {
        return this.produtoRepository.buscarPorId(id);
    }


    public criarPedido(cliente: Cliente): Pedido {
        const numero = this.pedidoRepository.gerarNumero();

        const pedido = new Pedido(numero, cliente);

        this.pedidoRepository.salvar(pedido);

        return pedido;
    }

    public buscarPedido(numero: number): Pedido | undefined {
        return this.pedidoRepository.buscarPorNumero(numero);
    }

    public adicionarProduto(
        numeroPedido: number,
        idProduto: number,
        quantidade: number
    ): boolean {
        const pedido = this.buscarPedido(numeroPedido);
        const produto = this.buscarProduto(idProduto);

        if (!pedido || !produto) {
            return false;
        }

        try {
            const item = new ItemPedido(
                produto,
                quantidade
            );
            return pedido.adicionarItem(item);
        } catch {
            return false;
        }
    }

    public removerProduto(
        numeroPedido: number,
        idProduto: number
    ): boolean {
        const pedido = this.buscarPedido(numeroPedido);
        const produto = this.buscarProduto(idProduto);


        if (!pedido || !produto) {
            return false;
        }

        return pedido.removerProduto(produto);
    }

    public alterarQuantidade(
        numeroPedido: number,
        idProduto: number,
        quantidade: number
    ): boolean {
        const pedido = this.buscarPedido(numeroPedido);
        const produto = this.buscarProduto(idProduto);

        if (!pedido || !produto) {
            return false;
        }

        return pedido.alterarQuantidade(
            produto,
            quantidade
        );
    }

    public finalizarPedido(numero: number): boolean {
        const pedido = this.buscarPedido(numero);

        if (!pedido) {
            return false;
        }
        return pedido.finalizar();
    }

    public cancelarPedido(numero: number): boolean {
        const pedido = this.buscarPedido(numero);

        if (!pedido) {
            return false;
        }

        return pedido.cancelar();
    }

    public listarPorSituacao(
        situacao: SituacaoPedido
    ): Pedido[] {
        return this.pedidoRepository
            .listarTodos()
            .filter(
                pedido => pedido.situacao === situacao
            );
    }


    public resumoVendas(): ResumoVendas {
        const pedidos = this.pedidoRepository
            .listarTodos()
            .filter(
                pedido => pedido.situacao === "Finalizado"
            );


        const total = pedidos.reduce(
            (soma, pedido) =>
                soma + pedido.calcularTotal(),
            0
        );


        return {
            quantidade: pedidos.length,
            total: total,
            media: pedidos.length === 0
                ? 0
                : total / pedidos.length
        };
    }
}
