-- AddForeignKey
ALTER TABLE "tve_saidas_retornos" ADD CONSTRAINT "tve_saidas_retornos_empresa_id_fkey" FOREIGN KEY ("empresa_id") REFERENCES "tba_empresas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tve_saidas_retornos" ADD CONSTRAINT "tve_saidas_retornos_solicitante_id_fkey" FOREIGN KEY ("solicitante_id") REFERENCES "tba_usuarios_sistema"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tve_saidas_retornos" ADD CONSTRAINT "tve_saidas_retornos_cidade_destino_id_fkey" FOREIGN KEY ("cidade_destino_id") REFERENCES "tsi_cidades"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tve_saidas_retornos" ADD CONSTRAINT "tve_saidas_retornos_autorizador_id_fkey" FOREIGN KEY ("autorizador_id") REFERENCES "tba_usuarios_sistema"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tve_saidas_retornos" ADD CONSTRAINT "tve_saidas_retornos_porteiro_saida_id_fkey" FOREIGN KEY ("porteiro_saida_id") REFERENCES "tba_usuarios_sistema"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tve_saidas_retornos" ADD CONSTRAINT "tve_saidas_retornos_porteiro_retorno_id_fkey" FOREIGN KEY ("porteiro_retorno_id") REFERENCES "tba_usuarios_sistema"("id") ON DELETE SET NULL ON UPDATE CASCADE;
