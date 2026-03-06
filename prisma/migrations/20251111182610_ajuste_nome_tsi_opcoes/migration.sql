/*
  Warnings:

  - You are about to drop the `tsi_modulos_opcoes` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."tsi_modulos_opcoes" DROP CONSTRAINT "tsi_modulos_opcoes_modulo_id_fkey";

-- DropTable
DROP TABLE "public"."tsi_modulos_opcoes";

-- CreateTable
CREATE TABLE "tsi_opcoes" (
    "id" SERIAL NOT NULL,
    "modulo_id" INTEGER NOT NULL,
    "nome" TEXT NOT NULL,
    "recurso" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "status" TEXT NOT NULL,

    CONSTRAINT "tsi_opcoes_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "tsi_opcoes" ADD CONSTRAINT "tsi_opcoes_modulo_id_fkey" FOREIGN KEY ("modulo_id") REFERENCES "tsi_modulos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
