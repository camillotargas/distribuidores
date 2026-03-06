/*
  Warnings:

  - You are about to drop the `tve_marcas_modelos` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."tve_marcas_modelos" DROP CONSTRAINT "tve_marcas_modelos_marca_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."tve_veiculos" DROP CONSTRAINT "tve_veiculos_modelo_id_fkey";

-- DropTable
DROP TABLE "public"."tve_marcas_modelos";

-- CreateTable
CREATE TABLE "tve_modelos" (
    "id" SERIAL NOT NULL,
    "marca_id" INTEGER NOT NULL,
    "nome" TEXT NOT NULL,
    "status" TEXT NOT NULL,

    CONSTRAINT "tve_modelos_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "tve_modelos" ADD CONSTRAINT "tve_modelos_marca_id_fkey" FOREIGN KEY ("marca_id") REFERENCES "tve_marcas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tve_veiculos" ADD CONSTRAINT "tve_veiculos_modelo_id_fkey" FOREIGN KEY ("modelo_id") REFERENCES "tve_modelos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
