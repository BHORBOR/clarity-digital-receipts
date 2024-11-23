import {
    Clarinet,
    Tx,
    Chain,
    Account,
    types
} from 'https://deno.land/x/clarinet@v1.0.0/index.ts';
import { assertEquals } from 'https://deno.land/std@0.90.0/testing/asserts.ts';

Clarinet.test({
    name: "Allows users to store and retrieve receipts",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const wallet1 = accounts.get('wallet_1')!;
        
        let block = chain.mineBlock([
            Tx.contractCall('receipt-vault', 'store-receipt', [
                types.ascii("Test Merchant"),
                types.uint(100),
                types.uint(1234567890),
                types.ascii("Test Purchase")
            ], wallet1.address)
        ]);
        
        block.receipts[0].result.expectOk().expectUint(1);
        
        let getReceiptBlock = chain.mineBlock([
            Tx.contractCall('receipt-vault', 'get-receipt', [
                types.uint(1)
            ], wallet1.address)
        ]);
        
        getReceiptBlock.receipts[0].result.expectOk();
    }
});

Clarinet.test({
    name: "Only receipt owner can view their receipt",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const wallet1 = accounts.get('wallet_1')!;
        const wallet2 = accounts.get('wallet_2')!;
        
        let block = chain.mineBlock([
            Tx.contractCall('receipt-vault', 'store-receipt', [
                types.ascii("Test Merchant"),
                types.uint(100),
                types.uint(1234567890),
                types.ascii("Test Purchase")
            ], wallet1.address)
        ]);
        
        let getReceiptBlock = chain.mineBlock([
            Tx.contractCall('receipt-vault', 'get-receipt', [
                types.uint(1)
            ], wallet2.address)
        ]);
        
        getReceiptBlock.receipts[0].result.expectErr().expectUint(101);
    }
});

Clarinet.test({
    name: "Allows users to delete their receipts",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const wallet1 = accounts.get('wallet_1')!;
        
        chain.mineBlock([
            Tx.contractCall('receipt-vault', 'store-receipt', [
                types.ascii("Test Merchant"),
                types.uint(100),
                types.uint(1234567890),
                types.ascii("Test Purchase")
            ], wallet1.address)
        ]);
        
        let deleteBlock = chain.mineBlock([
            Tx.contractCall('receipt-vault', 'delete-receipt', [
                types.uint(1)
            ], wallet1.address)
        ]);
        
        deleteBlock.receipts[0].result.expectOk().expectBool(true);
        
        let getReceiptBlock = chain.mineBlock([
            Tx.contractCall('receipt-vault', 'get-receipt', [
                types.uint(1)
            ], wallet1.address)
        ]);
        
        getReceiptBlock.receipts[0].result.expectErr().expectUint(102);
    }
});
