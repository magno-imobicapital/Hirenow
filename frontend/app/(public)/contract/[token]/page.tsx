import Link from "next/link";
import { api } from "@/lib/api";
import ContractActions from "./_components/contract-actions";

type ContractData = {
  id: string;
  status: string;
  contractSignedAt: string | null;
  user: {
    email: string;
    profile: { fullName: string | null } | null;
  };
  position: {
    title: string;
    employmentType: string;
    location: string;
    salaryMin: string | number;
    salaryMax: string | number;
    currency: string;
  };
};

function formatSalary(value: string | number) {
  const n = typeof value === "string" ? Number(value) : value;
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  }).format(n);
}

export default async function ContractPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  const res = await api<ContractData>(`/contract/${token}`);

  if (!res.ok) {
    return (
      <div className="min-h-dvh bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-secondary mb-4">Contrato não encontrado.</p>
          <Link href="/" className="text-primary hover:underline">
            Voltar para o início
          </Link>
        </div>
      </div>
    );
  }

  const contract = res.data;
  const candidateName =
    contract.user.profile?.fullName ?? contract.user.email;
  const alreadySigned = Boolean(contract.contractSignedAt);
  const withdrawn = contract.status === "WITHDRAWN";

  return (
    <div className="min-h-dvh bg-background">
      <header className="border-b border-border">
        <div className="max-w-3xl mx-auto px-6 py-5">
          <img src="/images/logo.png" alt="Hireme" className="h-6 w-auto" />
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-12 flex flex-col gap-8">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary">
            Proposta de Contratação
          </span>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-secondary-dark sm:text-4xl">
            {contract.position.title}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Para {candidateName}
          </p>
        </div>

        <article className="rounded-xl border border-border bg-primary/5 p-8 flex flex-col gap-6 text-sm text-secondary">
          <section>
            <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
              Dados do Contratado
            </h2>
            <p>
              <strong>Nome:</strong> {candidateName}
            </p>
            <p>
              <strong>E-mail:</strong> {contract.user.email}
            </p>
          </section>

          <section>
            <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
              Dados da Vaga
            </h2>
            <p>
              <strong>Cargo:</strong> {contract.position.title}
            </p>
            <p>
              <strong>Regime:</strong> {contract.position.employmentType}
            </p>
            <p>
              <strong>Localização:</strong> {contract.position.location}
            </p>
            <p>
              <strong>Faixa salarial:</strong>{" "}
              {formatSalary(contract.position.salaryMin)} –{" "}
              {formatSalary(contract.position.salaryMax)}
            </p>
          </section>

          <section>
            <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
              Cláusulas
            </h2>
            <p>
              1. O presente contrato tem por objeto a prestação de serviços
              profissionais na função acima descrita.
            </p>
            <p>
              2. O contratado declara estar ciente das políticas internas da
              empresa.
            </p>
            <p className="text-xs text-muted-foreground italic mt-4">
              Este documento é uma simulação para fins de MVP e não possui
              validade jurídica.
            </p>
          </section>
        </article>

        {alreadySigned ? (
          <div className="rounded-xl border border-green-200 bg-green-50 p-8 text-center">
            <h2 className="text-xl font-bold text-green-800">
              Contrato assinado
            </h2>
            <p className="mt-2 text-sm text-green-700">
              Este contrato já foi aceito em{" "}
              {new Date(contract.contractSignedAt!).toLocaleDateString("pt-BR")}
              .
            </p>
          </div>
        ) : withdrawn ? (
          <div className="rounded-xl border border-red-200 bg-red-50 p-8 text-center">
            <h2 className="text-xl font-bold text-red-800">
              Candidatura cancelada
            </h2>
            <p className="mt-2 text-sm text-red-700">
              O candidato desistiu desta vaga.
            </p>
          </div>
        ) : (
          <ContractActions
            token={token}
            positionTitle={contract.position.title}
          />
        )}
      </main>
    </div>
  );
}
