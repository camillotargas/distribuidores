/*
  Warnings:

  - You are about to drop the column `cidade_destino_id` on the `tve_saidas_retornos` table. All the data in the column will be lost.
  - Added the required column `destino_id` to the `tve_saidas_retornos` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."tve_saidas_retornos" DROP CONSTRAINT "tve_saidas_retornos_cidade_destino_id_fkey";

-- AlterTable
ALTER TABLE "tve_saidas_retornos" DROP COLUMN "cidade_destino_id",
ADD COLUMN     "destino_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "tve_saidas_retornos" ADD CONSTRAINT "tve_saidas_retornos_destino_id_fkey" FOREIGN KEY ("destino_id") REFERENCES "tsi_cidades"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
