PedidoRepository.ts:
import { Pedido } from "../entities/Pedido.js";


export class PedidoRepository {
    private pedidos: Pedido[] = [];
    private proximoNumero = 1;


    public gerarNumero(): number {
        const numero = this.proximoNumero;
        this.proximoNumero++;


        return numero;
    }


    public salvar(pedido: Pedido): void {
        this.pedidos.push(pedido);
    }


    public buscarPorNumero(
        numero: number
    ): Pedido | undefined {
        return this.pedidos.find(
            pedido => pedido.numero === numero
        );
    }


    public listarTodos(): Pedido[] {
        return this.pedidos;
    }
}
