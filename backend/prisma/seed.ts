import 'dotenv/config';
import * as argon2 from 'argon2';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../libs/shared/src/database/generated';

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

async function main() {
  const passwordHash = await argon2.hash('Senha@123');

  const admin = await prisma.user.upsert({
    where: { email: 'admin@hireme.dev' },
    update: {},
    create: {
      email: 'admin@hireme.dev',
      password: passwordHash,
      role: 'ADMIN',
    },
  });

  const recruiter = await prisma.user.upsert({
    where: { email: 'recrutador@hireme.dev' },
    update: {},
    create: {
      email: 'recrutador@hireme.dev',
      password: passwordHash,
      role: 'RECRUITER',
    },
  });

  console.log(`✔ admin: ${admin.email}`);
  console.log(`✔ recrutador: ${recruiter.email}`);

  const positions = [
    {
      title: 'Desenvolvedor(a) Full Stack Pleno',
      description:
        'Buscamos uma pessoa Full Stack para atuar com Node.js, React e Postgres em um time ágil de produto. Você participará desde a concepção até o deploy de novas funcionalidades.',
      employmentType: 'CLT' as const,
      location: 'Remoto',
      salaryMin: 8000,
      salaryMax: 12000,
      currency: 'BRL' as const,
    },
    {
      title: 'Engenheiro(a) de Software Backend Sênior',
      description:
        'Vaga para liderar tecnicamente o desenvolvimento de APIs em NestJS, com forte ênfase em performance, observabilidade e arquitetura orientada a domínio.',
      employmentType: 'CLT' as const,
      location: 'São Paulo, SP (Híbrido)',
      salaryMin: 14000,
      salaryMax: 18000,
      currency: 'BRL' as const,
    },
    {
      title: 'Desenvolvedor(a) Frontend Júnior',
      description:
        'Oportunidade para desenvolver interfaces modernas com Next.js e TailwindCSS. Ideal pra quem busca aprender em um time experiente.',
      employmentType: 'CLT' as const,
      location: 'Belo Horizonte, MG',
      salaryMin: 4000,
      salaryMax: 6000,
      currency: 'BRL' as const,
    },
    {
      title: 'DevOps Engineer',
      description:
        'Procuramos profissional para atuar com Kubernetes, Terraform e pipelines CI/CD. Experiência com AWS é diferencial.',
      employmentType: 'PJ' as const,
      location: 'Remoto',
      salaryMin: 13000,
      salaryMax: 17000,
      currency: 'BRL' as const,
    },
    {
      title: 'Estágio em Desenvolvimento Web',
      description:
        'Programa de estágio com duração de 12 meses. Você atuará em squads de produto e terá mentoria semanal com devs sênior.',
      employmentType: 'INTERNSHIP' as const,
      location: 'Curitiba, PR',
      salaryMin: 2000,
      salaryMax: 2500,
      currency: 'BRL' as const,
    },
    {
      title: 'Tech Lead Mobile (React Native)',
      description:
        'Liderança técnica do app principal da empresa. Necessária experiência sólida com React Native, arquitetura mobile e mentoria de time.',
      employmentType: 'CLT' as const,
      location: 'Remoto',
      salaryMin: 16000,
      salaryMax: 22000,
      currency: 'BRL' as const,
    },
    {
      title: 'Designer de Produto (UX/UI)',
      description:
        'Buscamos designer com foco em produto SaaS. Você trabalhará junto com PMs e engenheiros para entregar experiências de qualidade.',
      employmentType: 'CLT' as const,
      location: 'Florianópolis, SC (Híbrido)',
      salaryMin: 9000,
      salaryMax: 13000,
      currency: 'BRL' as const,
    },
    {
      title: 'Data Engineer Pleno',
      description:
        'Construção e manutenção de pipelines de dados em Airflow, dbt e Snowflake. Forte conhecimento de SQL é obrigatório.',
      employmentType: 'CLT' as const,
      location: 'Remoto',
      salaryMin: 11000,
      salaryMax: 15000,
      currency: 'BRL' as const,
    },
    {
      title: 'QA Engineer (Automação)',
      description:
        'Atuação em automação de testes E2E com Playwright e integração no pipeline CI. Cultura de qualidade é parte do nosso DNA.',
      employmentType: 'CLT' as const,
      location: 'Recife, PE',
      salaryMin: 7000,
      salaryMax: 10000,
      currency: 'BRL' as const,
    },
    {
      title: 'Product Manager Sênior',
      description:
        'Responsável por priorização, roadmap e descoberta contínua junto a stakeholders e times de engenharia.',
      employmentType: 'CLT' as const,
      location: 'São Paulo, SP',
      salaryMin: 18000,
      salaryMax: 24000,
      currency: 'BRL' as const,
    },
  ];

  for (const p of positions) {
    await prisma.position.create({
      data: {
        ...p,
        isActive: true,
        createdById: recruiter.id,
      },
    });
  }

  console.log(`✔ ${positions.length} vagas criadas`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
