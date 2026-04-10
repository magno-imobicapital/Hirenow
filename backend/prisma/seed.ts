import 'dotenv/config';
import * as argon2 from 'argon2';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../libs/shared/src/database/generated';

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

async function main() {
  const passwordHash = await argon2.hash('Senha@123');

  // ── Usuários ──

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

  const lucas = await prisma.user.upsert({
    where: { email: 'lucas@hireme.dev' },
    update: {},
    create: {
      email: 'lucas@hireme.dev',
      password: passwordHash,
      role: 'CANDIDATE',
    },
  });

  const magno = await prisma.user.upsert({
    where: { email: 'magnodbf962@gmail.com' },
    update: {},
    create: {
      email: 'magnodbf962@gmail.com',
      password: passwordHash,
      role: 'CANDIDATE',
    },
  });

  const dhomini = await prisma.user.upsert({
    where: { email: 'dhomini@hireme.dev' },
    update: {},
    create: {
      email: 'dhomini@hireme.dev',
      password: passwordHash,
      role: 'CANDIDATE',
    },
  });

  const renato = await prisma.user.upsert({
    where: { email: 'renato@hireme.dev' },
    update: {},
    create: {
      email: 'renato@hireme.dev',
      password: passwordHash,
      role: 'CANDIDATE',
    },
  });

  const gabriel = await prisma.user.upsert({
    where: { email: 'gabriel@hireme.dev' },
    update: {},
    create: {
      email: 'gabriel@hireme.dev',
      password: passwordHash,
      role: 'CANDIDATE',
    },
  });

  console.log(`✔ admin: ${admin.email}`);
  console.log(`✔ recrutador: ${recruiter.email}`);
  console.log(`✔ candidatos: lucas, magno, dhomini, renato, gabriel`);

  // ── Perfis dos candidatos ──

  const profiles = [
    {
      userId: lucas.id,
      fullName: 'Lucas Cezario',
      birthDate: new Date('2000-06-15'),
      about: 'Formado em segurança da informação',
      salaryExpectation: 10000,
      resumeUrl: 'https://oaok6yzuahtrgi7e.public.blob.vercel-storage.com/resumes/0fc37847-4471-4cd7-96ae-f35e552b422e.pdf',
    },
    {
      userId: magno.id,
      fullName: 'Magno Durães',
      birthDate: new Date('2003-12-22'),
      about: 'Desenvolvedor de software Fullstack e RPA',
      mobilePhone: '21964305598',
      salaryExpectation: 12000,
      resumeUrl: 'https://oaok6yzuahtrgi7e.public.blob.vercel-storage.com/resumes/6df30bdc-753b-49d7-8410-9b54fb8f2c2d.pdf',
    },
    {
      userId: dhomini.id,
      fullName: 'Dhomini Pereira',
      birthDate: new Date('2001-12-10'),
      about: 'Desenvolvedor Fullstack',
      salaryExpectation: 17000,
      resumeUrl: 'https://oaok6yzuahtrgi7e.public.blob.vercel-storage.com/resumes/65c5a32c-e8c9-4f61-afaa-d3d3be19b7bb.pdf',
    },
    {
      userId: renato.id,
      fullName: 'Renato Carvalho',
      birthDate: new Date('2003-12-05'),
      about: 'Analista de dados',
      salaryExpectation: 4500,
      resumeUrl: 'https://oaok6yzuahtrgi7e.public.blob.vercel-storage.com/resumes/f6607d82-8454-45c3-8583-ea1dfec3343b.pdf',
    },
    {
      userId: gabriel.id,
      fullName: 'Gabriel Santos',
      birthDate: new Date('2003-12-12'),
      about: 'Estagiário em análise de dados',
      salaryExpectation: 3000,
      resumeUrl: 'https://oaok6yzuahtrgi7e.public.blob.vercel-storage.com/resumes/3d6bad44-ea94-4baa-8ef7-b24e8b0ca640.pdf',
    },
  ];

  for (const p of profiles) {
    await prisma.candidateProfile.upsert({
      where: { userId: p.userId },
      update: {},
      create: p,
    });
  }

  console.log(`✔ ${profiles.length} perfis criados`);

  // ── Vagas ──

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

  const createdPositions: { id: string; title: string }[] = [];
  for (const p of positions) {
    const existing = await prisma.position.findFirst({
      where: { title: p.title },
    });
    if (existing) {
      createdPositions.push(existing);
      continue;
    }
    const created = await prisma.position.create({
      data: {
        ...p,
        isActive: true,
        createdById: recruiter.id,
      },
    });
    createdPositions.push(created);
  }

  console.log(`✔ ${createdPositions.length} vagas`);

  // ── Candidaturas (todos os candidatos em todas as vagas) ──

  const candidates = [lucas, magno, dhomini, renato, gabriel];

  let appCount = 0;
  for (const position of createdPositions) {
    for (const candidate of candidates) {
      const existing = await prisma.application.findUnique({
        where: {
          userId_positionId: {
            userId: candidate.id,
            positionId: position.id,
          },
        },
      });
      if (existing) continue;
      await prisma.application.create({
        data: {
          userId: candidate.id,
          positionId: position.id,
        },
      });
      appCount++;
    }
  }

  console.log(`✔ ${appCount} candidaturas criadas`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
