import { Produto } from "../entities/Produto.js";

export class ProdutoRepository {
    private produtos: Produto[] = [];


    public salvar(produto: Produto): boolean {
        const existe = this.produtos.some(
            p => p.id === produto.id
        );

        if (existe) {
            return false;
        }

        this.produtos.push(produto);
        return true;
    }

    public buscarPorId(id: number): Produto | undefined {
        return this.produtos.find(
            p => p.id === id
        );
    }

    public listarTodos(): Produto[] {
        return this.produtos;
    }
}