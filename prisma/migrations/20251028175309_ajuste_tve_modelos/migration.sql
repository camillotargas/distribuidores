/*
  Warnings:

  - Added the required column `cliente_sistema_id` to the `tve_modelos` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "tve_modelos" ADD COLUMN     "cliente_sistema_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "tve_modelos" ADD CONSTRAINT "tve_modelos_cliente_sistema_id_fkey" FOREIGN KEY ("cliente_sistema_id") REFERENCES "tsi_clientes_sistema"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
