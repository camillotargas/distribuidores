/*
  Warnings:

  - You are about to drop the column `cliente_sistema_id` on the `tve_marcas_modelos` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."tve_marcas_modelos" DROP CONSTRAINT "tve_marcas_modelos_cliente_sistema_id_fkey";

-- AlterTable
ALTER TABLE "tve_marcas_modelos" DROP COLUMN "cliente_sistema_id",
ADD COLUMN     "tsiClienteSistemaId" INTEGER;

-- AddForeignKey
ALTER TABLE "tve_marcas_modelos" ADD CONSTRAINT "tve_marcas_modelos_tsiClienteSistemaId_fkey" FOREIGN KEY ("tsiClienteSistemaId") REFERENCES "tsi_clientes_sistema"("id") ON DELETE SET NULL ON UPDATE CASCADE;
