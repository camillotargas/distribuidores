-- AlterTable
ALTER TABLE "tba_usuarios_sistema" ADD COLUMN     "empresa_id" INTEGER;

-- AddForeignKey
ALTER TABLE "tba_usuarios_sistema" ADD CONSTRAINT "tba_usuarios_sistema_empresa_id_fkey" FOREIGN KEY ("empresa_id") REFERENCES "tba_empresas"("id") ON DELETE SET NULL ON UPDATE CASCADE;
