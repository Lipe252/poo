import { Produto } from "./Produto.js";


export class ItemPedido {
    private _quantidade: number;


    constructor(
        public readonly produto: Produto,
        quantidade: number
    ) {
        if (quantidade <= 0) {
            throw new Error("A quantidade deve ser maior que zero.");
        }


        this._quantidade = quantidade;
    }


    public get quantidade(): number {
        return this._quantidade;
    }


    public alterarQuantidade(novaQuantidade: number): boolean {
        if (novaQuantidade <= 0) {
            return false;
        }


        this._quantidade = novaQuantidade;
        return true;
    }


    public calcularSubtotal(): number {
        return this.produto.preco * this._quantidade;
    }
}
