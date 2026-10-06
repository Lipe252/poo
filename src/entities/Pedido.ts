import { Cliente } from "./Cliente.js";
import { ItemPedido } from "./ItemPedido.js";
import { Produto } from "./Produto.js";
import type { SituacaoPedido } from "./SituacaoPedido.js";


export class Pedido {
    private readonly _itens: ItemPedido[] = [];
    private _situacao: SituacaoPedido = "Aberto";


    constructor(
        public readonly numero: number,
        public readonly cliente: Cliente
    ) {}


    public get situacao(): SituacaoPedido {
        return this._situacao;
    }


    public get itens(): readonly ItemPedido[] {
        return this._itens;
    }


    public adicionarItem(item: ItemPedido): boolean {
        if (this._situacao !== "Aberto") {
            return false;
        }


        this._itens.push(item);
        return true;
    }


    public removerProduto(produto: Produto): boolean {
        if (this._situacao !== "Aberto") {
            return false;
        }


        const item = this._itens.find(
            item => item.produto === produto
        );


        if (!item) {
            return false;
        }


        this._itens.splice(
            this._itens.indexOf(item),
            1
        );


        return true;
    }


    public alterarQuantidade(
        produto: Produto,
        quantidade: number
    ): boolean {
        if (this._situacao !== "Aberto") {
            return false;
        }


        const item = this._itens.find(
            item => item.produto === produto
        );


        if (!item) {
            return false;
        }


        return item.alterarQuantidade(quantidade);
    }


    public finalizar(): boolean {
        if (this._situacao !== "Aberto") {
            return false;
        }


        this._situacao = "Finalizado";
        return true;
    }


    public cancelar(): boolean {
        if (this._situacao !== "Aberto") {
            return false;
        }


        this._situacao = "Cancelado";
        return true;
    }


    public calcularTotal(): number {
        return this._itens.reduce(
            (total, item) => total + item.calcularSubtotal(),
            0
        );
    }
}
