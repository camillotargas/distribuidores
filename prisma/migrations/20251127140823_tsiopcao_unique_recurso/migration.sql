/*
  Warnings:

  - A unique constraint covering the columns `[recurso]` on the table `tsi_opcoes` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "tsi_opcoes_recurso_key" ON "tsi_opcoes"("recurso");
