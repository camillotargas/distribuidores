/*
  Warnings:

  - You are about to drop the `tve_modelos` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."tve_modelos" DROP CONSTRAINT "tve_modelos_cliente_sistema_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."tve_modelos" DROP CONSTRAINT "tve_modelos_marca_id_fkey";

-- DropTable
DROP TABLE "public"."tve_modelos";

-- CreateTable
CREATE TABLE "tve_marcas_modelos" (
    "id" SERIAL NOT NULL,
    "cliente_sistema_id" INTEGER NOT NULL,
    "marca_id" INTEGER NOT NULL,
    "nome" TEXT NOT NULL,
    "status" TEXT NOT NULL,

    CONSTRAINT "tve_marcas_modelos_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "tve_marcas_modelos" ADD CONSTRAINT "tve_marcas_modelos_cliente_sistema_id_fkey" FOREIGN KEY ("cliente_sistema_id") REFERENCES "tsi_clientes_sistema"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tve_marcas_modelos" ADD CONSTRAINT "tve_marcas_modelos_marca_id_fkey" FOREIGN KEY ("marca_id") REFERENCES "tve_marcas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
