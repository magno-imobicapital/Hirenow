"use client";

import PageHeader from "@/components/page-header";
import PageStatistics from "@/components/page-statistics";
import PositionCard from "./_components/position-card";

export default function RecruiterPositions() {
  return (
    <div>
      <PageHeader
        pageName="Painel do Recrutador"
        pageTitle="Suas Vagas"
        pageDescription="Gerencie posições abertas, acompanhe o pipeline de candidatos e mantenha tudo em movimento."
        actionButton={{
          label: "+ Nova vaga",
          onClick: () => alert("Hello World!"),
        }}
      />
      <PageStatistics
        statistics={[
          { label: "Vagas abertas", value: 2 },
          { label: "Total de candidatos", value: 151 },
          { label: "Novos esta semana", value: "+10", highlight: true },
        ]}
      />
      <div className="max-w-[1500px] px-12 lg:px-16 mx-auto mt-8">
        <PositionCard
          title="Desenvolvedor(a) Front-end Sênior"
          location="Remoto • Brasil"
          contractType="CLT"
          candidatesCount={42}
          newCandidatesCount={7}
          status="open"
          publishedAt="12 mar 2026"
          onViewPipeline={() => alert("Ver pipeline")}
          onEdit={() => alert("Editar")}
          onMore={() => alert("Mais opções")}
        />
      </div>
    </div>
  );
}
